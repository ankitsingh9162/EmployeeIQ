# EmployeeIQ AI - Productivity Dashboard 🚀

EmployeeIQ AI is a comprehensive productivity management system designed to streamline workflow, track performance, and provide AI-driven insights for modern teams.

## 🌟 Key Features

### 🏢 Admin Dashboard
- **Employee Management**: Add, edit, and remove employees from the system.
- **Department Controls**: Create and manage organizational departments.
- **Company Analytics**: High-level overview of overall productivity and system delays.
- **Activity Monitoring**: View real-time logs of all actions within the platform.

### 📊 Manager Dashboard
- **Team Performance**: Track task completion rates and average completion times.
- **AI Smart Insights**: 
  - Detect overloaded or idle employees.
  - Predict potential task delays using AI patterns.
  - Workload balancing recommendations.
- **Dynamic Tasking**: Assign tasks with priority levels and deadlines.  
- **Visual Analytics**: Interactive Line, Bar, and Pie charts for data-driven decisions.

### 💻 Employee Dashboard
- **Personal Productivity**: View your efficiency score and peer comparison.
- **Task Tracking**: Manage assigned tasks with real-time status updates (Pending, In Progress, Completed).
- **Upcoming Deadlines**: Stay ahead with prioritized task lists.
- **AI Insights**: Personalized feedback on work patterns and habits.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Recharts (Data Visualization)
- Lucide React (Icons)
- Socket.io-client (Real-time updates)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT (Authentication)
- Socket.io (Real-time server)

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ankitsingh9162/EmployeeIQ.git
   cd EmployeeIQ
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App Locally

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## ☁️ Deployment

### Backend (Render/Heroku)
- Connect your GitHub repo.
- Set Root Directory to `backend`.
- Add Environment Variables (`MONGODB_URI`, `JWT_SECRET`).

### Frontend (Vercel/Netlify)
- Connect your GitHub repo.
- Set Root Directory to `frontend`.
- Add Environment Variables:
  - `VITE_API_URL`: Your live backend URL + `/api`
  - `VITE_SOCKET_URL`: Your live backend URL

---

## 📜 License
This project is licensed under the ISC License.

---
Built with ❤️ by [Ankit Singh](https://github.com/ankitsingh9162)
