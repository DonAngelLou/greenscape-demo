# Greenscape interactive demo

A browser-local sales prototype with fictional records. The role selector previews interface permissions. Production authentication, AI, live GPS and offline transport are simulated.

## Run locally

Use Node 22.12 or later. From this directory run npm ci, then npm run dev. Open the printed URL. Use npm run build to produce dist and npm run preview to serve the build. The app uses hash routes, including #/pilot and #/system.

Open the pilot overview and select Start pilot walkthrough. Change phases with the top-bar Rollout dropdown, then select a module in the sidebar. The Preview as dropdown switches personas. Use module tabs for the lot map, crew routes, published documents, nursery records, and stock workflows. In the pilot, schedule the visit in Service dispatch and switch to Field crew to record proof. Return as Dispatcher / Supervisor to publish. Switch to Customer approver to approve or raise an issue. Reset demo restores all sample records. The independent Mangrove account uses its own visit.

GitHub Pages builds the app from main through .github/workflows/pages.yml.
