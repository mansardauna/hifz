import { CodingTrack } from './types';

export const DEFAULT_CODING_TRACKS: CodingTrack[] = [
  {
    id: 'track-js-foundations',
    title: 'JavaScript Algorithms & Core Foundations',
    slug: 'javascript-foundations',
    description: 'Master core computational thinking, functions, loops, and data structures with real-time test validation.',
    icon: '⚡',
    modules: [
      {
        id: 'mod-js-1',
        title: 'Module 1: Variables, Types & Functions',
        description: 'Understand pure functions, return statements, and conditional branching.',
        challenges: [
          {
            id: 'chal-js-1',
            title: '1. Create a Sum Calculator Function',
            difficulty: 'beginner',
            language: 'javascript',
            order: 1,
            instructions: `### Objective
Write a function named \`sumTwoNumbers\` that takes two numeric arguments (\`a\` and \`b\`) and returns their mathematical sum.

#### Requirements:
- The function should be named \`sumTwoNumbers\`.
- It must accept two parameters.
- It must return the total sum of \`a + b\`.
- Handle negative numbers correctly.

\`\`\`javascript
// Example usage:
sumTwoNumbers(5, 10); // returns 15
sumTwoNumbers(-3, 7); // returns 4
\`\`\``,
            starterCode: `function sumTwoNumbers(a, b) {
  // Write your code here
  
}
`,
            solutionCode: `function sumTwoNumbers(a, b) {
  return a + b;
}`,
            hints: [
              'Use the + operator between a and b.',
              'Remember to use the "return" keyword.',
            ],
            testCases: [
              {
                id: 't-1',
                description: 'sumTwoNumbers should be defined as a function',
                testCode: 'typeof sumTwoNumbers === "function"',
              },
              {
                id: 't-2',
                description: 'sumTwoNumbers(5, 10) should return 15',
                testCode: 'sumTwoNumbers(5, 10) === 15',
              },
              {
                id: 't-3',
                description: 'sumTwoNumbers(-3, 7) should return 4',
                testCode: 'sumTwoNumbers(-3, 7) === 4',
              },
              {
                id: 't-4',
                description: 'sumTwoNumbers(0, 0) should return 0',
                testCode: 'sumTwoNumbers(0, 0) === 0',
              },
            ],
          },
          {
            id: 'chal-js-2',
            title: '2. Check Even or Odd Number',
            difficulty: 'beginner',
            language: 'javascript',
            order: 2,
            instructions: `### Objective
Create a function named \`isEven\` that returns \`true\` if a given number is even, and \`false\` if it is odd.

#### Hints:
- Use the modulo operator (\`%\`). A number is even if \`num % 2 === 0\`.

\`\`\`javascript
isEven(4); // returns true
isEven(7); // returns false
\`\`\``,
            starterCode: `function isEven(num) {
  // Return true if even, false if odd
  
}
`,
            solutionCode: `function isEven(num) {
  return num % 2 === 0;
}`,
            hints: [
              'The remainder of dividing an even number by 2 is always 0.',
              'Example: num % 2 === 0',
            ],
            testCases: [
              {
                id: 't-1',
                description: 'isEven should be a function',
                testCode: 'typeof isEven === "function"',
              },
              {
                id: 't-2',
                description: 'isEven(4) should return true',
                testCode: 'isEven(4) === true',
              },
              {
                id: 't-3',
                description: 'isEven(7) should return false',
                testCode: 'isEven(7) === false',
              },
              {
                id: 't-4',
                description: 'isEven(0) should return true',
                testCode: 'isEven(0) === true',
              },
            ],
          },
          {
            id: 'chal-js-3',
            title: '3. Reverse a String Algorithm',
            difficulty: 'intermediate',
            language: 'javascript',
            order: 3,
            instructions: `### Objective
Write a function \`reverseString(str)\` that accepts a string and returns the reversed version.

\`\`\`javascript
reverseString("ankabit"); // returns "tibakna"
reverseString("hello");   // returns "olleh"
\`\`\``,
            starterCode: `function reverseString(str) {
  // Reverse the input string
  
}
`,
            solutionCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
            hints: [
              'You can split the string into an array of characters with .split("")',
              'Reverse the array with .reverse()',
              'Join it back with .join("")',
            ],
            testCases: [
              {
                id: 't-1',
                description: 'reverseString should be a function',
                testCode: 'typeof reverseString === "function"',
              },
              {
                id: 't-2',
                description: 'reverseString("ankabit") should return "tibakna"',
                testCode: 'reverseString("ankabit") === "tibakna"',
              },
              {
                id: 't-3',
                description: 'reverseString("hello") should return "olleh"',
                testCode: 'reverseString("hello") === "olleh"',
              },
            ],
          },
        ],
      },
    ],
  },
];
