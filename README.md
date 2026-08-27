# Smart School Management System Deployment Guide

## Setup Phase A: Local Operations via XAMPP
1. Boot your **XAMPP Control Panel Engine** up and initialize `Apache` and `MySQL`.
2. Access `http://localhost/phpmyadmin/` within your system web browser.
3. Choose the **Import** console configuration tab, select `db_setup.sql`, and hit confirmation execute.

## Setup Phase B: Code Pipeline Tracking via GitHub
1. Create a blank private or public remote codebase platform target repository on `github.com`.
2. Open your target execution environment terminal dashboard console inside your local root workspace directory and run:
   ```bash
   git init
   git add .
   git commit -m "feat: init smart institutional multi-tier engine framework core"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPOSITORY_HTTPS_URL_LINK
   git push -u origin main
   ```

## Setup Phase C: Automated Web Deployment Architecture (Render)
1. Initialize access onto your cloud target management console on `dashboard.render.com`.
2. Deploy a new **Web Service** node and link it to your newly pushed GitHub project tree path.
3. Configure these exact environmental runtime matching keys within Render's **Environment** parameters tab:
   * `NODE_ENV` = `production`
   * `DB_HOST` = (Your target internal deployment link path provided by your live databases)
   * `DB_USER` = (Production Database Authorized Account user username parameter string value)
   * `DB_PASSWORD` = (Production Database Authorization passphrase hash key string credential)
   * `DB_NAME` = `school_db`
4. Deploy Service! Render will run `npm install` and trigger startup routines using `npm start` automatically.