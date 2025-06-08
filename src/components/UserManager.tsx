
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users, Shield, GraduationCap, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  organization: string;
  organization_id: string;
  joinDate: string;
}

interface Organization {
  id: string;
  name: string;
}

const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterOrg, setFilterOrg] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as "admin" | "student",
    organization_id: "",
    password: ""
  });

  const fetchUsers = async () => {
    try {
      const { data: authData, error: authError } = await supabase
        .from('auth')
        .select(`
          id,
          name,
          email,
          role,
          organization_id,
          created_at
        `)
        .neq('role', 'superadmin');

      if (authError) throw authError;

      // Fetch organization names for users
      const usersWithOrgs = await Promise.all(
        (authData || []).map(async (user) => {
          let organizationName = 'No Organization';
          
          if (user.organization_id) {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', user.organization_id)
              .single();
            
            if (orgData) {
              organizationName = orgData.name;
            }
          }

          return {
            ...user,
            role: user.role as "admin" | "student",
            organization: organizationName,
            joinDate: new Date(user.created_at).toLocaleDateString(),
          };
        })
      );

      setUsers(usersWithOrgs);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive"
      });
    }
  };

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchOrganizations()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredUsers = users.filter(user => {
    const orgMatch = filterOrg === "all" || user.organization_id === filterOrg;
    const roleMatch = filterRole === "all" || user.role === filterRole;
    return orgMatch && roleMatch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedOrg = organizations.find(org => org.id === formData.organization_id);
      
      const { error } = await supabase
        .from('auth')
        .insert([{
          name: formData.name,
          email: formData.email,
          role: formData.role,
          organization_id: formData.organization_id,
          organization: selectedOrg?.name || '',
          password: formData.password
        }]);

      if (error) throw error;

      toast({
        title: "User created",
        description: "The new user has been successfully created.",
      });

      setIsDialogOpen(false);
      setFormData({ name: "", email: "", role: "student", organization_id: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const { error } = await supabase
          .from('auth')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ name: "", email: "", role: "student", organization_id: "", password: "" });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users across all organizations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: "admin" | "student") => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Select value={formData.organization_id} onValueChange={(value) => setFormData({ ...formData, organization_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === "student").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage users and their roles across organizations</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterOrg} onValueChange={setFilterOrg}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        user.role === "admin" ? "bg-red-100" : "bg-green-100"
                      }`}>
                        {user.role === "admin" ? (
                          <Shield className="w-4 h-4 text-red-600" />
                        ) : (
                          <GraduationCap className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.organization}</TableCell>
                  <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManager;
