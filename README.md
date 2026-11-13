# Introduction to Back-End Development (DA559A)

Your own repo for the course. You build an app in `src/` week by week, do smaller exercises in `practice/`, and write a
short report each week in `report/`. The week plan (what to prepare, the Friday agenda, deadlines) is in Canvas; it
links to the exercises and articles here.

Start with [exercise 1-05](exercise/1-05-lab-environment.md), which installs the tools, then
[1-10](exercise/1-10-get-ready.md), which sets up your own copy of this repo. All commands in the course are run in a
bash terminal: Git Bash on Windows.

## Who writes what

New exercises and articles arrive in the template during the course, and you pull them with `git pull upstream main`.
That only works without conflicts if you keep to this split:

| The teacher updates (do not edit) | You write |
|---|---|
| `README.md`, `doc/`, `exercise/` | everything else |

The files you get in your part at the start (the report templates, `package.json`, the config files) are given once
and never updated by the teacher, so they are yours to change.

## Directories

| Directory | Contents |
|---|---|
| `exercise/` | The exercises, named after the week: `1-10`, `1-20` … for week 1. Do them in order |
| `doc/` | Articles and reading instructions |
| `src/` | Your app, with the tests next to the code (`app.js`, `app.test.js`) |
| `public/` | Static files for the app: HTML, CSS, images |
| `practice/` | Small exercises that stand on their own, one directory each |
| `report/` | Your weekly reports, one file per week |

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the app (`src/server.js`) |
| `npm run dev` | Start the app and restart it when a file changes |
| `npm test` | Run all tests (`*.test.js`) |
| `npm run check` | Lint, format check and tests: run it before each push |
| `npm run lint:fix`, `npm run format` | Fix what ESLint and Prettier can fix themselves |
