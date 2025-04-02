import React, { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all"); // 'all', 'high', 'medium', 'low'
  const [tagFilter, setTagFilter] = useState("");
  const [sortOption, setSortOption] = useState("priority"); // 'priority', 'dueDate', 'alphabetical', 'created'
  const [layout, setLayout] = useState("list"); // 'list', 'grid', 'compact'

  // Load todos and user preferences from localStorage
  useEffect(() => {
    // Load todos
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const updatedTodos = storedTodos.map((todo) => ({
      ...todo,
      completed: todo.completed || false,
      priority: todo.priority || "medium",
      dueDate: todo.dueDate || null,
      tags: todo.tags || [],
      id: todo.id || Date.now() + Math.random().toString(36).substr(2, 9),
    }));
    setTodos(updatedTodos);

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }

    // Load other preferences
    const savedSortOption = localStorage.getItem("sortOption");
    if (savedSortOption) {
      setSortOption(savedSortOption);
    }

    const savedLayout = localStorage.getItem("layout");
    if (savedLayout) {
      setLayout(savedLayout);
    }
  }, []);

  // Update body class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("sortOption", sortOption);
    localStorage.setItem("layout", layout);
  }, [sortOption, layout]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeLayout = (newLayout) => {
    setLayout(newLayout);
  };

  const addTodo = (todoData) => {
    const newTodo = {
      text: todoData.text,
      completed: false,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      priority: todoData.priority || "medium",
      dueDate: todoData.dueDate || null,
      tags: todoData.tags || [],
      createdAt: new Date().toISOString(),
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const editTodo = (id, updates) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleComplete = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  // Get all unique tags from todos
  const allTags = [...new Set(todos.flatMap((todo) => todo.tags || []))];

  // Apply all filters (status, search, priority, tag)
  const filteredTodos = todos.filter((todo) => {
    // Status filter (all, active, completed)
    const statusMatch =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);

    // Search filter
    const searchMatch =
      !searchQuery ||
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.tags &&
        todo.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    // Priority filter
    const priorityMatch =
      priorityFilter === "all" || todo.priority === priorityFilter;

    // Tag filter
    const tagMatch = !tagFilter || (todo.tags && todo.tags.includes(tagFilter));

    return statusMatch && searchMatch && priorityMatch && tagMatch;
  });

  // Sort todos based on selected sort option
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then sort based on selected option
    switch (sortOption) {
      case "priority":
        // Sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        break;

      case "dueDate":
        // Sort by due date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        // Items with due dates come before those without
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        break;

      case "alphabetical":
        // Sort alphabetically
        return a.text.localeCompare(b.text);

      case "created":
        // Sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);

      default:
        // Default sort by priority
        const defaultPriorityOrder = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) {
          return (
            defaultPriorityOrder[a.priority] - defaultPriorityOrder[b.priority]
          );
        }
    }

    // If items are equal based on sort option, sort by creation time
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Calculate statistics
  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <div className="app-title">
          <h1>Todo App</h1>
          <span className="version-badge">v1</span>
        </div>
        <div className="header-controls">
          <div className="layout-switcher">
            <button
              className={`layout-btn ${layout === "list" ? "active" : ""}`}
              onClick={() => changeLayout("list")}
              aria-label="List View"
              title="List View"
            >
              <i className="layout-icon">☰</i>
            </button>
            <button
              className={`layout-btn ${layout === "grid" ? "active" : ""}`}
              onClick={() => changeLayout("grid")}
              aria-label="Grid View"
              title="Grid View"
            >
              <i className="layout-icon">▦</i>
            </button>
            <button
              className={`layout-btn ${layout === "compact" ? "active" : ""}`}
              onClick={() => changeLayout("compact")}
              aria-label="Compact View"
              title="Compact View"
            >
              <i className="layout-icon">☲</i>
            </button>
          </div>
          <button
            className="header-btn theme-toggle"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <TodoInput onAdd={addTodo} />

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search todos or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filters-header">
            <h3>Filters & Sorting</h3>
            <div className="sort-options">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="sort-select"
              >
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="created">Recently Added</option>
              </select>
            </div>
          </div>

          <div className="filter-panels">
            <div className="filter-group">
              <h3>Status</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-button ${
                    filter === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-button ${
                    filter === "active" ? "active" : ""
                  }`}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`filter-button ${
                    filter === "completed" ? "active" : ""
                  }`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h3>Priority</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-button ${
                    priorityFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setPriorityFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-button priority-high ${
                    priorityFilter === "high" ? "active" : ""
                  }`}
                  onClick={() => setPriorityFilter("high")}
                >
                  High
                </button>
                <button
                  className={`filter-button priority-medium ${
                    priorityFilter === "medium" ? "active" : ""
                  }`}
                  onClick={() => setPriorityFilter("medium")}
                >
                  Medium
                </button>
                <button
                  className={`filter-button priority-low ${
                    priorityFilter === "low" ? "active" : ""
                  }`}
                  onClick={() => setPriorityFilter("low")}
                >
                  Low
                </button>
              </div>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="filter-group tags-group">
              <h3>Tags</h3>
              <div className="filter-buttons tags-filter">
                <button
                  className={`filter-button ${!tagFilter ? "active" : ""}`}
                  onClick={() => setTagFilter("")}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`filter-button tag-button ${
                      tagFilter === tag ? "active" : ""
                    }`}
                    onClick={() => setTagFilter(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <TodoList
          todos={sortedTodos}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onToggleComplete={toggleComplete}
          layout={layout}
        />
      </main>

      <footer className="app-footer">
        <p>
          Todo App &copy; {new Date().getFullYear()} |{" "}
          <span className="todo-count">{todos.length} tasks</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
