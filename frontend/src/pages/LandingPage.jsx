import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  BarChart3, 
  Zap, 
  Users, 
  Bell, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Mail,
  Menu,
  X,
  LayoutDashboard,
  CheckSquare
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                EmployeeIQ
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#ai-insights" className="text-sm font-medium hover:text-primary-600 transition-colors">AI Insights</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-primary-600 transition-colors">About</a>
              <div className="h-6 w-px bg-gray-200 dark:bg-dark-border mx-2"></div>
              <button onClick={() => navigate('/login')} className="text-sm font-medium hover:text-primary-600 transition-colors">Login</button>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary px-6 py-2.5 text-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border p-4 space-y-4"
          >
            <a href="#features" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#ai-insights" className="block text-sm font-medium" onClick={() => setIsMenuOpen(false)}>AI Insights</a>
            <button onClick={() => navigate('/login')} className="block w-full text-left text-sm font-medium">Login</button>
            <button onClick={() => navigate('/login')} className="btn btn-primary w-full py-3">Get Started</button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-bold mb-8 border border-primary-100 dark:border-primary-800">
              <Zap className="w-4 h-4" />
              <span>Next Gen Workforce Optimization</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              AI-Powered Employee <br />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Productivity Platform
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
              Track productivity, manage tasks, and optimize workforce performance with real-time AI insights. Built for teams that demand excellence.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary px-8 py-4 text-lg flex items-center gap-2 w-full sm:w-auto"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-outline px-8 py-4 text-lg w-full sm:w-auto"
              >
                View Live Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-2xl bg-white dark:bg-dark-card p-2 lg:p-4">
              {/* Browser Header */}
              <div className="flex items-center gap-2 mb-2 px-4 py-2 border-b border-gray-100 dark:border-dark-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-md text-[10px] text-gray-400 font-medium w-64 text-center">
                    app.employeeiq.ai/dashboard
                  </div>
                </div>
              </div>
              
              <div className="flex h-[450px] lg:h-[650px] rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-bg">
                {/* Mock Sidebar */}
                <div className="w-16 lg:w-56 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 flex flex-col">
                  <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm hidden lg:block">EmployeeIQ</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard', active: true },
                      { icon: CheckSquare, label: 'Tasks' },
                      { icon: Users, label: 'Team' },
                      { icon: BarChart3, label: 'Analytics' },
                      { icon: ShieldCheck, label: 'Settings' }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${item.active ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' : 'text-gray-400'}`}>
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-semibold hidden lg:block">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {/* Mock Top Bar */}
                  <div className="h-16 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-6 flex items-center justify-between shrink-0">
                    <div className="bg-gray-50 dark:bg-gray-800 w-48 lg:w-96 h-9 rounded-xl border border-gray-100 dark:border-dark-border flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>

                  {/* Mock Dashboard Area */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                      {[
                        { label: 'Completed Tasks', value: '1,284', trend: '+12%', color: 'text-green-500' },
                        { label: 'Active Projects', value: '42', trend: '+5%', color: 'text-blue-500' },
                        { label: 'Avg. Efficiency', value: '94.2%', trend: '+8%', color: 'text-purple-500' },
                        { label: 'Pending Reviews', value: '18', trend: '-2%', color: 'text-amber-500' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
                          <div className="flex items-end justify-between">
                            <div className="text-xl font-bold">{stat.value}</div>
                            <div className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Main Section Grid */}
                    <div className="grid grid-cols-12 gap-6 h-[400px]">
                      {/* Chart Area */}
                      <div className="col-span-12 lg:col-span-8 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-bold text-sm">Productivity Trend</h4>
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                            <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end gap-3 px-2">
                          {[40, 70, 45, 90, 65, 80, 55, 75, 85, 60, 95, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg relative group h-full">
                              <motion.div 
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                transition={{ duration: 1.5, delay: i * 0.05 }}
                                className="absolute bottom-0 w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg shadow-lg shadow-primary-500/10 group-hover:from-primary-500 group-hover:to-primary-300 transition-all"
                              ></motion.div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Side Tasks */}
                      <div className="col-span-12 lg:col-span-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 space-y-4">
                        <h4 className="font-bold text-sm mb-4">Recent Tasks</h4>
                        {[
                          { title: 'Landing Page Redesign', status: 'In Progress', color: 'bg-blue-500' },
                          { title: 'API Integration', status: 'Review', color: 'bg-purple-500' },
                          { title: 'User Auth Setup', status: 'Completed', color: 'bg-green-500' },
                          { title: 'Mobile Optimization', status: 'Pending', color: 'bg-amber-500' }
                        ].map((task, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-dark-border">
                            <div className={`w-2 h-8 rounded-full ${task.color} shrink-0`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate">{task.title}</div>
                              <div className="text-[10px] text-gray-400">{task.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating UI Badges */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 hidden lg:block p-4 rounded-2xl glass-effect shadow-xl border border-white/20 dark:border-white/10 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Productivity Score</div>
                  <div className="text-xl font-extrabold">+12.4%</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-10 hidden lg:block p-4 rounded-2xl glass-effect shadow-xl border border-white/20 dark:border-white/10 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Insight</div>
                  <div className="text-sm font-bold">3 Potential Delays Detected</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4">Features</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold mb-6">Everything you need to <br /> manage high-performing teams</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Powerful tools designed to give you complete visibility and actionable insights into your team's workflow.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Productivity Tracking",
              desc: "Deep insights into individual and team performance metrics in real-time.",
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-900/20"
            },
            {
              icon: CheckCircle,
              title: "Task Management",
              desc: "Seamlessly assign, track, and manage complex tasks with intuitive UI.",
              color: "text-green-500",
              bg: "bg-green-50 dark:bg-green-900/20"
            },
            {
              icon: Zap,
              title: "AI Insights",
              desc: "Proactive AI that identifies bottlenecks and workload imbalances automatically.",
              color: "text-amber-500",
              bg: "bg-amber-50 dark:bg-amber-900/20"
            },
            {
              icon: BarChart3,
              title: "Team Analytics",
              desc: "Professional charts and data visualizations for deep organizational analysis.",
              color: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-900/20"
            },
            {
              icon: Bell,
              title: "Real-Time Notifications",
              desc: "Instant alerts for task updates, deadlines, and important milestones.",
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-900/20"
            },
            {
              icon: ShieldCheck,
              title: "Role-Based Security",
              desc: "Granular access control for Admins, Managers, and Employees.",
              color: "text-indigo-500",
              bg: "bg-indigo-50 dark:bg-indigo-900/20"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="card group hover:border-primary-500/50"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Insights Highlight */}
      <section id="ai-insights" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-xs font-bold mb-6 border border-amber-100 dark:border-amber-800 uppercase tracking-widest">
                <Zap className="w-3 h-3 fill-amber-600" />
                AI-Powered Optimizations
              </div>
              <h3 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">Predict delays before they happen</h3>
              <div className="space-y-6">
                {[
                  { title: "Workload Balancing", desc: "Automatically redistribute tasks when an employee is overloaded." },
                  { title: "Delay Prediction", desc: "AI models predict task completion dates based on historical velocity." },
                  { title: "Productivity Scoring", desc: "Advanced algorithms to measure true efficiency, not just hours worked." },
                  { title: "Team Health Analytics", desc: "Detect burnout patterns and team morale drops before they affect work." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-1">{item.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-700 p-8 shadow-2xl shadow-primary-500/20 flex flex-col justify-center overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Zap className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white/80 text-sm font-medium">Workload Alert</span>
                      <span className="px-2 py-0.5 rounded bg-red-500 text-[10px] text-white font-bold uppercase">High Risk</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20"></div>
                      <div className="flex-1">
                        <div className="h-2 w-32 bg-white/40 rounded mb-2"></div>
                        <div className="h-1.5 w-full bg-white/20 rounded">
                          <div className="h-full w-[85%] bg-red-400 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/90 text-xs mt-4">"Employee A has 8 tasks due this week. AI suggests redistributing 2 tasks to Employee B."</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ml-12">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-400 flex items-center justify-center text-white">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <span className="text-white font-bold">Efficiency Insight</span>
                    </div>
                    <p className="text-white/90 text-sm">"Team velocity increased by 15% after implementing AI suggested workload balancing."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">Start optimizing in minutes</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">No complex setups. Just log in, connect your team, and let the AI handle the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Login", desc: "Create your workspace and invite your team members effortlessly." },
              { title: "Assign Tasks", desc: "Organize workflows and set clear priorities for everyone." },
              { title: "Track Progress", desc: "Watch live as your team completes milestones on the board." },
              { title: "Get AI Insights", desc: "Receive automated reports and optimization suggestions." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-8 -left-4 select-none">{i + 1}</div>
                <div className="relative">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-sm">{i + 1}</span>
                    {step.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">Trusted by modern teams</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Join thousands of companies who use EmployeeIQ to power their daily workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "CTO @ TechFlow", content: "EmployeeIQ transformed how we manage our engineering team. The AI delay prediction is scary accurate!" },
              { name: "James Wilson", role: "Product Manager @ Global", content: "Finally a dashboard that doesn't just show data, but gives actual insights we can use to improve." },
              { name: "Elena Rodriguez", role: "Operations @ ScaleUp", content: "The workload balancing feature saved us from major burnout during our last product launch." }
            ].map((t, i) => (
              <div key={i} className="card bg-gray-50 dark:bg-dark-bg/50 border-none p-8">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Zap key={s} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-200 dark:bg-primary-900/40 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold">EmployeeIQ</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              The world's most advanced AI productivity platform for modern workforce management.
            </p>
          </div>

          <div>
            <h5 className="font-bold mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#ai-insights" className="hover:text-primary-600 transition-colors">AI Insights</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6">Subscribe to Insights</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get the latest productivity tips directly in your inbox.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="input-field py-2 text-sm" />
              <button className="btn btn-primary px-4"><Mail className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-dark-border pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EmployeeIQ AI. All rights reserved. Made with ❤️ for high-performing teams.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
