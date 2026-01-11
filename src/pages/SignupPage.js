import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function SignupPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await signUp({ email: email.trim(), password });
      setSuccess('Account created. You can now sign in.');
      setSubmitting(false);
      setTimeout(() => navigate('/login', { replace: true }), 800);
    } catch (err) {
      setError(err?.message || 'Failed to create account');
      setSubmitting(false);
    }
  };

  return (
    <div className="AuthContainer">
      <div className="AuthCard">
        <div className="AuthHeader">
          <div className="AuthTitle">Create your account</div>
          <div className="AuthSubtitle">Start taking Notion-style notes</div>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? <div className="AuthError">{error}</div> : null}
          {success ? <div className="AuthSuccess">{success}</div> : null}

          <button className="AuthButton" type="submit" disabled={submitting}>
            Create account
          </button>
        </form>

        <div className="AuthFooter">
          Already have an account? <Link className="AuthLink" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
