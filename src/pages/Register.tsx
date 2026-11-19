import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await authService.register(form);
      setMessage(result?.message ?? "Registration successful. Please sign in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-card card card-body shadow-sm mx-auto">
      <h1 className="h3">Create an account</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First name</label>
            <input
              name="firstName"
              className="form-control"
              maxLength={50}
              required
              value={form.firstName}
              onChange={change}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last name</label>
            <input
              name="lastName"
              className="form-control"
              maxLength={50}
              required
              value={form.lastName}
              onChange={change}
            />
          </div>
        </div>
        <label className="form-label">Email</label>
        <input
          name="email"
          type="email"
          className="form-control mb-3"
          required
          value={form.email}
          onChange={change}
        />
        <label className="form-label">Password</label>
        <input
          name="password"
          type="password"
          minLength={8}
          className="form-control mb-3"
          required
          value={form.password}
          onChange={change}
        />
        <p className="form-text">
          Use at least 8 characters, including an uppercase letter, lowercase
          letter and number.
        </p>
        <button className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="mt-3 mb-0">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
