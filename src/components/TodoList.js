import React from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";

function TodoList({ todos, onDelete, onEdit, onToggleComplete, layout = "list" }) {
  return (
    <div className="todo-list-container">
      <h2 className="todo-list-title">My Tasks</h2>
      {todos.length === 0 ? (
        <div className="empty-list">
          <p>No tasks yet. Add a task to get started!</p>
        </div>
      ) : (
        <div className={`todo-list layout-${layout}`}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleComplete={onToggleComplete}
              layout={layout}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
