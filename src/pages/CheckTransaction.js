import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

c//onst BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = "https://sentinel-ai-backend-weoo.onrender.com/api";

const CheckTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    step: "",
    transaction_type: "PAYMENT",
    oldbalance_org: "",
    newbalance_orig: "",
    oldbalance_dest: "",
    newbalance_dest: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        step: parseInt(formData.step),
        transaction_type: formData.transaction_type,
        oldbalance_org: parseFloat(formData.oldbalance_org),
        newbalance_orig: parseFloat(formData.newbalance_orig),
        oldbalance_dest: parseFloat(formData.oldbalance_dest),
        newbalance_dest: parseFloat(formData.newbalance_dest)
      };

      const response = await axios.post(`${API}/predict`, payload);

      const risk = response.data.risk_score;

      let fraudStatus;
      let riskLevel;

      if (risk >= 45) {
        fraudStatus = true;
        riskLevel = "high";
        toast.error("🚨 Fraud Detected!");
      } else if (risk >= 30) {
        fraudStatus = false;
        riskLevel = "medium";
        toast.warning("⚠️ Suspicious Transaction");
      } else {
        fraudStatus = false;
        riskLevel = "low";
        toast.success("✅ Transaction is Legitimate");
      }

      setResult({
        ...response.data,
        is_fraud: fraudStatus,
        risk_level: riskLevel
      });

    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error.response?.data?.detail || "Failed to analyze transaction");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}} data-testid="page-title">
            Check Transaction
          </h1>
          <p className="text-lg text-slate-600">
            Enter transaction details to detect potential fraud using our XGBoost model — trained on 500,000 real PaySim transactions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-8 border-slate-200" data-testid="transaction-form-card">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900" style={{fontFamily: 'Manrope'}}>
              Transaction Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Transaction Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5000.00"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  required
                  className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                  data-testid="input-amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="step">Time Step (1–743, represents hour of simulation)</Label>
                <Input
                  id="step"
                  type="number"
                  placeholder="e.g., 24"
                  value={formData.step}
                  onChange={(e) => handleChange("step", e.target.value)}
                  required
                  className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                  data-testid="input-step"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select value={formData.transaction_type} onValueChange={(value) => handleChange("transaction_type", value)}>
                  <SelectTrigger className="h-12 rounded-lg border-slate-200" data-testid="select-transaction-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENT">PAYMENT</SelectItem>
                    <SelectItem value="TRANSFER">TRANSFER</SelectItem>
                    <SelectItem value="CASH_OUT">CASH_OUT</SelectItem>
                    <SelectItem value="DEBIT">DEBIT</SelectItem>
                    <SelectItem value="CASH_IN">CASH_IN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oldbalance_org">Old Balance (Origin)</Label>
                  <Input
                    id="oldbalance_org"
                    type="number"
                    step="0.01"
                    placeholder="Before"
                    value={formData.oldbalance_org}
                    onChange={(e) => handleChange("oldbalance_org", e.target.value)}
                    required
                    className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-oldbalance-org"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newbalance_orig">New Balance (Origin)</Label>
                  <Input
                    id="newbalance_orig"
                    type="number"
                    step="0.01"
                    placeholder="After"
                    value={formData.newbalance_orig}
                    onChange={(e) => handleChange("newbalance_orig", e.target.value)}
                    required
                    className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-newbalance-orig"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oldbalance_dest">Old Balance (Dest)</Label>
                  <Input
                    id="oldbalance_dest"
                    type="number"
                    step="0.01"
                    placeholder="Before"
                    value={formData.oldbalance_dest}
                    onChange={(e) => handleChange("oldbalance_dest", e.target.value)}
                    required
                    className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-oldbalance-dest"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newbalance_dest">New Balance (Dest)</Label>
                  <Input
                    id="newbalance_dest"
                    type="number"
                    step="0.01"
                    placeholder="After"
                    value={formData.newbalance_dest}
                    onChange={(e) => handleChange("newbalance_dest", e.target.value)}
                    required
                    className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-newbalance-dest"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full h-12 text-base font-medium transition-all active:scale-95"
                disabled={loading}
                data-testid="submit-transaction-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Analyzing with XGBoost...
                  </>
                ) : (
                  "Analyze Transaction"
                )}
              </Button>
            </form>
          </Card>

          {/* Result Display */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card
                  className={`p-8 border-2 ${result.is_fraud ? 'border-red-600 fraud-alert-glow bg-gradient-to-r from-red-50 to-white' : 'border-emerald-600 safe-glow bg-emerald-50'}`}
                  data-testid="result-card"
                >
                  <div className="text-center mb-6">
                    {result.is_fraud ? (
                      <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
                    ) : (
                      <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
                    )}
                    <h3
                      className={`text-3xl font-bold mb-2 ${result.is_fraud ? 'text-red-600' : 'text-emerald-600'}`}
                      style={{fontFamily: 'Manrope'}}
                      data-testid="result-status"
                    >
                      {result.is_fraud ? "FRAUD DETECTED" : "LEGITIMATE"}
                    </h3>
                    <div className="text-5xl font-bold text-slate-900 mb-2" data-testid="result-risk-score">
                      {result.risk_score}%
                    </div>
                    <p className="text-slate-600">Risk Score</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 mb-2" style={{fontFamily: 'Manrope'}}>Analysis Details:</h4>
                    {result.explanation.map((exp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-700" data-testid={`explanation-${idx}`}>
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 border-slate-200 bg-slate-50" data-testid="transaction-summary-card">
                  <h4 className="font-semibold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>Transaction Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-medium text-slate-900">${result.transaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium text-slate-900">{result.transaction.transaction_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Confidence:</span>
                      <span className="font-medium text-slate-900">{(result.fraud_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Model:</span>
                      <span className="font-medium text-slate-900">XGBoost — 99.63% ROC-AUC</span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 border-slate-200 bg-slate-50" data-testid="empty-result-card">
                <div className="text-center text-slate-500">
                  <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium mb-2">Results will appear here after analysis</p>
                  <p className="text-sm">Powered by XGBoost trained on 500K real PaySim transactions</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckTransaction;