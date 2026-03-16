import { Link } from "react-router-dom";
import { ShieldCheck, Activity, Lock, BarChart3, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-slate-900" />
              <span className="text-xl font-bold text-slate-900" style={{fontFamily: 'Manrope'}}>Sentinel AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Contact
              </Link>
              <Link to="/login">
                <Button variant="outline" className="rounded-full" data-testid="nav-admin-login-btn">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-background py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1
                className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900"
                style={{fontFamily: 'Manrope'}}
                data-testid="hero-title"
              >
                Online Payment Fraud Detection System
              </h1>
              <p className="text-lg leading-relaxed text-slate-600">
                Detect fraudulent transactions in real-time using advanced Machine Learning algorithms.
                Protect your business with bank-grade security and precision analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/check">
                  <Button
                    size="lg"
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium transition-all active:scale-95 w-full sm:w-auto"
                    data-testid="hero-check-transaction-btn"
                  >
                    Check Transaction
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 rounded-full px-8 py-6 text-base font-medium transition-all w-full sm:w-auto"
                    data-testid="hero-admin-dashboard-btn"
                  >
                    <BarChart3 className="mr-2 w-5 h-5" />
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Real-time Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>99.63% ROC-AUC Accuracy</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="glass-card rounded-2xl p-8 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1696013910376-c56f76dd8178?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2hpZWxkJTIwbG9jayUyMHNlY3VyaXR5JTIwZGlnaXRhbCUyMHNoaWVsZCUyMGlsbHVzdHJhdGlvbiUyMGJsdWV8ZW58MHx8fHwxNzY4NTE2NjkyfDA&ixlib=rb-4.1.0&q=85"
                  alt="Digital Security"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to detect fraud with precision
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-slate-200 hover:border-blue-500/50 transition-colors group" data-testid="step-1-card">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                1
              </div>
              <Activity className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-slate-900" style={{fontFamily: 'Manrope'}}>Input Transaction</h3>
              <p className="text-slate-600 leading-relaxed">
                Enter transaction details including amount, time step, transaction type, and origin/destination account balances through our secure form.
              </p>
            </Card>
            <Card className="p-8 border-slate-200 hover:border-blue-500/50 transition-colors group" data-testid="step-2-card">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                2
              </div>
              <Lock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-slate-900" style={{fontFamily: 'Manrope'}}>XGBoost Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Our XGBoost model analyzes 26 engineered features including balance anomalies, transaction patterns, and account drain signals in milliseconds.
              </p>
            </Card>
            <Card className="p-8 border-slate-200 hover:border-blue-500/50 transition-colors group" data-testid="step-3-card">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                3
              </div>
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-slate-900" style={{fontFamily: 'Manrope'}}>Get Results</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive instant fraud prediction with a risk score, confidence level, and a plain-language explanation of the factors that triggered the alert.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 md:py-24 bg-slate-50" data-testid="tech-stack-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
              Technology Stack
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built with cutting-edge technologies for maximum reliability
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'FastAPI', desc: 'High-performance backend' },
              { name: 'React', desc: 'Modern UI framework' },
              { name: 'MongoDB', desc: 'Scalable database' },
              { name: 'scikit-learn', desc: 'ML algorithms' },
              { name: 'XGBoost', desc: 'Primary ML model' },
              { name: 'Random Forest', desc: 'Ensemble model' },
              { name: 'SMOTE', desc: 'Class balancing' },
              { name: 'PaySim Dataset', desc: '6.3M real transactions' },
            ].map((tech, idx) => (
              <Card key={idx} className="p-6 text-center border-slate-200 hover:shadow-lg transition-shadow" data-testid={`tech-${idx}`}>
                <h4 className="font-semibold text-slate-900 mb-2" style={{fontFamily: 'Manrope'}}>{tech.name}</h4>
                <p className="text-sm text-slate-600">{tech.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: 'Manrope'}}>
              Ready to Secure Your Transactions?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Start detecting fraud in real-time with our XGBoost-powered system — 99.63% ROC-AUC accuracy
            </p>
            <Link to="/check">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium transition-all active:scale-95"
                data-testid="cta-check-now-btn"
              >
                Check Transaction Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-lg font-bold" style={{fontFamily: 'Manrope'}}>Sentinel AI</span>
              </div>
              <p className="text-slate-400 text-sm">
                Advanced Machine Learning for fraud detection — XGBoost, 99.63% ROC-AUC
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Manrope'}}>Quick Links</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-slate-400 hover:text-white transition-colors text-sm">Home</Link>
                <Link to="/check" className="block text-slate-400 hover:text-white transition-colors text-sm">Check Transaction</Link>
                <Link to="/about" className="block text-slate-400 hover:text-white transition-colors text-sm">About</Link>
                <Link to="/contact" className="block text-slate-400 hover:text-white transition-colors text-sm">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{fontFamily: 'Manrope'}}>Academic Project</h4>
              <p className="text-slate-400 text-sm mb-2">
                Built for educational purposes
              </p>
              <p className="text-slate-400 text-sm">
                © 2025 Sentinel AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;