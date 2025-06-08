
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Shield, GraduationCap, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student";
  organization: string;
  status: "active" | "inactive";
  joinDate: string;
  learningPaths: number;
}

const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@techcorp.com",
      role: "admin",
      organization: "TechCorp Inc.",
      status: "active",
      joinDate: "2024-01-15",
      learningPaths: 3
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@techcorp.com",
      role: "student",
      organization: "TechCorp Inc.",
      status: "active",
      joinDate: "2024-02-01",
      learningPaths: 2
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@edusoft.com",
      role: "admin",
      organization: "EduSoft Solutions",
      status: "active",
      joinDate: "2024-01-20",
      learningPaths: 4
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.w@datascience.com",
      role: "student",
      organization: "DataScience Pro",
      status: "inactive",
      joinDate: "2024-03-01",
      learningPaths: 1
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterOrg, setFilterOrg] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as "admin" | "student",
    organization: "",
    status: "active" as "active" | "inactive"
  });

  const organizations = ["TechCorp Inc.", "EduSoft Solutions", "DataScience Pro"];

  const filteredUsers = users.filter(user => {
    const orgMatch = filterOrg === "all" || user.organization === filterOrg;
    const roleMatch = filterRole === "all" || user.role === filterRole;
    return orgMatch && roleMatch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users =>
        users.map(user =>
          user.id === editingUser.id
            ? { ...user, ...formData }
            : user
        )
      );
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      });
    } else {
      const newUser: User = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        learningPaths: 0
      };
      setUsers(users => [...users, newUser]);
      toast({
        title: "User created",
        description: "The new user has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "student", organization: "", status: "active" });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users => users.filter(user => user.id !== id));
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "student", organization: "", status: "active" });
    setIsDialogOpen(true);
  };

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
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? "Update the user details" : "Create a new user account"}
              </DialogDescription>
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
                <Select value={formData.organization} onValueChange={(value) => setFormData({ ...formData, organization: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org} value={org}>{org}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.status === "active").length}
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
                    <SelectItem key={org} value={org}>{org}</SelectItem>
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
                <TableHead>Learning Paths</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>{user.learningPaths}</TableCell>
                  <TableCell className="text-gray-600">{user.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManager;
