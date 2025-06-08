
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building2, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: number;
  name: string;
  description: string;
  adminCount: number;
  studentCount: number;
  learningPaths: number;
  status: "active" | "inactive";
}

const OrganizationManager = () => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: 1,
      name: "TechCorp Inc.",
      description: "Leading technology company",
      adminCount: 3,
      studentCount: 150,
      learningPaths: 5,
      status: "active"
    },
    {
      id: 2,
      name: "EduSoft Solutions",
      description: "Educational software development",
      adminCount: 2,
      studentCount: 85,
      learningPaths: 3,
      status: "active"
    },
    {
      id: 3,
      name: "DataScience Pro",
      description: "Data analytics and AI training",
      adminCount: 4,
      studentCount: 200,
      learningPaths: 8,
      status: "inactive"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrg) {
      setOrganizations(orgs =>
        orgs.map(org =>
          org.id === editingOrg.id
            ? { ...org, ...formData }
            : org
        )
      );
      toast({
        title: "Organization updated",
        description: "The organization has been successfully updated.",
      });
    } else {
      const newOrg: Organization = {
        id: Date.now(),
        ...formData,
        adminCount: 0,
        studentCount: 0,
        learningPaths: 0
      };
      setOrganizations(orgs => [...orgs, newOrg]);
      toast({
        title: "Organization created",
        description: "The new organization has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingOrg(null);
    setFormData({ name: "", description: "", status: "active" });
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      description: org.description,
      status: org.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      setOrganizations(orgs => orgs.filter(org => org.id !== id));
      toast({
        title: "Organization deleted",
        description: "The organization has been successfully deleted.",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setEditingOrg(null);
    setFormData({ name: "", description: "", status: "active" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organization Management</h2>
          <p className="text-gray-600">Manage and monitor all organizations in the system</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Organization</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOrg ? "Edit Organization" : "Add New Organization"}
              </DialogTitle>
              <DialogDescription>
                {editingOrg ? "Update the organization details" : "Create a new organization"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter organization name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOrg ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
            <Building2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.filter(org => org.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.reduce((sum, org) => sum + org.adminCount + org.studentCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Manage all organizations and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Learning Paths</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{org.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{org.description}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{org.adminCount + org.studentCount} total</span>
                      </div>
                      <div className="text-gray-500">
                        {org.adminCount} admins, {org.studentCount} students
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{org.learningPaths}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={org.status === "active" ? "default" : "secondary"}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(org)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(org.id)}
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

export default OrganizationManager;
