import {
  StudentProfile,
  CampusPost,
  MentorshipQuestion,
  PlacementChronicle,
  TeamListing,
  AcademicResource,
  MarketplaceItem,
  CampusClub,
  LostItem,
  ChatMessage,
  NotificationItem,
} from '@/types';

// ==========================================
// 1. DIVERSE STUDENT PROFILES (1st to 4th Year)
// ==========================================
export const mockStudents: StudentProfile[] = [
  {
    id: 'student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    year: '3rd Year',
    yearLabel: 'Pre-Final',
    branch: 'CSE',
    residence: 'Hostel',
    hostelBlock: 'Aryabhatta Hostel, Room B-314',
    headline: 'Incoming SDE Intern @ Amazon | Open-Source Enthusiast',
    bio: 'Passionate about distributed systems, Next.js, and Golang. Mentored 40+ freshers on DSA and Git fundamentals. Former SIH Finalist.',
    isMentor: true,
    mentorTopics: ['Internship Prep', 'Resume Review', 'DSA Roadmaps', 'Next.js & Fullstack'],
    skills: ['Next.js', 'TypeScript', 'Docker', 'Go', 'PostgreSQL', 'Tailwind CSS'],
    clubs: ['Turing Coding Club', 'GDSC Core Team'],
    githubUrl: 'https://github.com/aaravsharma',
    linkedinUrl: 'https://linkedin.com/in/aaravsharma',
    portfolioUrl: 'https://aarav.dev',
    karmaPoints: 1240,
    isVerified: true,
    joinedAt: 'August 2024',
  },
  {
    id: 'student-2',
    name: 'Ananya Verma',
    email: 'ananya.verma@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    year: '4th Year',
    yearLabel: 'Final Year',
    branch: 'ECE',
    residence: 'Hostel',
    hostelBlock: 'Gargi Hall, Room A-108',
    headline: 'Placed @ Texas Instruments (Digital Design) | IEEE Chair',
    bio: 'Specialized in VLSI, FPGA architectures, and embedded firmware. Always happy to help ECE juniors land core chip-design roles.',
    isMentor: true,
    mentorTopics: ['Core ECE Interviews', 'VLSI & Verilog', 'GATE ECE Tips', 'College Societies'],
    skills: ['Verilog HDL', 'FPGA', 'MATLAB', 'C++', 'SystemVerilog', 'PCB Design'],
    clubs: ['Robocrafters Club', 'IEEE Student Branch'],
    githubUrl: 'https://github.com/ananya-v',
    linkedinUrl: 'https://linkedin.com/in/ananya-verma',
    karmaPoints: 1890,
    isVerified: true,
    joinedAt: 'August 2023',
  },
  {
    id: 'student-3',
    name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    year: '4th Year',
    yearLabel: 'Final Year',
    branch: 'CSE',
    residence: 'Day Scholar',
    headline: 'Software Engineer @ Google (Offered) | Candidate Master @ Codeforces',
    bio: 'CP enthusiast with 650+ LeetCode problems solved. Placed at Google SWE-1 FTE. Offering mock interview rounds for 3rd/4th years.',
    isMentor: true,
    mentorTopics: ['FAANG Tech Rounds', 'Competitive Programming', 'System Design Basics'],
    skills: ['C++', 'Competitive Programming', 'Algorithms', 'Kubernetes', 'Python'],
    clubs: ['Turing Coding Club'],
    githubUrl: 'https://github.com/rohankulkarni',
    linkedinUrl: 'https://linkedin.com/in/rohan-kulkarni',
    karmaPoints: 2450,
    isVerified: true,
    joinedAt: 'August 2023',
  },
  {
    id: 'student-4',
    name: 'Sneha Patel',
    email: 'sneha.patel@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    year: '2nd Year',
    yearLabel: 'Sophomore',
    branch: 'IT',
    residence: 'Hostel',
    hostelBlock: 'Gargi Hall, Room B-212',
    headline: 'Flutter Dev & UI/UX Designer | Building Campus SaaS',
    bio: '2nd-year enthusiast building cross-platform applications and interactive web apps. Looking for backend collaborators for upcoming college hackathons.',
    isMentor: false,
    mentorTopics: [],
    skills: ['Flutter', 'Figma', 'UI/UX', 'Dart', 'React', 'Firebase'],
    clubs: ['GDSC Design Lead', 'Crescendo Music Society'],
    githubUrl: 'https://github.com/snehapatel',
    linkedinUrl: 'https://linkedin.com/in/sneha-patel',
    portfolioUrl: 'https://snehacreates.design',
    karmaPoints: 460,
    isVerified: true,
    joinedAt: 'August 2025',
  },
  {
    id: 'student-5',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    year: '1st Year',
    yearLabel: 'Fresher',
    branch: 'CSE',
    residence: 'Hostel',
    hostelBlock: 'Ramanujan Hall, Room C-102',
    headline: '1st Year Fresher | Exploring Web Dev & Open Source',
    bio: 'Curious learner fascinated by AI agents, Python, and Linux. Actively attending Turing Club workshops and looking for senior guidance.',
    isMentor: false,
    mentorTopics: [],
    skills: ['Python', 'HTML/CSS', 'Git', 'Linux Basics', 'C Programming'],
    clubs: ['Turing Coding Club'],
    githubUrl: 'https://github.com/kabirmehta',
    karmaPoints: 120,
    isVerified: true,
    joinedAt: 'August 2026',
  },
  {
    id: 'student-6',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    year: '3rd Year',
    yearLabel: 'Pre-Final',
    branch: 'ME',
    residence: 'Day Scholar',
    headline: 'SAE Collegiate President | CAD/CAM & Electric Vehicle Powertrain',
    bio: 'Mechanical engineering enthusiast passionate about Formula Student EV design, ANSYS simulation, and automotive aerodynamics.',
    isMentor: true,
    mentorTopics: ['Mechanical Core Placements', 'CAD Modelling', 'SAE BAJA Guidance'],
    skills: ['SolidWorks', 'ANSYS Fluent', 'AutoCAD', 'MATLAB', 'Python for Eng'],
    clubs: ['SAE Collegiate Club', 'Robocrafters'],
    linkedinUrl: 'https://linkedin.com/in/poojaiyer',
    karmaPoints: 980,
    isVerified: true,
    joinedAt: 'August 2024',
  },
  {
    id: 'student-7',
    name: 'Devansh Joshi',
    email: 'devansh.joshi@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    year: '2nd Year',
    yearLabel: 'Sophomore',
    branch: 'CSE',
    residence: 'Day Scholar',
    headline: 'Full-Stack Developer | SIH 2026 Aspirant',
    bio: 'Building MERN / Next.js applications and dabbling in WebSockets. Seeking senior teammates for Smart India Hackathon.',
    isMentor: false,
    mentorTopics: [],
    skills: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind'],
    clubs: ['E-Cell', 'Turing Coding Club'],
    githubUrl: 'https://github.com/devanshj',
    karmaPoints: 310,
    isVerified: true,
    joinedAt: 'August 2025',
  },
  {
    id: 'student-8',
    name: 'Tanya Sengupta',
    email: 'tanya.sengupta@ait.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    year: '1st Year',
    yearLabel: 'Fresher',
    branch: 'Civil',
    residence: 'Hostel',
    hostelBlock: 'Gargi Hall, Room C-304',
    headline: '1st Year Civil Eng | Exploring Smart Infrastructure & GIS',
    bio: 'Passionate about sustainable urban planning, GIS mapping, and collegiate debating.',
    isMentor: false,
    mentorTopics: [],
    skills: ['AutoCAD', 'Surveying Basics', 'Python', 'Public Speaking'],
    clubs: ['Literary & Debating Society', 'Environmental Club'],
    karmaPoints: 95,
    isVerified: true,
    joinedAt: 'August 2026',
  },
];

// Currently logged-in active user (defaults to Aarav Sharma, 3rd Year)
export const initialCurrentUser: StudentProfile = mockStudents[0];

// ==========================================
// 2. CAMPUS PULSE POSTS (FEED)
// ==========================================
export const mockPosts: CampusPost[] = [
  {
    id: 'post-1',
    author: mockStudents[0], // Aarav Sharma (3rd Year)
    content: `📢 **Reminder for 2nd & 3rd Years:** The registration portal for Microsoft's On-Campus Summer Internship Drive closes this Friday at 11:59 PM. 

Make sure your resume highlights 2-3 solid project repos with live preview links, and brush up on Sliding Window & Graph Traversal problems. I've uploaded our batch's previous test pattern in the **Academic Vault** under 5th Sem CSE! Feel free to ask questions below. 🚀`,
    scope: 'all',
    tags: ['Internships', 'Placements', 'ResumeTips', 'CSE'],
    upvotes: 42,
    hasUpvoted: true,
    comments: [
      {
        id: 'c-1',
        author: mockStudents[3], // Sneha Patel (2nd Year)
        content: 'Thanks Aarav bhaiya! Are 2nd years eligible for this summer intern cycle, or only 3rd years?',
        createdAt: '1 hour ago',
      },
      {
        id: 'c-2',
        author: mockStudents[0], // Aarav Sharma
        content: '@Sneha This cycle is strictly for 3rd years (2027 batch), but 2nd years can apply for the Microsoft Engage Mentorship in January!',
        createdAt: '45 mins ago',
      },
    ],
    createdAt: '2 hours ago',
    pinned: true,
  },
  {
    id: 'post-2',
    author: mockStudents[1], // Ananya Verma (4th Year ECE)
    content: `✨ To all 1st and 2nd years feeling overwhelmed by mid-sem lab exams: 

Don't panic! For Digital Electronics & Basic Electrical, 80% of viva questions come straight from the circuit wiring explanations and standard breadboard pinouts (7400 NAND ICs, 7408 AND ICs). 

If anyone needs help debugging their counter circuits or wants hands-on oscilloscopes practice in the ECE block lab, drop by Lab 204 tomorrow between 4 PM and 6 PM. Seniors got your back! 💪`,
    scope: 'all',
    tags: ['LabViva', 'ECE', 'SeniorAdvice', 'ExamTips'],
    upvotes: 68,
    hasUpvoted: false,
    comments: [
      {
        id: 'c-3',
        author: mockStudents[4], // Kabir Mehta (1st Year)
        content: 'Ananya didi, will definitely come! Our lab assistant was strict about breadboard wiring today.',
        createdAt: '30 mins ago',
      },
    ],
    createdAt: '4 hours ago',
  },
  {
    id: 'post-3',
    author: mockStudents[6], // Devansh Joshi (2nd Year)
    content: `🔥 Anyone interested in teaming up for **Smart India Hackathon (SIH 2026)**? 

Our problem statement is in the Smart Education / Student Workflow domain. We already have 2 fullstack devs and are looking for 1 UI/UX Figma designer (preferably 1st or 2nd year) and 1 IoT/Hardware person. Check our listing on the **Team Finder** board!`,
    scope: 'all',
    tags: ['Hackathon', 'SIH2026', 'TeamFinder', 'Collab'],
    upvotes: 27,
    hasUpvoted: false,
    comments: [],
    createdAt: '6 hours ago',
  },
  {
    id: 'post-4',
    author: mockStudents[2], // Rohan Kulkarni (4th Year CSE)
    content: `🎓 Just published my complete breakdown of the **Google SWE-1 Campus Interview Experience** in the **Senior Bridge Chronicles** tab! 

Covered all 4 rounds: 
1. Online Coding Assessment (2 DP & String problems)
2. Technical Round 1 (Binary Tree Serialization + Optimizations)
3. Technical Round 2 (Concurrency & Graph reachability)
4. Googleyness & Leadership

Drop any doubts in the comments or book a mock interview slot on my profile. Keep grinding!`,
    scope: 'all',
    tags: ['Google', 'InterviewChronicle', 'PlacementSeason', 'FAANG'],
    upvotes: 95,
    hasUpvoted: true,
    comments: [
      {
        id: 'c-4',
        author: mockStudents[0],
        content: 'Huge congratulations Rohan! The breakdown is gold.',
        createdAt: '5 hours ago',
      },
    ],
    createdAt: '8 hours ago',
  },
];

// ==========================================
// 3. SENIOR-JUNIOR BRIDGE (Q&A FORUM)
// ==========================================
export const mockQuestions: MentorshipQuestion[] = [
  {
    id: 'q-1',
    author: mockStudents[3], // Sneha Patel (2nd Year)
    title: 'How should a 2nd year student strategically balance DSA with Web Dev projects for 3rd year summer placements?',
    content: `I'm currently midway through 3rd semester IT. I enjoy building React and Flutter apps, but everyone keeps saying that on-campus shortlisting tests are 100% LeetCode and DSA based. 

How did placed 3rd and 4th-year seniors divide their daily hours between problem solving (LeetCode/GFG) and working on capstone portfolio projects?`,
    targetYear: '3rd Year',
    tags: ['DSA', 'WebDev', 'Placements', 'TimeManagement'],
    upvotes: 38,
    hasUpvoted: true,
    isResolved: true,
    createdAt: 'Yesterday',
    answers: [
      {
        id: 'ans-1',
        questionId: 'q-1',
        author: mockStudents[2], // Rohan Kulkarni (4th Year - Google)
        content: `Here is the exact formula that worked for me and 10+ batchmates placed in Tier-1 product firms:

1. **The 70-30 Rule in 2nd Year:** Dedicate 70% of your coding time (approx 1.5 - 2 hrs daily) to mastering Data Structures systematically. Don't randomly jump on LeetCode. Master Arrays -> Two Pointers -> Hashing -> Stacks/Queues -> Trees -> Graphs -> DP.
2. **Projects in Bursts (Hackathons & Weekends):** Don't code projects everyday. Instead, build 2 impactful projects during hackathons or semester breaks. 2 well-architected full-stack apps with authentication, database indexing, and deployment are infinitely better than 10 tutorial clones.
3. **By Semester 5 Beginning:** You should comfortably solve LeetCode Mediums in 25 minutes. Then shift to 50-50 for mock interviews.`,
        upvotes: 52,
        hasUpvoted: true,
        isSeniorVerified: true,
        createdAt: '18 hours ago',
      },
      {
        id: 'ans-2',
        questionId: 'q-1',
        author: mockStudents[0], // Aarav Sharma (3rd Year - Amazon Intern)
        content: `Adding to Rohan's point: also make sure you understand Git and deployment workflows (Vercel, Render, or Docker). In my Amazon interview, the interviewer spent 15 minutes asking about database schema decisions in my project before touching DSA!`,
        upvotes: 24,
        hasUpvoted: false,
        isSeniorVerified: true,
        createdAt: '14 hours ago',
      },
    ],
  },
  {
    id: 'q-2',
    author: mockStudents[4], // Kabir Mehta (1st Year)
    title: 'Which campus societies are best for learning practical coding vs cultural exposure in 1st year?',
    content: `Just joined campus in CSE! There are so many society orientation sessions this week (Turing Club, GDSC, Robocrafters, Crescendo, Debating). Is it manageable to be in 1 tech club and 1 cultural club without tanking 1st-year CGPA?`,
    targetYear: '2nd Year',
    tags: ['Clubs', 'FirstYearAdvice', 'CGPA', 'CampusLife'],
    upvotes: 19,
    hasUpvoted: false,
    isResolved: true,
    createdAt: '2 days ago',
    answers: [
      {
        id: 'ans-3',
        questionId: 'q-2',
        author: mockStudents[1], // Ananya Verma (4th Year ECE)
        content: `Welcome to campus Kabir! Yes, joining **exactly 1 tech society and 1 cultural/sports club** is the sweet spot. 

Joining Turing Club or GDSC gives you instant senior mentors who share lab manuals, PYQs, and advice on tech stacks. A cultural or sports club (like Crescendo or Debating) prevents burnout and gives you lifelong friendships across all branches. Just make sure to dedicate 2 hours every evening to academics so your 1st-year CGPA stays above 8.5—it's much easier to maintain a high CGPA in 1st year than to pull it up later!`,
        upvotes: 31,
        hasUpvoted: true,
        isSeniorVerified: true,
        createdAt: '1 day ago',
      },
    ],
  },
  {
    id: 'q-3',
    author: mockStudents[7], // Tanya Sengupta (1st Year Civil)
    title: 'Are non-circuit branch students allowed to participate in college hackathons and coding club auditions?',
    content: `I am in 1st Year Civil Engineering but I have a keen interest in Python and web development. Do senior teams welcome Civil/Mech students in tech projects?`,
    targetYear: '3rd Year',
    tags: ['BranchDiversity', 'Hackathons', 'CodingClubs', 'OpenToAll'],
    upvotes: 28,
    hasUpvoted: false,
    isResolved: false,
    createdAt: '3 days ago',
    answers: [
      {
        id: 'ans-4',
        questionId: 'q-3',
        author: mockStudents[0], // Aarav Sharma (3rd Year)
        content: `100% YES! In fact, multidisciplinary teams often win top prizes at hackathons because real-world problems (like Smart Infrastructure, Green Logistics, or IoT monitoring) require domain knowledge that pure CS students don't have. Skills and curiosity matter 10x more than your branch!`,
        upvotes: 40,
        hasUpvoted: false,
        isSeniorVerified: true,
        createdAt: '2 days ago',
      },
    ],
  },
];

// ==========================================
// 4. PLACEMENT & INTERNSHIP CHRONICLES
// ==========================================
export const mockChronicles: PlacementChronicle[] = [
  {
    id: 'chronicle-1',
    author: mockStudents[2], // Rohan Kulkarni (4th Year CSE)
    companyName: 'Google',
    role: 'Software Engineer (SWE-1)',
    packageOrStipend: '₹45 LPA (CTC)',
    employmentType: 'Full-Time FTE',
    batchYear: '2026 Batch',
    difficulty: 'Challenging',
    rounds: [
      {
        roundName: 'Round 1: Online Assessment (HackerEarth)',
        duration: '90 Minutes',
        description: '2 Algorithmic coding questions. Strict edge-case time limits.',
        keyQuestions: [
          'Problem on Dynamic Programming with Bitmasking (Optimal path matching under budget constraints).',
          'String hashing & Trie problem on longest common prefix with wildcard replacements.',
        ],
      },
      {
        roundName: 'Round 2: Technical Interview 1 (DSA)',
        duration: '45 Minutes',
        description: 'Conducted on Google Docs without syntax highlighting or compiler.',
        keyQuestions: [
          'Binary Tree serialization & deserialization with custom delimiter format.',
          'Follow-up: How to handle streaming node insertions without rebalancing entire memory structure?',
        ],
      },
      {
        roundName: 'Round 3: Technical Interview 2 (Algorithms & Scale)',
        duration: '45 Minutes',
        description: 'Deep dive into graph reachability and asymptotic complexity analysis.',
        keyQuestions: [
          'Given a directed graph of server nodes, find the minimum subset of nodes to infect the whole network (Tarjan SCC algorithm).',
          'Discussion on memory footprint if node count exceeds RAM capacity.',
        ],
      },
      {
        roundName: 'Round 4: Googleyness & Fitment',
        duration: '45 Minutes',
        description: 'Behavioral and ethical decision-making scenarios.',
        keyQuestions: [
          'Tell me about a time you had a technical disagreement with a team member in a college hackathon.',
          'How do you manage code quality when deadlines are aggressively moving forward?',
        ],
      },
    ],
    preparationTips: `1. Code on plain text/docs without auto-complete so you internalize syntax and boundary checks.
2. Focus heavily on Trees, Graphs, and 1D/2D DP. 
3. Always communicate your thought process aloud before writing code: Brute force -> Bottleneck identification -> Optimal approach -> Time/Space Big-O.`,
    resumeAdvice: `Keep it to 1 single page. Use the Google X-Y-Z formula: "Accomplished [X] as measured by [Y] by doing [Z]". Include GitHub links with clean README files and demo GIFs.`,
    upvotes: 114,
    hasUpvoted: true,
    createdAt: '3 days ago',
  },
  {
    id: 'chronicle-2',
    author: mockStudents[0], // Aarav Sharma (3rd Year CSE)
    companyName: 'Amazon',
    role: 'Software Development Engineer Intern',
    packageOrStipend: '₹1,10,000 / month + Accommodation',
    employmentType: 'Internship',
    batchYear: '2027 Batch',
    difficulty: 'Medium',
    rounds: [
      {
        roundName: 'Round 1: Online Coding Test + Amazon Work Style Survey',
        duration: '105 Minutes',
        description: '2 coding problems + 20 scenario-based questions assessing Amazon Leadership Principles.',
        keyQuestions: [
          'Sliding Window problem to calculate maximum package delivery efficiency within sliding time window.',
          'LRU Cache implementation with O(1) get and put complexity.',
        ],
      },
      {
        roundName: 'Round 2: Technical & Leadership Interview',
        duration: '60 Minutes',
        description: 'Combined coding session with intense focus on "Customer Obsession" and "Ownership".',
        keyQuestions: [
          'Design an in-memory inventory management module that supports fast price lookups and batch stock deductions.',
          'LP Question: Tell me about a time you went above and beyond for a project user or classmate.',
        ],
      },
    ],
    preparationTips: `Do NOT neglect the Amazon Leadership Principles (LP). Prepare 2 distinct stories from your college projects for each principle using the STAR (Situation, Task, Action, Result) methodology.`,
    resumeAdvice: `Highlight quantifiable impacts (e.g. "Reduced API response time by 42% via Redis caching", "Used by 300+ students on campus").`,
    upvotes: 86,
    hasUpvoted: false,
    createdAt: '1 week ago',
  },
  {
    id: 'chronicle-3',
    author: mockStudents[1], // Ananya Verma (4th Year ECE)
    companyName: 'Texas Instruments',
    role: 'Digital Design & Verification Engineer',
    packageOrStipend: '₹22.5 LPA',
    employmentType: 'Full-Time FTE',
    batchYear: '2026 Batch',
    difficulty: 'Challenging',
    rounds: [
      {
        roundName: 'Round 1: Core ECE Aptitude & Technical Test',
        duration: '75 Minutes',
        description: 'Digital Electronics, Static Timing Analysis (STA), CMOS logic, and basic C code.',
        keyQuestions: [
          'Setup and hold time slack calculations under clock jitter.',
          'State transition diagram for Mealy vs Moore sequence detector.',
        ],
      },
      {
        roundName: 'Round 2: Technical Interview 1 (Digital Design)',
        duration: '60 Minutes',
        description: 'Whiteboard circuit drawing and Verilog code.',
        keyQuestions: [
          'Write synthesizable Verilog for a Parameterized Asynchronous FIFO.',
          'Explain clock domain crossing (CDC) and how a dual-flop synchronizer prevents metastability.',
        ],
      },
      {
        roundName: 'Round 3: Technical Interview 2 & HR',
        duration: '45 Minutes',
        description: 'Discussion on major college projects and company culture.',
        keyQuestions: [
          'Detailed walkthrough of my FPGA-based RISC-V processor implementation.',
          'Why Texas Instruments over pure software firms?',
        ],
      },
    ],
    preparationTips: `Master Morris Mano (Digital Design) and Rabaey (Digital Integrated Circuits). Practice drawing timing diagrams by hand. TI interviewers test conceptual depth over rote formulas!`,
    resumeAdvice: `List your hardware lab projects, board names (Xilinx Basys 3, STM32, Arduino), and tools (Vivado, ModelSim, Cadence) explicitly.`,
    upvotes: 72,
    hasUpvoted: false,
    createdAt: '2 weeks ago',
  },
];

// ==========================================
// 5. TEAM & HACKATHON FINDER ("BUILD TOGETHER")
// ==========================================
export const mockTeams: TeamListing[] = [
  {
    id: 'team-1',
    creator: mockStudents[6], // Devansh Joshi (2nd Year CSE)
    title: 'Autonomous Campus Navigation for Visually Impaired',
    eventName: 'Smart India Hackathon (SIH 2026)',
    eventType: 'Hackathon',
    description: `Developing an assistive audio-guided AR navigation mobile app with ultrasonic BLE beacons placed across college academic blocks, libraries, and canteens.

We have our core machine learning object-detection model ready in PyTorch. Now looking for motivated teammates to build the mobile frontend and interactive campus map!`,
    rolesNeeded: ['Flutter/React Native Dev (2nd/3rd Year)', 'UI/UX Designer (Figma)', 'Hardware/BLE Specialist'],
    techStack: ['Flutter', 'Python', 'FastAPI', 'YOLOv8', 'Bluetooth LE', 'Figma'],
    totalSlots: 6,
    filledSlots: 3,
    status: 'Open',
    deadline: '2026-11-15',
    applications: [
      {
        id: 'app-1',
        listingId: 'team-1',
        applicant: mockStudents[3], // Sneha Patel (2nd Year IT)
        roleApplied: 'UI/UX Designer (Figma)',
        pitchNote: 'Hey Devansh! I have experience designing accessible mobile interfaces (high contrast, screen-reader friendly). Would love to lead the UI/UX design!',
        portfolioLink: 'https://snehacreates.design',
        status: 'accepted',
        createdAt: '1 day ago',
      },
    ],
    createdAt: '2 days ago',
  },
  {
    id: 'team-2',
    creator: mockStudents[0], // Aarav Sharma (3rd Year CSE)
    title: 'Decentralized Student Academic & Credential Ledger',
    eventName: 'EthIndia & Campus Web3 Capstone',
    eventType: 'Major Project',
    description: `A verifiable student credential platform allowing college administration to issue tamper-proof semester grade sheets, course completion certificates, and club PORs as Soulbound NFTs.`,
    rolesNeeded: ['Solidity / Smart Contract Engineer', 'Frontend Next.js Developer', 'Technical Content Writer'],
    techStack: ['Next.js', 'Solidity', 'Hardhat', 'IPFS', 'TypeScript', 'Tailwind'],
    totalSlots: 4,
    filledSlots: 2,
    status: 'Open',
    deadline: '2026-11-30',
    applications: [],
    createdAt: '3 days ago',
  },
  {
    id: 'team-3',
    creator: mockStudents[5], // Pooja Iyer (3rd Year ME)
    title: 'Formula Student EV: Telemetry Dashboard & Sensor Network',
    eventName: 'Formula Bharat 2027 Competition',
    eventType: 'Major Project',
    description: `Our collegiate racing team is designing an electric formula car. We need software and electronics students to design an IoT telemetry dashboard that streams battery temperature, motor RPM, and brake pressure to pit lane laptops in real-time.`,
    rolesNeeded: ['React/Dashboard Dev', 'Embedded C / CAN Bus Programmer'],
    techStack: ['React', 'CAN Bus', 'ESP32', 'WebSockets', 'Chart.js', 'C++'],
    totalSlots: 5,
    filledSlots: 4,
    status: 'Open',
    deadline: '2026-12-01',
    applications: [],
    createdAt: '4 days ago',
  },
  {
    id: 'team-4',
    creator: mockStudents[4], // Kabir Mehta (1st Year CSE)
    title: 'DormDeliver: Late-Night Campus Food & Stationery Pool',
    eventName: 'Campus SaaS Startup Incubator',
    eventType: 'Campus Startup',
    description: `A peer-to-peer delivery app connecting students studying late in library/hostels with students heading out to night canteens or stationery shops. Earn small delivery tips or exchange favors!`,
    rolesNeeded: ['Fullstack Developer', 'Marketing & Campus Outreach'],
    techStack: ['Next.js', 'Supabase', 'Tailwind CSS', 'WhatsApp Bot API'],
    totalSlots: 3,
    filledSlots: 1,
    status: 'Open',
    deadline: '2026-11-20',
    applications: [],
    createdAt: '5 days ago',
  },
];

// ==========================================
// 6. ACADEMIC VAULT (PYQS & NOTES)
// ==========================================
export const mockResources: AcademicResource[] = [
  {
    id: 'res-1',
    uploader: mockStudents[0], // Aarav Sharma
    title: 'Data Structures & Algorithms: Mid-Sem + End-Sem 5-Year PYQs with Solved Solutions',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS-301',
    branch: 'CSE',
    year: '2nd Year',
    semester: 3,
    category: 'PYQ',
    fileSize: '4.8 MB',
    fileFormat: 'PDF',
    upvotes: 184,
    hasUpvoted: true,
    downloadsCount: 520,
    createdAt: '2 weeks ago',
  },
  {
    id: 'res-2',
    uploader: mockStudents[2], // Rohan Kulkarni
    title: 'Operating Systems: Handwritten Comprehensive Notes (Processes, Memory, CPU Scheduling)',
    subject: 'Operating Systems',
    subjectCode: 'CS-402',
    branch: 'CSE',
    year: '2nd Year',
    semester: 4,
    category: 'Handwritten Notes',
    fileSize: '12.4 MB',
    fileFormat: 'PDF',
    upvotes: 210,
    hasUpvoted: false,
    downloadsCount: 640,
    createdAt: '1 month ago',
  },
  {
    id: 'res-3',
    uploader: mockStudents[1], // Ananya Verma
    title: 'Digital Electronics Lab Manual: Complete 10 Experiments Circuit Schematics & Truth Tables',
    subject: 'Digital Electronics',
    subjectCode: 'EC-303',
    branch: 'ECE',
    year: '2nd Year',
    semester: 3,
    category: 'Lab Manual',
    fileSize: '6.2 MB',
    fileFormat: 'PDF',
    upvotes: 95,
    hasUpvoted: false,
    downloadsCount: 310,
    createdAt: '3 weeks ago',
  },
  {
    id: 'res-4',
    uploader: mockStudents[0],
    title: 'Engineering Mathematics-1: Calculus & Linear Algebra Solved Formula Sheets (1st Sem All Branches)',
    subject: 'Engineering Mathematics I',
    subjectCode: 'MA-101',
    branch: 'CSE',
    year: '1st Year',
    semester: 1,
    category: 'Handwritten Notes',
    fileSize: '3.1 MB',
    fileFormat: 'PDF',
    upvotes: 260,
    hasUpvoted: true,
    downloadsCount: 980,
    createdAt: '2 months ago',
  },
  {
    id: 'res-5',
    uploader: mockStudents[5], // Pooja Iyer
    title: 'Engineering Mechanics: Statics, Dynamics & Friction PYQ Compilation (2020-2025)',
    subject: 'Engineering Mechanics',
    subjectCode: 'ME-102',
    branch: 'ME',
    year: '1st Year',
    semester: 2,
    category: 'PYQ',
    fileSize: '5.5 MB',
    fileFormat: 'PDF',
    upvotes: 140,
    hasUpvoted: false,
    downloadsCount: 430,
    createdAt: '1 month ago',
  },
  {
    id: 'res-6',
    uploader: mockStudents[2],
    title: 'Database Management Systems (DBMS): Official Syllabus + Lab SQL Queries Cheat Sheet',
    subject: 'Database Systems',
    subjectCode: 'CS-503',
    branch: 'CSE',
    year: '3rd Year',
    semester: 5,
    category: 'Syllabus',
    fileSize: '1.9 MB',
    fileFormat: 'PDF',
    upvotes: 112,
    hasUpvoted: false,
    downloadsCount: 375,
    createdAt: '3 weeks ago',
  },
];

// ==========================================
// 7. CAMPUS GEAR & BOOK EXCHANGE (MARKETPLACE)
// ==========================================
export const mockMarketplace: MarketplaceItem[] = [
  {
    id: 'gear-1',
    seller: mockStudents[1], // Ananya Verma (4th Year ECE)
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    description: 'Passing out soon! Perfectly working matrix, complex numbers, and equation solver calculator. Essential for 1st-year engineering math and EE/ECE exams.',
    category: 'Calculator',
    price: 650,
    condition: 'Like New',
    status: 'available',
    pickupLocation: 'Gargi Hall Gate or ECE Dept Lobby',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80'],
    createdAt: '1 day ago',
  },
  {
    id: 'gear-2',
    seller: mockStudents[2], // Rohan Kulkarni (4th Year CSE)
    title: 'Engineering Mini-Drafter with Drawing Sheet Board & Clips',
    description: 'Free to donate to any 1st-year fresher who has Engineering Graphics/Drawing this semester. Save ₹1,200 on buying brand new!',
    category: 'Lab Gear',
    price: 0, // Free donate!
    condition: 'Good',
    status: 'available',
    pickupLocation: 'Central Library Parking Lot',
    images: ['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80'],
    createdAt: '2 days ago',
  },
  {
    id: 'gear-3',
    seller: mockStudents[0], // Aarav Sharma (3rd Year CSE)
    title: 'Introduction to Algorithms (CLRS 3rd Edition - Thomas Cormen)',
    description: 'The Bible of algorithms! Pristine condition with high-yield bookmarks for Graph algorithms and Dynamic Programming.',
    category: 'Textbook',
    price: 450,
    condition: 'Like New',
    status: 'available',
    pickupLocation: 'Aryabhatta Hostel Block B',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'],
    createdAt: '3 days ago',
  },
  {
    id: 'gear-4',
    seller: mockStudents[5], // Pooja Iyer (3rd Year ME)
    title: 'Hero Sprint 21-Speed Geared Mountain Bicycle',
    description: 'Great for getting between hostel and mechanical workshops across campus. Brand new rear tube, front brake pads recently serviced.',
    category: 'Cycle',
    price: 2100,
    condition: 'Good',
    status: 'available',
    pickupLocation: 'Near Mech Dept Workshop Shed',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80'],
    createdAt: '4 days ago',
  },
  {
    id: 'gear-5',
    seller: mockStudents[2], // Rohan
    title: 'White Chemistry & Physics Lab Coat (Size L)',
    description: 'Clean, freshly washed 1st-year lab coat. Free for any junior in need.',
    category: 'Lab Gear',
    price: 0,
    condition: 'Like New',
    status: 'available',
    pickupLocation: 'Aryabhatta Canteen',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'],
    createdAt: '5 days ago',
  },
];

// ==========================================
// 8. CAMPUS CLUBS & SOCIETIES
// ==========================================
export const mockClubs: CampusClub[] = [
  {
    id: 'club-1',
    name: 'Turing Coding Club',
    category: 'Tech',
    description: 'The premier competitive programming and software engineering society on campus. Hosting weekly code sprints, mock technical rounds, and hackathons.',
    logo: '💻',
    lead: 'Rohan Kulkarni (4th Year CSE)',
    membersCount: 380,
    upcomingEvent: {
      title: 'Annual Intra-College Speed Coding Sprint',
      date: 'Next Saturday • 3:00 PM',
      location: 'Lab 301, CS Block',
      type: 'Hackathon',
    },
    contactEmail: 'turing.club@ait.ac.in',
  },
  {
    id: 'club-2',
    name: 'Robocrafters & Automation Club',
    category: 'Robotics',
    description: 'Designing autonomous robots, drone swarms, and combat bots for Robocon and national tech fests.',
    logo: '🤖',
    lead: 'Ananya Verma (4th Year ECE)',
    membersCount: 220,
    upcomingEvent: {
      title: 'Fresher Hands-on Arduino & Sensor Workshop',
      date: 'Wednesday • 5:00 PM',
      location: 'Robotics Center, 2nd Floor',
      type: 'Workshop',
    },
    contactEmail: 'robocrafters@ait.ac.in',
  },
  {
    id: 'club-3',
    name: 'E-Cell (Entrepreneurship Cell)',
    category: 'Entrepreneurship',
    description: 'Fostering student startup culture, connecting campus founders with angel investors, and organizing the annual E-Summit.',
    logo: '🚀',
    lead: 'Devansh Joshi (2nd Year)',
    membersCount: 290,
    upcomingEvent: {
      title: 'Campus Pitch Tank 2026: Win ₹50,000 Seed Grant',
      date: 'Nov 12 • 10:00 AM',
      location: 'Auditorium Main Hall',
      type: 'Audition',
    },
    contactEmail: 'ecell@ait.ac.in',
  },
  {
    id: 'club-4',
    name: 'Crescendo Music & Cultural Society',
    category: 'Cultural',
    description: 'The heartbeat of campus cultural life. Acoustic jam nights, battle of the bands, and annual festival performances.',
    logo: '🎸',
    lead: 'Sneha Patel (2nd Year IT)',
    membersCount: 175,
    upcomingEvent: {
      title: 'Acoustic Sunset Jam & Open Mic',
      date: 'Friday • 6:30 PM',
      location: 'Amphitheatre Lawn',
      type: 'Fest',
    },
    contactEmail: 'crescendo@ait.ac.in',
  },
];

// ==========================================
// 9. LOST & FOUND BOARD
// ==========================================
export const mockLostItems: LostItem[] = [
  {
    id: 'lost-1',
    reporter: mockStudents[4], // Kabir Mehta
    itemType: 'Lost',
    title: 'Blue Boat Airdopes Case (Hostel Canteen)',
    location: 'Left near Table 4 in Aryabhatta Canteen after dinner',
    date: 'Yesterday, 9:30 PM',
    contactInfo: 'WhatsApp: +91 98765 43210 (Room C-102)',
    status: 'Open',
  },
  {
    id: 'lost-2',
    reporter: mockStudents[0], // Aarav Sharma
    itemType: 'Found',
    title: 'College ID Card: Rohit Deshmukh (2nd Year ECE)',
    location: 'Found on desk in Central Library Reading Room 2',
    date: 'Today, 11:00 AM',
    contactInfo: 'Handed over to Library Reception Desk',
    status: 'Open',
  },
  {
    id: 'lost-3',
    reporter: mockStudents[7], // Tanya
    itemType: 'Lost',
    title: 'Black Parker Vector Fountain Pen with Engraving',
    location: 'Civil Drawing Hall 104 during 2nd period',
    date: '2 days ago',
    contactInfo: 'Ping Tanya on CampusConnect chat',
    status: 'Open',
  },
];

// ==========================================
// 10. REAL-TIME BATCH CHANNELS & DMS
// ==========================================
export const mockBatchChannels = [
  { id: '1st-year-freshers', name: '1st-year-freshers', description: 'Freshers orientation, general questions, and timetable updates' },
  { id: '2nd-year-hub', name: '2nd-year-hub', description: 'Core branches, DSA study groups, and hackathons' },
  { id: '3rd-year-internships', name: '3rd-year-internships', description: 'Summer internship drives, test alerts, and interview tips' },
  { id: '4th-year-placements', name: '4th-year-placements', description: 'FTE drives, CTC discussions, and final year projects' },
  { id: 'competitive-programming', name: 'competitive-programming', description: 'Codeforces, LeetCode daily discussions, and CP solutions' },
  { id: 'gate-cat-prep', name: 'gate-cat-prep', description: 'Higher studies preparation, mock tests, and standard book discussions' },
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: '1st-year-freshers',
    sender: mockStudents[4], // Kabir Mehta (1st Year)
    content: 'Hey everyone! Does anyone know if tomorrow\'s Chemistry Lab requires formal lab coats, or are casual clothes allowed?',
    createdAt: 'Today at 2:15 PM',
  },
  {
    id: 'msg-2',
    channelId: '1st-year-freshers',
    sender: mockStudents[1], // Ananya Verma (4th Year Senior)
    content: 'Hey Kabir, lab coats and closed-toe leather shoes are strictly mandatory in the Chemistry block. Safety rules! If you don\'t have one yet, check the Campus Gear Vault—seniors listed some for free.',
    createdAt: 'Today at 2:18 PM',
  },
  {
    id: 'msg-3',
    channelId: '3rd-year-internships',
    sender: mockStudents[0], // Aarav Sharma (3rd Year)
    content: 'Quick tip for anyone practicing sliding window problems today for the upcoming test:',
    codeSnippet: {
      language: 'cpp',
      code: `// Template for dynamic sliding window
int left = 0, maxLen = 0;
unordered_map<char, int> freq;

for (int right = 0; right < s.size(); right++) {
    freq[s[right]]++;
    while (freq[s[right]] > k) { // condition invalid
        freq[s[left]]--;
        left++;
    }
    maxLen = max(maxLen, right - left + 1);
}`,
    },
    createdAt: 'Today at 3:30 PM',
  },
  {
    id: 'msg-4',
    channelId: '3rd-year-internships',
    sender: mockStudents[6], // Devansh
    content: 'Clean code template Aarav! Adding this to my revision notes.',
    createdAt: 'Today at 3:35 PM',
  },
];

// ==========================================
// 11. NOTIFICATIONS
// ==========================================
export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Answer on your Q&A',
    description: 'Rohan Kulkarni (4th Year • Google) answered your question on DSA preparation.',
    timestamp: '20 mins ago',
    read: false,
    type: 'qna',
  },
  {
    id: 'notif-2',
    title: 'Team Application Received',
    description: 'Sneha Patel applied for the UI/UX role on "Autonomous Campus Navigation".',
    timestamp: '1 hour ago',
    read: false,
    type: 'team',
  },
  {
    id: 'notif-3',
    title: 'Mentorship Session Approved',
    description: 'Ananya Verma accepted your 1-on-1 resume review request.',
    timestamp: 'Yesterday',
    read: true,
    type: 'mentorship',
  },
];
