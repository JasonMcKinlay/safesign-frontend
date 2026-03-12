# Development Setup Guide

## Fixed Issues ✓
- Removed conflicting `next-pwa` package (kept `@ducanh2912/next-pwa`)
- Configured webpack explicitly to avoid Turbopack conflicts
- Clean dependencies installed

## Running the Development Server

### Option 1: Local Development (Desktop Only)
```bash
npm run dev
```
Access at: `http://localhost:3000`

### Option 2: Mobile & Network Access (RECOMMENDED)
```bash
npm run dev:mobile
```
Access on your phone at: `http://<YOUR_MACHINE_IP>:3000`

Your local machine IP will be displayed in the terminal output. Example:
```
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
```

## Troubleshooting

### If "npm run dev" fails to start:
1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verify it's using webpack:**
   Check that the output shows `Next.js (webpack)` not `Next.js (turbopack)`

### If you can't access from mobile:
1. **Check firewall:** Windows Firewall must allow Node.js on port 3000
2. **Verify IP:** Run `ipconfig` in PowerShell to find your IPv4 address
3. **Same network:** Phone and computer must be on the same WiFi network
4. **Port forwarding:** If on different networks, you'll need to expose port 3000

### If camera doesn't work:
- HTTPS is required on production (PWA requirement)
- On localhost/local network, it should work over HTTP
- Grant camera permissions when browser asks

## Build for Production

```bash
npm run build
npm start
```

PWA features are **disabled in development** for stability but will be **enabled for production builds**.

## Ports & Environment

- **Dev Server:** Port 3000
- **Node Version:** v20.16.0 (compatible)
- **Next.js:** 16.1.6 (webpack mode)

