import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader } from 'lucide-react';
import { useApi } from '../../hooks/useApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'exam-list' | 'news-list';
  data?: any;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Exam Assistant. I can help you with:\n\n• Find upcoming exams\n• Get exam details by category\n• Latest exam news\n• Application deadlines\n• Exam schedules\n\nWhat would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: exams } = useApi('/api/exams');
  const { data: categories } = useApi('/api/categories');
  const { data: news } = useApi('/api/news');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserMessage = async (message: string): Promise<Message> => {
    const lowerMessage = message.toLowerCase();
    
    // Try to use real AI API first
    try {
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          context: { exams, categories, news }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: Date.now().toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.log('AI API not available, using fallback logic');
    }

    // Fallback to rule-based responses
    await new Promise(resolve => setTimeout(resolve, 800));

    // Intent recognition and response generation
    if (lowerMessage.includes('upcoming') || lowerMessage.includes('next') || lowerMessage.includes('soon')) {
      const upcomingExams = exams?.filter(exam => {
        const examDate = new Date(exam.examDate);
        const now = new Date();
        return examDate > now;
      }).slice(0, 5);

      return {
        id: Date.now().toString(),
        text: `Here are the upcoming exams:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: upcomingExams
      };
    }

    if (lowerMessage.includes('banking') || lowerMessage.includes('bank')) {
      const bankingExams = exams?.filter(exam => 
        exam.category?.name.toLowerCase().includes('banking')
      );

      return {
        id: Date.now().toString(),
        text: `Here are the banking exams available:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: bankingExams
      };
    }

    if (lowerMessage.includes('jee') || lowerMessage.includes('engineering')) {
      const jeeExams = exams?.filter(exam => 
        exam.category?.name.toLowerCase().includes('jee')
      );

      return {
        id: Date.now().toString(),
        text: `Here are the JEE/Engineering exams:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: jeeExams
      };
    }

    if (lowerMessage.includes('upsc') || lowerMessage.includes('civil service')) {
      const upscExams = exams?.filter(exam => 
        exam.category?.name.toLowerCase().includes('upsc')
      );

      return {
        id: Date.now().toString(),
        text: `Here are the UPSC/Civil Services exams:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: upscExams
      };
    }

    if (lowerMessage.includes('medical') || lowerMessage.includes('neet') || lowerMessage.includes('mbbs')) {
      const medicalExams = exams?.filter(exam => 
        exam.category?.name.toLowerCase().includes('medical')
      );

      return {
        id: Date.now().toString(),
        text: `Here are the medical entrance exams:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: medicalExams
      };
    }

    if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('update')) {
      const latestNews = news?.slice(0, 3);

      return {
        id: Date.now().toString(),
        text: `Here are the latest exam news updates:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'news-list',
        data: latestNews
      };
    }

    if (lowerMessage.includes('deadline') || lowerMessage.includes('application') || lowerMessage.includes('apply')) {
      const openExams = exams?.filter(exam => exam.status === 'Open').slice(0, 5);

      return {
        id: Date.now().toString(),
        text: `Here are exams with open applications:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: openExams
      };
    }

    if (lowerMessage.includes('categories') || lowerMessage.includes('category')) {
      const categoryList = categories?.map(cat => `• ${cat.name}: ${cat.description}`).join('\n');

      return {
        id: Date.now().toString(),
        text: `Available exam categories:\n\n${categoryList}`,
        sender: 'bot',
        timestamp: new Date()
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return {
        id: Date.now().toString(),
        text: `I can help you with:\n\n• 📅 Find upcoming exams\n• 🏷️ Search exams by category (Banking, JEE, UPSC, Medical, etc.)\n• 📰 Get latest exam news\n• ⏰ Check application deadlines\n• 📋 List exam categories\n• 🔍 Search for specific exams\n\nJust ask me anything about exams!`,
        sender: 'bot',
        timestamp: new Date()
      };
    }

    // Search for specific exam names
    const foundExam = exams?.find(exam => 
      exam.name.toLowerCase().includes(lowerMessage) ||
      lowerMessage.includes(exam.name.toLowerCase())
    );

    if (foundExam) {
      return {
        id: Date.now().toString(),
        text: `Found information about ${foundExam.name}:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'exam-list',
        data: [foundExam]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      text: `I understand you're asking about "${message}". I can help you with exam information! Try asking about:\n\n• "Show me upcoming exams"\n• "Banking exams"\n• "Latest news"\n• "Application deadlines"\n• "JEE exams"\n• "UPSC exams"\n\nWhat specific information would you like?`,
      sender: 'bot',
      timestamp: new Date()
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await processUserMessage(inputText);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const renderMessage = (message: Message) => {
    const isBot = message.sender === 'bot';

    return (
      <div key={message.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-blue-500 mr-2' : 'bg-gray-500 ml-2'
          }`}>
            {isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
          </div>
          
          <div className={`rounded-lg px-4 py-2 ${
            isBot 
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            <p className="text-sm whitespace-pre-line">{message.text}</p>
            
            {message.type === 'exam-list' && message.data && (
              <div className="mt-3 space-y-2">
                {message.data.map((exam: any) => (
                  <div key={exam.id} className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{exam.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        exam.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{exam.description}</p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Exam: {formatDate(new Date(exam.examDate))}</span>
                      <span>Apply by: {formatDate(new Date(exam.applicationEndDate))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message.type === 'news-list' && message.data && (
              <div className="mt-3 space-y-2">
                {message.data.map((article: any) => (
                  <div key={article.id} className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{article.title}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{article.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(new Date(article.publishedAt))}
                      </span>
                      <a 
                        href={article.sourceURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Exam Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about exams, news, deadlines..."
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
          >
            {isTyping ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;