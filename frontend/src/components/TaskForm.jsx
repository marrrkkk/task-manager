import { useState } from "react";

export default function TaskForm({ editingTask, onSubmit, onCancel, saving }) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [description, setDescription] = useState(editingTask?.description ?? "");
  const [formError, setFormError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    setFormError("");
    const ok = await onSubmit({ title: title.trim(), description });
    if (ok && !editingTask) {
      setTitle("");
      setDescription("");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />
      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
        rows={3}
      />
      {formError && (
        <p className="error" role="alert">
          {formError}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving
            ? editingTask
              ? "Saving..."
              : "Creating..."
            : editingTask
              ? "Save changes"
              : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
