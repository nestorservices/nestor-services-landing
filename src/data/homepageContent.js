export const HOMEPAGE_TITLE = "Nestor Services — Your Workforce Partner | Recruitment & Talent Acquisition";
export const HOMEPAGE_DESCRIPTION =
  "Nestor Services supports employers and candidates in India with recruitment and talent acquisition. Nestor Hire supports hiring, Nestor Assess is invitation-only, and Nestor Core is in development / pilot.";

export const candidates = [
  {
    icon: "↗",
    title: "Explore open roles",
    body: "Browse current openings from employers hiring through Nestor Hire and apply with your CV.",
    href: "https://hire.nestorservices.in/jobs",
    label: "Browse jobs on Nestor Hire",
    external: true,
  },
  {
    icon: "✓",
    title: "Received an assessment invitation?",
    body: "Nestor Assess is for candidates invited to complete an assessment. Review how to verify your invitation before continuing.",
    href: "/nestor-assess",
    label: "Assessment access and safety",
  },
  {
    icon: "i",
    title: "Understand the application process",
    body: "Learn what can happen after you apply and how to follow up with context.",
    href: "/blog/what-happens-after-you-apply",
    label: "What happens after you apply",
  },
];

export const products = [
  {
    key: "hire",
    accent: "#60a5fa",
    category: "Recruitment & ATS technology",
    name: "Nestor Hire",
    audience: "For employers & recruiters",
    headline: "Recruitment workflows built around role fit.",
    description:
      "Nestor Hire supports public job listings, candidate discovery, resume-first review, and recruiter-led hiring workflows.",
    features: ["Public job listings", "Candidate discovery", "Resume-first review", "Hiring pipeline coordination"],
    href: "https://hire.nestorservices.in",
    label: "Explore Nestor Hire",
    external: true,
  },
  {
    key: "core",
    accent: "#22d3ee",
    category: "HR operations",
    name: "Nestor Core",
    audience: "For employers & recruiters",
    status: "In development / pilot",
    headline: "An operational layer for employee workflows.",
    description:
      "Nestor Core is being developed for HR operations such as employee records, attendance, leave, and payroll support. Availability is currently limited to development and pilot use.",
    features: ["Employee records", "Attendance and leave", "Payroll support", "Workforce workflows"],
    href: "/nestor-core",
    label: "About Nestor Core",
  },
  {
    key: "assess",
    accent: "#a5b4fc",
    category: "Invitation-based assessments",
    name: "Nestor Assess",
    audience: "For invited candidates",
    headline: "A clear assessment step in the hiring process.",
    description:
      "Nestor Assess gives invited candidates access to an assessment for a role they applied to. It is not a public self-assessment service.",
    features: ["Invitation-based access", "Official candidate guidance", "Online assessment workspace"],
    href: "/nestor-assess",
    label: "Assessment access and safety",
    portalHref: "https://assess.nestorservices.in",
    portalLabel: "Open your assessment (invitation required)",
  },
];

export const employerTiers = [
  {
    step: "01 · TRY US",
    title: "One role, filled free",
    body: "Share a critical opening. We fill it, fast. See the quality before you commit to anything.",
    freeLabel: "Free to start",
  },
  {
    step: "02 · SCALE",
    title: "Per-hire or managed",
    body: "Pay per successful hire, or let us run all your hiring as your managed recruitment team — with the ATS included.",
  },
  {
    step: "03 · PARTNER",
    title: "Full HR, handled",
    body: "Empanel for HR end to end — hiring, operations and payroll — partly or fully, with staff on our payroll where you need people on site.",
  },
];

export const empanelmentPoints = [
  "Recruitment, assessment and HR under one partner",
  "Key hires and volume — right talent, right market price",
  "Take as little or as much as you need",
  "Real cost control, no compromise on quality",
];

export const FIRST_ROLE_HREF = "mailto:shashank@nestorservices.in?subject=Hiring%20requirement%20(free%20first%20role)";
export const EMPANELMENT_HREF = "mailto:shashank@nestorservices.in?subject=Empanelment%20enquiry";

export const credibility = [
  {
    title: "Talent acquisition experience",
    body: "Founder-led work informed by more than 15 years in HR and talent acquisition across different business environments.",
  },
  {
    title: "Accountable and founder-led",
    body: "Nestor Services is led by its founder, with direct communication around each hiring or HR operations requirement.",
  },
  {
    title: "Based in India",
    body: "Based in Gurugram, Nestor Services works with the realities of hiring and workforce operations in India.",
  },
];
