export type LabCategory = 'All' | 'GitOps & Containers' | 'Observability' | 'Cloud & Web';

export interface DiagramNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  tone: 'cyan' | 'indigo' | 'emerald';
  role: string;
  protocol: string;
  detail: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label: string;
  isFailover?: boolean;
}

export interface LabMetric {
  label: string;
  value: string;
  context: string;
}

export interface LabModule {
  id: string;
  slug: string;
  category: Exclude<LabCategory, 'All'>;
  environment: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string[];
  primaryMetric: string;
  metrics: LabMetric[];
  takeaways: string[];
  diagram: {
    caption: string;
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  };
}

export const LAB_CATEGORIES: LabCategory[] = [
  'All',
  'GitOps & Containers',
  'Observability',
  'Cloud & Web',
];

export const LAB_MODULES: LabModule[] = [
  {
    id: 'LAB-01',
    slug: 'gitops-cd-argo-helm',
    category: 'GitOps & Containers',
    environment: 'Kubernetes Cluster',
    title: 'GitOps CD Pipeline with Argo CD & Helm',
    summary:
      'Declarative pull-based delivery syncing multi-environment Helm charts with automated drift detection and progressive canary rollouts.',
    problem:
      'Imperative CI scripts pushing kubectl manifests directly into clusters created configuration drift, fragile rollback paths, and exposed cluster credentials inside build runners.',
    solution:
      'Replaced push deployments with an in-cluster Argo CD controller reconciling signed Git commits against umbrella Helm values, pairing Argo Rollouts with Prometheus metric gates for zero-downtime promotion.',
    techStack: ['Argo CD', 'Helm v3', 'Kubernetes', 'GitHub Actions', 'Kustomize'],
    primaryMetric: '38s Sync P95',
    metrics: [
      { label: 'Reconciliation P95', value: '38s', context: 'Commit to healthy pod readiness' },
      { label: 'Rollback Time', value: '11s', context: 'Instant Git revision revert' },
      { label: 'Drift Detection', value: '100%', context: 'Continuous 3m state loop' },
    ],
    takeaways: [
      'Eliminated cluster admin credentials from external CI runners using pull-only reconciliation.',
      'Structured environment overlays with Helm values per stage to keep base manifests DRY.',
      'Automated canary analysis aborts rollout when HTTP 5xx error budget burn exceeds 1%.',
    ],
    diagram: {
      caption: 'Pull-based GitOps reconciliation loop with progressive canary traffic gating',
      nodes: [
        {
          id: 'git',
          label: 'Git Repository',
          sublabel: 'Signed Manifests',
          x: 95,
          y: 150,
          tone: 'indigo',
          role: 'Single Source of Truth',
          protocol: 'SSH / HTTPS Webhook',
          detail: 'Stores versioned Helm charts, Kustomize overlays, and sealed environment configs.',
        },
        {
          id: 'ci',
          label: 'CI Build Runner',
          sublabel: 'Container + Cosign',
          x: 265,
          y: 70,
          tone: 'cyan',
          role: 'Artifact Producer',
          protocol: 'OCI Registry Push',
          detail: 'Builds multi-arch images, runs Trivy vulnerability scans, and updates image tag PRs.',
        },
        {
          id: 'argo',
          label: 'Argo CD Controller',
          sublabel: 'State Reconciler',
          x: 265,
          y: 225,
          tone: 'emerald',
          role: 'GitOps Sync Engine',
          protocol: 'Kubernetes Watch API',
          detail: 'Detects live vs. desired state diff and synchronizes Helm releases automatically.',
        },
        {
          id: 'rollout',
          label: 'Argo Rollouts',
          sublabel: 'Canary Controller',
          x: 455,
          y: 150,
          tone: 'cyan',
          role: 'Traffic Shaper',
          protocol: 'Weighted Service Split',
          detail: 'Shifts traffic in 10% -> 50% -> 100% increments while querying health gates.',
        },
        {
          id: 'pods',
          label: 'Workload Pods',
          sublabel: 'Prod Namespace',
          x: 625,
          y: 150,
          tone: 'emerald',
          role: 'Runtime Compute',
          protocol: 'mTLS Mesh / HTTP2',
          detail: 'Immutable container replicas running across multi-AZ worker nodes with PodDisruptionBudgets.',
        },
      ],
      edges: [
        { from: 'git', to: 'ci', label: 'Tag Push' },
        { from: 'ci', to: 'git', label: 'Digest Bump' },
        { from: 'git', to: 'argo', label: 'Pull Poll' },
        { from: 'argo', to: 'rollout', label: 'Apply Diff' },
        { from: 'rollout', to: 'pods', label: 'Promote 100%' },
        { from: 'rollout', to: 'argo', label: 'Abort / Revert', isFailover: true },
      ],
    },
  },
  {
    id: 'LAB-02',
    slug: 'containerized-monitoring-stack',
    category: 'Observability',
    environment: 'Telemetry Stack',
    title: 'Containerized Monitoring & Telemetry Stack',
    summary:
      'Unified metrics, structured logs, and Alertmanager routing deployed via Docker Compose and Prometheus service discovery.',
    problem:
      'Diagnosing memory pressure and tail-latency spikes across ephemeral containers required manual SSH sessions and fragmented log tailing with zero historical baseline.',
    solution:
      'Engineered an observability stack combining Prometheus scrapers, cAdvisor, Node Exporter, and Loki with Grafana provisioning-as-code so dashboards and SLO alerts boot reproducibly.',
    techStack: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'cAdvisor'],
    primaryMetric: '15s Scrape Cycle',
    metrics: [
      { label: 'Scrape Interval', value: '15s', context: 'High-resolution host & container metrics' },
      { label: 'Alert Triage', value: '< 45s', context: 'Symptom-based routing latency' },
      { label: 'Log Retention', value: '30d', context: 'Indexed JSON label streams' },
    ],
    takeaways: [
      'Provisioned Grafana dashboards and datasources declaratively in YAML for zero-click setup.',
      'Tuned PromQL recording rules to pre-aggregate P95/P99 latency histograms under load.',
      'Routed Alertmanager inhibition rules to suppress noisy downstream pod alerts during node drains.',
    ],
    diagram: {
      caption: 'Unified metric scraping, structured log aggregation, and SLO alert pipeline',
      nodes: [
        {
          id: 'targets',
          label: 'Container Targets',
          sublabel: 'cAdvisor + App /metrics',
          x: 95,
          y: 95,
          tone: 'cyan',
          role: 'Telemetry Emitters',
          protocol: 'HTTP OpenMetrics',
          detail: 'Exposes CPU throttling, RSS memory, HTTP latency buckets, and Go/Node runtime stats.',
        },
        {
          id: 'promtail',
          label: 'Promtail Agent',
          sublabel: 'JSON Log Shipper',
          x: 95,
          y: 215,
          tone: 'indigo',
          role: 'Log Collector',
          protocol: 'Docker Socket Stream',
          detail: 'Parses container stdout/stderr streams, attaches service labels, and batches log chunks.',
        },
        {
          id: 'prom',
          label: 'Prometheus TSDB',
          sublabel: 'Pull Scraper + Rules',
          x: 315,
          y: 95,
          tone: 'emerald',
          role: 'Time-Series Engine',
          protocol: 'PromQL Evaluation',
          detail: 'Scrapes endpoints every 15s and evaluates multi-window burn-rate alert rules.',
        },
        {
          id: 'loki',
          label: 'Grafana Loki',
          sublabel: 'Label-Indexed Logs',
          x: 315,
          y: 215,
          tone: 'indigo',
          role: 'Log Storage',
          protocol: 'LogQL Streams',
          detail: 'Stores compressed log chunks indexed solely by metadata labels for low memory overhead.',
        },
        {
          id: 'grafana',
          label: 'Grafana Unified UI',
          sublabel: 'SLO + Trace Correlator',
          x: 540,
          y: 115,
          tone: 'cyan',
          role: 'Visualization Layer',
          protocol: 'Dashboard Provisioning',
          detail: 'Correlates metric spikes directly with matching container log windows on one timeline.',
        },
        {
          id: 'alert',
          label: 'Alertmanager',
          sublabel: 'Dedupe & Routing',
          x: 540,
          y: 225,
          tone: 'emerald',
          role: 'Incident Dispatcher',
          protocol: 'Webhook / Slack',
          detail: 'Groups correlated alerts, applies silence windows, and dispatches actionable runbooks.',
        },
      ],
      edges: [
        { from: 'targets', to: 'prom', label: 'Scrape 15s' },
        { from: 'promtail', to: 'loki', label: 'Push Batch' },
        { from: 'prom', to: 'grafana', label: 'PromQL' },
        { from: 'loki', to: 'grafana', label: 'LogQL' },
        { from: 'prom', to: 'alert', label: 'Fire Rule' },
        { from: 'alert', to: 'grafana', label: 'Annotate', isFailover: true },
      ],
    },
  },
  {
    id: 'LAB-03',
    slug: 'ha-edge-reverse-proxy',
    category: 'Cloud & Web',
    environment: 'Edge Network',
    title: 'High-Availability Edge & Reverse Proxy Lab',
    summary:
      'Active-passive edge routing with automated TLS termination, token-bucket rate limiting, and health-checked upstream failover.',
    problem:
      'Single-instance reverse proxies created a single point of failure during upstream deployments and left API endpoints exposed to burst traffic spikes.',
    solution:
      'Configured redundant Nginx / Envoy edge nodes with Keepalived VRRP virtual IPs, automated ACME TLS renewal, Brotli compression, and active upstream circuit breakers.',
    techStack: ['Nginx', 'Envoy Proxy', 'TLS 1.3', 'Keepalived', 'Cloudflare DNS'],
    primaryMetric: '42ms Edge P95',
    metrics: [
      { label: 'Edge Overhead P95', value: '42ms', context: 'TLS 1.3 handshake + proxy hop' },
      { label: 'Failover Cutover', value: '1.8s', context: 'VRRP health probe switch' },
      { label: 'Cache Hit Ratio', value: '91.4%', context: 'Immutable static asset tier' },
    ],
    takeaways: [
      'Enforced strict TLS 1.3 ciphers, OCSP stapling, and HSTS headers at the ingress perimeter.',
      'Implemented sliding-window rate limits per IP subnet to shield backend connection pools.',
      'Verified automatic upstream ejection and recovery under simulated 502/timeout faults.',
    ],
    diagram: {
      caption: 'Redundant edge ingress with VRRP failover, TLS termination, and circuit breaking',
      nodes: [
        {
          id: 'client',
          label: 'Global Clients',
          sublabel: 'HTTPS / HTTP3',
          x: 85,
          y: 150,
          tone: 'indigo',
          role: 'Edge Traffic',
          protocol: 'Anycast DNS',
          detail: 'Routes incoming browser and API requests to the closest healthy edge point of presence.',
        },
        {
          id: 'vrrp',
          label: 'Virtual IP (VRRP)',
          sublabel: 'Keepalived Arbiter',
          x: 245,
          y: 150,
          tone: 'cyan',
          role: 'HA Failover',
          protocol: 'Multicast Heartbeat',
          detail: 'Maintains a floating VIP that shifts automatically within 2 seconds if primary edge fails.',
        },
        {
          id: 'edge1',
          label: 'Primary Proxy',
          sublabel: 'TLS 1.3 + Rate Limit',
          x: 425,
          y: 80,
          tone: 'emerald',
          role: 'Active Ingress',
          protocol: 'Envoy / Nginx',
          detail: 'Terminates TLS, enforces token-bucket rate limits, and serves edge-cached static bundles.',
        },
        {
          id: 'edge2',
          label: 'Standby Proxy',
          sublabel: 'Hot Replica',
          x: 425,
          y: 225,
          tone: 'indigo',
          role: 'Warm Failover',
          protocol: 'Synced ACME Certs',
          detail: 'Shares synchronized Let’s Encrypt certificates and assumes traffic immediately on health failure.',
        },
        {
          id: 'upstream',
          label: 'Upstream Pool',
          sublabel: 'App Services',
          x: 620,
          y: 150,
          tone: 'cyan',
          role: 'Origin Compute',
          protocol: 'HTTP/2 Keepalive',
          detail: 'Receives clean, sanitized traffic with X-Forwarded headers and active circuit breaking.',
        },
      ],
      edges: [
        { from: 'client', to: 'vrrp', label: 'TLS 1.3' },
        { from: 'vrrp', to: 'edge1', label: 'Primary Route' },
        { from: 'vrrp', to: 'edge2', label: 'Failover Path', isFailover: true },
        { from: 'edge1', to: 'upstream', label: 'Balanced Pool' },
        { from: 'edge2', to: 'upstream', label: 'Backup Pool', isFailover: true },
      ],
    },
  },
  {
    id: 'LAB-04',
    slug: 'automated-ci-terraform-iac',
    category: 'GitOps & Containers',
    environment: 'Cloud Provisioning',
    title: 'Automated CI & Terraform IaC Workflow',
    summary:
      'Modular Terraform workspaces with remote state locking, policy-as-code validation, and automated PR plan previews.',
    problem:
      'Manual console changes to VPC subnets, IAM roles, and security groups introduced undocumented drift and risky production network edits.',
    solution:
      'Built reusable Terraform modules backed by S3/DynamoDB state locking, integrating tflint, Checkov security scanning, and automated plan comments directly inside pull requests.',
    techStack: ['Terraform', 'AWS VPC', 'Checkov', 'GitHub Actions', 'OIDC Auth'],
    primaryMetric: '0 Static Keys',
    metrics: [
      { label: 'Credential Model', value: 'OIDC', context: 'Ephemeral 15m IAM tokens' },
      { label: 'Policy Checks', value: '48 Rules', context: 'Automated Checkov + tfsec' },
      { label: 'Env Spin-Up', value: '4m 20s', context: 'Full VPC + EKS bootstrap' },
    ],
    takeaways: [
      'Replaced long-lived cloud access keys with short-lived GitHub OIDC federated role assumption.',
      'Enforced least-privilege security groups and encrypted state backends via pre-merge policy gates.',
      'Separated network, cluster, and data layers into independent state files to shrink blast radius.',
    ],
    diagram: {
      caption: 'Federated OIDC IaC pipeline from PR plan preview to state-locked apply',
      nodes: [
        {
          id: 'pr',
          label: 'Feature PR',
          sublabel: 'HCL Module Diff',
          x: 95,
          y: 150,
          tone: 'indigo',
          role: 'Change Proposal',
          protocol: 'Git Branch Policy',
          detail: 'Modifies versioned VPC, subnet, or IAM Terraform modules with strict peer review.',
        },
        {
          id: 'scan',
          label: 'Policy Gate',
          sublabel: 'Checkov + tflint',
          x: 265,
          y: 80,
          tone: 'cyan',
          role: 'Static Security',
          protocol: 'CIS Benchmark Rules',
          detail: 'Blocks public S3 buckets, wildcard IAM policies, or unencrypted EBS volumes pre-plan.',
        },
        {
          id: 'oidc',
          label: 'OIDC STS Token',
          sublabel: 'Short-Lived IAM',
          x: 265,
          y: 225,
          tone: 'emerald',
          role: 'Zero-Secret Auth',
          protocol: 'JWT Federation',
          detail: 'Exchanges signed workflow identity token for temporary scoped cloud credentials.',
        },
        {
          id: 'state',
          label: 'Remote State Lock',
          sublabel: 'S3 + DynamoDB',
          x: 455,
          y: 150,
          tone: 'indigo',
          role: 'Concurrency Guard',
          protocol: 'AES-256 Encrypted',
          detail: 'Prevents concurrent terraform apply collisions and versions every state snapshot.',
        },
        {
          id: 'cloud',
          label: 'Cloud Foundation',
          sublabel: 'VPC / Subnets / IAM',
          x: 625,
          y: 150,
          tone: 'emerald',
          role: 'Target Infrastructure',
          protocol: 'Cloud Control API',
          detail: 'Provisions multi-AZ private subnets, NAT gateways, and isolated node security groups.',
        },
      ],
      edges: [
        { from: 'pr', to: 'scan', label: 'Lint & Scan' },
        { from: 'pr', to: 'oidc', label: 'Assume Role' },
        { from: 'scan', to: 'state', label: 'Plan Preview' },
        { from: 'oidc', to: 'state', label: 'Acquire Lock' },
        { from: 'state', to: 'cloud', label: 'Apply Verified' },
        { from: 'cloud', to: 'state', label: 'Drift Check', isFailover: true },
      ],
    },
  },
  {
    id: 'LAB-05',
    slug: 'cloud-native-sandbox-telemetry',
    category: 'Observability',
    environment: 'Service Mesh',
    title: 'Cloud-Native Sandbox & Mesh Telemetry',
    summary:
      'Multi-namespace Kubernetes sandbox experimenting with eBPF network visibility, OpenTelemetry spans, and fault injection.',
    problem:
      'Understanding east-west microservice dependencies and DNS resolution delays required invasive application sidecars or noisy packet captures.',
    solution:
      'Deployed a local k3s/Cilium eBPF sandbox exporting Hubble network flows alongside OpenTelemetry Collector pipelines to visualize service dependency graphs and latency bottlenecks.',
    techStack: ['Cilium eBPF', 'OpenTelemetry', 'k3s', 'Hubble', 'NetworkPolicy'],
    primaryMetric: '0.4ms eBPF Hook',
    metrics: [
      { label: 'Kernel Probe Cost', value: '0.4ms', context: 'Sidecar-free L3/L4/L7 flow' },
      { label: 'Trace Sampling', value: '100%', context: 'Tail-based error capture' },
      { label: 'Policy Isolation', value: 'L7 Deny', context: 'Default-zero namespace rules' },
    ],
    takeaways: [
      'Observed real-time DNS and HTTP status codes at the kernel socket layer without proxy sidecars.',
      'Simulated 200ms network jitter and packet loss to validate client retry backoff jitter.',
      'Locked down cross-namespace egress using identity-aware CiliumNetworkPolicies.',
    ],
    diagram: {
      caption: 'Kernel-level eBPF flow inspection paired with OpenTelemetry collector routing',
      nodes: [
        {
          id: 'svcA',
          label: 'Ingress Gateway',
          sublabel: 'Trace Root Span',
          x: 95,
          y: 150,
          tone: 'cyan',
          role: 'Edge Origin',
          protocol: 'W3C TraceContext',
          detail: 'Injects traceparent headers and begins distributed span timing on incoming requests.',
        },
        {
          id: 'ebpf',
          label: 'Cilium eBPF Layer',
          sublabel: 'Kernel Socket Hook',
          x: 280,
          y: 80,
          tone: 'emerald',
          role: 'Zero-Sidecar Mesh',
          protocol: 'Kernel XDP / TC',
          detail: 'Enforces L3–L7 NetworkPolicies and emits L7 flow events directly from Linux kernel.',
        },
        {
          id: 'svcB',
          label: 'Sandbox Services',
          sublabel: 'Isolated Namespaces',
          x: 280,
          y: 225,
          tone: 'indigo',
          role: 'Mesh Workloads',
          protocol: 'gRPC / HTTP2',
          detail: 'Microservices communicating inside strict default-deny network boundaries.',
        },
        {
          id: 'otel',
          label: 'OTel Collector',
          sublabel: 'Tail Sampler',
          x: 470,
          y: 150,
          tone: 'cyan',
          role: 'Telemetry Pipeline',
          protocol: 'OTLP / gRPC',
          detail: 'Buffers spans, retains 100% of error traces, and scrubs sensitive payload attributes.',
        },
        {
          id: 'hubble',
          label: 'Service Map UI',
          sublabel: 'Flow + Span Graph',
          x: 630,
          y: 150,
          tone: 'emerald',
          role: 'Dependency Inspector',
          protocol: 'Live Flow Stream',
          detail: 'Renders live east-west dependency edges, dropped packet reasons, and latency heatmaps.',
        },
      ],
      edges: [
        { from: 'svcA', to: 'ebpf', label: 'Socket Hook' },
        { from: 'svcA', to: 'svcB', label: 'gRPC Call' },
        { from: 'ebpf', to: 'otel', label: 'Flow Events' },
        { from: 'svcB', to: 'otel', label: 'OTLP Spans' },
        { from: 'otel', to: 'hubble', label: 'Export Graph' },
        { from: 'ebpf', to: 'svcB', label: 'Drop Policy', isFailover: true },
      ],
    },
  },
  {
    id: 'LAB-06',
    slug: 'kinetic-motion-ui-engine',
    category: 'Cloud & Web',
    environment: 'Frontend Runtime',
    title: 'Interactive Motion UI & Kinetic Web Engine',
    summary:
      '60fps pointer-lerp physics, GPU-composited layout transitions, and SVG schematic rendering built for technical studio interfaces.',
    problem:
      'Heavy JS animation loops and layout-thrashing CSS properties dropped frame rates on mobile devices and degraded accessibility for motion-sensitive visitors.',
    solution:
      'Architected a compositor-first motion layer combining damped requestAnimationFrame CSS variables, Motion shared-layout transitions, and prefers-reduced-motion fallbacks.',
    techStack: ['React 19', 'TypeScript', 'Motion', 'Tailwind CSS', 'SVG Physics'],
    primaryMetric: '60fps Locked',
    metrics: [
      { label: 'Frame Budget', value: '16.6ms', context: 'Transform & opacity only' },
      { label: 'Pointer Damping', value: '0.085', context: 'RAF lerp without React renders' },
      { label: 'Bundle Footprint', value: 'Zero Img', context: 'Pure procedural SVG & CSS' },
    ],
    takeaways: [
      'Isolated pointer coordinate interpolation outside React state to guarantee zero virtual DOM churn.',
      'Restricted all hover and scroll transitions strictly to compositor transform and opacity layers.',
      'Honored prefers-reduced-motion across spotlight physics, scroll progress, and SVG flow paths.',
    ],
    diagram: {
      caption: 'Zero-re-render pointer physics pipeline driving compositor-only GPU layers',
      nodes: [
        {
          id: 'pointer',
          label: 'Pointer Listener',
          sublabel: 'Passive Event Stream',
          x: 95,
          y: 150,
          tone: 'cyan',
          role: 'Input Capture',
          protocol: 'DOM PointerEvent',
          detail: 'Captures normalized viewport coordinates passively without blocking main-thread scroll.',
        },
        {
          id: 'raf',
          label: 'Lerp Physics Loop',
          sublabel: 'Damped RAF Engine',
          x: 270,
          y: 85,
          tone: 'indigo',
          role: 'Smooth Interpolator',
          protocol: '0.085 Spring Damping',
          detail: 'Computes exponentially smoothed target coordinates per frame with idle auto-sleep.',
        },
        {
          id: 'cssvar',
          label: 'CSS Custom Props',
          sublabel: '--mx / --my Variables',
          x: 270,
          y: 220,
          tone: 'emerald',
          role: 'State Bridge',
          protocol: 'Direct Style Mutation',
          detail: 'Updates root custom properties directly on DOM ref, bypassing React reconciliation.',
        },
        {
          id: 'gpu',
          label: 'GPU Compositor',
          sublabel: 'Transform + Gradient',
          x: 465,
          y: 150,
          tone: 'cyan',
          role: 'Render Layer',
          protocol: '60fps Raster Bypass',
          detail: 'Renders ambient spotlight, 3D card tilt, and scroll-linked progress via GPU transforms.',
        },
        {
          id: 'a11y',
          label: 'A11y & Reduced Motion',
          sublabel: 'MediaQuery Guard',
          x: 630,
          y: 150,
          tone: 'emerald',
          role: 'Inclusive Control',
          protocol: 'prefers-reduced-motion',
          detail: 'Automatically freezes continuous motion loops and falls back to crisp instant states.',
        },
      ],
      edges: [
        { from: 'pointer', to: 'raf', label: 'Target X/Y' },
        { from: 'raf', to: 'cssvar', label: 'Damped Frame' },
        { from: 'cssvar', to: 'gpu', label: 'Composite' },
        { from: 'gpu', to: 'a11y', label: 'Motion Gate' },
        { from: 'a11y', to: 'raf', label: 'Clamp Loop', isFailover: true },
      ],
    },
  },
];
