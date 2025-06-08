
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, BookOpen, Users, Play, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LearningPath {
  id: number;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  modules: number;
  enrolledOrgs: string[];
  status: "draft" | "published";
  category: string;
}

const LearningPathManager = () => {
  const { toast } = useToast();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: 1,
      title: "React Fundamentals",
      description: "Master the basics of React development",
      difficulty: "beginner",
      duration: "8 weeks",
      modules: 12,
      enrolledOrgs: ["TechCorp Inc.", "EduSoft Solutions"],
      status: "published",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Deep dive into modern JavaScript concepts",
      difficulty: "advanced",
      duration: "10 weeks",
      modules: 15,
      enrolledOrgs: ["TechCorp Inc."],
      status: "published",
      category: "Programming"
    },
    {
      id: 3,
      title: "Data Science Basics",
      description: "Introduction to data analysis and visualization",
      difficulty: "intermediate",
      duration: "12 weeks",
      modules: 18,
      enrolledOrgs: ["DataScience Pro"],
      status: "draft",
      category: "Data Science"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [assigningPath, setAssigningPath] = useState<LearningPath | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    duration: "",
    modules: 0,
    category: "",
    status: "draft" as "draft" | "published"
  });

  const organizations = ["TechCorp Inc.", "EduSoft Solutions", "DataScience Pro"];
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPath) {
      setLearningPaths(paths =>
        paths.map(path =>
          path.id === editingPath.id
            ? { ...path, ...formData }
            : path
        )
      );
      toast({
        title: "Learning path updated",
        description: "The learning path has been successfully updated.",
      });
    } else {
      const newPath: LearningPath = {
        id: Date.now(),
        ...formData,
        enrolledOrgs: []
      };
      setLearningPaths(paths => [...paths, newPath]);
      toast({
        title: "Learning path created",
        description: "The new learning path has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingPath(null);
    setFormData({ title: "", description: "", difficulty: "beginner", duration: "", modules: 0, category: "", status: "draft" });
  };

  const handleAssign = () => {
    if (assigningPath && selectedOrgs.length > 0) {
      setLearningPaths(paths =>
        paths.map(path =>
          path.id === assigningPath.id
            ? { ...path, enrolledOrgs: [...new Set([...path.enrolledOrgs, ...selectedOrgs])] }
            : path
        )
      );
      toast({
        title: "Learning path assigned",
        description: `Learning path assigned to ${selectedOrgs.length} organization(s).`,
      });
      setIsAssignDialogOpen(false);
      setAssigningPath(null);
      setSelectedOrgs([]);
    }
  };

  const handleEdit = (path: LearningPath) => {
    setEditingPath(path);
    setFormData({
      title: path.title,
      description: path.description,
      difficulty: path.difficulty,
      duration: path.duration,
      modules: path.modules,
      category: path.category,
      status: path.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this learning path?")) {
      setLearningPaths(paths => paths.filter(path => path.id !== id));
      toast({
        title: "Learning path deleted",
        description: "The learning path has been successfully deleted.",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setEditingPath(null);
    setFormData({ title: "", description: "", difficulty: "beginner", duration: "", modules: 0, category: "", status: "draft" });
    setIsDialogOpen(true);
  };

  const handleAssignToOrgs = (path: LearningPath) => {
    setAssigningPath(path);
    setSelectedOrgs([]);
    setIsAssignDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Path Management</h2>
          <p className="text-gray-600">Create and manage learning paths for organizations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Learning Path</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPath ? "Edit Learning Path" : "Create New Learning Path"}
              </DialogTitle>
              <DialogDescription>
                {editingPath ? "Update the learning path details" : "Create a comprehensive learning path"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter learning path title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: "beginner" | "intermediate" | "advanced") => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 8 weeks"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modules">Modules</Label>
                  <Input
                    id="modules"
                    type="number"
                    value={formData.modules}
                    onChange={(e) => setFormData({ ...formData, modules: parseInt(e.target.value) || 0 })}
                    placeholder="Number of modules"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPath ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Paths</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningPaths.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Play className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningPaths.filter(path => path.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <Target className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningPaths.reduce((sum, path) => sum + path.modules, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Organizations</CardTitle>
            <Users className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(learningPaths.flatMap(path => path.enrolledOrgs)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Paths</CardTitle>
          <CardDescription>Manage learning paths and assign them to organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learning Path</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Organizations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learningPaths.map((path) => (
                <TableRow key={path.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{path.title}</div>
                        <div className="text-sm text-gray-500">{path.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      path.difficulty === "beginner" ? "default" :
                      path.difficulty === "intermediate" ? "secondary" : "destructive"
                    }>
                      {path.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{path.duration}</TableCell>
                  <TableCell>{path.modules}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {path.enrolledOrgs.slice(0, 2).map((org, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {org}
                        </Badge>
                      ))}
                      {path.enrolledOrgs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{path.enrolledOrgs.length - 2}
                        </Badge>
                      )}
                      {path.enrolledOrgs.length === 0 && (
                        <span className="text-gray-400 text-sm">Not assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={path.status === "published" ? "default" : "secondary"}>
                      {path.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignToOrgs(path)}
                      >
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(path)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(path.id)}
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

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Learning Path</DialogTitle>
            <DialogDescription>
              Select organizations to assign "{assigningPath?.title}" to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {organizations.map((org) => (
              <div key={org} className="flex items-center space-x-2">
                <Checkbox
                  id={org}
                  checked={selectedOrgs.includes(org)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOrgs([...selectedOrgs, org]);
                    } else {
                      setSelectedOrgs(selectedOrgs.filter(o => o !== org));
                    }
                  }}
                />
                <Label htmlFor={org} className="text-sm font-medium">
                  {org}
                </Label>
                {assigningPath?.enrolledOrgs.includes(org) && (
                  <Badge variant="outline" className="text-xs">Already assigned</Badge>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={selectedOrgs.length === 0}>
              Assign ({selectedOrgs.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningPathManager;
