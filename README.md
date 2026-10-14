# PCA Aisyiyah Sugio — Organization Website & CMS

A modern, responsive website for **Pimpinan Cabang Aisyiyah Sugio**, designed to provide organizational information, showcase community activities, publish news, and display products from local members through a centralized content management system.

The project combines a public-facing website with a custom admin dashboard, allowing authorized administrators to manage website content without editing the source code.

## Overview

PCA Aisyiyah Sugio is a digital platform built to support the organization's online presence and simplify content management. The website presents organizational profiles, leadership information, branch details, products, activities, news, and photo galleries in a consistent and accessible interface.

### Key Features

- **Responsive Website** — Optimized layouts for desktop, tablet, and mobile devices.
- **Admin Authentication** — Protected admin dashboard with session-based authentication.
- **Product Management** — Create, view, update, and delete product listings.
- **Agenda Management** — Manage organizational events and schedules.
- **News & Articles** — Create and manage articles with draft and published statuses, unique slugs, and publication dates.
- **Activity Management** — Publish and maintain organizational activity updates.
- **Gallery Management** — Upload and manage photos displayed in the public gallery.
- **Organization Profile Management** — Manage history, vision and mission, organizational structure, leadership members, and branch information.
- **Image Uploads** — Upload and serve images through Cloudflare R2 integration.
- **Dynamic Content** — Retrieve website content from a database instead of relying entirely on hardcoded data.
- **Interactive UI** — Includes responsive navigation, carousels, hover effects, and scroll-based visual animations.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React & TypeScript | Component-based UI and type safety |
| Tailwind CSS | Responsive styling and UI development |
| Cloudflare Workers | Application deployment and server-side runtime |
| OpenNext | Next.js compatibility and deployment tooling for Cloudflare |
| Cloudflare D1 | Relational database for website content and admin sessions |
| Cloudflare R2 | Object storage for uploaded images |
| Wrangler | Cloudflare development and deployment CLI |

## Website Pages

### Public Website

| Page | Description |
|---|---|
| `/` | Homepage with organizational highlights and content sections |
| `/profil` | Organization overview |
| `/profil/sejarah` | Organizational history |
| `/profil/visi-misi` | Vision and mission |
| `/profil/struktur-organisasi` | Organizational structure |
| `/profil/kepengurusan` | Leadership and management members |
| `/profil/ranting` | Branch information |
| `/produk` | Member products |
| `/kegiatan` | Organizational activities |
| `/berita` | News and articles |
| `/berita/[slug]` | Individual article details |
| `/galeri` | Photo gallery |
| `/kontak` | Contact information |

### Admin Dashboard

| Route | Description |
|---|---|
| `/admin/login` | Administrator login |
| `/admin` | Dashboard overview |
| `/admin/products` | Product management |
| `/admin/agendas` | Agenda management |
| `/admin/articles` | News and article management |
| `/admin/activities` | Activity management |
| `/admin/gallery` | Gallery management |
| `/admin/settings` | Website profile and contact settings |
| `/admin/profile/*` | Organization profile content management |

## Architecture

The application separates the public website from the protected administration interface.

```text
                    Visitors
                       |
                       v
              Next.js Public Website
                       |
                       v
                Next.js API Routes
                       |
             +---------+---------+
             |                   |
             v                   v
       Cloudflare D1       Cloudflare R2
       Structured Data    Uploaded Images
             ^
             |
       Admin Dashboard
             ^
             |
      Session Authentication
```

- **Cloudflare D1** stores structured content such as products, agendas, articles, gallery entries, organization members, and admin sessions.
- **Cloudflare R2** is configured for image storage and retrieval.
- **Next.js API routes** handle content operations and image uploads.
- **Session-based authentication** protects the admin interface from unauthorized access.

## UI & Design

The visual identity uses a nature-inspired palette and a combination of serif and sans-serif typography.

| Design Element | Value |
|---|---|
| Primary Green | `#0B4F3F` |
| Dark Green | `#082F26` |
| Cream | `#F5F0E4` |
| Gold | `#C68A2E` |
| Sage | `#E7EFE9` |
| Display Font | Fraunces |
| Body Font | Plus Jakarta Sans |

The interface emphasizes readability, clear navigation, responsive layouts, and visual consistency across the public website and administration dashboard.

## Local Development

### Prerequisites

- Node.js 22 or a compatible version
- npm
- A Cloudflare account for Cloudflare-specific functionality
- Wrangler CLI access to the configured Cloudflare resources

### Installation

1. Clone the repository:

   ```bash
   git clone <YOUR_PUBLIC_REPOSITORY_URL>
   cd pca-aisyiyah-sugio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the required environment variables and Cloudflare bindings for your local environment.

   Keep credentials and secrets in local environment files such as `.dev.vars`. Do not commit secret values to GitHub.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

> Some features require valid Cloudflare D1 and R2 bindings. Configure the resources and database migrations before testing database-dependent functionality.

## Database Migrations

This project uses Wrangler-managed Cloudflare D1 migrations.

To inspect migration status:

```bash
npx wrangler d1 migrations list pca-aisyiyah-sugio-db --remote
```

To apply pending migrations to the remote database:

```bash
npx wrangler d1 migrations apply pca-aisyiyah-sugio-db --remote
```

Ensure that the database name matches your Cloudflare configuration and review pending migrations before applying them.

## Deployment

The project uses OpenNext to build and deploy the Next.js application to Cloudflare Workers.

```bash
npm run deploy
```

The deployment process builds the Next.js application, generates the OpenNext Worker bundle, and invokes Wrangler to publish it.

Before deploying, verify that:

- Cloudflare authentication is configured.
- The D1 database and its required migrations are ready.
- The configured R2 bucket exists and is enabled for the account.
- All required bindings match `wrangler.jsonc`.
- Secrets are configured securely and are not committed to the repository.

## Security & Configuration

- Do not commit `.dev.vars`, `.env` files containing secrets, API keys, passwords, or session secrets.
- Do not publish production credentials or administrator login details.
- Keep database IDs and resource names consistent with your deployment configuration.
- Review authentication and API authorization before exposing administrative endpoints publicly.

## Project Goals

This project demonstrates the implementation of a content-driven organizational website with a custom CMS, database-backed content management, image uploads, and cloud deployment architecture.

It also provides practical experience in responsive UI development, API integration, authentication, database migrations, and deployment workflows.

## Author

**Azam**  
Web Development · UI Implementation · Cloud Deployment

Built as a website development project for PCA Aisyiyah Sugio.

---

*This repository is intended for portfolio and demonstration purposes. Organizational content, branding assets, and uploaded images may belong to their respective owners.*
