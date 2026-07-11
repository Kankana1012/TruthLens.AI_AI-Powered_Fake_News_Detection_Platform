# TruthLens AI — Fake News Detector

The **Web Part** of **TruthLens.AI** is a modern, responsive, and user-friendly frontend built with **React.js** and **Vite**. It is designed to match the complete **TruthLens AI** product experience, including **Home**, **Detect News**, **Compare Models**, **Analytics**, **History**, and **Developer/Contact** pages.

The application communicates with a **FastAPI** backend through REST APIs to analyze news articles using an **ensemble of 9 Machine Learning, Deep Learning, and Graph Neural Network models**, providing real-time fake news detection, model comparison, confidence scores, analytics visualization, and prediction history.

## 🚀 Features

- Detect Fake or Real News
- Compare predictions across multiple AI models
- View confidence scores and analytics
- Prediction history management
- Responsive and interactive user interface
- REST API integration with FastAPI backend

## 🛠️ Tech Stack

- React.js
- Vite
- Bootstrap 5
- React Router DOM
- Axios
- Framer Motion
- Recharts
- React Icons
- FastAPI (Backend API)

## 📂 Project Structure

```
app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   └── README.md
│
├── server/
│   ├── app/
│   │   ├── services/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── config.py
│   └── requirements.txt
│
└── README.md
```

## 📄 Available Pages

- 🏠 Home
- 📰 Detect News
- ⚖️ Compare Models
- 📊 Analytics
- 🕒 History
- 👩‍💻 Developer

## ▶️ Run the Project

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
rm -r -fo .env
python -m venv .env
.env/Scripts/Activate
pip install -r requirements.txt
python main.py
```

The frontend will run on **http://localhost:5173** and communicate with the FastAPI backend for real-time fake news detection.
