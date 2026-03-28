# Sanity CMS Setup Guide

## Step 1: Create a Sanity Project

Run this in a **separate directory** (not inside this Vite project):

```bash
cd ~/Downloads
npm create sanity@latest -- --project-name "soni-labs-cms" --dataset production
```

Follow the prompts to create your Sanity account/project.

## Step 2: Copy Schemas into Sanity Studio

Copy the schema files from `sanity-schemas/` in this project into your Sanity Studio's `schemaTypes/` folder:

```bash
cp "Claude code/SONI LABS STUDIO/sanity-schemas/"*.js ~/Downloads/soni-labs-cms/schemaTypes/
```

Then register them in your Studio's `schemaTypes/index.js`:

```js
import faq from './faq'
import testimonial from './testimonial'
import project from './project'
import service from './service'

export const schemaTypes = [faq, testimonial, project, service]
```

## Step 3: Update Environment Variables

Edit `.env` in this project with your Sanity project ID:

```
VITE_SANITY_PROJECT_ID=your_actual_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

Find your project ID at [sanity.io/manage](https://sanity.io/manage).

## Step 4: Configure CORS

In your Sanity project settings (sanity.io/manage → your project → API → CORS origins), add:

- `http://localhost:5173` (for local dev)
- Your production domain when you deploy

## Step 5: Populate Content

Run your Sanity Studio (`npm run dev` in the Studio directory), then add your FAQ items, testimonials, projects, and services through the Studio UI.

## How It Works

- Components use `useSanityData()` hook to fetch from Sanity
- If Sanity is unreachable or returns empty data, **fallback content is displayed** (the current hardcoded content)
- No content will break if Sanity is not connected yet
- Currently integrated: **FAQ** and **Testimonials**
- Ready for integration: **WorkShowcase** and **Services** (schemas provided)
