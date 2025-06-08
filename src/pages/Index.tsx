
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Building2, Users, BookOpen, ClipboardList } from "lucide-react";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in real app would validate against backend
    if (credentials.username === "superadmin" && credentials.password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Use: superadmin / admin123");
    }
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Super Admin Dashboard</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Manage organizations, users, and learning content
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                Sign In
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
              <p className="text-sm text-blue-700">Username: superadmin</p>
              <p className="text-sm text-blue-700">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Organizations</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">User Management</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Learning Paths</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <ClipboardList className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Assessments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
