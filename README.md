# Aegis-LLM: National Security Framework for Generative AI Defense

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Groq](https://img.shields.io/badge/Groq-LLM%20Analysis-orange)
![Status](https://img.shields.io/badge/status-Prototype%20Completed-cyan)

## 🛡️ Overview

Aegis-LLM is a cloud-based threat intelligence platform designed to detect, analyze, and mitigate the misuse of Large Language Models (LLMs) in phishing, disinformation, propaganda, and hostile influence operations.

As generative AI makes it easier to create persuasive and scalable malicious content, Aegis-LLM helps analysts monitor suspicious narratives, assign risk scores, detect coordinated behavior, and maintain tamper-evident forensic records.

This project was built as an academic cybersecurity and blockchain-oriented prototype with a focus on practical deployment, explainability, and national security relevance.

---

## 🚀 Key Features

### 1. Real-Time Suspicious Content Analysis
- Manual ingest pipeline for suspicious posts, messages, and narratives
- Groq-powered analysis for:
  - summary
  - explanation
  - narrative labeling
  - Groq risk scoring
- Lightweight fallback classifier for supporting content classification

### 2. Final Risk Scoring Engine
- Combines:
  - Groq risk score
  - classifier score
  - coordination score
- Produces a normalized **0–100 final risk score**
- Assigns:
  - Low
  - Medium
  - High
  - Critical

### 3. Coordination Detection Without Graph Databases
- Detects suspicious coordination using SQL-based analysis over:
  - repeated URLs
  - repeated hashtags
  - repeated narrative labels
- Generates campaign clusters from repeated malicious patterns
- Avoids unnecessary graph database complexity while retaining strong campaign intelligence logic

### 4. Blockchain-Inspired Audit Trail
- Implements a tamper-evident audit trail using **SHA-256 hash chaining**
- Logs major actions such as:
  - ingest submission
  - Groq analysis
  - classifier execution
  - coordination analysis
- Simulates blockchain-style integrity without requiring a full distributed ledger

### 5. Analyst Dashboard
- Live dashboard for:
  - total analyzed posts
  - high-risk alerts
  - average risk score
  - active campaign clusters
- Dedicated pages for:
  - posts
  - post details
  - campaign clusters
  - audit chain

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A["Data Ingestion<br/>Manual Analyst Input / Social Media / Email / Reports"]
    B["Supabase Storage<br/>posts, accounts, hashtags, urls"]
    C["Groq Analysis Engine<br/>Summary, Explanation, Narrative Label, Groq Risk"]
    D["Fallback Classifier<br/>Phishing / Disinformation / Propaganda / Manipulation"]
    E["Coordination Detection Engine<br/>Repeated URLs, Hashtags, Narrative Labels"]
    F["Risk Scoring Engine<br/>Final Risk Score 0-100"]
    G["Campaign Cluster Store<br/>campaign_clusters"]
    H["Audit Chain Engine<br/>SHA-256 Hash Chaining"]
    I["Analyst Dashboard<br/>Dashboard / Posts / Campaigns / Audit"]
    J["Decision Point<br/>High-Risk or Coordinated Threat?"]
    K["Security Response Support<br/>Investigation / Monitoring / Escalation"]
    L["Low-Risk Monitoring<br/>Store and Continue Observation"]

    A --> B
    B --> C
    B --> D
    B --> E
    C --> F
    D --> F
    E --> F
    E --> G
    A --> H
    C --> H
    D --> H
    E --> H
    F --> I
    G --> I
    H --> I
    I --> J
    J -->|Yes| K
    J -->|No| L
🛠️ Tech Stack
Frontend
Next.js 14
TypeScript
Tailwind CSS
Backend / Data Layer
Supabase PostgreSQL
Next.js Server Actions
AI / Analysis
Groq API
Lightweight fallback classifier
Security / Forensics
SHA-256 audit chain
SQL-based coordination detection
Final risk scoring engine
Deployment
Vercel
Supabase
📦 Implemented Modules
1. Ingest Module
Allows analysts to submit:

source platform
account handle
suspicious text
optional narrative label
hashtags
URLs
2. Groq Analysis Module
Runs structured LLM analysis and stores:

summary
explanation
Groq risk score
narrative label
3. Classification Module
Runs a lightweight fallback classifier and stores:

label
confidence score
4. Coordination Module
Computes a coordination score from:

repeated URLs
repeated hashtags
repeated narratives
5. Risk Scoring Module
Combines Groq, classifier, and coordination signals into a final risk score.

6. Audit Module
Writes tamper-evident records into audit_chain using:

payload hash
previous hash
current hash
event type
timestamp
🗄️ Database Schema
Main tables:

accounts
posts
hashtags
post_hashtags
urls
post_urls
analysis_results
campaign_clusters
audit_chain
📥 Installation
1. Clone the Repository
git clone https://github.com/your-username/aegis-llm.git
cd aegis-llm
2. Install Dependencies
npm install
3. Configure Environment Variables
Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
GROQ_API_KEY=your_groq_api_key
4. Set Up Supabase
Run these SQL files in the Supabase SQL Editor:

supabase/schema.sql
supabase/seed.sql
5. Run the Project
npm run dev
Open:

http://localhost:3000
📊 Core Workflows
Ingest Suspicious Content
Users submit suspicious text through /ingest. The system stores posts, hashtags, URLs, and account metadata in Supabase.

Run Groq Analysis
From /posts/[id], analysts can run Groq analysis to generate:

summary
explanation
narrative label
risk score
Run Classification
A lightweight classifier assigns a supporting label and confidence score.

Run Coordination Detection
The system checks whether the post shares URLs, hashtags, or narratives with other posts and computes a coordination score.

Write Audit Events
Every major action is written into a tamper-evident audit chain.

🌐 Deployment
Vercel Deployment
Push the project to GitHub
Import the repository into Vercel
Set the correct root directory
Add environment variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GROQ_API_KEY
Deploy
⚖️ Policy and Security Relevance
Aegis-LLM is designed around the principle that national security monitoring must balance:

threat detection
transparency
explainability
accountability
civil liberties
The prototype avoids storing raw personal identity information in any blockchain-like layer and instead focuses on metadata, scoring, and tamper-evident logging.

🔮 Future Scope
Planned enhancements include:

Hugging Face hosted classifier endpoint integration
transformer-based detection models
multilingual detection
explainable AI dashboards
richer campaign analytics
SIEM integration
stronger access control and Row Level Security
confidential ledger or blockchain-backed verification
🤝 Contributing
Contributions are welcome in:

frontend improvements
risk scoring logic
database optimization
explainability features
deployment and DevOps improvements
📄 License
This project is licensed under the MIT License.


Then update it with:

```powershell
git add README.md
git commit -m "Clean up README formatting"
git push origin main