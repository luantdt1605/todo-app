import React, { useState, useRef, useEffect } from "react";
import "./TodoItem.css";

function TodoItem({
  todo = {
    text: "",
    completed: false,
    priority: "medium",
    dueDate: null,
    tags: [],
    id: "",
  },
  onDelete,
  onEdit,
  onToggleComplete,
  layout = "list",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [editedPriority, setEditedPriority] = useState(
    todo.priority || "medium"
  );
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate || "");
  const [editedTags, setEditedTags] = useState(todo.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isSwiped, setIsSwiped] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const todoRef = useRef(null);
  const tagInputRef = useRef(null);

  useEffect(() => {
    // Reset edited values when todo changes
    setEditedText(todo.text);
    setEditedPriority(todo.priority || "medium");
    setEditedDueDate(todo.dueDate || "");
    setEditedTags(todo.tags || []);
  }, [todo]);

  const handleEdit = () => {
    onEdit(todo.id, {
      text: editedText,
      priority: editedPriority,
      dueDate: editedDueDate || null,
      tags: editedTags,
    });
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    // Otherwise return formatted date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get priority badge class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-badge-high";
      case "low":
        return "priority-badge-low";
      default:
        return "priority-badge-medium";
    }
  };

  // Tag management
  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
      setEditedTags([...editedTags, tagInput.trim()]);
      setTagInput("");
      tagInputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    // Add tag on Enter or comma
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(e);
    }
    // Remove last tag on Backspace if input is empty
    else if (
      e.key === "Backspace" &&
      tagInput === "" &&
      editedTags.length > 0
    ) {
      e.preventDefault();
      setEditedTags(editedTags.slice(0, -1));
    }
  };

  // Touch handlers for swipe actions
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
  };

  const handleTouchMove = (e) => {
    currentX.current = e.touches[0].clientX;
    const diff = startX.current - currentX.current;

    // Only allow right-to-left swipe
    if (diff > 0) {
      const swipePercent = Math.min(diff / 100, 1);
      if (todoRef.current) {
        todoRef.current.style.transform = `translateX(${
          -swipePercent * 140
        }px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    const diff = startX.current - currentX.current;

    if (diff > 70) {
      // Swiped far enough to reveal actions
      setIsSwiped(true);
      if (todoRef.current) {
        todoRef.current.style.transform = "translateX(-140px)";
      }
    } else {
      // Not swiped far enough, reset position
      setIsSwiped(false);
      if (todoRef.current) {
        todoRef.current.style.transform = "translateX(0)";
      }
    }
  };

  const resetSwipe = () => {
    setIsSwiped(false);
    if (todoRef.current) {
      todoRef.current.style.transform = "translateX(0)";
    }
  };

  // Create a compact view for the todo item
  const renderCompactView = () => {
    return (
      <div className="todo-compact-view">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => {
            onToggleComplete(todo.id);
            resetSwipe();
          }}
        />
        <div className="todo-compact-content">
          <span
            className={`todo-text ${todo.completed ? "completed-text" : ""}`}
          >
            {todo.text}
          </span>
          {todo.tags && todo.tags.length > 0 && (
            <div className="todo-compact-tags">
              {todo.tags.map((tag, index) => (
                <span key={index} className="todo-compact-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="todo-compact-meta">
          <span className={`priority-badge ${getPriorityClass(todo.priority)}`}>
            {todo.priority.charAt(0).toUpperCase()}
          </span>
          {todo.dueDate && (
            <span className="due-date compact-due-date">
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Create a grid view for the todo item
  const renderGridView = () => {
    return (
      <div className="todo-grid-view">
        <div className="todo-grid-header">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.completed}
            onChange={() => {
              onToggleComplete(todo.id);
              resetSwipe();
            }}
          />
          <div className="todo-grid-badges">
            <span
              className={`priority-badge ${getPriorityClass(todo.priority)}`}
            >
              {todo.priority}
            </span>
            {todo.dueDate && (
              <span className="due-date">{formatDate(todo.dueDate)}</span>
            )}
          </div>
        </div>
        <div className="todo-grid-body">
          <span
            className={`todo-text ${todo.completed ? "completed-text" : ""}`}
          >
            {todo.text}
          </span>
        </div>
        {todo.tags && todo.tags.length > 0 && (
          <div className="todo-grid-tags">
            {todo.tags.map((tag, index) => (
              <div key={index} className="todo-tag">
                {tag}
              </div>
            ))}
          </div>
        )}
        <div className="todo-grid-actions">
          <button
            className="edit-button"
            onClick={() => {
              setIsEditing(true);
              resetSwipe();
            }}
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => {
              onDelete(todo.id);
              resetSwipe();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`todo-item ${todo.completed ? "completed" : ""} priority-${
        todo.priority || "medium"
      } ${isSwiped ? "swiped" : ""} layout-${layout}`}
    >
      {isEditing ? (
        <div className="todo-edit-container">
          <div className="todo-edit-form">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="edit-input"
              autoFocus
              placeholder="Task description..."
            />
            <div className="edit-options">
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
                className="priority-select"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <input
                type="date"
                value={editedDueDate || ""}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="date-input"
              />
            </div>

            <div className="tags-input">
              {editedTags.map((tag, index) => (
                <div key={index} className="tag">
                  {tag}
                  <span className="tag-remove" onClick={() => removeTag(tag)}>
                    ×
                  </span>
                </div>
              ))}
              <input
                type="text"
                ref={tagInputRef}
                className="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={editedTags.length === 0 ? "Add tags..." : ""}
              />
            </div>

            <div className="edit-actions">
              <button className="save-button" onClick={handleEdit}>
                Save
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  resetSwipe();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {layout === "compact" ? (
            renderCompactView()
          ) : layout === "grid" ? (
            renderGridView()
          ) : (
            <div
              className="todo-item-content"
              ref={todoRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="todo-item-left">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    onToggleComplete(todo.id);
                    resetSwipe();
                  }}
                />

                <div className="todo-content">
                  <span
                    className={`todo-text ${
                      todo.completed ? "completed-text" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-meta">
                    <span
                      className={`priority-badge ${getPriorityClass(
                        todo.priority
                      )}`}
                    >
                      {todo.priority || "medium"}
                    </span>
                    {todo.dueDate && (
                      <span className="due-date">
                        {formatDate(todo.dueDate)}
                      </span>
                    )}
                  </div>

                  {todo.tags && todo.tags.length > 0 && (
                    <div className="todo-tags">
                      {todo.tags.map((tag, index) => (
                        <div key={index} className="todo-tag">
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="todo-item-actions">
                <button
                  className="edit-button"
                  onClick={() => {
                    setIsEditing(true);
                    resetSwipe();
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    onDelete(todo.id);
                    resetSwipe();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {layout === "list" && (
            <div className="swipe-actions">
              <div
                className="swipe-action swipe-edit"
                onClick={() => {
                  setIsEditing(true);
                  resetSwipe();
                }}
              >
                Edit
              </div>
              <div
                className="swipe-action swipe-delete"
                onClick={() => {
                  onDelete(todo.id);
                  resetSwipe();
                }}
              >
                Delete
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

TodoItem.defaultProps = {
  todo: {
    text: "",
    completed: false,
    priority: "medium",
    dueDate: null,
    tags: [],
    id: "",
  },
  layout: "list",
};

export default TodoItem;
