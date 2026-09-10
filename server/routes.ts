import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;
import { db, Job, Candidate, Application } from './db.js';
import { parseCVWithGemini, rankCandidateForJobs, scoreCandidateAgainstJob } from './ai.js';
import {
  sendEmail,
  sendApplicationEmail,
  sendInterviewEmail,
  sendHRNewApplicantAlert,
  getSmtpStatus
} from './email.js';

export const apiRouter = express.Router();

function getUploadDir(): string {
  try {
    const publicDir = path.resolve(process.cwd(), 'public', 'uploads', 'cvs');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.accessSync(publicDir, fs.constants.W_OK);
    return publicDir;
  } catch {
    const tmpDir = path.resolve('/tmp', 'uploads', 'cvs');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return tmpDir;
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDir());
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx' || ext === '.txt' || ext === '.doc') {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  }
});

// --- Health Check ---
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'Talent Filter — AI-Powered HR Recruitment Platform',
    timestamp: new Date().toISOString()
  });
});

// --- Stats for HR Dashboard ---
apiRouter.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to calculate recruitment statistics' });
  }
});

// --- Jobs API ---
apiRouter.get('/jobs', (req: Request, res: Response) => {
  try {
    let jobs = db.getJobs();
    const { search, department, location, type, minExperience } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.required_skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (department && typeof department === 'string' && department !== 'All') {
      jobs = jobs.filter(j => j.department.toLowerCase() === department.toLowerCase());
    }

    if (type && typeof type === 'string' && type !== 'All') {
      jobs = jobs.filter(j => j.employment_type.toLowerCase() === type.toLowerCase());
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

apiRouter.get('/jobs/:id', (req: Request, res: Response) => {
  const job = db.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

apiRouter.post('/jobs', (req: Request, res: Response) => {
  try {
    const {
      title,
      company,
      department,
      location,
      employment_type,
      salary,
      description,
      responsibilities,
      required_skills,
      experience_required,
      min_experience_years,
      education_required,
      deadline,
      status
    } = req.body;

    if (!title || !company || !department) {
      return res.status(400).json({ error: 'Title, company, and department are required' });
    }

    const newJob = db.addJob({
      title,
      company: company || 'Talent Filter Partner',
      department,
      location: location || 'Remote',
      employment_type: employment_type || 'Full-time',
      salary: salary || '$90,000 - $120,000',
      description: description || 'Exciting opportunity to join a fast-growing team.',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : ['Execute core deliverables', 'Collaborate with team'],
      required_skills: Array.isArray(required_skills) ? required_skills : ['Communication', 'Problem Solving'],
      experience_required: experience_required || '2+ years',
      min_experience_years: typeof min_experience_years === 'number' ? min_experience_years : 2,
      education_required: education_required || 'Bachelor\'s degree or equivalent',
      deadline: deadline || '2026-11-30',
      status: status || 'Open'
    });

    res.status(201).json(newJob);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

apiRouter.put('/jobs/:id', (req: Request, res: Response) => {
  const updated = db.updateJob(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(updated);
});

apiRouter.delete('/jobs/:id', (req: Request, res: Response) => {
  const success = db.deleteJob(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({ message: 'Job closed successfully' });
});

// --- CV Upload & AI Parsing (Core Feature) ---
apiRouter.post('/cv/upload', (req: Request, res: Response) => {
  upload.single('cv')(req, res, async (err: any) => {
    if (err) {
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Unable to upload your CV. Please check the file type and try again. (Supported: PDF, DOCX, TXT)' });
      }
      return res.status(400).json({ error: 'Unable to upload your CV. Please check the file type and try again.' });
    }

    try {
      const file = req.file;
      const { fullName, email, phone, desiredProfession, manualCvText } = req.body;

      let extractedText = manualCvText || '';

      if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        try {
          if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const pdfResult = await pdfParse(dataBuffer);
            extractedText = pdfResult.text || '';
          } else if (ext === '.docx' || ext === '.doc') {
            const docxResult = await mammoth.extractRawText({ path: file.path });
            extractedText = docxResult.value || '';
          } else if (ext === '.txt') {
            extractedText = fs.readFileSync(file.path, 'utf-8');
          }
        } catch (parseErr) {
          console.error('Error extracting text from file:', parseErr);
          return res.status(422).json({ error: "We couldn't read this CV. Please upload a clear PDF or DOCX file." });
        }
      }

      if (!extractedText || extractedText.trim().length < 15) {
        if (!fullName || !email) {
          return res.status(400).json({ error: "We couldn't read this CV. Please upload a clear PDF or DOCX file, or fill in candidate details." });
        }
        // Fallback text if user entered manual data
        extractedText = `Candidate: ${fullName}\nEmail: ${email}\nPhone: ${phone || ''}\nProfession: ${desiredProfession || 'Software Developer'}\nExperience: 2 years\nSkills: Python, JavaScript, React, Node.js, SQL`;
      }

      // Step 2: AI Parse with Gemini
      let parsedCV;
      try {
        parsedCV = await parseCVWithGemini(extractedText, file?.originalname);
      } catch (aiErr) {
        console.error('AI analysis error:', aiErr);
        return res.status(500).json({ error: 'Your CV was uploaded, but analysis could not be completed. Please try again.' });
      }

      // Override with user-provided details if entered in upload form
      if (fullName && fullName.trim().length > 1) parsedCV.name = fullName.trim();
      if (email && email.trim().length > 3) parsedCV.email = email.trim();
      if (phone && phone.trim().length > 3) parsedCV.phone = phone.trim();
      if (desiredProfession && desiredProfession.trim().length > 1) parsedCV.profession = desiredProfession.trim();

      // Step 3: Store candidate in database
      const savedCandidate = db.saveCandidate({
        name: parsedCV.name,
        email: parsedCV.email,
        phone: parsedCV.phone,
        profession: parsedCV.profession,
        skills: parsedCV.skills,
        education: parsedCV.education,
        experience: parsedCV.experience,
        experience_years: parsedCV.experience_years,
        certifications: parsedCV.certifications,
        projects: parsedCV.projects,
        summary: parsedCV.summary,
        cv_file: file ? `/uploads/cvs/${path.basename(file.path)}` : undefined,
        cv_filename: file?.originalname || 'Candidate_CV.pdf',
        cv_text: extractedText
      });

      // Step 4: Record candidate activity timeline
      db.logActivity(savedCandidate.id, 'CV uploaded', `Uploaded ${file?.originalname || 'digital CV'} via Talent Filter portal`);
      db.logActivity(savedCandidate.id, 'CV analyzed', `AI extracted ${parsedCV.skills.length} skills and ${parsedCV.experience_years} years experience`);

      // Step 5: Compare against all available jobs & rank recommendations
      const allJobs = db.getJobs();
      const recommendations = rankCandidateForJobs(parsedCV, allJobs);

      if (recommendations.length > 0) {
        db.logActivity(
          savedCandidate.id,
          'Job recommended',
          `Matched with ${recommendations[0].job.title} (${recommendations[0].overallScore}% Talent Filter Match Score)`
        );
      }

      res.status(200).json({
        success: true,
        candidate: savedCandidate,
        parsedData: parsedCV,
        recommendations: recommendations.slice(0, 6)
      });
    } catch (err) {
      console.error('General CV Upload error:', err);
      res.status(500).json({ error: 'Unable to upload your CV. Please check the file type and try again.' });
    }
  });
});

// --- Candidate Recommendations Route ---
apiRouter.get('/candidates/:id/recommendations', (req: Request, res: Response) => {
  const candidate = db.getCandidate(req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const parsedData = {
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    profession: candidate.profession,
    skills: candidate.skills,
    education: candidate.education,
    experience: candidate.experience,
    experience_years: candidate.experience_years,
    certifications: candidate.certifications,
    projects: candidate.projects,
    summary: candidate.summary
  };

  const jobs = db.getJobs();
  const recommendations = rankCandidateForJobs(parsedData, jobs);
  res.json(recommendations);
});

// --- Candidates API ---
apiRouter.get('/candidates', (req: Request, res: Response) => {
  try {
    const candidates = db.getCandidates();
    const applications = db.getApplications();

    // Attach highest match score or application summary
    const enriched = candidates.map(cand => {
      const candApps = applications.filter(a => a.candidate_id === cand.id);
      const topScore = candApps.length > 0
        ? Math.max(...candApps.map(a => a.match_score))
        : 0;
      const latestApp = candApps[0];

      return {
        ...cand,
        applicationsCount: candApps.length,
        topScore,
        latestStatus: latestApp ? latestApp.status : 'New CV'
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

apiRouter.get('/candidates/:id', (req: Request, res: Response) => {
  const candidate = db.getCandidate(req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const applications = db.getCandidateApplications(candidate.id);
  const interviews = db.getCandidateInterviews(candidate.id);
  const activities = db.getActivities(candidate.id);

  res.json({
    candidate,
    applications,
    interviews,
    activities
  });
});

// --- Applications API ---
apiRouter.get('/applications', (req: Request, res: Response) => {
  try {
    const apps = db.getApplications();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

apiRouter.post('/applications', (req: Request, res: Response) => {
  try {
    const { candidate_id, job_id } = req.body;
    if (!candidate_id || !job_id) {
      return res.status(400).json({ error: 'Your application could not be submitted. Please provide candidate and job.' });
    }

    const candidate = db.getCandidate(candidate_id);
    const job = db.getJob(job_id);

    if (!candidate || !job) {
      return res.status(404).json({ error: 'Your application could not be submitted. Candidate or Job does not exist.' });
    }

    // Check if already applied
    const existing = db.findApplication(candidate_id, job_id);
    if (existing) {
      return res.status(200).json({
        message: 'Application already active',
        application: existing
      });
    }

    // Calculate match score
    const match = scoreCandidateAgainstJob(candidate, job);

    const application = db.createApplication({
      candidate_id,
      job_id,
      match_score: match.overallScore,
      skills_score: match.skillsScore,
      experience_score: match.experienceScore,
      education_score: match.educationScore,
      matched_skills: match.matchedSkills,
      missing_skills: match.missingSkills,
      match_reasons: match.matchReasons,
      status: 'Under Review'
    });

    // Log Activity
    db.logActivity(
      candidate_id,
      'Application submitted',
      `Applied for ${job.title} at ${job.company} with ${match.overallScore}% match score`
    );

    // Queue Candidate Email Notification
    db.addNotification({
      candidate_id,
      type: 'application_received',
      channel: 'email',
      recipient: candidate.email,
      subject: `Application Confirmation — ${job.title}`,
      message: `Dear ${candidate.name},\n\nYour application for ${job.title} at ${job.company} has been received. Our HR team has automatically processed your CV (Talent Filter Match Score: ${match.overallScore}%).\n\nBest regards,\nTalent Filter HR Team`,
      status: 'Sent'
    });

    // Dispatch HR Email Notification to kubrakhan585130@gmail.com
    db.addNotification({
      candidate_id,
      type: 'application_received',
      channel: 'email',
      recipient: 'kubrakhan585130@gmail.com',
      subject: `[HR Alert] New Candidate Application: ${candidate.name}`,
      message: `Candidate: ${candidate.name} (${candidate.email})\nPosition: ${job.title} (${job.company})\nTalent Filter Score: ${match.overallScore}%\nStatus: Under Review`,
      status: 'Sent'
    });

    // Send emails via SMTP (kubrakhan585130@gmail.com:587)
    sendApplicationEmail(candidate.name, candidate.email, job.title, job.company, match.overallScore).catch(err =>
      console.warn('Background candidate application email notice:', err)
    );
    sendHRNewApplicantAlert(candidate.name, candidate.email, job.title, match.overallScore, match.matchedSkills).catch(err =>
      console.warn('Background HR alert email notice:', err)
    );

    res.status(201).json({
      success: true,
      application
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ error: 'Your application could not be submitted. Please try again.' });
  }
});

apiRouter.patch('/applications/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = db.updateApplicationStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const app = db.getApplication(req.params.id);
  if (app && app.candidate && app.job) {
    db.logActivity(
      app.candidate_id,
      `Status changed: ${status}`,
      `Application for ${app.job.title} moved to ${status}`
    );

    if (status === 'Shortlisted') {
      db.addNotification({
        candidate_id: app.candidate_id,
        type: 'candidate_shortlisted',
        channel: 'email',
        recipient: app.candidate.email,
        subject: `Shortlisted for ${app.job.title}`,
        message: `Congratulations ${app.candidate.name}!\nYou have been shortlisted for the ${app.job.title} role at ${app.job.company}. Our recruitment team will be scheduling an interview shortly.`,
        status: 'Sent'
      });
    }
  }

  res.json(updated);
});

// --- Interview Scheduling & Invitations ---
apiRouter.get('/interviews', (req: Request, res: Response) => {
  try {
    const interviews = db.getInterviews();
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

apiRouter.post('/interviews/schedule', (req: Request, res: Response) => {
  try {
    const {
      candidate_id,
      job_id,
      interviewer,
      interview_date,
      interview_time,
      interview_type,
      meeting_link,
      instructions
    } = req.body;

    if (!candidate_id || !job_id || !interview_date || !interview_time) {
      return res.status(400).json({ error: 'Candidate, job, date, and time are required' });
    }

    const candidate = db.getCandidate(candidate_id);
    const job = db.getJob(job_id);

    if (!candidate || !job) {
      return res.status(404).json({ error: 'Candidate or Job not found' });
    }

    const interview = db.scheduleInterview({
      candidate_id,
      job_id,
      interviewer: interviewer || 'Recruitment Team Lead',
      interview_date,
      interview_time,
      interview_type: interview_type || 'Online',
      meeting_link: meeting_link || 'https://meet.google.com/talent-filter-room',
      instructions: instructions || 'Please have your portfolio ready and join 5 minutes early.',
      status: 'Scheduled'
    });

    // Activity log
    db.logActivity(
      candidate_id,
      'Interview scheduled',
      `${interview_type || 'Online'} interview scheduled for ${job.title} on ${interview_date} at ${interview_time}`
    );

    // Prepare & send interview invitation notification
    const emailSubject = `Interview Invitation — ${job.title}`;
    const emailBody = `Dear ${candidate.name},

You are invited to an interview for the ${job.title} position at ${job.company}.

Interview Details:
- Date: ${interview_date}
- Time: ${interview_time}
- Type: ${interview_type || 'Online'}
- Interviewer: ${interviewer || 'HR Panel'}
- Meeting Link / Location: ${meeting_link || 'https://meet.google.com/talent-filter-room'}

Additional Instructions:
${instructions || 'Please test your microphone and camera before the meeting.'}

If you have any questions or need to reschedule, reply to this email or reach out to talent@talentfilter.com.

Best regards,
Talent Filter Recruitment Operations`;

    db.addNotification({
      candidate_id,
      type: 'interview_invitation',
      channel: 'email',
      recipient: candidate.email,
      subject: emailSubject,
      message: emailBody,
      status: 'Sent'
    });

    // Also dispatch email notification to HR team
    db.addNotification({
      candidate_id,
      type: 'interview_invitation',
      channel: 'email',
      recipient: 'kubrakhan585130@gmail.com',
      subject: `[HR Calendar] Interview Confirmed: ${candidate.name} — ${job.title}`,
      message: `Interview scheduled on ${interview_date} at ${interview_time} with ${candidate.name} (${interview_type || 'Online'}). Meeting: ${meeting_link || 'Google Meet'}`,
      status: 'Sent'
    });

    // Dispatch real email via SMTP
    sendInterviewEmail(
      candidate.name,
      candidate.email,
      job.title,
      job.company,
      interview_date,
      interview_time,
      meeting_link || 'https://meet.google.com/talent-filter-room',
      interviewer || 'Recruitment Team Lead',
      instructions || 'Please join 5 minutes early.'
    ).catch(err => console.warn('Background interview email notice:', err));

    res.status(201).json({
      success: true,
      interview
    });
  } catch (err) {
    console.error('Error scheduling interview:', err);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

// --- Placements (Mark as Hired / Success Stories) ---
apiRouter.get('/placements', (req: Request, res: Response) => {
  try {
    const placements = db.getPlacements();
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch placements' });
  }
});

apiRouter.post('/candidates/:id/hire', (req: Request, res: Response) => {
  try {
    const candidateId = req.params.id;
    const { job_id, hired_date, announcement } = req.body;

    const candidate = db.getCandidate(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const job = job_id ? db.getJob(job_id) : db.getJobs()[0];
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const dateStr = hired_date || 'Today';
    const finalAnnouncement = announcement || `${candidate.name} was successfully matched with a ${job.title} opportunity through Talent Filter.`;

    const placement = db.recordPlacement({
      candidate_id: candidateId,
      job_id: job.id,
      candidate_name: candidate.name,
      job_title: job.title,
      company: job.company,
      hired_date: dateStr,
      announcement: finalAnnouncement
    });

    db.logActivity(
      candidateId,
      'Candidate hired',
      `Officially hired for ${job.title} at ${job.company}`
    );

    db.addNotification({
      candidate_id: candidateId,
      type: 'candidate_hired',
      channel: 'email',
      recipient: candidate.email,
      subject: `Offer & Placement — ${job.title}`,
      message: `Congratulations ${candidate.name}!\n\nYou have been selected and placed for the ${job.title} position at ${job.company}. Welcome aboard!`,
      status: 'Sent'
    });

    res.json({
      success: true,
      placement
    });
  } catch (err) {
    console.error('Error recording hire:', err);
    res.status(500).json({ error: 'Failed to record candidate hire' });
  }
});

// --- Activity History ---
apiRouter.get('/candidates/:id/activity', (req: Request, res: Response) => {
  const activities = db.getActivities(req.params.id);
  res.json(activities);
});

// --- Notifications ---
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const notifications = db.getNotifications();
  res.json(notifications);
});

// --- SMTP Status & Test Endpoints ---
apiRouter.get('/smtp/status', (req: Request, res: Response) => {
  const status = getSmtpStatus();
  res.json(status);
});

apiRouter.post('/smtp/test', async (req: Request, res: Response) => {
  try {
    const targetEmail = req.body.to || 'kubrakhan585130@gmail.com';
    const result = await sendEmail({
      to: targetEmail,
      subject: 'Talent Filter SMTP Service Verification',
      text: `Talent Filter SMTP Service (Gmail:587) verification test successful!\nTimestamp: ${new Date().toISOString()}`
    });
    res.json({
      success: true,
      message: `Test email dispatched to ${targetEmail}`,
      details: result
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send test email', details: err.message });
  }
});

// --- Contact Form Inquiry Route (Sends to kubrakhan585130@gmail.com) ---
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Send email alert to HR email via SMTP
    await sendEmail({
      to: 'kubrakhan585130@gmail.com',
      subject: `[Talent Filter Inquiry] From ${name} (${email})`,
      text: `Inquiry received via Talent Filter Contact Form:\nName: ${name}\nEmail: ${email}\nMessage:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`
    });

    res.json({ success: true, message: 'Your inquiry has been sent to our recruitment team.' });
  } catch (err: any) {
    console.error('Contact inquiry error:', err);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

// --- Test Seed Reset ---
apiRouter.post('/system/reset-seed', (req: Request, res: Response) => {
  db.resetToSeed();
  res.json({ message: 'Database reset to seed data' });
});
