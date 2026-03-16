import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, classification_report, confusion_matrix
import joblib
import os

try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    print("⚠ XGBoost not installed. Run: pip install xgboost")
    XGBOOST_AVAILABLE = False

try:
    from imblearn.over_sampling import SMOTE
    SMOTE_AVAILABLE = True
except ImportError:
    print("⚠ imbalanced-learn not installed. Run: pip install imbalanced-learn")
    SMOTE_AVAILABLE = False


# ─────────────────────────────────────────────
# CONFIG — adjust SAMPLE_SIZE if needed
# 8GB RAM  → 500_000  (recommended)
# 16GB RAM → 1_000_000
# ─────────────────────────────────────────────
SAMPLE_SIZE = 500_000
PAYSIM_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dataset', 'paysim.csv')


def load_paysim_data():
    """
    Load and sample the real PaySim dataset from Kaggle.
    Expected file: BACKEND/dataset/paysim.csv
    Download from: https://www.kaggle.com/datasets/ealaxi/paysim1
    """
    if not os.path.exists(PAYSIM_PATH):
        print(f"❌ PaySim dataset not found at: {PAYSIM_PATH}")
        print()
        print("Please download it from Kaggle:")
        print("  1. Go to https://www.kaggle.com/datasets/ealaxi/paysim1")
        print("  2. Click Download")
        print("  3. Extract the ZIP file")
        print("  4. Rename the CSV to 'paysim.csv'")
        print("  5. Place it in your BACKEND/dataset/ folder")
        print()
        raise FileNotFoundError(f"PaySim dataset not found: {PAYSIM_PATH}")

    print(f"Loading PaySim dataset from: {PAYSIM_PATH}")
    print(f"Sampling {SAMPLE_SIZE:,} rows (memory-safe for 8GB RAM)...")

    # Read only needed columns to save RAM
    cols = ['step', 'type', 'amount', 'oldbalanceOrg', 'newbalanceOrig',
            'oldbalanceDest', 'newbalanceDest', 'isFraud']

    # Count total rows first
    total_rows = sum(1 for _ in open(PAYSIM_PATH)) - 1
    print(f"Total rows in dataset: {total_rows:,}")

    # Sample efficiently
    skip_rows = sorted(np.random.choice(
        range(1, total_rows + 1),
        size=total_rows - SAMPLE_SIZE,
        replace=False
    )) if total_rows > SAMPLE_SIZE else []

    df = pd.read_csv(PAYSIM_PATH, usecols=cols, skiprows=skip_rows)

    print(f"Loaded: {len(df):,} rows")
    print(f"Fraud rate: {df['isFraud'].mean() * 100:.4f}% ({int(df['isFraud'].sum())} fraud cases)")

    if df['isFraud'].sum() < 100:
        print("⚠ Very few fraud cases in sample — try increasing SAMPLE_SIZE")

    return df


def engineer_features(df):
    """
    Feature engineering — same structure as server.py preprocess_transaction
    so predictions stay consistent.
    """
    data = df.copy()

    # One-hot encode transaction type
    data = pd.get_dummies(data, columns=['type'], prefix='type')
    for t in ['PAYMENT', 'TRANSFER', 'CASH_OUT', 'DEBIT', 'CASH_IN']:
        col = f'type_{t}'
        if col not in data.columns:
            data[col] = 0

    # Original features
    data['balance_change_orig'] = data['oldbalanceOrg'] - data['newbalanceOrig']
    data['balance_change_dest'] = data['newbalanceDest'] - data['oldbalanceDest']
    data['amount_to_balance_ratio'] = data['amount'] / (data['oldbalanceOrg'] + 1)

    # Strong fraud signals
    data['is_complete_drain'] = (
        (data['newbalanceOrig'] == 0) & (data['oldbalanceOrg'] > 0)
    ).astype(int)

    data['dest_balance_anomaly'] = (
        (data['newbalanceDest'] == data['oldbalanceDest']) & (data['amount'] > 0)
    ).astype(int)

    data['orig_balance_error'] = abs(
        data['oldbalanceOrg'] - data['newbalanceOrig'] - data['amount']
    )

    data['dest_balance_error'] = abs(
        data['newbalanceDest'] - data['oldbalanceDest'] - data['amount']
    )

    data['amount_to_dest_ratio'] = data['amount'] / (data['oldbalanceDest'] + 1)
    data['log_amount'] = np.log1p(data['amount'])
    data['log_oldbalanceOrg'] = np.log1p(data['oldbalanceOrg'])
    data['log_oldbalanceDest'] = np.log1p(data['oldbalanceDest'])
    data['amount_surplus'] = np.maximum(data['amount'] - data['oldbalanceOrg'], 0)
    data['net_flow'] = data['balance_change_orig'] - data['balance_change_dest']
    data['is_round_amount'] = (data['amount'] % 1000 == 0).astype(int)
    data['is_night_step'] = ((data['step'] % 24) < 6).astype(int)

    return data


def train_models(df):
    print("\nStarting model training...")
    print(f"Dataset shape: {df.shape}")
    print(f"Fraud distribution:\n{df['isFraud'].value_counts()}")
    print(f"Fraud percentage: {df['isFraud'].mean() * 100:.4f}%\n")

    data = engineer_features(df)
    X = data.drop('isFraud', axis=1)
    y = data['isFraud']

    print(f"Total features: {X.shape[1]}")
    print(f"Features: {list(X.columns)}\n")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training set: {X_train.shape[0]:,} | Test set: {X_test.shape[0]:,}")
    print(f"Fraud in train: {int(y_train.sum())} ({y_train.mean()*100:.4f}%)\n")

    # Apply SMOTE for class imbalance
    if SMOTE_AVAILABLE and y_train.mean() < 0.1:
        print("Applying SMOTE to balance classes...")
        smote = SMOTE(random_state=42, k_neighbors=5)
        X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)
        print(f"After SMOTE: {X_train_bal.shape[0]:,} samples, {y_train_bal.mean()*100:.1f}% fraud\n")
    else:
        print("Skipping SMOTE (class balance acceptable)\n")
        X_train_bal, y_train_bal = X_train, y_train

    results = {}

    # Model 1: Logistic Regression
    print("Training Logistic Regression...")
    lr_model = LogisticRegression(
        max_iter=3000, random_state=42,
        class_weight='balanced', C=1.0, solver='lbfgs'
    )
    lr_model.fit(X_train_bal, y_train_bal)
    lr_auc = roc_auc_score(y_test, lr_model.predict_proba(X_test)[:, 1])
    results['Logistic Regression'] = (lr_model, lr_auc)
    print(f"  ROC-AUC: {lr_auc:.4f}")

    # Model 2: Random Forest
    print("Training Random Forest (tuned)...")
    rf_model = RandomForestClassifier(
        n_estimators=300, max_depth=15,
        min_samples_split=5, min_samples_leaf=2,
        max_features='sqrt', class_weight='balanced',
        random_state=42, n_jobs=-1
    )
    rf_model.fit(X_train_bal, y_train_bal)
    rf_auc = roc_auc_score(y_test, rf_model.predict_proba(X_test)[:, 1])
    results['Random Forest'] = (rf_model, rf_auc)
    print(f"  ROC-AUC: {rf_auc:.4f}")

    # Model 3: XGBoost
    if XGBOOST_AVAILABLE:
        print("Training XGBoost...")
        fraud_ratio = float((y_train == 0).sum()) / float((y_train == 1).sum())
        xgb_model = XGBClassifier(
            n_estimators=500, max_depth=7,
            learning_rate=0.05, subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=fraud_ratio,
            eval_metric='auc',
            random_state=42, n_jobs=-1,
            tree_method='hist'
        )
        xgb_model.fit(X_train_bal, y_train_bal, verbose=False)
        xgb_auc = roc_auc_score(y_test, xgb_model.predict_proba(X_test)[:, 1])
        results['XGBoost'] = (xgb_model, xgb_auc)
        print(f"  ROC-AUC: {xgb_auc:.4f}")

    # Model 4: Gradient Boosting
    print("Training Gradient Boosting...")
    gb_model = GradientBoostingClassifier(
        n_estimators=200, max_depth=6,
        learning_rate=0.08, subsample=0.8,
        random_state=42
    )
    gb_model.fit(X_train_bal, y_train_bal)
    gb_auc = roc_auc_score(y_test, gb_model.predict_proba(X_test)[:, 1])
    results['Gradient Boosting'] = (gb_model, gb_auc)
    print(f"  ROC-AUC: {gb_auc:.4f}")

    # Comparison table
    print("\n" + "=" * 50)
    print("Model Comparison:")
    print("=" * 50)
    for name, (_, auc) in sorted(results.items(), key=lambda x: x[1][1], reverse=True):
        bar = "█" * int(auc * 40)
        print(f"  {name:<25} {auc:.4f}  {bar}")

    best_name, (best_model, best_auc) = max(results.items(), key=lambda x: x[1][1])
    print(f"\n🏆 Best Model: {best_name} — ROC-AUC: {best_auc:.4f}")

    # Detailed report
    print(f"\nClassification Report ({best_name}):")
    y_pred = best_model.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Fraud']))

    cm = confusion_matrix(y_test, y_pred)
    print(f"Confusion Matrix:")
    print(f"  True Negatives:  {cm[0][0]:,}  |  False Positives: {cm[0][1]:,}")
    print(f"  False Negatives: {cm[1][0]:,}  |  True Positives:  {cm[1][1]:,}")

    # Feature importance
    if hasattr(best_model, 'feature_importances_'):
        importances = pd.Series(best_model.feature_importances_, index=X.columns)
        top10 = importances.nlargest(10)
        print(f"\nTop 10 Feature Importances:")
        for feat, imp in top10.items():
            bar = "█" * int(imp * 200)
            print(f"  {feat:<30} {imp:.4f}  {bar}")

    # Save models
    model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    os.makedirs(model_dir, exist_ok=True)

    joblib.dump(best_model, os.path.join(model_dir, 'fraud_model.pkl'))
    joblib.dump(X.columns.tolist(), os.path.join(model_dir, 'feature_names.pkl'))
    joblib.dump(lr_model, os.path.join(model_dir, 'logistic_regression_model.pkl'))
    joblib.dump(rf_model, os.path.join(model_dir, 'random_forest_model.pkl'))

    metadata = {
        'best_model': best_name,
        'best_auc': best_auc,
        'lr_auc': lr_auc,
        'rf_auc': rf_auc,
        'feature_names': X.columns.tolist(),
        'all_results': {k: v[1] for k, v in results.items()},
        'n_features': X.shape[1],
        'smote_applied': SMOTE_AVAILABLE,
        'dataset': 'PaySim Real Dataset (Kaggle)',
        'sample_size': SAMPLE_SIZE,
    }
    joblib.dump(metadata, os.path.join(model_dir, 'model_metadata.pkl'))

    verify = joblib.load(os.path.join(model_dir, 'model_metadata.pkl'))
    print(f"\n✓ Verified saved metadata — best_auc: {verify['best_auc']:.4f}")
    print(f"✓ Models saved to: {model_dir}")

    return best_model, X.columns.tolist(), best_auc


if __name__ == "__main__":
    print("=" * 55)
    print("Fraud Detection — PaySim Real Dataset Training")
    print("=" * 55)
    print()

    df = load_paysim_data()

    # Save sampled dataset
    dataset_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dataset')
    sample_path = os.path.join(dataset_dir, 'fraud_transactions.csv')
    df.to_csv(sample_path, index=False)
    print(f"Sample saved to: {sample_path}\n")

    model, features, auc = train_models(df)

    print("\n" + "=" * 55)
    print(f"Training Complete!  Final ROC-AUC: {auc:.4f}")
    print("=" * 55)