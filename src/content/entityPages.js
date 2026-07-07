export const entityPages = [
  {
    slug: "nestor-hire",
    title: "Nestor Hire",
    metaTitle: "Nestor Hire | Recruitment and Hiring Platform",
    metaDescription:
      "Nestor Hire is the recruitment and hiring platform from Nestor Services for public jobs, recruiter workflows, and resume-first hiring.",
    canonical: "https://www.nestorservices.in/nestor-hire",
    heroLabel: "Recruitment platform",
    heroTitle: "Nestor Hire",
    intro:
      "Nestor Hire is the recruitment and hiring platform from Nestor Services. It supports public jobs, resume-first hiring, recruiter workflows, and hiring pipeline coordination.",
    sections: [
      {
        title: "What it helps with",
        items: [
          "Public job publishing and candidate discovery",
          "Resume-first hiring and recruiter-led review",
          "Hiring pipeline support for active roles",
          "Candidate workflow coordination for employers and recruiters",
        ],
      },
      {
        title: "How it fits the Nestor ecosystem",
        body:
          "Nestor Hire is the employer-facing hiring surface in the Nestor ecosystem and connects with the broader Nestor Services brand.",
      },
    ],
    cta: {
      label: "Explore Nestor Hire",
      href: "https://hire.nestorservices.in",
    },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Nestor Hire",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://hire.nestorservices.in",
      publisher: {
        "@type": "Organization",
        name: "Nestor Services",
        url: "https://www.nestorservices.in/",
      },
    },
  },
  {
    slug: "nestor-core",
    title: "Nestor Core",
    metaTitle: "Nestor Core | HR Operations and Payroll Platform",
    metaDescription:
      "Nestor Core is the HR operations and payroll platform from Nestor Services for employee records, attendance, leave, and workforce workflows.",
    canonical: "https://www.nestorservices.in/nestor-core",
    heroLabel: "HR operations platform",
    heroTitle: "Nestor Core",
    intro:
      "Nestor Core is the HR operations and payroll platform from Nestor Services. It supports employee records, attendance, leave, payroll support, and workforce workflows.",
    sections: [
      {
        title: "What it helps with",
        items: [
          "Employee records and HR documentation",
          "Attendance and leave coordination",
          "Payroll support and workforce administration",
          "Operational workflows for HR and admin teams",
        ],
      },
      {
        title: "How it fits the Nestor ecosystem",
        body:
          "Nestor Core is the operational counterpart to Nestor Hire, helping teams manage employee workflows after hiring and throughout the employee lifecycle.",
      },
    ],
    cta: {
      label: "Explore Nestor Core",
      href: "https://core.nestorservices.in",
    },
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Nestor Core",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://core.nestorservices.in",
      publisher: {
        "@type": "Organization",
        name: "Nestor Services",
        url: "https://www.nestorservices.in/",
      },
    },
  },
  {
    slug: "recruitment-services",
    title: "Recruitment Services",
    metaTitle: "Recruitment Services | Nestor Services",
    metaDescription:
      "Nestor Services recruitment consulting supports India-focused mandates, curated shortlisting, role understanding, and recruiter-led screening.",
    canonical: "https://www.nestorservices.in/recruitment-services",
    heroLabel: "Recruitment consulting",
    heroTitle: "Recruitment Services",
    intro:
      "Nestor Services provides recruitment consulting and talent search support for India-focused mandates, with curated shortlisting and recruiter-led screening.",
    sections: [
      {
        title: "What it helps with",
        items: [
          "India-focused hiring mandates",
          "Curated candidate shortlisting",
          "Role understanding before outreach begins",
          "Recruiter-led screening and handoff support",
        ],
      },
      {
        title: "What the service is for",
        body:
          "This service is meant for employers who want a more accountable hiring process with closer role context and fewer generic submissions.",
      },
    ],
    cta: {
      label: "Contact Nestor Services",
      href: "mailto:shashank@nestorservices.in",
    },
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Recruitment Services",
      serviceType: "Recruitment consulting and talent search",
      provider: {
        "@type": "Organization",
        name: "Nestor Services",
        url: "https://www.nestorservices.in/",
      },
      areaServed: "India",
      url: "https://www.nestorservices.in/recruitment-services",
    },
  },
  {
    slug: "hr-operations-payroll",
    title: "HR Operations and Payroll",
    metaTitle: "HR Operations and Payroll Services | Nestor Services",
    metaDescription:
      "Nestor Services HR operations and payroll support helps with employee workflows, attendance, leave, payroll support, and workforce management.",
    canonical: "https://www.nestorservices.in/hr-operations-payroll",
    heroLabel: "HR operations and payroll services",
    heroTitle: "HR Operations and Payroll",
    intro:
      "Nestor Services supports HR operations and payroll workflows with employee records, attendance and leave coordination, payroll support, and operational clarity.",
    sections: [
      {
        title: "What it helps with",
        items: [
          "Employee lifecycle workflows",
          "Attendance and leave coordination",
          "Payroll support and HR documentation",
          "Workforce management and operational clarity",
        ],
      },
      {
        title: "What the service is for",
        body:
          "This service is intended for teams that need structured HR operations support alongside clear payroll and workforce workflows.",
      },
    ],
    cta: {
      label: "Contact Nestor Services",
      href: "mailto:shashank@nestorservices.in",
    },
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "HR Operations and Payroll",
      serviceType: "HR operations and payroll support",
      provider: {
        "@type": "Organization",
        name: "Nestor Services",
        url: "https://www.nestorservices.in/",
      },
      areaServed: "India",
      url: "https://www.nestorservices.in/hr-operations-payroll",
    },
  },
];

export function getEntityPage(slug) {
  return entityPages.find((page) => page.slug === slug) || null;
}
