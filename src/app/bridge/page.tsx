'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MessageSquare,
  Briefcase,
  Sparkles,
  HelpCircle,
  PlusCircle,
  CheckCircle2,
  ThumbsUp,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Building2,
  Calendar,
  X,
  Send,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { PlacementChronicle, StudentYear, InterviewRound } from '@/types';

export default function SeniorJuniorBridgePage() {
  const {
    currentUser,
    questions,
    askQuestion,
    answerQuestion,
    upvoteQuestion,
    upvoteAnswer,
    chronicles,
    addChronicle,
    upvoteChronicle,
    students,
    requestMentorshipSession,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'qna' | 'chronicles' | 'mentors'>('qna');

  // Q&A State
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [qTitle, setQTitle] = useState('');
  const [qContent, setQContent] = useState('');
  const [qTargetYear, setQTargetYear] = useState<StudentYear>('3rd Year');
  const [qTags, setQTags] = useState('Internships, DSA');
  const [answerDrafts, setAnswerDrafts] = useState<{ [qId: string]: string }>({});
  const [expandedAnswers, setExpandedAnswers] = useState<{ [qId: string]: boolean }>({});

  // Chronicles State
  const [isChronicleModalOpen, setIsChronicleModalOpen] = useState(false);
  const [chronicleCompany, setChronicleCompany] = useState('');
  const [chronicleRole, setChronicleRole] = useState('');
  const [chroniclePackage, setChroniclePackage] = useState('');
  const [chronicleType, setChronicleType] = useState<'Internship' | 'Full-Time FTE'>('Internship');
  const [chronicleBatch, setChronicleBatch] = useState('2026 Batch');
  const [chronicleDifficulty, setChronicleDifficulty] = useState<'Easy' | 'Medium' | 'Challenging'>('Medium');
  const [chroniclePrep, setChroniclePrep] = useState('');
  const [chronicleResume, setChronicleResume] = useState('');
  const [chronicleSearch, setChronicleSearch] = useState('');
  const [expandedChronicleId, setExpandedChronicleId] = useState<string | null>(null);

  // Mentorship Directory State
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [mentorTopic, setMentorTopic] = useState('Resume Review');
  const [mentorMessage, setMentorMessage] = useState('');
  const [mentorDate, setMentorDate] = useState('Tomorrow 6:00 PM');

  // Submit Question
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || !qContent.trim()) return;
    const tagsArr = qTags.split(',').map((t) => t.trim()).filter(Boolean);
    askQuestion(qTitle.trim(), qContent.trim(), qTargetYear, tagsArr);
    setQTitle('');
    setQContent('');
    setIsAskModalOpen(false);
  };

  // Submit Answer
  const handleAnswerSubmit = (qId: string) => {
    const text = answerDrafts[qId]?.trim();
    if (!text) return;
    answerQuestion(qId, text);
    setAnswerDrafts((prev) => ({ ...prev, [qId]: '' }));
    setExpandedAnswers((prev) => ({ ...prev, [qId]: true }));
  };

  // Submit Chronicle
  const handleChronicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chronicleCompany.trim() || !chronicleRole.trim()) return;

    const sampleRounds: InterviewRound[] = [
      {
        roundName: 'Round 1: Online Technical Assessment',
        duration: '90 Mins',
        description: 'Algorithmic problems and domain core questions.',
        keyQuestions: ['Problem on Dynamic Programming / Graph Traversal.', 'Time and space complexity analysis.'],
      },
      {
        roundName: 'Round 2: Technical Interview',
        duration: '60 Mins',
        description: 'Live coding session and deep dive into college projects.',
        keyQuestions: ['Architecture of your main college project.', 'Database queries and optimization strategies.'],
      },
    ];

    addChronicle({
      companyName: chronicleCompany.trim(),
      role: chronicleRole.trim(),
      packageOrStipend: chroniclePackage.trim() || 'Undisclosed',
      employmentType: chronicleType,
      batchYear: chronicleBatch,
      difficulty: chronicleDifficulty,
      rounds: sampleRounds,
      preparationTips: chroniclePrep.trim() || 'Practice LeetCode mediums and review core subjects.',
      resumeAdvice: chronicleResume.trim() || 'Highlight metrics and live project URLs.',
    });

    setChronicleCompany('');
    setChronicleRole('');
    setChroniclePackage('');
    setChroniclePrep('');
    setChronicleResume('');
    setIsChronicleModalOpen(false);
  };

  // Filtered Chronicles
  const filteredChronicles = chronicles.filter((c) => {
    if (!chronicleSearch.trim()) return true;
    const q = chronicleSearch.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.preparationTips.toLowerCase().includes(q)
    );
  });

  // Mentors List
  const mentorsList = students.filter((s) => s.isMentor && (s.year === '3rd Year' || s.year === '4th Year'));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/60 via-background to-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Compass className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Senior-Junior Bridge
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Demystifying campus placements, course electives, and career tracks through direct senior mentorship.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-muted p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('qna')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'qna' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
            <span>Ask a Senior Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('chronicles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'chronicles' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 text-amber-500" />
            <span>Placement Chronicles</span>
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'mentors' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>1-on-1 Mentors</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ASK A SENIOR Q&A FORUM */}
      {/* ======================================================== */}
      {activeTab === 'qna' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Peer & Senior Q&A Discussions ({questions.length})
            </h2>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Ask a Senior Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q) => {
              const isAnswersOpen = Boolean(expandedAnswers[q.id]);

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3.5 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={q.author.avatar}
                        alt={q.author.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-foreground">{q.author.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            ({q.author.year} • {q.author.branch})
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{q.createdAt}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Target: {q.targetYear}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      {q.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                      {q.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-muted/60 px-2 py-0.5 rounded text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions & Verified Answer Preview */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => upvoteQuestion(q.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${
                          q.hasUpvoted
                            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${q.hasUpvoted ? 'fill-current' : ''}`} />
                        <span>{q.upvotes} Upvotes</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedAnswers((prev) => ({
                            ...prev,
                            [q.id]: !prev[q.id],
                          }))
                        }
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-muted text-foreground transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{q.answers.length} Answers</span>
                        {isAnswersOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>

                    {q.answers.some((a) => a.isSeniorVerified) && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified Senior Reply</span>
                      </span>
                    )}
                  </div>

                  {/* Expanded Answers Accordion */}
                  {isAnswersOpen && (
                    <div className="pt-3 border-t border-border/60 space-y-3">
                      {q.answers.map((ans) => (
                        <div
                          key={ans.id}
                          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                            ans.isSeniorVerified
                              ? 'border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-950/20'
                              : 'border-border bg-muted/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={ans.author.avatar}
                                alt={ans.author.name}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{ans.author.name}</span>
                                {ans.isSeniorVerified && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white flex items-center gap-0.5">
                                    <ShieldCheck className="h-2.5 w-2.5" />
                                    <span>Verified Senior</span>
                                  </span>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {ans.author.year} • {ans.author.branch}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => upvoteAnswer(q.id, ans.id)}
                              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                                ans.hasUpvoted
                                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>{ans.upvotes}</span>
                            </button>
                          </div>

                          <div className="text-foreground/90 leading-relaxed whitespace-pre-line pl-8">
                            {ans.content}
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={answerDrafts[q.id] || ''}
                          onChange={(e) =>
                            setAnswerDrafts((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAnswerSubmit(q.id);
                          }}
                          placeholder={
                            currentUser.year === '3rd Year' || currentUser.year === '4th Year'
                              ? 'Answer as a Verified Senior (+15 Karma)...'
                              : 'Add your insight...'
                          }
                          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAnswerSubmit(q.id)}
                          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PLACEMENT & INTERNSHIP CHRONICLES */}
      {/* ======================================================== */}
      {activeTab === 'chronicles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={chronicleSearch}
                onChange={(e) => setChronicleSearch(e.target.value)}
                placeholder="Search company (Google, Amazon, TI)..."
                className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
              />
            </div>

            {(currentUser.year === '3rd Year' || currentUser.year === '4th Year') && (
              <button
                onClick={() => setIsChronicleModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:from-amber-700 hover:to-indigo-700 transition-all shrink-0"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Publish Interview Chronicle (+30 Karma)</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filteredChronicles.map((chronicle) => {
              const isExpanded = expandedChronicleId === chronicle.id;

              return (
                <div
                  key={chronicle.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 border border-amber-500/20 font-black text-lg text-foreground">
                        {chronicle.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-foreground">
                            {chronicle.companyName}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {chronicle.employmentType}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                          {chronicle.role} • <span className="text-foreground font-semibold">{chronicle.packageOrStipend}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Difficulty: {chronicle.difficulty}
                      </span>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        By {chronicle.author.name} ({chronicle.batchYear})
                      </div>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <div className="rounded-xl bg-muted/30 p-3 text-xs text-foreground/90 space-y-1.5 border border-border/60">
                    <div className="font-bold text-muted-foreground uppercase text-[10px]">
                      Preparation Strategy & Advice
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{chronicle.preparationTips}</p>
                  </div>

                  {/* Expanded Rounds */}
                  {isExpanded && (
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                        Detailed Round Breakdown ({chronicle.rounds.length} Rounds)
                      </h4>

                      <div className="space-y-2.5">
                        {chronicle.rounds.map((round, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border bg-background p-3.5 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">{round.roundName}</span>
                              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {round.duration}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{round.description}</p>
                            {round.keyQuestions.length > 0 && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] font-semibold text-foreground">
                                  Questions Asked:
                                </span>
                                <ul className="list-disc pl-4 space-y-0.5 text-foreground/90">
                                  {round.keyQuestions.map((q, qIdx) => (
                                    <li key={qIdx}>{q}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 p-3 text-xs space-y-1">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                          Resume Tips from {chronicle.author.name}:
                        </span>
                        <p className="text-foreground/90">{chronicle.resumeAdvice}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <button
                      onClick={() => upvoteChronicle(chronicle.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                        chronicle.hasUpvoted
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{chronicle.upvotes} Students found this helpful</span>
                    </button>

                    <button
                      onClick={() => setExpandedChronicleId(isExpanded ? null : chronicle.id)}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Rounds' : 'View Full Round Questions'}</span>
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: 1-ON-1 MENTORSHIP DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Verified Senior Mentors ({mentorsList.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Free 1-on-1 resume critiques, mock interviews & guidance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorsList.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-foreground">{mentor.name}</h3>
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{mentor.headline}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {mentor.year} • {mentor.branch}
                        </span>
                        <span>•</span>
                        <span>🏆 {mentor.karmaPoints} Karma</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed">{mentor.bio}</p>

                  {/* Mentor Topics */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Offering Mentorship in:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {mentor.mentorTopics.map((top, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded"
                        >
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/directory?student=${mentor.id}`}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    View Card
                  </Link>
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Request 1-on-1 Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ASK A QUESTION MODAL */}
      {/* ======================================================== */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                <span>Ask Seniors a Question</span>
              </h3>
              <button onClick={() => setIsAskModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="e.g. Best 5th sem professional elective for CSE?"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Target Senior Batch</label>
                <select
                  value={qTargetYear}
                  onChange={(e) => setQTargetYear(e.target.value as StudentYear)}
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  <option value="2nd Year">2nd Year Sophomores</option>
                  <option value="3rd Year">3rd Year Pre-Finals</option>
                  <option value="4th Year">4th Year Passing Seniors</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Context & Details</label>
                <textarea
                  rows={4}
                  required
                  value={qContent}
                  onChange={(e) => setQContent(e.target.value)}
                  placeholder="Provide background on what you've tried or specific areas you are confused about..."
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={qTags}
                  onChange={(e) => setQTags(e.target.value)}
                  placeholder="Internships, Placements, CGPA, DSA"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SHARE PLACEMENT CHRONICLE MODAL */}
      {/* ======================================================== */}
      {isChronicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <Briefcase className="h-5 w-5 text-amber-500" />
                <span>Share Interview Chronicle</span>
              </h3>
              <button onClick={() => setIsChronicleModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleChronicleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={chronicleCompany}
                    onChange={(e) => setChronicleCompany(e.target.value)}
                    placeholder="e.g. Microsoft, Google, Texas Instruments"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={chronicleRole}
                    onChange={(e) => setChronicleRole(e.target.value)}
                    placeholder="e.g. SDE-1 / Hardware Engineer"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Package / Stipend</label>
                  <input
                    type="text"
                    value={chroniclePackage}
                    onChange={(e) => setChroniclePackage(e.target.value)}
                    placeholder="e.g. ₹1.25L / month"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Type</label>
                  <select
                    value={chronicleType}
                    onChange={(e) => setChronicleType(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time FTE">Full-Time FTE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Difficulty</label>
                  <select
                    value={chronicleDifficulty}
                    onChange={(e) => setChronicleDifficulty(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Preparation Tips & Recommended Resources</label>
                <textarea
                  rows={3}
                  required
                  value={chroniclePrep}
                  onChange={(e) => setChroniclePrep(e.target.value)}
                  placeholder="What topics should juniors focus on? Books, LeetCode patterns, or lab concepts..."
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Resume Advice</label>
                <textarea
                  rows={2}
                  value={chronicleResume}
                  onChange={(e) => setChronicleResume(e.target.value)}
                  placeholder="How did you format your resume? What projects made the strongest impression?"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChronicleModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
                >
                  Publish Chronicle (+30 Karma)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1-ON-1 REQUEST MODAL */}
      {/* ======================================================== */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                Request Mentorship from {selectedMentor.name}
              </h3>
              <button onClick={() => setSelectedMentor(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestMentorshipSession(selectedMentor.id, mentorTopic, mentorMessage, mentorDate);
                setSelectedMentor(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Topic</label>
                <select
                  value={mentorTopic}
                  onChange={(e) => setMentorTopic(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  <option value="Resume Review">Resume Review & Critique</option>
                  <option value="Mock DSA Interview">Mock Technical / DSA Interview</option>
                  <option value="Placement Roadmap">Semester Roadmap & Electives</option>
                  <option value="Project Guidance">Capstone / Hackathon Idea Guidance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Preferred Time / Slot</label>
                <input
                  type="text"
                  value={mentorDate}
                  onChange={(e) => setMentorDate(e.target.value)}
                  placeholder="e.g. This Saturday at 4 PM"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Brief Note on your goals
                </label>
                <textarea
                  rows={3}
                  value={mentorMessage}
                  onChange={(e) => setMentorMessage(e.target.value)}
                  placeholder="Hi bhaiya/didi, would love your feedback on my portfolio and LeetCode strategy..."
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
