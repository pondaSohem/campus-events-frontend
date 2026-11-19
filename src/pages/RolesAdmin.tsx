import { useEffect, useState } from "react";
import { roleService } from "../services/roleService";
export default function RolesAdmin() {
  const [roles, setRoles] = useState<string[]>([]);
  const [userId, setUserId] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userLookupDone, setUserLookupDone] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function load() {
    try {
      setRoles(await roleService.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load roles.");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      setUserRoles(await roleService.userRoles(userId));
      setUserLookupDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load user roles.");
    }
  }
  async function action(fn: () => Promise<unknown>) {
    setError("");
    setMessage("");
    try {
      await fn();
      await load();
      if (userId.trim()) setUserRoles(await roleService.userRoles(userId));
      setMessage("Operation completed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Role operation failed.");
    }
  }
  return (
    <section>
      <h1>Role administration</h1>
      <p className="text-muted">
        Manage application roles and assign roles to users. Core roles may be
        protected by the API.
      </p>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => void load()}
      >
        Load roles
      </button>
      <form
        className="d-flex gap-2 mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          void action(() => roleService.create(newRole));
        }}
      >
        <input
          className="form-control"
          placeholder="New role name"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          required
        />
        <button className="btn btn-primary">Create role</button>
      </form>
      <ul className="list-group mb-4">
        {roles.map((r) => (
          <li
            key={r}
            className="list-group-item d-flex justify-content-between"
          >
            {r}
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => void action(() => roleService.remove(r))}
            >
              Delete role
            </button>
          </li>
        ))}
      </ul>
      <form className="card card-body" onSubmit={lookup}>
        <h2 className="h5">User role assignments</h2>
        <label className="form-label">User ID</label>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <button className="btn btn-secondary">Find user</button>
        </div>
        {userLookupDone && (
          <>
            <p className="mt-3">Current roles: {userRoles.join(", ")}</p>
            <div className="d-flex flex-wrap gap-2">
              {roles.map((r) => (
                <span key={r} className="d-flex gap-1 align-items-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={() =>
                      void action(() => roleService.assign(userId, r))
                    }
                  >
                    Assign {r}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning"
                    onClick={() =>
                      void action(() => roleService.unassign(userId, r))
                    }
                  >
                    Remove {r}
                  </button>
                </span>
              ))}
            </div>
          </>
        )}
      </form>
    </section>
  );
}
