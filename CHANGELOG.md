# Changelog

All notable changes to the ExpendMore platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-27

### Added
- **Multi-Tenant Workspace Isolation**: Implemented organization and workspace database mappings and secure row level permissions.
- **Workflow Execution Engine**: Built a step-by-step compiler executing sequential or branched nodes.
- **RAG & Vector Search**: Created overlapping sliding text chunker and semantic cosine search indexes retrieval mapping.
- **Enterprise File Storage**: Configured S3, R2, and local fallback providers managed by a central dynamic `StorageManager`.
- **SaaS Billing & Subscriptions**: Integrated multi-gateway payments selector supporting Stripe and Razorpay flows with CGST/SGST/IGST tax logic.
- **Notification Engine**: Developed multi-channel notifications dispatcher delivering SMTP/Resend emails, FCM push, and in-app notifications.
- **Webhooks & Event Bus**: Setup HMAC SHA256 webhooks verifiers and publisher event bus.
- **Realtime Gateway**: Implemented user presence engine and AI streamed token generators.
- **Observability SDK**: Built OpenTelemetry trace builders and JSON log secret redact filters.
- **DevOps configurations**: Added multi-stage standalone Dockerfile, docker-compose orchestration stacks, and Nginx proxy routing scripts.
