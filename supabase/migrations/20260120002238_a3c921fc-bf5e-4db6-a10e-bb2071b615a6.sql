-- Add columns to track individual onboarding step completion
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_company_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_gl_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_payroll_completed boolean DEFAULT false;