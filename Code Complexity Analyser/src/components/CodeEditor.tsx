import React from 'react';
import { Code, Copy, Download } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const extensions = { java: 'java', python: 'py', c: 'c', cpp: 'cpp' };
    const ext = extensions[language as keyof typeof extensions] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPlaceholder = () => {
    const placeholders = {
      java: `public class Example {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++) {
            for (int j = 0; j < n-i-1; j++) {
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      c: `#include <stdio.h>

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
};`
    };
    return placeholders[language as keyof typeof placeholders] || '';
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-200">Code Editor</span>
          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-6 resize-none border-none outline-none"
          style={{ 
            fontFamily: 'Fira Code, Monaco, Consolas, monospace',
            tabSize: 4
          }}
        />
        <div className="absolute top-4 right-4 text-xs text-gray-500">
          Lines: {code.split('\n').length}
        </div>
      </div>
    </div>
  );
};