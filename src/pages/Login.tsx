import { useState, type FormEvent } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { extractRolesFromJwt } from "../types/Auth";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      // Authenticate with the backend.
      const signedInUser = await login({
        email,
        password,
      });

      // Extract roles directly from the received JWT.
      const jwtRoles = extractRolesFromJwt(signedInUser.token);

      // Check whether ADMIN exists among the JWT claims.
      const isAdmin = jwtRoles.includes("ADMIN");

      console.log("Login successful:", signedInUser.email);
      console.log("JWT roles:", jwtRoles);
      console.log("Administrator:", isAdmin);

      // Redirect based on the JWT roles.
      navigate(from || (isAdmin ? "/admin" : "/events"), { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-card card card-body shadow-sm mx-auto">
      <h1 className="h3">Sign in</h1>

      <p className="text-muted">
        Sign in to book events and access your account.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        <label className="form-label" htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          className="form-control mb-3"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="form-label" htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          className="form-control mb-3"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-100" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-3 mb-0">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}
