export default function TaskItem({ task, onToggle, onEdit, onDelete, busyId }) {
  const busy = busyId !== null;
  const deleting = busyId === `delete-${task.id}`;
  return (
    <li className={task.completed ? "task completed" : "task"}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        disabled={busy}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "completed"}`}
      />
      <div className="task-body">
        <span className="task-title">{task.title}</span>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>
      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)} disabled={busy}>
          Edit
        </button>
        <button type="button" onClick={() => onDelete(task)} disabled={busy}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
