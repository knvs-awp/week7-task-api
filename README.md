# Week 7 Task API

Lab explanations, screenshots, security findings and test results are included in the PDF submitted with this repository link.

## Installation and startup

Install Node.js and Docker Desktop, then open Docker Desktop and wait for the engine to start.

1. Clone the repository and install its dependencies.

   ```powershell
   git clone https://github.com/knvs-awp/week7-task-api.git
   cd week7-task-api
   npm install
   ```

2. Copy the environment template, then replace the `SESSION_SECRET` placeholder in `.env` with a long random value, keeping `PORT=3000` and `REDIS_URL=redis://localhost:6380`.

   ```powershell
   Copy-Item .env.example .env
   ```

   Keep `.env` out of Git because it contains the session secret.

3. Create the Redis container, which maps host port 6380 to Redis port 6379 inside Docker.

   ```powershell
   docker run -d --name week7-redis-lab6 -p 6380:6379 redis:7-alpine
   ```

   If the container already exists, start it with `docker start week7-redis-lab6` instead.

4. Confirm Redis is running, then start the Express server and leave it running while testing the API.

   ```powershell
   docker ps
   npm run dev
   ```

5. Open http://localhost:3000/api/tasks/health, which should return `{"status":"ok","service":"task-api"}` with status 200.
