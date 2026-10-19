'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  CampusPost,
  MentorshipQuestion,
  PlacementChronicle,
  TeamListing,
  AcademicResource,
  MarketplaceItem,
  ChatMessage,
  CampusClub,
  LostItem,
  NotificationItem,
  MentorshipSessionRequest,
} from '@/types';
import {
  mockStudents,
  initialCurrentUser,
  mockPosts,
  mockQuestions,
  mockChronicles,
  mockTeams,
  mockResources,
  mockMarketplace,
  mockClubs,
  mockLostItems,
  mockMessages,
  mockNotifications,
} from '@/data/mockData';
import { isSupabaseConfigured, COLLEGE_CONFIG } from '@/lib/supabase';

interface CampusContextType {
  currentUser: StudentProfile;
  setCurrentUser: (user: StudentProfile) => void;
  switchUserById: (id: string) => void;
  updateCurrentUserProfile: (updates: Partial<StudentProfile>) => void;
  registerNewStudent: (profile: Omit<StudentProfile, 'id' | 'karmaPoints' | 'isVerified' | 'joinedAt'>) => StudentProfile;
  
  students: StudentProfile[];
  posts: CampusPost[];
  addPost: (content: string, tags: string[], scope?: 'all' | 'year' | 'dept') => void;
  upvotePost: (id: string) => void;
  addPostComment: (postId: string, content: string) => void;

  questions: MentorshipQuestion[];
  askQuestion: (title: string, content: string, targetYear: StudentProfile['year'], tags: string[]) => void;
  answerQuestion: (questionId: string, content: string) => void;
  upvoteQuestion: (questionId: string) => void;
  upvoteAnswer: (questionId: string, answerId: string) => void;

  chronicles: PlacementChronicle[];
  addChronicle: (data: Omit<PlacementChronicle, 'id' | 'author' | 'upvotes' | 'createdAt'>) => void;
  upvoteChronicle: (id: string) => void;

  teams: TeamListing[];
  createTeamListing: (data: Omit<TeamListing, 'id' | 'creator' | 'filledSlots' | 'applications' | 'createdAt' | 'status'>) => void;
  applyToTeam: (listingId: string, roleApplied: string, pitchNote: string, portfolioLink?: string) => void;

  resources: AcademicResource[];
  uploadResource: (data: Omit<AcademicResource, 'id' | 'uploader' | 'upvotes' | 'downloadsCount' | 'createdAt'>) => void;
  upvoteResource: (id: string) => void;
  downloadResource: (id: string) => void;

  marketplace: MarketplaceItem[];
  listMarketplaceItem: (data: Omit<MarketplaceItem, 'id' | 'seller' | 'status' | 'createdAt'>) => void;
  claimMarketplaceItem: (id: string) => void;

  clubs: CampusClub[];
  lostItems: LostItem[];
  reportLostItem: (item: Omit<LostItem, 'id' | 'reporter' | 'status'>) => void;

  messages: ChatMessage[];
  activeChannel: string;
  setActiveChannel: (channel: string) => void;
  sendMessage: (channelId: string, content: string, codeSnippet?: { language: string; code: string }, recipientId?: string) => void;

  mentorshipRequests: MentorshipSessionRequest[];
  requestMentorshipSession: (seniorId: string, topic: string, message: string, preferredDate: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;

  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  isMockMode: boolean;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentProfile>(initialCurrentUser);
  const [students, setStudents] = useState<StudentProfile[]>(mockStudents);
  const [posts, setPosts] = useState<CampusPost[]>(mockPosts);
  const [questions, setQuestions] = useState<MentorshipQuestion[]>(mockQuestions);
  const [chronicles, setChronicles] = useState<PlacementChronicle[]>(mockChronicles);
  const [teams, setTeams] = useState<TeamListing[]>(mockTeams);
  const [resources, setResources] = useState<AcademicResource[]>(mockResources);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(mockMarketplace);
  const [clubs] = useState<CampusClub[]>(mockClubs);
  const [lostItems, setLostItems] = useState<LostItem[]>(mockLostItems);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [activeChannel, setActiveChannel] = useState<string>('3rd-year-internships');
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipSessionRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize theme from system or preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('campus_theme') as 'light' | 'dark' | null;
    const initial = savedTheme || 'dark';
    setTheme(initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('campus_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearToast = () => setToast(null);

  const switchUserById = (id: string) => {
    const target = students.find((s) => s.id === id);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched perspective to ${target.name} (${target.year} • ${target.branch})`, 'info');
    }
  };

  const updateCurrentUserProfile = (updates: Partial<StudentProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      setStudents((all) => all.map((s) => (s.id === prev.id ? updated : s)));
      return updated;
    });
    showToast('Profile updated successfully!');
  };

  const registerNewStudent = (
    data: Omit<StudentProfile, 'id' | 'karmaPoints' | 'isVerified' | 'joinedAt'>
  ): StudentProfile => {
    const newStudent: StudentProfile = {
      ...data,
      id: `student-${Date.now()}`,
      karmaPoints: 20,
      isVerified: true,
      joinedAt: 'Just now',
    };
    setStudents((prev) => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    showToast(`Welcome to CampusConnect, ${newStudent.name}! Verified with institutional ID.`, 'success');
    return newStudent;
  };

  // Posts
  const addPost = (content: string, tags: string[], scope: 'all' | 'year' | 'dept' = 'all') => {
    const newPost: CampusPost = {
      id: `post-${Date.now()}`,
      author: currentUser,
      content,
      tags,
      scope,
      targetYear: scope === 'year' ? currentUser.year : undefined,
      targetDept: scope === 'dept' ? currentUser.branch : undefined,
      upvotes: 1,
      hasUpvoted: true,
      comments: [],
      createdAt: 'Just now',
    };
    setPosts((prev) => [newPost, ...prev]);
    // Award 5 karma points
    updateCurrentUserProfile({ karmaPoints: currentUser.karmaPoints + 5 });
    showToast('Post published to Campus Pulse (+5 Karma)');
  };

  const upvotePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasUpvoted = !p.hasUpvoted;
          return {
            ...p,
            hasUpvoted,
            upvotes: hasUpvoted ? p.upvotes + 1 : p.upvotes - 1,
          };
        }
        return p;
      })
    );
  };

  const addPostComment = (postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c-${Date.now()}`,
                author: currentUser,
                content,
                createdAt: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
    showToast('Comment added');
  };

  // Senior-Junior Bridge (Q&A)
  const askQuestion = (title: string, content: string, targetYear: StudentProfile['year'], tags: string[]) => {
    const newQuestion: MentorshipQuestion = {
      id: `q-${Date.now()}`,
      author: currentUser,
      title,
      content,
      targetYear,
      tags,
      upvotes: 1,
      hasUpvoted: true,
      answers: [],
      isResolved: false,
      createdAt: 'Just now',
    };
    setQuestions((prev) => [newQuestion, ...prev]);
    showToast('Question posted on Senior Bridge forum!');
  };

  const answerQuestion = (questionId: string, content: string) => {
    const isSenior = currentUser.year === '3rd Year' || currentUser.year === '4th Year';
    const newAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      author: currentUser,
      content,
      upvotes: 1,
      hasUpvoted: true,
      isSeniorVerified: isSenior,
      createdAt: 'Just now',
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, newAnswer],
          };
        }
        return q;
      })
    );
    // Seniors earn 15 karma for answering
    if (isSenior) {
      updateCurrentUserProfile({ karmaPoints: currentUser.karmaPoints + 15 });
      showToast('Answer submitted with "Verified Senior" badge! (+15 Karma)');
    } else {
      showToast('Answer submitted!');
    }
  };

  const upvoteQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const hasUpvoted = !q.hasUpvoted;
          return {
            ...q,
            hasUpvoted,
            upvotes: hasUpvoted ? q.upvotes + 1 : q.upvotes - 1,
          };
        }
        return q;
      })
    );
  };

  const upvoteAnswer = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((a) => {
              if (a.id === answerId) {
                const hasUpvoted = !a.hasUpvoted;
                return {
                  ...a,
                  hasUpvoted,
                  upvotes: hasUpvoted ? a.upvotes + 1 : a.upvotes - 1,
                };
              }
              return a;
            }),
          };
        }
        return q;
      })
    );
  };

  // Placement Chronicles
  const addChronicle = (data: Omit<PlacementChronicle, 'id' | 'author' | 'upvotes' | 'createdAt'>) => {
    const newChronicle: PlacementChronicle = {
      ...data,
      id: `chronicle-${Date.now()}`,
      author: currentUser,
      upvotes: 1,
      hasUpvoted: true,
      createdAt: 'Just now',
    };
    setChronicles((prev) => [newChronicle, ...prev]);
    updateCurrentUserProfile({ karmaPoints: currentUser.karmaPoints + 30 });
    showToast(`Placement chronicle for ${data.companyName} published! (+30 Karma)`);
  };

  const upvoteChronicle = (id: string) => {
    setChronicles((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const hasUpvoted = !c.hasUpvoted;
          return {
            ...c,
            hasUpvoted,
            upvotes: hasUpvoted ? c.upvotes + 1 : c.upvotes - 1,
          };
        }
        return c;
      })
    );
  };

  // Teams
  const createTeamListing = (data: Omit<TeamListing, 'id' | 'creator' | 'filledSlots' | 'applications' | 'createdAt' | 'status'>) => {
    const newListing: TeamListing = {
      ...data,
      id: `team-${Date.now()}`,
      creator: currentUser,
      filledSlots: 1,
      status: 'Open',
      applications: [],
      createdAt: 'Just now',
    };
    setTeams((prev) => [newListing, ...prev]);
    showToast('Team listing published on Build Together board!');
  };

  const applyToTeam = (listingId: string, roleApplied: string, pitchNote: string, portfolioLink?: string) => {
    const application = {
      id: `app-${Date.now()}`,
      listingId,
      applicant: currentUser,
      roleApplied,
      pitchNote,
      portfolioLink,
      status: 'pending' as const,
      createdAt: 'Just now',
    };

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === listingId) {
          return {
            ...t,
            applications: [...t.applications, application],
          };
        }
        return t;
      })
    );
    showToast(`Applied for "${roleApplied}" on this project!`, 'success');
  };

  // Academic Vault
  const uploadResource = (data: Omit<AcademicResource, 'id' | 'uploader' | 'upvotes' | 'downloadsCount' | 'createdAt'>) => {
    const newRes: AcademicResource = {
      ...data,
      id: `res-${Date.now()}`,
      uploader: currentUser,
      upvotes: 1,
      hasUpvoted: true,
      downloadsCount: 0,
      createdAt: 'Just now',
    };
    setResources((prev) => [newRes, ...prev]);
    updateCurrentUserProfile({ karmaPoints: currentUser.karmaPoints + 20 });
    showToast(`"${data.title}" uploaded to Academic Vault! (+20 Karma)`);
  };

  const upvoteResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const hasUpvoted = !r.hasUpvoted;
          return {
            ...r,
            hasUpvoted,
            upvotes: hasUpvoted ? r.upvotes + 1 : r.upvotes - 1,
          };
        }
        return r;
      })
    );
  };

  const downloadResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, downloadsCount: r.downloadsCount + 1 };
        }
        return r;
      })
    );
    showToast('Simulated download started. PDF opened in new tab.');
  };

  // Gear Marketplace
  const listMarketplaceItem = (data: Omit<MarketplaceItem, 'id' | 'seller' | 'status' | 'createdAt'>) => {
    const newItem: MarketplaceItem = {
      ...data,
      id: `gear-${Date.now()}`,
      seller: currentUser,
      status: 'available',
      createdAt: 'Just now',
    };
    setMarketplace((prev) => [newItem, ...prev]);
    showToast('Item listed on Campus Gear Exchange!');
  };

  const claimMarketplaceItem = (id: string) => {
    setMarketplace((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'claimed' } : item))
    );
    showToast('Item claimed! A notification has been sent to the student seller.');
  };

  // Lost & Found
  const reportLostItem = (item: Omit<LostItem, 'id' | 'reporter' | 'status'>) => {
    const newItem: LostItem = {
      ...item,
      id: `lost-${Date.now()}`,
      reporter: currentUser,
      status: 'Open',
    };
    setLostItems((prev) => [newItem, ...prev]);
    showToast('Lost/Found alert broadcasted on Campus Pulse!');
  };

  // Messages
  const sendMessage = (
    channelId: string,
    content: string,
    codeSnippet?: { language: string; code: string },
    recipientId?: string
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      sender: currentUser,
      recipientId,
      content,
      codeSnippet,
      createdAt: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Mentorship Sessions
  const requestMentorshipSession = (seniorId: string, topic: string, message: string, preferredDate: string) => {
    const req: MentorshipSessionRequest = {
      id: `req-${Date.now()}`,
      seniorId,
      juniorId: currentUser.id,
      topic,
      message,
      preferredDate,
      status: 'pending',
      createdAt: 'Just now',
    };
    setMentorshipRequests((prev) => [req, ...prev]);
    showToast('1-on-1 Mentorship session requested! The senior has been notified.');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <CampusContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserById,
        updateCurrentUserProfile,
        registerNewStudent,
        students,
        posts,
        addPost,
        upvotePost,
        addPostComment,
        questions,
        askQuestion,
        answerQuestion,
        upvoteQuestion,
        upvoteAnswer,
        chronicles,
        addChronicle,
        upvoteChronicle,
        teams,
        createTeamListing,
        applyToTeam,
        resources,
        uploadResource,
        upvoteResource,
        downloadResource,
        marketplace,
        listMarketplaceItem,
        claimMarketplaceItem,
        clubs,
        lostItems,
        reportLostItem,
        messages,
        activeChannel,
        setActiveChannel,
        sendMessage,
        mentorshipRequests,
        requestMentorshipSession,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        globalSearchQuery,
        setGlobalSearchQuery,
        theme,
        toggleTheme,
        isMockMode: !isSupabaseConfigured,
        toast,
        showToast,
        clearToast,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
