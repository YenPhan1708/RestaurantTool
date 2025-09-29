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

.env file:
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=restauranttool-cabf2
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7S2//6c3N0Fo+\nyixnvowwd5A8uNsltx63yvbBwP27NT23KQs6StOI9tcV76rwNtzjxBmeKl6hPsda\nkws4jVz6hvc9MjQTzI/klrg76M/KrLRQSrPLe+qJ3UNGreKHe829fuyNxCuD3gbq\nB8sQfQRZIy2Q9vIdeWmJcLe1WfYii5cqVqMGBwTsrdLLr+98+b4HCAojg+DQOhte\nKt9t23+alxwJitXZC6vo6v0g0vnY5hERbu5E/YfZ9gEN8OYLlBAeCVWhc+6Igwaz\nDsVY2//DQkEiZOW1VQ/RvT7UjZgJ++9+An9NSdYFcMB1MohH79zwS0CTrPSTdrXV\nubzmWRhHAgMBAAECggEAVvRKjsMjJ+MMCuu9GvtFxbi0z+Q45jUyvzytPD4X7sLk\noLUe/9S+ie+j4wzOzVCDVAF2rU5Zeb4WOtBa3MoQuUVQ4un8cJa/1W4+IZ5QXnW5\nDy/ncljZBmGh+t3+9ky9s7UKKTVCyKmbhyrQFZsdGi8xWAS2WoXEQCmDOOCH2/gr\nHQq7P47iVOtVT6dGRE6epVcQbAGKuE1eajYytLIDyO4/qatdW0njPcJMID/3mToJ\ncQaGsnrhGX2tTezVQ8sx3lBv6GC0JKC4MwDJ60mu5IukcdAStSybzaidKw/9FBs+\nHHo5hxKQU1j68VSeykYPc+TuwT4QboFAqvUZ1/Jj1QKBgQD2YCzkycFKaq/gNJ9/\nGvqPuonosT/IFdcjAU54UPr0qhuSGoq03ZN5iXdNgjR+76gVfJ7Zrej49ttB21qO\noTsDIRVspOBxHjEwIRH/nms8wOsPJIrZfm4dOmjb+u852G0II8Dr3HV9Gmp+ZQqK\nG3osSTJc6yxKbqLHzsFobmI0NQKBgQDCnG+Q7NVIyiR2s9E/mXCgq8fOsDzQB9jE\n0L8QmYH228A6RNy9kqufBJmpjHhKoa2X7+ZmcFJl99Vj3adhwTuCQRSNr8zN0Xbw\nngTka78A7HxVYU0/iCerm0a/u1lVCvly8mlFlgrnGiwfHkpt4AW4+5FVqaGtuBdz\n4AZeswSyCwKBgQClDb9lsqgUc67JtFdZ7rgHi/+R7RT+tWsAX4KzZgUJ3eBEnBVq\nn7qJxIcxXNZQZ7uiUW+WA0U9bRtsXkinnuoK6aIRu89E2OY5CR6msfnDpLaU2XVP\nybx5RkUzgkO76/r3ZgR7vqDTI9xOOuC5rzjE7HCaAU8VulLBKwk1LiYKNQKBgGSG\npEarX7z61f0PA66jlv8X3N1SQgd/liSMY7WyZeTbPJ+cxJ2ULty0Zp+jNNvwShhq\nzovpx1Zuv6aXb4faZd/xuCk8P0Gtyo+eQI6xbXePsOX1ng6MSVmmmtQddZatVY9f\n0qskRzt7VIE6h13cU3hrUnZ6ak6vAkZT2VZ/iJRjAoGBANdLIO7tB2wFXwebzQv8\nZYpDJBNBv1QsJpMghc+59+yJecJRkuX09Ik69sj6VyFAVFPh0LTFu/xS1cSDY7X2\n8S/D5luW5rDoPkslj+bODYhQxP869ebRkozcoH3EhAfKC1fCye0/aIghcKpafqyT\ndRbiYmc3bl6ypULzsmH3u/Hj\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@restauranttool-cabf2.iam.gserviceaccount.com
PORT=5000
OPENAI_API_KEY=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

.firebase-service-account.json:
{
  "type": "service_account",
  "project_id": "restauranttool-cabf2",
  "private_key_id": "243d7270e40b68e051bdec01891a87d1c0c7e542",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7S2//6c3N0Fo+\nyixnvowwd5A8uNsltx63yvbBwP27NT23KQs6StOI9tcV76rwNtzjxBmeKl6hPsda\nkws4jVz6hvc9MjQTzI/klrg76M/KrLRQSrPLe+qJ3UNGreKHe829fuyNxCuD3gbq\nB8sQfQRZIy2Q9vIdeWmJcLe1WfYii5cqVqMGBwTsrdLLr+98+b4HCAojg+DQOhte\nKt9t23+alxwJitXZC6vo6v0g0vnY5hERbu5E/YfZ9gEN8OYLlBAeCVWhc+6Igwaz\nDsVY2//DQkEiZOW1VQ/RvT7UjZgJ++9+An9NSdYFcMB1MohH79zwS0CTrPSTdrXV\nubzmWRhHAgMBAAECggEAVvRKjsMjJ+MMCuu9GvtFxbi0z+Q45jUyvzytPD4X7sLk\noLUe/9S+ie+j4wzOzVCDVAF2rU5Zeb4WOtBa3MoQuUVQ4un8cJa/1W4+IZ5QXnW5\nDy/ncljZBmGh+t3+9ky9s7UKKTVCyKmbhyrQFZsdGi8xWAS2WoXEQCmDOOCH2/gr\nHQq7P47iVOtVT6dGRE6epVcQbAGKuE1eajYytLIDyO4/qatdW0njPcJMID/3mToJ\ncQaGsnrhGX2tTezVQ8sx3lBv6GC0JKC4MwDJ60mu5IukcdAStSybzaidKw/9FBs+\nHHo5hxKQU1j68VSeykYPc+TuwT4QboFAqvUZ1/Jj1QKBgQD2YCzkycFKaq/gNJ9/\nGvqPuonosT/IFdcjAU54UPr0qhuSGoq03ZN5iXdNgjR+76gVfJ7Zrej49ttB21qO\noTsDIRVspOBxHjEwIRH/nms8wOsPJIrZfm4dOmjb+u852G0II8Dr3HV9Gmp+ZQqK\nG3osSTJc6yxKbqLHzsFobmI0NQKBgQDCnG+Q7NVIyiR2s9E/mXCgq8fOsDzQB9jE\n0L8QmYH228A6RNy9kqufBJmpjHhKoa2X7+ZmcFJl99Vj3adhwTuCQRSNr8zN0Xbw\nngTka78A7HxVYU0/iCerm0a/u1lVCvly8mlFlgrnGiwfHkpt4AW4+5FVqaGtuBdz\n4AZeswSyCwKBgQClDb9lsqgUc67JtFdZ7rgHi/+R7RT+tWsAX4KzZgUJ3eBEnBVq\nn7qJxIcxXNZQZ7uiUW+WA0U9bRtsXkinnuoK6aIRu89E2OY5CR6msfnDpLaU2XVP\nybx5RkUzgkO76/r3ZgR7vqDTI9xOOuC5rzjE7HCaAU8VulLBKwk1LiYKNQKBgGSG\npEarX7z61f0PA66jlv8X3N1SQgd/liSMY7WyZeTbPJ+cxJ2ULty0Zp+jNNvwShhq\nzovpx1Zuv6aXb4faZd/xuCk8P0Gtyo+eQI6xbXePsOX1ng6MSVmmmtQddZatVY9f\n0qskRzt7VIE6h13cU3hrUnZ6ak6vAkZT2VZ/iJRjAoGBANdLIO7tB2wFXwebzQv8\nZYpDJBNBv1QsJpMghc+59+yJecJRkuX09Ik69sj6VyFAVFPh0LTFu/xS1cSDY7X2\n8S/D5luW5rDoPkslj+bODYhQxP869ebRkozcoH3EhAfKC1fCye0/aIghcKpafqyT\ndRbiYmc3bl6ypULzsmH3u/Hj\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@restauranttool-cabf2.iam.gserviceaccount.com",
  "client_id": "118236409967660512067",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40restauranttool-cabf2.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


