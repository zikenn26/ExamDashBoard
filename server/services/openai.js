import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateExamSummary = async (examData) => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not configured, using fallback');
    return `${examData.name} is a ${examData.category?.name || 'competitive'} exam scheduled for ${new Date(examData.examDate).toLocaleDateString()}. Application deadline is ${new Date(examData.applicationEndDate).toLocaleDateString()}.`;
  }

  try {
    const prompt = `Generate a concise, informative summary for the following exam:
    
    Exam Name: ${examData.name}
    Category: ${examData.category?.name || 'General'}
    Exam Date: ${examData.examDate}
    Application Deadline: ${examData.applicationEndDate}
    Description: ${examData.description}
    Eligibility: ${examData.eligibility}
    Fee: ${examData.fee}
    Seats: ${examData.seats}
    
    Please provide a 2-3 sentence summary that highlights key information candidates should know.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational consultant specializing in competitive exams. Provide clear, accurate, and helpful information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return `${examData.name} is a ${examData.category?.name || 'competitive'} exam scheduled for ${new Date(examData.examDate).toLocaleDateString()}. Application deadline is ${new Date(examData.applicationEndDate).toLocaleDateString()}.`;
  }
};

export const generateNewsAnalysis = async (newsArticles) => {
  if (!process.env.OPENAI_API_KEY || !newsArticles.length) {
    return 'No recent exam news analysis available.';
  }

  try {
    const newsText = newsArticles.map(article => 
      `Title: ${article.title}\nSummary: ${article.summary}\nCategory: ${article.category}`
    ).join('\n\n');

    const prompt = `Analyze the following exam-related news and provide key insights and trends:

    ${newsText}

    Please provide:
    1. Key trends in competitive exams
    2. Important updates candidates should know
    3. Upcoming opportunities or changes
    
    Keep the analysis concise and actionable.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational analyst specializing in competitive exam trends and news analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI News Analysis Error:', error);
    return 'Unable to generate news analysis at this time.';
  }
};

export const generateChatResponse = async (userMessage, context = {}) => {
  if (!process.env.OPENAI_API_KEY) {
    return 'AI chat is not configured. Please add your OpenAI API key to enable this feature.';
  }

  try {
    const systemPrompt = `You are an AI assistant for an exam dashboard application. You help students with:
    - Information about competitive exams
    - Exam dates, deadlines, and schedules
    - Study tips and preparation advice
    - Latest exam news and updates
    - Application processes and requirements
    
    Available exam categories: Banking, JEE, UPSC, Medical, SSC, Railways
    
    Be helpful, accurate, and encouraging. If you don't have specific information, guide users on how to find it.`;

    const contextInfo = context.exams ? `\nAvailable exams: ${context.exams.map(e => e.name).join(', ')}` : '';
    const newsInfo = context.news ? `\nLatest news: ${context.news.map(n => n.title).join(', ')}` : '';

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt + contextInfo + newsInfo
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Chat Error:', error);
    return 'I apologize, but I\'m having trouble processing your request right now. Please try again later.';
  }
};