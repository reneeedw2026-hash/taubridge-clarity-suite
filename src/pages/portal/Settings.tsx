import { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockCompanyData, subscriptionTiers } from '@/data/mockCompanyData';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  Crown,
  Calendar,
  Hash,
  Pencil,
  Save,
  ArrowUp,
  Sparkles,
  Package,
  Loader2,
} from 'lucide-react';

// Add-on packs available for subscription
const addonPacks = {
  payrollTax: {
    id: 'payrollTax',
    name: 'Payroll Tax Pro',
    description: 'Complete payroll tax filing and compliance',
    price: 149,
    features: ['Quarterly tax filings', 'W-2 & 1099 processing', 'Tax compliance monitoring'],
  },
  cashFlow: {
    id: 'cashFlow',
    name: 'Cash Flow Optimizer',
    description: 'Advanced cash flow forecasting and optimization',
    price: 99,
    features: ['13-week cash forecast', 'Scenario planning', 'Working capital analysis'],
  },
  benchmark: {
    id: 'benchmark',
    name: 'Industry Benchmarking',
    description: 'Compare your metrics against industry peers',
    price: 79,
    features: ['Peer comparison reports', 'Industry KPIs', 'Competitive insights'],
  },
  boardReports: {
    id: 'boardReports',
    name: 'Board Ready Reports',
    description: 'Professional board presentation materials',
    price: 129,
    features: ['Executive summaries', 'Investor-ready decks', 'Board meeting prep'],
  },
  budgetPlanning: {
    id: 'budgetPlanning',
    name: 'Budget & Planning',
    description: 'Comprehensive budgeting and strategic planning suite',
    price: 199,
    features: ['Annual budget build', 'Reforecasting', 'Variance analysis with action items', 'Capital funding support'],
  },
};

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

// LocalStorage keys for persistence
const SUBSCRIPTION_TIER_KEY = 'taubridge_subscription_tier';
const ACTIVE_ADDONS_KEY = 'taubridge_active_addons';

export default function Settings() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  
  // Initialize from localStorage or fall back to mock data
  const [currentSubscriptionTier, setCurrentSubscriptionTier] = useState(() => {
    const saved = localStorage.getItem(SUBSCRIPTION_TIER_KEY);
    return saved || mockCompanyData.subscriptionTier;
  });
  const [activeAddons, setActiveAddons] = useState<string[]>(() => {
    const saved = localStorage.getItem(ACTIVE_ADDONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedTier, setSelectedTier] = useState(currentSubscriptionTier);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([...activeAddons]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Persist subscription changes to localStorage
  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_TIER_KEY, currentSubscriptionTier);
  }, [currentSubscriptionTier]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_ADDONS_KEY, JSON.stringify(activeAddons));
  }, [activeAddons]);

  // Form state
  const [companyName, setCompanyName] = useState(mockCompanyData.companyName);
  const [ein, setEin] = useState(mockCompanyData.ein);
  const [address, setAddress] = useState(mockCompanyData.address);
  const [city, setCity] = useState(mockCompanyData.city);
  const [state, setState] = useState(mockCompanyData.state);
  const [zip, setZip] = useState(mockCompanyData.zip);
  const [contactName, setContactName] = useState(mockCompanyData.contactName);
  const [contactEmail, setContactEmail] = useState(mockCompanyData.contactEmail);
  const [contactPhone, setContactPhone] = useState(mockCompanyData.contactPhone);

  const currentTier = subscriptionTiers[currentSubscriptionTier as keyof typeof subscriptionTiers];
  
  const calculateCurrentMonthlyRate = () => {
    const tierPrice = currentTier?.price || 0;
    const addonsTotal = activeAddons.reduce((sum, addonId) => {
      return sum + (addonPacks[addonId as keyof typeof addonPacks]?.price || 0);
    }, 0);
    return tierPrice + addonsTotal;
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateNewTotal = () => {
    const tierPrice = subscriptionTiers[selectedTier as keyof typeof subscriptionTiers]?.price || 0;
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      return sum + (addonPacks[addonId as keyof typeof addonPacks]?.price || 0);
    }, 0);
    return tierPrice + addonsTotal;
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Persist the changes
    setCurrentSubscriptionTier(selectedTier);
    setActiveAddons(selectedAddons);
    
    setIsUpgrading(false);
    setSubscriptionDialogOpen(false);
    
    const tierName = subscriptionTiers[selectedTier as keyof typeof subscriptionTiers]?.name;
    const addonNames = selectedAddons.map(id => addonPacks[id as keyof typeof addonPacks]?.name).filter(Boolean);
    
    toast({
      title: "Subscription Updated!",
      description: `Your plan has been updated to ${tierName}${addonNames.length > 0 ? ` with ${addonNames.join(', ')}` : ''}.`,
    });
  };

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast({
      title: "Settings Saved",
      description: "Your company information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    // Reset to original values
    setCompanyName(mockCompanyData.companyName);
    setEin(mockCompanyData.ein);
    setAddress(mockCompanyData.address);
    setCity(mockCompanyData.city);
    setState(mockCompanyData.state);
    setZip(mockCompanyData.zip);
    setContactName(mockCompanyData.contactName);
    setContactEmail(mockCompanyData.contactEmail);
    setContactPhone(mockCompanyData.contactPhone);
    setIsEditing(false);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gold" />
              Company Settings
            </h1>
            <p className="text-muted-foreground">Manage your company registration and subscription</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Company Registration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gold" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Your registered business details
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="gold" size="sm" onClick={handleSave} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Business Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      {isEditing ? (
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter company name"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{companyName}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
                      {isEditing ? (
                        <Input
                          id="ein"
                          value={ein}
                          onChange={(e) => setEin(formatEIN(e.target.value))}
                          placeholder="XX-XXXXXXX"
                          maxLength={10}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span>{ein}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Business Address
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter street address"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{address}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                          />
                        ) : (
                          <div className="p-3 rounded-md bg-muted/50">
                            <span>{city}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {isEditing ? (
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {US_STATES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-3 rounded-md bg-muted/50">
                            <span>{US_STATES.find(s => s.value === state)?.label || state}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        {isEditing ? (
                          <Input
                            id="zip"
                            value={zip}
                            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            placeholder="XXXXX"
                            maxLength={5}
                          />
                        ) : (
                          <div className="p-3 rounded-md bg-muted/50">
                            <span>{zip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Primary Contact
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      {isEditing ? (
                        <Input
                          id="contactName"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Full name"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{contactName}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      {isEditing ? (
                        <Input
                          id="contactEmail"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="email@company.com"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{contactEmail}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="contactPhone"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(formatPhone(e.target.value))}
                          placeholder="(XXX) XXX-XXXX"
                          maxLength={14}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account & Subscription Sidebar */}
          <div className="space-y-6">
            {/* Account Number */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gold" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                    CFO Account Number
                  </Label>
                  <div className="p-3 rounded-lg bg-gold/10 border border-gold/30">
                    <span className="font-mono font-semibold text-gold">
                      {mockCompanyData.accountNumber}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                    Account Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sage text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Since {new Date(mockCompanyData.subscriptionStartDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="h-5 w-5 text-gold" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">{currentTier.name}</span>
                    <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
                      Current Plan
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentTier.description}
                  </p>
                  <div className="text-2xl font-bold text-gold">
                    ${currentTier.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Included Features:</h4>
                  <ul className="space-y-1">
                    {currentTier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-sage" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {activeAddons.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium text-sm">Active Add-ons:</h4>
                    <ul className="space-y-1">
                      {activeAddons.map((addonId) => {
                        const addon = addonPacks[addonId as keyof typeof addonPacks];
                        return addon ? (
                          <li key={addonId} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Sparkles className="h-4 w-4 text-gold" />
                              {addon.name}
                            </span>
                            <span className="text-gold font-medium">+${addon.price}/mo</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Next Billing Date
                    </span>
                    <span className="font-medium">
                      {new Date(mockCompanyData.nextBillingDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Amount</span>
                    <span className="font-medium">${calculateCurrentMonthlyRate()}.00</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => {
                    setSelectedTier(currentSubscriptionTier);
                    setSelectedAddons([...activeAddons]);
                    setSubscriptionDialogOpen(true);
                  }}
                >
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Subscription Management Dialog */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              Manage Your Subscription
            </DialogTitle>
            <DialogDescription>
              Upgrade your plan or add feature packs to enhance your CFO experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Plan Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-gold" />
                Choose Your Plan
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(subscriptionTiers).map(([key, tier]) => {
                  const isCurrentPlan = key === currentSubscriptionTier;
                  const isSelected = key === selectedTier;
                  const isUpgrade = subscriptionTiers[key as keyof typeof subscriptionTiers].price > currentTier.price;
                  
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedTier(key)}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      {isCurrentPlan && (
                        <Badge className="absolute -top-2 right-2 bg-sage text-white text-xs">
                          Current
                        </Badge>
                      )}
                      {isUpgrade && !isCurrentPlan && (
                        <Badge className="absolute -top-2 right-2 bg-gold text-white text-xs">
                          Upgrade
                        </Badge>
                      )}
                      <h4 className="font-semibold">{tier.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        {tier.description}
                      </p>
                      <div className="text-xl font-bold text-gold">
                        ${tier.price}
                        <span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </div>
                      <ul className="mt-3 space-y-1">
                        {tier.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-sage" />
                            {feature}
                          </li>
                        ))}
                        {tier.features.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{tier.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Add-on Packs */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-gold" />
                Add Feature Packs
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(addonPacks).map(([key, addon]) => {
                  const isSelected = selectedAddons.includes(key);
                  const isActive = activeAddons.includes(key);
                  
                  return (
                    <div
                      key={key}
                      onClick={() => toggleAddon(key)}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      {isActive && (
                        <Badge className="absolute -top-2 right-2 bg-sage text-white text-xs">
                          Active
                        </Badge>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={isSelected} 
                              onCheckedChange={() => toggleAddon(key)}
                              className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                            />
                            <h4 className="font-semibold">{addon.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 ml-6">
                            {addon.description}
                          </p>
                          <ul className="mt-2 ml-6 space-y-1">
                            {addon.features.map((feature, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-gold" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gold">+${addon.price}</span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Summary and Actions */}
            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">New Monthly Total</p>
                <p className="text-2xl font-bold text-gold">
                  ${calculateNewTotal()}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                {selectedAddons.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Includes {selectedAddons.length} add-on pack{selectedAddons.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedTier(currentSubscriptionTier);
                    setSelectedAddons(activeAddons);
                    setSubscriptionDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="gold"
                  onClick={handleUpgrade}
                  disabled={isUpgrading || (selectedTier === currentSubscriptionTier && JSON.stringify(selectedAddons.sort()) === JSON.stringify(activeAddons.sort()))}
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-4 w-4 mr-2" />
                      {selectedTier !== currentSubscriptionTier ? 'Upgrade Plan' : selectedAddons.length > activeAddons.length ? 'Add Packs' : 'Update Subscription'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
