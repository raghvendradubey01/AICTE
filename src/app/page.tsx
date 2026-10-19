'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Send,
  MessageCircle,
  ThumbsUp,
  Share2,
  Tag,
  Sparkles,
  ShieldCheck,
  Pin,
  CheckCircle2,
  Users,
  Compass,
  Rocket,
  Archive,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { COLLEGE_CONFIG } from '@/lib/supabase';

export default function CampusPulsePage() {
  const {
    currentUser,
    posts,
    addPost,
    upvotePost,
    addPostComment,
    students,
    questions,
    teams,
    showToast,
  } = useCampus();

  const [newContent, setNewContent] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'year' | 'dept'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('General');
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'my-year' | 'my-dept' | 'pinned'>('all');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});

  const presetTags = ['Internships', 'Placements', 'Hackathon', 'ExamTips', 'Clubs', 'General'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    addPost(newContent.trim(), [selectedTag], selectedScope);
    setNewContent('');
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addPostComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  // Filter posts based on active feed tab
  const filteredPosts = posts.filter((post) => {
    if (activeFeedTab === 'pinned') return post.pinned;
    if (activeFeedTab === 'my-year') return post.author.year === currentUser.year || post.scope === 'year';
    if (activeFeedTab === 'my-dept') return post.author.branch === currentUser.branch || post.scope === 'dept';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Campus Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Intra-Campus Live Feed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to {COLLEGE_CONFIG.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Connect across batches. Freshers seek guidance, seniors share placement debriefs, and classmates build hackathon prototypes together.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/bridge"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-slate-100 transition-all shadow-sm"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-600" />
              <span>Ask a Senior</span>
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/60 border border-indigo-400/30 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-all"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Find Team</span>
            </Link>
          </div>
        </div>

        {/* Quick Statistics Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Verified Students</div>
            <div className="font-bold text-white text-base mt-0.5">{students.length * 160}+ on campus</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Senior Mentors</div>
            <div className="font-bold text-white text-base mt-0.5">
              {students.filter((s) => s.isMentor).length} Active Now
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Q&A Discussions</div>
            <div className="font-bold text-white text-base mt-0.5">{questions.length} Solved</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Open Hackathons</div>
            <div className="font-bold text-white text-base mt-0.5">{teams.length} Projects</div>
          </div>
        </div>
      </div>

      {/* Post Composer Card */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="flex-1">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={`Share an exam tip, internship update, or campus thought, ${currentUser.name.split(' ')[0]}...`}
              rows={3}
              className="w-full resize-none rounded-xl border border-border/80 bg-muted/30 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Audience Scope & Tag Selection Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-muted-foreground">Scope:</span>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedScope('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  selectedScope === 'all'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Campus
              </button>
              <button
                type="button"
                onClick={() => setSelectedScope('year')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  selectedScope === 'year'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {currentUser.year} Only
              </button>
              <button
                type="button"
                onClick={() => setSelectedScope('dept')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  selectedScope === 'dept'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {currentUser.branch} Dept
              </button>
            </div>

            {/* Tag Selection */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {presetTags.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-all ${
                    selectedTag === tag
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newContent.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-all self-end sm:self-auto"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish Pulse</span>
          </button>
        </div>
      </div>

      {/* Feed Filters Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFeedTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFeedTab === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>All Campus</span>
          </button>

          <button
            onClick={() => setActiveFeedTab('my-year')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFeedTab === 'my-year'
                ? 'bg-indigo-600 text-white'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>My Batch ({currentUser.year})</span>
          </button>

          <button
            onClick={() => setActiveFeedTab('my-dept')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFeedTab === 'my-dept'
                ? 'bg-indigo-600 text-white'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>My Dept ({currentUser.branch})</span>
          </button>

          <button
            onClick={() => setActiveFeedTab('pinned')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFeedTab === 'pinned'
                ? 'bg-indigo-600 text-white'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Pin className="h-3.5 w-3.5" />
            <span>Important / Pinned</span>
          </button>
        </div>

        <span className="text-xs text-muted-foreground hidden sm:block">
          Showing {filteredPosts.length} posts
        </span>
      </div>

      {/* Posts Feed Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentsOpen = Boolean(expandedComments[post.id]);

          return (
            <article
              key={post.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-indigo-500/30 space-y-3.5"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Link href={`/directory?student=${post.author.id}`}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20 hover:ring-indigo-500 transition-all"
                    />
                  </Link>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/directory?student=${post.author.id}`}
                        className="font-bold text-sm text-foreground hover:underline"
                      >
                        {post.author.name}
                      </Link>
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                        {post.author.year} • {post.author.branch}
                      </span>
                      {post.author.residence === 'Hostel' && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          Hostel
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <span className="capitalize text-indigo-600 dark:text-indigo-400 font-medium">
                        {post.scope === 'all' ? 'All Campus' : `${post.scope} only`}
                      </span>
                    </div>
                  </div>
                </div>

                {post.pinned && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <Pin className="h-3 w-3" />
                    <span>Pinned Announcement</span>
                  </span>
                )}
              </div>

              {/* Post Content */}
              <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {post.content}
              </div>

              {/* Post Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      <Tag className="h-2.5 w-2.5 text-indigo-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Interactions Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-border/80 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => upvotePost(post.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${
                      post.hasUpvoted
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-muted text-foreground transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Link copied to clipboard!');
                  }}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  title="Share post"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              {/* Collapsible Comments Section */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-border/60 space-y-3">
                  {/* Comments List */}
                  {post.comments.length > 0 ? (
                    <div className="space-y-2">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-2.5 text-xs"
                        >
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="h-6 w-6 rounded-full object-cover mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {comment.author.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {comment.createdAt}
                              </span>
                            </div>
                            <p className="mt-0.5 text-foreground/90">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No comments yet. Start the conversation!</p>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                      placeholder="Write a helpful response..."
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

    </div>
  );
}
