import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import i18n from 'i18next';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'EN', name: 'English', lng: 'en' },
    { code: 'HI', name: 'हिन्दी', lng: 'hi' },
  ];

  return (
    <div className="flex justify-end px-4 py-3 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-green-100 rounded-full px-4 py-2 space-x-2 active:scale-95 transition-transform touch-manipulation"
      >
        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
        <span className="text-sm font-medium text-gray-800">{selectedLanguage}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-14 right-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLanguage(lang.name);
                localStorage.setItem('lang', lang.lng);
                i18n.changeLanguage(lang.lng);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 flex items-center space-x-3 transition-colors touch-manipulation"
            >
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {lang.code.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-800">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
