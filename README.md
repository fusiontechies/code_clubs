This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


To deploy your Next.js app on Netlify, follow these steps:

## Prerequisites
- Ensure you have a Next.js application ready for deployment.
- Have a Git provider account (e.g., GitHub, GitLab, Bitbucket).
- Create a Netlify account if you don’t have one.

## Deployment Steps

### Step 1: Prepare Your Next.js Application
1. **Put Your Code in a Git Repository**: Although this step is optional, it's highly recommended. This allows Netlify to automatically trigger deployments on code changes.
   - Initialize a Git repository if you haven't already:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```
   - Push your code to your preferred Git provider.

### Step 2: Create a New Site on Netlify
You can deploy your app using either the **Netlify CLI** or the **Netlify UI**.

#### Option 1: Using the Netlify CLI
1. **Install the Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```
2. **Log into Your Netlify Account**:
   ```bash
   netlify login
   ```
3. **Navigate to Your Project Directory**:
   ```bash
   cd ~/path/to/your/nextjs-site/
   ```
4. **Initialize a New Site**:
   ```bash
   netlify init
   ```
   - Follow the prompts to create and configure your new site.
   - Set the build command to `next build`.
   - For the publish directory, enter `out`.

#### Option 2: Using the Netlify UI
1. Go to [Netlify](https://app.netlify.com/start) and log in.
2. Select your Git provider and authorize Netlify to access your repositories.
3. Choose your Next.js repository from the list.
4. In the build settings:
   - Set the build command to `next build`.
   - Leave the publish directory blank or set it to `out` if you are using static export.
5. Click “Deploy Site”.

### Step 3: Add Next.js Plugin for Dynamic Features
To enable dynamic features like API routes and Preview Mode, add the **Next on Netlify plugin**:
1. Install the plugin by adding it to your project:
   ```bash
   npm install @netlify/plugin-nextjs --save-dev
   ```
2. Create or update your `netlify.toml` file with the following content:
   ```toml
   [build]
     command = "npm run build"
     publish = "out"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

### Step 4: Deploy and Monitor Your Site
After setting everything up, push any changes to your repository. Netlify will automatically trigger a deployment every time you push to the main branch.

### Additional Notes
- If you're using server-side rendering (SSR), ensure that you deploy from a Git repository as SSR cannot be achieved through manual file uploads[4].
- You can monitor deployment status and logs directly from your Netlify dashboard.

By following these steps, you will successfully deploy your Next.js application on Netlify, leveraging its powerful features for seamless hosting and continuous deployment[1][3].

Citations:
[1] https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/
[2] https://www.youtube.com/watch?v=pLsOUNfh-TU
[3] https://dev.to/mayorstacks/deploying-nextjs-13-apps-to-netlify-switching-out-an-existing-react-app-jep
[4] https://answers.netlify.com/t/deploy-nextjs-app-without-remote-repository/86890
[5] https://www.youtube.com/watch?v=e0-lSUbUXLc
[6] https://doc.sitecore.com/xp/en/developers/hd/latest/sitecore-headless-development/walkthrough--deploying-jss-next-js-apps-to-netlify.html