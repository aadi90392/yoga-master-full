# 🧘‍♀️ Yoga Master - Full Stack MERN Platform

**Yoga Master** is a comprehensive Learning Management System (LMS) designed specifically for Yoga instructors and students. It allows instructors to create and manage courses, students to enroll and watch lessons, and admins to oversee the entire platform.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS**.

🔗 **Live Demo:** https://yoga-master-full.vercel.app/  
🖥️ **Backend API:** https://yoga-master-api-uiu6.onrender.com/

---

## 🚀 Features

### 👨‍🎓 For Students
- Browse top-rated yoga classes with full details
- Secure enrollment using **Stripe Payment Gateway**
- Personal dashboard for enrolled classes & payment history
- Video course player
- Cart system for multiple course checkout

### 🧘‍♂️ For Instructors
- Instructor dashboard with revenue & student analytics (**Recharts**)
- Upload video courses with multiple chapters
- Cloudinary integration for videos & images
- Update or delete classes
- Track course approval status

### 🛡️ For Admins
- Manage users (Promote / Demote / Delete)
- Approve or reject instructor courses
- Review instructor applications
- Full platform control

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js (Vite)
- 🎨 Tailwind CSS v4
- 🚦 React Router DOM v7
- ⚡ TanStack Query
- 💳 Stripe.js
- 📊 Recharts
- 🔔 React Toastify

### Backend
- 🟢 Node.js & Express.js
- 🍃 MongoDB & Mongoose
- 🔐 JWT Authentication
- ☁️ Cloudinary

---

## ⚙️ Environment Variables

### 1️⃣ Backend Setup (`/backend/.env`)

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2️⃣ Frontend Setup (`/yoga-master-frontend/.env`)

Create a `.env` file inside the `yoga-master-frontend` folder:

```env
VITE_API_URL=http://localhost:5000
VITE_PAYMENT_GATEWAY_PK=your_stripe_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_PRESET=your_upload_preset
```

---

## 🏃‍♂️ Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/aadi90392/yoga-master-full.git
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm start
```
Backend runs on:  
👉 http://localhost:5000

### 3️⃣ Frontend Setup
```bash
cd yoga-master-frontend
npm install
npm run dev
```
Frontend runs on:  
👉 http://localhost:5173

---

## 📸 Project Screenshots
- Home Page  
- Instructor Dashboard  
- Course Details Page  
- Admin Panel  

_(Add screenshots here)_

---

## 👤 Author

**Aditya Upadhyay**  
GitHub: https://github.com/aadi90392  

Made with ❤️ by Aditya
