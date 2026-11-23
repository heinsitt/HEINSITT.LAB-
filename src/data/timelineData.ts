export interface TimelineMilestone {
  id: string;
  period: string;
  stage: string;
  role: string;
  focus: string;
  summary: string;
  highlights: string[];
  stack: string;
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: '01',
    period: '2021 — 2022',
    stage: 'Stage 01 · Systems & Networking',
    role: 'Linux Administration & Edge Fundamentals',
    focus: 'OS Internals, TCP/IP & Reverse Proxies',
    summary:
      'Built strong foundations in Linux process isolation, systemd service hardening, DNS resolution, and high-availability Nginx reverse proxy topologies.',
    highlights: [
      'Configured automated TLS termination, firewall rulesets, and SSH bastion hardening across cloud VMs.',
      'Analyzed packet flows and connection pooling bottlenecks using tcpdump, ss, and curl timing profiles.',
    ],
    stack: 'Linux · Nginx · Bash · TCP/IP · TLS 1.3',
  },
  {
    id: '02',
    period: '2022 — 2023',
    stage: 'Stage 02 · Containers & Automation',
    role: 'Containerization & CI Pipeline Engineering',
    focus: 'Multi-Stage Docker Builds & Automated Testing',
    summary:
      'Transitioned workloads from manual host setups into reproducible, minimal container images paired with automated build and vulnerability pipelines.',
    highlights: [
      'Reduced container image attack surface by 70% using distroless and multi-stage build patterns.',
      'Standardized CI workflows with automated linting, container scanning, and semantic release tagging.',
    ],
    stack: 'Docker · Compose · GitHub Actions · Trivy · OCI',
  },
  {
    id: '03',
    period: '2023 — 2024',
    stage: 'Stage 03 · Kubernetes & GitOps',
    role: 'Declarative Cloud-Native Delivery',
    focus: 'Argo CD, Helm & Infrastructure as Code',
    summary:
      'Adopted declarative infrastructure provisioning with Terraform and pull-based Kubernetes delivery to eliminate environment drift across staging and production.',
    highlights: [
      'Designed modular Terraform VPC and cluster blueprints backed by remote state locking and OIDC auth.',
      'Implemented Argo CD + Helm release pipelines with progressive canary rollouts and automated rollbacks.',
    ],
    stack: 'Kubernetes · Argo CD · Helm · Terraform · AWS',
  },
  {
    id: '04',
    period: '2024 — 2025',
    stage: 'Stage 04 · Observability & Resilience',
    role: 'Telemetry, SLOs & eBPF Visibility',
    focus: 'Prometheus, Grafana, Loki & OpenTelemetry',
    summary:
      'Built full-stack observability pipelines connecting host metrics, structured logs, and distributed traces to actionable error-budget alerting.',
    highlights: [
      'Deployed unified Prometheus + Loki + Grafana stacks provisioned strictly as code.',
      'Explored kernel-level eBPF service mapping with Cilium Hubble and OpenTelemetry tail sampling.',
    ],
    stack: 'Prometheus · Grafana · Loki · OpenTelemetry · Cilium',
  },
  {
    id: '05',
    period: '2025 — Present',
    stage: 'Stage 05 · Kinetic Systems & Web Craft',
    role: 'Cloud Engineer & Creative Frontend Builder',
    focus: 'Interactive Architecture Visualizers & Studio UI',
    summary:
      'Bridging resilient backend infrastructure with expressive, high-frame-rate web interfaces that make complex distributed topologies tangible and inspectable.',
    highlights: [
      'Engineered HEINSITT.LAB as an interactive kinetic sandbox for inspecting live architectural patterns.',
      'Combined damped pointer physics, scroll-linked SVG instrumentation, and strict accessibility craft.',
    ],
    stack: 'React · TypeScript · Tailwind CSS · Motion · SVG',
  },
];
