import React, { useState } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { UploadCVPage } from './pages/UploadCVPage';
import { CandidatePortalPage } from './pages/CandidatePortalPage';
import { HRDashboardPage } from './pages/HRDashboardPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [navContext, setNavContext] = useState<any>(null);

  const handleNavigate = (tab: string, context?: any) => {
    setCurrentTab(tab);
    setNavContext(context || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-100/60 text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
        {/* Navigation */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => handleNavigate(tab)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentTab === 'jobs' && (
            <JobsPage
              onNavigate={handleNavigate}
              selectedJobIdFromNav={navContext?.selectedJobId}
            />
          )}
          {currentTab === 'upload-cv' && <UploadCVPage onNavigate={handleNavigate} />}
          {currentTab === 'candidate-portal' && (
            <CandidatePortalPage onNavigate={handleNavigate} />
          )}
          {currentTab === 'interviews' && <InterviewsPage onNavigate={handleNavigate} />}
          {currentTab === 'hr-dashboard' && <HRDashboardPage onNavigate={handleNavigate} />}
          {currentTab === 'about' && <AboutPage onNavigate={handleNavigate} />}
          {currentTab === 'contact' && <ContactPage />}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </AuthProvider>
  );
}
