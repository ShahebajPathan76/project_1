import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

// Reusable filter button component
const FilterButton = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-semibold transition ${
      isActive ? "bg-blue-600 text-white" : "bg-white/20 text-white hover:bg-white/30"
    }`}
  >
    {children}
  </button>
);

// Custom Confirm Modal component
const ConfirmModal = ({ isOpen, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-sm text-center">
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Problems = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  // Tag filter is multi-select now as a Set
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [searchText, setSearchText] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);

  // Fetch problems on mount
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
      setProblems(res.data);
    } catch (err) {
      toast.error("Error fetching problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Difficulty options
  const difficultyLevels = ["All", "Easy", "Medium", "Hard"];

  // Compute all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    problems.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return ["All", ...Array.from(tagsSet).sort()];
  }, [problems]);

  // Toggle tag selection - multi select
  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  // Clear tags if All selected
  useEffect(() => {
    if (selectedTags.has("All")) {
      setSelectedTags(new Set());
    }
  }, [selectedTags]);

  // Debounced search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Filter problems by difficulty AND selectedTags AND searchText
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const difficultyMatch =
        selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      
      // If no tags selected, treat it as all tags selected
      const tagMatch =
        selectedTags.size === 0 ||
        p.tags?.some((tag) => selectedTags.has(tag));
      
      const searchMatch = p.title.toLowerCase().includes(searchText.toLowerCase());

      return difficultyMatch && tagMatch && searchMatch;
    });
  }, [problems, selectedDifficulty, selectedTags, searchText]);

  // Pagination slice
  const paginatedProblems = useMemo(() => {
    const start = 0;
    const end = page * PAGE_SIZE;
    return filteredProblems.slice(start, end);
  }, [filteredProblems, page]);

  // Difficulty color helper
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "text-green-400";
      case "Medium": return "text-yellow-400";
      case "Hard": return "text-red-400";
      default: return "text-gray-300";
    }
  };

  // Delete problem handler
  const handleDelete = async () => {
    if (!deleteId) return;
    const token = user?.token;
    if (!token) {
      toast.error("No token found. Please log in again.");
      setDeleteId(null);
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProblems((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success("Problem deleted successfully");
    } catch (err) {
      toast.error("Failed to delete the problem");
      console.error(err.response?.data || err.message);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900 p-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold flex-shrink-0 flex items-center gap-2">
            📚 All Problems
          </h1>

          <input
            type="search"
            placeholder="Search problems..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 md:flex-none bg-white/20 text-white placeholder-white/60 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {user?.isAdmin && (
            <Link
              to="/add"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow text-white font-semibold whitespace-nowrap"
            >
              ➕ Add Problem
            </Link>
          )}
        </div>

        {/* Difficulty Filter Buttons */}
        <div className="mb-4 flex gap-3 flex-wrap">
          {difficultyLevels.map((level) => (
            <FilterButton
              key={level}
              isActive={selectedDifficulty === level}
              onClick={() => {
                setSelectedDifficulty(level);
                setPage(1); // reset page
              }}
            >
              {level}
            </FilterButton>
          ))}
        </div>

        {/* Tag Filter — multi select */}
        <div className="mb-6 flex flex-wrap gap-2 max-h-32 overflow-auto border border-white/20 rounded-lg p-2 bg-white/10">
          {allTags.map((tag) => {
            if (tag === "All") {
              return (
                <button
                  key="all-tags"
                  onClick={() => setSelectedTags(new Set())}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                    selectedTags.size === 0
                      ? "bg-purple-600 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  All
                </button>
              );
            }
            const isSelected = selectedTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  isSelected
                    ? "bg-purple-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : paginatedProblems.length > 0 ? (
          <div className="grid gap-6">
            {paginatedProblems.map((problem) => (
              <div
                key={problem._id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-xl hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <Link to={`/problems/${problem._id}`} className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold hover:underline truncate">
                      {problem.title}
                    </h2>
                    <p
                      className={`mt-1 ${getDifficultyColor(
                        problem.difficulty
                      )} font-medium`}
                    >
                      {problem.difficulty}
                    </p>

                    {/* Tags Display */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {problem.tags &&
                        problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full select-none"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </Link>

                  {user?.isAdmin && (
                    <div className="flex gap-2 flex-shrink-0 mt-2 md:mt-0">
                      <Link
                        to={`/editproblem/${problem._id}`}
                        className="text-sm bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md font-semibold whitespace-nowrap"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(problem._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold whitespace-nowrap"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {paginatedProblems.length < filteredProblems.length && (
              <button
                onClick={() => setPage(page + 1)}
                className="mx-auto mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
              >
                Load More
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-300 text-center mt-10">No problems found for filters.</p>
        )}

      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        message="Are you sure you want to delete this problem?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Problems;
