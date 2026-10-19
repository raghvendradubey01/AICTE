'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Rocket,
  PlusCircle,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  X,
  ExternalLink,
  Code2,
  Send,
  Clock,
  Layers,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { TeamListing } from '@/types';

export default function TeamsPage() {
  const {
    teams,
    currentUser,
    createTeamListing,
    applyToTeam,
    showToast,
  } = useCampus();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Hackathon' | 'Major Project' | 'Campus Startup'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [applyingTeam, setApplyingTeam] = useState<TeamListing | null>(null);

  // Create Form State
  const [title, setTitle] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<'Hackathon' | 'Major Project' | 'Campus Startup' | 'Research Paper'>('Hackathon');
  const [description, setDescription] = useState('');
  const [rolesNeeded, setRolesNeeded] = useState('Frontend Dev (React/Next), UI/UX Designer');
  const [techStack, setTechStack] = useState('Next.js, Tailwind, Supabase');
  const [totalSlots, setTotalSlots] = useState(4);
  const [deadline, setDeadline] = useState('2026-11-25');

  // Apply Form State
  const [selectedRole, setSelectedRole] = useState('');
  const [pitchNote, setPitchNote] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventName.trim()) return;

    createTeamListing({
      title: title.trim(),
      eventName: eventName.trim(),
      eventType,
      description: description.trim(),
      rolesNeeded: rolesNeeded.split(',').map((r) => r.trim()).filter(Boolean),
      techStack: techStack.split(',').map((t) => t.trim()).filter(Boolean),
      totalSlots: Number(totalSlots) || 4,
      deadline,
    });

    setTitle('');
    setEventName('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingTeam || !selectedRole) return;

    applyToTeam(
      applyingTeam.id,
      selectedRole,
      pitchNote.trim() || `Excited to build this with you!`,
      portfolioLink.trim() || currentUser.portfolioUrl || currentUser.githubUrl
    );

    setApplyingTeam(null);
    setSelectedRole('');
    setPitchNote('');
    setPortfolioLink('');
  };

  const filteredTeams = teams.filter((t) => {
    if (activeFilter !== 'All' && t.eventType !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = t.title.toLowerCase().includes(q);
      const matchesEvent = t.eventName.toLowerCase().includes(q);
      const matchesTech = t.techStack.some((st) => st.toLowerCase().includes(q));
      const matchesRole = t.rolesNeeded.some((r) => r.toLowerCase().includes(q));
      if (!matchesTitle && !matchesEvent && !matchesTech && !matchesRole) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-violet-950/70 via-background to-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Rocket className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Build Together: Team & Hackathon Finder
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Form cross-batch hackathon squads, capstone project teams, and campus startup crews.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-violet-700 transition-all shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Team Card</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-2xl bg-muted p-1 text-xs overflow-x-auto w-full sm:w-auto">
          {(['All', 'Hackathon', 'Major Project', 'Campus Startup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeFilter === tab
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'All' ? 'All Projects' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, tech, or event..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Team Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => {
          const isCreator = team.creator.id === currentUser.id;
          const slotsRemaining = team.totalSlots - team.filledSlots;
          const percentage = Math.round((team.filledSlots / team.totalSlots) * 100);

          return (
            <div
              key={team.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Event Badge & Slots */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      <Layers className="h-3 w-3" />
                      <span>{team.eventName}</span>
                    </span>
                    <h3 className="font-extrabold text-base text-foreground leading-snug">
                      {team.title}
                    </h3>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {team.filledSlots}/{team.totalSlots} Slots
                  </span>
                </div>

                {/* Creator info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <img
                    src={team.creator.avatar}
                    alt={team.creator.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span>Pitch by</span>
                  <Link
                    href={`/directory?student=${team.creator.id}`}
                    className="font-bold text-foreground hover:underline"
                  >
                    {team.creator.name}
                  </Link>
                  <span>({team.creator.year} • {team.creator.branch})</span>
                </div>

                {/* Description */}
                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                  {team.description}
                </p>

                {/* Slots Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Squad Progress</span>
                    <span>{percentage}% Filled</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Roles Needed */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Open Roles Needed:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {team.rolesNeeded.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md"
                      >
                        + {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {team.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded border border-border/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Deadline & Apply Button */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Due: {team.deadline}</span>
                </span>

                {isCreator ? (
                  <span className="text-[11px] font-bold text-muted-foreground italic">
                    Your Team Pitch ({team.applications.length} applicants)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setApplyingTeam(team);
                      setSelectedRole(team.rolesNeeded[0] || '');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="h-3 w-3" />
                    <span>Apply for Role</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. APPLY TO TEAM MODAL */}
      {/* ======================================================== */}
      {applyingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Apply to Join Team
                </h3>
                <p className="text-xs text-muted-foreground">{applyingTeam.title}</p>
              </div>
              <button onClick={() => setApplyingTeam(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Select Role You're Applying For</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  {applyingTeam.rolesNeeded.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Pitch Note (Why are you a good fit for this project?)
                </label>
                <textarea
                  rows={3}
                  required
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  placeholder={`Hi ${applyingTeam.creator.name.split(' ')[0]}, I have experience with this tech stack and built similar features in my 2nd semester...`}
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Portfolio / GitHub Link (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://github.com/your-username"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 border border-indigo-500/20 text-[11px] text-muted-foreground">
                Your CampusConnect profile card (<strong>{currentUser.name} • {currentUser.year} {currentUser.branch}</strong>) will be attached automatically.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApplyingTeam(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CREATE TEAM LISTING MODAL */}
      {/* ======================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <Rocket className="h-5 w-5 text-indigo-500" />
                <span>Create New Team Pitch</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Project / Pitch Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous Campus Delivery Rover"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Competition / Event Name</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Smart India Hackathon (SIH 2026)"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Event Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Major Project">Major Project</option>
                    <option value="Campus Startup">Campus Startup</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Project Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you building? What is the current progress and what help do you need?"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Roles Needed (comma separated)</label>
                <input
                  type="text"
                  required
                  value={rolesNeeded}
                  onChange={(e) => setRolesNeeded(e.target.value)}
                  placeholder="1st/2nd Year UI Designer, Backend Node Dev, Hardware BLE Specialist"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js, Python, OpenCV, Figma, Docker"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Total Team Slots</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Publish Team Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
