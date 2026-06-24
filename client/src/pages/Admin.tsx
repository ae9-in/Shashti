import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  LogOut
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface Application {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  categories: string[];
  additionalInfo: string | null;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token]);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, statusFilter, applications]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      toast.success("Successfully logged in as admin!");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setApplications([]);
    setFilteredApps([]);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/applications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data.applications ?? []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let result = [...applications];

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Search term (name, email, city, pincode, state)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.fullName.toLowerCase().includes(term) ||
          app.email.toLowerCase().includes(term) ||
          app.city.toLowerCase().includes(term) ||
          app.state.toLowerCase().includes(term) ||
          app.pincode.toLowerCase().includes(term)
      );
    }

    setFilteredApps(result);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      toast.success(`Application status updated to ${newStatus}`);
      
      // Update local state
      const updated = applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      );
      setApplications(updated);

      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      toast.success("Application deleted successfully");
      setApplications(applications.filter((app) => app.id !== id));
      setIsDetailOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete application");
    }
  };

  const handleExportCSV = () => {
    if (filteredApps.length === 0) {
      toast.error("No applications to export");
      return;
    }

    // CSV headers
    const headers = [
      "ID",
      "Date Joined",
      "Full Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Pincode",
      "Categories Interested",
      "Status",
      "Additional Info"
    ];

    const rows = filteredApps.map((app) => [
      app.id,
      new Date(app.createdAt).toLocaleDateString(),
      `"${app.fullName.replace(/"/g, '""')}"`,
      app.email,
      app.phone,
      `"${app.city.replace(/"/g, '""')}"`,
      `"${app.state.replace(/"/g, '""')}"`,
      app.pincode,
      `"${app.categories.join(", ").replace(/"/g, '""')}"`,
      app.status,
      `"${(app.additionalInfo || "").replace(/"/g, '""')}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shasthi_applications_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  // KPI Calculations
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "PENDING").length,
    contacted: applications.filter((app) => app.status === "CONTACTED").length,
    approved: applications.filter((app) => app.status === "APPROVED").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold px-2 py-0.5">Pending Review</Badge>;
      case "CONTACTED":
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-100 font-semibold px-2 py-0.5">Contacted</Badge>;
      case "APPROVED":
        return <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold px-2 py-0.5">Approved Partner</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-100 font-semibold px-2 py-0.5">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FBF4E6] flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3D0A12]/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md z-10"
        >
          {/* Logo / Brand statement above login */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-[#C9A227]/30 shadow-md">
              <Lock className="w-6 h-6 text-[#3D0A12]" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#3D0A12]" style={{ fontFamily: "Playfair Display, serif" }}>
                Admin Portal
              </h2>
              <p className="text-sm text-[#241108]/60 mt-1 font-sans">
                Sign in to manage partner applications and territories
              </p>
            </div>
          </div>

          <Card className="bg-white border-2 border-[#C9A227]/30 shadow-xl overflow-hidden backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3D0A12] via-[#C9A227] to-[#3D0A12]" />
            <CardHeader className="space-y-1 pt-8 pb-6 text-center">
              <CardTitle className="text-xl font-bold text-[#3D0A12]">Credentials Required</CardTitle>
              <CardDescription className="text-xs text-[#241108]/50">
                Please enter your registered administrator credentials below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D0A12]/80">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241108]/40" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-[#C9A227]/30 bg-transparent text-[#241108] placeholder-[#241108]/30 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D0A12]/80">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241108]/40" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-[#C9A227]/30 bg-transparent text-[#241108] placeholder-[#241108]/30 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#3D0A12] text-[#FBF4E6] hover:bg-[#59101B] font-semibold py-6 transition-all duration-300 shadow-md group relative overflow-hidden"
                >
                  {loginLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#FBF4E6]" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Access Dashboard
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-[#241108]/40 mt-6">
            Authorized Personnel Only • Secure 256-Bit Connection
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF4E6]">
      <Navigation />

      <div className="pt-32 pb-20 px-4 md:px-8 container max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#C9A227]/20 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#C9A227]">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-semibold tracking-wider uppercase font-sans">Internal Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3D0A12]" style={{ fontFamily: "Playfair Display, serif" }}>
              Partner Applications
            </h1>
            <p className="text-sm text-[#241108]/70 max-w-2xl leading-relaxed">
              Manage and review incoming partnership applications for exclusive area distribution. Review credentials, coordinate onboarding, and assign territories.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchApplications}
              variant="outline"
              className="border-[#C9A227]/30 text-[#3D0A12] hover:bg-[#C9A227]/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-[#C9A227] text-[#3D0A12] hover:bg-[#E3C567] font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/50 font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-white border-2 border-[#C9A227]/20 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-[#3D0A12]" />
            <CardHeader className="p-4 md:p-6 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#241108]/60 flex items-center justify-between">
                Total Submissions
                <Users className="w-4 h-4 text-[#3D0A12]/60" />
              </CardDescription>
              <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-[#3D0A12] pt-1">
                {stats.total}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white border-2 border-[#C9A227]/20 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-amber-500" />
            <CardHeader className="p-4 md:p-6 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#241108]/60 flex items-center justify-between">
                Pending Review
                <Clock className="w-4 h-4 text-amber-500" />
              </CardDescription>
              <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-[#3D0A12] pt-1">
                {stats.pending}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white border-2 border-[#C9A227]/20 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-500" />
            <CardHeader className="p-4 md:p-6 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#241108]/60 flex items-center justify-between">
                Contacted
                <Phone className="w-4 h-4 text-blue-500" />
              </CardDescription>
              <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-[#3D0A12] pt-1">
                {stats.contacted}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-white border-2 border-[#C9A227]/20 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1.5 bg-emerald-500" />
            <CardHeader className="p-4 md:p-6 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#241108]/60 flex items-center justify-between">
                Approved Partners
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </CardDescription>
              <CardTitle className="text-3xl md:text-4xl font-serif font-bold text-[#3D0A12] pt-1">
                {stats.approved}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-[#C9A227]/20 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241108]/40" />
            <Input
              type="text"
              placeholder="Search by name, email, city, pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#C9A227]/30 bg-transparent text-[#241108] placeholder-[#241108]/40 focus:border-[#C9A227]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span className="text-xs font-bold text-[#3D0A12] mr-2 shrink-0">Filter Status:</span>
            {["ALL", "PENDING", "CONTACTED", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === status
                    ? "bg-[#3D0A12] text-[#FBF4E6] shadow-sm"
                    : "bg-[#F5EDE0] text-[#3D0A12] hover:bg-[#C9A227]/10"
                }`}
              >
                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border-2 border-[#C9A227]/20 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#C9A227]" />
              <p className="text-sm font-semibold text-[#3D0A12]">Loading application entries...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-[#241108]/20" />
              <h3 className="text-lg font-serif font-bold text-[#3D0A12]">No Applications Found</h3>
              <p className="text-sm text-[#241108]/60 max-w-md mx-auto">
                No entries match your search criteria. Try modifying your filter settings or search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F5EDE0]">
                  <TableRow className="border-[#C9A227]/20 hover:bg-[#F5EDE0]">
                    <TableHead className="font-bold text-[#3D0A12] w-[180px]">Date Applied</TableHead>
                    <TableHead className="font-bold text-[#3D0A12]">Applicant Name</TableHead>
                    <TableHead className="font-bold text-[#3D0A12]">Contact Info</TableHead>
                    <TableHead className="font-bold text-[#3D0A12]">Territory Location</TableHead>
                    <TableHead className="font-bold text-[#3D0A12]">Categories</TableHead>
                    <TableHead className="font-bold text-[#3D0A12] text-center">Status</TableHead>
                    <TableHead className="font-bold text-[#3D0A12] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id} className="border-[#C9A227]/10 hover:bg-[#FBF4E6]/20 transition-all">
                      <TableCell className="text-sm text-[#241108] font-medium font-sans">
                        <div className="flex items-center gap-1.5 text-xs text-[#241108]/60">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(app.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-[#3D0A12]">{app.fullName}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-xs font-medium text-[#241108]/80 font-sans">
                            <Phone className="w-3 h-3 text-[#C9A227]" /> {app.phone}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#241108]/60 font-sans">
                            <Mail className="w-3 h-3 text-[#C9A227]" /> {app.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1 text-[#241108]/80">
                          <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                          <span>
                            {app.city}, {app.state}
                          </span>
                          <span className="text-xs text-[#241108]/50 ml-1">({app.pincode})</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {app.categories.slice(0, 2).map((cat, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 border-[#C9A227]/30 bg-[#FBF4E6] text-[#3D0A12]">
                              {cat}
                            </Badge>
                          ))}
                          {app.categories.length > 2 && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1 border-[#C9A227]/30 bg-[#FBF4E6] text-[#3D0A12]">
                              +{app.categories.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApp(app);
                              setIsDetailOpen(true);
                            }}
                            className="text-[#3D0A12] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(app.id)}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 w-8 h-8 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Applicant Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-[#FBF4E6] border-2 border-[#C9A227]/30 text-[#241108]">
          {selectedApp && (
            <>
              <DialogHeader className="border-b border-[#C9A227]/20 pb-4">
                <div className="flex items-center justify-between pr-6">
                  {getStatusBadge(selectedApp.status)}
                  <span className="text-xs text-[#241108]/50">
                    Application ID: #{selectedApp.id}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-serif font-bold text-[#3D0A12] mt-2">
                  {selectedApp.fullName}
                </DialogTitle>
                <DialogDescription className="text-[#241108]/60 text-xs">
                  Submitted on {new Date(selectedApp.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                {/* Contact Information */}
                <div className="space-y-4 bg-white p-4 rounded-lg border border-[#C9A227]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D0A12]">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#C9A227]" />
                      <a href={`tel:${selectedApp.phone}`} className="hover:underline font-sans">
                        {selectedApp.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C9A227]" />
                      <a href={`mailto:${selectedApp.email}`} className="hover:underline font-sans">
                        {selectedApp.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Territory Protection */}
                <div className="space-y-4 bg-white p-4 rounded-lg border border-[#C9A227]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D0A12]">
                    Requested Territory
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C9A227]" />
                      <strong>City:</strong> {selectedApp.city}
                    </p>
                    <p className="ml-5">
                      <strong>State:</strong> {selectedApp.state}
                    </p>
                    <p className="ml-5">
                      <strong>Pincode:</strong> {selectedApp.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="space-y-3 bg-white p-4 rounded-lg border border-[#C9A227]/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D0A12]">
                  Categories Interested In
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.categories.map((cat, idx) => (
                    <Badge key={idx} className="bg-[#F5EDE0] hover:bg-[#F5EDE0] text-[#3D0A12] border border-[#C9A227]/30 px-3 py-1 font-sans">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div className="space-y-2 bg-white p-4 rounded-lg border border-[#C9A227]/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D0A12]">
                  Additional Details / Profile Info
                </h4>
                <p className="text-sm leading-relaxed text-[#241108]/85 italic bg-[#FBF4E6]/30 p-3 rounded border border-dashed border-[#C9A227]/10">
                  {selectedApp.additionalInfo || "No additional comments provided by applicant."}
                </p>
              </div>

              {/* Action Buttons */}
              <DialogFooter className="border-t border-[#C9A227]/20 pt-4 flex flex-col sm:flex-row gap-2 justify-between">
                <div className="flex justify-start">
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(selectedApp.id)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Applicant
                  </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  {selectedApp.status !== "CONTACTED" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedApp.id, "CONTACTED")}
                      disabled={isUpdatingStatus}
                      className="border border-[#C9A227]/40 bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold"
                    >
                      Mark Contacted
                    </Button>
                  )}
                  {selectedApp.status !== "APPROVED" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedApp.id, "APPROVED")}
                      disabled={isUpdatingStatus}
                      className="border border-[#C9A227]/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold"
                    >
                      Approve Partner
                    </Button>
                  )}
                  {selectedApp.status !== "REJECTED" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedApp.id, "REJECTED")}
                      disabled={isUpdatingStatus}
                      className="border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold"
                    >
                      Reject
                    </Button>
                  )}
                  {selectedApp.status !== "PENDING" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedApp.id, "PENDING")}
                      disabled={isUpdatingStatus}
                      variant="outline"
                      className="border-[#C9A227]/30 text-[#3D0A12] hover:bg-[#C9A227]/10"
                    >
                      Reset Pending
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
