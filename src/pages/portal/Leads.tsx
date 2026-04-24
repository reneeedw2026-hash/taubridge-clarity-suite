import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Eye,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  Archive,
} from "lucide-react";

type SubmissionStatus = "new" | "contacted" | "scheduled" | "completed" | "archived";

interface QuestionnaireSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string;
  business_description: string | null;
  accounting_tool: string | null;
  payroll_tool: string | null;
  other_tools: string | null;
  pain_points: string[];
  pain_points_other: string | null;
  recent_issues: string[];
  recent_issues_details: string | null;
  goals: string | null;
  bookkeeping_responsible: string | null;
  financial_decision_maker: string | null;
  has_outside_advisor: string | null;
  reporting_frequency: string | null;
  reporting_frustrations: string | null;
  readiness_level: string | null;
  anything_else: string | null;
  status: SubmissionStatus;
}

const painPointLabels: Record<string, string> = {
  "cash-flow": "No clear picture of profit/cash flow",
  "payroll-costs": "Payroll costs unpredictable",
  "tax-compliance": "Worried about tax compliance",
  "report-confusion": "Reports exist but unclear",
  "time-drain": "Too much time on finance",
  "other-pain": "Other",
};

const recentIssueLabels: Record<string, string> = {
  "late-filings": "Late/amended filings",
  "irs-notices": "IRS/state notices",
  "missed-payments": "Missed payments",
  "payroll-difficulty": "Difficulty making payroll",
  "year-end-surprises": "Year-end surprises",
  "none": "None",
  "other-issue": "Other",
};

const readinessLabels: Record<string, string> = {
  active: "Active (1-3 months)",
  exploring: "Exploring",
  gathering: "Gathering info",
};

const statusConfig: Record<SubmissionStatus, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: Clock },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800", icon: Phone },
  scheduled: { label: "Scheduled", color: "bg-purple-100 text-purple-800", icon: Calendar },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600", icon: Archive },
};

export default function Leads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<QuestionnaireSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");

  const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ["questionnaire-submissions", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("questionnaire_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as QuestionnaireSubmission[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubmissionStatus }) => {
      const { error } = await supabase
        .from("questionnaire_submissions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaire-submissions"] });
      toast({ title: "Status updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stats = {
    total: submissions?.length || 0,
    new: submissions?.filter((s) => s.status === "new").length || 0,
    contacted: submissions?.filter((s) => s.status === "contacted").length || 0,
    scheduled: submissions?.filter((s) => s.status === "scheduled").length || 0,
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lead Management</h1>
            <p className="text-muted-foreground">
              View and manage pre-call questionnaire submissions
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                New
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-500" />
                Contacted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Filter by status:</span>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as SubmissionStatus | "all")}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : submissions?.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No submissions found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Readiness</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.name}</p>
                          <p className="text-sm text-muted-foreground">{submission.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{submission.company_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {readinessLabels[submission.readiness_level || ""] || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={submission.status}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({
                              id: submission.id,
                              status: value as SubmissionStatus,
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={statusConfig[submission.status].color}>
                              {statusConfig[submission.status].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {format(new Date(submission.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {selectedSubmission.company_name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="grid gap-2">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {selectedSubmission.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </p>
                    {selectedSubmission.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">
                          {selectedSubmission.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Business Description */}
                {selectedSubmission.business_description && (
                  <div>
                    <h3 className="font-semibold mb-2">About the Business</h3>
                    <p className="text-muted-foreground">{selectedSubmission.business_description}</p>
                  </div>
                )}

                {/* Tools */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Accounting Tool</h3>
                    <p className="text-muted-foreground">{selectedSubmission.accounting_tool || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Payroll Tool</h3>
                    <p className="text-muted-foreground">{selectedSubmission.payroll_tool || "Not specified"}</p>
                  </div>
                </div>

                {/* Pain Points */}
                {selectedSubmission.pain_points?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Pain Points</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.pain_points.map((point) => (
                        <Badge key={point} variant="secondary">
                          {painPointLabels[point] || point}
                        </Badge>
                      ))}
                    </div>
                    {selectedSubmission.pain_points_other && (
                      <p className="text-muted-foreground mt-2">
                        Other: {selectedSubmission.pain_points_other}
                      </p>
                    )}
                  </div>
                )}

                {/* Recent Issues */}
                {selectedSubmission.recent_issues?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Recent Issues</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.recent_issues.map((issue) => (
                        <Badge key={issue} variant="outline">
                          {recentIssueLabels[issue] || issue}
                        </Badge>
                      ))}
                    </div>
                    {selectedSubmission.recent_issues_details && (
                      <p className="text-muted-foreground mt-2">
                        Details: {selectedSubmission.recent_issues_details}
                      </p>
                    )}
                  </div>
                )}

                {/* Goals */}
                {selectedSubmission.goals && (
                  <div>
                    <h3 className="font-semibold mb-2">Goals & Priorities</h3>
                    <p className="text-muted-foreground">{selectedSubmission.goals}</p>
                  </div>
                )}

                {/* Decision Making */}
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedSubmission.bookkeeping_responsible && (
                    <div>
                      <h3 className="font-semibold mb-2">Bookkeeping Responsible</h3>
                      <p className="text-muted-foreground">{selectedSubmission.bookkeeping_responsible}</p>
                    </div>
                  )}
                  {selectedSubmission.financial_decision_maker && (
                    <div>
                      <h3 className="font-semibold mb-2">Financial Decision Maker</h3>
                      <p className="text-muted-foreground">{selectedSubmission.financial_decision_maker}</p>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                {selectedSubmission.anything_else && (
                  <div>
                    <h3 className="font-semibold mb-2">Additional Notes</h3>
                    <p className="text-muted-foreground">{selectedSubmission.anything_else}</p>
                  </div>
                )}

                {/* Submission Info */}
                <div className="border-t pt-4 text-sm text-muted-foreground">
                  <p>
                    Submitted: {format(new Date(selectedSubmission.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p>Readiness: {readinessLabels[selectedSubmission.readiness_level || ""] || "Not specified"}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
