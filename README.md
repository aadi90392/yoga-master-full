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
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/3c7cca58-7b7a-472c-95bb-ab338f311a03" />

<img width="1918" height="964" alt="image" src="https://github.com/user-attachments/assets/10e0a5a6-4a80-4e27-ba08-1e098b3a3e71" />

<img width="1916" height="966" alt="image" src="https://github.com/user-attachments/assets/483b758a-6828-4391-809a-18721a0df18f" />

- Instructor Dashboard
<img width="1919" height="980" alt="image" src="https://github.com/user-attachments/assets/3b8ee822-eb18-4c1a-b9ff-c077a8ffbb30" />

<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/4ae73b17-44e8-4f42-bc9b-cdfd8bedb0bb" />
<img width="1917" height="979" alt="image" src="https://github.com/user-attachments/assets/3d76e9a1-c167-4ea4-89b7-73547e7b2229" />


- Course Details Page
  <img width="1919" height="977" alt="image" src="https://github.com/user-attachments/assets/20682184-3024-41f2-8f54-2c50f7562c72" />
  <img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/670ef978-6721-43b4-b0f8-4c3e68e305e4" />
<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/6f48e728-7a27-459d-b9ce-675363c1bd5e" />

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/a958ecff-7a38-4ceb-9a5e-3b19e1b61d74" />
<img width="1911" height="910" alt="image" src="https://github.com/user-attachments/assets/9173e93a-b5c8-42f6-a538-58b1feb5cede" />

- Admin Panel
- <img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/7d922908-b966-4e27-ba01-722a79334ac0" />

- <img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/0b3de2f3-3d82-47ca-9356-bcf5b7ecffcd" />
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/66eea951-e7f7-4928-a145-f13a6af8093b" />

<img width="1810" height="669" alt="image" src="https://github.com/user-attachments/assets/171d1f00-fb1f-4b87-ac64-135100431973" />


---

## 👤 Author

**Aditya Upadhyay**  
GitHub: https://github.com/aadi90392  

Made with ❤️ by Aditya
