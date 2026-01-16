# Stanect

### AI-Powered Voice Companion for Building Communication Confidence

Stanect is a Software-as-a-Service (SaaS) platform that helps people improve their communication skills through realistic, AI-driven voice conversations.
It provides a private, on-demand environment where users can practice speaking, gain confidence, and improve social fluency without fear of judgment.

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Stanect Features](#stanect-features)
- [Stanect Architecture](#stanect-architecture)
  - [Platform Overview](#platform-overview)
  - [Subscription & Billing Flow](#subscription--billing-flow)
  - [Security & Data Protection](#security--data-protection)
- [Stanect Demo](#stanect-demo)
- [Product Status](#product-status)
- [Founder](#founder)

## The Problem

Many people struggle with real-world conversations — networking, interviews, meeting new people, or speaking confidently in social settings.

Existing solutions are often:

- Static (courses, videos, articles)
- Non-interactive
- Lacking real conversational feedback

## The Solution

Stanect delivers **interactive, voice-based conversational practice** powered by AI, allowing users to:

- Practice conversations anytime
- Build confidence through repetition
- Improve naturally in a safe environment

This makes Stanect a **scalable, always-available** communication coach.

## Stanect Features

- 🔐 User Authentication & Accounts (Clerk)
- 🤖 AI-powered voice conversations
- 📊 User dashboard & session tracking
- 💳 Subscription plans & billing (Paystack)
- 🧾 User & subscription state management
- ⚡ Fast, responsive UI

## Stanect Architecture

Stanect is built as a **full-stack SaaS application** using modern, production-ready technologies.

### Platform Overview

**Frontend**: Next.js (App Router)
**Backend**: Next.js Server Actions & API routes
**Language**: TypeScript
**Database**: Supabase (PostgreSQL)
**Authentication**: Clerk
**Payments**: Paystack (Subscriptions + Webhooks)
**Styling**: Tailwind CSS
**AI Services**: Vapi Voice AI(Eleven Labs and Open AI Compatible)
**Deployment**: Cloud-ready (Vercel compatible)

### Subscription & Billing Flow

- User signs up via Clerk
- User selects a subscription plan
- Payment is processed via Paystack
- Paystack webhook verifies payment
- User subscription status is updated in Supabase
- Platform access is granted or restricted based on plan

All billing logic is handled **securely on the server**.

## Security & Data Protection

- Server-only handling of sensitive operations
- Strict separation of client and server logic
- Supabase Row Level Security (RLS) for user data isolation
- Secure webhook verification for payment events
- Environment-based configuration for dev and production

## Stanect Demo

Screenshots and demo video coming soon.

## Product Status

Stanect is an **active SaaS product** currently focused on:

- Improving AI conversational quality
- Enhancing reliability in production
- Expanding subscription offerings
- Refining onboarding and user experience

## 👤 Founder

Prince Amanor Kabutey

Founder & Software Engineer

GitHub: https://github.com/KAPrince99
