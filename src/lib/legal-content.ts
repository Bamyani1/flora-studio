export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const LEGAL_LAST_UPDATED = "March 30, 2026";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "who-this-policy-covers",
    title: "Who This Policy Covers",
    paragraphs: [
      "This Privacy Policy applies to people who visit this website, submit an inquiry, communicate with Bahar Studio, or book photography services through Bahar Studio. It describes how Bahar Studio collects, uses, stores, and discloses personal information in connection with the website and the studio's manual business operations.",
      "Some project-specific details may also be governed by separate contracts, releases, written communications, or other client-facing documents. When those documents apply, they work alongside this Privacy Policy rather than replacing it entirely.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    paragraphs: [
      "Bahar Studio keeps data collection deliberately limited. Through the website, Bahar Studio currently collects only the information a visitor chooses to submit through the contact form, along with a hidden anti-spam field used to help detect automated abuse.",
      "Outside the website, Bahar Studio may also maintain manual business records needed to communicate with clients and run photography projects.",
    ],
    bullets: [
      "Website inquiry details such as name, email address, photography type, and message contents.",
      "Email correspondence, contracts or agreements exchanged by email, and client or project communications.",
      "Basic transaction or payment-related records kept manually for bookkeeping and business administration.",
      "Client work records such as photographs, edited images, deliverables, and related project files where applicable.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    paragraphs: [
      "Bahar Studio uses personal information to respond to inquiries, evaluate availability, discuss requested services, prepare and perform booked photography work, deliver finished work, maintain project and business records, and comply with legal obligations.",
      "Information may also be used to help protect the website, email workflows, and inquiry process against spam, fraud, misuse, or other abusive activity.",
    ],
  },
  {
    id: "when-we-share-information",
    title: "When We Share Information",
    paragraphs: [
      "Bahar Studio does not sell personal information and does not share personal information for cross-context behavioral advertising. Bahar Studio does not currently use advertising pixels, data-broker integrations, or similar marketing-tracking tools on this site.",
      "Bahar Studio may disclose personal information to service providers that support website hosting, website content infrastructure, email delivery, or storage and sync operations, and may also disclose information when reasonably necessary to comply with law, enforce rights, or protect people, property, or the business.",
    ],
  },
  {
    id: "service-providers-and-infrastructure",
    title: "Service Providers and Infrastructure",
    paragraphs: [
      "Bahar Studio currently relies on a small set of third-party providers to operate the website and core communications. These providers support infrastructure and operations, but they do not all handle the same types of data.",
    ],
    bullets: [
      "Apple/iCloud Mail is used for inquiry delivery, mailbox operations, and related email communications.",
      "Apple ecosystem storage and sync tools may be used to store or synchronize business records, contracts, project communications, and related files.",
      "Sanity is used for website content and media infrastructure only. Based on the current site implementation, website inquiry submissions are not stored in Sanity.",
      "Vercel is used for website hosting and infrastructure.",
    ],
  },
  {
    id: "client-work-portfolio-use-and-releases",
    title: "Client Work, Portfolio Use, and Releases",
    paragraphs: [
      "Bahar Studio's services may involve adults, families, or minors who are booked through a parent, guardian, or other adult. The existence of a photography project may therefore involve personal information and image data connected to more than one person.",
      "Public portfolio, social, or editorial use of client images occurs only when Bahar Studio has permission, a release, contractual authorization, or another appropriate legal basis. Public display rights for client work are not assumed by default.",
    ],
  },
  {
    id: "retention",
    title: "Retention",
    paragraphs: [
      "Bahar Studio retains information only for as long as reasonably necessary for the purposes described in this Privacy Policy, unless a longer period is required or permitted by law, dispute-resolution needs, or legitimate business recordkeeping.",
    ],
    bullets: [
      "Unbooked inquiries may be retained for up to 24 months after the last meaningful interaction, unless longer retention is needed for legal, dispute, or recordkeeping reasons.",
      "Booked-client and project records, including session files and deliverables, may be retained on a case-by-case basis as reasonably necessary for the project, re-edits, backups, contractual obligations, legal or business recordkeeping, or related follow-up work.",
      "Basic transaction and business records may be retained as needed for bookkeeping, tax, legal, and operational purposes.",
    ],
  },
  {
    id: "cookies-and-similar-technologies",
    title: "Cookies and Similar Technologies",
    paragraphs: [
      "At the time of this policy, Bahar Studio uses only essential or operational technologies needed to run the site and support the contact workflow. Bahar Studio does not currently use analytics cookies, advertising pixels, session-replay tools, or other non-essential tracking technologies on this website.",
      "If Bahar Studio adds non-essential analytics, advertising, or similar tools in the future, this Privacy Policy and the site's consent choices will be updated before or when those tools are activated.",
    ],
  },
  {
    id: "us-privacy-rights",
    title: "U.S. Privacy Rights",
    paragraphs: [
      "Depending on where a person lives and the context of the relationship, U.S. privacy laws may provide rights such as the right to know what information is collected, request access, request correction, request deletion, request portability where applicable, opt out of certain sale, sharing, or targeted-advertising practices where applicable, receive equal service without unlawful discrimination, and appeal a denial where applicable.",
      "California residents may have rights under the California Consumer Privacy Act, as amended by the California Privacy Rights Act, depending on the circumstances. Bahar Studio is based in Ohio, and as of March 30, 2026, Ohio does not currently have a comparable omnibus consumer privacy law. Bahar Studio nevertheless offers a single email intake path for privacy requests and will review requests in light of applicable law.",
      "If Bahar Studio introduces future sale, sharing, or targeted-advertising activities that trigger opt-out requirements, Bahar Studio will honor legally required preference signals, including Global Privacy Control where applicable.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    paragraphs: [
      "This website is not directed to children under 13, and Bahar Studio does not knowingly collect personal information from children through the website. Parents or guardians who believe a child has submitted personal information through the website may contact info@studiobahar.com to request review and deletion where appropriate.",
      "This section applies to website use. It does not prevent Bahar Studio from providing adult-booked photography services that may involve minors when handled through a parent, guardian, or other authorized adult.",
    ],
  },
  {
    id: "international-visitors",
    title: "International Visitors",
    paragraphs: [
      "Bahar Studio operates in the United States. If you access the website or communicate with Bahar Studio from outside the United States, your information may be processed, transferred, and stored in the United States or in systems that support U.S.-based business operations.",
    ],
  },
  {
    id: "changes-and-contact",
    title: "Changes and Contact",
    paragraphs: [
      "Bahar Studio may update this Privacy Policy from time to time to reflect changes in law, business practices, or the website. When Bahar Studio updates the policy, the revised version will be posted on this page with a new last-updated date.",
      "Privacy requests, questions, and appeals may be sent to info@studiobahar.com.",
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "use-of-the-site",
    title: "Use of the Site",
    paragraphs: [
      "This website is provided for personal, informational, and inquiry purposes. You may browse the site, review portfolio materials, and contact Bahar Studio about potential services, subject to these Terms of Service and applicable law.",
      "You may not use the site in a way that is unlawful, abusive, disruptive, fraudulent, security-invasive, or intended to interfere with the website, its infrastructure, or other users' ability to access it.",
    ],
  },
  {
    id: "ownership-of-content",
    title: "Ownership of Content",
    paragraphs: [
      "Unless otherwise stated, all photography, imagery, text, branding, layout, design elements, and other content presented on this website are owned by or licensed to Bahar Studio and are protected by copyright, trademark, and other applicable laws.",
    ],
  },
  {
    id: "prohibited-uses-of-content",
    title: "Prohibited Uses of Content",
    paragraphs: [
      "Without prior written permission from Bahar Studio, you may not copy, reproduce, republish, distribute, commercially exploit, or create derivative works from the website or its contents.",
    ],
    bullets: [
      "Scrape or systematically harvest site content or imagery.",
      "Bulk download or extract photographs, text, or metadata.",
      "Create datasets, archives, or mirrors from the site content.",
      "Use site content for artificial intelligence or machine learning training, ingestion, fine-tuning, or related model-development purposes.",
    ],
  },
  {
    id: "inquiries-are-not-contracts",
    title: "Inquiries Are Not Contracts",
    paragraphs: [
      "Sending an inquiry, email, or message to Bahar Studio does not create a booking, contract, partnership, agency relationship, or obligation to provide services. Availability, pricing, deliverables, timelines, and service commitments are not final until the parties enter into a separate written agreement.",
    ],
  },
  {
    id: "client-work-and-public-display",
    title: "Client Work and Public Display",
    paragraphs: [
      "Any client-service terms, deliverables, usage rights, releases, cancellation terms, and related obligations are governed by separate written agreements between Bahar Studio and the client. These site terms do not replace or override those agreements.",
      "Any public display or portfolio use of client work depends on permission, release, contractual authorization, or another appropriate legal basis.",
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    paragraphs: [
      "This website may link to third-party platforms or websites for convenience, including social platforms or portfolio networks. Bahar Studio does not control those third-party services, and their availability, terms, and privacy practices are governed by their own policies.",
    ],
  },
  {
    id: "site-availability-and-accuracy",
    title: "Site Availability and Accuracy",
    paragraphs: [
      "Bahar Studio may update, revise, suspend, or remove website content at any time without notice. While Bahar Studio aims to present accurate and current information, the site may include errors, omissions, outdated material, or temporary inaccuracies.",
    ],
  },
  {
    id: "disclaimer-of-warranties",
    title: "Disclaimer of Warranties",
    paragraphs: [
      "To the fullest extent permitted by law, the website and its contents are provided on an as-is and as-available basis, without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, Bahar Studio will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of data, profits, goodwill, business opportunity, or other intangible losses arising out of or relating to your use of, inability to use, or reliance on this website.",
      "These site terms address website use only and do not set the liability framework for any separate client-services agreement.",
    ],
  },
  {
    id: "governing-law-and-venue",
    title: "Governing Law and Venue",
    paragraphs: [
      "These Terms of Service are governed by the laws of the State of Ohio, without regard to conflict-of-law principles. Any dispute arising out of or relating to these Terms or the use of this website must be brought in the applicable state or federal courts located in Ohio.",
    ],
  },
  {
    id: "changes-to-these-terms",
    title: "Changes to These Terms",
    paragraphs: [
      "Bahar Studio may revise these Terms of Service from time to time. Updated terms become effective when posted on this page with a revised last-updated date.",
    ],
  },
];
