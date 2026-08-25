# Docker Container Documentation: Community Connector (JOB UP)

## Image Information
* **Image Name:** `job-up-app`
* **Base Image:** `node:20-alpine` (Multi-stage build)
* **Target Environment:** Next.js Application Runtime

## Build & Run Instructions

### 1. Build Docker Image
```bash
docker build -t job-up-app:v0.1.0 .