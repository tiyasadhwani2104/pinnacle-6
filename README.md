# Aegis-LLM: National Security Framework for Generative AI Defense
 
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Groq](https://img.shields.io/badge/Groq-LLM%20Analysis-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-SHA--256%20Audit-purple)
![Status](https://img.shields.io/badge/status-Prototype%20Completed-cyan)
 
---
 
## 🛡️ Overview
 
Aegis-LLM is a cloud-based threat intelligence platform designed to detect, analyze, and mitigate the misuse of Large Language Models (LLMs) in phishing, disinformation, propaganda, and hostile influence operations.
 
As generative AI makes it increasingly easy to produce persuasive and scalable malicious content, Aegis-LLM helps analysts monitor suspicious narratives, assign risk scores, detect coordinated behavior, and maintain tamper-evident forensic records.
 
Built as an academic cybersecurity and blockchain-oriented prototype with a focus on practical deployment, explainability, and national security relevance.
 
---
 
## 🚀 Key Features
 
### 1. Real-Time Suspicious Content Analysis
- **Manual Ingest Pipeline**: Submit suspicious posts, messages, and narratives directly through the analyst interface.
- **Groq-Powered Analysis**: Runs structured LLM analysis to produce summaries, explanations, narrative labels, and risk scores.
- **Fallback Classifier**: A lightweight secondary classifier supports content classification when Groq analysis is unavailable.
### 2. Final Risk Scoring Engine
- **Multi-Signal Fusion**: Combines the Groq risk score, classifier confidence score, and coordination score into a single normalized value.
- **0–100 Risk Scale**: Produces a final risk score mapped to four severity tiers — **Low**, **Medium**, **High**, and **Critical**.
- **Actionable Outputs**: Each post surfaces a risk tier alongside the contributing signal breakdown for analyst review.
### 3. Coordination Detection (SQL-Based)
- **Pattern Matching**: Detects suspicious coordination by scanning for repeated URLs, hashtags, and narrative labels across ingested posts.
- **Campaign Clustering**: Groups coordinated posts into campaign clusters based on shared malicious indicators.
- **No Graph Database Required**: Achieves strong campaign intelligence purely through SQL-based analysis, avoiding unnecessary infrastructure complexity.
### 4. Blockchain-Inspired Audit Trail
- **SHA-256 Hash Chaining**: Implements a tamper-evident audit log where each record is cryptographically linked to the previous one.
- **Full Action Coverage**: Logs all major analyst actions — ingest submission, Groq analysis, classifier execution, and coordination analysis.
- **Integrity Without a Ledger**: Simulates blockchain-style tamper detection without requiring a full distributed network.
### 5. Analyst Dashboard
- **Live Overview**: Displays total analyzed posts, high-risk alerts, average risk score, and active campaign clusters in real time.
- **Dedicated Views**: Separate pages for posts, post detail, campaign clusters, and the full audit chain.
---
 
## 🏗️ System Architecture
 
```text
+------------------------------------------------------+
|                   Data Ingestion Layer               |
|  Manual Analyst Input / Social Media / Email / URLs  |
+------------------------------------------------------+
                           |
                           v
+------------------------------------------------------+
|                 Supabase Storage Layer               |
|  posts, accounts, hashtags, urls, analysis_results   |
+------------------------------------------------------+
                           |
        -----------------------------------------
        |                    |                  |
        v                    v                  v
+---------------+   +----------------+   +----------------------+
| Groq Analysis |   | Fallback       |   | Coordination         |
| Engine        |   | Classifier     |   | Detection Engine     |
| summary       |   | label          |   | repeated URLs        |
| explanation   |   | score          |   | repeated hashtags    |
| narrative     |   |                |   | repeated narratives  |
| Groq risk     |   |                |   | coordination score   |
+---------------+   +----------------+   +----------------------+
        |                    |                  |
        -------------------  |  ----------------
                          |  |  |
                          v  v  v
+------------------------------------------------------+
|                 Risk Scoring Engine                  |
| Combines Groq risk + classifier score + coordination |
| Produces Final Risk Score (0-100)                    |
+------------------------------------------------------+
                           |
                           v
+------------------------------------------------------+
|              Campaign & Audit Intelligence           |
|  campaign_clusters  |  audit_chain (SHA-256 linked)  |
+------------------------------------------------------+
                           |
                           v
+------------------------------------------------------+
|                  Analyst Dashboard                   |
|  Dashboard / Posts / Post Detail / Campaigns / Audit |
+------------------------------------------------------+
                           |
                           v
+------------------------------------------------------+
|                Security Response Layer               |
| Investigation / Monitoring / Escalation / Reporting  |
+------------------------------------------------------+
```
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend / Data | Supabase PostgreSQL, Next.js Server Actions |
| AI / Analysis | Groq API, Lightweight fallback classifier |
| Security / Forensics | SHA-256 audit chain, SQL coordination detection, Risk scoring engine |
| Deployment | Vercel, Supabase |
 
---
 
## 📦 Modules & Usage
 
### Ingest Module
 
To submit a suspicious post for analysis:
 
```ts
// POST /api/ingest
const payload = {
  platform: "Twitter",
  account_handle: "@suspicious_account",
  text: "Insert suspicious content here...",
  hashtags: ["#disinfo", "#propaganda"],
  urls: ["https://example-malicious-link.com"],
};
```
 
### Groq Analysis Module
 
To trigger Groq analysis on an ingested post:
 
```ts
// Runs from /posts/[id] — analyst-triggered
const analysis = await runGroqAnalysis(postId);
console.log(`Summary: ${analysis.summary}`);
console.log(`Risk Score: ${analysis.groq_risk_score}`);
console.log(`Narrative Label: ${analysis.narrative_label}`);
```
 
### Classification Module
 
To run the fallback classifier on a post:
 
```ts
const classification = await runClassifier(postId);
console.log(`Label: ${classification.label}`);
console.log(`Confidence: ${classification.confidence_score}`);
```
 
### Coordination Detection Module
 
To compute a coordination score based on shared signals:
 
```ts
const coordination = await runCoordinationDetection(postId);
console.log(`Coordination Score: ${coordination.score}`);
console.log(`Matched Signals: ${coordination.matched_signals}`);
```
 
### Audit Module
 
Every major action writes a tamper-evident record to the audit chain:
 
```ts
// Example audit entry structure
const auditEntry = {
  event_type: "groq_analysis",
  payload_hash: sha256(JSON.stringify(analysisPayload)),
  previous_hash: lastAuditEntry.current_hash,
  current_hash: sha256(previousHash + payloadHash),
  timestamp: new Date().toISOString(),
};
```
 
---
 
## 🗄️ Database Schema
 
| Table | Purpose |
|---|---|
| `accounts` | Stores account metadata for ingested handles |
| `posts` | Core table for ingested suspicious content |
| `hashtags` | Extracted hashtag entities |
| `post_hashtags` | Junction table linking posts to hashtags |
| `urls` | Extracted URL entities |
| `post_urls` | Junction table linking posts to URLs |
| `analysis_results` | Stores Groq and classifier outputs per post |
| `campaign_clusters` | Detected coordination clusters |
| `audit_chain` | Tamper-evident SHA-256 linked audit log |
 
---
 
## 📥 Installation
 
### 1. Clone the Repository
 
```bash
git clone https://github.com/your-username/aegis-llm.git
cd aegis-llm
```
 
### 2. Install Dependencies
 
```bash
npm install
```
 
### 3. Configure Environment Variables
 
Create a `.env.local` file in the project root:
 
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
GROQ_API_KEY=your_groq_api_key
```
 
### 4. Set Up Supabase
 
Run the following SQL files in the **Supabase SQL Editor**:
 
```
supabase/schema.sql
supabase/seed.sql
```
 
### 5. Run the Development Server
 
```bash
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000) in your browser.
 
---
 
## 🌐 Deployment
 
### Vercel
 
1. Push the project to GitHub
2. Import the repository into [Vercel](https://vercel.com/)
3. Set the correct root directory
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
5. Deploy
---
 
## ⚖️ Policy & Security Relevance
 
Aegis-LLM is designed around the principle that national security monitoring must balance:
 
- **Threat Detection**: Identifying malicious AI-generated content at scale before it spreads.
- **Transparency**: Every risk score is explainable — analysts can see exactly which signals drove the result.
- **Accountability**: A tamper-evident audit chain ensures no action can be silently altered or deleted.
- **Civil Liberties**: No raw personal identity data is stored in the audit layer. The system focuses on metadata, behavioral patterns, and content signals — not individuals.
---
 
## 🔮 Future Scope
 
- Hugging Face hosted classifier endpoint integration
- Transformer-based detection models (RoBERTa, T5)
- Multilingual disinformation detection
- Explainable AI (XAI) dashboards with visual justifications
- Richer campaign analytics and timeline views
- SIEM integration for enterprise security operations
- Stronger access control with Supabase Row Level Security (RLS)
- Confidential ledger or distributed blockchain-backed verification
---
 
## 🤝 Contributing
 
Contributions are welcome in the following areas:
 
- Frontend improvements
- Risk scoring logic refinements
- Database schema optimization
- Explainability and XAI features
- Deployment and DevOps improvements
Please open an issue or submit a pull request.
 
---
 
## 📄 License
 
This project is licensed under the [MIT License](LICENSE).