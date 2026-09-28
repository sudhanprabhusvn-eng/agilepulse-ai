import { KnowledgeArticle, RAGDocument, GlobalSearchResult } from '../types';

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'AgilePulse Enterprise Architecture & Microservices SOP',
    category: 'Architecture Wiki',
    content: `# AgilePulse Architecture Overview\n\nAgilePulse operates on an event-driven architecture using PostgreSQL for durable persistence, Redis for caching/pub-sub, and Gemini 2.5 Flash for real-time telemetry processing.\n\n## Key Guidelines\n1. Always route external API requests through \`/api/v1/*\` endpoints.\n2. Keep AI key references strictly in environment variables.\n3. Verify database pool limits during peak sprint reviews.`,
    tags: ['Architecture', 'SOP', 'Node.js', 'PostgreSQL'],
    author: 'Sarah Jenkins',
    viewsCount: 420,
    helpfulCount: 38,
    updatedAt: '2026-07-25',
    status: 'Published',
    chunkCount: 12,
  },
  {
    id: 'art-2',
    title: 'Sprint Scope Reduction & WSJF Prioritization Guide',
    category: 'Sprint Best Practices',
    content: `# WSJF Prioritization Framework\n\nWhen a sprint risk score exceeds 65%, Scrum Masters should apply WSJF (Weighted Shortest Job First):\n\n$$\\text{WSJF} = \\frac{\\text{Cost of Delay}}{\\text{Job Duration}}$$\n\nFocus on high-value, small-point items to protect sprint commitment.`,
    tags: ['Agile', 'Sprint Planning', 'WSJF', 'Scrum Master'],
    author: 'Michael Chang',
    viewsCount: 310,
    helpfulCount: 29,
    updatedAt: '2026-08-01',
    status: 'Published',
    chunkCount: 8,
  },
];

export const mockRAGDocuments: RAGDocument[] = [
  {
    id: 'doc-1',
    fileName: 'Enterprise_Security_Compliance_2026.pdf',
    fileType: 'pdf',
    fileSizeMb: 4.2,
    uploadedBy: 'Elena Rostova',
    uploadedAt: '2026-07-20',
    chunkCount: 45,
    vectorIndexed: true,
    summary: 'SOC2 Type II, ISO 27001, and GDPR compliance policies for AgilePulse AI data processing.',
    tags: ['Security', 'Compliance', 'SOC2', 'GDPR'],
  },
  {
    id: 'doc-2',
    fileName: 'Sprint_Velocity_Historical_Benchmarks.docx',
    fileType: 'docx',
    fileSizeMb: 1.8,
    uploadedBy: 'Alex Morgan',
    uploadedAt: '2026-07-29',
    chunkCount: 22,
    vectorIndexed: true,
    summary: 'Quarterly velocity benchmarks across 12 engineering squads in the Fintech division.',
    tags: ['Velocity', 'Benchmarking', 'Fintech'],
  },
];

export const mockGlobalSearchResults: GlobalSearchResult[] = [
  {
    id: 'sr-1',
    title: 'Sprint 24 Risk Mitigation Strategy',
    type: 'Sprint',
    snippet: 'Risk score dropped from 72% to 34% after reassigning API Gateway optimization tasks to Senior Devs.',
    urlTab: 'board',
    relevanceScore: 0.98,
  },
  {
    id: 'sr-2',
    title: 'AgilePulse Enterprise Architecture & Microservices SOP',
    type: 'Document',
    snippet: 'AgilePulse operates on an event-driven architecture using PostgreSQL for durable persistence...',
    urlTab: 'knowledge',
    relevanceScore: 0.92,
  },
  {
    id: 'sr-3',
    title: 'PostgreSQL Connection Saturation Alert',
    type: 'Report',
    snippet: 'Automated monitoring detected 85% connection pool utilization during morning batch sync.',
    urlTab: 'reports',
    relevanceScore: 0.88,
  },
];
