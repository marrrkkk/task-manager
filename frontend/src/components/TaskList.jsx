import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onToggle, onEdit, onDelete, busyId }) {
  if (tasks.length === 0) return <p className="empty">No tasks yet.</p>;
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          busyId={busyId}
        />
      ))}
    </ul>
  );
}
