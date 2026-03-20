import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Send, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    toast.success("Message sent successfully!");
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}} data-testid="contact-title">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about the fraud detection system? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <Card className="lg:col-span-2 p-8 border-slate-200" data-testid="contact-form-card">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{fontFamily: 'Manrope'}}>
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="w-4 h-4 inline mr-2" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  required
                  className="h-12 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                  data-testid="input-subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                  rows={6}
                  className="rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white resize-none"
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full h-12 text-base font-medium transition-all active:scale-95"
                disabled={submitted}
                data-testid="submit-contact-btn"
              >
                {submitted ? (
                  "Message Sent!"
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Project Info */}
          <div className="space-y-6">
            <Card className="p-6 border-slate-200" data-testid="project-info-card">
              <h3 className="text-xl font-semibold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
                Project Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">Project Title</p>
                  <p className="text-slate-600">Online Payment Fraud Detection System</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Technology</p>
                  <p className="text-slate-600">XGBoost, FastAPI, React, MongoDB</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Dataset</p>
                  <p className="text-slate-600">PaySim — 500K from 6.3M real transactions</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Model Accuracy</p>
                  <p className="text-slate-600">99.78% ROC-AUC (XGBoost)</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Category</p>
                  <p className="text-slate-600">Academic Project / FinTech</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Status</p>
                  <p className="text-slate-600">Production Ready</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 bg-blue-50" data-testid="demo-info-card">
              <h3 className="text-xl font-semibold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
                Demo Access
              </h3>
              <p className="text-sm text-slate-700 mb-4">
                Want to test the admin dashboard? Use these credentials:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Username:</span>
                  <code className="bg-white px-2 py-1 rounded text-slate-900">admin</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Password:</span>
                  <code className="bg-white px-2 py-1 rounded text-slate-900">admin123</code>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200" data-testid="support-card">
              <h3 className="text-xl font-semibold text-slate-900 mb-4" style={{fontFamily: 'Manrope'}}>
                Need Help?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                For technical support or questions about the XGBoost model, dataset, or API endpoints, please reach out through the contact form.
              </p>
              <Link to="/about">
                <Button variant="outline" size="sm" className="w-full">
                  Learn More About the Project
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;