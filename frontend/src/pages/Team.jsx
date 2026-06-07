import React from 'react';
import Users from './Users';

// In a real app, this would fetch only the manager's team members.
// For now, we'll reuse the Users component for visual completion.
const Team = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Team</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage your team members' workload.</p>
      </div>
      <Users />
    </div>
  );
};

export default Team;
