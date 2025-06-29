const mongoose = require("mongoose");
const Problem = require("./models/Problem"); // adjust path as needed
require("dotenv").config();

const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers, return indices of two numbers that add up to a specific target.",
    difficulty: "Easy",
    testCases: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ]
  },
  {
    title: "Palindrome Check",
    description: "Check whether a given string is a palindrome.",
    difficulty: "Easy",
    testCases: [
      { input: `"racecar"`, output: `"true"` },
      { input: `"hello"`, output: `"false"` }
    ]
  },
  {
    title: "Fibonacci Number",
    description: "Find the N-th Fibonacci number.",
    difficulty: "Medium",
    testCases: [
      { input: "5", output: "5" },
      { input: "10", output: "55" }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Check if the input string of parentheses is valid.",
    difficulty: "Medium",
    testCases: [
      { input: `"()"`, output: `"true"` },
      { input: `"([)]"`, output: `"false"` }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string, find the length of the longest substring without repeating characters.",
    difficulty: "Hard",
    testCases: [
      { input: `"abcabcbb"`, output: `"3"` },
      { input: `"bbbbb"`, output: `"1"` }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Problem.deleteMany();
  await Problem.insertMany(sampleProblems);
  console.log("✅ Problems seeded successfully");
  process.exit();
});
