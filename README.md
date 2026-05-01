# LeonardoBringas.com - Technical Content Platform

This repository contains the source code and architectural framework for leonardobringas.com, a specialized technical platform focused on Artificial Intelligence, Software Engineering, and Large Language Models (LLMs) research.

## Project Abstract

The system is engineered as a high-performance, lightweight Single Page Application (SPA) utilizing Vanilla JavaScript and a modular CSS architecture. The design philosophy prioritizes content delivery speed, search engine optimization (SEO), and internationalization (i18n) without the overhead of heavy frameworks.

## Key Technical Specifications

- **Architecture:** Client-side SPA with a custom-built routing engine.
- **State Management:** Native JavaScript state object with persistence via LocalStorage for user preferences.
- **Internationalization:** Bi-directional support (Spanish/English) with dynamic UI translation and content routing.
- **Deployment:** Continuous Integration and Continuous Deployment (CI/CD) via GitHub Actions, targeting GitHub Pages.
- **Content Delivery:** Dynamic fetching of decoupled HTML/JSON content to minimize initial bundle size.

## Repository Structure

```text
├── .github/workflows/  # CI/CD pipelines (GitHub Actions)
├── css/                # Modular styling system
│   ├── variables.css   # Design tokens
│   ├── base.css        # Global reset and core elements
│   └── [module].css    # Component-specific styles
├── javascript/         # Core application logic
│   ├── api.js          # Data fetching and resource management
│   ├── constants.js    # Global configuration and DOM references
│   ├── router.js       # SPA navigation and history management
│   └── utils.js        # Helper functions and SEO optimization
├── posts/              # Localized technical articles
├── pages/              # Static site sections (About, etc.)
└── index.html          # Main application entry point
```

## Setup and Development

To initialize a local development environment, clone the repository and serve it via a local HTTP server:

```bash
git clone https://github.com/LeoBringasAtLife/leonardobringas.com.git
cd leonardobringas.com
# Example using Python to serve content
python -m http.server 8000
```

The system requires no build step. All resources are loaded as native ES6 modules.

## Deployment Protocol

The deployment process is fully automated. Upon a merge into the `main` branch, the following sequence is triggered:

1. **Validation:** Structural integrity check of HTML and assets.
2. **Artifact Packaging:** Bundling of static assets and dynamic content files.
3. **Publication:** Deployment to the production environment via `actions/deploy-pages`.

## SEO and Social Integration

The platform implements a dynamic metadata injection system. Each content update triggers a refresh of the following Open Graph and Twitter Card properties:
- `og:title` / `og:description`
- `og:url` / `og:image`
- `twitter:card` / `twitter:title`

This ensures optimal indexing and high-fidelity social media previews across all platforms.

## License

This project is open-source. All rights reserved regarding the intellectual property of the published technical content.
