# 🛡️ Online Payment Fraud Detection System

A Machine Learning based web application that detects **fraudulent online payment transactions** in real time using **XGBoost** trained on the real **PaySim dataset** (6.3 million transactions).

The system analyzes 26 engineered transaction features and predicts whether a transaction is **Fraudulent or Legitimate**, returning a **risk score and plain-language explanation** — achieving **99.78% ROC-AUC** on 100,000 unseen test transactions.

---

## 📌 Project Overview

This project builds a **real-time fraud detection system** using ensemble Machine Learning, addressing one of the most critical challenges in digital finance — class imbalance fraud detection (only 0.125% of real transactions are fraudulent).

### Main Goals

- Detect fraudulent online transactions using XGBoost
- Handle severe class imbalance using SMOTE oversampling
- Provide real-time prediction with risk score and explanation
- Maintain transaction logs in MongoDB
- Provide an admin monitoring dashboard with live charts

---

## 🎯 Objectives

- Detect online payment fraud using **XGBoost** (99.78% ROC-AUC)
- Engineer **26 fraud-specific features** from raw transaction data
- Apply **SMOTE** to balance training data from 0.125% fraud to 50/50
- Build a **real-time fraud prediction API** using FastAPI
- Create an **interactive React web interface** with risk visualization
- Implement an **Admin Dashboard** for transaction monitoring

---

## ⚙️ System Architecture

The system is organized into **four main layers**.

### 1️⃣ Machine Learning Layer

Responsible for training and predicting fraud.

- Data loading from PaySim dataset (500K sampled from 6.3M rows)
- 26-feature engineering (balance errors, drain flags, log transforms)
- SMOTE oversampling to fix class imbalance
- Training 4 competing models: XGBoost, Random Forest, Gradient Boosting, Logistic Regression
- Model evaluation on 100,000 unseen test transactions
- Best model serialization using Joblib

### 2️⃣ Backend Layer

Implemented using **FastAPI (Python)**

- Handle API requests for fraud prediction
- Load trained XGBoost model at startup
- Preprocess and engineer features for incoming transactions
- Return prediction results with risk score and explanation
- Store transaction logs in MongoDB

### 3️⃣ Frontend Layer

Developed using **React.js**

- Transaction input form with 7 fields
- Real-time fraud prediction result with risk score
- Admin login with session token authentication
- Admin dashboard with bar chart and risk trend line chart
- CSV report download

### 4️⃣ Monitoring Layer

Admin dashboard displays:

- Total transactions processed
- Fraud transactions count and percentage
- Legitimate transactions count
- XGBoost model ROC-AUC score
- Recent transaction history table
- Fraud vs Legitimate bar chart
- Risk trend line chart

---

## 📊 Dataset

**PaySim Financial Transaction Dataset** — publicly available on Kaggle.

> Lopez-Rojas, E., Elmir, A., & Axelsson, S. (2016). PaySim: A financial mobile money simulator for fraud detection. *EMSS 2016.*

We sampled **500,000 transactions** from the full 6.3 million row dataset to train our models within 8GB RAM constraints. The real fraud rate in PaySim is only **0.125%** (625 fraud cases in 500K rows), which is why SMOTE was essential.

### Dataset Features

| Feature | Description |
|---------|-------------|
| step | Time step (1 step = 1 hour, max 743) |
| type | Transaction type (PAYMENT, TRANSFER, CASH_OUT, DEBIT, CASH_IN) |
| amount | Transaction amount in local currency |
| oldbalanceOrg | Sender account balance before transaction |
| newbalanceOrig | Sender account balance after transaction |
| oldbalanceDest | Receiver account balance before transaction |
| newbalanceDest | Receiver account balance after transaction |
| isFraud | Ground truth label (1 = Fraud, 0 = Legitimate) |

---

## 🧠 Machine Learning Models

We trained and compared **4 models** on 799,000 SMOTE-balanced samples and evaluated on 100,000 real test transactions.

| Model | ROC-AUC |
|-------|---------|
| **XGBoost** ✅ | **0.9978** |
| Gradient Boosting | 0.9931 |
| Random Forest | 0.9919 |
| Logistic Regression | 0.9895 |

**XGBoost was selected** as the best performer with 99.78% ROC-AUC.

### XGBoost Configuration

```python
XGBClassifier(
    n_estimators=500,
    max_depth=7,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=fraud_ratio,
    eval_metric='auc',
    tree_method='hist'
)
```

### Confusion Matrix (Test set — 100,000 transactions)

|  | Predicted Legitimate | Predicted Fraud |
|--|---------------------|-----------------|
| **Actual Legitimate** | 99,872 ✅ | 3 ❌ |
| **Actual Fraud** | 2 ❌ | 123 ✅ |

- **True Positives:** 123 (fraud correctly caught)
- **False Negatives:** 2 (fraud missed)
- **False Positives:** 3 (false alarms)

### Top 10 Feature Importances

| Feature | Importance |
|---------|------------|
| type_CASH_IN | 0.3144 |
| type_PAYMENT | 0.1737 |
| amount_surplus | 0.1420 |
| balance_change_orig | 0.1328 |
| orig_balance_error | 0.1005 |
| is_complete_drain | 0.0334 |
| oldbalanceOrg | 0.0172 |
| oldbalanceDest | 0.0142 |
| amount_to_balance_ratio | 0.0133 |
| newbalanceOrig | 0.0099 |

### Engineered Features (26 total)

Beyond the 7 raw features, we engineered 19 additional features:

- `is_complete_drain` — account fully emptied after transaction
- `dest_balance_anomaly` — destination balance unchanged despite transfer
- `orig_balance_error` — inconsistency between expected and actual sender balance
- `dest_balance_error` — inconsistency between expected and actual receiver balance
- `amount_surplus` — how much the amount exceeded the available balance
- `log_amount`, `log_oldbalanceOrg`, `log_oldbalanceDest` — log transforms to handle skew
- `amount_to_balance_ratio`, `amount_to_dest_ratio` — relative size of transaction
- `net_flow` — net balance movement across both accounts
- `is_round_amount` — flag for suspiciously round large amounts
- `is_night_step` — flag for transactions in off-hours

---

## 🔍 Fraud Detection Logic

The API receives a transaction and applies the same 26-feature engineering pipeline used during training before passing it to XGBoost for prediction. The risk score (0–100) maps directly to the model's fraud probability.

The explanation engine flags human-readable signals:

- Very high or high transaction amount
- Complete balance drain detected
- High-risk transaction type (TRANSFER / CASH_OUT)
- Transaction amount high relative to balance

---

## 🖥️ Input Parameters

| Input | Description | Example |
|-------|-------------|---------|
| Transaction Amount | Amount transferred | 50000.00 |
| Step | Hour of simulation (1–743) | 24 |
| Transaction Type | PAYMENT / TRANSFER / CASH_OUT / DEBIT / CASH_IN | TRANSFER |
| Old Balance (Sender) | Sender balance before | 80000.00 |
| New Balance (Sender) | Sender balance after | 30000.00 |
| Old Balance (Receiver) | Receiver balance before | 5000.00 |
| New Balance (Receiver) | Receiver balance after | 55000.00 |

---

## 📤 Output

| Output | Description |
|--------|-------------|
| Fraud Status | FRAUD / LEGITIMATE |
| Risk Score | 0–100 (maps to XGBoost fraud probability) |
| Explanation | Plain-language fraud signal description |
| Transaction Log | Stored in MongoDB for admin dashboard |

---

## 🛠️ Technologies Used

### Machine Learning
- XGBoost 3.2.0
- scikit-learn 1.8.0
- imbalanced-learn 0.14.1 (SMOTE)
- Pandas, NumPy, Joblib

### Backend
- FastAPI
- Pydantic
- Motor (async MongoDB)
- Python 3.14

### Frontend
- React.js
- Recharts (charts)
- Tailwind CSS
- Axios

### Database
- MongoDB

---

## 📂 Project Structure

```
ONLINE FRAUD DETECTION SYSTEM
│
├── BACKEND
│   ├── server.py                  # FastAPI application
│   ├── ml_training.py             # Model training pipeline
│   ├── requirements.txt
│   ├── .env                       # MongoDB connection string
│   ├── dataset
│   │   ├── paysim.csv             # Real PaySim dataset (6.3M rows)
│   │   └── fraud_transactions.csv # 500K sampled training data
│   └── models
│       ├── fraud_model.pkl        # Best model (XGBoost)
│       ├── feature_names.pkl      # 26 feature names
│       ├── model_metadata.pkl     # ROC-AUC and model info
│       ├── random_forest_model.pkl
│       └── logistic_regression_model.pkl
│
└── frontend
    └── src
        └── pages
            ├── LandingPage.js
            ├── CheckTransaction.js
            ├── AdminDashboard.js
            ├── AdminLogin.js
            ├── AboutPage.js
            └── ContactPage.js
```

---

## 🚀 How to Run the Project

### 1️⃣ Clone Repository

```bash
git clone https://github.com/guptapreeti194/online-fraud-detection-frontend.git
cd online-fraud-detection-frontend
```

### 2️⃣ Install Backend Dependencies

```bash
cd BACKEND
pip install -r requirements.txt
pip install xgboost imbalanced-learn
```

### 3️⃣ Download PaySim Dataset

1. Go to https://www.kaggle.com/datasets/ealaxi/paysim1
2. Download and extract the ZIP
3. Rename the CSV to `paysim.csv`
4. Place it in `BACKEND/dataset/paysim.csv`

### 4️⃣ Train Model

```bash
python ml_training.py
```

Expected output:
```
Fraud rate: ~0.13% (real PaySim)
XGBoost ROC-AUC: 0.9978
✓ Verified saved metadata — best_auc: 0.9963
```

### 5️⃣ Start Backend

```bash
python -m uvicorn server:app --reload
```

### 6️⃣ Start Frontend

```bash
cd frontend
npm install
npm start
```

### 7️⃣ Open Application

```
http://localhost:3000
```

---

## 🔐 Admin Login

```
Username: admin
Password: admin123
```

---

## 📈 Model Performance Summary

| Metric | Value |
|--------|-------|
| ROC-AUC | **99.78%** |
| Precision (Fraud) | 98% |
| Recall (Fraud) | 98% |
| F1-Score (Fraud) | 98% |
| True Positives | 123 / 125 |
| False Positives | 3 / 99,875 |
| Training samples | 799,000 (after SMOTE) |
| Test samples | 100,000 |
| Features used | 26 |
| Dataset | PaySim (500K of 6.3M) |

---

## 👥 Team Members

| Name | Role |
|------|------|
| **Pravy Jha** | Frontend Development |
| **Preeti Gupta** | Machine Learning Development |
| **Shikha Kumari** | Admin Dashboard |
| **Krish Gupta** | Documentation & Testing |
| **Widhika Shah** | Backend Development |

---

## 📚 Academic Information

> **B.Tech CSE — 6th Semester Mini Project**
> Course: Machine Learning & Data Analytics

---

## 📖 References

- Lopez-Rojas, E. A., Elmir, A., & Axelsson, S. (2016). PaySim: A financial mobile money simulator for fraud detection. *In Proceedings of the 28th European Modeling & Simulation Symposium (EMSS).*
- Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. *KDD 2016.*
- Chawla, N. V., et al. (2002). SMOTE: Synthetic Minority Over-sampling Technique. *JAIR, 16, 321–357.*
