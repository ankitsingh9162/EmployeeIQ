import React from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, Building2, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

const AdminDashboard = ({ stats }) => {
  const pieData = [
    { name: 'Completed', value: stats?.completedTasks || 0 },
    { name: 'In Progress', value: stats?.inProgressTasks || 0 },
    { name: 'Pending', value: stats?.pendingTasks || 0 },
  ];
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="card p-6 border-l-4 border-primary-500 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-500 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> {trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-primary-600 mb-2">
        <ShieldCheck className="w-6 h-6" />
        <h2 className="text-xl font-bold">Admin Overview</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats?.employeesCount || 0} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500"
          trend={12}
        />
        <StatCard 
          title="Departments" 
          value={stats?.departmentsCount || 4} 
          icon={Building2} 
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-500" 
        />
        <StatCard 
          title="Overall Productivity" 
          value={`${stats?.productivityScore || 0}%`} 
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500"
          trend={5}
        />
        <StatCard 
          title="System Delays" 
          value={stats?.delayedTasks || 0} 
          icon={AlertTriangle} 
          colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="card lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-500" /> Weekly Productivity Trend
            </h3>
            <select className="text-sm border-none bg-gray-50 dark:bg-dark-bg rounded px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.weeklyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-dark-border" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={4} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={4} dot={{r: 4, fill: '#f59e0b'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Task Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Resource Utilization</span>
              <span className="font-bold text-gray-900 dark:text-white">84%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-primary-500 h-full w-[84%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Analytics */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Productivity by Department</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Engineering', value: 85 },
              { name: 'Marketing', value: 72 },
              { name: 'Sales', value: 91 },
              { name: 'Support', value: 68 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-dark-border" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" name="Efficiency %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
