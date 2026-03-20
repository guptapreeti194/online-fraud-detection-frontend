import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Target, Lightbulb, Workflow, Database, Brain, BarChart3 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-slate-900" />
              <span className="text-xl font-bold text-slate-900" style={{fontFamily: 'Manrope'}}>Sentinel AI</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" data-testid="back-to-home-btn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}} data-testid="about-title">
            About This Project
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            A comprehensive fraud detection system built with XGBoost and ensemble Machine Learning to protect online payment transactions with 99.78% ROC-AUC accuracy
          </p>
        </div>

        {/* Problem Statement */}
        <section className="mb-16" data-testid="problem-statement-section">
          <Card className="p-8 border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3" style={{fontFamily: 'Manrope'}}>
                  Problem Statement
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Online payment fraud is a growing concern in the digital economy, causing billions of dollars in losses annually.
                  Traditional rule-based systems struggle to detect sophisticated fraud patterns that evolve constantly.
                  In real-world datasets like PaySim, fraud accounts for only 0.13% of all transactions — making detection extremely challenging due to severe class imbalance.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Our project addresses this challenge by leveraging XGBoost with SMOTE oversampling and 26 engineered features to identify fraudulent transactions in real-time,
                  achieving only 2 missed frauds and 3 false alarms out of 100,000 test transactions.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Solution Overview */}
        <section className="mb-16" data-testid="solution-section">
          <Card className="p-8 border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3" style={{fontFamily: 'Manrope'}}>
                  Our Solution
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We developed an end-to-end web application that uses XGBoost — the industry standard for tabular fraud detection — trained on 500,000 real transactions
                  from the PaySim dataset (6.3M total). The system provides:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span><strong>Real-time fraud detection</strong> with instant risk assessment and 99.78% ROC-AUC</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span><strong>26 engineered features</strong> including balance anomaly, account drain, and transaction pattern signals</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span><strong>SMOTE oversampling</strong> to handle real-world class imbalance (0.125% fraud rate)</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-600">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span><strong>Admin analytics dashboard</strong> for monitoring transaction history and model performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* ML Workflow */}
        <section className="mb-16" data-testid="workflow-section">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
              Machine Learning Workflow
            </h2>
            <p className="text-slate-600">Our systematic approach to fraud detection</p>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="p-6 border-slate-200" data-testid="workflow-step-1">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900" style={{fontFamily: 'Manrope'}}>Data Collection & Preprocessing</h3>
                  </div>
                  <p className="text-slate-600">
                    Load 500,000 transactions sampled from the real PaySim dataset (6.3M rows, 0.125% fraud rate).
                    Apply one-hot encoding for transaction types (PAYMENT, TRANSFER, CASH_OUT, DEBIT, CASH_IN)
                    and engineer 26 features including balance errors, account drain flags, log-transformed amounts, and flow anomalies.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 border-slate-200" data-testid="workflow-step-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900" style={{fontFamily: 'Manrope'}}>SMOTE + Model Training</h3>
                  </div>
                  <p className="text-slate-600">
                    Apply SMOTE oversampling to balance the training set from 0.125% fraud to 50/50, generating 799,000 balanced samples.
                    Train four competing models: <strong>XGBoost</strong> (0.9963), <strong>Gradient Boosting</strong> (0.9931),
                    <strong> Random Forest</strong> (0.9919), and <strong>Logistic Regression</strong> (0.9895).
                    XGBoost is selected as best performer.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 border-slate-200" data-testid="workflow-step-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900" style={{fontFamily: 'Manrope'}}>Evaluation & Deployment</h3>
                  </div>
                  <p className="text-slate-600">
                    Evaluate on 100,000 unseen test transactions. XGBoost achieves 99.78% ROC-AUC with 98% precision and recall on fraud cases —
                    catching 123 out of 125 fraud cases with only 3 false alarms.
                    Deploy the trained model in a FastAPI backend for real-time predictions.
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="p-6 border-slate-200" data-testid="workflow-step-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Workflow className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900" style={{fontFamily: 'Manrope'}}>Real-time Prediction</h3>
                  </div>
                  <p className="text-slate-600">
                    Process incoming transactions through the XGBoost model, compute a risk score (0–100),
                    and provide explainable results with specific fraud indicators such as complete balance drain,
                    high-risk transaction type, amount-to-balance anomaly, and destination balance mismatch.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <Card className="p-8 border-slate-200 bg-slate-50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
                  Academic Project
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  This project was developed as part of an academic curriculum to demonstrate the practical application
                  of Machine Learning in solving real-world financial fraud problems.
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Course:</strong> Machine Learning & Data Analytics</p>
                  <p><strong>Dataset:</strong> PaySim — 500K sampled from 6.3M real transactions</p>
                  <p><strong>Technology Stack:</strong> FastAPI, React, MongoDB, XGBoost, scikit-learn</p>
                  <p><strong>Key Algorithms:</strong> XGBoost, Random Forest, Gradient Boosting, Logistic Regression</p>
                  <p><strong>Class Balancing:</strong> SMOTE (Synthetic Minority Oversampling Technique)</p>
                  <p><strong>Evaluation Metric:</strong> ROC-AUC Score — 99.78%</p>
                  <p><strong>Features Engineered:</strong> 26 fraud-specific features</p>
                </div>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1758518727707-729d9bef1a16?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBhbmFseXppbmclMjBkYXRhJTIwbW9kZXJuJTIwb2ZmaWNlfGVufDB8fHx8MTc2ODUxNjY3M3ww&ixlib=rb-4.1.0&q=85"
                  alt="Team analyzing data"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link to="/check">
            <Button
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium transition-all active:scale-95"
              data-testid="cta-try-now-btn"
            >
              Try the System
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;