import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const fetchLatestExamNews = async (category = null, limit = 10) => {
  if (!process.env.NEWS_API_KEY) {
    console.log('News API key not configured, using mock data');
    return getMockNews(category, limit);
  }

  try {
    // Define exam-related keywords for different categories
    const categoryKeywords = {
      'Banking': 'SBI PO IBPS bank recruitment',
      'JEE': 'JEE Main Advanced IIT engineering entrance',
      'UPSC': 'UPSC civil services IAS IPS',
      'Medical': 'NEET medical entrance MBBS',
      'SSC': 'SSC CGL CHSL staff selection commission',
      'Railways': 'RRB railway recruitment board'
    };

    const searchQuery = category && categoryKeywords[category] 
      ? categoryKeywords[category] 
      : 'competitive exam entrance test recruitment';

    const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=${limit}`;

    const response = await fetch(url, {
      headers: {
        'X-API-Key': process.env.NEWS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    return data.articles.map((article, index) => ({
      id: Date.now() + index,
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) + '...',
      category: category || detectCategory(article.title + ' ' + article.description),
      sourceURL: article.url,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage || getDefaultImage(category),
      source: article.source.name
    }));

  } catch (error) {
    console.error('News API Error:', error);
    return getMockNews(category, limit);
  }
};

export const fetchTrendingExamNews = async () => {
  if (!process.env.NEWS_API_KEY) {
    return getMockNews(null, 5);
  }

  try {
    const url = `${NEWS_API_BASE_URL}/everything?q=exam OR entrance OR recruitment OR notification&language=en&sortBy=popularity&pageSize=5`;

    const response = await fetch(url, {
      headers: {
        'X-API-Key': process.env.NEWS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    return data.articles.map((article, index) => ({
      id: Date.now() + index,
      title: article.title,
      summary: article.description || 'No summary available',
      category: detectCategory(article.title + ' ' + article.description),
      sourceURL: article.url,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage || getDefaultImage(),
      source: article.source.name,
      trending: true
    }));

  } catch (error) {
    console.error('Trending News API Error:', error);
    return getMockNews(null, 5);
  }
};

const detectCategory = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('bank') || lowerText.includes('sbi') || lowerText.includes('ibps')) {
    return 'Banking';
  } else if (lowerText.includes('jee') || lowerText.includes('iit') || lowerText.includes('engineering')) {
    return 'JEE';
  } else if (lowerText.includes('upsc') || lowerText.includes('civil service') || lowerText.includes('ias')) {
    return 'UPSC';
  } else if (lowerText.includes('neet') || lowerText.includes('medical') || lowerText.includes('mbbs')) {
    return 'Medical';
  } else if (lowerText.includes('ssc') || lowerText.includes('staff selection')) {
    return 'SSC';
  } else if (lowerText.includes('railway') || lowerText.includes('rrb')) {
    return 'Railways';
  }
  
  return 'General';
};

const getDefaultImage = (category) => {
  const images = {
    'Banking': 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400',
    'JEE': 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400',
    'UPSC': 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Medical': 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400',
    'SSC': 'https://images.pexels.com/photos/5428660/pexels-photo-5428660.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Railways': 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400'
  };
  
  return images[category] || 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400';
};

const getMockNews = (category, limit) => {
  const mockNews = [
    {
      id: 1,
      title: "UPSC 2025 Notification Released",
      summary: "The Union Public Service Commission has released the official notification for Civil Services Examination 2025.",
      category: "UPSC",
      sourceURL: "https://upsc.gov.in",
      publishedAt: new Date().toISOString(),
      imageUrl: getDefaultImage('UPSC'),
      source: "UPSC Official"
    },
    {
      id: 2,
      title: "JEE Main 2025 Session 1 Results Announced",
      summary: "National Testing Agency (NTA) has announced JEE Main 2025 Session 1 results.",
      category: "JEE",
      sourceURL: "https://jeemain.nta.nic.in",
      publishedAt: new Date().toISOString(),
      imageUrl: getDefaultImage('JEE'),
      source: "NTA Official"
    },
    {
      id: 3,
      title: "Banking Sector Recruitment Drive 2025",
      summary: "Major public sector banks have announced massive recruitment drives for 2025.",
      category: "Banking",
      sourceURL: "https://sbi.co.in",
      publishedAt: new Date().toISOString(),
      imageUrl: getDefaultImage('Banking'),
      source: "Banking News"
    }
  ];

  let filteredNews = mockNews;
  if (category) {
    filteredNews = mockNews.filter(news => news.category === category);
  }

  return filteredNews.slice(0, limit);
}