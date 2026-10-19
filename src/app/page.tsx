'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Image,
  Calendar,
  FileText,
  Sparkles,
  MoreHorizontal,
  Globe,
  Users,
  Building,
  CheckCircle2,
  Plus,
  Share2,
  Bookmark,
  Pin,
  X,
  Smile,
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
    showToast,
  } = useCampus();

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postScope, setPostScope] = useState<'all' | 'year' | 'dept'>('all');
  const [postTag, setPostTag] = useState('PlacementSeason');
  const [activeSort, setActiveSort] = useState<'top' | 'recent'>('top');
  const [activeFeedFilter, setActiveFeedFilter] = useState<'all' | 'my-year' | 'my-dept'>('all');

  // Comment inputs per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [openComments, setOpenComments] = useState<{ [postId: string]: boolean }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    addPost(postContent.trim(), [postTag], postScope);
    setPostContent('');
    setIsComposerOpen(false);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addPostComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setOpenComments((prev) => ({ ...prev, [postId]: true }));
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFeedFilter === 'my-year') return post.author.year === currentUser.year || post.scope === 'year';
    if (activeFeedFilter === 'my-dept') return post.author.branch === currentUser.branch || post.scope === 'dept';
    return true;
  });

  return (
    <div className="space-y-2.5">
      
      {/* 1. LinkedIn-style Post Creator Card */}
      <div className="rounded-lg border border-border bg-card p-3 sm:p-4 shadow-xs text-left">
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
          />
          <button
            onClick={() => setIsComposerOpen(true)}
            className="flex-1 rounded-full border border-border/80 bg-muted/40 hover:bg-muted py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground transition-colors"
          >
            Start a campus post, share an interview tip or PYQ...
          </button>
        </div>

        {/* Action Buttons Row with colored LinkedIn icons */}
        <div className="flex items-center justify-around pt-3 mt-2 border-t border-border/60 text-xs text-muted-foreground font-semibold">
          <button
            onClick={() => {
              setPostTag('ProjectDemo');
              setIsComposerOpen(true);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 transition-colors"
          >
            <Image className="h-4 w-4 text-[#378fe9]" />
            <span className="text-[12px] text-foreground">Media</span>
          </button>

          <Link
            href="/clubs"
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 transition-colors"
          >
            <Calendar className="h-4 w-4 text-[#c37d16]" />
            <span className="text-[12px] text-foreground">Event</span>
          </Link>

          <Link
            href="/bridge"
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 transition-colors"
          >
            <FileText className="h-4 w-4 text-[#e06847]" />
            <span className="text-[12px] text-foreground">Placement Article</span>
          </Link>

          <button
            onClick={() => {
              setPostTag('ExamTips');
              setIsComposerOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/60 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-[#7fc15e]" />
            <span className="text-[12px] text-foreground">Exam Tip</span>
          </button>
        </div>
      </div>

      {/* 2. LinkedIn Feed Filter / Sort Divider */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveFeedFilter('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              activeFeedFilter === 'all'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            All Campus
          </button>
          <button
            onClick={() => setActiveFeedFilter('my-year')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              activeFeedFilter === 'my-year'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            My Batch ({currentUser.year})
          </button>
          <button
            onClick={() => setActiveFeedFilter('my-dept')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              activeFeedFilter === 'my-dept'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            My Dept ({currentUser.branch})
          </button>
        </div>

        <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-semibold">
          <span>Sort by:</span>
          <span className="text-foreground font-bold cursor-pointer">Top ▾</span>
        </div>
      </div>

      {/* 3. Feed Posts Stream (LinkedIn Post Cards) */}
      <div className="space-y-2.5">
        {filteredPosts.map((post) => {
          const isCommentsOpen = Boolean(openComments[post.id]);

          return (
            <article
              key={post.id}
              className="rounded-lg border border-border bg-card p-3.5 sm:p-4 shadow-xs text-left"
            >
              {/* Pinned Indicator (if applicable) */}
              {post.pinned && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold pb-2 mb-2 border-b border-border/60">
                  <Pin className="h-3.5 w-3.5 text-[#0a66c2]" />
                  <span>Pinned by Campus Placement & Academic Council</span>
                </div>
              )}

              {/* Author Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Link href={`/directory?student=${post.author.id}`}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-11 w-11 rounded-full object-cover ring-1 ring-border mt-0.5"
                    />
                  </Link>

                  <div>
                    <div className="flex items-center gap-1 flex-wrap leading-tight">
                      <Link
                        href={`/directory?student=${post.author.id}`}
                        className="font-bold text-xs sm:text-sm text-foreground hover:text-[#0a66c2] hover:underline"
                      >
                        {post.author.name}
                      </Link>
                      <span className="text-[10px] text-muted-foreground">• 1st</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0a66c2] shrink-0" />
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1 mt-0.5">
                      {post.author.headline}
                    </p>

                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Globe className="h-2.5 w-2.5" />
                        <span>{COLLEGE_CONFIG.code} Campus</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Post Body */}
              <div className="mt-3 text-xs sm:text-[13px] leading-relaxed text-foreground whitespace-pre-line font-normal">
                {post.content}
              </div>

              {/* Hashtags */}
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* LinkedIn Reaction Counts Row */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60">
                <div className="flex items-center gap-1">
                  <span className="flex -space-x-1">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0a66c2] text-white text-[9px]">
                      👍
                    </span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#7fc15e] text-white text-[9px]">
                      💡
                    </span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#e06847] text-white text-[9px]">
                      👏
                    </span>
                  </span>
                  <span className="font-semibold text-foreground ml-1">{post.upvotes}</span>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <button
                    onClick={() =>
                      setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="hover:underline"
                  >
                    {post.comments.length} comments
                  </button>
                </div>
              </div>

              {/* LinkedIn-style Action Buttons Bar */}
              <div className="mt-1 pt-1 border-t border-border/80 grid grid-cols-4 gap-1 text-xs font-semibold text-muted-foreground">
                <button
                  onClick={() => upvotePost(post.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded hover:bg-muted/60 transition-colors ${
                    post.hasUpvoted ? 'text-[#0a66c2] dark:text-[#70b5f9]' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                  <span className="text-[11px] sm:text-xs">Like</span>
                </button>

                <button
                  onClick={() =>
                    setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                  }
                  className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-[11px] sm:text-xs">Comment</span>
                </button>

                <button
                  onClick={() => showToast('Post shared to batch channel!')}
                  className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Repeat2 className="h-4 w-4" />
                  <span className="text-[11px] sm:text-xs">Repost</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Link copied to clipboard');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span className="text-[11px] sm:text-xs">Send</span>
                </button>
              </div>

              {/* LinkedIn-style Comments Thread */}
              {isCommentsOpen && (
                <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
                  {/* Add comment row */}
                  <div className="flex items-start gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-border mt-0.5"
                    />
                    <div className="flex-1 flex gap-1.5">
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
                        placeholder="Add a comment..."
                        className="flex-1 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="rounded-full bg-[#0a66c2] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#004182] transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* List of comments */}
                  <div className="space-y-2 pl-9">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">
                            {comment.author.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {comment.createdAt}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {comment.author.year} • {comment.author.branch}
                        </div>
                        <p className="text-foreground/90 leading-relaxed pt-0.5">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* LINKEDIN-STYLE POST COMPOSER MODAL */}
      {/* ======================================================== */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-4 shadow-2xl space-y-4 animate-in fade-in duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <h3 className="font-bold text-sm text-foreground">{currentUser.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                    <select
                      value={postScope}
                      onChange={(e) => setPostScope(e.target.value as any)}
                      className="rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[11px] text-foreground focus:outline-none"
                    >
                      <option value="all">🌐 Anyone on Campus</option>
                      <option value="year">👥 {currentUser.year} Only</option>
                      <option value="dept">🏛️ {currentUser.branch} Dept Only</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                rows={5}
                required
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What do you want to talk about? (e.g. hackathon ideas, interview experience, course advice)"
                className="w-full resize-none border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 leading-relaxed"
              />

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground">Topic Tag:</span>
                <select
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground focus:outline-none"
                >
                  <option value="PlacementSeason">#PlacementSeason</option>
                  <option value="InternshipOpportunity">#InternshipOpportunity</option>
                  <option value="ExamTips">#ExamTips</option>
                  <option value="HackathonTeam">#HackathonTeam</option>
                  <option value="CampusLife">#CampusLife</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Image className="h-4 w-4 cursor-pointer hover:text-foreground" />
                  <Calendar className="h-4 w-4 cursor-pointer hover:text-foreground" />
                  <Smile className="h-4 w-4 cursor-pointer hover:text-foreground" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!postContent.trim()}
                    className="px-4 py-1.5 rounded-full bg-[#0a66c2] text-white text-xs font-bold shadow hover:bg-[#004182] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
