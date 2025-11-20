# 🚀 Beginner's Guide: Deploying Your App

This guide will take you from zero to a live website using **Github** and **Netlify**.

---

## Phase 1: Get your Gemini API Key 🔑

The app uses Google's Gemini AI. You need a key to make it work.

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click **"Get API key"** (usually on the top left).
4.  Click **"Create API key"**.
5.  **Copy the key** (it starts with `AIza...`). Save this in a text file for now; you will need it in Phase 2 and Phase 4.

---

## Phase 2: Local Setup 💻

We need to get the code running on your computer first.

### 1. Install Node.js
If you haven't already, download and install **Node.js (LTS version)** from [nodejs.org](https://nodejs.org/).

### 2. Set up the folder
1.  Create a new folder on your Desktop called `market-mind-app`.
2.  Open that folder in a code editor (like VS Code).
3.  **Create the files:** Copy the content of every file provided in the code editor (files like `package.json`, `vite.config.ts`, `src/App.tsx`, etc.) and save them into your folder.
    *   *Note:* Make sure you create the folders too! (e.g., create a `services` folder for `services/gemini.ts`).

### 3. Install dependencies
Open your terminal (Command Prompt or Terminal app), navigate to your folder, and run:

```bash
npm install
```

### 4. Test it locally
Create a file named `.env` in the main folder. Add this line (paste your key):

```
API_KEY=AIzaSy......(your key here)
```

Now run:
```bash
npm run dev
```
Open the link shown (usually `http://localhost:5173`) to see your app working!

---

## Phase 3: Saving to GitHub 🐙

GitHub is where your code lives in the cloud.

1.  **Create a GitHub Account:** Go to [github.com](https://github.com/) and sign up.
2.  **Create a Repository:**
    *   Click the **+** icon in the top right -> **New repository**.
    *   Name it `market-mind`.
    *   Make it **Public**.
    *   Click **Create repository**.
3.  **Push your code:**
    Back in your terminal (in your project folder), run these commands one by one:

```bash
git init
git add .
git commit -m "My first AI app"
git branch -M main
# Replace URL below with the one GitHub shows you after creating the repo!
git remote add origin https://github.com/YOUR_USERNAME/market-mind.git
git push -u origin main
```

---

## Phase 4: Deploy to Netlify 🌍

Netlify takes your code from GitHub and puts it on a real website.

1.  Go to [netlify.com](https://www.netlify.com/) and sign up (**Log in with GitHub** makes it easiest).
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Click **GitHub**.
4.  Search for `market-mind` and select it.
5.  **Configuration:**
    *   **Build command:** `npm run build` (Netlify usually fills this in automatically).
    *   **Publish directory:** `dist` (Netlify usually fills this in automatically).
6.  **⚠️ CRITICAL STEP: Environment Variables**
    *   Click **"Add environment variable"**.
    *   **Key:** `API_KEY`
    *   **Value:** (Paste your `AIza...` key from Google AI Studio here).
7.  Click **"Deploy market-mind"**.

Wait about 1 minute. Netlify will give you a green link (e.g., `https://random-name-123.netlify.app`). Click it, and your AI app is live for the world to see! 🎉
