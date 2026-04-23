Aegis-LLM: National Security Framework for Generative AI Defense
![alt text](https://img.shields.io/badge/license-MIT-blue.svg)

![alt text](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)

![alt text](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)

![alt text](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

![alt text](https://img.shields.io/badge/Groq-LLM%20Analysis-orange)
🛡️ Overview
Aegis-LLM is a multi-layered technical and policy framework designed to detect, analyze, and mitigate the misuse of Large Language Models (LLMs) in hostile information operations.
As generative AI democratizes the ability to produce sophisticated disinformation, phishing, and propaganda at scale, Aegis-LLM provides national security agencies with the tools to identify AI-generated threats, attribute them to malicious actors, and coordinate a cross-border response via a tamper-evident audit trail.
🏗️ System Architecture
Aegis-LLM utilizes a modular architecture that separates data ingestion, multi-model analysis, and forensic logging.
code
Mermaid
graph TD
    subgraph Ingestion_Layer
        A[Social Media/Email/Web Ingest] --> B[Supabase Storage]
    end

    subgraph Analysis_Engine
        B --> C{Orchestrator}
        C --> D[Groq LLM: Narrative Analysis]
        C --> E[RoBERTa/T5: Synthetic Text Classifier]
        C --> F[Coordination Engine: SQL Pattern Matching]
    end

    subgraph Scoring_Forensics
        D & E & F --> G[Final Risk Scoring Engine]
        G --> H[SHA-256 Hash Chaining / Blockchain Audit]
    end

    subgraph Presentation
        H --> I[Analyst Dashboard]
        I --> J[Campaign Intelligence & Response]
    end

    style G fill:#f96,stroke:#333,stroke-width:2px
    style H fill:#bbf,stroke:#333,stroke-width:2px
🚀 Key Features
1. Real-Time AI-Generated Content Detection
Transformer-Based Classifiers: Utilizes fine-tuned RoBERTa and T5 models to distinguish between human and synthetic text.
Stylometric Analysis: Analyzes entropy levels, token probability distributions (Log-Likelihood), and linguistic patterns unique to specific LLM architectures.
Groq-Powered Context: Uses Groq's high-speed inference to summarize narratives and identify the "intent" behind suspicious posts.
2. Attribution & Forensic Audit Trail
Tamper-Evident Logging: Implements a blockchain-inspired audit trail using SHA-256 hash chaining. Every analysis step (ingest, score, attribution) is hashed and linked to the previous record.
Coordination Detection: Identifies malicious campaigns by clustering repeated URLs, hashtags, and narrative signatures without the overhead of heavy graph databases.
3. Privacy-Preserving Analytics
Explainable AI (XAI): Provides "Risk Scores" (0–100) with interpretable justifications to maintain transparency in democratic institutions.
Federated Approach: Designed to support local data processing, ensuring sensitive intelligence remains within jurisdictional boundaries while sharing only threat metadata.
💻 Modules & Usage
Detection Engine
To analyze a suspicious snippet of text via the Python backend:
code
Python
from aegis_llm.detection import Detector

detector = Detector(model='roberta-large-detector')
result = detector.predict("Insert suspicious text here...")

print(f"AI-Probability: {result.score}%")
print(f"Narrative Label: {result.label}")
Blockchain Audit Trail
To log a detected threat to the cross-border ledger:
code
Python
from aegis_llm.blockchain import ThreatLedger

ledger = ThreatLedger(provider_url="http://localhost:8545")
ledger.record_threat(
    threat_id="TR-99", 
    origin="Unknown", 
    confidence=0.98,
    metadata_hash="sha256..."
)
🛠️ Tech Stack
Frontend: Next.js 14, TypeScript, Tailwind CSS (Analyst Dashboard)
Backend/Database: Supabase (PostgreSQL), Next.js Server Actions
AI/ML: Python, Hugging Face (RoBERTa/T5), Groq API (Llama-3 analysis)
Security: SHA-256 Forensics, SQL-based coordination logic, JWT Authentication
📥 Installation
Clone the Repository
code
Bash
git clone https://github.com/tiyasadhwani2104/mitigating-national-security-risks-possed-by-LLMs.git
cd aegis-llm
Environment Setup
Create a .env.local file:
code
Env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GROQ_API_KEY=your_groq_key
Install & Run
code
Bash
npm install
npm run dev
📄 License
This project is licensed under the MIT License. Created for academic and national security research purposes.
