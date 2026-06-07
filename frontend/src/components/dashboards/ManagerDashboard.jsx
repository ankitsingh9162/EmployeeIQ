import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, CheckCircle, Clock, AlertTriangle, Activity, Calendar, Zap, Award, Target 
} from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
const PIE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card group hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity`}></div>
    <div className="p-5 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  </div>
);

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-gray-500">Failed to load analytics data.</div>;

  const overloadedCount = data.employeesPerf?.filter(e => e.load === 'Heavy').length || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manager Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive overview of team performance, workload, and AI insights.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center bg-white dark:bg-dark-card rounded-lg p-2 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="px-4 py-1 text-sm border-r border-gray-200 dark:border-dark-border">
            <span className="text-gray-500 block text-xs">Date Range</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Last 7 Days</span>
          </div>
          <div className="px-4 py-1 text-sm">
            <span className="text-gray-500 block text-xs">Department</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">All Teams</span>
          </div>
        </div>
      </div>

      {/* TOP METRICS GRID (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Employees" value={data.totalEmployees} icon={Users} color="bg-blue-500" gradient="from-blue-500 to-blue-600" />
        <StatCard title="Completed Tasks" value={data.completedTasks} icon={CheckCircle} color="bg-emerald-500" gradient="from-emerald-400 to-emerald-600" />
        <StatCard title="Pending Tasks" value={data.pendingTasks} icon={Clock} color="bg-amber-500" gradient="from-amber-400 to-amber-600" />
        <StatCard title="Avg Completion" value={`${data.avgCompletionTime}d`} icon={Activity} color="bg-purple-500" gradient="from-purple-500 to-indigo-600" />
        <StatCard title="Overloaded Emp" value={overloadedCount} icon={AlertTriangle} color="bg-red-500" gradient="from-red-500 to-rose-600" />
        <StatCard title="Team Health" value={`${data.teamHealth}%`} icon={Target} color="bg-teal-500" gradient="from-teal-400 to-teal-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* MAIN CHARTS SECTION (Takes up 3 columns) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* CHARTS ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Productivity Trend */}
            <div className="card p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
              <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800 dark:text-white">
                <Activity className="w-5 h-5 mr-2 text-blue-500" /> Weekly Productivity Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="completed" name="Completed Tasks" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="pending" name="Pending Tasks" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employee Performance Bar Chart */}
            <div className="card p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-indigo-500">
              <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800 dark:text-white">
                <Award className="w-5 h-5 mr-2 text-indigo-500" /> Employee Performance Score
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.employeesPerf?.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 12, fontWeight: 500}} width={80} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="score" name="Productivity %" radius={[0, 4, 4, 0]} barSize={24}>
                      {data.employeesPerf?.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10B981' : entry.score > 50 ? '#3B82F6' : '#EF4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TEAM PERFORMANCE TABLE */}
          <div className="card shadow-md overflow-hidden border border-gray-100 dark:border-dark-border">
            <div className="p-6 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/20">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-500" /> Team Performance Overview
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Employee</th>
                    <th className="p-4 font-medium">Total Tasks</th>
                    <th className="p-4 font-medium">Completed</th>
                    <th className="p-4 font-medium">Delayed</th>
                    <th className="p-4 font-medium">Workload</th>
                    <th className="p-4 font-medium">Prod. Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {data.employeesPerf?.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs mr-3">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{emp.name}</span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{emp.totalTasks}</td>
                      <td className="p-4 text-emerald-600 font-medium">{emp.completed}</td>
                      <td className="p-4 text-red-500">{emp.delayed}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          emp.load === 'Heavy' ? 'bg-red-100 text-red-700' : 
                          emp.load === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {emp.load}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-700 dark:text-gray-200 w-8">{emp.score}%</span>
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${emp.score > 80 ? 'bg-emerald-500' : emp.score > 50 ? 'bg-blue-500' : 'bg-red-500'}`} 
                              style={{ width: `${emp.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Takes up 1 column) */}
        <div className="space-y-6">
          
          {/* SMART AI INSIGHTS PANEL */}
          <div className="card shadow-lg border border-indigo-100 dark:border-indigo-900/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-amber-500 fill-amber-500" /> Smart AI Insights
              </h3>
              
              <div className="space-y-4">
                {data.insights?.map((insight, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex items-start space-x-3 transition-transform hover:-translate-y-1 ${
                    insight.type === 'recommendation' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md' :
                    insight.type === 'danger' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50 text-red-800 dark:text-red-200' :
                    insight.type === 'warning' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50 text-amber-800 dark:text-amber-200' :
                    'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                  }`}>
                    <div className="mt-0.5">
                      {insight.type === 'recommendation' && <Zap className="w-5 h-5 text-amber-300" />}
                      {insight.type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {insight.type === 'warning' && <Clock className="w-5 h-5 text-amber-500" />}
                      {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                      {insight.type === 'info' && <Activity className="w-5 h-5 text-blue-500" />}
                    </div>
                    <p className={`text-sm font-medium leading-relaxed ${insight.type === 'recommendation' ? 'text-white' : ''}`}>
                      {insight.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TEAM HEALTH METER */}
          <div className="card p-6 shadow-md border border-gray-100 dark:border-dark-border text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center justify-center">
              <Activity className="w-5 h-5 mr-2 text-teal-500" /> Team Health Meter
            </h3>
            <p className="text-xs text-gray-500 mb-6">Based on workload, delays, and completion rate</p>
            
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Health', value: data.teamHealth },
                      { name: 'Gap', value: 100 - data.teamHealth }
                    ]}
                    cx="50%" cy="50%"
                    startAngle={180} endAngle={0}
                    innerRadius={60} outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={data.teamHealth > 80 ? '#10B981' : data.teamHealth > 50 ? '#F59E0B' : '#EF4444'} />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{data.teamHealth}%</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">
                  {data.teamHealth > 80 ? 'Excellent' : data.teamHealth > 50 ? 'Good' : 'Critical'}
                </span>
              </div>
            </div>
          </div>

          {/* UPCOMING DEADLINES WIDGET */}
          <div className="card p-6 shadow-md border border-gray-100 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-rose-500" /> Upcoming Deadlines
            </h3>
            <div className="space-y-4">
              {data.upcomingDeadlines?.length > 0 ? data.upcomingDeadlines.map((task) => {
                const date = new Date(task.deadline);
                const isOverdue = date < new Date();
                return (
                  <div key={task._id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-1 pr-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Users className="w-3 h-3 mr-1" /> {task.assignedTo?.name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      {isOverdue && <span className="text-[10px] text-red-500 font-bold uppercase">Overdue</span>}
                    </div>
                  </div>
                )
              }) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
