import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak' };
  if (score <= 3) return { level: 2, label: 'Medium' };
  return { level: 3, label: 'Strong' };
}

export default function SignupPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthClass = strength.level === 1 ? 'is-weak' : strength.level === 2 ? 'is-medium' : 'is-strong';

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await signUp({ email: email.trim(), password });
      setSuccess('Check your inbox! We sent a confirmation link to ' + email.trim() + '. Please click it to activate your account.');
      setSubmitting(false);
    } catch (err) {
      setError(err?.message || 'Failed to create account');
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
          <div className="AuthTitle">Create your account</div>
          <div className="AuthSubtitle">Your knowledge, beautifully organized</div>
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
            {password && (
              <>
                <div className="PasswordStrength">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`PasswordStrengthBar${i <= strength.level ? ` is-active ${strengthClass}` : ''}`}
                    />
                  ))}
                </div>
                <div className={`PasswordStrengthLabel ${strengthClass}`}>
                  {strength.label}
                </div>
              </>
            )}
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
