'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  AlertTriangle,
  Plus,
  Search,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { CampusClub, LostItem } from '@/types';
import { COLLEGE_CONFIG } from '@/lib/supabase';

export default function ClubsPage() {
  const {
    clubs,
    lostItems,
    reportLostItem,
    showToast,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'clubs' | 'lostfound'>('clubs');
  const [selectedClubCategory, setSelectedClubCategory] = useState<string>('All');

  // Lost & Found Modal
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
    setIsLostModalOpen(false);
  };

  const filteredClubs = clubs.filter((c) => {
    if (selectedClubCategory === 'All') return true;
    return c.category === selectedClubCategory;
  });

  return (
    <div className="space-y-3 text-left">
      
      {/* Header Card with LinkedIn Tabs */}
      <div className="rounded-lg border border-border bg-card shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              <span>Campus Societies, Groups & Alerts</span>
              <span className="text-[10px] font-semibold bg-[#0a66c2]/10 text-[#0a66c2] dark:text-[#70b5f9] px-2 py-0.5 rounded-full">
                Official Student Bodies
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Official collegiate societies at {COLLEGE_CONFIG.name}, audition timelines, and Lost & Found notice board.
            </p>
          </div>

          {activeTab === 'lostfound' && (
            <button
              onClick={() => setIsLostModalOpen(true)}
              className="rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors shrink-0"
            >
              + Post Notice
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('clubs')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'clubs' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Societies & Groups ({clubs.length})</span>
            {activeTab === 'clubs' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'lostfound' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Campus Lost & Found ({lostItems.length})</span>
            {activeTab === 'lostfound' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CLUBS */}
      {/* ======================================================== */}
      {activeTab === 'clubs' && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['All', 'Tech', 'Robotics', 'Entrepreneurship', 'Cultural'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedClubCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  selectedClubCategory === cat
                    ? 'bg-[#0a66c2] text-white'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl shrink-0">
                        {club.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{club.name}</h3>
                        <p className="text-[11px] text-muted-foreground">Lead: {club.lead}</p>
                        <span className="text-[10px] text-muted-foreground">{club.membersCount} student members</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded">
                      {club.category}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                    {club.description}
                  </p>

                  <div className="p-2.5 rounded-md bg-muted/40 border border-border/60 text-xs space-y-0.5">
                    <div className="font-bold text-[11px] text-foreground flex items-center justify-between">
                      <span>Event: {club.upcomingEvent.title}</span>
                      <span className="text-[10px] text-[#0a66c2] dark:text-[#70b5f9]">{club.upcomingEvent.type}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-0.5">
                      <span>{club.upcomingEvent.date}</span>
                      <span>{club.upcomingEvent.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <a href={`mailto:${club.contactEmail}`} className="text-[11px] text-muted-foreground hover:underline">
                    {club.contactEmail}
                  </a>

                  <button
                    onClick={() => showToast(`Joined ${club.name} group!`)}
                    className="rounded-full border border-[#0a66c2] text-[#0a66c2] dark:text-[#70b5f9] hover:bg-[#0a66c2]/10 px-3.5 py-1 font-bold text-xs transition-colors"
                  >
                    Join Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LOST & FOUND */}
      {/* ======================================================== */}
      {activeTab === 'lostfound' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {lostItems.map((item) => {
            const isLost = item.itemType === 'Lost';

            return (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isLost
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {item.itemType.toUpperCase()} NOTICE
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>

                <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{item.location}</span>
                </div>

                <div className="p-2 rounded bg-muted/40 text-xs text-foreground/90">
                  <span className="font-semibold text-[10px] uppercase text-muted-foreground block">
                    Contact / Instructions:
                  </span>
                  {item.contactInfo}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reported by {item.reporter.name}</span>
                  <button
                    onClick={() => showToast('Notice marked as resolved')}
                    className="font-bold text-[#0a66c2] hover:underline"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {isLostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Post Lost / Found Notice</h3>
              <button onClick={() => setIsLostModalOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleReportItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Notice Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setItemType('Lost')}
                    className={`py-1.5 rounded font-bold border ${
                      itemType === 'Lost'
                        ? 'border-red-500 bg-red-500/10 text-red-600'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemType('Found')}
                    className={`py-1.5 rounded font-bold border ${
                      itemType === 'Found'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Blue Boat Earphones / College ID"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Location on Campus</label>
                <input
                  type="text"
                  required
                  value={itemLocation}
                  onChange={(e) => setItemLocation(e.target.value)}
                  placeholder="e.g. Central Library 2nd floor desk"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Instructions</label>
                <input
                  type="text"
                  value={itemContact}
                  onChange={(e) => setItemContact(e.target.value)}
                  placeholder="e.g. Handed to librarian / WhatsApp 987..."
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLostModalOpen(false)}
                  className="rounded-full border border-border px-3.5 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
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
