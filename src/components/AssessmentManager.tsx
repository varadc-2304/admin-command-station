
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
import { Plus, Edit, Trash2, ClipboardList, Timer, Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: number;
  title: string;
  description: string;
  type: "quiz" | "assignment" | "project";
  duration: number; // in minutes
  questions: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  assignedOrgs: string[];
  status: "draft" | "published";
  passingScore: number;
}

const AssessmentManager = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: 1,
      title: "React Basics Quiz",
      description: "Test your understanding of React fundamentals",
      type: "quiz",
      duration: 30,
      questions: 20,
      difficulty: "beginner",
      category: "Web Development",
      assignedOrgs: ["TechCorp Inc.", "EduSoft Solutions"],
      status: "published",
      passingScore: 70
    },
    {
      id: 2,
      title: "JavaScript Advanced Project",
      description: "Build a complex application using advanced JavaScript",
      type: "project",
      duration: 480, // 8 hours
      questions: 1,
      difficulty: "advanced",
      category: "Programming",
      assignedOrgs: ["TechCorp Inc."],
      status: "published",
      passingScore: 80
    },
    {
      id: 3,
      title: "Data Analysis Assignment",
      description: "Analyze a dataset and present findings",
      type: "assignment",
      duration: 120,
      questions: 5,
      difficulty: "intermediate",
      category: "Data Science",
      assignedOrgs: [],
      status: "draft",
      passingScore: 75
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [assigningAssessment, setAssigningAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "quiz" as "quiz" | "assignment" | "project",
    duration: 30,
    questions: 10,
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    category: "",
    status: "draft" as "draft" | "published",
    passingScore: 70
  });

  const organizations = ["TechCorp Inc.", "EduSoft Solutions", "DataScience Pro"];
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssessment) {
      setAssessments(assessments =>
        assessments.map(assessment =>
          assessment.id === editingAssessment.id
            ? { ...assessment, ...formData }
            : assessment
        )
      );
      toast({
        title: "Assessment updated",
        description: "The assessment has been successfully updated.",
      });
    } else {
      const newAssessment: Assessment = {
        id: Date.now(),
        ...formData,
        assignedOrgs: []
      };
      setAssessments(assessments => [...assessments, newAssessment]);
      toast({
        title: "Assessment created",
        description: "The new assessment has been successfully created.",
      });
    }
    setIsDialogOpen(false);
    setEditingAssessment(null);
    setFormData({ title: "", description: "", type: "quiz", duration: 30, questions: 10, difficulty: "beginner", category: "", status: "draft", passingScore: 70 });
  };

  const handleAssign = () => {
    if (assigningAssessment && selectedOrgs.length > 0) {
      setAssessments(assessments =>
        assessments.map(assessment =>
          assessment.id === assigningAssessment.id
            ? { ...assessment, assignedOrgs: [...new Set([...assessment.assignedOrgs, ...selectedOrgs])] }
            : assessment
        )
      );
      toast({
        title: "Assessment assigned",
        description: `Assessment assigned to ${selectedOrgs.length} organization(s).`,
      });
      setIsAssignDialogOpen(false);
      setAssigningAssessment(null);
      setSelectedOrgs([]);
    }
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title,
      description: assessment.description,
      type: assessment.type,
      duration: assessment.duration,
      questions: assessment.questions,
      difficulty: assessment.difficulty,
      category: assessment.category,
      status: assessment.status,
      passingScore: assessment.passingScore
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      setAssessments(assessments => assessments.filter(assessment => assessment.id !== id));
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setEditingAssessment(null);
    setFormData({ title: "", description: "", type: "quiz", duration: 30, questions: 10, difficulty: "beginner", category: "", status: "draft", passingScore: 70 });
    setIsDialogOpen(true);
  };

  const handleAssignToOrgs = (assessment: Assessment) => {
    setAssigningAssessment(assessment);
    setSelectedOrgs([]);
    setIsAssignDialogOpen(true);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assessment Management</h2>
          <p className="text-gray-600">Create and manage assessments for organizations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Assessment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAssessment ? "Edit Assessment" : "Create New Assessment"}
              </DialogTitle>
              <DialogDescription>
                {editingAssessment ? "Update the assessment details" : "Create a comprehensive assessment"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter assessment title"
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
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: "quiz" | "assignment" | "project") => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                    placeholder="Duration in minutes"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questions">Questions/Tasks</Label>
                  <Input
                    id="questions"
                    type="number"
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: parseInt(e.target.value) || 10 })}
                    placeholder="Number of questions"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 70 })}
                    placeholder="Passing score"
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
                  {editingAssessment ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Target className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter(assessment => assessment.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <ClipboardList className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.reduce((sum, assessment) => sum + assessment.questions, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Organizations</CardTitle>
            <Users className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(assessments.flatMap(assessment => assessment.assignedOrgs)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
          <CardDescription>Manage assessments and assign them to organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Organizations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{assessment.title}</div>
                        <div className="text-sm text-gray-500">{assessment.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {assessment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      assessment.difficulty === "beginner" ? "default" :
                      assessment.difficulty === "intermediate" ? "secondary" : "destructive"
                    }>
                      {assessment.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Timer className="w-3 h-3 text-gray-500" />
                      <span>{formatDuration(assessment.duration)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{assessment.questions}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {assessment.assignedOrgs.slice(0, 2).map((org, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {org}
                        </Badge>
                      ))}
                      {assessment.assignedOrgs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{assessment.assignedOrgs.length - 2}
                        </Badge>
                      )}
                      {assessment.assignedOrgs.length === 0 && (
                        <span className="text-gray-400 text-sm">Not assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={assessment.status === "published" ? "default" : "secondary"}>
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignToOrgs(assessment)}
                      >
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(assessment)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(assessment.id)}
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
            <DialogTitle>Assign Assessment</DialogTitle>
            <DialogDescription>
              Select organizations to assign "{assigningAssessment?.title}" to
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
                {assigningAssessment?.assignedOrgs.includes(org) && (
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

export default AssessmentManager;
