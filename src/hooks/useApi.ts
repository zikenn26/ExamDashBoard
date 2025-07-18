import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Mock data for client-side operation
const mockData = {
  categories: [
    { id: 1, name: "Banking", icon: "Banknote", color: "bg-blue-500", description: "Banking and finance exams" },
    { id: 2, name: "JEE", icon: "Calculator", color: "bg-green-500", description: "Engineering entrance exams" },
    { id: 3, name: "UPSC", icon: "Shield", color: "bg-purple-500", description: "Civil services examinations" },
    { id: 4, name: "Medical", icon: "Heart", color: "bg-red-500", description: "Medical entrance exams" },
    { id: 5, name: "SSC", icon: "FileText", color: "bg-yellow-500", description: "Staff Selection Commission exams" },
    { id: 6, name: "Railways", icon: "Train", color: "bg-indigo-500", description: "Railway recruitment exams" }
  ],
  exams: [
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
      officialWebsite: "https://sbi.co.in",
      category: { id: 1, name: "Banking", color: "bg-blue-500" }
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
      officialWebsite: "https://jeeadv.ac.in",
      category: { id: 2, name: "JEE", color: "bg-green-500" }
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
      officialWebsite: "https://upsc.gov.in",
      category: { id: 3, name: "UPSC", color: "bg-purple-500" }
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
      officialWebsite: "https://neet.nta.nic.in",
      category: { id: 4, name: "Medical", color: "bg-red-500" }
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
      officialWebsite: "https://ssc.nic.in",
      category: { id: 5, name: "SSC", color: "bg-yellow-500" }
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
      officialWebsite: "https://rrbcdg.gov.in",
      category: { id: 6, name: "Railways", color: "bg-indigo-500" }
    }
  ],
  news: [
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
  ]
};

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const useApi = <T>(url: string, options?: ApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let result: any = null;

      // Mock API responses based on URL
      if (url.includes('/api/categories')) {
        result = mockData.categories;
      } else if (url.includes('/api/exams/upcoming')) {
        const now = new Date();
        result = mockData.exams
          .filter(exam => new Date(exam.examDate) > now)
          .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
      } else if (url.includes('/api/exams')) {
        const urlParams = new URLSearchParams(url.split('?')[1] || '');
        const category = urlParams.get('category');
        const status = urlParams.get('status');
        const search = urlParams.get('search');

        let filteredExams = [...mockData.exams];

        if (category && category !== 'all') {
          filteredExams = filteredExams.filter(exam => exam.categoryId === parseInt(category));
        }

        if (status && status !== 'all') {
          filteredExams = filteredExams.filter(exam => exam.status.toLowerCase() === status.toLowerCase());
        }

        if (search) {
          const searchTerm = search.toLowerCase();
          filteredExams = filteredExams.filter(exam => 
            exam.name.toLowerCase().includes(searchTerm) ||
            exam.description.toLowerCase().includes(searchTerm)
          );
        }

        result = filteredExams;
      } else if (url.includes('/api/news')) {
        const urlParams = new URLSearchParams(url.split('?')[1] || '');
        const category = urlParams.get('category');
        const limit = urlParams.get('limit');

        let filteredNews = [...mockData.news];

        if (category && category !== 'all') {
          filteredNews = filteredNews.filter(item => item.category.toLowerCase() === category.toLowerCase());
        }

        filteredNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        if (limit) {
          filteredNews = filteredNews.slice(0, parseInt(limit));
        }

        result = filteredNews;
      } else if (url.includes('/api/user/saved-exams')) {
        // Mock saved exams - return first 2 exams for demo
        result = mockData.exams.slice(0, 2);
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, user]);

  return { data, loading, error, refetch: fetchData };
};

export const apiCall = async (url: string, options?: ApiOptions) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock API responses for save/unsave operations
  if (url.includes('/api/user/save-exam')) {
    if (options?.method === 'POST') {
      return { message: 'Exam saved successfully' };
    } else if (options?.method === 'DELETE') {
      return { message: 'Exam removed from saved list' };
    }
  }

  // Mock admin operations
  if (url.includes('/api/exams') && options?.method === 'POST') {
    // Add the new exam to mock data
    const newExam = {
      id: Date.now(),
      ...options.body,
      category: mockData.categories.find(cat => cat.id === options.body.categoryId)
    };
    mockData.exams.push(newExam);
    return { message: 'Exam added successfully', id: Date.now() };
  }

  if (url.includes('/api/exams') && options?.method === 'PUT') {
    // Update exam in mock data
    const examId = parseInt(url.split('/').pop() || '0');
    const examIndex = mockData.exams.findIndex(exam => exam.id === examId);
    if (examIndex !== -1) {
      mockData.exams[examIndex] = {
        ...mockData.exams[examIndex],
        ...options.body,
        category: mockData.categories.find(cat => cat.id === options.body.categoryId)
      };
    }
    return { message: 'Exam updated successfully' };
  }

  if (url.includes('/api/exams') && options?.method === 'DELETE') {
    // Remove exam from mock data
    const examId = parseInt(url.split('/').pop() || '0');
    const examIndex = mockData.exams.findIndex(exam => exam.id === examId);
    if (examIndex !== -1) {
      mockData.exams.splice(examIndex, 1);
    }
    return { message: 'Exam deleted successfully' };
  }

  return {};
};