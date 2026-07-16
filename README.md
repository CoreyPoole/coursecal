# CourseCal - Interactive Planner for Educators

CourseCal is a full-stack, responsive scheduling application engineered to help educators organize, track, and manage their instructional sessions, tutoring blocks, and administrative tasks.

[Live Deployment Link](https://coursecal-six.vercel.app/)

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Database:** MongoDB Atlas, Mongoose ODM
- **Scheduling Architecture:** React Big Calendar, Date-fns
- **Hosting & Deployment:** Vercel CI/CD

## Features
- **Full CRUD Functionality:** Seamlessly create, read, and delete calendar events with instant UI updates.
- **Dynamic Color Architecture:** Implements a deterministic string-hashing algorithm that scambles unique database IDs into stable HSL color vectors, ensuring every distinct event receives a unique visual identity that survives page refreshes.
- **Persistent Storage:** Fully integrated database layer ensuring data durability across client sessions.
- **Cloud Optimized:** Configured with decoupled environment variable injections and dynamic firewall whitelists for secure cloud server authentication.
