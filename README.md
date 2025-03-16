# Financial Flowchart

A React application that displays a financial decision flowchart with an interactive UI.

## Getting Started

### Prerequisites

- Node.js (version 18 or later recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/[username]/financial-flowchart.git
cd financial-flowchart

# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev
```

## Building for Production

```bash
# Build the application
npm run build
```

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages. There are two ways to deploy:

### Manual Deployment

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://[your-username].github.io/financial-flowchart"
   ```

2. Run the deploy command:
   ```bash
   npm run deploy
   ```

   This will build the application and push the compiled files to the `gh-pages` branch.

### Automated Deployment with GitHub Actions

The repository is set up with a GitHub Actions workflow that automatically deploys the application to GitHub Pages when changes are pushed to the main branch.

To set up automated deployment:

1. Push your code to GitHub.
2. Go to your repository's Settings > Pages.
3. For the source, select "GitHub Actions".
4. Make sure the `base` property in `vite.config.ts` matches your repository name.

## Notes

- The application uses Vite for development and building.
- The base path is set to `/financial-flowchart/` for GitHub Pages deployment. If you're deploying to a different URL, update the `base` property in `vite.config.ts`.
