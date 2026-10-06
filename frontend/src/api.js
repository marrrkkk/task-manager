async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Network error: could not reach the server.");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      data?.title?.[0] || data?.detail || `Request failed (${res.status}).`;
    throw new Error(Array.isArray(detail) ? detail[0] : detail);
  }
  return data;
}

export const getTasks = () => request("/tasks/");

export const createTask = (task) =>
  request("/tasks/", { method: "POST", body: JSON.stringify(task) });

export const updateTask = (id, task) =>
  request(`/tasks/${id}/`, { method: "PUT", body: JSON.stringify(task) });

export const toggleTask = (id, completed) =>
  request(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}/`, { method: "DELETE" });
