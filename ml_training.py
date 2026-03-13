import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score, classification_report
import joblib
import os

def generate_sample_fraud_data(n_samples=10000):
    """
    Generate synthetic fraud detection dataset similar to payment transaction data
    """
    np.random.seed(42)
    
    # Generate transaction types
    transaction_types = np.random.choice(['PAYMENT', 'TRANSFER', 'CASH_OUT', 'DEBIT', 'CASH_IN'], n_samples)
    
    # Generate amounts (fraud tends to have higher amounts)
    amounts = np.random.lognormal(mean=10, sigma=2, size=n_samples)
    
    # Generate step (time)
    steps = np.random.randint(1, 743, n_samples)
    
    # Generate balances
    oldbalanceOrg = np.random.lognormal(mean=10, sigma=2, size=n_samples)
    newbalanceOrig = oldbalanceOrg - amounts
    newbalanceOrig = np.maximum(newbalanceOrig, 0)  # Can't be negative
    
    oldbalanceDest = np.random.lognormal(mean=10, sigma=2, size=n_samples)
    newbalanceDest = oldbalanceDest + amounts
    
    # Generate fraud labels (10% fraud rate)
    fraud = np.zeros(n_samples)
    
    # Rules for fraud:
    # 1. Very high amounts (top 5%)
    # 2. Zero balance after transaction
    # 3. Specific transaction types more likely to be fraud
    high_amount_threshold = np.percentile(amounts, 95)
    
    for i in range(n_samples):
        fraud_probability = 0.1
        
        if amounts[i] > high_amount_threshold:
            fraud_probability += 0.3
        
        if newbalanceOrig[i] == 0 and oldbalanceOrg[i] > 0:
            fraud_probability += 0.2
        
        if transaction_types[i] in ['TRANSFER', 'CASH_OUT']:
            fraud_probability += 0.2
        
        if np.random.random() < fraud_probability:
            fraud[i] = 1
    
    # Create DataFrame
    df = pd.DataFrame({
        'step': steps,
        'type': transaction_types,
        'amount': amounts,
        'oldbalanceOrg': oldbalanceOrg,
        'newbalanceOrig': newbalanceOrig,
        'oldbalanceDest': oldbalanceDest,
        'newbalanceDest': newbalanceDest,
        'isFraud': fraud
    })
    
    return df

def preprocess_data(df):
    """
    Preprocess the data: one-hot encoding and feature engineering
    """
    # Create copy
    data = df.copy()
    
    # One-hot encode transaction type
    data = pd.get_dummies(data, columns=['type'], prefix='type')
    
    # Feature engineering
    data['balance_change_orig'] = data['oldbalanceOrg'] - data['newbalanceOrig']
    data['balance_change_dest'] = data['newbalanceDest'] - data['oldbalanceDest']
    data['amount_to_balance_ratio'] = data['amount'] / (data['oldbalanceOrg'] + 1)
    
    return data

def train_models(df):
    """
    Train Logistic Regression and Random Forest models
    """
    print("Starting model training...")
    print(f"Dataset shape: {df.shape}")
    print(f"Fraud distribution:\n{df['isFraud'].value_counts()}")
    print(f"Fraud percentage: {df['isFraud'].mean() * 100:.2f}%\n")
    
    # Preprocess
    data = preprocess_data(df)
    
    # Split features and target
    X = data.drop('isFraud', axis=1)
    y = data['isFraud']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}\n")
    
    # Train Logistic Regression
    print("Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train, y_train)
    
    y_pred_lr = lr_model.predict_proba(X_test)[:, 1]
    lr_auc = roc_auc_score(y_test, y_pred_lr)
    print(f"Logistic Regression ROC-AUC: {lr_auc:.4f}\n")
    
    # Train Random Forest
    print("Training Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    rf_model.fit(X_train, y_train)
    
    y_pred_rf = rf_model.predict_proba(X_test)[:, 1]
    rf_auc = roc_auc_score(y_test, y_pred_rf)
    print(f"Random Forest ROC-AUC: {rf_auc:.4f}\n")
    
    # Select best model
    if rf_auc >= lr_auc:
        best_model = rf_model
        best_model_name = "Random Forest"
        best_auc = rf_auc
    else:
        best_model = lr_model
        best_model_name = "Logistic Regression"
        best_auc = lr_auc
    
    print(f"Best Model: {best_model_name} with ROC-AUC: {best_auc:.4f}")
    
    # Save models and feature names
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)
    
    joblib.dump(best_model, os.path.join(model_dir, 'fraud_model.pkl'))
    joblib.dump(X.columns.tolist(), os.path.join(model_dir, 'feature_names.pkl'))
    
    # Save both models for comparison
    joblib.dump(lr_model, os.path.join(model_dir, 'logistic_regression_model.pkl'))
    joblib.dump(rf_model, os.path.join(model_dir, 'random_forest_model.pkl'))
    
    # Save model metadata
    metadata = {
        'best_model': best_model_name,
        'best_auc': best_auc,
        'lr_auc': lr_auc,
        'rf_auc': rf_auc,
        'feature_names': X.columns.tolist()
    }
    joblib.dump(metadata, os.path.join(model_dir, 'model_metadata.pkl'))
    
    print(f"\nModels saved to {model_dir}")
    
    return best_model, X.columns.tolist(), best_auc

if __name__ == "__main__":
    print("=" * 50)
    print("Fraud Detection Model Training")
    print("=" * 50)
    print()
    
    # Generate sample data
    print("Generating sample fraud detection dataset...")
    df = generate_sample_fraud_data(n_samples=10000)
    
    # Save dataset
    dataset_dir = os.path.join(os.path.dirname(__file__), 'dataset')
    os.makedirs(dataset_dir, exist_ok=True)
    df.to_csv(os.path.join(dataset_dir, 'fraud_transactions.csv'), index=False)
    print(f"Dataset saved to {dataset_dir}/fraud_transactions.csv\n")
    
    # Train models
    model, features, auc = train_models(df)
    
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
