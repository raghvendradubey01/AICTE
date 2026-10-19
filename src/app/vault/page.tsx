'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Archive,
  BookOpen,
  ShoppingBag,
  Download,
  ThumbsUp,
  Plus,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  X,
  Sparkles,
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
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'notes' | 'marketplace'>('notes');

  // Academic Filter
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [notesSearch, setNotesSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('');
  const [resSubjectCode, setResSubjectCode] = useState('');
  const [resBranch, setResBranch] = useState<Branch>('CSE');
  const [resYear, setResYear] = useState<StudentYear>('2nd Year');
  const [resSemester, setResSemester] = useState<number>(3);
  const [resCategory, setResCategory] = useState<ResourceCategory>('PYQ');

  // Marketplace Filter
  const [gearSearch, setGearSearch] = useState('');
  const [selectedGearCategory, setSelectedGearCategory] = useState<string>('All');
  const [onlyFree, setOnlyFree] = useState<boolean>(false);
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);

  // Gear Listing Form
  const [gearTitle, setGearTitle] = useState('');
  const [gearDesc, setGearDesc] = useState('');
  const [gearCategory, setGearCategory] = useState<GearCategory>('Textbook');
  const [gearPrice, setGearPrice] = useState<number>(0);
  const [gearPickup, setGearPickup] = useState('Aryabhatta Hostel Gate');

  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Chemical', 'Biotech', 'Design'];
  const categories: ResourceCategory[] = ['PYQ', 'Handwritten Notes', 'Lab Manual', 'Syllabus'];
  const gearCategories: GearCategory[] = ['Textbook', 'Lab Gear', 'Electronics', 'Cycle', 'Calculator', 'Room Essentials'];

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
      fileSize: '3.8 MB',
      fileFormat: 'PDF',
    });

    setResTitle('');
    setResSubject('');
    setIsUploadModalOpen(false);
  };

  const handleListGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gearTitle.trim()) return;

    listMarketplaceItem({
      title: gearTitle.trim(),
      description: gearDesc.trim() || 'Available for campus pickup.',
      category: gearCategory,
      price: Number(gearPrice),
      condition: 'Like New',
      pickupLocation: gearPickup.trim(),
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'],
    });

    setGearTitle('');
    setGearDesc('');
    setGearPrice(0);
    setIsGearModalOpen(false);
  };

  const filteredResources = resources.filter((res) => {
    if (selectedSemester !== 'All' && res.semester !== Number(selectedSemester)) return false;
    if (selectedBranch !== 'All' && res.branch !== selectedBranch) return false;
    if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;
    if (notesSearch.trim()) {
      const q = notesSearch.toLowerCase();
      if (!res.title.toLowerCase().includes(q) && !res.subject.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const filteredMarketplace = marketplace.filter((item) => {
    if (selectedGearCategory !== 'All' && item.category !== selectedGearCategory) return false;
    if (onlyFree && item.price > 0) return false;
    if (gearSearch.trim()) {
      const q = gearSearch.toLowerCase();
      if (!item.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-3 text-left">
      
      {/* Header Card */}
      <div className="rounded-lg border border-border bg-card shadow-xs">
        <div className="p-3.5 sm:p-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              <span>Academic & Gear Vault</span>
              <span className="text-[10px] font-semibold bg-[#0a66c2]/10 text-[#0a66c2] dark:text-[#70b5f9] px-2 py-0.5 rounded-full">
                Semester Repository
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified PYQs, handwritten class notes, lab manuals, and passing-out dorm equipment exchange.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'notes' ? (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors"
              >
                + Upload Notes / PYQ
              </button>
            ) : (
              <button
                onClick={() => setIsGearModalOpen(true)}
                className="rounded-full bg-[#0a66c2] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors"
              >
                + List Gear / Book
              </button>
            )}
          </div>
        </div>

        {/* LinkedIn Tabs Header */}
        <div className="flex items-center px-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'notes' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Notes & PYQ Repository ({resources.length})</span>
            {activeTab === 'notes' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-3 px-3 relative transition-colors ${
              activeTab === 'marketplace' ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Campus Book & Gear Exchange ({marketplace.length})</span>
            {activeTab === 'marketplace' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACADEMIC VAULT */}
      {/* ======================================================== */}
      {activeTab === 'notes' && (
        <div className="space-y-2.5">
          {/* Filter Bar */}
          <div className="rounded-lg border border-border bg-card p-3 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={notesSearch}
                onChange={(e) => setNotesSearch(e.target.value)}
                placeholder="Search subject (e.g. Data Structures, Operating Systems, Math)..."
                className="w-full rounded-md border border-border bg-muted/40 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="rounded-md border border-border bg-muted/40 p-1.5 text-foreground text-xs focus:outline-none"
              >
                <option value="All">All Semesters (1–8)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="rounded-md border border-border bg-muted/40 p-1.5 text-foreground text-xs focus:outline-none"
              >
                <option value="All">All Branches</option>
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-border bg-muted/40 p-1.5 text-foreground text-xs focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources List */}
          <div className="space-y-2.5">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-2.5 hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0a66c2]/10 text-[#0a66c2] font-black shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground leading-snug">{res.title}</h3>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {res.subject} ({res.subjectCode}) • Semester {res.semester} • {res.branch}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Uploaded by {res.uploader.name} • {res.fileSize}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded shrink-0">
                    {res.category}
                  </span>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <button
                    onClick={() => upvoteResource(res.id)}
                    className={`flex items-center gap-1.5 py-1 px-2.5 rounded font-semibold text-xs ${
                      res.hasUpvoted ? 'text-[#0a66c2]' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{res.upvotes}</span>
                  </button>

                  <button
                    onClick={() => downloadResource(res.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0a66c2] text-white px-3.5 py-1 text-xs font-bold hover:bg-[#004182] transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download PDF ({res.downloadsCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CAMPUS GEAR EXCHANGE */}
      {/* ======================================================== */}
      {activeTab === 'marketplace' && (
        <div className="space-y-2.5">
          <div className="rounded-lg border border-border bg-card p-3 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={gearSearch}
                onChange={(e) => setGearSearch(e.target.value)}
                placeholder="Search calculators, drafters, textbooks, cycles..."
                className="w-full rounded-md border border-border bg-muted/40 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap gap-1">
                {['All', ...gearCategories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedGearCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                      selectedGearCategory === cat
                        ? 'bg-[#0a66c2] text-white'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
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
                  className="rounded border-border text-[#0a66c2]"
                />
                <span className="text-[#0a66c2] dark:text-[#70b5f9]">Free / Donation Only (₹0)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredMarketplace.map((item) => {
              const isFree = item.price === 0;
              const isClaimed = item.status === 'claimed';

              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-card p-3 shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative h-36 w-full rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {isFree ? 'Free / Donate' : `₹${item.price}`}
                      </span>
                      <span className="absolute bottom-2 right-2 bg-card/90 text-foreground text-[10px] font-medium px-1.5 py-0.5 rounded">
                        {item.condition}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#0a66c2]" />
                      <span className="truncate">{item.pickupLocation}</span>
                    </div>
                  </div>

                  <div>
                    {isClaimed ? (
                      <div className="w-full text-center py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        Claimed
                      </div>
                    ) : (
                      <button
                        onClick={() => claimMarketplaceItem(item.id)}
                        className={`w-full py-1 rounded-full text-xs font-bold transition-colors ${
                          isFree
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
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

      {/* UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 my-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Upload Notes / PYQ</h3>
              <button onClick={() => setIsUploadModalOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleUploadResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. Operating Systems: 5-Year Solved PYQs"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    placeholder="Operating Systems"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Code</label>
                  <input
                    type="text"
                    value={resSubjectCode}
                    onChange={(e) => setResSubjectCode(e.target.value)}
                    placeholder="CS-402"
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Semester</label>
                  <select
                    value={resSemester}
                    onChange={(e) => setResSemester(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Branch</label>
                  <select
                    value={resBranch}
                    onChange={(e) => setResBranch(e.target.value as Branch)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as ResourceCategory)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-full border border-border px-3.5 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  Upload Resource (+20 Karma)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GEAR LISTING MODAL */}
      {isGearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 my-6 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">List Gear / Textbook</h3>
              <button onClick={() => setIsGearModalOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleListGear} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={gearTitle}
                  onChange={(e) => setGearTitle(e.target.value)}
                  placeholder="e.g. Casio fx-991EX Calculator / Drafter"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={gearCategory}
                    onChange={(e) => setGearCategory(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  >
                    {gearCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (₹0 = Free)</label>
                  <input
                    type="number"
                    min={0}
                    value={gearPrice}
                    onChange={(e) => setGearPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Pickup Location</label>
                <input
                  type="text"
                  required
                  value={gearPickup}
                  onChange={(e) => setGearPickup(e.target.value)}
                  placeholder="Aryabhatta Hostel Gate"
                  className="w-full rounded-md border border-border bg-muted/40 p-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGearModalOpen(false)}
                  className="rounded-full border border-border px-3.5 py-1 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#0a66c2] text-white px-4 py-1 font-bold hover:bg-[#004182]"
                >
                  List Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
