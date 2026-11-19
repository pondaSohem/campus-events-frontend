import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/Category";
export default function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");
  async function load() {
    try {
      setItems(await categoryService.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load categories.");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const dto = {
        name: name.trim(),
        description: description.trim() || null,
      };
      if (editing) await categoryService.update(editing, dto);
      else await categoryService.create(dto);
      setName("");
      setDescription("");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save category.");
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this category?")) return;
    try {
      await categoryService.remove(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete category.");
    }
  }
  function edit(c: Category) {
    setEditing(c.id);
    setName(c.name);
    setDescription(c.description ?? "");
  }
  return (
    <section>
      <h1>Category management</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="card card-body mb-4" onSubmit={save}>
        <h2 className="h5">{editing ? "Edit category" : "Add category"}</h2>
        <label className="form-label">Name</label>
        <input
          className="form-control mb-3"
          maxLength={100}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="form-label">Description</label>
        <textarea
          className="form-control mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="d-flex gap-2">
          <button className="btn btn-primary">
            {editing ? "Save changes" : "Create category"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditing(null);
                setName("");
                setDescription("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="list-group">
        {items.map((c) => (
          <div
            className="list-group-item d-flex justify-content-between align-items-center"
            key={c.id}
          >
            <div>
              <strong>{c.name}</strong>
              <div className="small text-muted">{c.description}</div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => edit(c)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => void remove(c.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
