@echo off
title Full Dev Environment

echo Running Prisma Migrate...
start cmd /k "npx prisma migrate dev"

echo Starting Prisma Studio...
start cmd /k "npx prisma studio"

echo Starting Next.js...
start cmd /k "npm run dev"

echo All services started.
pause
