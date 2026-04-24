-- Create questionnaire_submissions table
CREATE TABLE public.questionnaire_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  
  -- Business info
  business_description TEXT,
  accounting_tool TEXT,
  payroll_tool TEXT,
  other_tools TEXT,
  
  -- Pain points & issues
  pain_points TEXT[] DEFAULT '{}',
  pain_points_other TEXT,
  recent_issues TEXT[] DEFAULT '{}',
  recent_issues_details TEXT,
  
  -- Goals & decision making
  goals TEXT,
  bookkeeping_responsible TEXT,
  financial_decision_maker TEXT,
  has_outside_advisor TEXT,
  
  -- Reporting
  reporting_frequency TEXT,
  reporting_frustrations TEXT,
  
  -- Readiness
  readiness_level TEXT,
  anything_else TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'archived'))
);

-- Enable RLS
ALTER TABLE public.questionnaire_submissions ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admin/staff) can view submissions
CREATE POLICY "Authenticated users can view submissions"
  ON public.questionnaire_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can update status
CREATE POLICY "Authenticated users can update submissions"
  ON public.questionnaire_submissions
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow edge function to insert (service role bypasses RLS, but adding for clarity)
CREATE POLICY "Allow insert from edge functions"
  ON public.questionnaire_submissions
  FOR INSERT
  WITH CHECK (true);