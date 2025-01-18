import React, { useEffect, useState } from "react";

// SVG Icons remain the same
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const NewsModal = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-blue-900/50 to-black border border-blue-500/30 rounded-lg z-50 m-4 shadow-xl shadow-blue-500/20">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-blue-900/50 hover:bg-blue-800/75 text-white transition-colors z-10">
          <CloseIcon />
        </button>
        <div className="relative w-full h-[40vh]">
          <img src={news.image} alt={news.title} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm text-white border border-blue-500/30">{news.category}</span>
            <span className="text-blue-200/80">{news.date}</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">{news.title}</h2>
          <div className="flex items-center space-x-4 mb-6 text-blue-200/80">
            <span>By {news.author}</span>
            <span>•</span>
            <span>{news.readTime}</span>
          </div>
          <div className="prose prose-invert max-w-none text-blue-100/90">{news.content}</div>
        </div>
      </div>
    </div>
  );
};

const News = () => {
  // State declarations remain the same
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isCardAutoScrolling, setIsCardAutoScrolling] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const cardsPerPage = 3;

  const NewsGrid = () => {
    const totalCards = newsData.slice(1).length;
    const maxStartIndex = Math.max(0, totalCards - cardsPerPage);

    return (
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentCardIndex * 100) / cardsPerPage}%)`,
            }}
          >
            {newsData.slice(1).map((news) => (
              <div
                key={news.id}
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3"
                onClick={() => setSelectedNews(news)}
              >
                <div className="bg-gradient-to-b from-blue-900/40 to-black border border-blue-500/30 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
                  <img src={news.image} alt={news.title} className="w-full h-48 object-cover opacity-90" />
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-600/50 px-2 py-1 rounded-full text-xs text-white border border-blue-500/30">{news.category}</span>
                      <span className="text-xs text-blue-200/80">{news.date}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{news.title}</h3>
                    <div className="flex items-center text-xs text-blue-200/80">
                      <span>{news.author}</span>
                      <span className="mx-2">•</span>
                      <span>{news.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => {
            setIsCardAutoScrolling(false);
            setCurrentCardIndex((prev) => prev === 0 ? maxStartIndex : prev - 1);
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-900/50 hover:bg-blue-800/75 text-white p-2 rounded-full transition-colors z-10 border border-blue-500/30"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={() => {
            setIsCardAutoScrolling(false);
            setCurrentCardIndex((prev) => prev >= maxStartIndex ? 0 : prev + 1);
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-900/50 hover:bg-blue-800/75 text-white p-2 rounded-full transition-colors z-10 border border-blue-500/30"
        >
          <ChevronRightIcon />
        </button>
      </div>
    );
  };

  // useEffect hooks and fetch function remain the same
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_KEY = "d97f62b710606c98e15a7973c33a2483";
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=esports&token=${API_KEY}`
        );
        const data = await response.json();

        const transformedData = data.articles.map((article, index) => ({
          id: index,
          title: article.title,
          date: new Date(article.publishedAt).toLocaleDateString(),
          category: article.source.name,
          readTime: `${Math.ceil(article.content?.length / 1000 || 3)} min read`,
          image: article.image || "/api/placeholder/800/400",
          content: article.content,
        }));

        setNewsData(transformedData);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch news");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoScrolling && newsData.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === newsData.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, newsData.length]);

  useEffect(() => {
    let interval;
    if (isCardAutoScrolling && newsData.length > 0) {
      interval = setInterval(() => {
        setCurrentCardIndex((prevIndex) => {
          const maxStartIndex = Math.max(0, newsData.length - 1 - cardsPerPage);
          return prevIndex >= maxStartIndex ? 0 : prevIndex + 1;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isCardAutoScrolling, newsData.length]);

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === newsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8 bg-black/40">
      <div className="relative w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Latest News</h1>
        <div className="relative overflow-hidden rounded-lg shadow-lg shadow-blue-500/20">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {newsData.map((news) => (
              <div key={news.id} className="w-full flex-shrink-0">
                <div className="relative bg-gradient-to-b from-blue-900/40 to-black border border-blue-500/30">
                  <img src={news.image} alt={news.title} className="w-full h-96 object-cover opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm border border-blue-500/30">{news.category}</span>
                      <span className="text-sm text-blue-200/80">{news.date}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">{news.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-blue-200/80">
                      <span>By {news.author}</span>
                      <span>{news.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-900/50 hover:bg-blue-800/75 text-white p-2 rounded-full transition-colors border border-blue-500/30"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-900/50 hover:bg-blue-800/75 text-white p-2 rounded-full transition-colors border border-blue-500/30"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {newsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoScrolling(false);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-colors border ${
                index === currentIndex ? "bg-blue-500 border-blue-400" : "bg-blue-900/50 border-blue-500/30"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-8">
        <NewsGrid />
      </div>
      {selectedNews && <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />}
    </div>
  );
};

export default News;