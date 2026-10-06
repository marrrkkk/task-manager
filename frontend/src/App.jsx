import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from "./api.js";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError("Unable to load tasks."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(data) {
    setBusyId("save");
    setError("");
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, data);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await createTask(data);
        setTasks((prev) => [created, ...prev]);
      }
      return true;
    } catch {
      setError(editingTask ? "Unable to save changes." : "Unable to create task.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggle(task) {
    setBusyId(task.id);
    setError("");
    try {
      const updated = await toggleTask(task.id, !task.completed);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch {
      setError("Unable to update task status.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(task) {
    setBusyId(`delete-${task.id}`);
    setError("");
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      if (editingTask?.id === task.id) setEditingTask(null);
    } catch {
      setError("Unable to delete task.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="container">
      <h1>Task Manager</h1>
      <TaskForm
        key={editingTask?.id ?? "new"}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
        saving={busyId === "save"}
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <h2>Tasks</h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          busyId={busyId}
        />
      )}
    </main>
  );
}
