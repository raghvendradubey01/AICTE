'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MessageSquare,
  Briefcase,
  Sparkles,
  HelpCircle,
  Plus,
  CheckCircle2,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Send,
  Building,
  ShieldCheck,
  Bookmark,
  Share2,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { StudentYear, InterviewRound } from '@/types';

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
    showToast,
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

  // Mentorship Modal State
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [mentorTopic, setMentorTopic] = useState('Resume Review');
  const [mentorMessage, setMentorMessage] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || !qContent.trim()) return;
    askQuestion(qTitle.trim(), qContent.trim(), qTargetYear, qTags.split(',').map((t) => t.trim()));
    setQTitle('');
    setQContent('');
    setIsAskModalOpen(false);
  };

  const handleAnswerSubmit = (qId: string) => {
    const text = answerDrafts[qId]?.trim();
    if (!text) return;
    answerQuestion(qId, text);
    setAnswerDrafts((prev) => ({ ...prev, [qId]: '' }));
    setExpandedAnswers((prev) => ({ ...prev, [qId]: true }));
  };

  const handleChronicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chronicleCompany.trim() || !chronicleRole.trim()) return;

    addChronicle({
      companyName: chronicleCompany.trim(),
      role: chronicleRole.trim(),
      packageOrStipend: chroniclePackage.trim() || 'Undisclosed',
      employmentType: chronicleType,
      batchYear: chronicleBatch,
      difficulty: chronicleDifficulty,
      rounds: [
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
      ],
      preparationTips: chroniclePrep.trim() || 'Master standard LeetCode Medium patterns and fundamental OS/DBMS concepts.',
      resumeAdvice: chronicleResume.trim() || 'Highlight metrics and include live links to GitHub repos.',
    });

    setChronicleCompany('');
    setChronicleRole('');
    setChroniclePackage('');
    setChroniclePrep('');
    setChronicleResume('');
    setIsChronicleModalOpen(false);
  };

  const filteredChronicles = chronicles.filter((c) => {
    if (!chronicleSearch.trim()) return true;
    const q = chronicleSearch.toLowerCase();
    return c.companyName.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  const mentorsList = students.filter((s) => s.isMentor && (s.year === '3rd Year' || s.year === '4th Year'));

  return (
    <div className="space-y-3 text-left">
      
      {/* 1. Header Card with LinkedIn Style Tabs */}
      <div className="rounded-lg border border-border bg-card shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              <span>Senior-Junior Bridge</span>
              <span className="text-[10px] font-semibold bg-[#0a66c2]/10 text-[#0a66c2] dark:text-[#70b5f9] px-2 py-0.5 rounded-full">
                Mentorship & Placements
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Authentic interview debriefs, batch electives guidance, and 1-on-1 career assistance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'qna' && (
              <button
                onClick={() => setIsAskModalOpen(true)}
                className="rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors"
              >
                + Ask Question
              </button>
            )}
            {activeTab === 'chronicles' && (
              <button
                onClick={() => setIsChronicleModalOpen(true)}
                className="rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors"
              >
                + Share Experience
              </button>
            )}
          </div>
        </div>

        {/* LinkedIn Tabs Header */}
        <div className="flex items-center px-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qna')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'qna' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Ask a Senior Q&A ({questions.length})</span>
            {activeTab === 'qna' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>

          <button
            onClick={() => setActiveTab('chronicles')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'chronicles' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Placement Chronicles ({chronicles.length})</span>
            {activeTab === 'chronicles' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'mentors' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>1-on-1 Mentors ({mentorsList.length})</span>
            {activeTab === 'mentors' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ASK A SENIOR Q&A */}
      {/* ======================================================== */}
      {activeTab === 'qna' && (
        <div className="space-y-2.5">
          {questions.map((q) => {
            const isAnswersOpen = Boolean(expandedAnswers[q.id]);

            return (
              <div
                key={q.id}
                className="rounded-lg border border-border bg-card p-3.5 sm:p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={q.author.avatar}
                      alt={q.author.name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                    />
                    <div>
                      <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <span>{q.author.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({q.author.year} • {q.author.branch})
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{q.createdAt}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    Target: {q.targetYear}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-foreground leading-snug">{q.title}</h3>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                  {q.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {q.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-[#0a66c2] dark:text-[#70b5f9] font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => upvoteQuestion(q.id)}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-muted text-xs font-semibold ${
                        q.hasUpvoted ? 'text-[#0a66c2] dark:text-[#70b5f9]' : 'text-muted-foreground'
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${q.hasUpvoted ? 'fill-current' : ''}`} />
                      <span>{q.upvotes} Upvotes</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedAnswers((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{q.answers.length} Answers</span>
                    </button>
                  </div>

                  {q.answers.some((a) => a.isSeniorVerified) && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verified Senior Reply</span>
                    </span>
                  )}
                </div>

                {/* Expandable Answers */}
                {isAnswersOpen && (
                  <div className="pt-2 border-t border-border space-y-2.5">
                    {q.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                          ans.isSeniorVerified ? 'border-[#0a66c2]/30 bg-muted/40' : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={ans.author.avatar}
                              alt={ans.author.name}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <span className="font-bold text-foreground">{ans.author.name}</span>
                            {ans.isSeniorVerified && (
                              <span className="text-[9px] font-bold bg-[#0a66c2] text-white px-1.5 py-0.2 rounded">
                                Verified Senior
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => upvoteAnswer(q.id, ans.id)}
                            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                              ans.hasUpvoted ? 'text-[#0a66c2]' : 'text-muted-foreground'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>{ans.upvotes}</span>
                          </button>
                        </div>
                        <p className="text-foreground/90 pl-8 leading-relaxed whitespace-pre-line">
                          {ans.content}
                        </p>
                      </div>
                    ))}

                    {/* Answer input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={answerDrafts[q.id] || ''}
                        onChange={(e) =>
                          setAnswerDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAnswerSubmit(q.id);
                        }}
                        placeholder="Write a response as a senior peer..."
                        className="flex-1 rounded-full border border-border bg-muted/30 px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                      <button
                        onClick={() => handleAnswerSubmit(q.id)}
                        className="rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182]"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PLACEMENT CHRONICLES */}
      {/* ======================================================== */}
      {activeTab === 'chronicles' && (
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={chronicleSearch}
              onChange={(e) => setChronicleSearch(e.target.value)}
              placeholder="Filter by company (Google, Amazon, Texas Instruments)..."
              className="w-full rounded-md border border-border bg-card py-2 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
            />
          </div>

          <div className="space-y-2.5">
            {filteredChronicles.map((c) => {
              const isExpanded = expandedChronicleId === c.id;

              return (
                <article
                  key={c.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0a66c2]/10 text-[#0a66c2] dark:text-[#70b5f9] font-black text-lg">
                        {c.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-foreground">{c.companyName}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {c.employmentType}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.role} • <strong className="text-foreground">{c.packageOrStipend}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-muted-foreground">
                      <div>Shared by {c.author.name}</div>
                      <div>Difficulty: {c.difficulty}</div>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/40 p-3 text-xs leading-relaxed text-foreground/90 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                      Preparation Tips & High-Yield Topics:
                    </span>
                    <p className="whitespace-pre-line">{c.preparationTips}</p>
                  </div>

                  {isExpanded && (
                    <div className="space-y-2.5 pt-1">
                      <div className="text-xs font-bold text-foreground">Interview Rounds Breakdown:</div>
                      {c.rounds.map((rnd, i) => (
                        <div key={i} className="p-3 rounded-md border border-border bg-muted/20 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span>{rnd.roundName}</span>
                            <span className="text-[10px] text-muted-foreground">{rnd.duration}</span>
                          </div>
                          <p className="text-muted-foreground">{rnd.description}</p>
                          <ul className="list-disc pl-4 space-y-0.5 pt-1 text-foreground/90">
                            {rnd.keyQuestions.map((q, idx) => (
                              <li key={idx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      <div className="p-3 rounded-md bg-[#0a66c2]/10 text-xs space-y-0.5">
                        <strong className="text-[#0a66c2] dark:text-[#70b5f9]">Resume Advice:</strong>
                        <p className="text-foreground/90">{c.resumeAdvice}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <button
                      onClick={() => upvoteChronicle(c.id)}
                      className={`flex items-center gap-1.5 py-1 px-2.5 rounded font-semibold text-xs ${
                        c.hasUpvoted ? 'text-[#0a66c2] dark:text-[#70b5f9]' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{c.upvotes} Helpful</span>
                    </button>

                    <button
                      onClick={() => setExpandedChronicleId(isExpanded ? null : c.id)}
                      className="text-xs font-bold text-[#0a66c2] dark:text-[#70b5f9] hover:underline"
                    >
                      {isExpanded ? 'Hide Rounds ▲' : 'View Full Rounds Breakdown ▼'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: 1-ON-1 MENTORS DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {mentorsList.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-3 flex flex-col justify-between text-left"
            >
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-border"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1">
                      <span>{m.name}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0a66c2]" />
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{m.headline}</p>
                    <span className="text-[10px] font-semibold text-[#0a66c2] dark:text-[#70b5f9]">
                      {m.year} • {m.branch}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">{m.bio}</p>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Mentorship In:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.mentorTopics.map((top, idx) => (
                      <span key={idx} className="text-[10px] bg-muted px-2 py-0.5 rounded font-medium">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-semibold">🏆 {m.karmaPoints} Karma</span>
                <button
                  onClick={() => setSelectedMentor(m)}
                  className="rounded-full border border-[#0a66c2] text-[#0a66c2] dark:text-[#70b5f9] hover:bg-[#0a66c2]/10 px-3.5 py-1 text-xs font-bold transition-colors"
                >
                  Request Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ASK QUESTION MODAL */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Ask a Senior</h3>
              <button onClick={() => setIsAskModalOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="e.g. Best 5th sem professional elective for CSE?"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Batch</label>
                <select
                  value={qTargetYear}
                  onChange={(e) => setQTargetYear(e.target.value as any)}
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  <option value="2nd Year">2nd Year Sophomores</option>
                  <option value="3rd Year">3rd Year Pre-Finals</option>
                  <option value="4th Year">4th Year Passing Seniors</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Context & Background</label>
                <textarea
                  rows={4}
                  required
                  value={qContent}
                  onChange={(e) => setQContent(e.target.value)}
                  placeholder="Explain what specific advice you need..."
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="rounded-full border border-border px-3 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE CHRONICLE MODAL */}
      {isChronicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 my-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Share Interview Chronicle</h3>
              <button onClick={() => setIsChronicleModalOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleChronicleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={chronicleCompany}
                    onChange={(e) => setChronicleCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={chronicleRole}
                    onChange={(e) => setChronicleRole(e.target.value)}
                    placeholder="e.g. SDE-1 / Hardware"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Package / Stipend</label>
                  <input
                    type="text"
                    value={chroniclePackage}
                    onChange={(e) => setChroniclePackage(e.target.value)}
                    placeholder="₹1.25L / month"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={chronicleType}
                    onChange={(e) => setChronicleType(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time FTE">Full-Time FTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Preparation Tips</label>
                <textarea
                  rows={3}
                  required
                  value={chroniclePrep}
                  onChange={(e) => setChroniclePrep(e.target.value)}
                  placeholder="Key topics, platforms used, strategy..."
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChronicleModalOpen(false)}
                  className="rounded-full border border-border px-3 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Publish (+30 Karma)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-ON-1 REQUEST MODAL */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">
                Request Session with {selectedMentor.name}
              </h3>
              <button onClick={() => setSelectedMentor(null)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestMentorshipSession(selectedMentor.id, mentorTopic, mentorMessage, 'This Weekend');
                setSelectedMentor(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Topic</label>
                <select
                  value={mentorTopic}
                  onChange={(e) => setMentorTopic(e.target.value)}
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  <option value="Resume Review">Resume Review & Critique</option>
                  <option value="Mock DSA Interview">Mock Technical Interview</option>
                  <option value="Placement Roadmap">Placement Season Roadmap</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Note</label>
                <textarea
                  rows={3}
                  value={mentorMessage}
                  onChange={(e) => setMentorMessage(e.target.value)}
                  placeholder="Hi bhaiya/didi, would love your feedback..."
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="rounded-full border border-border px-3 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
