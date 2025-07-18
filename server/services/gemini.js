import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export const generateExamInsights = async (examData) => {
  if (!process.env.GEMINI_API_KEY) {
    console.log('Gemini API key not configured, using fallback');
    return {
      difficulty: 'Moderate',
      preparation_time: '3-6 months',
      key_topics: ['General Knowledge', 'Aptitude', 'English'],
      tips: ['Practice regularly', 'Take mock tests', 'Stay updated with current affairs']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the following competitive exam and provide insights:

    Exam: ${examData.name}
    Category: ${examData.category?.name || 'General'}
    Description: ${examData.description}
    Eligibility: ${examData.eligibility}
    Syllabus: ${examData.syllabus?.join(', ') || 'Not specified'}

    Please provide a JSON response with:
    {
      "difficulty": "Easy/Moderate/Hard",
      "preparation_time": "recommended preparation duration",
      "key_topics": ["topic1", "topic2", "topic3"],
      "tips": ["tip1", "tip2", "tip3"],
      "success_rate": "estimated success rate percentage",
      "career_prospects": "brief career prospects description"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, return structured fallback
      return {
        difficulty: 'Moderate',
        preparation_time: '3-6 months',
        key_topics: examData.syllabus || ['General Knowledge', 'Aptitude'],
        tips: ['Practice regularly', 'Take mock tests', 'Focus on weak areas'],
        success_rate: '15-20%',
        career_prospects: 'Good career opportunities in the respective field'
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      difficulty: 'Moderate',
      preparation_time: '3-6 months',
      key_topics: examData.syllabus || ['General Knowledge', 'Aptitude'],
      tips: ['Practice regularly', 'Take mock tests', 'Stay updated'],
      success_rate: '15-20%',
      career_prospects: 'Good opportunities available'
    };
  }
};

export const generateStudyPlan = async (examData, timeAvailable) => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      plan: 'Create a structured study schedule, allocate time for each subject, and take regular mock tests.',
      schedule: ['Week 1-2: Foundation building', 'Week 3-4: Practice tests', 'Week 5-6: Revision']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Create a personalized study plan for:

    Exam: ${examData.name}
    Time Available: ${timeAvailable}
    Syllabus: ${examData.syllabus?.join(', ') || 'General syllabus'}
    Exam Date: ${examData.examDate}

    Provide a JSON response with:
    {
      "plan": "overall study strategy",
      "schedule": ["week-wise breakdown"],
      "daily_hours": "recommended daily study hours",
      "resources": ["recommended resources"],
      "milestones": ["key milestones to track progress"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return {
        plan: 'Follow a systematic approach with regular practice and revision',
        schedule: ['Foundation Phase', 'Practice Phase', 'Revision Phase'],
        daily_hours: '4-6 hours',
        resources: ['Standard textbooks', 'Online mock tests', 'Previous year papers'],
        milestones: ['Complete syllabus', 'Achieve target score in mocks', 'Final revision']
      };
    }
  } catch (error) {
    console.error('Gemini Study Plan Error:', error);
    return {
      plan: 'Create a balanced study schedule with regular assessments',
      schedule: ['Preparation phase', 'Practice phase', 'Revision phase'],
      daily_hours: '4-6 hours',
      resources: ['Books', 'Online tests', 'Study groups'],
      milestones: ['Weekly targets', 'Monthly assessments', 'Final preparation']
    };
  }
};

export const generatePersonalizedRecommendations = async (userProfile, examHistory) => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      recommended_exams: ['Based on your interests, consider exploring related exam categories'],
      study_tips: ['Focus on your strong subjects', 'Improve weak areas gradually'],
      career_guidance: ['Explore career options in your field of interest']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate personalized recommendations for a student:

    User Profile: ${JSON.stringify(userProfile)}
    Exam History: ${JSON.stringify(examHistory)}

    Provide recommendations in JSON format:
    {
      "recommended_exams": ["exam suggestions based on profile"],
      "study_tips": ["personalized study advice"],
      "career_guidance": ["career path suggestions"],
      "skill_development": ["skills to focus on"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      return {
        recommended_exams: ['Explore exams in your area of interest'],
        study_tips: ['Maintain consistency', 'Practice regularly'],
        career_guidance: ['Consider your strengths and interests'],
        skill_development: ['Focus on core competencies']
      };
    }
  } catch (error) {
    console.error('Gemini Recommendations Error:', error);
    return {
      recommended_exams: ['Check trending exams in your field'],
      study_tips: ['Stay consistent with preparation'],
      career_guidance: ['Align exams with career goals'],
      skill_development: ['Build fundamental skills']
    };
  }
};