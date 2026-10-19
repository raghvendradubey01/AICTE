'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Plus,
  Send,
  Users,
  Clock,
  Code2,
  X,
  Sparkles,
  CheckCircle2,
  Layers,
  MapPin,
  Bookmark,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { TeamListing } from '@/types';
import { COLLEGE_CONFIG } from '@/lib/supabase';

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
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [applyingTeam, setApplyingTeam] = useState<TeamListing | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<'Hackathon' | 'Major Project' | 'Campus Startup' | 'Research Paper'>('Hackathon');
  const [description, setDescription] = useState('');
  const [rolesNeeded, setRolesNeeded] = useState('Frontend Dev, UI/UX Designer');
  const [techStack, setTechStack] = useState('Next.js, Tailwind, Supabase');
  const [totalSlots, setTotalSlots] = useState(4);
  const [deadline, setDeadline] = useState('2026-11-25');

  // Apply State
  const [selectedRole, setSelectedRole] = useState('');
  const [pitchNote, setPitchNote] = useState('');

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
      currentUser.portfolioUrl || currentUser.githubUrl
    );

    setApplyingTeam(null);
    setSelectedRole('');
    setPitchNote('');
  };

  const filteredTeams = teams.filter((t) => {
    if (activeFilter !== 'All' && t.eventType !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = t.title.toLowerCase().includes(q);
      const matchesEvent = t.eventName.toLowerCase().includes(q);
      const matchesTech = t.techStack.some((st) => st.toLowerCase().includes(q));
      if (!matchesTitle && !matchesEvent && !matchesTech) return false;
    }
    return true;
  });

  return (
    <div className="space-y-3 text-left">
      
      {/* 1. LinkedIn Jobs Header Card */}
      <div className="rounded-lg border border-border bg-card p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
            <span>Project & Hackathon Opportunities</span>
            <span className="text-[10px] font-semibold bg-[#0a66c2]/10 text-[#0a66c2] dark:text-[#70b5f9] px-2 py-0.5 rounded-full">
              {filteredTeams.length} Open Squads
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover student-led teams for Smart India Hackathon, Capstones, and Campus SaaS Startups.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Post a Project Opening</span>
        </button>
      </div>

      {/* 2. Filter Pills & Search */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, event (SIH, Capstone), or tech stack (Next.js, Python)..."
            className="w-full rounded-md border border-border bg-muted/40 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['All', 'Hackathon', 'Major Project', 'Campus Startup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                activeFilter === tab
                  ? 'bg-[#0a66c2] text-white'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab === 'All' ? 'All Opportunities' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Job / Squad Openings List (LinkedIn Style) */}
      <div className="space-y-2.5">
        {filteredTeams.map((team) => {
          const isCreator = team.creator.id === currentUser.id;
          const slotsLeft = team.totalSlots - team.filledSlots;

          return (
            <div
              key={team.id}
              className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-3 hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#0a66c2]/10 text-[#0a66c2] font-black text-lg shrink-0">
                    {team.eventName.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground hover:text-[#0a66c2] leading-snug">
                      {team.title}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {team.eventName} • <span className="font-semibold text-foreground">{team.eventType}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{COLLEGE_CONFIG.code} Campus</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {slotsLeft > 0 ? `${slotsLeft} slot(s) remaining` : 'Squad filled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                    {team.filledSlots}/{team.totalSlots} Filled
                  </span>
                </div>
              </div>

              <p className="text-xs text-foreground/85 leading-relaxed">
                {team.description}
              </p>

              {/* Roles needed pills */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Roles Open:
                </div>
                <div className="flex flex-wrap gap-1">
                  {team.rolesNeeded.map((r, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-muted/60 text-foreground px-2 py-0.5 rounded font-medium border border-border/60"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Creator info + Easy Apply Button */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <img
                    src={team.creator.avatar}
                    alt={team.creator.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span>Posted by {team.creator.name} ({team.creator.year})</span>
                </div>

                {isCreator ? (
                  <span className="text-[11px] font-bold text-muted-foreground italic">
                    Your Posting ({team.applications.length} applied)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setApplyingTeam(team);
                      setSelectedRole(team.rolesNeeded[0] || '');
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#0a66c2] text-white px-4 py-1 text-xs font-bold hover:bg-[#004182] transition-colors"
                  >
                    <Send className="h-3 w-3" />
                    <span>Easy Apply</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EASY APPLY MODAL */}
      {applyingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="font-bold text-sm text-foreground">Easy Apply to Team</h3>
                <p className="text-xs text-muted-foreground">{applyingTeam.title}</p>
              </div>
              <button onClick={() => setApplyingTeam(null)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Open Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                >
                  {applyingTeam.rolesNeeded.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Pitch Note</label>
                <textarea
                  rows={3}
                  required
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  placeholder={`Hi ${applyingTeam.creator.name.split(' ')[0]}, I have experience in this stack and would love to build this together...`}
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="rounded-md bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
                Your profile card (<strong>{currentUser.name} • {currentUser.year} {currentUser.branch}</strong>) will be submitted to the team lead.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingTeam(null)}
                  className="rounded-full border border-border px-3.5 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 my-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Post Project / Squad Opening</h3>
              <button onClick={() => setIsCreateOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous Campus Delivery Rover"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Event / Competition</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Smart India Hackathon"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Major Project">Major Project</option>
                    <option value="Campus Startup">Campus Startup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is your team building and what is the current milestone?"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Roles Needed (comma separated)</label>
                <input
                  type="text"
                  required
                  value={rolesNeeded}
                  onChange={(e) => setRolesNeeded(e.target.value)}
                  placeholder="Frontend Dev, UI/UX Designer, IoT BLE Specialist"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Total Slots</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-full border border-border px-3.5 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Post Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
