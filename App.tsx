import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, History, Trash2, Globe } from 'lucide-react';
import { translateName } from './services/geminiService';
import { NameTranslation, HistoryItem } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultCard } from './components/ResultCard';

function App() {
  const [inputName, setInputName] = useState('');
  const [result, setResult] = useState<NameTranslation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('nameHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('nameHistory', JSON.stringify(history));
  }, [history]);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setShowHistory(false);

    try {
      const data = await translateName(inputName);
      setResult(data);
      
      // Add to history
      const newItem: HistoryItem = {
        ...data,
        id: Date.now().toString(),
        originalName: inputName,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('nameHistory');
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInputName(item.originalName);
    setResult({
        hangul: item.hangul,
        romanization: item.romanization,
        meaning: item.meaning,
        origin: item.origin
    });
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-purple-600 rounded-b-[40px] z-0">
          <div className="absolute w-64 h-64 bg-purple-500 rounded-full -top-20 -right-20 opacity-50 blur-3xl"></div>
          <div className="absolute w-48 h-48 bg-indigo-500 rounded-full top-10 -left-10 opacity-50 blur-2xl"></div>
        </div>

        {/* Header Content */}
        <header className="relative z-10 px-6 pt-12 pb-6 flex justify-between items-center text-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-purple-200" />
              <span className="text-xs font-medium tracking-wider text-purple-200 uppercase">Global Name Converter</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              이름 변환기
            </h1>
            <p className="text-purple-100 text-sm mt-1 opacity-90">
              외국 이름을 자연스러운 한글로
            </p>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-full transition-all duration-300 ${showHistory ? 'bg-white text-purple-600' : 'bg-purple-700/50 text-white hover:bg-purple-700'}`}
          >
            <History size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 px-6 -mt-4 pb-10">
          
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 transform transition-all hover:scale-[1.01]">
            <form onSubmit={handleTranslate} className="relative">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Name (e.g. Michael)"
                className="w-full pl-5 pr-14 py-4 text-lg text-gray-800 placeholder-gray-400 bg-transparent rounded-xl outline-none"
              />
              <button
                type="submit"
                disabled={loading || !inputName.trim()}
                className={`absolute right-2 top-2 bottom-2 aspect-square rounded-xl flex items-center justify-center transition-all duration-300 ${
                  inputName.trim() 
                    ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={20} />
                )}
              </button>
            </form>
          </div>

          {/* Dynamic Content */}
          <div className="transition-all duration-500 min-h-[300px]">
            {showHistory ? (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">최근 기록</h3>
                  {history.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600"
                    >
                      <Trash2 size={14} /> 전체 삭제
                    </button>
                  )}
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>변환 기록이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-purple-200 transition-colors"
                      >
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-1">{item.originalName}</p>
                          <p className="text-lg font-bold text-gray-800">{item.hangul}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-md">{item.origin}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 animate-fade-in">
                <p className="font-semibold mb-2">오류가 발생했습니다</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            ) : result ? (
              <ResultCard data={result} originalName={inputName} />
            ) : (
              /* Empty State / Intro */
              <div className="text-center pt-10 px-4 opacity-60">
                <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">이름을 입력해보세요</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  AI가 언어적 뉘앙스를 고려하여<br/>가장 자연스러운 한글 표기를 찾아드립니다.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {['James', 'Yuki', 'Isabella', 'Muhammad'].map(name => (
                        <button 
                            key={name}
                            onClick={() => setInputName(name)}
                            className="text-xs bg-gray-100 hover:bg-purple-50 text-gray-500 hover:text-purple-600 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {name}
                        </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Footer Credit */}
        <footer className="py-6 text-center text-xs text-gray-400">
            Powered by Google Gemini 2.5
        </footer>
      </div>
    </div>
  );
}

export default App;
