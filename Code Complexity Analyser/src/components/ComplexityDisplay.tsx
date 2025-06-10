import React from 'react';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ComplexityResult } from '../utils/complexityAnalyzer';

interface ComplexityDisplayProps {
  result: ComplexityResult | null;
  isAnalyzing: boolean;
}

const getComplexityColor = (complexity: string) => {
  if (complexity.includes('O(1)')) return 'text-green-600 bg-green-50 border-green-200';
  if (complexity.includes('O(log')) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (complexity.includes('O(n)') && !complexity.includes('²')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (complexity.includes('O(n²)') || complexity.includes('O(n³)')) return 'text-red-600 bg-red-50 border-red-200';
  return 'text-purple-600 bg-purple-50 border-purple-200';
};

const getComplexityIcon = (complexity: string) => {
  if (complexity.includes('O(1)')) return CheckCircle;
  if (complexity.includes('O(log')) return Info;
  if (complexity.includes('O(n)') && !complexity.includes('²')) return Clock;
  if (complexity.includes('O(n²)') || complexity.includes('O(n³)')) return AlertTriangle;
  return TrendingUp;
};

export const ComplexityDisplay: React.FC<ComplexityDisplayProps> = ({ result, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Analyzing code complexity...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
        <p className="text-gray-600">Enter your code above and click "Analyze Complexity" to get started.</p>
      </div>
    );
  }

  const complexityColorClass = getComplexityColor(result.timeComplexity);
  const ComplexityIcon = getComplexityIcon(result.timeComplexity);

  return (
    <div className="space-y-6">
      {/* Main Complexity Result */}
      <div className={`rounded-xl border-2 p-6 ${complexityColorClass}`}>
        <div className="flex items-center space-x-3 mb-4">
          <ComplexityIcon className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Time Complexity</h3>
            <p className="text-sm opacity-80">Overall algorithmic complexity</p>
          </div>
        </div>
        <div className="text-3xl font-bold mb-2">{result.timeComplexity}</div>
        <p className="text-sm opacity-90">{result.explanation}</p>
      </div>

      {/* Analysis Breakdown */}
      {result.breakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            Analysis Breakdown
          </h4>
          <div className="space-y-3">
            {result.breakdown.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.operation}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(item.complexity)}`}>
                    {item.complexity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Space Complexity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-green-600" />
          Space Complexity
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">{result.spaceComplexity}</span>
          <p className="text-sm text-gray-600">Memory usage analysis</p>
        </div>
      </div>
    </div>
  );
};