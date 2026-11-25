# Greenscape interactive demo

A browser-local sales prototype with fictional records. The role selector previews interface permissions. Production authentication, AI, live GPS and offline transport are simulated.

## Run locally

Use Node 22.12 or later. From this directory run npm ci, then npm run dev. Open the printed URL. Use npm run build to produce dist and npm run preview to serve the build. The app uses hash routes, including #/pilot and #/system.

Start with Service dispatch, then switch to Field crew to record proof. Return as Dispatcher / Supervisor to publish. Switch to Customer approver to approve or raise an issue. Reset demo restores all sample records. The independent Mangrove account uses its own visit.

GitHub Pages builds the app from main through .github/workflows/pages.yml.

