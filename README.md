This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Mobile App Development (Capacitor)

We wrapped RecruitFlow AI using Capacitor to target iOS and Android using the existing codebase.

### Mobile Scripts

- **Sync Assets & Configs**: Run this script anytime you make configurations changes or build the web app:
  ```bash
  npm run mobile:sync
  ```
- **Open Android Studio**: Opens the Android studio project from `android/` directory:
  ```bash
  npm run mobile:open:android
  ```
- **Open Xcode**: Opens the Xcode project/workspace from `ios/` directory:
  ```bash
  npm run mobile:open:ios
  ```

### Live Reload / Server Hosting
The app is configured in `capacitor.config.ts` to load from your hosted environment:
```ts
server: {
  url: 'https://recruitflow.ai',
  cleartext: true
}
```
You can change the `url` to point to a local development IP (e.g., `http://192.168.x.x:3000`) for live reloading during mobile testing.

