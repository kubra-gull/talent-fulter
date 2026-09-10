import React, { useState, useRef } from 'react';
import { useAppAuth } from '../components/AuthProvider';
import { ScoreGauge } from '../components/ScoreGauge';
import { Job, Candidate, JobMatchResult } from '../types';
import { apiClient } from '../lib/apiClient';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  User,
  Mail,
  Phone,
  GraduationCap,
  FolderKanban
} from 'lucide-react';

interface UploadCVPageProps {
  onNavigate: (tab: string, context?: any) => void;
}

export const UploadCVPage: React.FC<UploadCVPageProps> = ({ onNavigate }) => {
  const { setActiveCandidateId, setActiveCandidateName } = useAppAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [desiredProfession, setDesiredProfession] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Result states
  const [candidateResult, setCandidateResult] = useState<Candidate | null>(null);
  const [recommendations, setRecommendations] = useState<JobMatchResult[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<{ [jobId: string]: boolean }>({});

  const analysisSteps = [
    { label: 'Uploading CV to Secure Vault', detail: 'Verifying file integrity and MIME type' },
    { label: 'Document Parsing & OCR Extraction', detail: 'Extracting clean structural text from document' },
    { label: 'AI Skills & Experience Extraction', detail: 'Identifying verified tech stack, education, and years of experience' },
    { label: 'Benchmarking Against Active Jobs', detail: 'Evaluating candidate against 14+ open database specifications' },
    { label: 'Calculating Talent Filter Match Scores', detail: 'Computing dimensional scores and ranking top recommendations' }
  ];

  // Preload Ahmad Khan sample CV
  const loadAhmadKhanSample = () => {
    setFullName('Ahmad Khan');
    setEmail('ahmad.khan.dev@example.com');
    setPhone('+1 (555) 438-9021');
    setDesiredProfession('Python Developer');
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf' || ext === 'docx' || ext === 'txt' || ext === 'doc') {
      setSelectedFile(file);
      setErrorMessage(null);
      if (!fullName) {
        // Infer base name without extension
        const base = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        if (!base.toLowerCase().includes('resume') && !base.toLowerCase().includes('cv')) {
          setFullName(base);
        }
      }
    } else {
      setErrorMessage('Unable to upload your CV. Please check the file type and try again. (Supported: PDF, DOCX, TXT)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // If no file and no manual data, notify user
    if (!selectedFile && (!fullName || !email)) {
      setErrorMessage('Please choose a CV file (PDF or DOCX) or click "Load Sample CV (Ahmad Khan)" to test the workflow.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    // Step progression animation ticker
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 600);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 1200);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 1800);
    const timer4 = setTimeout(() => setCurrentStepIndex(4), 2400);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('cv', selectedFile);
      }
      formData.append('fullName', fullName || 'Ahmad Khan');
      formData.append('email', email || 'ahmad.khan.dev@example.com');
      formData.append('phone', phone || '+1 (555) 438-9021');
      formData.append('desiredProfession', desiredProfession || 'Python Developer');

      // If no file is attached, generate Ahmad Khan rich sample CV text
      if (!selectedFile) {
        formData.append(
          'manualCvText',
          `Ahmad Khan
Email: ${email || 'ahmad.khan.dev@example.com'}
Phone: ${phone || '+1 (555) 438-9021'}
Location: New York, NY
Title: Python Developer & Software Engineer

Professional Summary:
Versatile Software Developer with 2+ years of professional engineering experience building high-performance web applications, automated data pipelines, and RESTful APIs in Python, FastAPI, Django, and modern React. Proven track record in PostgreSQL database optimization and cloud containerization with Docker.

Core Skills:
- Programming: Python, JavaScript, TypeScript, SQL, HTML5, CSS3
- Frameworks & Libraries: FastAPI, Django, React, Node.js, Express, Tailwind CSS, Redux
- Databases & Tools: PostgreSQL, SQLite, Redis, Docker, Git, REST APIs, Linux, Jira
- Methodologies: Agile, Scrum, CI/CD, Test-Driven Development (TDD)

Work Experience:
Software Engineer | Apex Cloud Solutions (2024 - Present)
- Designed and deployed high-throughput backend services using FastAPI and PostgreSQL, serving 50k+ daily queries.
- Integrated automated testing pipelines with pytest and GitHub Actions, maintaining 94% test coverage.
- Built responsive administrative dashboards in React and TypeScript.

Junior Developer | FinTech Nexus (2022 - 2024)
- Developed Python automation scripts reducing financial report generation time by 60%.
- Maintained relational database schemas and wrote complex analytical SQL queries.

Education:
Bachelor of Science in Computer Science (BS CS)
New York University, Graduated 2022

Projects:
- Microservices Inventory Engine: Distributed order processing system in Python & Docker.
- Real-time Analytics Visualizer: Interactive telemetry dashboard built with React and FastAPI.`
        );
      }

      const data = await apiClient.uploadCV(formData);

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      setCandidateResult(data.candidate);
      setRecommendations(data.recommendations || []);
      setActiveCandidateId(data.candidate.id);
      setActiveCandidateName(data.candidate.name);

      setSuccessMessage(`CV successfully parsed for ${data.candidate.name}! Top matching opportunities calculated.`);
    } catch (err: any) {
      console.error('Upload CV error:', err);
      setErrorMessage(err.message || 'Unable to upload your CV. Please check the file type and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    if (!candidateResult) return;
    try {
      await apiClient.applyToJob(candidateResult.id, jobId);
      setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
    } catch (err) {
      console.error('Apply error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Core Automated Recruitment Pipeline
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Upload Your CV & Get Filtered Instantly
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Our AI parser analyzes your credentials, scores your skills against active roles, and presents direct recommendations with transparent match scores.
        </p>
      </div>

      {/* Quick Test Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Want to test the full workflow in 1-click?</h3>
            <p className="text-xs text-slate-600">
              Load our pre-configured candidate profile (Ahmad Khan — Python Developer, 2 yrs exp).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadAhmadKhanSample}
          className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 shadow-sm transition active:scale-95"
        >
          Load Sample CV (Ahmad Khan)
        </button>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Drag and drop zone */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Curriculum Vitae / Resume File (PDF, DOCX, or TXT)
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/50'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">{selectedFile.name}</div>
                <div className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Ready for AI analysis
                </div>
                <span className="inline-block text-xs font-semibold text-blue-600 hover:underline">
                  Click to replace file
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="text-base font-bold text-slate-800">
                  Drag and drop your CV file here
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Supports PDF or Word DOCX format. Max size 10MB. We'll automatically parse your work experience and skills.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                    Browse Local File
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Detail Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ahmad Khan"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ahmad.khan@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 438-9021"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Desired Profession / Job Title
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={desiredProfession}
                onChange={(e) => setDesiredProfession(e.target.value)}
                placeholder="e.g. Python Developer"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">Processing Error</strong>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Encrypted & processed using Google Gemini 2.5 Intelligence.
          </span>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white shadow-md shadow-blue-600/30 transition active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing CV...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Parse & Score My CV
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progress Animation State Box */}
      {isAnalyzing && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 space-y-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Screening Pipeline Running</h3>
                <p className="text-xs text-slate-400">Processing document content & matching with enterprise jobs</p>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-400 font-bold">
              Step {currentStepIndex + 1} of {analysisSteps.length}
            </span>
          </div>

          <div className="space-y-3">
            {analysisSteps.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl border transition ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : isCurrent
                      ? 'bg-blue-950/60 border-blue-700 text-blue-200 shadow-md shadow-blue-900/40'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold">{step.label}</div>
                      <div className="text-[11px] opacity-75">{step.detail}</div>
                    </div>
                  </div>

                  {isDone && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 animate-pulse">
                      In Progress...
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results View (Appears once parsing is completed) */}
      {candidateResult && !isAnalyzing && (
        <div className="space-y-8 pt-4">
          {/* Success Notification Bar */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Analysis Complete</h4>
                  <p className="text-xs text-emerald-700">{successMessage}</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('candidate-portal')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
              >
                Go to Candidate Portal
              </button>
            </div>
          )}

          {/* Candidate Extracted Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-md">
                  {candidateResult.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{candidateResult.name}</h2>
                  <p className="text-sm font-semibold text-blue-600">{candidateResult.profession}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {candidateResult.email}
                </span>
                <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {candidateResult.phone}
                </span>
              </div>
            </div>

            {/* Extracted Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Verified Skills */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Verified Technical & Professional Skills ({candidateResult.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {candidateResult.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {candidateResult.summary && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Professional Executive Summary
                    </h3>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {candidateResult.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Education & Experience Details */}
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Experience Level
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    {candidateResult.experience}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Education
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    {candidateResult.education}
                  </div>
                </div>

                {candidateResult.certifications && candidateResult.certifications.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Certifications
                    </span>
                    <ul className="text-xs text-slate-700 mt-1 space-y-1">
                      {candidateResult.certifications.map((c, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Recommendations & Scores */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Automated Match Results
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                  Recommended Opportunities for {candidateResult.name}
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Ranked by Talent Filter Match Score
              </span>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => {
                const isApplied = appliedJobs[rec.job.id];

                return (
                  <div
                    key={rec.job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-300 transition group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {rec.job.department}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                            {rec.job.salary}
                          </span>
                          <span className="text-xs text-slate-400">
                            Deadline: {rec.job.deadline}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {rec.job.title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {rec.job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {rec.job.location}
                          </span>
                          <span>{rec.job.employment_type}</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                          {rec.job.description}
                        </p>
                      </div>

                      {/* Score Gauge Component */}
                      <div className="lg:w-72 shrink-0">
                        <ScoreGauge
                          score={rec.overallScore}
                          skillsScore={rec.skillsScore}
                          experienceScore={rec.experienceScore}
                          educationScore={rec.educationScore}
                          matchedSkills={rec.matchedSkills}
                          missingSkills={rec.missingSkills}
                          reasons={rec.matchReasons}
                          showDetails={true}
                        />
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {rec.matchedSkills.length} of {rec.job.required_skills.length} skills matched
                      </span>

                      {isApplied ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          Application Submitted (Under Review)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApplyToJob(rec.job.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition active:scale-95"
                        >
                          Apply With Analyzed CV <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
