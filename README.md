<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/826/826070.png" alt="Logo" width="80" height="80">
  <h1 align="center">Tripify 🌍</h1>
  <strong>A Premium Full-Stack MERN Travel Booking Application</strong><br>
  <p>Experience seamless, modern, and highly-secure travel package bookings.</p>
</div>

<br />

![Home Banner](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop)

## 📌 Overview

**Tripify** is a complete, cutting-edge Travel and Tourism web application built on the **MERN** stack (MongoDB, Express, React, Node.js). It offers a beautiful, glass-morphism themed user interface that is 100% responsive across all devices, ensuring a premium browsing and booking experience for travelers, while granting administrators a powerful metrics dashboard to manage operations effortlessly.

## ✨ Key Features

### 👤 For Travelers (Users):
* **Cinematic Package Browsing**: View stunning panoramic hero galleries of travel destinations with automated fading sliders.
* **Smart Search & Filters**: Instantly find packages by Top Rated, Latest, and Special Offers.
* **Secure Checkout Flow**: E-commerce style 2-column layout utilizing **Braintree Payment Gateway** for fast, reliable transaction processing.
* **Modern Profile Dashboard**: A sleek left-navigation portal to manage current Bookings, view past trip History, update personal details, and securely manage passwords.
* **Traveler Reviews**: Write and read verified reviews dynamically calculating overall package ratings.

### 👑 For Administrators:
* **Real-time Analytics Dashboard**: View animated stat cards, recent transaction logs, active active users, and robust financial/booking charts.
* **Inventory Management**: Full CRUD capabilities to seamlessly Add, Update, or Delete travel destination packages.
* **Order Tracking**: Comprehensive tables allowing administrators to view, modify, or cancel system-wide active bookings.
* **Log Purging**: Delete old, completed, or cancelled history entries securely from the database.

---

## 🛠️ Technology Stack

**Frontend (Client)**
* **React 18** (Vite for fast bundling)
* **Tailwind CSS** (for highly responsive, modern gradient/glass-morphism styling)
* **Redux Toolkit** (for robust global state management)
* **Swiper.js** & **AOS** (for premium smooth animations and image carousels)
* **Firebase Storage** (for scalable profile avatar uploads)

**Backend (Server)**
* **Node.js & Express** (RESTful API Architecture)
* **MongoDB Atlas & Mongoose** (NoSQL Database)
* **JWT (JSON Web Tokens)** + **Bcrypt** (Secure Authentication and Route Protection)
* **Braintree** (Secure Payment integration)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* [Node.js](https://nodejs.org/en/) installed securely on your machine.
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and deployed cluster.
* A [Braintree Sandbox](https://www.braintreepayments.com/sandbox) account.
* A [Firebase](https://firebase.google.com/) Project.

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/rohanvarankar/tripify.git
cd tripify
```

**2. Install Server Dependencies**
```bash
cd backend
npm install
```

**3. Install Client Dependencies**
```bash
cd client
npm install
```

**4. Environment setup**
Create a `.env` file inside the root folder and add the following mandatory secrets:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_strong_secret
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
```

**5. Database Bootstrapping**
Run the automated seed script to correctly generate the initial System Admin account inside your Database.
```bash
cd backend
node seed.js
```

**6. Start the Application**
Start both the backend API and the frontend client simultaneously.
```bash
# In the client directory
npm run dev

# In the backend directory
npm run dev
```

---

## 🎨 Design Philosophy
Tripify was entirely redesigned from default boilerplate configurations to utilize robust modern UI trends including:
- **Responsive Fluid Constraints**: All elements scale effortlessly from 4K Monitors directly down to iPhone sizing dynamically.
- **Micro-interactions**: Interactive buttons shift elegantly alongside soft shadows to communicate exact interactivity to users seamlessly.
- **Glass-Morphism**: Core elements heavily utilize frosted `backdrop-blur` techniques enabling the immersive, organic imagery of travel destinations to bleed intelligently through the UI layering.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
**Rohan Varankar**
[GitHub Profile](https://github.com/rohanvarankar)
