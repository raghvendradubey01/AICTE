'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  Compass,
  AlertTriangle,
  PlusCircle,
  Search,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { CampusClub, LostItem } from '@/types';

export default function ClubsPage() {
  const {
    clubs,
    lostItems,
    reportLostItem,
    showToast,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'clubs' | 'lostfound'>('clubs');
  const [selectedClubCategory, setSelectedClubCategory] = useState<string>('All');

  // Lost & Found Modal State
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [itemType, setItemType] = useState<'Lost' | 'Found'>('Lost');
  const [itemTitle, setItemTitle] = useState('');
  const [itemLocation, setItemLocation] = useState('');
  const [itemContact, setItemContact] = useState('');

  const handleReportItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !itemLocation.trim()) return;

    reportLostItem({
      itemType,
      title: itemTitle.trim(),
      location: itemLocation.trim(),
      date: 'Today',
      contactInfo: itemContact.trim() || 'Contact via CampusConnect DM',
    });

    setItemTitle('');
    setItemLocation('');
    setItemContact('');
    setIsLostModalOpen(false);
  };

  const filteredClubs = clubs.filter((c) => {
    if (selectedClubCategory === 'All') return true;
    return c.category === selectedClubCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-950/70 via-background to-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Clubs, Societies & Campus Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Discover student bodies, upcoming auditions, fest hackathons, and the campus Lost & Found board.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-muted p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('clubs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'clubs' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>Clubs Directory ({clubs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'lostfound' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Lost & Found ({lostItems.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CLUBS & SOCIETIES */}
      {/* ======================================================== */}
      {activeTab === 'clubs' && (
        <div className="space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Tech', 'Robotics', 'Entrepreneurship', 'Cultural'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedClubCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                  selectedClubCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl">
                        {club.logo}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-foreground leading-snug">
                          {club.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          Lead: {club.lead}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {club.membersCount} Members
                    </span>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {club.description}
                  </p>

                  {/* Upcoming Event Box */}
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px] flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>Upcoming Event: {club.upcomingEvent.title}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded">
                        {club.upcomingEvent.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{club.upcomingEvent.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{club.upcomingEvent.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <a
                    href={`mailto:${club.contactEmail}`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>{club.contactEmail}</span>
                  </a>

                  <button
                    onClick={() => showToast(`Joined ${club.name} interest channel! Check Batch Channels.`)}
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors"
                  >
                    <span>Join Society</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LOST & FOUND BOARD */}
      {/* ======================================================== */}
      {activeTab === 'lostfound' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Campus Lost & Found Alerts
            </h2>
            <button
              onClick={() => setIsLostModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-amber-700 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Report Lost / Found Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lostItems.map((item) => {
              const isLost = item.itemType === 'Lost';

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isLost
                          ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-500/20'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.itemType.toUpperCase()} ALERT
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-2.5 text-xs text-foreground/90 space-y-1">
                    <div className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                      Contact / Handover Info:
                    </div>
                    <div>{item.contactInfo}</div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Reported by {item.reporter.name}</span>
                    <button
                      onClick={() => showToast('Claim / Handover verified and resolved!')}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REPORT LOST / FOUND ITEM MODAL */}
      {/* ======================================================== */}
      {isLostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span>Report Lost / Found Notice</span>
              </h3>
              <button onClick={() => setIsLostModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReportItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Notice Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setItemType('Lost')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      itemType === 'Lost'
                        ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemType('Found')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      itemType === 'Found'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Item Title & Details</label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. College ID Card / Blue Earphones / Keys"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Exact Location on Campus</label>
                <input
                  type="text"
                  required
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  placeholder="e.g. Central Library 2nd floor desk / Canteen"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Contact / Handover Instructions</label>
                <input
                  type="text"
                  value={itemContact}
                  onChange={(e) => setItemContact(e.target.value)}
                  placeholder="e.g. Handed to librarian / WhatsApp: 98765..."
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLostModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
