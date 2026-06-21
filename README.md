# Campus Marketplace (MERN Stack)

A complete, production-ready full-stack web application designed for university and college students to buy and sell items safely within their campus community.

## 🚀 Features

* **Authentication & Security**
  * Secure user registration and login using JWT (JSON Web Tokens).
  * Password hashing via bcrypt.
  * Protected API routes and frontend pages.
* **Product Management**
  * Students can act as both buyers and sellers.
  * Create, read, update, and delete (CRUD) capabilities for personal listings.
  * Image uploads integrated with Multer and Cloudinary.
  * Categorization (Books, Electronics, Furniture, Notes, etc.) and item condition tags.
* **Discovery & Search**
  * Search functionality by keyword/title.
  * Filter items by categories.
* **Secure Checkout**
  * Integrated with Stripe Elements for secure, encrypted payments.
  * Automated order creation and marking products as "Sold" upon successful payment.
  * Dedicated dashboard to track purchase history.
* **Real-time Chat**
  * Built-in 1-to-1 messaging system using Socket.io.
  * Buyers can negotiate or ask questions directly with sellers in real-time.
* **Modern UI/UX**
  * Responsive, mobile-first design built with Vite, React, and Tailwind CSS v4.
  * Premium aesthetics with smooth transitions, hover states, and dynamic components.

## 🛠️ Technology Stack

### Backend
* **Node.js** & **Express.js** (REST API framework)
* **MongoDB** & **Mongoose** (Database & ODM)
* **Socket.io** (WebSockets for real-time chat)
* **Stripe** (Payment Gateway processing)
* **Cloudinary** (Cloud image storage)
* **JWT** & **bcryptjs** (Authentication & Security)

### Frontend
* **React 19** (Built with Vite for fast HMR)
* **Redux Toolkit** (Global state management for Auth)
* **React Router DOM** (Client-side routing)
* **Tailwind CSS v4** (Utility-first styling)
* **Axios** (HTTP client with automatic interceptors)
* **Lucide React** (Beautiful, consistent iconography)

## 💻 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
* API Keys for [Cloudinary](https://cloudinary.com/) and [Stripe](https://stripe.com/)

### 1. Clone the repository
*(If applicable, clone from your git host)*
```bash
git clone <your-repo-url>
cd campus-marketplace-MERN
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory and add the following variables:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Configure Stripe (Optional but required for checkout):
Open `frontend/src/pages/Checkout.jsx` and replace `'pk_test_placeholder'` with your actual Stripe Publishable Key.

Start the frontend development server:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser. The backend API runs on `http://localhost:5001`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source and available under the [ISC License](LICENSE).
