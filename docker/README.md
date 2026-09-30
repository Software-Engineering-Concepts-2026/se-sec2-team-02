# Docker Container Documentation: Community Connector (JOB UP)

## Image Information
* **Image Name:** `job-up-app:v0.1.0`
* **Base Image:** `node:20-alpine` (multi-stage build)
* **Target Environment:** Next.js application runtime
* **Registry target:** `ghcr.io/<github-owner>/job-up-app:v0.1.0` or `<dockerhub-username>/job-up-app:v0.1.0`

The image uses three stages. Dependencies are installed in `deps`, the Next.js
application is compiled in `builder`, and only the standalone production output
is copied into the smaller `runner` image. The runner uses the non-root
`nextjs` user.

## Container vs Virtual Machine

| Topic | Container | Virtual machine |
|---|---|---|
| Isolation | Process-level isolation using the host kernel | Full guest operating system and kernel |
| Startup and size | Fast startup and usually a smaller image | Slower startup and usually a larger disk image |
| Resource use | Shares the host kernel, so overhead is low | Allocates resources to a complete guest OS |
| Best fit here | Package and run the Next.js service consistently in CI/deployment | Strong OS-level isolation or a different guest OS is required |

For this project, a container is appropriate because the application already
runs on Node.js and needs repeatable packaging rather than a separate OS.

## Build, Run, and Verify

Run these commands from the repository root:

```bash
docker build -t job-up-app:v0.1.0 .
docker image ls job-up-app:v0.1.0
docker run --rm -d --name job-up-app -p 3000:3000 job-up-app:v0.1.0

# The application endpoint should return a successful 2xx response.
curl -i http://localhost:3000/

docker stop job-up-app
```

The exact image size is environment-dependent. Record the value printed by
`docker image ls` in the Lab 6 PR or report; this avoids claiming a size that
depends on the local Docker cache and platform. A successful verification is
an HTTP `2xx` response from the application endpoint. The stats-service checks
below verify its dedicated `/health` and `/api/stats` endpoints.

Build result on 2026-09-30: `job-up-app:v0.1.0` was `282MB`, and the main `/`
endpoint returned `HTTP 200`.

The statistics service is built and run separately:

```bash
docker build -t stats-service:v0.1.0 ./services/stats-service
docker run --rm -d --name stats-service -p 5000:5000 stats-service:v0.1.0
curl -i http://localhost:5000/health
curl -i http://localhost:5000/api/stats
docker stop stats-service
```

The stats-service runner executes as the non-root `node` user.

Build result on 2026-09-30: `stats-service:v0.1.0` was `250MB`, and the image
configuration reported user `node`.

## Publish v0.1.0

Replace the placeholders with the public Docker Hub or GitHub Container
Registry namespace that owns the repository:

```bash
# Docker Hub
docker tag job-up-app:v0.1.0 <dockerhub-username>/job-up-app:v0.1.0
docker login
docker push <dockerhub-username>/job-up-app:v0.1.0

# Or GitHub Container Registry
docker tag job-up-app:v0.1.0 ghcr.io/<github-owner>/job-up-app:v0.1.0
echo "$CR_PAT" | docker login ghcr.io -u <github-owner> --password-stdin
docker push ghcr.io/<github-owner>/job-up-app:v0.1.0
```

Set the package visibility to **Public** in the registry and attach a
screenshot of the tag and visibility to the Lab 6 pull request. Registry login,
push, and screenshots require the team's credentials and cannot be performed
from this workspace without them.

## Build & Run Instructions

### 1. Build Docker Image
```bash
docker build -t job-up-app:v0.1.0 .