Legal Uplifter: The Digital Public Defender
Democratizing Justice through Generative AI
Legal Uplifter is an AI-powered platform designed to bridge the justice gap. Every year, millions of individuals sign predatory rental agreements, employment contracts, and loan documents because they cannot afford legal counsel. We transform complex, intimidating legal jargon into actionable intelligence, empowering the average citizen to understand and stand up for their rights.

The Social Mission
Legal literacy is a privilege that should be a universal right. Our platform focuses on:

Protecting Vulnerable Tenants: Identifying illegal no-guest or hidden fee clauses in leases.

Empowering Workers: Spotting unenforceable non-compete clauses and predatory penalty terms.

Reducing Anxiety: Turning a wall of text into a 2-minute clarity session for non-native speakers and those with lower legal literacy.

Key Features
Predatory Clause Detector: The AI cross-references documents against consumer protection laws to flag illegal or unfair terms in high-contrast visual alerts.

Fairness Score and Heatmaps: A visual representation of who the contract favors, allowing users to identify potential danger zones at a glance.

Voice-Interactive Q&A: An accessibility-first feature allowing users to ask questions like "What happens if I quit?" or "Can I have a pet?" using natural speech.

Negotiation Script Generator: Generates a polite, legally-grounded draft for the user to send to their landlord or employer to request changes to unfair clauses.

Legal Glossary Hover: Instant, plain-English definitions for archaic Latin terms and complex legalese.

Technical Architecture
Built with a high-performance stack designed for security and speed:

Frontend: React + Tailwind CSS (Mobile-responsive for on-the-go legal checks)

Backend: Convex (Real-time data management, secure serverless functions, and file storage)

AI Engine: Google Gemini API (Advanced reasoning, summarization, and risk analysis)

Vector Engine: FAISS / Pinecone (For RAG-based legal statute verification)

Authentication: Convex Auth (Secure, privacy-focused sign-in for sensitive legal data)

Project Structure
Bash
├── app/                # Frontend (React + Vite + Tailwind)
├── convex/             # Backend (Convex Functions & Schema)
│   ├── auth.ts         # Secure Authentication logic
│   ├── router.ts       # Protected HTTP API routes
│   └── schema.ts       # Database definitions
├── public/             # Static assets
└── package.json        # Dependencies
Quick Start
Prerequisites
Node.js and npm

Google Gemini API Key

Convex Account

Installation
Clone the repository:

Bash
git clone https://github.com/Krish02185/Legal_uplifter_
cd Legal_uplifter_
Install dependencies:

Bash
npm install
Start the Development Environment:

Bash
npm run dev
This command concurrently starts the Vite frontend and the Convex backend.

Environment Variables:
Create a .env.local file in the root and add your Gemini API keys as per the Convex dashboard requirements.

Impact Vision
Our goal is to provide a triage tool for local legal aid clinics and non-profits, helping them identify urgent cases while providing the general public with the baseline protection they deserve.

Legal Uplifter: Because "I Agree" should not be a leap of faith.
