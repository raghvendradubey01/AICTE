'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  X,
  Plus,
  Compass,
  MessageSquare,
  Github,
  Linkedin,
  Globe,
  Award,
  Filter,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { StudentProfile, StudentYear, Branch, Residence } from '@/types';
import { COLLEGE_CONFIG } from '@/lib/supabase';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    students,
    currentUser,
    registerNewStudent,
    requestMentorshipSession,
    showToast,
  } = useCampus();

  const initialYear = searchParams.get('year') as StudentYear | null;
  const initialStudentId = searchParams.get('student');

  const [selectedYear, setSelectedYear] = useState<string>(initialYear || 'All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedResidence, setSelectedResidence] = useState<string>('All');
  const [onlyMentors, setOnlyMentors] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    initialStudentId ? students.find((s) => s.id === initialStudentId) || null : null
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);

  // New Student Verification Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regYear, setRegYear] = useState<StudentYear>('1st Year');
  const [regBranch, setRegBranch] = useState<Branch>('CSE');
  const [regResidence, setRegResidence] = useState<Residence>('Hostel');
  const [regHeadline, setRegHeadline] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regSkills, setRegSkills] = useState('React, Python, Git');
  const [regIsMentor, setRegIsMentor] = useState(false);
  const [regEmailError, setRegEmailError] = useState('');

  // Mentorship request state
  const [mentorshipTopic, setMentorshipTopic] = useState('Resume Review');
  const [mentorshipMessage, setMentorshipMessage] = useState('');

  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical', 'Biotech', 'Design'];
  const years: StudentYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedYear !== 'All' && s.year !== selectedYear) return false;
      if (selectedBranch !== 'All' && s.branch !== selectedBranch) return false;
      if (selectedResidence !== 'All' && s.residence !== selectedResidence) return false;
      if (onlyMentors && !s.isMentor) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesHeadline = s.headline.toLowerCase().includes(q);
        const matchesSkill = s.skills.some((sk) => sk.toLowerCase().includes(q));
        if (!matchesName && !matchesHeadline && !matchesSkill) return false;
      }
      return true;
    });
  }, [students, selectedYear, selectedBranch, selectedResidence, onlyMentors, searchQuery]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegEmailError('');

    const emailLower = regEmail.toLowerCase().trim();
    const isValidDomain = COLLEGE_CONFIG.allowedDomains.some((d) => emailLower.endsWith(d.trim()));

    if (!isValidDomain) {
      setRegEmailError(`Institutional email required! Must end in ${COLLEGE_CONFIG.allowedDomains.join(' or ')}`);
      return;
    }

    const yearLabelMap = {
      '1st Year': 'Fresher',
      '2nd Year': 'Sophomore',
      '3rd Year': 'Pre-Final',
      '4th Year': 'Final Year',
    } as const;

    const newProfile = registerNewStudent({
      name: regName.trim(),
      email: emailLower,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      year: regYear,
      yearLabel: yearLabelMap[regYear],
      branch: regBranch,
      residence: regResidence,
      headline: regHeadline.trim() || `${regYear} ${regBranch} Student`,
      bio: regBio.trim() || `Excited to connect with peers and mentors on CampusConnect.`,
      skills: regSkills.split(',').map((s) => s.trim()).filter(Boolean),
      clubs: ['Turing Coding Club'],
      isMentor: regIsMentor,
      mentorTopics: regIsMentor ? ['Academics', 'Career Advice'] : [],
    });

    setIsOnboardingOpen(false);
    setSelectedStudent(newProfile);
  };

  return (
    <div className="space-y-3">
      
      {/* 1. LinkedIn Network Header Card */}
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <h1 className="font-bold text-base sm:text-lg text-foreground">
            My College Network ({students.length})
          </h1>
          <p className="text-xs text-muted-foreground">
            {COLLEGE_CONFIG.name} • 1st, 2nd, 3rd & 4th Year verified student network
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#0a66c2] text-[#0a66c2] dark:text-[#70b5f9] hover:bg-[#0a66c2]/10 px-4 py-1.5 text-xs font-bold transition-colors shrink-0"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Verify Institutional ID</span>
        </button>
      </div>

      {/* 2. LinkedIn-style Multi-Filter Bar */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-xs space-y-2.5 text-left">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skill (Next.js, Verilog, Python), or branch..."
            className="w-full rounded-md border border-border bg-muted/40 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60 text-xs">
          {/* Year pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', '1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  selectedYear === yr
                    ? 'bg-[#0a66c2] text-white'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Department Select */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-foreground focus:outline-none"
          >
            <option value="All">All Branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Residence Select */}
          <select
            value={selectedResidence}
            onChange={(e) => setSelectedResidence(e.target.value)}
            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-foreground focus:outline-none"
          >
            <option value="All">All Residences</option>
            <option value="Hostel">Hostelers</option>
            <option value="Day Scholar">Day Scholars</option>
          </select>

          {/* Mentor Toggle */}
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={onlyMentors}
              onChange={(e) => setOnlyMentors(e.target.checked)}
              className="rounded border-border text-[#0a66c2] h-3.5 w-3.5"
            />
            <span className="text-[#0a66c2] dark:text-[#70b5f9]">Open to Mentor</span>
          </label>
        </div>
      </div>

      {/* 3. LinkedIn "People You May Know" Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredStudents.map((student) => {
          const isCurrentUser = student.id === currentUser.id;

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="rounded-lg border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between text-center relative"
            >
              {/* Cover Banner */}
              <div className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900" />

              {/* Overlapping Avatar */}
              <div className="relative -mt-9 flex justify-center">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-card shadow-sm"
                />
                {student.isMentor && (
                  <span
                    title="Verified Senior Mentor"
                    className="absolute bottom-0 right-[calc(50%-32px)] flex h-4 w-4 items-center justify-center rounded-full bg-[#0a66c2] text-[9px] text-white ring-1 ring-card"
                  >
                    ★
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 pt-1.5 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-xs sm:text-sm text-foreground hover:underline">
                    {student.name}
                  </span>
                  <CheckCircle2 className="h-3 w-3 text-[#0a66c2] shrink-0" />
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight min-h-[26px]">
                  {student.headline}
                </p>

                <div className="text-[10px] font-semibold text-[#0a66c2] dark:text-[#70b5f9]">
                  {student.year} • {student.branch}
                </div>

                <p className="text-[10px] text-muted-foreground pt-1">
                  🏆 {student.karmaPoints} karma • {student.residence}
                </p>

                {/* Skills tags snippet */}
                <div className="flex flex-wrap justify-center gap-1 pt-1.5">
                  {student.skills.slice(0, 3).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect Action Button */}
              <div className="p-3 pt-0">
                {isCurrentUser ? (
                  <div className="w-full text-center py-1 rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                    Your Profile
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (student.isMentor) {
                        setSelectedStudent(student);
                        setIsMentorshipModalOpen(true);
                      } else {
                        showToast(`Connected with ${student.name}!`);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1 rounded-full border border-[#0a66c2] text-[#0a66c2] dark:text-[#70b5f9] hover:bg-[#0a66c2]/10 py-1 text-xs font-bold transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{student.isMentor ? 'Request Session' : 'Connect'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. STUDENT DETAIL MODAL */}
      {/* ======================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 my-6 text-left">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-3.5 top-3.5 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-3.5">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-foreground">{selectedStudent.name}</h3>
                  <CheckCircle2 className="h-4 w-4 text-[#0a66c2]" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedStudent.headline}</p>
                <div className="text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] mt-1">
                  {selectedStudent.year} • {selectedStudent.branch} ({selectedStudent.residence})
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">About</span>
              <p className="text-foreground/90 leading-relaxed">{selectedStudent.bio}</p>
            </div>

            {/* Mentorship offerings */}
            {selectedStudent.isMentor && (
              <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
                <span className="font-bold text-[#0a66c2] dark:text-[#70b5f9] flex items-center gap-1 text-[11px]">
                  <Sparkles className="h-3 w-3" />
                  <span>Verified Senior Mentor Offering:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedStudent.mentorTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-card border border-border px-2 py-0.5 rounded font-medium"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Skills</span>
              <div className="flex flex-wrap gap-1">
                {selectedStudent.skills.map((sk, idx) => (
                  <span key={idx} className="bg-muted px-2 py-0.5 rounded text-[11px] font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedStudent.githubUrl && (
                  <a href={selectedStudent.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {selectedStudent.linkedinUrl && (
                  <a href={selectedStudent.linkedinUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/messages')}
                  className="rounded-full border border-border px-3.5 py-1 text-xs font-semibold hover:bg-muted"
                >
                  Message
                </button>
                {selectedStudent.isMentor && selectedStudent.id !== currentUser.id && (
                  <button
                    onClick={() => setIsMentorshipModalOpen(true)}
                    className="rounded-full bg-[#0a66c2] text-white px-4 py-1 text-xs font-bold hover:bg-[#004182]"
                  >
                    Request Mentorship
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. REQUEST MENTORSHIP MODAL */}
      {/* ======================================================== */}
      {isMentorshipModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">
                Request Session with {selectedStudent.name}
              </h3>
              <button onClick={() => setIsMentorshipModalOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestMentorshipSession(
                  selectedStudent.id,
                  mentorshipTopic,
                  mentorshipMessage.trim() || 'Looking forward to your advice!',
                  'Tomorrow 6:00 PM'
                );
                setIsMentorshipModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Mentorship Topic</label>
                <select
                  value={mentorshipTopic}
                  onChange={(e) => setMentorshipTopic(e.target.value)}
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  <option value="Resume Review">Resume Review & Portfolio Critique</option>
                  <option value="DSA & LeetCode Prep">DSA & LeetCode Coding Interview Prep</option>
                  <option value="Core vs Software Guidance">Core Engineering vs IT Guidance</option>
                  <option value="Hackathon Pitch">Hackathon Idea & Pitch Feedback</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Note to Senior</label>
                <textarea
                  rows={3}
                  value={mentorshipMessage}
                  onChange={(e) => setMentorshipMessage(e.target.value)}
                  placeholder="Hi bhaiya/didi, would love 15 minutes of your time to review my internship resume..."
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMentorshipModalOpen(false)}
                  className="rounded-full border border-border px-3 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VERIFY ONBOARDING MODAL */}
      {/* ======================================================== */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 my-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-foreground">
                  Verify Institutional Email (.ac.in / .edu)
                </h3>
              </div>
              <button onClick={() => setIsOnboardingOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              {regEmailError && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold">
                  {regEmailError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maya Iyer"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">College Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="maya.iyer@ait.ac.in"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Batch</label>
                  <select
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value as StudentYear)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Branch</label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value as Branch)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Residence</label>
                  <select
                    value={regResidence}
                    onChange={(e) => setRegResidence(e.target.value as Residence)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  value={regHeadline}
                  onChange={(e) => setRegHeadline(e.target.value)}
                  placeholder="e.g. 2nd Year CSE | Fullstack Dev & CP Enthusiast"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={regSkills}
                  onChange={(e) => setRegSkills(e.target.value)}
                  placeholder="React, Next.js, Python, Figma"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="rounded-full border border-border px-3.5 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Complete Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Network...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
