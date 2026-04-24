// Shared mock company data used across the portal
// In production, this would come from the database

export const mockCompanyData = {
  companyName: 'Acme Corporation',
  ein: '12-3456789',
  address: '123 Business Park Drive',
  city: 'Atlanta',
  state: 'GA',
  zip: '30301',
  contactName: 'John Smith',
  contactEmail: 'john.smith@acmecorp.com',
  contactPhone: '(404) 555-1234',
  accountNumber: 'TB-CFO-2026-00142',
  subscriptionTier: 'professional',
  subscriptionStatus: 'active',
  subscriptionStartDate: '2025-06-15',
  nextBillingDate: '2026-02-15',
  monthlyRate: 499,
};

export const subscriptionTiers = {
  essentials: {
    name: 'Essentials',
    description: 'Basic CFO analysis and reporting',
    features: ['Monthly financial reports', 'Basic KPI tracking', 'Email support'],
    price: 199,
  },
  professional: {
    name: 'Professional',
    description: 'Complete CFO suite with advanced features',
    features: ['Weekly analysis', 'Advanced KPI dashboard', 'Custom reports', 'Priority support', 'Payroll tax filing'],
    price: 499,
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Full-service virtual CFO partnership',
    features: ['Daily monitoring', 'Dedicated CFO advisor', 'Board-ready reports', 'Strategic planning', 'Unlimited support'],
    price: 999,
  },
};
