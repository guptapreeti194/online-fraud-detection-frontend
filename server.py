from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import joblib
import numpy as np
import pandas as pd
import hashlib
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Load ML model
model_path = ROOT_DIR / 'models' / 'fraud_model.pkl'
feature_names_path = ROOT_DIR / 'models' / 'feature_names.pkl'
metadata_path = ROOT_DIR / 'models' / 'model_metadata.pkl'

try:
    ml_model = joblib.load(model_path)
    feature_names = joblib.load(feature_names_path)
    model_metadata = joblib.load(metadata_path)
    print(f"✓ ML Model loaded: {model_metadata['best_model']} (ROC-AUC: {model_metadata['best_auc']:.4f})")
except FileNotFoundError:
    print("⚠ ML model not found. Please run ml_training.py first.")
    ml_model = None
    feature_names = None
    model_metadata = None

# Create the main app
app = FastAPI(title="Fraud Detection API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# In-memory session store (use Redis in production)
active_sessions = {}

# Admin credentials (hashed)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = hashlib.sha256("admin123".encode()).hexdigest()

# Models
class TransactionInput(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount")
    step: int = Field(..., ge=1, description="Time step of transaction")
    transaction_type: str = Field(..., description="Type: PAYMENT, TRANSFER, CASH_OUT, DEBIT, CASH_IN")
    oldbalance_org: float = Field(..., ge=0, description="Origin account balance before")
    newbalance_orig: float = Field(..., ge=0, description="Origin account balance after")
    oldbalance_dest: float = Field(..., ge=0, description="Destination account balance before")
    newbalance_dest: float = Field(..., ge=0, description="Destination account balance after")

class PredictionResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transaction: TransactionInput
    is_fraud: bool
    fraud_probability: float
    risk_score: int
    explanation: List[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    message: str

class AdminStats(BaseModel):
    total_transactions: int
    fraud_count: int
    legitimate_count: int
    model_accuracy: float
    fraud_percentage: float

class TransactionHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    amount: float
    is_fraud: bool
    risk_score: int
    timestamp: str

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> bool:
    """Verify admin authentication token"""
    token = credentials.credentials
    if token not in active_sessions:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return True

def preprocess_transaction(transaction: TransactionInput) -> pd.DataFrame:
    """Preprocess single transaction for prediction"""
    # Create base dataframe
    data = {
        'step': [transaction.step],
        'amount': [transaction.amount],
        'oldbalanceOrg': [transaction.oldbalance_org],
        'newbalanceOrig': [transaction.newbalance_orig],
        'oldbalanceDest': [transaction.oldbalance_dest],
        'newbalanceDest': [transaction.newbalance_dest],
    }
    
    # Add transaction type one-hot encoding
    for trans_type in ['PAYMENT', 'TRANSFER', 'CASH_OUT', 'DEBIT', 'CASH_IN']:
        data[f'type_{trans_type}'] = [1 if transaction.transaction_type == trans_type else 0]
    
    # Feature engineering
    data['balance_change_orig'] = [transaction.oldbalance_org - transaction.newbalance_orig]
    data['balance_change_dest'] = [transaction.newbalance_dest - transaction.oldbalance_dest]
    data['amount_to_balance_ratio'] = [transaction.amount / (transaction.oldbalance_org + 1)]
    
    df = pd.DataFrame(data)
    
    # Ensure all features are present in correct order
    for feature in feature_names:
        if feature not in df.columns:
            df[feature] = 0
    
    return df[feature_names]

def generate_explanation(transaction: TransactionInput, fraud_prob: float) -> List[str]:
    """Generate human-readable explanation for prediction"""
    explanations = []
    
    # Amount analysis
    if transaction.amount > 200000:
        explanations.append(f"Very high transaction amount: ${transaction.amount:,.2f}")
    elif transaction.amount > 50000:
        explanations.append(f"High transaction amount: ${transaction.amount:,.2f}")
    
    # Balance analysis
    if transaction.newbalance_orig == 0 and transaction.oldbalance_org > 0:
        explanations.append("Complete balance drain detected")
    
    balance_change = transaction.oldbalance_org - transaction.newbalance_orig
    if abs(balance_change - transaction.amount) > 0.01:
        explanations.append("Balance change doesn't match transaction amount")
    
    # Transaction type risk
    high_risk_types = ['TRANSFER', 'CASH_OUT']
    if transaction.transaction_type in high_risk_types:
        explanations.append(f"High-risk transaction type: {transaction.transaction_type}")
    
    # Amount to balance ratio
    ratio = transaction.amount / (transaction.oldbalance_org + 1)
    if ratio > 0.8:
        explanations.append("Transaction amount is very high relative to account balance")
    
    if not explanations:
        if fraud_prob > 0.5:
            explanations.append("Multiple fraud indicators detected by ML model")
        else:
            explanations.append("Transaction appears normal based on historical patterns")
    
    return explanations

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "Fraud Detection API is running", "status": "healthy"}

@api_router.post("/predict", response_model=PredictionResult)
async def predict_fraud(transaction: TransactionInput):
    """Predict if a transaction is fraudulent"""
    if ml_model is None:
        raise HTTPException(status_code=503, detail="ML model not loaded. Run ml_training.py first.")
    
    try:
        # Preprocess
        X = preprocess_transaction(transaction)
        
        # Predict
        fraud_prob = ml_model.predict_proba(X)[0][1]
        is_fraud = fraud_prob > 0.5
        risk_score = int(fraud_prob * 100)
        
        # Generate explanation
        explanation = generate_explanation(transaction, fraud_prob)
        
        # Create result
        result = PredictionResult(
            transaction=transaction,
            is_fraud=is_fraud,
            fraud_probability=fraud_prob,
            risk_score=risk_score,
            explanation=explanation
        )
        
        # Save to database
        doc = result.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.transactions.insert_one(doc)
        
        return result
        
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@api_router.post("/admin/login", response_model=LoginResponse)
async def admin_login(credentials: LoginRequest):
    """Admin login endpoint"""
    password_hash = hashlib.sha256(credentials.password.encode()).hexdigest()
    
    if credentials.username != ADMIN_USERNAME or password_hash != ADMIN_PASSWORD_HASH:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate session token
    token = secrets.token_urlsafe(32)
    active_sessions[token] = {
        'username': credentials.username,
        'created_at': datetime.now(timezone.utc)
    }
    
    return LoginResponse(token=token, message="Login successful")

@api_router.post("/admin/logout")
async def admin_logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Admin logout endpoint"""
    token = credentials.credentials
    if token in active_sessions:
        del active_sessions[token]
    return {"message": "Logout successful"}

@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(authorized: bool = Depends(verify_admin_token)):
    """Get admin dashboard statistics"""
    transactions = await db.transactions.find({}, {"_id": 0}).to_list(10000)
    
    total = len(transactions)
    fraud_count = sum(1 for t in transactions if t.get('is_fraud', False))
    legit_count = total - fraud_count
    
    fraud_pct = (fraud_count / total * 100) if total > 0 else 0
    
    # Model accuracy from metadata
    accuracy = model_metadata['best_auc'] if model_metadata else 0.85
    
    return AdminStats(
        total_transactions=total,
        fraud_count=fraud_count,
        legitimate_count=legit_count,
        model_accuracy=accuracy,
        fraud_percentage=fraud_pct
    )

@api_router.get("/admin/transactions", response_model=List[TransactionHistory])
async def get_transaction_history(limit: int = 50, authorized: bool = Depends(verify_admin_token)):
    """Get recent transaction history"""
    transactions = await db.transactions.find({}, {"_id": 0}).sort('timestamp', -1).to_list(limit)
    
    history = []
    for t in transactions:
        history.append(TransactionHistory(
            id=t.get('id', 'N/A'),
            amount=t.get('transaction', {}).get('amount', 0),
            is_fraud=t.get('is_fraud', False),
            risk_score=t.get('risk_score', 0),
            timestamp=t.get('timestamp', '')
        ))
    
    return history

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
