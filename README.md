

# 🛡️ Online Payment Fraud Detection System

Machine Learning based web application that detects **fraudulent online payment transactions** in real time.

The system analyzes transaction features and predicts whether a transaction is **Fraudulent or Legitimate** with a **risk score and explanation**.

---

# 📌 Project Overview

This project builds a **real-time fraud detection system** using Machine Learning.

Main goals:

- Detect fraudulent online transactions
- Provide real-time prediction
- Display fraud risk score
- Maintain transaction logs
- Provide admin monitoring dashboard

---

# 🎯 Objectives

- Detect online payment fraud using **Machine Learning**
- Build a **real-time fraud prediction system**
- Provide **risk score and explanation**
- Create an **interactive web interface**
- Implement **Admin Dashboard for monitoring**

---

# ⚙️ System Architecture

The system contains **four main layers**.

## 1️⃣ Machine Learning Layer
Responsible for training and predicting fraud.

Functions:

- Data preprocessing
- Feature engineering
- Model training
- Model evaluation
- Model serialization

---

## 2️⃣ Backend Layer

Implemented using **FastAPI**

Responsibilities:

- Handle API requests
- Load trained ML model
- Process transaction inputs
- Return prediction results
- Store transaction logs

---

## 3️⃣ Frontend Layer

Developed using **React.js**

Features:

- Transaction input form
- Fraud prediction result
- Risk score visualization
- Admin login
- Admin dashboard

---

## 4️⃣ Monitoring Layer

Admin dashboard displays:

- Total transactions
- Fraud transactions
- Legitimate transactions
- Fraud percentage
- Transaction history

---

# 📊 Dataset

Dataset used is similar to the **PaySim Financial Transaction Dataset**.

### Dataset Features

| Feature | Description |
|------|-------------|
| step | Time step of transaction |
| type | Transaction type |
| amount | Transaction amount |
| oldbalanceOrg | Sender balance before transaction |
| newbalanceOrig | Sender balance after transaction |
| oldbalanceDest | Receiver balance before transaction |
| newbalanceDest | Receiver balance after transaction |
| isFraud | Fraud label |

---

# 🧠 Machine Learning Models

## Logistic Regression
- Used as baseline model
- Binary classification

## Random Forest
- Handles complex patterns
- Works well with imbalanced datasets
- Selected as **primary model**

### Evaluation Metrics

- ROC-AUC
- Precision
- Recall
- F1 Score

---

# 🖥️ Input Parameters

| Input | Description |
|------|-------------|
| Transaction Amount | Amount transferred |
| Step | Transaction time step |
| Transaction Type | Type of transaction |
| Old Balance (Sender) | Balance before transfer |
| New Balance (Sender) | Balance after transfer |
| Old Balance (Receiver) | Receiver balance before |
| New Balance (Receiver) | Receiver balance after |

---

# 📤 Output

| Output | Description |
|------|-------------|
| Fraud Status | Fraud / Legitimate |
| Risk Score | Probability of fraud |
| Explanation | Reason for prediction |
| Transaction Log | Stored for admin dashboard |

---

# 🔍 Fraud Detection Logic

Fraud detection considers patterns such as:

- Large transaction amount
- Balance inconsistencies
- Suspicious transaction types
- Unusual balance changes
- Abnormal transaction patterns

The ML model calculates a **fraud probability score**.

---

# 📊 Admin Dashboard

Dashboard features:

- Total transactions
- Fraud count
- Legitimate count
- Fraud percentage
- Recent transactions
- Analytics charts

---

# 🛠️ Technologies Used

## Programming
- Python
- JavaScript

## Machine Learning
- Scikit-learn
- Pandas
- NumPy
- Joblib

## Backend
- FastAPI
- Pydantic

## Frontend
- React.js
- HTML
- CSS
- JavaScript

## Database
- MongoDB

## Visualization
- Recharts

---

# 📂 Project Structure

```

online-fraud-detection-frontend
│
├── backend
│   ├── server.py
│   ├── ml_training.py
│   └── models
│       ├── fraud_model.pkl
│       ├── feature_names.pkl
│       └── model_metadata.pkl
│
├── frontend
│   └── src
│       ├── pages
│       │   ├── LandingPage.js
│       │   ├── CheckTransaction.js
│       │   ├── AdminDashboard.js
│       │   ├── AdminLogin.js
│       │   ├── AboutPage.js
│       │   └── ContactPage.js
│
└── dataset
└── fraud_transactions.csv

```

---

# 🚀 How to Run the Project

### 1️⃣ Clone Repository

```

git clone [https://github.com/guptapreeti194/online-fraud-detection-frontend.git]
```

### 2️⃣ Install Backend Dependencies

```

pip install -r requirements.txt

```

### 3️⃣ Train Model

```

python ml_training.py

```

### 4️⃣ Start Backend

```

uvicorn server:app --reload

```

### 5️⃣ Start Frontend

```

cd frontend
npm install
npm start

```

### 6️⃣ Open Application

```

[http://localhost:3000](http://localhost:3000)

```

---

# 🔐 Admin Login

```

Username: admin
Password: admin123

```

---

# 👥 Team Members

- **Pravy Jha** – Frontend Development
- **Preeti Gupta** – Machine Learning Development
- **Shikha Kumari** – Admin Dashboard
- **Krish Gupta** – Documentation & Testing
- **Widhika Shah** – Backend Development

---

# 📚 Academic Use

Developed as **B.Tech CSE 6th Semester Mini Project**.

