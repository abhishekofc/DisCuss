# 💬 DisCuss – Discussion Forum Web App

**DisCuss** is a full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application that fosters real-time discussions, collaborative blogging, and community engagement. It combines modern web technologies to deliver a feature-rich, interactive platform.

---

## 🚀 Features

- 📝 **Rich Blog Editor**  
  - Supports image uploads and formatted content  
  - Enables category-based filtering for better discoverability

- 💬 **Threaded Comments & Real-Time Collaboration**  
  - Live discussions using **WebSockets (Socket.io)**  
  - Nested replies and instant updates

- 🔐 **User Authentication & Profiles**  
  - Secure login/registration with JWT and hashed passwords  
  - Editable user profiles and account settings

- 📱 **Responsive UI**  
  - Fully responsive design for mobile, tablet, and desktop  
  - Built with **React + Tailwind CSS**

---

## 🧰 Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**
- **Socket.io-client**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Socket.io**
- **JWT & bcrypt.js** for authentication and password security

---

## 🔄 Real-Time Architecture

The application uses **WebSockets** to enable:
- Instant comment threads
- Live updates to discussions without page refresh
- Real-time broadcasting across connected users

---

## 📁 Project Structure

DisCuss/
├── client/ # React Frontend
│ ├── components/
│ ├── pages/
│ └── utils/
├── server/ # Node.js Backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── socket/
├── .env
├── README.md
└── package.json


Copy
Edit

---

## 🛠️ Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/discuss-forum-app.git
Install dependencies


cd server
npm install
cd ../client
npm install
Configure environment variables
Add your MongoDB URI and JWT secret in .env inside /server.

Run the application

Start backend: npm run server

Start frontend: npm start


✍️ Author
Abhishek Pandey
📅 Project Duration: Feb 2025 – Mar 2025

📃 License
This project is licensed under the MIT License.

🙌 Contributions
Pull requests and feature suggestions are welcome!
Feel free to fork the repo and submit improvements.
