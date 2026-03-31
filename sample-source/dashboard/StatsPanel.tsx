// Sample dashboard component with hardcoded strings for i18n scanning

import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  totalUsers: number;
  activeToday: number;
  revenue: number;
}

export const StatsPanel: React.FC<Props> = ({ totalUsers, activeToday, revenue }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="stats-panel">
      {/* Already translated */}
      <h2>{t('stats.total_users')}</h2>

      {/* Hardcoded strings needing i18n */}
      <div className="stat-card">
        <span className="label">Active users today</span>
        <span className="value">{activeToday}</span>
        <span className="trend">Up 12% from yesterday</span>
      </div>

      <div className="stat-card">
        <span className="label">Monthly revenue</span>
        <span className="value">${revenue.toLocaleString()}</span>
        <span className="trend">View full report</span>
      </div>

      <div className="stat-card">
        <span className="label">New signups this week</span>
        <span className="value">{totalUsers}</span>
        <button aria-label="Download stats as CSV">Export data</button>
      </div>

      {totalUsers === 0 && (
        <p className="empty-state">No data available for this period.</p>
      )}
    </div>
  );
};
