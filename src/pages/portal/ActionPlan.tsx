import { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Calendar,
  User,
  DollarSign,
  BarChart2,
  Link2,
} from 'lucide-react';

interface Action {
  id: number | string;
  title: string;
  owner: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  source?: 'manual' | 'benchmarking' | 'cfo-analysis' | 'variance';
  sourceArea?: string;
  notes?: string;
}

const initialActions: Action[] = [
  {
    id: 1,
    title: 'Reduce overtime hours by 15%',
    owner: 'HR Director',
    dueDate: 'Feb 15, 2026',
    status: 'in-progress',
    progress: 70,
    impact: '$28k/mo savings',
    priority: 'high',
    source: 'manual',
  },
  {
    id: 2,
    title: 'Review and consolidate software vendors',
    owner: 'CMO',
    dueDate: 'Feb 1, 2026',
    status: 'not-started',
    progress: 0,
    impact: '$4.2k/mo savings',
    priority: 'medium',
    source: 'manual',
  },
  {
    id: 3,
    title: 'Implement pricing test on Tier 2 products',
    owner: 'CEO',
    dueDate: 'Mar 1, 2026',
    status: 'not-started',
    progress: 0,
    impact: '$45k potential revenue',
    priority: 'high',
    source: 'cfo-analysis',
    sourceArea: 'Revenue Optimization',
  },
  {
    id: 4,
    title: 'Pause low-ROI marketing campaigns',
    owner: 'Marketing Lead',
    dueDate: 'Jan 25, 2026',
    status: 'completed',
    progress: 100,
    impact: '3% margin lift',
    priority: 'medium',
    source: 'manual',
  },
  {
    id: 5,
    title: 'Renegotiate office lease terms',
    owner: 'Operations',
    dueDate: 'Mar 15, 2026',
    status: 'not-started',
    progress: 0,
    impact: '$8k/mo savings',
    priority: 'low',
    source: 'variance',
    sourceArea: 'Facilities Budget',
  },
];

const statusConfig = {
  'not-started': { label: 'Not Started', color: 'bg-muted text-muted-foreground', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-gold/10 text-gold border-gold/30', icon: Target },
  'completed': { label: 'Completed', color: 'bg-sage/10 text-sage border-sage/30', icon: CheckCircle },
  'blocked': { label: 'Blocked', color: 'bg-destructive/10 text-destructive border-destructive/30', icon: AlertCircle },
};

const sourceConfig = {
  'manual': { label: 'Manual', color: 'bg-muted text-muted-foreground', icon: Plus },
  'benchmarking': { label: 'Benchmarking', color: 'bg-cyan-100 text-cyan-700', icon: BarChart2 },
  'cfo-analysis': { label: 'CFO Analysis', color: 'bg-primary/10 text-primary', icon: TrendingUp },
  'variance': { label: 'Variance', color: 'bg-amber-100 text-amber-700', icon: Link2 },
};

export default function ActionPlan() {
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [selectedPeriod, setSelectedPeriod] = useState('q1-2026');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterSource, setFilterSource] = useState<string>('all');

  // Load actions from benchmarking (stored in localStorage)
  useEffect(() => {
    const pendingActions = JSON.parse(localStorage.getItem('pendingBenchmarkActions') || '[]');
    if (pendingActions.length > 0) {
      const formattedActions: Action[] = pendingActions.map((action: any) => ({
        id: action.id,
        title: action.title,
        owner: action.owner,
        dueDate: new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'not-started' as const,
        progress: 0,
        impact: action.impact,
        priority: action.priority,
        source: action.source || 'benchmarking',
        sourceArea: action.sourceArea,
        notes: action.notes,
      }));
      
      // Add new actions that don't already exist
      setActions(prev => {
        const existingIds = new Set(prev.map(a => String(a.id)));
        const newActions = formattedActions.filter((a: Action) => !existingIds.has(String(a.id)));
        return [...prev, ...newActions];
      });
    }
  }, []);

  const completedCount = actions.filter(a => a.status === 'completed').length;
  const totalCount = actions.length;
  const progressPercent = (completedCount / totalCount) * 100;

  const benchmarkingCount = actions.filter(a => a.source === 'benchmarking').length;
  const cfoAnalysisCount = actions.filter(a => a.source === 'cfo-analysis').length;

  const filteredActions = filterSource === 'all' 
    ? actions 
    : actions.filter(a => a.source === filterSource);

  const totalAnnualImpact = '$187k'; // Mock calculation

  const handleStatusChange = (id: number | string, newStatus: Action['status']) => {
    setActions(prev =>
      prev.map(action =>
        action.id === id
          ? { ...action, status: newStatus, progress: newStatus === 'completed' ? 100 : action.progress }
          : action
      )
    );
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Action Plan</h1>
            <p className="text-muted-foreground">Track and manage your priority actions</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2026">Q1 2026</SelectItem>
                <SelectItem value="q4-2025">Q4 2025</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
              Demo Mode
            </Badge>
          </div>
        </div>

        {/* Progress Summary */}
        <Card className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Q1 2026 Priority Actions</h3>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-gold">{completedCount}/{totalCount}</span>
                  <span className="text-primary-foreground/70">actions complete</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-navy-light" />
                {/* Source breakdown */}
                <div className="flex items-center gap-4 mt-3 text-sm text-primary-foreground/70">
                  {benchmarkingCount > 0 && (
                    <span className="flex items-center gap-1">
                      <BarChart2 className="h-3 w-3" />
                      {benchmarkingCount} from Benchmarking
                    </span>
                  )}
                  {cfoAnalysisCount > 0 && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {cfoAnalysisCount} from CFO Analysis
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-primary-foreground/70 mb-1">Est. Annual Impact</div>
                <div className="text-2xl font-bold text-sage">{totalAnnualImpact}</div>
                <div className="flex items-center gap-1 text-sm text-primary-foreground/70 justify-center md:justify-end">
                  <TrendingUp className="h-4 w-4" />
                  savings identified
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg">Priority Actions</CardTitle>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-36 h-8">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="benchmarking">Benchmarking</SelectItem>
                  <SelectItem value="cfo-analysis">CFO Analysis</SelectItem>
                  <SelectItem value="variance">Variance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Action</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Action Title</Label>
                    <Input placeholder="e.g., Reduce software costs by 20%" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Owner</Label>
                      <Input placeholder="e.g., CFO" />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <Label>Expected Impact</Label>
                    <Input placeholder="e.g., $10k/mo savings" />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional context or details..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button variant="gold" onClick={() => setIsDialogOpen(false)}>Add Action</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActions.map((action) => {
                const StatusIcon = statusConfig[action.status].icon;
                const sourceInfo = action.source ? sourceConfig[action.source] : null;
                const SourceIcon = sourceInfo?.icon;
                return (
                  <div
                    key={action.id}
                    className={`p-4 rounded-lg border ${
                      action.status === 'completed'
                        ? 'bg-sage/5 border-sage/20'
                        : action.priority === 'high'
                        ? 'border-destructive/20'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`font-semibold ${action.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {action.title}
                          </h4>
                          <Badge
                            variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {action.priority.toUpperCase()}
                          </Badge>
                          {sourceInfo && SourceIcon && (
                            <Badge variant="outline" className={`text-xs ${sourceInfo.color}`}>
                              <SourceIcon className="h-3 w-3 mr-1" />
                              {sourceInfo.label}
                              {action.sourceArea && `: ${action.sourceArea}`}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {action.owner}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {action.dueDate}
                          </span>
                          <span className="flex items-center gap-1 text-sage font-medium">
                            <DollarSign className="h-3 w-3" />
                            {action.impact}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {action.status === 'in-progress' && (
                          <div className="text-center">
                            <div className="text-sm font-medium">{action.progress}%</div>
                            <Progress value={action.progress} className="w-20 h-1" />
                          </div>
                        )}

                        <Select
                          value={action.status}
                          onValueChange={(value) => handleStatusChange(action.id, value as Action['status'])}
                        >
                          <SelectTrigger className="w-36">
                            <Badge variant="outline" className={statusConfig[action.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[action.status].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <config.icon className="h-4 w-4" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
