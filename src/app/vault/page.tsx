'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  BookOpen,
  ShoppingBag,
  Download,
  ThumbsUp,
  PlusCircle,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  DollarSign,
  Heart,
  X,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import {
  AcademicResource,
  MarketplaceItem,
  ResourceCategory,
  GearCategory,
  StudentYear,
  Branch,
} from '@/types';

export default function VaultPage() {
  const {
    currentUser,
    resources,
    uploadResource,
    upvoteResource,
    downloadResource,
    marketplace,
    listMarketplaceItem,
    claimMarketplaceItem,
    showToast,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'notes' | 'marketplace'>('notes');

  // Academic Vault Filter State
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [notesSearch, setNotesSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Resource Form State
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('');
  const [resSubjectCode, setResSubjectCode] = useState('');
  const [resBranch, setResBranch] = useState<Branch>('CSE');
  const [resYear, setResYear] = useState<StudentYear>('2nd Year');
  const [resSemester, setResSemester] = useState<number>(3);
  const [resCategory, setResCategory] = useState<ResourceCategory>('PYQ');
  const [resFileSize, setResFileSize] = useState('3.5 MB');

  // Marketplace Filter State
  const [selectedGearCategory, setSelectedGearCategory] = useState<string>('All');
  const [onlyFree, setOnlyFree] = useState<boolean>(false);
  const [gearSearch, setGearSearch] = useState('');
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);

  // Gear Listing Form State
  const [gearTitle, setGearTitle] = useState('');
  const [gearDesc, setGearDesc] = useState('');
  const [gearCategory, setGearCategory] = useState<GearCategory>('Textbook');
  const [gearPrice, setGearPrice] = useState<number>(0);
  const [gearCondition, setGearCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [gearPickup, setGearPickup] = useState('Aryabhatta Hostel Gate');

  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical', 'Biotech', 'Design'];
  const categories: ResourceCategory[] = ['PYQ', 'Handwritten Notes', 'Lab Manual', 'Syllabus'];
  const gearCategories: GearCategory[] = ['Textbook', 'Lab Gear', 'Electronics', 'Cycle', 'Calculator', 'Room Essentials'];

  // Handle Resource Upload
  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resSubject.trim()) return;

    uploadResource({
      title: resTitle.trim(),
      subject: resSubject.trim(),
      subjectCode: resSubjectCode.trim() || 'ACAD-01',
      branch: resBranch,
      year: resYear,
      semester: Number(resSemester),
      category: resCategory,
      fileSize: resFileSize,
      fileFormat: 'PDF',
    });

    setResTitle('');
    setResSubject('');
    setResSubjectCode('');
    setIsUploadModalOpen(false);
  };

  // Handle Gear Listing
  const handleListGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gearTitle.trim() || !gearPickup.trim()) return;

    listMarketplaceItem({
      title: gearTitle.trim(),
      description: gearDesc.trim() || 'Available for pickup on campus.',
      category: gearCategory,
      price: Number(gearPrice),
      condition: gearCondition,
      pickupLocation: gearPickup.trim(),
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'],
    });

    setGearTitle('');
    setGearDesc('');
    setGearPrice(0);
    setIsGearModalOpen(false);
  };

  // Filtered Academic Resources
  const filteredResources = resources.filter((res) => {
    if (selectedSemester !== 'All' && res.semester !== Number(selectedSemester)) return false;
    if (selectedBranch !== 'All' && res.branch !== selectedBranch) return false;
    if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;
    if (notesSearch.trim()) {
      const q = notesSearch.toLowerCase();
      const matchesTitle = res.title.toLowerCase().includes(q);
      const matchesSubject = res.subject.toLowerCase().includes(q);
      const matchesCode = res.subjectCode.toLowerCase().includes(q);
      if (!matchesTitle && !matchesSubject && !matchesCode) return false;
    }
    return true;
  });

  // Filtered Marketplace Items
  const filteredMarketplace = marketplace.filter((item) => {
    if (selectedGearCategory !== 'All' && item.category !== selectedGearCategory) return false;
    if (onlyFree && item.price > 0) return false;
    if (gearSearch.trim()) {
      const q = gearSearch.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-emerald-950/70 via-background to-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Archive className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Academic & Gear Vault
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Access previous year question papers (PYQs), lab manuals, notes, and campus dorm gear exchange.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-muted p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'notes' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
            <span>PYQs & Notes Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'marketplace' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
            <span>Book & Gear Exchange</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACADEMIC VAULT (PYQS & NOTES) */}
      {/* ======================================================== */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={notesSearch}
                  onChange={(e) => setNotesSearch(e.target.value)}
                  placeholder="Search subject (e.g. Data Structures, OS, Mechanics) or code..."
                  className="w-full rounded-xl border border-border bg-muted/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors shrink-0"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Upload PYQ / Notes (+20 Karma)</span>
              </button>
            </div>

            {/* Select Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Semester (1 to 8)
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/20 p-2 text-foreground focus:outline-none"
                >
                  <option value="All">All Semesters (1–8)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Department
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/20 p-2 text-foreground focus:outline-none"
                >
                  <option value="All">All Branches</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Resource Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/20 p-2 text-foreground focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Sem {res.semester} • {res.branch}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {res.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug line-clamp-2">
                    {res.title}
                  </h3>

                  <div className="text-xs text-muted-foreground">
                    Subject: <span className="font-semibold text-foreground">{res.subject}</span> ({res.subjectCode})
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <img
                      src={res.uploader.avatar}
                      alt={res.uploader.name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span>Uploaded by {res.uploader.name}</span>
                    <span>•</span>
                    <span>{res.fileSize}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <button
                    onClick={() => upvoteResource(res.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      res.hasUpvoted
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{res.upvotes}</span>
                  </button>

                  <button
                    onClick={() => downloadResource(res.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF ({res.downloadsCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CAMPUS BOOK & GEAR EXCHANGE (MARKETPLACE) */}
      {/* ======================================================== */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          
          {/* Marketplace Controls */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={gearSearch}
                  onChange={(e) => setGearSearch(e.target.value)}
                  placeholder="Search drafter, Casio calculator, cycles, textbooks..."
                  className="w-full rounded-xl border border-border bg-muted/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setIsGearModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors shrink-0"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>List Gear / Book for Juniors</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedGearCategory('All')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    selectedGearCategory === 'All'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  }`}
                >
                  All Items
                </button>
                {gearCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedGearCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                      selectedGearCategory === cat
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-border text-muted-foreground hover:border-foreground/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyFree}
                  onChange={(e) => setOnlyFree(e.target.checked)}
                  className="rounded border-border text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-emerald-600 dark:text-emerald-400">Free / Donation Only (₹0)</span>
              </label>
            </div>
          </div>

          {/* Gear Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketplace.map((item) => {
              const isFree = item.price === 0;
              const isClaimed = item.status === 'claimed';

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-muted">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {isFree ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                            Free / Donate
                          </span>
                        ) : (
                          <span className="bg-slate-900/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-2 right-2 bg-background/90 text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {item.condition}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 text-emerald-500" />
                      <span className="truncate">{item.pickupLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border">
                      <img
                        src={item.seller.avatar}
                        alt={item.seller.name}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                      <span>By {item.seller.name} ({item.seller.year})</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isClaimed ? (
                      <div className="w-full text-center py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
                        Claimed by a student
                      </div>
                    ) : (
                      <button
                        onClick={() => claimMarketplaceItem(item.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isFree
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                        }`}
                      >
                        {isFree ? 'Claim Free Item' : `Contact Seller (₹${item.price})`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* UPLOAD ACADEMIC RESOURCE MODAL */}
      {/* ======================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <FileText className="h-5 w-5 text-indigo-500" />
                <span>Upload to Academic Vault</span>
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Operating Systems: Solved 5-Year PYQs (2020-2025)"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={resSubjectCode}
                    onChange={(e) => setResSubjectCode(e.target.value)}
                    placeholder="e.g. CS-402"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Semester</label>
                  <select
                    value={resSemester}
                    onChange={(e) => setResSemester(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Branch</label>
                  <select
                    value={resBranch}
                    onChange={(e) => setResBranch(e.target.value as Branch)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Type</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as ResourceCategory)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-1">
                <FileText className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="font-semibold text-foreground">Simulated Document Attachment</p>
                <p className="text-[10px] text-muted-foreground">PDF / Document file prepared for campus hosting (Mock ready)</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Publish Resource (+20 Karma)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIST GEAR MODAL */}
      {/* ======================================================== */}
      {isGearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <ShoppingBag className="h-5 w-5 text-emerald-500" />
                <span>List Campus Book / Gear</span>
              </h3>
              <button onClick={() => setIsGearModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleListGear} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={gearTitle}
                  onChange={(e) => setGearTitle(e.target.value)}
                  placeholder="e.g. Casio fx-991EX Calculator / Engineering Drafter"
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Category</label>
                  <select
                    value={gearCategory}
                    onChange={(e) => setGearCategory(e.target.value as GearCategory)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {gearCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Price (₹0 for Free Donation)</label>
                  <input
                    type="number"
                    min={0}
                    value={gearPrice}
                    onChange={(e) => setGearPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Condition</label>
                  <select
                    value={gearCondition}
                    onChange={(e) => setGearCondition(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Pickup Location on Campus</label>
                  <input
                    type="text"
                    required
                    value={gearPickup}
                    onChange={(e) => setGearPickup(e.target.value)}
                    placeholder="e.g. Aryabhatta Hostel Gate / Library"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Description / Notes for Junior</label>
                <textarea
                  rows={3}
                  value={gearDesc}
                  onChange={(e) => setGearDesc(e.target.value)}
                  placeholder="Explain condition, any included accessories, or when you are available to hand it over..."
                  className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGearModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  List Item on Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
