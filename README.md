# 🧘‍♀️ Yoga Master - Full Stack MERN Platform

**Yoga Master** is a comprehensive Learning Management System (LMS) designed specifically for Yoga instructors and students. It allows instructors to create and manage courses, students to enroll and watch lessons, and admins to oversee the entire platform.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS**.

🔗 **Live Demo:** (https://yoga-master-full.vercel.app/)
🖥️ **Backend API:** (https://yoga-master-api-uiu6.onrender.com/)

---

## 🚀 Features

### 👨‍🎓 For Students
- **Browse Classes:** View top-rated yoga classes with details.
- **Secure Payments:** Integrated **Stripe Payment Gateway** for secure course enrollment.
- **Dashboard:** Track enrolled classes and payment history.
- **Course Player:** Watch video lessons (Integrated video player).
- **Cart System:** Add multiple courses to cart and checkout.

### 🧘‍♂️ For Instructors
- **Instructor Dashboard:** View total revenue, total students, and sales charts (using **Recharts**).
- **Course Creation:** Upload video courses with multiple chapters (Cloudinary Integration).
- **Manage Classes:** Update or delete existing classes.
- **Status Tracking:** See if the admin has approved or rejected the course.

### 🛡️ For Admins
- **User Management:** Promote users to Instructors or Admins; Demote or Delete users.
- **Class Management:** Approve or Deny new course submissions from instructors.
- **Application Review:** Review applications from users who want to become instructors.

---

## 🛠️ Tech Stack

**Frontend:**
- ⚛️ **React.js** (Vite) - Fast and modern UI library.
- 🎨 **Tailwind CSS v4** - Utility-first styling.
- 🚦 **React Router DOM v7** - For seamless navigation.
- ⚡ **TanStack Query (React Query)** - For efficient server state management.
- 💳 **Stripe.js** - Payment processing.
- 📊 **Recharts** - For visualizing instructor data.
- 🔔 **React Toastify** - For notifications.

**Backend:**
- 🟢 **Node.js & Express.js** - RESTful API.
- 🍃 **MongoDB & Mongoose** - Database and Object Modeling.
- 🔐 **JWT (JSON Web Tokens)** - Secure authentication.
- ☁️ **Cloudinary** - Video and Image storage.

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` files.

### Backend (`/backend/.env`)
```env
PORT=5000
DB_USER=your_db_username
DB_PASS=your_db_password
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
Frontend (/yoga-master-frontend/.env)
Code snippet

VITE_API_URL=http://localhost:5000
VITE_PAYMENT_GATEWAY_PK=your_stripe_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_PRESET=your_upload_preset
🏃‍♂️ Run Locally
Clone the project

Bash

git clone [https://github.com/your-username/yoga-master.git](https://github.com/your-username/yoga-master.git)
1. Backend Setup
Go to the backend directory

Bash

cd backend
Install dependencies

Bash

npm install
Start the server

Bash

npm start
2. Frontend Setup
Open a new terminal and go to the frontend directory

Bash

cd yoga-master-frontend
Install dependencies

Bash

npm install
Start the React app

Bash

npm run dev
