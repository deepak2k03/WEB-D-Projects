import React from 'react';
import { FileCode, Coffee, Code2, Cpu } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { id: 'java', name: 'Java', icon: Coffee, color: 'bg-orange-500', description: 'Object-oriented programming' },
  { id: 'python', name: 'Python', icon: Code2, color: 'bg-blue-500', description: 'High-level programming' },
  { id: 'c', name: 'C', icon: Cpu, color: 'bg-gray-500', description: 'System programming' },
  { id: 'cpp', name: 'C++', icon: FileCode, color: 'bg-purple-500', description: 'Systems & applications' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {languages.map((lang) => {
        const Icon = lang.icon;
        const isSelected = selectedLanguage === lang.id;
        
        return (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
              ${isSelected 
                ? `${lang.color} border-white text-white shadow-lg shadow-${lang.color.split('-')[1]}-500/25` 
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
              <div className="text-center">
                <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {lang.name}
                </h3>
                <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {lang.description}
                </p>
              </div>
            </div>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};