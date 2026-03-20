import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getRiskConfig = (score, isFraud) => {
  if (isFraud && score >= 75) return {
    level: "CRITICAL RISK",
    color: "#dc2626",
    bgColor: "#fef2f2",
    borderColor: "#dc2626",
    barColor: "#dc2626",
    icon: "critical",
    badge: "bg-red-100 text-red-800"
  };
  if (isFraud && score >= 50) return {
    level: "HIGH RISK",
    color: "#ea580c",
    bgColor: "#fff7ed",
    borderColor: "#ea580c",
    barColor: "#ea580c",
    icon: "high",
    badge: "bg-orange-100 text-orange-800"
  };
  if (score >= 30) return {
    level: "MEDIUM RISK",
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#d97706",
    barColor: "#d97706",
    icon: "medium",
    badge: "bg-yellow-100 text-yellow-800"
  };
  return {
    level: "LOW RISK",
    color: "#059669",
    bgColor: "#f0fdf4",
    borderColor: "#059669",
    barColor: "#059669",
    icon: "low",
    badge: "bg-emerald-100 text-emerald-800"
  };
};

const RiskMeter = ({ score, color }) => (
  <div style={{ marginTop: 12, marginBottom: 4 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>0%</span>
      <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>Risk Meter</span>
      <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>100%</span>
    </div>
    <div style={{ height: 10, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${score}%`,
        background: `linear-gradient(90deg, #22c55e, ${color})`,
        borderRadius: 99,
        transition: "width 1s ease-in-out"
      }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
      <span style={{ fontSize: 10, color: "#22c55e" }}>Safe</span>
      <span style={{ fontSize: 10, color: "#d97706" }}>Medium</span>
      <span style={{ fontSize: 10, color: "#dc2626" }}>Critical</span>
    </div>
  </div>
);

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
      const data = response.data;
      const risk = data.risk_score;
      const isFraud = data.is_fraud;

      if (isFraud && risk >= 75) {
        toast.error("🚨 Critical Fraud Alert — Immediate action required!");
      } else if (isFraud && risk >= 50) {
        toast.error("🚨 Fraud Detected — High risk transaction!");
      } else if (risk >= 30) {
        toast.warning("⚠️ Suspicious Transaction — Review recommended");
      } else {
        toast.success("✅ Transaction appears legitimate");
      }

      setResult(data);

    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error.response?.data?.detail || "Failed to analyze transaction");
    } finally {
      setLoading(false);
    }
  };

  const riskConfig = result ? getRiskConfig(result.risk_score, result.is_fraud) : null;

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
                <Input id="amount" type="number" step="0.01" placeholder="e.g., 5000.00"
                  value={formData.amount} onChange={(e) => handleChange("amount", e.target.value)}
                  required className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                  data-testid="input-amount" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="step">Time Step (1–743, represents hour of simulation)</Label>
                <Input id="step" type="number" placeholder="e.g., 24"
                  value={formData.step} onChange={(e) => handleChange("step", e.target.value)}
                  required className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                  data-testid="input-step" />
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
                  <Input id="oldbalance_org" type="number" step="0.01" placeholder="Before"
                    value={formData.oldbalance_org} onChange={(e) => handleChange("oldbalance_org", e.target.value)}
                    required className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-oldbalance-org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newbalance_orig">New Balance (Origin)</Label>
                  <Input id="newbalance_orig" type="number" step="0.01" placeholder="After"
                    value={formData.newbalance_orig} onChange={(e) => handleChange("newbalance_orig", e.target.value)}
                    required className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-newbalance-orig" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oldbalance_dest">Old Balance (Dest)</Label>
                  <Input id="oldbalance_dest" type="number" step="0.01" placeholder="Before"
                    value={formData.oldbalance_dest} onChange={(e) => handleChange("oldbalance_dest", e.target.value)}
                    required className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-oldbalance-dest" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newbalance_dest">New Balance (Dest)</Label>
                  <Input id="newbalance_dest" type="number" step="0.01" placeholder="After"
                    value={formData.newbalance_dest} onChange={(e) => handleChange("newbalance_dest", e.target.value)}
                    required className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-newbalance-dest" />
                </div>
              </div>

              <Button type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full h-12 text-base font-medium transition-all active:scale-95"
                disabled={loading} data-testid="submit-transaction-btn">
                {loading ? (
                  <><Loader2 className="mr-2 w-5 h-5 animate-spin" />Analyzing with XGBoost...</>
                ) : "Analyze Transaction"}
              </Button>
            </form>
          </Card>

          {/* Result Display */}
          <div className="space-y-4">
            {result && riskConfig ? (
              <>
                {/* Main Result Card */}
                <div style={{
                  padding: 28,
                  borderRadius: 16,
                  border: `2px solid ${riskConfig.borderColor}`,
                  background: riskConfig.bgColor
                }} data-testid="result-card">

                  {/* Status Header */}
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    {result.is_fraud ? (
                      result.risk_score >= 75
                        ? <AlertCircle size={64} color={riskConfig.color} style={{ margin: "0 auto 12px" }} />
                        : <AlertTriangle size={64} color={riskConfig.color} style={{ margin: "0 auto 12px" }} />
                    ) : (
                      <Shield size={64} color={riskConfig.color} style={{ margin: "0 auto 12px" }} />
                    )}

                    <h3 style={{
                      fontSize: 26, fontWeight: 700, color: riskConfig.color,
                      fontFamily: 'Manrope', marginBottom: 4
                    }} data-testid="result-status">
                      {result.is_fraud ? "FRAUD DETECTED" : "LEGITIMATE"}
                    </h3>

                    {/* Risk Level Badge */}
                    <span style={{
                      display: "inline-block",
                      padding: "3px 14px",
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      background: riskConfig.color + "20",
                      color: riskConfig.color,
                      border: `1px solid ${riskConfig.color}40`,
                      marginBottom: 16
                    }}>
                      {riskConfig.level}
                    </span>

                    {/* Risk Score */}
                    <div style={{ fontSize: 56, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}
                      data-testid="result-risk-score">
                      {result.risk_score}%
                    </div>
                    <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Composite Risk Score</p>

                    {/* Risk Meter */}
                    <RiskMeter score={result.risk_score} color={riskConfig.color} />
                  </div>

                  {/* Fraud Signals */}
                  <div style={{ borderTop: "1px solid " + riskConfig.borderColor + "40", paddingTop: 16 }}>
                    <h4 style={{ fontWeight: 600, color: "#0f172a", marginBottom: 10, fontSize: 14, fontFamily: 'Manrope' }}>
                      Fraud Signal Analysis ({result.explanation.length} signal{result.explanation.length !== 1 ? "s" : ""} detected):
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.explanation.map((exp, idx) => (
                        <div key={idx} style={{
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "#374151",
                          lineHeight: 1.6,
                          border: "1px solid rgba(0,0,0,0.06)"
                        }} data-testid={`explanation-${idx}`}>
                          {exp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transaction Summary Card */}
                <div style={{
                  padding: "20px 24px",
                  borderRadius: 12,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0"
                }} data-testid="transaction-summary-card">
                  <h4 style={{ fontWeight: 600, color: "#0f172a", marginBottom: 14, fontFamily: 'Manrope', fontSize: 14 }}>
                    Transaction Summary
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["Amount", `$${result.transaction.amount.toLocaleString()}`],
                      ["Type", result.transaction.transaction_type],
                      ["XGBoost Probability", `${(result.fraud_probability * 100).toFixed(2)}%`],
                      ["Composite Risk Score", `${result.risk_score}%`],
                      ["Risk Level", riskConfig.level],
                      ["Model", "XGBoost — 99.78% ROC-AUC"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#64748b" }}>{label}:</span>
                        <span style={{ fontWeight: 500, color: "#0f172a" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
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