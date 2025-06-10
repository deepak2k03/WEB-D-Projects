export interface BreakdownItem {
  operation: string;
  complexity: string;
  description: string;
}

export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  breakdown: BreakdownItem[];
}

class ComplexityAnalyzer {
  private code: string;
  private language: string;
  private lines: string[];

  constructor(code: string, language: string) {
    this.code = code.trim();
    this.language = language;
    this.lines = this.code.split("\n").map((line) => line.trim());
  }

  analyze(): ComplexityResult {
    const breakdown: BreakdownItem[] = [];
    let maxComplexity = "O(1)";
    let spaceComplexity = "O(1)";

    // First check for specific algorithmic patterns
    const algorithmAnalysis = this.analyzeAlgorithmicPatterns();
    if (algorithmAnalysis.complexity !== "O(1)") {
      breakdown.push(algorithmAnalysis);
      maxComplexity = this.getWorstComplexity(
        maxComplexity,
        algorithmAnalysis.complexity
      );
    }

    // Analyze loops (but consider algorithmic context)
    const loopAnalysis = this.analyzeLoops();
    if (
      loopAnalysis.complexity !== "O(1)" &&
      algorithmAnalysis.complexity === "O(1)"
    ) {
      breakdown.push(loopAnalysis);
      maxComplexity = this.getWorstComplexity(
        maxComplexity,
        loopAnalysis.complexity
      );
    }

    // Analyze recursion
    const recursionAnalysis = this.analyzeRecursion();
    if (recursionAnalysis.complexity !== "O(1)") {
      breakdown.push(recursionAnalysis);
      maxComplexity = this.getWorstComplexity(
        maxComplexity,
        recursionAnalysis.complexity
      );
    }

    // Analyze built-in functions
    const builtinAnalysis = this.analyzeBuiltinFunctions();
    builtinAnalysis.forEach((analysis) => {
      if (analysis.complexity !== "O(1)") {
        breakdown.push(analysis);
        maxComplexity = this.getWorstComplexity(
          maxComplexity,
          analysis.complexity
        );
      }
    });

    // Analyze space complexity
    spaceComplexity = this.analyzeSpaceComplexity();

    const explanation = this.generateExplanation(maxComplexity);

    return {
      timeComplexity: maxComplexity,
      spaceComplexity,
      explanation,
      breakdown,
    };
  }

  private analyzeAlgorithmicPatterns(): BreakdownItem {
    const codeNormalized = this.code.toLowerCase().replace(/\s+/g, " ");

    // Binary Search Pattern Detection
    const binarySearchPatterns = [
      // Classic binary search with mid calculation and left/right pointers
      /while.*left.*<=.*right.*mid.*=.*(left.*\+.*right).*\/.*2/,
      /while.*low.*<=.*high.*mid.*=.*(low.*\+.*high).*\/.*2/,
      /while.*start.*<=.*end.*mid.*=.*(start.*\+.*end).*\/.*2/,
      // Binary search with array access and comparison
      /arr\[mid\].*==.*target|arr\[mid\].*<.*target|arr\[mid\].*>.*target/,
      // Function name indicators
      /binary.*search|binarysearch/,
      // Divide and conquer pattern with halving
      /(left|low|start).*=.*mid.*\+.*1.*(right|high|end).*=.*mid.*-.*1/,
    ];

    const hasBinarySearchPattern = binarySearchPatterns.some((pattern) =>
      pattern.test(codeNormalized)
    );

    if (hasBinarySearchPattern) {
      return {
        operation: "Binary Search Algorithm",
        complexity: "O(log n)",
        description:
          "Divide and conquer search - eliminates half the search space each iteration",
      };
    }

    // Quick Sort Pattern Detection
    const quickSortPatterns = [
      /quicksort|quick.*sort/,
      /partition.*function|partition.*method/,
      /pivot.*element|pivot.*selection/,
    ];

    if (quickSortPatterns.some((pattern) => pattern.test(codeNormalized))) {
      return {
        operation: "Quick Sort Algorithm",
        complexity: "O(n log n)",
        description: "Divide and conquer sorting algorithm",
      };
    }

    // Merge Sort Pattern Detection
    const mergeSortPatterns = [
      /mergesort|merge.*sort/,
      /merge.*function.*merge.*function/,
      /divide.*array.*merge.*sorted/,
    ];

    if (mergeSortPatterns.some((pattern) => pattern.test(codeNormalized))) {
      return {
        operation: "Merge Sort Algorithm",
        complexity: "O(n log n)",
        description: "Stable divide and conquer sorting algorithm",
      };
    }

    // Fibonacci with Memoization
    const fibonacciMemoPatterns = [
      /fibonacci.*memo|memo.*fibonacci/,
      /dp\[.*\].*fibonacci|fibonacci.*dp\[.*\]/,
    ];

    if (fibonacciMemoPatterns.some((pattern) => pattern.test(codeNormalized))) {
      return {
        operation: "Fibonacci with Memoization",
        complexity: "O(n)",
        description: "Dynamic programming approach to Fibonacci sequence",
      };
    }

    return {
      operation: "No Specific Algorithm Detected",
      complexity: "O(1)",
      description: "No recognized algorithmic patterns found",
    };
  }

  private analyzeLoops(): BreakdownItem {
    const loopStartPatterns = [
      /for\s*\(.*;.*<.*;.*\)/,
      /while\s*\(.*\)/,
      /for\s+\w+\s+in\s+range\(/,
    ];

    const loopStack: number[] = [];
    let maxNesting = 0;
    let hasHalvingLoop = false;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];

      const isLoopStart = loopStartPatterns.some((pattern) =>
        pattern.test(line)
      );
      const isBlockStart = line.includes("{");
      const isBlockEnd = line.includes("}");

      if (isLoopStart) {
        loopStack.push(i);
        maxNesting = Math.max(maxNesting, loopStack.length);

        if (
          line.includes("/= 2") ||
          line.includes(">>= 1") ||
          line.includes("i = i/2") ||
          line.includes("n = n/2") ||
          (line.includes("left + right") && line.includes("/2"))
        ) {
          hasHalvingLoop = true;
        }
      }

      if (isBlockEnd && loopStack.length > 0) {
        loopStack.pop();
      }
    }

    if (maxNesting === 0) {
      return {
        operation: "Sequential Operations",
        complexity: "O(1)",
        description: "No loops detected - constant time operations",
      };
    }

    if (maxNesting === 1 && hasHalvingLoop) {
      return {
        operation: "Logarithmic Loop",
        complexity: "O(log n)",
        description: "Loop with halving pattern - logarithmic time complexity",
      };
    }

    const complexity =
      maxNesting === 1
        ? "O(n)"
        : maxNesting === 2
        ? "O(n²)"
        : maxNesting === 3
        ? "O(n³)"
        : `O(n^${maxNesting})`;

    return {
      operation: `Nested Loops (${maxNesting} levels)`,
      complexity,
      description: `${maxNesting} level${
        maxNesting > 1 ? "s" : ""
      } of loop nesting detected`,
    };
  }

  private analyzeRecursion(): BreakdownItem {
    let hasRecursion = false;
    let hasMultipleRecursiveCalls = false;
    let functionName = "";
    let hasDivideAndConquer = false;

    // Extract function names
    const functionMatches = this.code.match(
      /(?:def|function|public|private|static)*\s*(\w+)\s*\(/g
    );
    if (functionMatches) {
      functionName = functionMatches[0].match(/(\w+)\s*\(/)?.[1] || "";
    }

    for (const line of this.lines) {
      if (functionName && line.includes(functionName + "(")) {
        hasRecursion = true;
        // Check if there are multiple recursive calls in the same line
        const matches = line.match(new RegExp(functionName + "\\(", "g"));
        if (matches && matches.length > 1) {
          hasMultipleRecursiveCalls = true;
        }

        // Check for divide and conquer patterns
        if (
          line.includes("/2") ||
          line.includes("mid") ||
          (line.includes("left") && line.includes("right"))
        ) {
          hasDivideAndConquer = true;
        }
      }
    }

    if (!hasRecursion) {
      return {
        operation: "No Recursion",
        complexity: "O(1)",
        description: "No recursive calls detected",
      };
    }

    // Check for common recursive patterns
    if (
      this.code.toLowerCase().includes("fibonacci") &&
      hasMultipleRecursiveCalls
    ) {
      return {
        operation: "Exponential Recursion (Fibonacci)",
        complexity: "O(2^n)",
        description:
          "Multiple recursive calls without memoization - exponential growth",
      };
    }

    if (
      hasDivideAndConquer ||
      this.code.toLowerCase().includes("binary") ||
      this.code.toLowerCase().includes("merge") ||
      this.code.toLowerCase().includes("quick")
    ) {
      return {
        operation: "Divide & Conquer Recursion",
        complexity: "O(log n)",
        description: "Logarithmic recursion - dividing problem space in half",
      };
    }

    return {
      operation: "Linear Recursion",
      complexity: "O(n)",
      description: "Single recursive call - linear depth",
    };
  }

  private analyzeBuiltinFunctions(): BreakdownItem[] {
    const builtinComplexities: {
      [key: string]: { complexity: string; description: string };
    } = {
      sort: { complexity: "O(n log n)", description: "Sorting operation" },
      sorted: { complexity: "O(n log n)", description: "Sorting operation" },
      "Arrays.sort": { complexity: "O(n log n)", description: "Array sorting" },
      "Collections.sort": {
        complexity: "O(n log n)",
        description: "Collection sorting",
      },
      qsort: { complexity: "O(n log n)", description: "Quick sort operation" },
      find: { complexity: "O(n)", description: "Linear search operation" },
      indexOf: { complexity: "O(n)", description: "Linear search in array" },
      reverse: { complexity: "O(n)", description: "Array reversal operation" },
      max: { complexity: "O(n)", description: "Finding maximum element" },
      min: { complexity: "O(n)", description: "Finding minimum element" },
    };

    const detected: BreakdownItem[] = [];

    for (const [func, info] of Object.entries(builtinComplexities)) {
      if (this.code.includes(func)) {
        detected.push({
          operation: `Built-in Function: ${func}`,
          complexity: info.complexity,
          description: info.description,
        });
      }
    }

    return detected;
  }

  private analyzeSpaceComplexity(): string {
    let spaceComplexity = "O(1)";

    // Check for array/list creation
    if (
      this.code.includes("new ") ||
      this.code.includes("[]") ||
      this.code.includes("list(") ||
      this.code.includes("vector")
    ) {
      spaceComplexity = "O(n)";
    }

    // Check for recursion (uses call stack)
    const recursionResult = this.analyzeRecursion();
    if (recursionResult.complexity === "O(log n)") {
      spaceComplexity = this.getWorstComplexity(spaceComplexity, "O(log n)");
    } else if (recursionResult.complexity !== "O(1)") {
      spaceComplexity = this.getWorstComplexity(spaceComplexity, "O(n)");
    }

    // Check for 2D arrays or nested structures
    if (
      this.code.includes("[][]") ||
      (this.code.includes("new ") &&
        this.code.includes("[") &&
        this.code.includes("]["))
    ) {
      spaceComplexity = "O(n²)";
    }

    return spaceComplexity;
  }

  private getWorstComplexity(current: string, candidate: string): string {
    const complexityOrder = [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(n³)",
      "O(2^n)",
    ];
    const currentIndex = complexityOrder.indexOf(current);
    const candidateIndex = complexityOrder.indexOf(candidate);

    return candidateIndex > currentIndex ? candidate : current;
  }

  private generateExplanation(complexity: string): string {
    const explanations: { [key: string]: string } = {
      "O(1)": "Constant time - execution time does not depend on input size",
      "O(log n)":
        "Logarithmic time - very efficient, execution time grows slowly with input size",
      "O(n)":
        "Linear time - execution time grows proportionally with input size",
      "O(n log n)":
        "Linearithmic time - common in efficient sorting algorithms",
      "O(n²)":
        "Quadratic time - execution time grows quadratically with input size",
      "O(n³)": "Cubic time - execution time grows cubically with input size",
      "O(2^n)":
        "Exponential time - execution time doubles with each additional input",
    };

    return explanations[complexity] || "Complex algorithmic behavior detected";
  }
}

export const analyzeComplexity = (
  code: string,
  language: string
): ComplexityResult => {
  const analyzer = new ComplexityAnalyzer(code, language);
  return analyzer.analyze();
};
