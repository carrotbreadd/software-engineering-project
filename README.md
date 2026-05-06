## TITLE: CapyChat

## Overview

This is our Software Engineering Project, repository For CapyChat. Which is a Social Media platform
for UGA students to be able to inteact with each other, in a friendly environment to meet other students alike. 

- user signup and login
- session-based authentication
- a post feed with comments
- profile avatar selection with accessory options

## Layout

software-engineering-project/
+-- README.md
+-- uga-app/
    +-- app/
    +-- components/
    +-- lib/
    +-- models/
    +-- public/
    +-- package.json

### Dependencies

```bash
cd uga-app
npm install
npm install bcrypt
```

### Environment Variables

Create `uga-app/.env.local` and add mongodb Key to be able to access a database.

Example:

```env
MONGODB_URI=your-mongodb-connection-string
```

## Running The App

```bash
cd uga-app
npm run dev
```

Use the link `http://localhost:3000` in your browser.

## Available Scripts

Use the command below in the uga-app directory to run the application.

- `npm run dev` starts the application

## Current Features

- Signup and login forms with basic validation
- Persistent user accounts stored in MongoDB
- Random default profile image assignment at signup
- Profile page with accessory avatar choices
- Feed page for creating and viewing posts
- Comment support tied to posts and liking post
