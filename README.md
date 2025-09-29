# AI-Powered Restaurant Toolkit

An AI-driven web application for restaurant owners to manage menus, promotions, reservations, and customer feedback with ease.  
Built with **Node.js**, **Express**, **Firebase**, **React.js**, and **OpenAI API**.

---

## 📌 Features

### For Restaurant Owners
- **Home Page**: Public-facing restaurant site with AI-generated promotions.
- **Menu Page**: Digital menu with real-time updates from the Admin Dashboard.
- **Admin Dashboard**:
  - Menu Management (Add/Edit/Delete items)
  - AI-Powered Promotions Manager
  - Feedback Analyzer with sentiment detection
  - Reservations & Orders Insights

### For Developers
- Modular **Backend** with Express.js and Firebase integration.
- Modern **Frontend** using React.js + Vite.
- Ready-to-extend architecture for new features.

---

## 📂 Project Structure

```

RestaurantTool/
├── backend/        # Node.js + Express API
│   ├── index.js
│   ├── controllers/
│   ├── routes/
│   ├── firebaseService.js
│   ├── .env (private)
│   └── firebase-service-account.json (private)
└── frontend/       # React.js + Vite frontend
├── public/
├── src/
│   ├── pages/
│   ├── components/
│   └── CSS/
└── main.jsx

````

---

## 🛠 Installation

### Prerequisites
- Node.js (LTS recommended) → [https://nodejs.org](https://nodejs.org)
- Git → [https://git-scm.com](https://git-scm.com)
- `.env` and `firebase-service-account.json` files (private – not in GitHub)

### Steps

1. **Clone the repository**
   ```bash
   git clone git@github.com:YenPhan1708/RestaurantTool.git
````

2. **Install backend dependencies**

   ```bash
   cd RestaurantTool/backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Add private files**

   * Place `.env` and `firebase-service-account.json` inside `backend/`.

5. **Run the backend**

   ```bash
   cd ../backend
   node index.js
   ```

6. **Run the frontend**

   ```bash
   cd ../frontend
   npm run dev
   ```

   Access the site at: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Admin Login

Default credentials (stored in Firebase Authentication):

```
Username: admin1
Password: 1234
```

---

## 🗄 Firestore Database Structure

* **menus**: Menu items with name, description, price, category, imageURL.
* **feedback**: Customer feedback with sentiment analysis.
* **reservations**: Reservation details with timestamp and guest count.

---

## 🚀 Extending the Project

### Frontend

* Add new pages in `src/pages/`.
* Create matching CSS in `src/CSS/`.
* Update routes in `App.jsx`.

### Backend

* Add new route files in `backend/routes/`.
* Create logic in `backend/controllers/`.
* Register routes in `index.js`.

### Database

* Add new fields in Firestore and update API + frontend logic.

---

## 📄 License

This project is for educational purposes (NHL Stenden Year 2 Module 2.4).
All rights reserved by **Yen Phan**.

---
