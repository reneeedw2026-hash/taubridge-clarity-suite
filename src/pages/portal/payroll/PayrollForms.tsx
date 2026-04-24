import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Download,
  Printer,
  Eye,
  CheckCircle,
  AlertCircle,
  Calculator,
  X,
  Users,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock Form 941 data
const form941Data = {
  quarter: 'Q1 2026',
  ein: '12-3456789',
  businessName: 'TauBridge Demo Company',
  businessAddress: '123 Main Street, Suite 100',
  businessCity: 'San Francisco, CA 94102',
  employeeCount: 247,
  totalWages: 1470000,
  federalWithholding: 89000,
  socialSecurityWages: 1470000,
  socialSecurityTax: 91140,
  medicareWages: 1470000,
  medicareTax: 42630,
  additionalMedicareTax: 0,
  totalTaxLiability: 222770,
  currentQuarterAdjustment: 0,
  sickPayAdjustment: 0,
  tipsAdjustment: 0,
  depositsYTD: 215000,
  balanceDue: 7770,
  // Monthly breakdown
  month1Liability: 68000,
  month2Liability: 72000,
  month3Liability: 82770,
};

// Mock Form 940 data
const form940Data = {
  year: '2025',
  ein: '12-3456789',
  businessName: 'TauBridge Demo Company',
  businessAddress: '123 Main Street, Suite 100',
  businessCity: 'San Francisco, CA 94102',
  stateCode: 'CA',
  totalPayments: 5200000,
  exemptPayments: 280000,
  exemptReason: 'Retirement/Pension',
  amountsOver7000: 3850000,
  taxableWages: 1070000,
  futaRate: 0.006,
  futaTax: 6420,
  stateCredit: 5778,
  netFutaTax: 642,
  // Quarterly breakdown
  q1Liability: 1605,
  q2Liability: 1605,
  q3Liability: 1605,
  q4Liability: 1605,
  totalDeposits: 6420,
};

// Mock W-2 summary
const w2Summary = {
  year: '2025',
  employeeCount: 247,
  totalWages: 5200000,
  totalFedTax: 356000,
  totalSSWages: 5200000,
  totalSSTax: 322400,
  totalMedicareWages: 5200000,
  totalMedicareTax: 75400,
  totalStateTax: 124000,
  totalLocalTax: 15600,
};

// Mock W-2 employees
const w2Employees = [
  { id: 1, name: 'John Smith', ssn: '***-**-1234', address: '456 Oak Ave, San Francisco, CA 94103', wages: 85000, fedTax: 12750, ssWages: 85000, ssTax: 5270, medicareWages: 85000, medicareTax: 1232, stateTax: 2890, stateWages: 85000 },
  { id: 2, name: 'Sarah Johnson', ssn: '***-**-5678', address: '789 Pine St, Oakland, CA 94612', wages: 72000, fedTax: 10800, ssWages: 72000, ssTax: 4464, medicareWages: 72000, medicareTax: 1044, stateTax: 2448, stateWages: 72000 },
  { id: 3, name: 'Michael Davis', ssn: '***-**-9012', address: '321 Elm Blvd, Berkeley, CA 94704', wages: 95000, fedTax: 14250, ssWages: 95000, ssTax: 5890, medicareWages: 95000, medicareTax: 1377, stateTax: 3230, stateWages: 95000 },
  { id: 4, name: 'Emily Brown', ssn: '***-**-3456', address: '654 Maple Dr, San Jose, CA 95112', wages: 68000, fedTax: 10200, ssWages: 68000, ssTax: 4216, medicareWages: 68000, medicareTax: 986, stateTax: 2312, stateWages: 68000 },
  { id: 5, name: 'Robert Wilson', ssn: '***-**-7890', address: '987 Cedar Ln, Fremont, CA 94538', wages: 78000, fedTax: 11700, ssWages: 78000, ssTax: 4836, medicareWages: 78000, medicareTax: 1131, stateTax: 2652, stateWages: 78000 },
];

// Mock 1099-NEC data for contractors
const contractors1099 = [
  { id: 1, name: 'Apex Consulting LLC', tin: '***-**-4521', address: '100 Tech Park, San Jose, CA 95110', type: 'LLC', compensation: 48000, fedWithholding: 0, stateWithholding: 0 },
  { id: 2, name: 'Sarah Martinez', tin: '***-**-7832', address: '555 Freelance Way, Oakland, CA 94601', type: 'Individual', compensation: 32500, fedWithholding: 0, stateWithholding: 0 },
  { id: 3, name: 'Digital Solutions Inc', tin: '***-**-9914', address: '200 Innovation Blvd, Palo Alto, CA 94301', type: 'Corporation', compensation: 75000, fedWithholding: 0, stateWithholding: 0 },
  { id: 4, name: 'Mark Thompson', tin: '***-**-3345', address: '789 Contractor St, San Francisco, CA 94107', type: 'Individual', compensation: 28750, fedWithholding: 4312, stateWithholding: 862 },
  { id: 5, name: 'Creative Works Studio', tin: '***-**-6678', address: '321 Design Ave, Berkeley, CA 94704', type: 'LLC', compensation: 41200, fedWithholding: 0, stateWithholding: 0 },
  { id: 6, name: 'Tech Freelancers Co', tin: '***-**-1123', address: '456 Gig Economy Ln, Mountain View, CA 94040', type: 'Partnership', compensation: 52800, fedWithholding: 0, stateWithholding: 0 },
  { id: 7, name: 'Jennifer Lee', tin: '***-**-4456', address: '888 Remote Worker Blvd, Sunnyvale, CA 94086', type: 'Individual', compensation: 19500, fedWithholding: 0, stateWithholding: 0 },
  { id: 8, name: 'Data Analytics Pro', tin: '***-**-7789', address: '234 Analysis Dr, Santa Clara, CA 95050', type: 'LLC', compensation: 63000, fedWithholding: 0, stateWithholding: 0 },
  { id: 9, name: 'Robert Chen', tin: '***-**-0012', address: '567 Consultant Way, Redwood City, CA 94063', type: 'Individual', compensation: 24800, fedWithholding: 0, stateWithholding: 0 },
  { id: 10, name: 'Marketing Mavens LLC', tin: '***-**-3345', address: '890 Brand St, San Mateo, CA 94401', type: 'LLC', compensation: 38500, fedWithholding: 0, stateWithholding: 0 },
  { id: 11, name: 'IT Support Services', tin: '***-**-6677', address: '123 Help Desk Rd, Menlo Park, CA 94025', type: 'Corporation', compensation: 29000, fedWithholding: 0, stateWithholding: 0 },
  { id: 12, name: 'Anna Williams', tin: '***-**-9900', address: '456 Writer Ln, Los Altos, CA 94022', type: 'Individual', compensation: 15600, fedWithholding: 0, stateWithholding: 0 },
];

// 1099-NEC Summary
const form1099Summary = {
  year: '2025',
  contractorCount: 12,
  totalCompensation: contractors1099.reduce((sum, c) => sum + c.compensation, 0),
  totalFedWithholding: contractors1099.reduce((sum, c) => sum + c.fedWithholding, 0),
  totalStateWithholding: contractors1099.reduce((sum, c) => sum + c.stateWithholding, 0),
  filedDate: '2026-01-27',
  status: 'filed' as const,
};

// Form 941 Preview Component
const Form941Preview = ({ data, quarter }: { data: typeof form941Data; quarter: string }) => (
  <div className="bg-white text-black p-6 font-mono text-sm space-y-4 min-h-[800px]">
    {/* Header */}
    <div className="text-center border-b-2 border-black pb-4">
      <div className="text-xs">Form</div>
      <div className="text-3xl font-bold">941</div>
      <div className="text-sm font-bold">Employer's QUARTERLY Federal Tax Return</div>
      <div className="text-xs mt-1">Department of the Treasury — Internal Revenue Service</div>
      <div className="text-xs">OMB No. 1545-0029</div>
    </div>

    {/* Employer Info */}
    <div className="grid grid-cols-2 gap-4 border-b border-gray-400 pb-4">
      <div>
        <div className="text-xs text-gray-600">Employer identification number (EIN)</div>
        <div className="font-bold border-b border-dotted border-gray-400">{data.ein}</div>
      </div>
      <div>
        <div className="text-xs text-gray-600">Report for this Quarter of {quarter.split(' ')[1]}</div>
        <div className="font-bold">{quarter}</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">Trade name (if any)</div>
        <div className="font-bold border-b border-dotted border-gray-400">{data.businessName}</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">Address</div>
        <div className="border-b border-dotted border-gray-400">{data.businessAddress}</div>
        <div className="border-b border-dotted border-gray-400">{data.businessCity}</div>
      </div>
    </div>

    {/* Part 1 */}
    <div className="space-y-3">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 1: Answer these questions for this quarter.</div>
      
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">1</div>
        <div className="col-span-8">Number of employees who received wages, tips, or other compensation</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">{data.employeeCount}</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">2</div>
        <div className="col-span-8">Wages, tips, and other compensation</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.totalWages.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">3</div>
        <div className="col-span-8">Federal income tax withheld from wages, tips, and other compensation</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.federalWithholding.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">4</div>
        <div className="col-span-8">If no wages, tips, and other compensation are subject to social security or Medicare tax</div>
        <div className="col-span-3 text-center">☐ Check and go to line 6</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">5a</div>
        <div className="col-span-5">Taxable social security wages</div>
        <div className="col-span-3 border-b border-black text-right pr-2">${data.socialSecurityWages.toLocaleString()}.00</div>
        <div className="col-span-1">× 0.124 =</div>
        <div className="col-span-2 border-b border-black text-right font-bold pr-2">${data.socialSecurityTax.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">5b</div>
        <div className="col-span-5">Taxable social security tips</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
        <div className="col-span-1">× 0.124 =</div>
        <div className="col-span-2 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">5c</div>
        <div className="col-span-5">Taxable Medicare wages & tips</div>
        <div className="col-span-3 border-b border-black text-right pr-2">${data.medicareWages.toLocaleString()}.00</div>
        <div className="col-span-1">× 0.029 =</div>
        <div className="col-span-2 border-b border-black text-right font-bold pr-2">${data.medicareTax.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">5d</div>
        <div className="col-span-8">Taxable wages & tips subject to Additional Medicare Tax withholding</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-gray-100 py-1">
        <div className="col-span-1 text-right font-bold">5e</div>
        <div className="col-span-8 font-bold">Total social security and Medicare taxes. Add Column 2 from lines 5a, 5a(i), 5b, 5c, and 5d</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${(data.socialSecurityTax + data.medicareTax).toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">6</div>
        <div className="col-span-8 font-bold">Total taxes before adjustments. Add lines 3 and 5e</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${(data.federalWithholding + data.socialSecurityTax + data.medicareTax).toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">7</div>
        <div className="col-span-8">Current quarter's adjustment for fractions of cents</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">8</div>
        <div className="col-span-8">Current quarter's adjustment for sick pay</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">9</div>
        <div className="col-span-8">Current quarter's adjustments for tips and group-term life insurance</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-gray-100 py-1">
        <div className="col-span-1 text-right font-bold">10</div>
        <div className="col-span-8 font-bold">Total taxes after adjustments. Combine lines 6 through 9</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.totalTaxLiability.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">11</div>
        <div className="col-span-8">Qualified small business payroll tax credit for increasing research activities. Attach Form 8974</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-yellow-100 py-1">
        <div className="col-span-1 text-right font-bold">12</div>
        <div className="col-span-8 font-bold">Total taxes after adjustments and credits. Subtract line 11 from line 10</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.totalTaxLiability.toLocaleString()}.00</div>
      </div>
    </div>

    {/* Part 2 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 2: Tell us about your deposit schedule and tax liability for this quarter.</div>
      
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">13</div>
        <div className="col-span-8">Total deposits for this quarter, including overpayment applied from a prior quarter</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.depositsYTD.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-gold/20 py-1">
        <div className="col-span-1 text-right font-bold">14</div>
        <div className="col-span-8 font-bold">Balance due. If line 12 is more than line 13, enter the difference and see instructions</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2 text-red-600">${data.balanceDue.toLocaleString()}.00</div>
      </div>

      <div className="border border-gray-400 p-3 mt-4">
        <div className="font-bold mb-2">Monthly Summary of Federal Tax Liability</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-600">Month 1</div>
            <div className="font-bold">${data.month1Liability.toLocaleString()}.00</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Month 2</div>
            <div className="font-bold">${data.month2Liability.toLocaleString()}.00</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Month 3</div>
            <div className="font-bold">${data.month3Liability.toLocaleString()}.00</div>
          </div>
        </div>
        <div className="text-center mt-2 pt-2 border-t border-gray-400">
          <div className="text-xs text-gray-600">Total liability for quarter</div>
          <div className="font-bold">${data.totalTaxLiability.toLocaleString()}.00</div>
        </div>
      </div>
    </div>

    {/* Part 3 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 3: Tell us about your business.</div>
      <div className="text-sm">
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-1 text-right font-bold">15</div>
          <div className="col-span-11">If your business has closed or you stopped paying wages... ☐ Check here, and enter the final date you paid wages __ / __ / ____</div>
        </div>
        <div className="grid grid-cols-12 gap-2 items-center mt-2">
          <div className="col-span-1 text-right font-bold">16</div>
          <div className="col-span-11">If you're a seasonal employer and you don't have to file a return for every quarter of the year... ☐ Check here</div>
        </div>
      </div>
    </div>

    {/* Part 4 & 5 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 4: May we speak with your third-party designee?</div>
      <div className="text-sm">☐ Yes. Designee's name and phone number _______________</div>
      <div className="text-sm">☑ No.</div>
    </div>

    <div className="space-y-3 pt-4 border-t border-gray-400">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 5: Sign here. You MUST complete both pages of Form 941 and SIGN it.</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600">Sign your name here</div>
          <div className="border-b border-dotted border-gray-400 h-8 italic text-gray-500">Authorized Signature</div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Date</div>
          <div className="border-b border-dotted border-gray-400 h-8">__ / __ / ____</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600">Print your name here</div>
          <div className="border-b border-dotted border-gray-400 h-6"></div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Print your title here</div>
          <div className="border-b border-dotted border-gray-400 h-6"></div>
        </div>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
      Form 941 (Rev. 3-2025) • Cat. No. 17001Z • Department of the Treasury - Internal Revenue Service
    </div>
  </div>
);

// Form 940 Preview Component
const Form940Preview = ({ data }: { data: typeof form940Data }) => (
  <div className="bg-white text-black p-6 font-mono text-sm space-y-4 min-h-[800px]">
    {/* Header */}
    <div className="text-center border-b-2 border-black pb-4">
      <div className="text-xs">Form</div>
      <div className="text-3xl font-bold">940</div>
      <div className="text-sm font-bold">Employer's Annual Federal Unemployment (FUTA) Tax Return</div>
      <div className="text-xs mt-1">Department of the Treasury — Internal Revenue Service</div>
      <div className="text-xs">For calendar year {data.year}</div>
    </div>

    {/* Employer Info */}
    <div className="grid grid-cols-2 gap-4 border-b border-gray-400 pb-4">
      <div>
        <div className="text-xs text-gray-600">Employer identification number (EIN)</div>
        <div className="font-bold border-b border-dotted border-gray-400">{data.ein}</div>
      </div>
      <div>
        <div className="text-xs text-gray-600">Type of Return (check one)</div>
        <div>☑ a. Amended ☐ b. Successor ☐ c. No payments ☐ d. Final</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">Name (not your trade name)</div>
        <div className="font-bold border-b border-dotted border-gray-400">{data.businessName}</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">Trade name (if any)</div>
        <div className="border-b border-dotted border-gray-400">{data.businessName}</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">Address</div>
        <div className="border-b border-dotted border-gray-400">{data.businessAddress}, {data.businessCity}</div>
      </div>
    </div>

    {/* Part 1 */}
    <div className="space-y-3">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 1: Tell us about your return. If any line does NOT apply, leave it blank.</div>
      
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">1a</div>
        <div className="col-span-8">If you had to pay state unemployment tax in one state only, enter the state abbreviation</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">{data.stateCode}</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">1b</div>
        <div className="col-span-11">If you had to pay state unemployment tax in more than one state, you are a multi-state employer ☐</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">2</div>
        <div className="col-span-11">If you paid wages in a state that is subject to CREDIT REDUCTION ☐ Check here</div>
      </div>
    </div>

    {/* Part 2 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 2: Determine your FUTA tax before adjustments.</div>
      
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">3</div>
        <div className="col-span-8">Total payments to all employees</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.totalPayments.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">4</div>
        <div className="col-span-8">Payments exempt from FUTA tax (check all that apply)</div>
        <div className="col-span-3 border-b border-black text-right pr-2">${data.exemptPayments.toLocaleString()}.00</div>
      </div>
      <div className="ml-8 text-xs">
        ☑ 4a Fringe benefits ☐ 4b Group-term life insurance ☑ 4c Retirement/Pension ☐ 4d Dependent care ☐ 4e Other
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">5</div>
        <div className="col-span-8">Total of payments made to each employee in excess of $7,000</div>
        <div className="col-span-3 border-b border-black text-right pr-2">${data.amountsOver7000.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">6</div>
        <div className="col-span-8">Subtotal (line 4 + line 5 = line 6)</div>
        <div className="col-span-3 border-b border-black text-right pr-2">${(data.exemptPayments + data.amountsOver7000).toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-gray-100 py-1">
        <div className="col-span-1 text-right font-bold">7</div>
        <div className="col-span-8 font-bold">Total taxable FUTA wages (line 3 - line 6 = line 7)</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.taxableWages.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-yellow-100 py-1">
        <div className="col-span-1 text-right font-bold">8</div>
        <div className="col-span-8 font-bold">FUTA tax before adjustments (line 7 × 0.006 = line 8)</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.futaTax.toLocaleString()}.00</div>
      </div>
    </div>

    {/* Part 3 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 3: Determine your adjustments. If any line does NOT apply, leave it blank.</div>
      
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">9</div>
        <div className="col-span-8">If ALL of the taxable FUTA wages you paid were excluded from state unemployment tax, multiply line 7 by 0.054</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">10</div>
        <div className="col-span-8">If SOME of the taxable FUTA wages you paid were excluded from state unemployment tax</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">11</div>
        <div className="col-span-8">If credit reduction applies, enter the total from Schedule A (Form 940)</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>
    </div>

    {/* Part 4 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 4: Determine your FUTA tax and balance due or overpayment.</div>
      
      <div className="grid grid-cols-12 gap-2 items-center bg-gray-100 py-1">
        <div className="col-span-1 text-right font-bold">12</div>
        <div className="col-span-8 font-bold">Total FUTA tax after adjustments (lines 8 + 9 + 10 + 11 = line 12)</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2">${data.futaTax.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">13</div>
        <div className="col-span-8">FUTA tax deposited for the year, including any overpayment applied from a prior year</div>
        <div className="col-span-3 border-b border-black text-right pr-2">${data.totalDeposits.toLocaleString()}.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center bg-green-100 py-1">
        <div className="col-span-1 text-right font-bold">14</div>
        <div className="col-span-8 font-bold">Balance due (If line 12 is more than line 13, enter the difference on line 14)</div>
        <div className="col-span-3 border-b border-black text-right font-bold pr-2 text-green-700">$0.00</div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-right font-bold">15</div>
        <div className="col-span-8">Overpayment (If line 13 is more than line 12, enter the difference)</div>
        <div className="col-span-3 border-b border-black text-right pr-2">$0.00</div>
      </div>
    </div>

    {/* Part 5 */}
    <div className="space-y-3 pt-4">
      <div className="bg-gray-200 px-2 py-1 font-bold">Part 5: Report your FUTA tax liability by quarter only if line 12 is more than $500.</div>
      
      <div className="border border-gray-400 p-3">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-600">16a. 1st quarter (Jan 1 - Mar 31)</div>
            <div className="font-bold border-b border-black">${data.q1Liability.toLocaleString()}.00</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">16b. 2nd quarter (Apr 1 - Jun 30)</div>
            <div className="font-bold border-b border-black">${data.q2Liability.toLocaleString()}.00</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">16c. 3rd quarter (Jul 1 - Sep 30)</div>
            <div className="font-bold border-b border-black">${data.q3Liability.toLocaleString()}.00</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">16d. 4th quarter (Oct 1 - Dec 31)</div>
            <div className="font-bold border-b border-black">${data.q4Liability.toLocaleString()}.00</div>
          </div>
        </div>
        <div className="text-center mt-3 pt-2 border-t border-gray-400">
          <div className="text-xs text-gray-600">17. Total tax liability for the year (lines 16a + 16b + 16c + 16d = line 17)</div>
          <div className="font-bold">${data.futaTax.toLocaleString()}.00</div>
        </div>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
      Form 940 (2025) • Cat. No. 11234O • Department of the Treasury - Internal Revenue Service
    </div>
  </div>
);

// W-2 Preview Component
const W2Preview = ({ employee }: { employee: typeof w2Employees[0] }) => (
  <div className="bg-white text-black p-6 font-mono text-xs space-y-2">
    <div className="text-center border-b-2 border-black pb-2 mb-4">
      <div className="text-lg font-bold">Form W-2 Wage and Tax Statement</div>
      <div className="text-xs">Copy B—To Be Filed With Employee's FEDERAL Tax Return</div>
      <div className="text-xs">2025</div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-2">
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">a Employee's social security number</div>
          <div className="font-bold">{employee.ssn}</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">b Employer identification number (EIN)</div>
          <div className="font-bold">12-3456789</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">c Employer's name, address, and ZIP code</div>
          <div className="font-bold">TauBridge Demo Company</div>
          <div>123 Main Street, Suite 100</div>
          <div>San Francisco, CA 94102</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">d Control number</div>
          <div className="font-bold">{String(employee.id).padStart(6, '0')}</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">e Employee's first name and initial, last name, Suff.</div>
          <div className="font-bold">{employee.name}</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">f Employee's address and ZIP code</div>
          <div>{employee.address}</div>
        </div>
      </div>

      {/* Right Column - Boxes */}
      <div className="grid grid-cols-2 gap-1">
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">1 Wages, tips, other comp.</div>
          <div className="font-bold text-right">${employee.wages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">2 Federal income tax withheld</div>
          <div className="font-bold text-right">${employee.fedTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">3 Social security wages</div>
          <div className="font-bold text-right">${employee.ssWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">4 Social security tax withheld</div>
          <div className="font-bold text-right">${employee.ssTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">5 Medicare wages and tips</div>
          <div className="font-bold text-right">${employee.medicareWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">6 Medicare tax withheld</div>
          <div className="font-bold text-right">${employee.medicareTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">7 Social security tips</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">8 Allocated tips</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">9 Verification code</div>
          <div className="font-bold text-right"></div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">10 Dependent care benefits</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2 col-span-2">
          <div className="text-[10px] text-gray-600">11 Nonqualified plans</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2 col-span-2">
          <div className="text-[10px] text-gray-600">12a See instructions for box 12</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Code: D</div>
            <div className="text-right">$5,000.00</div>
          </div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">13</div>
          <div className="text-[10px]">☐ Statutory emp. ☐ Retirement plan ☑ Third-party sick pay</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">14 Other</div>
          <div className="text-right"></div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">15 State | Employer's state ID</div>
          <div className="font-bold">CA | 123-456-7890</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">16 State wages, tips, etc.</div>
          <div className="font-bold text-right">${employee.stateWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">17 State income tax</div>
          <div className="font-bold text-right">${employee.stateTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">18 Local wages, tips, etc.</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">19 Local income tax</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-[10px] text-gray-600">20 Locality name</div>
          <div className="font-bold"></div>
        </div>
      </div>
    </div>

    <div className="text-center text-[10px] text-gray-500 pt-4 border-t border-gray-300 mt-4">
      Form W-2 (2025) • Department of the Treasury - Internal Revenue Service
    </div>
  </div>
);

// W-3 Preview Component
const W3Preview = ({ summary }: { summary: typeof w2Summary }) => (
  <div className="bg-white text-black p-6 font-mono text-sm space-y-4 min-h-[600px]">
    <div className="text-center border-b-2 border-black pb-4">
      <div className="text-xs">Form</div>
      <div className="text-3xl font-bold">W-3</div>
      <div className="text-sm font-bold">Transmittal of Wage and Tax Statements</div>
      <div className="text-xs mt-1">Department of the Treasury — Internal Revenue Service</div>
      <div className="text-xs">{summary.year}</div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">a Control number</div>
          <div className="font-bold">33333</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">b Kind of Payer</div>
          <div>☑ 941 ☐ Military ☐ 943 ☐ 944 ☐ CT-1 ☐ Hshld. emp. ☐ Medicare govt. emp.</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">c Total number of Forms W-2</div>
          <div className="font-bold">{summary.employeeCount}</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">d Establishment number</div>
          <div className="font-bold">001</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">e Employer identification number (EIN)</div>
          <div className="font-bold">12-3456789</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">f Employer's name</div>
          <div className="font-bold">TauBridge Demo Company</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">g Employer's address and ZIP code</div>
          <div>123 Main Street, Suite 100</div>
          <div>San Francisco, CA 94102</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">1 Wages, tips, other comp.</div>
          <div className="font-bold text-right">${summary.totalWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">2 Federal income tax withheld</div>
          <div className="font-bold text-right">${summary.totalFedTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">3 Social security wages</div>
          <div className="font-bold text-right">${summary.totalSSWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">4 Social security tax withheld</div>
          <div className="font-bold text-right">${summary.totalSSTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">5 Medicare wages and tips</div>
          <div className="font-bold text-right">${summary.totalMedicareWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">6 Medicare tax withheld</div>
          <div className="font-bold text-right">${summary.totalMedicareTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">7 Social security tips</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">8 Allocated tips</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2 col-span-2">
          <div className="text-xs text-gray-600">9 (blank)</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">10 Dependent care benefits</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">11 Nonqualified plans</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2 col-span-2">
          <div className="text-xs text-gray-600">12a Deferred compensation</div>
          <div className="font-bold text-right">$1,235,000.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">13</div>
          <div className="text-xs">☐ Third-party sick pay</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">14 Income tax withheld by payer of third-party sick pay</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">15 State | Employer's state ID</div>
          <div className="font-bold">CA | 123-456-7890</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">16 State wages, tips, etc.</div>
          <div className="font-bold text-right">${summary.totalWages.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">17 State income tax</div>
          <div className="font-bold text-right">${summary.totalStateTax.toLocaleString()}.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">18 Local wages, tips, etc.</div>
          <div className="font-bold text-right">$0.00</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">19 Local income tax</div>
          <div className="font-bold text-right">${summary.totalLocalTax.toLocaleString()}.00</div>
        </div>
      </div>
    </div>

    <div className="border border-gray-400 p-3 mt-4">
      <div className="font-bold mb-2">Signature</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600">Under penalties of perjury, I declare that I have examined this return and accompanying documents, and, to the best of my knowledge and belief, they are true, correct, and complete.</div>
        </div>
        <div className="space-y-2">
          <div className="border-b border-dotted border-gray-400 h-6 italic text-gray-500">Authorized Signature</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-600">Title</div>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Date</div>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
      Form W-3 (2025) • Cat. No. 10159Y • Department of the Treasury - Internal Revenue Service
    </div>
  </div>
);

// 1099-NEC Preview Component
const Form1099NECPreview = ({ contractor }: { contractor: typeof contractors1099[0] }) => (
  <div className="bg-white text-black p-6 font-mono text-sm space-y-4 min-h-[600px]">
    {/* Header */}
    <div className="flex justify-between items-start border-b-2 border-black pb-4">
      <div>
        <div className="text-xs">Form</div>
        <div className="text-3xl font-bold text-red-600">1099-NEC</div>
        <div className="text-xs">Nonemployee Compensation</div>
      </div>
      <div className="text-right">
        <div className="text-xs">OMB No. 1545-0116</div>
        <div className="text-lg font-bold">2025</div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {/* Left Column - Payer Info */}
      <div className="space-y-3">
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">PAYER'S name, street address, city or town, state or province, country, ZIP or foreign postal code, and telephone no.</div>
          <div className="font-bold">TauBridge Demo Company</div>
          <div>123 Main Street, Suite 100</div>
          <div>San Francisco, CA 94102</div>
          <div>(415) 555-0100</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">PAYER'S TIN</div>
            <div className="font-bold">12-3456789</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">RECIPIENT'S TIN</div>
            <div className="font-bold">{contractor.tin}</div>
          </div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">RECIPIENT'S name</div>
          <div className="font-bold">{contractor.name}</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">Street address (including apt. no.)</div>
          <div>{contractor.address}</div>
        </div>
        <div className="border border-gray-400 p-2">
          <div className="text-xs text-gray-600">Account number (see instructions)</div>
          <div>CONT-{contractor.id.toString().padStart(4, '0')}</div>
        </div>
      </div>

      {/* Right Column - Boxes */}
      <div className="space-y-3">
        <div className="border-2 border-gray-600 p-3 bg-yellow-50">
          <div className="text-xs text-gray-600 font-bold">1 Nonemployee compensation</div>
          <div className="text-2xl font-bold text-right">${contractor.compensation.toLocaleString()}.00</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">2 Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale</div>
            <div className="text-center">☐</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">3</div>
            <div className="text-gray-400 text-center text-xs">(Reserved)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">4 Federal income tax withheld</div>
            <div className="font-bold text-right">${contractor.fedWithholding.toLocaleString()}.00</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">5 State tax withheld</div>
            <div className="font-bold text-right">${contractor.stateWithholding.toLocaleString()}.00</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">6 State/Payer's state no.</div>
            <div className="font-bold">CA / 123-456-7890</div>
          </div>
          <div className="border border-gray-400 p-2">
            <div className="text-xs text-gray-600">7 State income</div>
            <div className="font-bold text-right">${contractor.compensation.toLocaleString()}.00</div>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
      Form 1099-NEC (2025) • Cat. No. 72590N • Department of the Treasury - Internal Revenue Service
    </div>
  </div>
);

// 1096 Transmittal Preview Component
const Form1096Preview = ({ summary }: { summary: typeof form1099Summary }) => (
  <div className="bg-white text-black p-6 font-mono text-sm space-y-4 min-h-[600px]">
    {/* Header */}
    <div className="text-center border-b-2 border-black pb-4">
      <div className="text-xs">Form</div>
      <div className="text-3xl font-bold">1096</div>
      <div className="text-sm font-bold">Annual Summary and Transmittal of U.S. Information Returns</div>
      <div className="text-xs mt-1">Department of the Treasury — Internal Revenue Service</div>
      <div className="text-xs">For calendar year {summary.year}</div>
    </div>

    {/* Filer Info */}
    <div className="grid grid-cols-2 gap-4 border-b border-gray-400 pb-4">
      <div>
        <div className="text-xs text-gray-600">FILER'S name</div>
        <div className="font-bold border-b border-dotted border-gray-400">TauBridge Demo Company</div>
      </div>
      <div>
        <div className="text-xs text-gray-600">Employer identification number</div>
        <div className="font-bold border-b border-dotted border-gray-400">12-3456789</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">Street address</div>
        <div className="border-b border-dotted border-gray-400">123 Main Street, Suite 100</div>
      </div>
      <div className="col-span-2">
        <div className="text-xs text-gray-600">City or town, state or province, country, and ZIP or foreign postal code</div>
        <div className="border-b border-dotted border-gray-400">San Francisco, CA 94102</div>
      </div>
    </div>

    {/* Form Type Selection */}
    <div className="border border-gray-400 p-4">
      <div className="font-bold mb-2">Type of Form Being Transmitted:</div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>☐ 1097-BTC</div>
        <div>☐ 1098</div>
        <div>☐ 1098-C</div>
        <div>☐ 1098-E</div>
        <div>☐ 1098-F</div>
        <div>☐ 1098-Q</div>
        <div>☐ 1098-T</div>
        <div>☐ 1099-A</div>
        <div>☐ 1099-B</div>
        <div>☐ 1099-C</div>
        <div>☐ 1099-CAP</div>
        <div>☐ 1099-DIV</div>
        <div>☐ 1099-G</div>
        <div>☐ 1099-INT</div>
        <div>☐ 1099-K</div>
        <div>☐ 1099-LS</div>
        <div>☐ 1099-LTC</div>
        <div>☐ 1099-MISC</div>
        <div className="font-bold">☑ 1099-NEC</div>
        <div>☐ 1099-OID</div>
        <div>☐ 1099-PATR</div>
        <div>☐ 1099-Q</div>
        <div>☐ 1099-R</div>
        <div>☐ 1099-S</div>
        <div>☐ 1099-SA</div>
        <div>☐ 1099-SB</div>
        <div>☐ 3921</div>
        <div>☐ 3922</div>
        <div>☐ 5498</div>
        <div>☐ 5498-ESA</div>
        <div>☐ 5498-SA</div>
        <div>☐ W-2G</div>
      </div>
    </div>

    {/* Summary Boxes */}
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-gray-400 p-3">
        <div className="text-xs text-gray-600 font-bold">3. Total number of forms</div>
        <div className="text-2xl font-bold text-center">{summary.contractorCount}</div>
      </div>
      <div className="border border-gray-400 p-3">
        <div className="text-xs text-gray-600 font-bold">4. Federal income tax withheld</div>
        <div className="text-xl font-bold text-right">${summary.totalFedWithholding.toLocaleString()}.00</div>
      </div>
      <div className="border-2 border-gray-600 p-3 col-span-2 bg-yellow-50">
        <div className="text-xs text-gray-600 font-bold">5. Total amount reported with this Form 1096</div>
        <div className="text-2xl font-bold text-right">${summary.totalCompensation.toLocaleString()}.00</div>
      </div>
    </div>

    {/* Signature */}
    <div className="border border-gray-400 p-3 mt-4">
      <div className="font-bold mb-2">Signature</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600">Under penalties of perjury, I declare that I have examined this return and accompanying documents, and, to the best of my knowledge and belief, they are true, correct, and complete.</div>
        </div>
        <div className="space-y-2">
          <div className="border-b border-dotted border-gray-400 h-6 italic text-gray-500">Authorized Signature</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-600">Title</div>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Date</div>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
      Form 1096 (2025) • Cat. No. 14400O • Department of the Treasury - Internal Revenue Service
    </div>
  </div>
);

export default function PayrollForms() {
  const [selectedQuarter, setSelectedQuarter] = useState('q1-2026');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [previewOpen941, setPreviewOpen941] = useState(false);
  const [previewOpen940, setPreviewOpen940] = useState(false);
  const [previewOpenW3, setPreviewOpenW3] = useState(false);
  const [previewOpen1096, setPreviewOpen1096] = useState(false);
  const [selectedW2Employee, setSelectedW2Employee] = useState<typeof w2Employees[0] | null>(null);
  const [selected1099Contractor, setSelected1099Contractor] = useState<typeof contractors1099[0] | null>(null);

  const handleDownload = (formType: string, employeeName?: string) => {
    const fileName = employeeName 
      ? `${formType}_${employeeName.replace(/\s+/g, '_')}_2025.pdf`
      : `${formType}_${selectedQuarter.replace('-', '_')}.pdf`;
    toast.success(`Downloading ${fileName}`, {
      description: 'Your form is being prepared for download.',
    });
  };

  const handlePrint = (formType: string) => {
    toast.success(`Preparing ${formType} for printing`, {
      description: 'Opening print dialog...',
    });
    window.print();
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tax Forms</h1>
            <p className="text-muted-foreground">Generate, preview, and download payroll tax forms</p>
          </div>
          <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
            Demo Mode
          </Badge>
        </div>

        <Tabs defaultValue="941" className="space-y-6">
          <TabsList>
            <TabsTrigger value="941">Form 941</TabsTrigger>
            <TabsTrigger value="940">Form 940</TabsTrigger>
            <TabsTrigger value="w2">W-2 Forms</TabsTrigger>
            <TabsTrigger value="w3">W-3 Transmittal</TabsTrigger>
            <TabsTrigger value="1099">1099-NEC</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          </TabsList>

          {/* Form 941 */}
          <TabsContent value="941" className="space-y-6">
            <div className="flex items-center justify-between">
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1-2026">Q1 2026</SelectItem>
                  <SelectItem value="q4-2025">Q4 2025</SelectItem>
                  <SelectItem value="q3-2025">Q3 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Dialog open={previewOpen941} onOpenChange={setPreviewOpen941}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview PDF
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>Form 941 Preview - {form941Data.quarter}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handlePrint('Form 941')}>
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Button>
                          <Button size="sm" variant="gold" onClick={() => handleDownload('Form_941')}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[70vh]">
                      <Form941Preview data={form941Data} quarter={form941Data.quarter} />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => handleDownload('Form_941')}>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrint('Form 941')}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  Form 941 - Employer's Quarterly Federal Tax Return
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Part 1 */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Part 1</span>
                    Answer these questions for this quarter
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground">Line 1: Number of Employees</div>
                      <div className="text-xl font-bold">{form941Data.employeeCount}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground">Line 2: Total Wages, Tips, Compensation</div>
                      <div className="text-xl font-bold">${form941Data.totalWages.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground">Line 3: Federal Income Tax Withheld</div>
                      <div className="text-xl font-bold">${form941Data.federalWithholding.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 rounded-lg border">
                        <span className="text-sm">5a. Social Security Wages</span>
                        <span className="font-medium">${form941Data.socialSecurityWages.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg border bg-muted/30">
                        <span className="text-sm">5a. SS Tax (× 0.124)</span>
                        <span className="font-bold">${form941Data.socialSecurityTax.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 rounded-lg border">
                        <span className="text-sm">5c. Medicare Wages & Tips</span>
                        <span className="font-medium">${form941Data.medicareWages.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg border bg-muted/30">
                        <span className="text-sm">5c. Medicare Tax (× 0.029)</span>
                        <span className="font-bold">${form941Data.medicareTax.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Line 6: Total Taxes Before Adjustments</span>
                      <span className="text-xl font-bold text-primary">${(form941Data.federalWithholding + form941Data.socialSecurityTax + form941Data.medicareTax).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Part 2 */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Part 2</span>
                    Deposit Schedule and Tax Liability
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground">Line 12: Total Taxes After Adjustments</div>
                      <div className="text-xl font-bold text-primary">${form941Data.totalTaxLiability.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-sage/10 border border-sage/20">
                      <div className="text-xs text-muted-foreground">Line 13: Total Deposits</div>
                      <div className="text-xl font-bold text-sage">${form941Data.depositsYTD.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
                      <div className="text-xs text-muted-foreground">Line 14: Balance Due</div>
                      <div className="text-xl font-bold text-gold">${form941Data.balanceDue.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-lg border">
                    <div className="text-sm font-medium mb-3">Monthly Tax Liability (if $50,000+ in lookback period)</div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xs text-muted-foreground">Month 1</div>
                        <div className="font-bold">${form941Data.month1Liability.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Month 2</div>
                        <div className="font-bold">${form941Data.month2Liability.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Month 3</div>
                        <div className="font-bold">${form941Data.month3Liability.toLocaleString()}</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="font-bold">${form941Data.totalTaxLiability.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 3-5 Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">Part 3</span>
                      Business Info
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      ☐ Business closed<br />
                      ☐ Seasonal employer
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">Part 4</span>
                      Third-Party Designee
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      ☑ No designee selected
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">Part 5</span>
                      Signature
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      Ready for authorized signature
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form 940 */}
          <TabsContent value="940" className="space-y-6">
            <div className="flex items-center justify-between">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Dialog open={previewOpen940} onOpenChange={setPreviewOpen940}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview PDF
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>Form 940 Preview - {form940Data.year}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handlePrint('Form 940')}>
                            <Printer className="h-4 w-4 mr-1" />
                            Print
                          </Button>
                          <Button size="sm" variant="gold" onClick={() => handleDownload('Form_940')}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[70vh]">
                      <Form940Preview data={form940Data} />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => handleDownload('Form_940')}>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrint('Form 940')}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  Form 940 - Employer's Annual Federal Unemployment (FUTA) Tax Return
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Part 1 */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Part 1</span>
                    Tell us about your return
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">State Unemployment Tax</div>
                      <div className="font-bold">{form940Data.stateCode} - Single State Employer</div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm text-muted-foreground">Credit Reduction State</div>
                      <div className="font-bold">☐ Not Applicable</div>
                    </div>
                  </div>
                </div>

                {/* Part 2 */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Part 2</span>
                    Determine your FUTA tax before adjustments
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 rounded-lg border">
                        <span className="text-sm">3. Total Payments to Employees</span>
                        <span className="font-medium">${form940Data.totalPayments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg border">
                        <span className="text-sm">4. Exempt Payments</span>
                        <span className="font-medium">${form940Data.exemptPayments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg border">
                        <span className="text-sm">5. Amounts Over $7,000/Employee</span>
                        <span className="font-medium">${form940Data.amountsOver7000.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 rounded-lg bg-muted/50 border">
                        <span className="text-sm font-medium">7. Taxable FUTA Wages</span>
                        <span className="font-bold">${form940Data.taxableWages.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-lg bg-gold/10 border border-gold/20">
                        <span className="text-sm font-medium">8. FUTA Tax (× 0.006)</span>
                        <span className="font-bold text-gold">${form940Data.futaTax.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part 4 */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Part 4</span>
                    Determine your FUTA tax and balance due
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground">12. Total FUTA Tax</div>
                      <div className="text-xl font-bold text-primary">${form940Data.futaTax.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-sage/10 border border-sage/20">
                      <div className="text-xs text-muted-foreground">13. FUTA Tax Deposited</div>
                      <div className="text-xl font-bold text-sage">${form940Data.totalDeposits.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-sage/10 border border-sage/20">
                      <div className="text-xs text-muted-foreground">14. Balance Due</div>
                      <div className="text-xl font-bold text-sage">$0</div>
                    </div>
                  </div>
                </div>

                {/* Part 5 - Quarterly Breakdown */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">Part 5</span>
                    FUTA Tax Liability by Quarter
                  </h4>
                  <div className="grid grid-cols-5 gap-4 text-center">
                    <div className="p-3 rounded-lg border">
                      <div className="text-xs text-muted-foreground">Q1</div>
                      <div className="font-bold">${form940Data.q1Liability.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="text-xs text-muted-foreground">Q2</div>
                      <div className="font-bold">${form940Data.q2Liability.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="text-xs text-muted-foreground">Q3</div>
                      <div className="font-bold">${form940Data.q3Liability.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <div className="text-xs text-muted-foreground">Q4</div>
                      <div className="font-bold">${form940Data.q4Liability.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border">
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="font-bold">${form940Data.futaTax.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* W-2 Summary */}
          <TabsContent value="w2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    W-2 Forms Dashboard - {w2Summary.year}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload('All_W2s')}>
                      <Download className="h-4 w-4 mr-1" />
                      Download All W-2s (ZIP)
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Stats */}
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Total Employees</div>
                    <div className="text-xl font-bold">{w2Summary.employeeCount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Box 1: Total Wages</div>
                    <div className="text-xl font-bold">${(w2Summary.totalWages / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Box 2: Federal Tax</div>
                    <div className="text-xl font-bold">${(w2Summary.totalFedTax / 1000).toFixed(0)}k</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Box 4: SS Tax</div>
                    <div className="text-xl font-bold">${(w2Summary.totalSSTax / 1000).toFixed(0)}k</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Box 6: Medicare</div>
                    <div className="text-xl font-bold">${(w2Summary.totalMedicareTax / 1000).toFixed(0)}k</div>
                  </div>
                </div>

                {/* Employee Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>SSN</TableHead>
                        <TableHead className="text-right">Box 1: Wages</TableHead>
                        <TableHead className="text-right">Box 2: Fed Tax</TableHead>
                        <TableHead className="text-right">Box 4: SS Tax</TableHead>
                        <TableHead className="text-right">Box 6: Medicare</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {w2Employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell>{emp.ssn}</TableCell>
                          <TableCell className="text-right">${emp.wages.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.fedTax.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.ssTax.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${emp.medicareTax.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedW2Employee(emp)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center justify-between">
                                      <span>W-2 Preview - {emp.name}</span>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handlePrint(`W-2 ${emp.name}`)}>
                                          <Printer className="h-4 w-4 mr-1" />
                                          Print
                                        </Button>
                                        <Button size="sm" variant="gold" onClick={() => handleDownload('W-2', emp.name)}>
                                          <Download className="h-4 w-4 mr-1" />
                                          Download
                                        </Button>
                                      </div>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="max-h-[70vh]">
                                    <W2Preview employee={emp} />
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" onClick={() => handleDownload('W-2', emp.name)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Showing 5 of {w2Summary.employeeCount} employees
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* W-3 Transmittal */}
          <TabsContent value="w3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    Form W-3 - Transmittal of Wage and Tax Statements
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={previewOpenW3} onOpenChange={setPreviewOpenW3}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview PDF
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            <span>Form W-3 Preview - {w2Summary.year}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handlePrint('Form W-3')}>
                                <Printer className="h-4 w-4 mr-1" />
                                Print
                              </Button>
                              <Button size="sm" variant="gold" onClick={() => handleDownload('Form_W-3')}>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[70vh]">
                          <W3Preview summary={w2Summary} />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <Button variant="gold" onClick={() => handleDownload('Form_W-3')}>
                      <Download className="h-4 w-4 mr-1" />
                      Download W-3
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-sage/10 border border-sage/20 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-sage" />
                    <span className="font-medium">W-3 Matches W-2 Totals</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All W-2 data has been aggregated and verified against underlying records.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Wage & Tax Summary</h4>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box e: Total Employees</span>
                      <span className="font-medium">{w2Summary.employeeCount}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 1: Total Wages</span>
                      <span className="font-medium">${w2Summary.totalWages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 2: Federal Tax Withheld</span>
                      <span className="font-medium">${w2Summary.totalFedTax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">FICA Summary</h4>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 3: Social Security Wages</span>
                      <span className="font-medium">${w2Summary.totalSSWages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 4: Social Security Tax</span>
                      <span className="font-medium">${w2Summary.totalSSTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 6: Medicare Tax</span>
                      <span className="font-medium">${w2Summary.totalMedicareTax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">State Tax Summary</h4>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 16: State Wages</span>
                      <span className="font-medium">${w2Summary.totalWages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 17: State Income Tax</span>
                      <span className="font-medium">${w2Summary.totalStateTax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Local Tax Summary</h4>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 18: Local Wages</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <span>Box 19: Local Income Tax</span>
                      <span className="font-medium">${w2Summary.totalLocalTax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 1099-NEC Forms */}
          <TabsContent value="1099" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    1099-NEC Forms Dashboard - {form1099Summary.year}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={previewOpen1096} onOpenChange={setPreviewOpen1096}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View 1096 Transmittal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            <span>Form 1096 Preview - {form1099Summary.year}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handlePrint('Form 1096')}>
                                <Printer className="h-4 w-4 mr-1" />
                                Print
                              </Button>
                              <Button size="sm" variant="gold" onClick={() => handleDownload('Form_1096')}>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[70vh]">
                          <Form1096Preview summary={form1099Summary} />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('All_1099s')}>
                      <Download className="h-4 w-4 mr-1" />
                      Download All 1099s (ZIP)
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filing Status */}
                <div className="p-4 rounded-lg bg-sage/10 border border-sage/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-sage" />
                      <div>
                        <span className="font-medium">1099-NEC Forms Filed</span>
                        <p className="text-sm text-muted-foreground">
                          All {form1099Summary.contractorCount} forms were filed on {form1099Summary.filedDate}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-sage text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Filed
                    </Badge>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Total Contractors</div>
                    <div className="text-xl font-bold">{form1099Summary.contractorCount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gold/10 border border-gold/20 text-center">
                    <div className="text-xs text-muted-foreground">Box 1: Total Compensation</div>
                    <div className="text-xl font-bold text-gold">${(form1099Summary.totalCompensation / 1000).toFixed(0)}k</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Box 4: Fed Withholding</div>
                    <div className="text-xl font-bold">${form1099Summary.totalFedWithholding.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">State Withholding</div>
                    <div className="text-xl font-bold">${form1099Summary.totalStateWithholding.toLocaleString()}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-xs text-muted-foreground">Avg per Contractor</div>
                    <div className="text-xl font-bold">${Math.round(form1099Summary.totalCompensation / form1099Summary.contractorCount).toLocaleString()}</div>
                  </div>
                </div>

                {/* Contractor Types Breakdown */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Individuals</span>
                    </div>
                    <div className="text-lg font-bold">{contractors1099.filter(c => c.type === 'Individual').length}</div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium">LLCs</span>
                    </div>
                    <div className="text-lg font-bold">{contractors1099.filter(c => c.type === 'LLC').length}</div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-sage" />
                      <span className="text-sm font-medium">Corporations</span>
                    </div>
                    <div className="text-lg font-bold">{contractors1099.filter(c => c.type === 'Corporation').length}</div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Partnerships</span>
                    </div>
                    <div className="text-lg font-bold">{contractors1099.filter(c => c.type === 'Partnership').length}</div>
                  </div>
                </div>

                {/* Contractor Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contractor</TableHead>
                        <TableHead>TIN</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Box 1: Compensation</TableHead>
                        <TableHead className="text-right">Box 4: Fed W/H</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractors1099.map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">{contractor.name}</TableCell>
                          <TableCell>{contractor.tin}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {contractor.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">${contractor.compensation.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${contractor.fedWithholding.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelected1099Contractor(contractor)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center justify-between">
                                      <span>1099-NEC Preview - {contractor.name}</span>
                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handlePrint(`1099-NEC ${contractor.name}`)}>
                                          <Printer className="h-4 w-4 mr-1" />
                                          Print
                                        </Button>
                                        <Button size="sm" variant="gold" onClick={() => handleDownload('1099-NEC', contractor.name)}>
                                          <Download className="h-4 w-4 mr-1" />
                                          Download
                                        </Button>
                                      </div>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="max-h-[70vh]">
                                    <Form1099NECPreview contractor={contractor} />
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm" onClick={() => handleDownload('1099-NEC', contractor.name)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* IRS Notice */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">1099-NEC Filing Deadline</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        1099-NEC forms must be filed with the IRS and furnished to recipients by January 31st. 
                        Report nonemployee compensation of $600 or more paid during the calendar year.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reconciliation */}
          <TabsContent value="reconciliation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-gold" />
                  Tax Reconciliation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-sage/10 border border-sage/20 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-sage" />
                    <span className="font-medium">All Records Reconciled</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quarterly 941 totals match annual W-2/W-3 totals and all deposits are accounted for.
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Wages</TableHead>
                      <TableHead className="text-right">Fed W/H</TableHead>
                      <TableHead className="text-right">SS Tax</TableHead>
                      <TableHead className="text-right">Medicare</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">941 Totals (4 Quarters)</TableCell>
                      <TableCell className="text-right">$5,200,000</TableCell>
                      <TableCell className="text-right">$356,000</TableCell>
                      <TableCell className="text-right">$322,400</TableCell>
                      <TableCell className="text-right">$75,400</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">W-3 Transmittal</TableCell>
                      <TableCell className="text-right">$5,200,000</TableCell>
                      <TableCell className="text-right">$356,000</TableCell>
                      <TableCell className="text-right">$322,400</TableCell>
                      <TableCell className="text-right">$75,400</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-medium bg-muted/30">
                      <TableCell>Difference</TableCell>
                      <TableCell className="text-right text-sage">$0</TableCell>
                      <TableCell className="text-right text-sage">$0</TableCell>
                      <TableCell className="text-right text-sage">$0</TableCell>
                      <TableCell className="text-right text-sage">$0</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-sage/10 text-sage border-sage/30">
                          Balanced
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
