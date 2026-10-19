'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Award,
  Github,
  Linkedin,
  Globe,
  MessageSquare,
  Sparkles,
  UserPlus,
  Compass,
  X,
  Mail,
  Home,
  Briefcase,
  GraduationCap,
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

  // URL / State filter parameters
  const initialYear = searchParams.get('year') as StudentYear | null;
  const initialStudentId = searchParams.get('student');

  const [selectedYear, setSelectedYear] = useState<string>(initialYear || 'All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedResidence, setSelectedResidence] = useState<string>('All');
  const [onlyMentors, setOnlyMentors] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    initialStudentId ? students.find((s) => s.id === initialStudentId) || null : null
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState<boolean>(false);

  // New Student Verification Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regYear, setRegYear] = useState<StudentYear>('1st Year');
  const [regBranch, setRegBranch] = useState<Branch>('CSE');
  const [regResidence, setRegResidence] = useState<Residence>('Hostel');
  const [regHostelBlock, setRegHostelBlock] = useState('Aryabhatta Hostel, Room B-101');
  const [regHeadline, setRegHeadline] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regSkills, setRegSkills] = useState('React, Python, Git');
  const [regClubs, setRegClubs] = useState('Turing Coding Club');
  const [regIsMentor, setRegIsMentor] = useState(false);
  const [regEmailError, setRegEmailError] = useState('');

  // Mentorship request state
  const [mentorshipTopic, setMentorshipTopic] = useState('Resume Review & Internship Roadmap');
  const [mentorshipMessage, setMentorshipMessage] = useState('');
  const [mentorshipDate, setMentorshipDate] = useState('Tomorrow at 5:00 PM');

  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical', 'Biotech', 'Design'];
  const years: StudentYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // All unique skills collected from all student profiles
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.skills.forEach((sk) => set.add(sk)));
    return Array.from(set).slice(0, 10);
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedYear !== 'All' && s.year !== selectedYear) return false;
      if (selectedBranch !== 'All' && s.branch !== selectedBranch) return false;
      if (selectedResidence !== 'All' && s.residence !== selectedResidence) return false;
      if (onlyMentors && !s.isMentor) return false;
      if (selectedSkill !== 'All' && !s.skills.includes(selectedSkill)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesHeadline = s.headline.toLowerCase().includes(q);
        const matchesBio = s.bio.toLowerCase().includes(q);
        const matchesSkill = s.skills.some((sk) => sk.toLowerCase().includes(q));
        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkill) return false;
      }
      return true;
    });
  }, [students, selectedYear, selectedBranch, selectedResidence, onlyMentors, selectedSkill, searchQuery]);

  // Handle Onboarding submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegEmailError('');

    // Verification check for institutional domain
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
      hostelBlock: regResidence === 'Hostel' ? regHostelBlock : undefined,
      headline: regHeadline.trim() || `${regYear} ${regBranch} Student`,
      bio: regBio.trim() || `Excited to connect with peers and mentors on CampusConnect.`,
      skills: regSkills.split(',').map((s) => s.trim()).filter(Boolean),
      clubs: regClubs.split(',').map((s) => s.trim()).filter(Boolean),
      isMentor: regIsMentor,
      mentorTopics: regIsMentor ? ['Academics', 'Guidance'] : [],
    });

    setIsOnboardingOpen(false);
    setSelectedStudent(newProfile);
  };

  const handleSendMentorshipRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    requestMentorshipSession(
      selectedStudent.id,
      mentorshipTopic,
      mentorshipMessage.trim() || 'Looking forward to getting your guidance!',
      mentorshipDate
    );
    setIsMentorshipModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Verification CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              1st–4th Year Student Network
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connect across batches at {COLLEGE_CONFIG.name}. Filter by batch, branch, skills, or hostel status.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-violet-700 transition-all shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Verify & Join Directory</span>
        </button>
      </div>

      {/* Multi-Filter Bar Card */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skills (e.g. Next.js, Verilog, Flutter), or bio..."
            className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Batch Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2 text-foreground focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Batches (1st to 4th)</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Department
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2 text-foreground focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Residence Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Residence
            </label>
            <select
              value={selectedResidence}
              onChange={(e) => setSelectedResidence(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2 text-foreground focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">Hostel & Day Scholars</option>
              <option value="Hostel">Hostel Only</option>
              <option value="Day Scholar">Day Scholar Only</option>
            </select>
          </div>

          {/* Open to Mentor Toggle */}
          <div className="flex items-end">
            <label className="w-full flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-indigo-500" />
                <span>Open to Mentor</span>
              </span>
              <input
                type="checkbox"
                checked={onlyMentors}
                onChange={(e) => setOnlyMentors(e.target.checked)}
                className="rounded border-border text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
            </label>
          </div>

        </div>

        {/* Skill Tag Pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-border overflow-x-auto">
          <span className="text-[11px] font-semibold text-muted-foreground shrink-0">Popular Skills:</span>
          <button
            onClick={() => setSelectedSkill('All')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
              selectedSkill === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-border text-muted-foreground hover:border-foreground/30'
            }`}
          >
            All
          </button>
          {allSkills.map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk === selectedSkill ? 'All' : sk)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all shrink-0 ${
                selectedSkill === sk
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-border text-muted-foreground hover:border-foreground/30'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>

      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.map((student) => {
          const isCurrentUser = student.id === currentUser.id;

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:scale-105 transition-transform"
                  />
                  {student.isMentor && (
                    <span
                      title="Open to Mentor Juniors"
                      className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white ring-2 ring-background"
                    >
                      ★
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {student.name}
                    </h3>
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    {isCurrentUser && (
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold px-1.5 py-0.2 rounded">
                        You
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {student.headline}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                      {student.year} • {student.branch}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                      {student.residence === 'Hostel' ? 'Hostel' : 'Day Scholar'}
                    </span>
                    {student.isMentor && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Mentor</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
                {student.bio}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1">
                {student.skills.slice(0, 4).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-muted/60 px-2 py-0.5 rounded-md text-muted-foreground border border-border/50"
                  >
                    {skill}
                  </span>
                ))}
                {student.skills.length > 4 && (
                  <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                    +{student.skills.length - 4} more
                  </span>
                )}
              </div>

              {/* Card Footer: Karma & Connect CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>{student.karmaPoints} Karma</span>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStudent(student);
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1"
                >
                  <span>View Profile & Bridge</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center p-12 rounded-3xl border border-dashed border-border bg-card space-y-2">
          <p className="font-semibold text-foreground">No students found matching your filters.</p>
          <p className="text-xs text-muted-foreground">Try clearing your search query or selecting "All Batches".</p>
        </div>
      )}

      {/* ========================================================== */}
      {/* 1. STUDENT DETAIL MODAL & MENTORSHIP REQUEST */}
      {/* ========================================================== */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 my-8">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-500/20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-foreground">{selectedStudent.name}</h2>
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedStudent.headline}</p>

                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {selectedStudent.year} • {selectedStudent.branch}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {selectedStudent.residence} {selectedStudent.hostelBlock ? `(${selectedStudent.hostelBlock})` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About</h4>
              <p className="text-xs leading-relaxed text-foreground">{selectedStudent.bio}</p>
            </div>

            {/* Mentorship Topics (if mentor) */}
            {selectedStudent.isMentor && selectedStudent.mentorTopics.length > 0 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Open to Mentor Juniors In:</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.mentorTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-muted px-2.5 py-1 rounded-md text-foreground font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Clubs */}
            {selectedStudent.clubs.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Clubs & PORs</h4>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {selectedStudent.clubs.map((c, i) => (
                    <span key={i} className="bg-card border border-border px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links & Action Buttons */}
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedStudent.githubUrl && (
                  <a
                    href={selectedStudent.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {selectedStudent.linkedinUrl && (
                  <a
                    href={selectedStudent.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {selectedStudent.portfolioUrl && (
                  <a
                    href={selectedStudent.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => router.push(`/messages`)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Message</span>
                </button>

                {selectedStudent.isMentor && selectedStudent.id !== currentUser.id && (
                  <button
                    onClick={() => setIsMentorshipModalOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Request Mentorship</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. REQUEST 1-ON-1 MENTORSHIP SESSION MODAL */}
      {/* ========================================================== */}
      {isMentorshipModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Request Mentorship from {selectedStudent.name.split(' ')[0]}</span>
              </h3>
              <button
                onClick={() => setIsMentorshipModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendMentorshipRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Topic</label>
                <select
                  value={mentorshipTopic}
                  onChange={(e) => setMentorshipTopic(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  <option value="Resume Review & Internship Roadmap">Resume Review & Internship Roadmap</option>
                  <option value="DSA & LeetCode Strategy">DSA & LeetCode Strategy</option>
                  <option value="Core Branch vs IT Placements">Core Branch vs IT Placements</option>
                  <option value="Hackathon Pitch Guidance">Hackathon Pitch Guidance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Preferred Time / Slot</label>
                <input
                  type="text"
                  value={mentorshipDate}
                  onChange={(e) => setMentorshipDate(e.target.value)}
                  placeholder="e.g. Tomorrow between 5 PM and 7 PM"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Note to Senior (Explain what you need help with)
                </label>
                <textarea
                  rows={3}
                  value={mentorshipMessage}
                  onChange={(e) => setMentorshipMessage(e.target.value)}
                  placeholder="Hi bhaiya/didi, I am preparing for my 3rd sem intern tests and would love 20 minutes to review my resume..."
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMentorshipModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. INSTITUTIONAL ONBOARDING MODAL (.edu / .ac.in GATE) */}
      {/* ========================================================== */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <div>
                  <h3 className="font-extrabold text-base text-foreground">
                    Institutional Email Verification
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Exclusive to {COLLEGE_CONFIG.name} students
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              {regEmailError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-xs">
                  {regEmailError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Nair"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">College Email (.ac.in / .edu)</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="priya.nair@ait.ac.in"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Year</label>
                  <select
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value as StudentYear)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Branch</label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value as Branch)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Residence</label>
                  <select
                    value={regResidence}
                    onChange={(e) => setRegResidence(e.target.value as Residence)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                </div>
              </div>

              {regResidence === 'Hostel' && (
                <div>
                  <label className="block font-semibold text-foreground mb-1">Hostel Room & Hall</label>
                  <input
                    type="text"
                    value={regHostelBlock}
                    onChange={(e) => setRegHostelBlock(e.target.value)}
                    placeholder="e.g. Gargi Hall, Room B-205"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-foreground mb-1">Headline / Pitch</label>
                <input
                  type="text"
                  value={regHeadline}
                  onChange={(e) => setRegHeadline(e.target.value)}
                  placeholder="e.g. 2nd Year CSE | Fullstack Next.js & App Dev"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={regSkills}
                  onChange={(e) => setRegSkills(e.target.value)}
                  placeholder="React, TypeScript, Figma, Python"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              {/* Open to mentor toggle */}
              {(regYear === '3rd Year' || regYear === '4th Year') && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <input
                    type="checkbox"
                    id="mentor-check"
                    checked={regIsMentor}
                    onChange={(e) => setRegIsMentor(e.target.checked)}
                    className="rounded border-border text-indigo-600 h-4 w-4"
                  />
                  <label htmlFor="mentor-check" className="font-semibold text-foreground cursor-pointer">
                    I want to be recognized as an Open Senior Mentor for juniors
                  </label>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="px-3 py-2 rounded-xl border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-violet-700"
                >
                  Verify Institutional Email
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
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
        Loading Student Directory...
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  );
}
