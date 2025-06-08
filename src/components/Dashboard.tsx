
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, BookOpen, ClipboardList, LogOut, BarChart3 } from "lucide-react";
import OrganizationManager from "./OrganizationManager";
import UserManager from "./UserManager";
import LearningPathManager from "./LearningPathManager";
import AssessmentManager from "./AssessmentManager";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    activeUsers: 0,
    learningPaths: 0,
    assessments: 0
  });

  const fetchStats = async () => {
    try {
      // Fetch organizations count
      const { count: orgsCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true });

      // Fetch users count (excluding superadmin)
      const { count: usersCount } = await supabase
        .from('auth')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'superadmin');

      // Fetch learning paths count
      const { count: pathsCount } = await supabase
        .from('learning_paths')
        .select('*', { count: 'exact', head: true });

      // Fetch assessments count
      const { count: assessmentsCount } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalOrganizations: orgsCount || 0,
        activeUsers: usersCount || 0,
        learningPaths: pathsCount || 0,
        assessments: assessmentsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsData = [
    { title: "Total Organizations", value: stats.totalOrganizations.toString(), icon: Building2, color: "text-blue-600" },
    { title: "Active Users", value: stats.activeUsers.toString(), icon: Users, color: "text-indigo-600" },
    { title: "Learning Paths", value: stats.learningPaths.toString(), icon: BookOpen, color: "text-purple-600" },
    { title: "Assessments", value: stats.assessments.toString(), icon: ClipboardList, color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Organizations</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="learning-paths" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Learning Paths</span>
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4" />
              <span>Assessments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("organizations")}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Add New Organization
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("learning-paths")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Learning Paths
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("assessments")}
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    View Assessments
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Organizations</span>
                    <span className="font-semibold">{stats.totalOrganizations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Users</span>
                    <span className="font-semibold">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Learning Content</span>
                    <span className="font-semibold">{stats.learningPaths} paths</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assessments</span>
                    <span className="font-semibold">{stats.assessments} total</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <OrganizationManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManager />
          </TabsContent>

          <TabsContent value="learning-paths">
            <LearningPathManager />
          </TabsContent>

          <TabsContent value="assessments">
            <AssessmentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
