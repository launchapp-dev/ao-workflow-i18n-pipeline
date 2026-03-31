// Sample source file for i18n scanning demonstration
// This file intentionally mixes translated and hardcoded strings

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation('auth');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser();
    } catch (err) {
      // Hardcoded string — should be i18n key
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-form">
      {/* Already translated */}
      <h1>{t('login.title')}</h1>

      {/* Hardcoded — should use t() */}
      <p className="subtitle">Please enter your credentials to continue</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          aria-label="Email input field"
        />

        <label htmlFor="password">{t('login.password_label')}</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
        />

        {error && <div className="error">{error}</div>}

        {/* Already translated */}
        <button type="submit">{t('login.submit_button')}</button>

        {/* Hardcoded */}
        <a href="/forgot-password">Forgot your password?</a>
        <span>Don't have an account? <a href="/signup">Create one</a></span>
      </form>
    </div>
  );
};
