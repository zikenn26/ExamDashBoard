import bcrypt from 'bcryptjs';

// Hash password helper
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Users data
export const users = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    passwordHash: hashPassword("password123"), 
    savedExams: [1, 3, 5],
    role: "user"
  },
  { 
    id: 2, 
    name: "Admin User", 
    email: "admin@example.com", 
    passwordHash: hashPassword("admin123"), 
    savedExams: [],
    role: "admin"
  }
];

// Categories data
export const categories = [
  { id: 1, name: "Banking", icon: "Banknote", color: "bg-blue-500", description: "Banking and finance exams" },
  { id: 2, name: "JEE", icon: "Calculator", color: "bg-green-500", description: "Engineering entrance exams" },
  { id: 3, name: "UPSC", icon: "Shield", color: "bg-purple-500", description: "Civil services examinations" },
  { id: 4, name: "Medical", icon: "Heart", color: "bg-red-500", description: "Medical entrance exams" },
  { id: 5, name: "SSC", icon: "FileText", color: "bg-yellow-500", description: "Staff Selection Commission exams" },
  { id: 6, name: "Railways", icon: "Train", color: "bg-indigo-500", description: "Railway recruitment exams" }
];

// Exams data
export const exams = [
  { 
    id: 1, 
    name: "SBI PO", 
    categoryId: 1, 
    examDate: "2025-08-20", 
    applicationEndDate: "2025-07-15",
    description: "State Bank of India Probationary Officer recruitment exam",
    eligibility: "Graduate with 60% marks",
    fee: "₹750",
    status: "Open",
    seats: 2000,
    syllabus: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness"],
    officialWebsite: "https://sbi.co.in"
  },
  { 
    id: 2, 
    name: "JEE Advanced", 
    categoryId: 2, 
    examDate: "2025-09-10", 
    applicationEndDate: "2025-08-05",
    description: "Joint Entrance Examination for IIT admissions",
    eligibility: "Must qualify JEE Main",
    fee: "₹2800",
    status: "Open",
    seats: 16000,
    syllabus: ["Physics", "Chemistry", "Mathematics"],
    officialWebsite: "https://jeeadv.ac.in"
  },
  { 
    id: 3, 
    name: "UPSC CSE", 
    categoryId: 3, 
    examDate: "2025-10-15", 
    applicationEndDate: "2025-09-01",
    description: "Union Public Service Commission Civil Services Examination",
    eligibility: "Bachelor's degree",
    fee: "₹200",
    status: "Open",
    seats: 1000,
    syllabus: ["General Studies", "Optional Subject", "Essay", "Ethics"],
    officialWebsite: "https://upsc.gov.in"
  },
  { 
    id: 4, 
    name: "NEET UG", 
    categoryId: 4, 
    examDate: "2025-07-30", 
    applicationEndDate: "2025-06-15",
    description: "National Eligibility cum Entrance Test for MBBS/BDS",
    eligibility: "12th with PCB",
    fee: "₹1700",
    status: "Closed",
    seats: 100000,
    syllabus: ["Physics", "Chemistry", "Biology"],
    officialWebsite: "https://neet.nta.nic.in"
  },
  { 
    id: 5, 
    name: "SSC CGL", 
    categoryId: 5, 
    examDate: "2025-11-20", 
    applicationEndDate: "2025-10-05",
    description: "Staff Selection Commission Combined Graduate Level Exam",
    eligibility: "Graduate",
    fee: "₹100",
    status: "Open",
    seats: 8000,
    syllabus: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English"],
    officialWebsite: "https://ssc.nic.in"
  },
  { 
    id: 6, 
    name: "RRB NTPC", 
    categoryId: 6, 
    examDate: "2025-12-15", 
    applicationEndDate: "2025-11-01",
    description: "Railway Recruitment Board Non-Technical Popular Categories",
    eligibility: "Graduate",
    fee: "₹500",
    status: "Open",
    seats: 35000,
    syllabus: ["General Awareness", "Mathematics", "General Intelligence", "General Science"],
    officialWebsite: "https://rrbcdg.gov.in"
  }
];

// News data
export const news = [
  {
    id: 1,
    title: "UPSC 2025 Notification Released",
    summary: "The Union Public Service Commission has released the official notification for Civil Services Examination 2025. The application process will begin from February 2025 with new exam pattern changes including additional optional subjects.",
    category: "UPSC",
    sourceURL: "https://upsc.gov.in",
    publishedAt: "2025-01-15T10:30:00Z",
    imageUrl: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    title: "JEE Main 2025 Session 1 Results Announced",
    summary: "National Testing Agency (NTA) has announced JEE Main 2025 Session 1 results. Over 12 lakh students appeared for the exam with a 15% increase from last year. Top performers will be eligible for JEE Advanced.",
    category: "JEE",
    sourceURL: "https://jeemain.nta.nic.in",
    publishedAt: "2025-01-14T15:45:00Z",
    imageUrl: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    title: "Banking Sector Recruitment Drive 2025",
    summary: "Major public sector banks including SBI, PNB, and BOB have announced massive recruitment drives for 2025. Over 50,000 positions across various grades will be filled through upcoming examinations.",
    category: "Banking",
    sourceURL: "https://sbi.co.in",
    publishedAt: "2025-01-13T09:15:00Z",
    imageUrl: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 4,
    title: "NEET UG 2025 Application Process Extended",
    summary: "The National Testing Agency has extended the NEET UG 2025 application deadline by one week due to technical issues. Students are advised to complete their applications with all required documents.",
    category: "Medical",
    sourceURL: "https://neet.nta.nic.in",
    publishedAt: "2025-01-12T14:20:00Z",
    imageUrl: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 5,
    title: "SSC New Exam Calendar Released",
    summary: "Staff Selection Commission has released the annual exam calendar for 2025-26. The calendar includes dates for CGL, CHSL, MTS, and other major examinations with improved scheduling to avoid conflicts.",
    category: "SSC",
    sourceURL: "https://ssc.nic.in",
    publishedAt: "2025-01-11T11:00:00Z",
    imageUrl: "https://images.pexels.com/photos/5428660/pexels-photo-5428660.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 6,
    title: "Railway Recruitment Board Updates",
    summary: "RRB has announced new recruitment policies for 2025 including revised age limits and improved reservation policies. The changes will apply to all upcoming RRB examinations across different zones.",
    category: "Railways",
    sourceURL: "https://rrbcdg.gov.in",
    publishedAt: "2025-01-10T16:30:00Z",
    imageUrl: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

// Notifications data
export const notifications = [
  {
    id: 1,
    userId: 1,
    title: "Application Deadline Reminder",
    message: "Your saved exam 'SBI PO' application deadline is in 3 days!",
    type: "warning",
    isRead: false,
    createdAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    userId: 1,
    title: "New Exam Added",
    message: "A new exam 'IBPS Clerk' has been added to Banking category",
    type: "info",
    isRead: false,
    createdAt: "2025-01-14T14:30:00Z"
  }
];

// Helper functions
export const getExamsByCategory = (categoryId) => {
  return exams.filter(exam => exam.categoryId === categoryId);
};

export const getUpcomingExams = () => {
  const now = new Date();
  return exams.filter(exam => new Date(exam.examDate) > now).sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
};

export const getUserSavedExams = (userId) => {
  const user = users.find(u => u.id === userId);
  if (!user) return [];
  return exams.filter(exam => user.savedExams.includes(exam.id));
};

export const addExam = (examData) => {
  const newExam = {
    id: Math.max(...exams.map(e => e.id)) + 1,
    ...examData
  };
  exams.push(newExam);
  return newExam;
};

export const updateExam = (id, examData) => {
  const index = exams.findIndex(e => e.id === id);
  if (index !== -1) {
    exams[index] = { ...exams[index], ...examData };
    return exams[index];
  }
  return null;
};

export const deleteExam = (id) => {
  const index = exams.findIndex(e => e.id === id);
  if (index !== -1) {
    exams.splice(index, 1);
    return true;
  }
  return false;
};