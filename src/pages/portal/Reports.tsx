import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  Calendar,
  FileSpreadsheet,
  Users,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  Loader2,
  Printer,
} from 'lucide-react';

const reportTypes = [
  {
    id: 'cfo-brief',
    title: 'CFO Brief',
    description: '2-page executive summary with health score, KPIs, and recommendations',
    icon: FileText,
    format: 'PDF',
    lastGenerated: 'Feb 7, 2026',
  },
  {
    id: 'ceo-summary',
    title: 'CEO Summary',
    description: '1-page high-level overview for executive review',
    icon: BarChart3,
    format: 'PDF',
    lastGenerated: 'Feb 7, 2026',
  },
  {
    id: 'operations-pack',
    title: 'Operations Pack',
    description: 'Detailed operations metrics including labor and expense breakdown',
    icon: Users,
    format: 'PDF',
    lastGenerated: 'Feb 1, 2026',
  },
  {
    id: 'action-plan-pdf',
    title: 'Action Plan Report',
    description: 'Current action items with status, owners, and impact tracking',
    icon: Target,
    format: 'PDF',
    lastGenerated: 'Feb 7, 2026',
  },
  {
    id: 'custom-export',
    title: 'Custom Data Export',
    description: 'Export raw data for your own analysis',
    icon: FileSpreadsheet,
    format: 'CSV/Excel',
    lastGenerated: 'Jan 28, 2026',
  },
];

const recentReports = [
  { name: 'CFO Brief - Q1 2026', date: 'Feb 7, 2026', type: 'PDF' },
  { name: 'CEO Summary - Q1 2026', date: 'Feb 7, 2026', type: 'PDF' },
  { name: 'Action Plan - Week 6', date: 'Feb 7, 2026', type: 'PDF' },
  { name: 'Operations Pack - Jan 2026', date: 'Feb 1, 2026', type: 'PDF' },
  { name: 'GL Data Export', date: 'Jan 28, 2026', type: 'Excel' },
];

export default function Reports() {
  const { toast } = useToast();
  const [meetingPackOpen, setMeetingPackOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [selectedReports, setSelectedReports] = useState<string[]>([
    'cfo-brief',
    'ceo-summary',
    'action-plan-pdf',
  ]);

  const handleGenerateReport = async (reportId: string, reportTitle: string) => {
    setGeneratingReport(reportId);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setGeneratingReport(null);
    toast({
      title: 'Report Generated',
      description: `${reportTitle} has been generated and is ready for download.`,
    });
  };

  const handleDownloadReport = (reportName: string, format: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading ${reportName} as ${format}...`,
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: 'Download Complete',
        description: `${reportName} has been downloaded successfully.`,
      });
    }, 1000);
  };

  const handlePrepareMeetingPack = async () => {
    if (selectedReports.length === 0) {
      toast({
        title: 'No Reports Selected',
        description: 'Please select at least one report to include in the meeting pack.',
        variant: 'destructive',
      });
      return;
    }
    setMeetingPackOpen(false);
    setGeneratingReport('meeting-pack');
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGeneratingReport(null);
    toast({
      title: 'Meeting Pack Ready',
      description: `Your meeting pack with ${selectedReports.length} reports has been prepared and downloaded.`,
    });
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports & Meeting Packs</h1>
            <p className="text-muted-foreground">Generate and download your financial reports</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        {/* Next Call Info */}
        <Card className="bg-gradient-to-r from-primary to-navy-light text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gold/20">
                  <Calendar className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold">Next CFO Call</h3>
                  <p className="text-primary-foreground/80">February 14, 2026 at 2:00 PM EST</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last report: Feb 7, 2026</span>
                </div>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setMeetingPackOpen(true)}
                  disabled={generatingReport === 'meeting-pack'}
                >
                  {generatingReport === 'meeting-pack' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    'Prepare Meeting Pack'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover:border-gold transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gold/10 text-gold">
                    <report.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateReport(report.id, report.title)}
                        disabled={generatingReport === report.id}
                      >
                        {generatingReport === report.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-1" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {report.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadReport(report.name, report.type)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meeting Pack Dialog */}
      <Dialog open={meetingPackOpen} onOpenChange={setMeetingPackOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prepare Meeting Pack</DialogTitle>
            <DialogDescription>
              Select the reports to include in your meeting pack for the February 14, 2026 CFO
              call.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {reportTypes
              .filter((r) => r.format === 'PDF')
              .map((report) => (
                <div key={report.id} className="flex items-start gap-3">
                  <Checkbox
                    id={report.id}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => toggleReportSelection(report.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={report.id} className="font-medium cursor-pointer">
                      {report.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMeetingPackOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handlePrepareMeetingPack}>
                <Download className="h-4 w-4 mr-1" />
                Generate Pack
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
