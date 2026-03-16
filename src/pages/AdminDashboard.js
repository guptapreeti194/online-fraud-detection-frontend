import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ArrowLeft, Users, AlertTriangle, CheckCircle2, TrendingUp, Download, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const [statsRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/admin/transactions?limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(`${API}/admin/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDownloadReport = () => {
    const csvContent = [
      ["Transaction ID", "Amount", "Status", "Risk Score", "Timestamp"],
      ...transactions.map(t => [
        t.id,
        t.amount,
        t.is_fraud ? "FRAUD" : "LEGITIMATE",
        t.risk_score,
        t.timestamp
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fraud_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Report downloaded");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="w-16 h-16 text-slate-900 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Fraud", count: stats?.fraud_count || 0, fill: "#DC2626" },
    { name: "Legitimate", count: stats?.legitimate_count || 0, fill: "#059669" }
  ];

  const trendData = transactions.slice(0, 7).reverse().map((t, idx) => ({
    name: `T${idx + 1}`,
    risk: t.risk_score
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-slate-900" />
              <span className="text-xl font-bold text-slate-900" style={{fontFamily: 'Manrope'}}>Sentinel AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" data-testid="back-to-home-btn">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} data-testid="logout-btn">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Manrope'}} data-testid="dashboard-title">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Monitor fraud detection analytics and transaction history — powered by XGBoost (99.63% ROC-AUC)</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200" data-testid="total-transactions-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Transactions</CardTitle>
              <Users className="w-5 h-5 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900" data-testid="total-transactions-count">{stats?.total_transactions || 0}</div>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50" data-testid="fraud-count-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-900">Fraud Detected</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600" data-testid="fraud-count">{stats?.fraud_count || 0}</div>
              <p className="text-xs text-red-700 mt-1">{stats?.fraud_percentage.toFixed(1)}% of total</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50" data-testid="legit-count-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">Legitimate</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600" data-testid="legit-count">{stats?.legitimate_count || 0}</div>
              <p className="text-xs text-emerald-700 mt-1">{(100 - stats?.fraud_percentage).toFixed(1)}% of total</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50" data-testid="accuracy-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Model Accuracy
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div
                className="text-3xl font-bold text-blue-600"
                data-testid="model-accuracy"
              >
                {stats ? (stats.model_accuracy * 100).toFixed(2) : "0.00"}%
              </div>
              <p className="text-xs text-blue-700 mt-1">
                XGBoost ROC-AUC Score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-slate-200" data-testid="fraud-vs-legit-chart">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Manrope'}}>Fraud vs Legitimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0F172A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200" data-testid="risk-trend-chart">
            <CardHeader>
              <CardTitle style={{fontFamily: 'Manrope'}}>Recent Risk Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" />
                    <YAxis stroke="#64748B" domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="risk" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions Table */}
        <Card className="border-slate-200" data-testid="recent-transactions-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{fontFamily: 'Manrope'}}>Recent Transactions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReport}
              data-testid="download-report-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction, idx) => (
                      <TableRow key={transaction.id} data-testid={`transaction-row-${idx}`}>
                        <TableCell className="font-mono text-xs">{transaction.id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-medium">${transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {transaction.is_fraud ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              FRAUD
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              LEGITIMATE
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${transaction.risk_score > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {transaction.risk_score}%
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;