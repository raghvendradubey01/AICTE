'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Hash,
  Send,
  Code2,
  Users,
  CheckCircle2,
  Search,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { useCampus } from '@/context/CampusContext';
import { mockBatchChannels } from '@/data/mockData';

export default function MessagesPage() {
  const {
    currentUser,
    messages,
    sendMessage,
    activeChannel,
    setActiveChannel,
    students,
  } = useCampus();

  const [inputContent, setInputContent] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('cpp');
  const [codeSnippetText, setCodeSnippetText] = useState('');
  const [activeTab, setActiveTab] = useState<'channels' | 'dms'>('channels');
  const [selectedDmUser, setSelectedDmUser] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel, selectedDmUser]);

  const currentChannelInfo = mockBatchChannels.find((c) => c.id === activeChannel);
  const dmStudent = students.find((s) => s.id === selectedDmUser);

  const currentMessages = messages.filter((msg) => {
    if (activeTab === 'dms' && selectedDmUser) {
      return (
        (msg.sender.id === currentUser.id && msg.recipientId === selectedDmUser) ||
        (msg.sender.id === selectedDmUser && msg.recipientId === currentUser.id)
      );
    }
    return msg.channelId === activeChannel;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() && !codeSnippetText.trim()) return;

    sendMessage(
      activeChannel,
      inputContent.trim(),
      codeSnippetText.trim()
        ? { language: codeLanguage, code: codeSnippetText.trim() }
        : undefined,
      activeTab === 'dms' && selectedDmUser ? selectedDmUser : undefined
    );

    setInputContent('');
    setCodeSnippetText('');
    setIsCodeModalOpen(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] min-h-[560px] rounded-lg border border-border bg-card shadow-xs flex overflow-hidden text-left">
      
      {/* Left Column: LinkedIn Messaging Conversation List */}
      <div className="w-64 sm:w-80 border-r border-border bg-card flex flex-col shrink-0">
        
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-sm text-foreground">Messaging</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab('channels');
                setSelectedDmUser(null);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                activeTab === 'channels'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => {
                setActiveTab('dms');
                if (!selectedDmUser) setSelectedDmUser(students[1]?.id || null);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                activeTab === 'dms'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Direct
            </button>
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {activeTab === 'channels' && (
            <>
              {mockBatchChannels.map((channel) => {
                const isActive = activeChannel === channel.id;

                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full flex items-start gap-2.5 p-3 text-left transition-colors ${
                      isActive ? 'bg-muted/70 font-semibold' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0a66c2]/10 text-[#0a66c2] font-black shrink-0 mt-0.5">
                      #
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground truncate">{channel.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">Now</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                        {channel.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {activeTab === 'dms' && (
            <>
              {students
                .filter((s) => s.id !== currentUser.id)
                .map((student) => {
                  const isSelected = selectedDmUser === student.id;

                  return (
                    <button
                      key={student.id}
                      onClick={() => setSelectedDmUser(student.id)}
                      className={`w-full flex items-start gap-2.5 p-3 text-left transition-colors ${
                        isSelected ? 'bg-muted/70 font-semibold' : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                        />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-card" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground truncate">{student.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">Active</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                          {student.headline}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </>
          )}
        </div>

      </div>

      {/* Right Column: Active Thread */}
      <div className="flex-1 flex flex-col bg-card">
        
        {/* Active Conversation Header */}
        <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            {activeTab === 'channels' ? (
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1">
                  <span>#{currentChannelInfo?.name || activeChannel}</span>
                </h3>
                <p className="text-[10px] text-muted-foreground truncate">
                  {currentChannelInfo?.description}
                </p>
              </div>
            ) : (
              dmStudent && (
                <div className="flex items-center gap-2">
                  <img
                    src={dmStudent.avatar}
                    alt={dmStudent.name}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                  />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1">
                      <span>{dmStudent.name}</span>
                      <CheckCircle2 className="h-3 w-3 text-[#0a66c2]" />
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {dmStudent.year} • {dmStudent.branch} ({dmStudent.residence})
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-foreground" />
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-muted/10">
          {currentMessages.map((msg) => {
            const isMine = msg.sender.id === currentUser.id;

            return (
              <div key={msg.id} className={`flex items-start gap-2.5 text-xs ${isMine ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-border mt-0.5 shrink-0"
                />

                <div className={`max-w-md space-y-1 ${isMine ? 'text-right' : 'text-left'}`}>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="font-bold text-foreground">{msg.sender.name}</span>
                    <span>•</span>
                    <span>{msg.createdAt}</span>
                  </div>

                  <div
                    className={`rounded-lg p-2.5 text-xs leading-relaxed text-left ${
                      isMine
                        ? 'bg-[#0a66c2] text-white'
                        : 'bg-card border border-border text-foreground shadow-2xs'
                    }`}
                  >
                    <div>{msg.content}</div>

                    {msg.codeSnippet && (
                      <div className="mt-2 rounded bg-slate-950 p-2.5 text-[11px] font-mono text-emerald-400 overflow-x-auto shadow-inner">
                        <div className="text-[9px] uppercase text-slate-400 pb-1 mb-1 border-b border-slate-800">
                          {msg.codeSnippet.language} Code
                        </div>
                        <pre>{msg.codeSnippet.code}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-3 border-t border-border bg-card">
          {isCodeModalOpen && (
            <div className="mb-2 p-2.5 rounded-lg border border-border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[11px] text-foreground">Attach Code Snippet</span>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="rounded border border-border bg-card px-2 py-0.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="cpp">C++ (STL)</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                  <option value="verilog">Verilog</option>
                </select>
              </div>
              <textarea
                rows={3}
                value={codeSnippetText}
                onChange={(e) => setCodeSnippetText(e.target.value)}
                placeholder="Paste code snippet here..."
                className="w-full resize-none font-mono text-xs rounded border border-border bg-slate-950 text-emerald-400 p-2 focus:outline-none"
              />
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Attach Code"
            >
              <Code2 className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 rounded-full border border-border bg-muted/30 py-2 px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />

            <button
              type="submit"
              disabled={!inputContent.trim() && !codeSnippetText.trim()}
              className="rounded-full bg-[#0a66c2] text-white p-2 font-bold hover:bg-[#004182] disabled:opacity-40 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
