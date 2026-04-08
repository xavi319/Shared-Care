# Shared-Care

SharedCare is a secure, user-friendly portal that helps nursing home caregivers share consistent, easy to understand updates with authorized families about a resident's day-to-day well-being. Instead of families feeling out of the loop or only hearing news when something is wrong, SharedCare provides predictable check-ins and activity updates in one place, reducing anxiety and miscommunication. Built with resident consent, privacy-first access controls, and HIPAA-aligned design principles, SharedCare strengthens trust while making communication faster and more sustainable for busy care teams.

## MVP Features

- Resident profile (appointments, medications, lab results, allergies, prior care documentation)
- Secure communication channel (care team ↔ family / resident)
- Resident-authorized access controls (who can see what)
- Plain-language explanations of care information

## Current Frontend Structure

- `src/main.jsx` boots the app and wraps it in React Router.
- `src/App.jsx` defines the client-side routes.
- `src/pages/` holds route-level screens like dashboard, residents, resident detail, login, and not found.
- `src/components/` holds reusable UI like the shared shell, top bar, sidebar, icons, and stat cards.
- `src/data/mockData.js` contains the capstone prototype mock data only.
- `src/styles/globals.css` preserves the existing SharedCare styling.

## Contributing

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   npm install
   npm run dev
   ```

2. **Create new branch**

   ```bash
   git checkout -b feature/<short-name>
   ```

3. **Make changes + test locally**

4. **Commit and push**

   ```bash
   git add .
   git commit -m "Add family timeline view"
   git push -u origin feature/<short-name>
   ```

5. **Open a pull request**
    - Describe what changed

    - Add screenshots for UI changes

    - Request review from a teammate before merging

## Notes

- This project now uses plain React + JSX with Vite instead of Next.js.
- Routing is handled with React Router.
- The current caregiver flow is still mock-only, with no backend, database, or real authentication attached.
