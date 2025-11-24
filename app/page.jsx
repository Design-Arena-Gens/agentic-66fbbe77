"use client";

const dataSources = [
  {
    name: "Google Maps Places API",
    purpose: "Primary business discovery and baseline metadata enrichment",
    coverage: "Global",
    access: "Requires API key with Places Details and Text Search quota"
  },
  {
    name: "JustDial Scraper/API",
    purpose: "High-density Indian business listings with rich contact info",
    coverage: "India",
    access: "Hybrid: official partner API or controlled scraping via rotating proxies"
  },
  {
    name: "IndiaMART Seller Directory",
    purpose: "B2B vendor discovery and supplementary contact enrichment",
    coverage: "India",
    access: "Scrape with authenticated session; rate limiting mitigation required"
  },
  {
    name: "Facebook Graph API / Pages",
    purpose: "Surface small businesses with active social presence",
    coverage: "Global",
    access: "App review for `pages_read_engagement`; fall back to headless browser scraping"
  },
  {
    name: "Instagram Basic Display API",
    purpose: "Identify businesses prioritizing social over web presence",
    coverage: "Global",
    access: "App in live mode; scheduling to rotate long-lived tokens"
  },
  {
    name: "Local Business Directories",
    purpose: "City/state specific portals: Chamber of Commerce, Yellow Pages variants",
    coverage: "Regional",
    access: "Pluggable crawlers with schema-driven extractors"
  }
];

const inputs = [
  "Target geography: city, state, country (all optional but at least one required)",
  "Business vertical(s): selectable taxonomy with support for free-form keywords",
  "Lead count cap: default 50, max 500 per run to control API costs",
  "Quality focus: user toggles between 'No Website', 'Outdated Website', or 'Both'",
  "Freshness threshold: restrict results to businesses updated within the last N months",
  "Output channel: dashboard view, downloadable CSV/XLSX, webhook to CRM"
];

const outputs = [
  "Opportunity report: consolidated table with business identity + contact enrichment",
  "Website status tag: `No Website`, `Suspected No Website`, `Needs Modernization`, `Satisfactory`",
  "Website quality score (0-100) with rubric across UX, responsiveness, SEO, tech stack age",
  "Lead prioritization: computed opportunity score factoring website status, market fit, recency",
  "Action playbook: auto-generated outreach notes, suggested service pitch angle",
  "Audit trail: capture source evidence links, timestamps, extraction method for compliance"
];

const architectureLayers = [
  {
    title: "Presentation Layer",
    items: [
      "Next.js web dashboard hosted on Vercel with server actions for triggering agent runs",
      "Admin workspace for campaign presets, API quota monitoring, result review",
      "Download/export microservice generating CSV/XLSX via serverless edge functions"
    ]
  },
  {
    title: "Agent Orchestration Layer",
    items: [
      "LangGraph or CrewAI style orchestrator managing multi-tool itineraries",
      "Task memory via Redis (Upstash) to persist intermediate business entities",
      "Retry logic and circuit breakers per data source to maintain SLAs"
    ]
  },
  {
    title: "Data Acquisition Layer",
    items: [
      "Tool adapters for each directory/API with unified interface and rate-limit governance",
      "Headless browser pool (Playwright) for dynamic sites and login workflows",
      "Proxy management (Bright Data / ScraperAPI) with geo-targeted egress"
    ]
  },
  {
    title: "Enrichment & Analysis Layer",
    items: [
      "Contact enrichment via Hunter.io/Dropcontact when emails missing",
      "Website crawler leveraging Lighthouse CI + Core Web Vitals capture",
      "Custom vision model to detect design age cues (mobile viewport screenshots)"
    ]
  },
  {
    title: "Storage & Knowledge Layer",
    items: [
      "PostgreSQL (Supabase) for relational storage of businesses, runs, scoring metrics",
      "Vector store (Supabase pgvector) for semantic deduplication across sources",
      "Object storage (Supabase Storage/S3) for HTML snapshots and screenshot artifacts"
    ]
  },
  {
    title: "Automation & Delivery Layer",
    items: [
      "Workflow engine (Temporal/Trigger.dev) for scheduled territory sweeps",
      "Webhook integration to CRM (HubSpot, Pipedrive) with mapping templates",
      "Email notifier summarizing top leads after each agent run"
    ]
  }
];

const qualityRubric = [
  {
    dimension: "Technical Health",
    signals:
      "HTTPS enforcement, security headers, server response time, uptime history from simple checks"
  },
  {
    dimension: "UX & Responsiveness",
    signals:
      "Mobile viewport fidelity, responsive breakpoints, layout stability (CLS), accessibility score"
  },
  {
    dimension: "Brand & Content Freshness",
    signals:
      "Design modernity via screenshot similarity, copyright year, latest blog/news update, social links"
  },
  {
    dimension: "SEO & Discoverability",
    signals:
      "Meta tags completeness, schema.org presence, PageSpeed SEO score, backlink authority proxy"
  },
  {
    dimension: "Conversion Readiness",
    signals:
      "Presence of CTAs, online booking/contact forms, chatbot/live chat, testimonial recency"
  }
];

const phases = [
  {
    name: "Phase 1 – Foundations (Weeks 1-2)",
    focus:
      "Project setup, core data ingestion adapters (Google Maps, JustDial), baseline UI + database schema",
    exits: [
      "User can submit search criteria and receive deduplicated business list",
      "At least two data sources integrated with rate-limit handling",
      "PostgreSQL schema validated with primary entities seeded"
    ]
  },
  {
    name: "Phase 2 – Website Intelligence (Weeks 3-4)",
    focus:
      "Automated website detection, screenshot capture, Lighthouse scoring, initial quality rubric weighting",
    exits: [
      "Website crawler labels `No Website` vs `Needs Review` with 90% precision",
      "Quality score v1 with exportable report feed",
      "Storage of artifacts (screenshots, extracts) linked to each lead"
    ]
  },
  {
    name: "Phase 3 – Agent Autonomy (Weeks 5-6)",
    focus:
      "Multi-step agent reasoning, enrichment expansions, CRM delivery, scheduled automations",
    exits: [
      "Agent orchestrator handles branching (e.g., fallback to social sources)",
      "Webhook exports + Slack/email alerts operational",
      "Retry/resume framework for long-running harvest jobs"
    ]
  },
  {
    name: "Phase 4 – Optimization & Hardening (Weeks 7-8)",
    focus:
      "Monitoring, analytics, performance scaling, compliance guardrails, premium reporting UX",
    exits: [
      "Observability dashboards (Grafana/Metabase) tracking run success + coverage gaps",
      "AB-tested scoring weights with SME review loop",
      "Security review completed; rate-limit cost controls enforced"
    ]
  }
];

const risks = [
  {
    title: "Rate Limiting & Cost Spikes",
    mitigation:
      "Adaptive throttling, per-source budget caps, nightly usage reports, sandbox keys for staging"
  },
  {
    title: "Scraping Compliance",
    mitigation:
      "Respect robots.txt where required, credential rotation with audit trail, legal review for ToS alignment"
  },
  {
    title: "Data Quality & Duplication",
    mitigation:
      "Fuzzy matching + vector similarity for cross-source dedupe, human review workflow for edge cases"
  },
  {
    title: "Website Quality Scoring Bias",
    mitigation:
      "Continuous feedback loop, SME-labelled training data, explainable scoring components for transparency"
  },
  {
    title: "Scalability Under Demand Peaks",
    mitigation:
      "Horizontal scaling of scraping workers via serverless containers, queue backpressure strategies"
  }
];

const techStack = [
  {
    layer: "Frontend",
    tools:
      "Next.js 14 (App Router), Tailwind or custom CSS, Zustand for lightweight state, Tremor for charts"
  },
  {
    layer: "Backend/API",
    tools: "Next.js Route Handlers, Supabase PostgREST, Prisma ORM, Edge Functions for light tasks"
  },
  {
    layer: "Agents",
    tools:
      "LangChain/LangGraph, OpenAI GPT-4.1 for reasoning, function calling tools for API wrappers, Redis for session memory"
  },
  {
    layer: "Data Processing",
    tools:
      "Python microservices (FastAPI) for scraping and Lighthouse, Playwright workers on AWS Fargate"
  },
  {
    layer: "Messaging & Automation",
    tools: "Temporal/Trigger.dev workflows, Slack + email notifications, Webhook dispatcher service"
  },
  {
    layer: "Observability",
    tools:
      "Grafana Cloud, OpenTelemetry instrumentation, Metabase dashboards, Sentry for frontend/back"
  }
];

const metrics = [
  "Source coverage (% of leads per directory vs target)",
  "Website detection accuracy vs manual review sample",
  "Average quality score per run and distribution of score drivers",
  "Opportunity score lift correlated with outreach conversions (once feedback integrated)",
  "Run time per 50 leads and API cost per lead",
  "Failure rate segmented by source, reason, and time of day"
];

const workflowSteps = [
  {
    step: "Scoping",
    detail:
      "Validate inputs, expand geographic radius heuristically, seed search queries and synonyms, initialize run tracker."
  },
  {
    step: "Discovery Sweep",
    detail:
      "Parallelize data source crawlers with shared throttling. Capture raw listings, persist to staging tables."
  },
  {
    step: "Entity Resolution",
    detail:
      "Normalize business names, addresses, and coordinates. Deduplicate via fuzzy matching, vector semantic similarity, and GPS radius."
  },
  {
    step: "Website Intelligence",
    detail:
      "Attempt website detection via structured fields, social bios, Google results, WHOIS, and fallback web search. Queue Lighthouse audits and screenshot capture."
  },
  {
    step: "Quality Scoring",
    detail:
      "Aggregate signals into weighted rubric, calibrate with reference baselines. Flag outdated tech indicators (e.g., jQuery heavy, non-HTTPS)."
  },
  {
    step: "Enrichment & Output",
    detail:
      "Pull contact emails via enrichment APIs, compose outreach notes, finalize report rows, push to dashboard + exports + downstream integrations."
  }
];

const automationMatrix = [
  {
    frequency: "On-Demand",
    jobs: "User-triggered territory scans, ad-hoc vertical deep-dives, manual reruns after adjustments."
  },
  {
    frequency: "Daily",
    jobs: "Nightly incremental refresh for active campaigns, update scoring baselines, monitor API quota."
  },
  {
    frequency: "Weekly",
    jobs: "Full rescan of priority metros, analytics aggregation, drift detection on quality model."
  },
  {
    frequency: "Monthly",
    jobs: "System health audit, data retention cleanup, compliance & consent renewal checks."
  }
];

export default function Page() {
  return (
    <main>
      <section>
        <header>
          <h1>Website Opportunity Finder AI — Build Blueprint</h1>
          <span className="badge">Version 1.0</span>
        </header>
        <p>
          Comprehensive delivery plan for an AI agent that pinpoints small businesses lacking a
          modern web presence, assesses website quality, and surfaces prioritized outreach-ready
          leads.
        </p>
      </section>

      <section>
        <header>
          <h2>Mission Snapshot</h2>
          <span className="badge">Intent</span>
        </header>
        <div className="grid two">
          <div>
            <h3>Primary Objectives</h3>
            <ul>
              <li>Detect businesses missing a website or operating with outdated web experiences.</li>
              <li>Rank leads by revenue opportunity and outreach readiness.</li>
              <li>Produce actionable reports with contact details and evidence artifacts.</li>
            </ul>
          </div>
          <div>
            <h3>North Star Metrics</h3>
            <ul>
              {metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <header>
          <h2>Input & Output Contracts</h2>
          <span className="badge">UX & Data</span>
        </header>
        <div className="grid two">
          <div>
            <h3>Required Inputs</h3>
            <ul>
              {inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Deliverables</h3>
            <ul>
              {outputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <header>
          <h2>Data Source Strategy</h2>
          <span className="badge">Acquisition</span>
        </header>
        <div className="grid">
          {dataSources.map((source) => (
            <article key={source.name} className="timeline-item">
              <strong>{source.name}</strong>
              <span>{source.purpose}</span>
              <span>Coverage: {source.coverage}</span>
              <span>Access Model: {source.access}</span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h2>Target System Architecture</h2>
          <span className="badge">Layers</span>
        </header>
        <div className="grid">
          {architectureLayers.map((layer) => (
            <article key={layer.title} className="timeline-item">
              <strong>{layer.title}</strong>
              <ul>
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h2>Website Quality Rubric</h2>
          <span className="badge">Scoring</span>
        </header>
        <table className="table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Key Signals</th>
            </tr>
          </thead>
          <tbody>
            {qualityRubric.map((row) => (
              <tr key={row.dimension}>
                <td>{row.dimension}</td>
                <td>{row.signals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <header>
          <h2>Agent Workflow</h2>
          <span className="badge">Process</span>
        </header>
        <div className="timeline">
          {workflowSteps.map((item) => (
            <div className="timeline-item" key={item.step}>
              <strong>{item.step}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h2>Automation Cadence</h2>
          <span className="badge">Ops</span>
        </header>
        <table className="table">
          <thead>
            <tr>
              <th>Frequency</th>
              <th>Job Families</th>
            </tr>
          </thead>
          <tbody>
            {automationMatrix.map((entry) => (
              <tr key={entry.frequency}>
                <td>{entry.frequency}</td>
                <td>{entry.jobs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <header>
          <h2>Technology Stack</h2>
          <span className="badge">Tooling</span>
        </header>
        <div className="grid">
          {techStack.map((item) => (
            <article key={item.layer} className="timeline-item">
              <strong>{item.layer}</strong>
              <span>{item.tools}</span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h2>Delivery Roadmap</h2>
          <span className="badge">Timeline</span>
        </header>
        <div className="timeline">
          {phases.map((phase) => (
            <div className="timeline-item" key={phase.name}>
              <strong>{phase.name}</strong>
              <span>{phase.focus}</span>
              <ul>
                {phase.exits.map((exit) => (
                  <li key={exit}>{exit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h2>Risk Register</h2>
          <span className="badge">Mitigation</span>
        </header>
        <div className="grid two">
          {risks.map((risk) => (
            <article key={risk.title} className="timeline-item">
              <strong>{risk.title}</strong>
              <span>{risk.mitigation}</span>
            </article>
          ))}
        </div>
      </section>

      <section>
        <header>
          <h2>Governance & Compliance</h2>
          <span className="badge">Guardrails</span>
        </header>
        <div className="multi-column">
          <p>
            Establish consent-aware data policies, including explicit disclosure when contacting
            leads and honoring opt-out requests. Maintain evidence storage for scraped content to
            validate accuracy and provide proof of public availability. Regularly audit data source
            terms of service and rotate credentials securely via secrets manager with role-based
            access control. Implement PII encryption at rest and enforce least-privilege access to
            reporting exports.
          </p>
          <p>
            Embed observability hooks (OpenTelemetry) across agent pipelines to trace tool usage and
            API calls. Aggregate logs for anomaly detection and build automated alerts for sustained
            failure patterns or soft bans from data sources. Schedule quarterly pen-tests and include
            incident response runbooks with escalation contacts. Ensure GDPR/CCPA compliance for
            contact data, including purpose limitation and data retention policies.
          </p>
        </div>
      </section>

      <section>
        <header>
          <h2>Next Steps</h2>
          <span className="badge">Execution</span>
        </header>
        <div className="grid two">
          <div className="timeline-item">
            <strong>Immediate Actions</strong>
            <ul>
              <li>Kick-off sprint zero, finalize API keys, and provision Supabase project.</li>
              <li>Stand up repository mono-repo structure with shared types and infra configs.</li>
              <li>Define KPIs and set up baseline observability dashboards.</li>
            </ul>
          </div>
          <div className="timeline-item">
            <strong>Readiness Checklist</strong>
            <ul>
              <li>Legal review of scraping strategy and commercial data usage.</li>
              <li>QA rubric for website scoring validated with 25 sample businesses.</li>
              <li>Deployment automation (Vercel + Terraform) scripted and dry-run tested.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
