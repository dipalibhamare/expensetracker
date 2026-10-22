# Expense Tracker — Angular + Netlify Ready

A dynamic Expense Tracker built with Angular.

## Features
- Add, edit and delete expenses
- Search expenses
- Filter by category and date
- Automatic total and average
- Category-wise spending breakdown
- localStorage persistence
- Responsive design
- Netlify deployment configuration included

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Deploy to Netlify

### Option 1 — GitHub
1. Upload this project to GitHub.
2. In Netlify, choose **Add new project → Import an existing project**.
3. Select the GitHub repository.
4. Netlify will read `netlify.toml` automatically.
5. Deploy.

The build settings are already configured as:
- Build command: `npm run build`
- Publish directory: `dist/expense-tracker/browser`
- Node.js: 22

### Option 2 — Netlify CLI

```bash
npm install
npm run build
```

Then deploy the `dist/expense-tracker/browser` folder with Netlify.

## Important

Expenses are saved in the browser's localStorage. They are not stored in a server/database. If you open the deployed website on another browser/device, it will have its own local data.
