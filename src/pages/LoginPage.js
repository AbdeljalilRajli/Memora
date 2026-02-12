import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function LoginPage() {
  const { signInWithPassword, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => location.state?.from?.pathname || '/app', [location.state]);

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [navigate, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signInWithPassword({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Failed to sign in');
      setSubmitting(false);
    }
  };


  return (
    <div className="AuthContainer">
      <div className="AuthCard">
        <Link className="AuthHomeLink" to="/">
          ← Back to home
        </Link>
        <div className="AuthLogo">
          <img src="/logo-memora.png" alt="Memora" />
        </div>
        <div className="AuthHeader">
          <div className="AuthTitle">Welcome back</div>
          <div className="AuthSubtitle">Sign in to your workspace</div>
        </div>


        <form onSubmit={onSubmit} className="AuthForm">
          <label className="AuthLabel">
            Email
            <input
              className="AuthInput"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="AuthLabel">
            Password
            <input
              className="AuthInput"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? <div className="AuthError">{error}</div> : null}

          <button className="AuthButton" type="submit" disabled={submitting}>
            Sign in
          </button>
        </form>

        <div className="AuthFooter">
          Don&apos;t have an account? <Link className="AuthLink" to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}
