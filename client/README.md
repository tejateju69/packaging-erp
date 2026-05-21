# 📦 Packaging ERP System

A full-stack ERP (Enterprise Resource Planning) web application developed for packaging and corrugated box manufacturing industries.

This system helps manage:
- Reel Inventory
- Box Calculations
- Saved Production Items
- Reports & Analytics
- Authentication & Authorization

Built using React, Node.js, Express.js, MongoDB Atlas, and Tailwind CSS.

---

# 🚀 Features

## 🔐 Authentication
- Login System
- JWT Authentication
- Remember Me Option
- Logout Functionality

---

## 📦 Reels Inventory
- Add Single Reel
- Add Multiple Reels
- Delete Reels
- Search Reels
- PDF Download
- MongoDB Storage

---

## 📐 Box Calculation
- Case 1A
- Case 1B
- Case 2
- Case 3

Calculates:
- Gaze
- Deckle
- Paper Cutting
- Liner
- Weight Calculation

---

## 🔄 Reel Matching System
Automatically fetches matching reels from MongoDB inventory based on deckle calculation.

---

## 💾 Saved Items
- Save Company-wise Box Calculations
- View Saved Items
- Delete Saved Items
- Copy Calculation Details

---

## 📊 Reports Dashboard
Live dashboard showing:
- Total Reels
- Total Reel Weight
- Total Saved Items
- Total Companies

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- SweetAlert2
- Lucide React
- jsPDF

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

---

# ☁️ Database

MongoDB Atlas is used for cloud database storage.

Collections:
- users
- reels
- saveditems

---

# 📁 Project Structure

```bash
SP/
│
├── client/
│   ├── src/
│   ├── pages/
│   ├── components/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── config/
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create `.env` inside backend folder.

```env
MONGO_URI=your_mongodb_connection
PORT=8000
JWT_SECRET=your_secret_key
```

---

# 🌍 Deployment

## Frontend
- Vercel

## Backend
- Render

## Database
- MongoDB Atlas

---

# 📸 Main Modules

- Dashboard
- Reels Inventory
- Box Calculation
- Saved Items
- Reports

---

# 🎯 Future Enhancements

- Sold Reels System
- Low Stock Alerts
- Excel Export
- Invoice Generation
- Role-Based Authentication
- Production Analytics

---

# 👨‍💻 Developed By

Teja Teju

Packaging ERP Management System Project