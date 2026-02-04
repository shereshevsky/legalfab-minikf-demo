# LegalFab MiniKF Demo

An interactive demonstration of LegalFab's MiniKF (Mini Knowledge Fabric) orchestrating multiple AI agents to answer complex legal queries across multiple data sources.

![LegalFab Demo](./docs/demo-preview.png)

## Overview

This demo showcases MiniKF's core capability: **consolidating answers from different agents** working across multiple enterprise data sources. The visualization demonstrates how a complex billing/WIP query is decomposed, executed across systems, and synthesized into a comprehensive answer.

### Demo Question

> "Show all active matters that have not been billed within the last 30 days, and have an average work in progress (WIP) age exceeding 60 days organized by client."

### What It Demonstrates

1. **Query Decomposition** - Breaking complex queries into sub-queries
2. **Agent Orchestration** - Multiple specialized AI agents working in coordination
3. **Cross-System Federation** - Querying 4 different enterprise systems
4. **Knowledge Graph Construction** - Building relationships between entities
5. **Data Lineage Tracking** - Full transparency on where answers come from

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/legalfab-minikf-demo.git
cd legalfab-minikf-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🚀 Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

This repo includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Setup Steps:**

1. **Create a new GitHub repository** and push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/legalfab-minikf-demo.git
   git branch -M main
   git push -u origin main
   ```

2. **Update the base path** in `vite.config.ts`:
   ```ts
   base: '/your-repo-name/'  // Change this to match your repo name
   ```

3. **Enable GitHub Pages** in your repository:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

4. **Push to trigger deployment**:
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages"
   git push
   ```

5. **Access your demo** at:
   ```
   https://YOUR_USERNAME.github.io/legalfab-minikf-demo/
   ```

### Option 2: Manual Deployment

```bash
# Build the project
npm run build

# The built files will be in the 'dist' folder
# You can deploy this folder to any static hosting service
```

### Troubleshooting GitHub Pages

- **Blank page?** Make sure the `base` path in `vite.config.ts` matches your repository name
- **404 errors?** Check that GitHub Pages is set to deploy from "GitHub Actions" (not "Deploy from branch")
- **Build failing?** Check the Actions tab for error logs

## Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Setup steps:**

1. Create a new repository on GitHub (e.g., `legalfab-minikf-demo`)

2. Update the base path in `vite.config.ts` to match your repo name:
   ```ts
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/legalfab-minikf-demo.git
   git push -u origin main
   ```

4. Enable GitHub Pages:
   - Go to repo **Settings** → **Pages**
   - Source: **GitHub Actions**

5. The workflow will run automatically. Your demo will be live at:
   ```
   https://YOUR_USERNAME.github.io/legalfab-minikf-demo/
   ```

### Option 2: Manual Deployment

```bash
# Install gh-pages if not already installed
npm install -D gh-pages

# Build and deploy
npm run deploy
```

Then enable GitHub Pages with source set to `gh-pages` branch.

## Architecture

```
src/
├── components/           # React components
│   ├── Header.tsx
│   ├── QueryPanel.tsx
│   ├── StepIndicator.tsx
│   ├── StepMessage.tsx
│   ├── AgentsPanel.tsx
│   ├── SourcesPanel.tsx
│   ├── GraphVisualization.tsx
│   ├── ControlBar.tsx
│   └── ResultsPanel.tsx
├── hooks/
│   └── useLegalFabDemo.ts  # Main state management hook
├── data/
│   └── demoData.json       # Animation data
├── types/
│   └── index.ts            # TypeScript definitions
└── styles/
    └── index.css           # Global styles
```

## Demo Flow

The demonstration progresses through **6 steps** (~14 seconds total):

| Step | Phase | Duration | Description |
|------|-------|----------|-------------|
| 1 | Query Analysis | 1.2s | Decompose query into sub-queries |
| 2 | Matter Retrieval | 2.5s | Matter Finance Agent queries Elite PMS |
| 3 | Billing Analysis | 3.0s | Revenue Protection Agent checks billing gaps |
| 4 | WIP Calculation | 3.5s | Both agents analyze time entries |
| 5 | Client Enrichment | 2.0s | CRM data added, hierarchy built |
| 6 | Response Synthesis | 1.5s | Final answer with full lineage |

## AI Agents

### Matter Finance Agent 📊
- **Capability**: Matter & Financial Data Analysis
- **Sources**: Elite PMS, Intapp Time
- **Role**: Retrieves active matters, computes WIP metrics

### Revenue Protection Agent 💰
- **Capability**: Billing & Revenue Analysis  
- **Sources**: Elite Billing
- **Role**: Identifies billing gaps, flags revenue at risk

## Data Sources

| Source | Type | Records |
|--------|------|---------|
| Elite (PMS) | Practice Management | 47 matters |
| Elite (Billing) | Financial System | 23 records |
| Intapp Time | Time Recording | 1,247 entries |
| PeopleSoft (CRM) | Client Management | 3 clients |

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Cytoscape.js** - Graph visualization
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Customizing the Demo

### Adding New Demo Scenarios

Edit `src/data/demoData.json` to create new demonstration scenarios. The structure supports:

```typescript
interface DemoAnimation {
  query: string;
  totalSteps: number;
  steps: AnimationStep[];
  finalAnswer: FinalAnswer;
  metadata: AnimationMetadata;
}
```

### Modifying Graph Appearance

Node colors and styles are defined in:
- `src/types/index.ts` - Color constants
- `src/components/GraphVisualization.tsx` - Cytoscape styles

## Results

The demo concludes with results showing:

- **12 matters** across **3 clients** requiring attention
- **$2.7M** total WIP at risk
- Full data lineage from PMS → Billing → Time → CRM
- Agent attribution for each piece of information

### Sample Output

| Client | Matters | Total WIP at Risk |
|--------|---------|-------------------|
| Abbott Laboratories | 4 | $847,000 |
| AstraZeneca PLC | 4 | $1,234,000 |
| Barclays PLC | 4 | $623,000 |

## License

MIT © LegalFab

## Related Documentation

- [LegalFab Knowledge Fabric Architecture](./docs/architecture.md)
- [MiniKF Technical Specification](./docs/minikf-spec.md)
- [API Reference](./docs/api-reference.md)
