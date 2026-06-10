@echo off
rem Run commands for Windows (Command Prompt)

rem 1. Install dependencies (use PowerShell or enable Corepack to get pnpm)
rem If you have Node's Corepack available, run in PowerShell:
rem   corepack enable
rem   corepack prepare pnpm@latest --activate

rem 2. Install dependencies
pnpm install

rem 3. Start development server
pnpm dev

rem 4. Build for production
pnpm build

rem 5. Run production server
pnpm start

rem 6. Lint
pnpm lint
