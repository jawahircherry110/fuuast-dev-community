export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  department: "CS" | "SE" | "AI";
  semester: string;
  bio: string;
  skills: string[];
  interests: string[];
  openToCollaborate: boolean;
  github?: string;
  linkedin?: string;
  email: string;
  avatarBg: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time" | "Remote";
  department: "CS" | "SE" | "AI" | "All";
  stipend: string;
  description: string;
  applyLink: string;
  postedDate: string;
}

export interface CollabProject {
  id: string;
  title: string;
  department: "CS" | "SE" | "AI" | "Cross-Disciplinary";
  description: string;
  techStack: string[];
  teamLead: string;
  neededRoles: string[];
  status: "Recruiting Members" | "In Progress" | "Completed";
}

export const initialProfiles: StudentProfile[] = [
  {
    id: "p1",
    name: "Hamza Tariq",
    rollNo: "FA22-BCS-041",
    department: "CS",
    semester: "6th Semester",
    bio: "Passionate full-stack developer interested in scalable cloud APIs and distributed systems. Looking for FYP partners.",
    skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker"],
    interests: ["Web Systems", "Cloud Computing", "Open Source"],
    openToCollaborate: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "hamza.tariq@fuuast.edu.pk",
    avatarBg: "bg-blue-600",
  },
  {
    id: "p2",
    name: "Ayesha Malik",
    rollNo: "SP23-BAI-019",
    department: "AI",
    semester: "4th Semester",
    bio: "Computer Vision and NLP researcher. Currently working on Urdu OCR and language translation models.",
    skills: ["Python", "PyTorch", "OpenCV", "TensorFlow", "Scikit-Learn"],
    interests: ["Deep Learning", "Urdu NLP", "Medical Imaging"],
    openToCollaborate: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "ayesha.malik@fuuast.edu.pk",
    avatarBg: "bg-indigo-600",
  },
  {
    id: "p3",
    name: "Bilal Ahmed Khan",
    rollNo: "FA21-BSE-088",
    department: "SE",
    semester: "8th Semester",
    bio: "Final year Software Engineering student. Building microservices with NestJS and mobile apps with Flutter.",
    skills: ["Flutter", "TypeScript", "NestJS", "CI/CD", "Tailwind CSS"],
    interests: ["Mobile Engineering", "Software Quality Assurance", "DevOps"],
    openToCollaborate: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "bilal.khan@fuuast.edu.pk",
    avatarBg: "bg-sky-600",
  },
  {
    id: "p4",
    name: "Zainab Fatima",
    rollNo: "FA23-BAI-012",
    department: "AI",
    semester: "3rd Semester",
    bio: "AI enthusiast exploring LLM fine-tuning, prompt engineering, and intelligent chatbots for student queries.",
    skills: ["Python", "FastAPI", "LangChain", "Vector DBs", "Pandas"],
    interests: ["GenAI", "Data Analysis", "Chatbots"],
    openToCollaborate: true,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "zainab.fatima@fuuast.edu.pk",
    avatarBg: "bg-teal-600",
  },
  {
    id: "p5",
    name: "Usman Raza",
    rollNo: "SP22-BCS-053",
    department: "CS",
    semester: "5th Semester",
    bio: "Competitive programmer and backend enthusiast. Love solving LeetCode problems and optimizing SQL queries.",
    skills: ["C++", "Python", "MySQL", "Data Structures", "Algorithms"],
    interests: ["Competitive Programming", "Database Optimization", "Linux"],
    openToCollaborate: false,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "usman.raza@fuuast.edu.pk",
    avatarBg: "bg-blue-700",
  },
];

export const initialJobs: JobOpportunity[] = [
  {
    id: "j1",
    title: "Junior Frontend Developer (React / Next.js)",
    company: "TechLogix Islamabad",
    location: "Islamabad (Sector I-9) / Hybrid",
    type: "Internship",
    department: "CS",
    stipend: "PKR 35,000 - 45,000 / month",
    description: "Looking for fresh graduates or 7th/8th semester CS/SE students proficient in modern React, Tailwind, and REST APIs. Opportunity for permanent placement.",
    applyLink: "https://techlogix.com/careers",
    postedDate: "2 days ago",
  },
  {
    id: "j2",
    title: "AI / Machine Learning Trainee",
    company: "National Center of AI (NCAI)",
    location: "Islamabad (NUST Campus) / On-site",
    type: "Internship",
    department: "AI",
    stipend: "PKR 40,000 / month",
    description: "Hands-on research internship in deep learning, dataset annotation, and PyTorch model fine-tuning. Priority for FUUAST BSAI students.",
    applyLink: "https://ncai.pkr",
    postedDate: "Yesterday",
  },
  {
    id: "j3",
    title: "Software Quality Assurance (SQA) Intern",
    company: "Systems Limited",
    location: "Islamabad (Blue Area) / Hybrid",
    type: "Internship",
    department: "SE",
    stipend: "PKR 30,000 - 40,000 / month",
    description: "Manual and automated testing, writing test cases, Selenium, and API testing with Postman. Ideal for 6th-8th semester SE students.",
    applyLink: "https://systemsltd.com",
    postedDate: "3 days ago",
  },
  {
    id: "j4",
    title: "Python / Django Backend Engineer",
    company: "DevsUnited Technologies",
    location: "Rawalpindi / Remote",
    type: "Full-time",
    department: "All",
    stipend: "PKR 70,000 - 95,000 / month",
    description: "Entry-level full-time opening for fresh CS/SE/AI graduates. Strong understanding of OOP, relational databases, and RESTful architectures.",
    applyLink: "https://devsunited.pk",
    postedDate: "5 days ago",
  },
];

export const initialProjects: CollabProject[] = [
  {
    id: "proj1",
    title: "FUUAST Smart Campus Navigation & Noticeboard",
    department: "Cross-Disciplinary",
    description: "A centralized web and mobile portal providing interactive campus room navigation, timetables, and real-time department notices.",
    techStack: ["Next.js", "React Native", "Node.js", "PostgreSQL"],
    teamLead: "Bilal Ahmed (SE 8th)",
    neededRoles: ["UI/UX Designer", "Flutter Developer", "Backend Developer"],
    status: "Recruiting Members",
  },
  {
    id: "proj2",
    title: "Urdu Voice-to-Text Clinical Assistant (AI FYP)",
    department: "AI",
    description: "Final Year Project building an Urdu speech recognition model tailored for medical terminology in Pakistani hospital settings.",
    techStack: ["Python", "Whisper AI", "PyTorch", "FastAPI"],
    teamLead: "Ayesha Malik (AI 6th)",
    neededRoles: ["Dataset Collector", "FastAPI Developer"],
    status: "In Progress",
  },
  {
    id: "proj3",
    title: "FUUAST Past Papers & Academic Repository",
    department: "CS",
    description: "Open-source repository of verified past papers, notes, slides, and syllabus guides for CS, SE, and AI students across all semesters.",
    techStack: ["Next.js", "Tailwind CSS", "Firebase Storage"],
    teamLead: "Hamza Tariq (CS 6th)",
    neededRoles: ["Content Reviewers", "Frontend Contributor"],
    status: "Recruiting Members",
  },
];
