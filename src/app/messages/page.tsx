'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Hash,
  Send,
  Code2,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Smile,
  ShieldCheck,
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

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel, selectedDmUser]);

  const currentChannelInfo = mockBatchChannels.find((c) => c.id === activeChannel);
  const dmStudent = students.find((s) => s.id === selectedDmUser);

  // Filter messages for current active channel or DM
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
    <div className="h-[calc(100vh-140px)] min-h-[580px] rounded-3xl border border-border bg-card shadow-sm flex overflow-hidden">
      
      {/* Left Column: Channels & DMs List */}
      <div className="w-64 sm:w-72 border-r border-border bg-muted/20 flex flex-col">
        
        {/* Toggle Channels vs Direct Messages */}
        <div className="p-3 border-b border-border">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 text-xs">
            <button
              onClick={() => {
                setActiveTab('channels');
                setSelectedDmUser(null);
              }}
              className={`py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'channels'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Batch Channels
            </button>
            <button
              onClick={() => {
                setActiveTab('dms');
                if (!selectedDmUser) setSelectedDmUser(students[1]?.id || null);
              }}
              className={`py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'dms'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Direct Chats
            </button>
          </div>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === 'channels' && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Intra-Campus Batch Rooms
              </div>
              {mockBatchChannels.map((channel) => {
                const isActive = activeChannel === channel.id;

                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Hash className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                    <div className="truncate">
                      <div className="truncate leading-none">{channel.name}</div>
                      <div className={`text-[10px] mt-1 truncate ${isActive ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                        {channel.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {activeTab === 'dms' && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Mentors & Classmates
              </div>
              {students
                .filter((s) => s.id !== currentUser.id)
                .map((student) => {
                  const isSelected = selectedDmUser === student.id;

                  return (
                    <button
                      key={student.id}
                      onClick={() => setSelectedDmUser(student.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-background" />
                        </div>
                        <div className="truncate">
                          <div className={`leading-none truncate ${isSelected ? 'text-white font-bold' : 'text-foreground'}`}>
                            {student.name}
                          </div>
                          <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                            {student.year} • {student.branch}
                          </div>
                        </div>
                      </div>

                      {student.isMentor && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                          isSelected ? 'bg-indigo-700 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                        }`}>
                          Mentor
                        </span>
                      )}
                    </button>
                  );
                })}
            </>
          )}
        </div>

      </div>

      {/* Right Column: Chat Stream & Message Input */}
      <div className="flex-1 flex flex-col bg-card">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-border px-5 flex items-center justify-between bg-card/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2.5">
            {activeTab === 'channels' ? (
              <>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    #{currentChannelInfo?.name || activeChannel}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {currentChannelInfo?.description}
                  </p>
                </div>
              </>
            ) : (
              dmStudent && (
                <>
                  <img
                    src={dmStudent.avatar}
                    alt={dmStudent.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <span>{dmStudent.name}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {dmStudent.year} • {dmStudent.branch} ({dmStudent.residence})
                    </p>
                  </div>
                </>
              )
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline">Active Campus Realtime</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground space-y-2">
              <MessageSquare className="h-8 w-8 text-indigo-500/50" />
              <p className="font-semibold text-sm text-foreground">No messages in this thread yet.</p>
              <p className="text-xs">Say hello or ask a question to break the ice!</p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMine = msg.sender.id === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 text-xs ${isMine ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.sender.avatar}
                    alt={msg.sender.name}
                    className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5"
                  />

                  <div className={`max-w-md space-y-1 ${isMine ? 'items-end text-right' : ''}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="font-bold text-foreground">{msg.sender.name}</span>
                      <span>({msg.sender.year} • {msg.sender.branch})</span>
                      <span>•</span>
                      <span>{msg.createdAt}</span>
                    </div>

                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-tr-none text-left'
                          : 'bg-muted/50 border border-border text-foreground rounded-tl-none'
                      }`}
                    >
                      <div>{msg.content}</div>

                      {/* Code Snippet Box */}
                      {msg.codeSnippet && (
                        <div className="mt-2 rounded-xl bg-slate-950 p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto text-left shadow-inner">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 mb-1 border-b border-slate-800">
                            <span className="uppercase">{msg.codeSnippet.language}</span>
                            <span>Code Snippet</span>
                          </div>
                          <pre>{msg.codeSnippet.code}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer Bar */}
        <div className="p-3 sm:p-4 border-t border-border bg-card">
          {/* Optional Code Snippet Drawer */}
          {isCodeModalOpen && (
            <div className="mb-3 p-3 rounded-2xl border border-border bg-muted/30 space-y-2 animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Attach Code Snippet</span>
                </span>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="rounded-lg border border-border bg-card px-2 py-0.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="cpp">C++ (STL)</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript / React</option>
                  <option value="verilog">Verilog HDL</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <textarea
                rows={3}
                value={codeSnippetText}
                onChange={(e) => setCodeSnippetText(e.target.value)}
                placeholder="Paste code snippet here..."
                className="w-full resize-none font-mono text-xs rounded-xl border border-border bg-slate-950 text-emerald-400 p-2.5 focus:outline-none"
              />
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isCodeModalOpen
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title="Attach Code Snippet"
            >
              <Code2 className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder={`Message #${currentChannelInfo?.name || 'channel'}...`}
              className="flex-1 rounded-xl border border-border bg-muted/30 py-2.5 px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:bg-background focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputContent.trim() && !codeSnippetText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
