import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Building2, Users, BookOpen, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Organization {
  id: string;
  name: string;
  description: string;
  assigned_learning_paths: string[];
  assigned_assessments_code: string[];
  created_at: string;
  updated_at: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
}

interface Assessment {
  id: string;
  name: string;
  code: string;
  status: string;
}

const OrganizationManager = () => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assigned_learning_paths: [] as string[],
    assigned_assessments_code: [] as string[]
  });

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

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

  // Fetch learning paths
  const fetchLearningPaths = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .order('title');

      if (error) throw error;
      setLearningPaths(data || []);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    }
  };

  // Fetch assessments
  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, name, code, status')
        .order('name');

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchOrganizations(),
        fetchLearningPaths(),
        fetchAssessments()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingOrg) {
        // Update existing organization
        const { error } = await supabase
          .from('organizations')
          .update(formData)
          .eq('id', editingOrg.id);

        if (error) throw error;

        toast({
          title: "Organization updated",
          description: "The organization has been successfully updated.",
        });
      } else {
        // Create new organization
        const { error } = await supabase
          .from('organizations')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Organization created",
          description: "The new organization has been successfully created.",
        });
      }

      setIsDialogOpen(false);
      setEditingOrg(null);
      setFormData({ 
        name: "", 
        description: "", 
        assigned_learning_paths: [], 
        assigned_assessments_code: [] 
      });
      fetchOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      toast({
        title: "Error",
        description: editingOrg ? "Failed to update organization." : "Failed to create organization.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        const { error } = await supabase
          .from('organizations')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Organization deleted",
          description: "The organization has been successfully deleted.",
        });
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Error",
          description: "Failed to delete organization.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingOrg(null);
    setFormData({ 
      name: "", 
      description: "", 
      assigned_learning_paths: [], 
      assigned_assessments_code: [] 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      description: org.description,
      assigned_learning_paths: org.assigned_learning_paths || [],
      assigned_assessments_code: org.assigned_assessments_code || []
    });
    setIsDialogOpen(true);
  };

  const toggleLearningPath = (pathId: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_learning_paths: prev.assigned_learning_paths.includes(pathId)
        ? prev.assigned_learning_paths.filter(id => id !== pathId)
        : [...prev.assigned_learning_paths, pathId]
    }));
  };

  const toggleAssessment = (assessmentCode: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_assessments_code: prev.assigned_assessments_code.includes(assessmentCode)
        ? prev.assigned_assessments_code.filter(code => code !== assessmentCode)
        : [...prev.assigned_assessments_code, assessmentCode]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading organizations...</div>
      </div>
    );
  }

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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrg ? 'Edit Organization' : 'Add New Organization'}</DialogTitle>
              <DialogDescription>
                {editingOrg ? 'Update the organization details and assignments' : 'Create a new organization and assign learning paths and assessments'}
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
                />
              </div>
              
              <div className="space-y-2">
                <Label>Assign Learning Paths</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                  {learningPaths.map((path) => (
                    <label key={path.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assigned_learning_paths.includes(path.id)}
                        onChange={() => toggleLearningPath(path.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{path.title} - {path.difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign Assessments</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                  {assessments.map((assessment) => (
                    <label key={assessment.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assigned_assessments_code.includes(assessment.code)}
                        onChange={() => toggleAssessment(assessment.code)}
                        className="rounded"
                      />
                      <span className="text-sm">{assessment.name} ({assessment.code})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOrg ? 'Update Organization' : 'Create Organization'}
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
            <CardTitle className="text-sm font-medium">Learning Paths Available</CardTitle>
            <BookOpen className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPaths.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments Available</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Manage all organizations and their assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Learning Paths</TableHead>
                <TableHead>Assessments</TableHead>
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
                  <TableCell className="text-gray-600">{org.description || 'No description'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {org.assigned_learning_paths?.length || 0} paths
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {org.assigned_assessments_code?.length || 0} assessments
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(org)}
                        className="text-blue-600 hover:text-blue-700"
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
              {organizations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No organizations found. Create your first organization to get started.
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

export default OrganizationManager;
