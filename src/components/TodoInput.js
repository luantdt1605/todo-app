import React, { useState, useRef } from 'react';
import './TodoInput.css';

function TodoInput({ onAdd }) {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const tagInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd({
                text: text.trim(),
                priority,
                dueDate: dueDate || null,
                tags: tags.length > 0 ? [...tags] : []
            });
            setText('');
            setPriority('medium');
            setDueDate('');
            // Keep tags for convenience
        }
    };

    const addTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
            tagInputRef.current?.focus();
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagKeyDown = (e) => {
        // Add tag on Enter or comma
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(e);
        }
        // Remove last tag on Backspace if input is empty
        else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            e.preventDefault();
            setTags(tags.slice(0, -1));
        }
    };

    return (
        <div className="todo-input-container">
            <form onSubmit={handleSubmit} className="todo-form">
                <div className="todo-input-main">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <span className="input-icon">✏️</span>
                        <input
                            type="text"
                            className="todo-input"
                            placeholder="Add a new task..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <button 
                        type="button" 
                        className="advanced-toggle"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        aria-label="Toggle advanced options"
                    >
                        {showAdvanced ? '▲' : '▼'}
                    </button>
                    <button type="submit" className="add-button">
                        <span className="add-button-icon">+</span>
                        Add Task
                    </button>
                </div>
                
                {showAdvanced && (
                    <div className="advanced-options">
                        <div className="option-group">
                            <label htmlFor="priority">
                                <span className="option-icon">🚩</span>
                                Priority:
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="priority-select"
                            >
                                <option value="high" className="priority-option-high">High</option>
                                <option value="medium" className="priority-option-medium">Medium</option>
                                <option value="low" className="priority-option-low">Low</option>
                            </select>
                        </div>
                        
                        <div className="option-group">
                            <label htmlFor="due-date">
                                <span className="option-icon">📅</span>
                                Due Date:
                            </label>
                            <input
                                type="date"
                                id="due-date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="date-input"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="option-group">
                            <label htmlFor="tags">
                                <span className="option-icon">🏷️</span>
                                Tags:
                            </label>
                            <div className="tags-input">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tag">
                                        {tag}
                                        <span 
                                            className="tag-remove"
                                            onClick={() => removeTag(tag)}
                                        >
                                            ×
                                        </span>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    id="tags"
                                    ref={tagInputRef}
                                    className="tag-input"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                                />
                                <button 
                                    type="button" 
                                    onClick={addTag}
                                    style={{ display: 'none' }}
                                >
                                    Add Tag
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default TodoInput;
