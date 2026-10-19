export type StudentYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type Branch = 'CSE' | 'IT' | 'ECE' | 'EE' | 'ME' | 'Civil' | 'Chemical' | 'Biotech' | 'Design';
export type Residence = 'Hostel' | 'Day Scholar';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  year: StudentYear;
  yearLabel: 'Fresher' | 'Sophomore' | 'Pre-Final' | 'Final Year';
  branch: Branch;
  residence: Residence;
  hostelBlock?: string;
  headline: string;
  bio: string;
  isMentor: boolean;
  mentorTopics: string[];
  skills: string[];
  clubs: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  karmaPoints: number;
  isVerified: boolean;
  joinedAt: string;
}

export interface PostComment {
  id: string;
  author: StudentProfile;
  content: string;
  createdAt: string;
}

export interface CampusPost {
  id: string;
  author: StudentProfile;
  content: string;
  scope: 'all' | 'year' | 'dept';
  targetYear?: StudentYear;
  targetDept?: Branch;
  tags: string[];
  upvotes: number;
  hasUpvoted?: boolean;
  comments: PostComment[];
  createdAt: string;
  pinned?: boolean;
}

export interface MentorshipAnswer {
  id: string;
  questionId: string;
  author: StudentProfile;
  content: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isSeniorVerified: boolean;
  createdAt: string;
}

export interface MentorshipQuestion {
  id: string;
  author: StudentProfile;
  title: string;
  content: string;
  targetYear: StudentYear;
  tags: string[];
  upvotes: number;
  hasUpvoted?: boolean;
  answers: MentorshipAnswer[];
  isResolved: boolean;
  createdAt: string;
}

export interface InterviewRound {
  roundName: string;
  duration: string;
  description: string;
  keyQuestions: string[];
}

export interface PlacementChronicle {
  id: string;
  author: StudentProfile;
  companyName: string;
  companyLogo?: string;
  role: string;
  packageOrStipend: string;
  employmentType: 'Internship' | 'Full-Time FTE' | 'Research Fellow';
  batchYear: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  rounds: InterviewRound[];
  preparationTips: string;
  resumeAdvice: string;
  upvotes: number;
  hasUpvoted?: boolean;
  createdAt: string;
}

export interface MentorshipSessionRequest {
  id: string;
  seniorId: string;
  juniorId: string;
  topic: string;
  message: string;
  preferredDate: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface TeamApplication {
  id: string;
  listingId: string;
  applicant: StudentProfile;
  roleApplied: string;
  pitchNote: string;
  portfolioLink?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface TeamListing {
  id: string;
  creator: StudentProfile;
  title: string;
  eventName: string;
  eventType: 'Hackathon' | 'Major Project' | 'Campus Startup' | 'Research Paper';
  description: string;
  rolesNeeded: string[];
  techStack: string[];
  totalSlots: number;
  filledSlots: number;
  status: 'Open' | 'Filled';
  deadline: string;
  applications: TeamApplication[];
  createdAt: string;
}

export type ResourceCategory = 'PYQ' | 'Handwritten Notes' | 'Lab Manual' | 'Syllabus';

export interface AcademicResource {
  id: string;
  uploader: StudentProfile;
  title: string;
  subject: string;
  subjectCode: string;
  branch: Branch;
  year: StudentYear;
  semester: number;
  category: ResourceCategory;
  fileSize: string;
  fileFormat: 'PDF' | 'ZIP' | 'DOCX';
  upvotes: number;
  hasUpvoted?: boolean;
  downloadsCount: number;
  createdAt: string;
}

export type GearCategory = 'Textbook' | 'Lab Gear' | 'Electronics' | 'Cycle' | 'Calculator' | 'Room Essentials';

export interface MarketplaceItem {
  id: string;
  seller: StudentProfile;
  title: string;
  description: string;
  category: GearCategory;
  price: number; // 0 = Free / Donate
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  status: 'available' | 'reserved' | 'claimed';
  pickupLocation: string;
  images: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: StudentProfile;
  recipientId?: string; // For DMs
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  createdAt: string;
}

export interface CampusClub {
  id: string;
  name: string;
  category: 'Tech' | 'Robotics' | 'Cultural' | 'Entrepreneurship' | 'Sports' | 'Literary';
  description: string;
  logo: string;
  lead: string;
  membersCount: number;
  upcomingEvent: {
    title: string;
    date: string;
    location: string;
    type: 'Audition' | 'Workshop' | 'Hackathon' | 'Fest';
  };
  contactEmail: string;
}

export interface LostItem {
  id: string;
  reporter: StudentProfile;
  itemType: 'Lost' | 'Found';
  title: string;
  location: string;
  date: string;
  contactInfo: string;
  status: 'Open' | 'Resolved';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
  type: 'mentorship' | 'team' | 'qna' | 'resource';
}
