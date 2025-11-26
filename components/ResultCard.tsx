import React, { useState } from 'react';
import { NameTranslation } from '../types';
import { Copy, Check, Volume2, Share2 } from 'lucide-react';

interface ResultCardProps {
  data: NameTranslation;
  originalName: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, originalName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.hangul);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(data.hangul);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '한글 이름 변환 결과',
          text: `${originalName} -> ${data.hangul}\n(${data.romanization})`,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden animate-fade-in-up transition-all duration-500">
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute top-10 -right-10 w-24 h-24 bg-purple-300 opacity-20 rounded-full blur-lg"></div>
        
        <p className="text-purple-100 text-sm font-medium mb-1 tracking-wider uppercase">{data.origin} Origin</p>
        <h2 className="text-5xl font-black mb-2 tracking-tight">{data.hangul}</h2>
        <p className="text-purple-200 text-lg font-light">{data.romanization}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">이름 설명</h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {data.meaning}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleSpeak}
            className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 active:bg-purple-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
              <Volume2 size={20} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">듣기</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 active:bg-purple-50 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${copied ? 'bg-green-100' : 'bg-purple-100 group-hover:bg-purple-200'}`}>
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-purple-600" />}
            </div>
            <span className="text-xs font-medium text-gray-500">{copied ? '복사됨' : '복사'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 active:bg-purple-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
              <Share2 size={20} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">공유</span>
          </button>
        </div>
      </div>
    </div>
  );
};
