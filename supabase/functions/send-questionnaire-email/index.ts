import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuestionnaireData {
  businessDescription: string;
  accountingTool: string;
  payrollTool: string;
  otherTools: string;
  painPoints: string[];
  painPointsOther: string;
  recentIssues: string[];
  recentIssuesDetails: string;
  goals: string;
  bookkeepingResponsible: string;
  financialDecisionMaker: string;
  hasOutsideAdvisor: string;
  reportingFrequency: string;
  reportingFrustrations: string;
  readinessLevel: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  anythingElse: string;
}

const painPointLabels: Record<string, string> = {
  "cash-flow": "I don't have a clear picture of profit and cash flow",
  "payroll-costs": "Payroll costs feel out of control or unpredictable",
  "tax-compliance": "I'm worried about payroll tax compliance or IRS notices",
  "report-confusion": "My reports exist, but I don't understand what to do with them",
  "time-drain": "I spend too much time on finance/payroll instead of running the business",
  "other-pain": "Other",
};

const recentIssueLabels: Record<string, string> = {
  "late-filings": "Late or amended payroll tax filings",
  "irs-notices": "IRS or state notices related to payroll or employment taxes",
  "missed-payments": "Missed or late vendor/loan payments",
  "payroll-difficulty": "Difficulty making payroll",
  "year-end-surprises": "Major surprises at year-end with taxes or financials",
  "none": "None of the above",
  "other-issue": "Other",
};

const readinessLabels: Record<string, string> = {
  "active": "Actively looking to engage within 1–3 months",
  "exploring": "Exploring options with flexible timing",
  "gathering": "Mainly gathering information",
};

function formatQuestionnaireEmail(data: QuestionnaireData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #1a365d; border-bottom: 2px solid #c5a572; padding-bottom: 10px; }
    h2 { color: #2d5a4a; margin-top: 24px; font-size: 16px; }
    .section { background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .label { font-weight: bold; color: #1a365d; }
    .value { margin-top: 4px; }
    .contact-info { background: #1a365d; color: white; padding: 20px; border-radius: 8px; }
    .contact-info h2 { color: #c5a572; margin-top: 0; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🗓️ New Pre-Call Questionnaire Submission</h1>
    
    <div class="contact-info">
      <h2>Contact Information</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
      <p><strong>Company:</strong> ${data.companyName}</p>
      <p><strong>Readiness:</strong> ${readinessLabels[data.readinessLevel] || data.readinessLevel}</p>
    </div>

    <div class="section">
      <h2>About the Business</h2>
      <p>${data.businessDescription || "Not provided"}</p>
    </div>

    <div class="section">
      <h2>Current Tools</h2>
      <p><span class="label">Accounting/GL:</span> ${data.accountingTool || "Not provided"}</p>
      <p><span class="label">Payroll:</span> ${data.payrollTool || "Not provided"}</p>
      ${data.otherTools ? `<p><span class="label">Other Tools:</span> ${data.otherTools}</p>` : ""}
    </div>

    <div class="section">
      <h2>Pain Points</h2>
      <ul>
        ${data.painPoints.map((id) => `<li>${painPointLabels[id] || id}</li>`).join("")}
      </ul>
      ${data.painPointsOther ? `<p><strong>Other details:</strong> ${data.painPointsOther}</p>` : ""}
    </div>

    <div class="section">
      <h2>Recent Issues</h2>
      ${data.recentIssues.length > 0 ? `
      <ul>
        ${data.recentIssues.map((id) => `<li>${recentIssueLabels[id] || id}</li>`).join("")}
      </ul>
      ` : "<p>None selected</p>"}
      ${data.recentIssuesDetails ? `<p><strong>Details:</strong> ${data.recentIssuesDetails}</p>` : ""}
    </div>

    <div class="section">
      <h2>Goals & Priorities</h2>
      <p>${data.goals || "Not provided"}</p>
    </div>

    <div class="section">
      <h2>Decision Making</h2>
      <p><span class="label">Bookkeeping/AP responsible:</span> ${data.bookkeepingResponsible || "Not provided"}</p>
      <p><span class="label">Financial decision maker:</span> ${data.financialDecisionMaker || "Not provided"}</p>
      <p><span class="label">Outside advisor:</span> ${data.hasOutsideAdvisor || "Not provided"}</p>
    </div>

    <div class="section">
      <h2>Reporting</h2>
      <p><span class="label">Frequency:</span> ${data.reportingFrequency || "Not provided"}</p>
      ${data.reportingFrustrations ? `<p><span class="label">Frustrations:</span> ${data.reportingFrustrations}</p>` : ""}
    </div>

    ${data.anythingElse ? `
    <div class="section">
      <h2>Additional Notes</h2>
      <p>${data.anythingElse}</p>
    </div>
    ` : ""}

  </div>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: QuestionnaireData = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Saving questionnaire submission for:", data.name, data.email);

    // Save to database
    const { error: dbError } = await supabase
      .from("questionnaire_submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company_name: data.companyName,
        business_description: data.businessDescription || null,
        accounting_tool: data.accountingTool || null,
        payroll_tool: data.payrollTool || null,
        other_tools: data.otherTools || null,
        pain_points: data.painPoints,
        pain_points_other: data.painPointsOther || null,
        recent_issues: data.recentIssues,
        recent_issues_details: data.recentIssuesDetails || null,
        goals: data.goals || null,
        bookkeeping_responsible: data.bookkeepingResponsible || null,
        financial_decision_maker: data.financialDecisionMaker || null,
        has_outside_advisor: data.hasOutsideAdvisor || null,
        reporting_frequency: data.reportingFrequency || null,
        reporting_frustrations: data.reportingFrustrations || null,
        readiness_level: data.readinessLevel || null,
        anything_else: data.anythingElse || null,
        status: "new",
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save submission: ${dbError.message}`);
    }

    console.log("Submission saved to database");

    // Send email notification
    console.log("Sending questionnaire email for:", data.name, data.email);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TauBridge <onboarding@resend.dev>",
        to: ["sales@taubridge.com"],
        reply_to: data.email,
        subject: `📋 Pre-Call Questionnaire: ${data.name} from ${data.companyName}`,
        html: formatQuestionnaireEmail(data),
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      // Don't throw - the submission is saved, email is secondary
      console.log("Email failed but submission was saved successfully");
    } else {
      console.log("Email sent successfully:", result);
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error processing questionnaire:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
