# 🏨 Vercel Hotels AI Prompt

---

# 🌟 General Project Information

## 1. 🌟 Project Overview

تطوير متجر إلكتروني حديث لإدارة وحجز غرف سلسلة فنادق Vercel مع تجربة استخدام احترافية ودعم اللغتين العربية والإنجليزية.

يستطيع المستخدم:

إنشاء حساب وتسجيل الدخول
تصفح الفروع
البحث عن الغرف
تصفية النتائج
اختيار تاريخ الحجز
إضافة الغرف إلى الحجوزات
الدفع
مشاهدة الغرف المحجوزة
التواصل مع الشركة

## 2. 💻 Technical Details

🔧 Technologies Used:

React 19, Vite, TypeScript, Tailwind CSS, React Router, Redux Toolkit, React Hook Form, Zod, i18next, Day.js, Framer Motion, Lucide React, Shadcn UI

💾 Storage: Browser LocalStorage (with pre-seeded static data for branches/rooms)
🌐 Languages: Arabic (RTL), English (LTR)

UX Features:

- Advanced Search Experience
- Smart Room Filtering
- Image Gallery
- Room Comparison
- Booking Progress Steps
- Date Availability Calendar
- Skeleton Loading
- Empty States
- Error Handling
- Reviews System
- Recommendation System
- Mobile First Design
- Accessibility Support

## 3. 📁 Project Structure

```yml
src/
  ├── api/            # mock api services for LocalStorage data
  ├── assets/         # images and fonts
  ├── components/     # all components 
  │   ├── common/     # common components
  │   ├── layout/     # layout components
  │   ├── ui/         # shadcn ui components
  │   ├── room/       # room components
  │   ├── booking/    # booking components
  │   ├── branch/     # branch components
  │   └── filters/    # filters components
  ├── features/
  │   ├── auth/
  │   │   ├── authSlice.ts
  │   │   ├── auth.service.ts
  │   │   ├── auth.types.ts
  │   │   ├── auth.validation.ts
  │   │   └── ProtectedRoute.tsx
  │   ├── rooms/
  │   ├── bookings/
  │   ├── branches/
  │   ├── profile/
  │   └── home/
  ├── hooks/
  ├── layouts/
  ├── locales/
  │   ├── ar/
  │   └── en/
  ├── pages/
  ├── routes/
  ├── services/
  │   └── storage.service.ts
  ├── store/
  ├── styles/
  ├── types/
  ├── utils/
  ├── App.tsx
  └── main.tsx
```

---

## 4. Routes and Links

### Web Routes

```yaml
Home                 /:lang
About                /:lang/about
Rooms                /:lang/rooms
Room Details         /:lang/rooms/:id
Branches             /:lang/branches
Contact              /:lang/contact

Login                /:lang/login
Register             /:lang/register

Booking Cart         /:lang/cart
Checkout             /:lang/checkout
My Bookings          /:lang/bookings
Profile              /:lang/profile

404                  *
```

---

## 5. Project Features

- Arabic & English
- RTL / LTR
- Login
- Logout
- Register
- Hotel Branches
- Search Rooms
- Filter Rooms
- Room Details
- Available Rooms
- Booking Cart
- Checkout
- Paid Bookings
- User Profile
- Contact Page
- Responsive Design
- Dark Mode
- Toast Notifications
- Pagination
- Lazy Loading
- Browser LocalStorage Persistence (Mock API)

---

## 6. LocalStorage Data Schema (TypeScript / Zod)

The application models are persisted as JSON-serialized arrays under key-versioned namespace prefixes (`vh_v1_`). The structures of these entities are:
- **User**: `id` (UUID), `fullName` (string), `email` (string, unique), `password` (hashed string), `phone` (optional string), `createdAt` (ISO string).
- **Branch** (Pre-seeded): `id` (UUID), `nameAr`, `nameEn`, `cityAr`, `cityEn`, `addressAr`, `addressEn`, `stars` (1-5), `image` (URL string).
- **Room** (Pre-seeded): `id` (UUID), `branchId` (UUID), `roomNumber` (string), `nameAr`, `nameEn`, `pricePerNight` (number), `size` (number), `capacity` (number), `stars` (optional 1-5), `descriptionAr`, `descriptionEn`, `images` (array of URLs), `services` (array of strings), `isAvailable` (boolean).
- **Booking**: `id` (UUID), `userId` (UUID), `roomId` (UUID), `checkIn` (ISO string), `checkOut` (ISO string), `days` (number), `totalPrice` (number), `status` ('pending' | 'confirmed' | 'cancelled'), `paymentStatus` ('unpaid' | 'paid'), `createdAt` (ISO string).
- **Review**: `id` (UUID), `userId` (UUID), `roomId` (UUID), `rating` (1-5 number), `comment` (string), `createdAt` (ISO string).

## 7. Storage and Persistence Strategy

### A. Authentication & Password Security
- **Demo Mode**: Since this is an MVP/Demo, authentication utilizes a custom credential flow. However, to maintain high security standards, **passwords must never be stored or transmitted in plain text**.
- **Mock Hashing**: The Auth Service must implement client-side hashing (e.g. SHA-256 via the browser's native Web Crypto API: `crypto.subtle.digest('SHA-256', ...)`).
- **Disclaimer**: Code docstrings and the project README must include a prominent warning: *"In production, this must be handled by a secure backend database solution (e.g. Supabase Auth with bcrypt hashing)."*

### B. Storage Separation & Synchronization
- **LocalStorage (Single Source of Truth)**: Used for storing and querying dynamic entities including `User`, `Booking`, and `Review` records. It also stores dynamic/pre-seeded state for `Branch` and `Room` (read-only for guests, but initialized in local storage from code static files).
- **Transient Preferences**: LocalStorage also retains user preferences:
  - `language` (selected locale: 'ar' | 'en')
  - `theme` (active mode: 'dark' | 'light')
  - `cart` (temporary unconfirmed booking selection)
  - `auth_token` / `currentUser` (cached session reference)
- **Tab Synchronization**: Use the window `storage` event listener to synchronize state changes (e.g., logging out or changing the cart contents) across multiple open browser tabs.
- **Versioning & Migrations**: Implement a prefix naming convention (e.g., `vh_v1_`) for all LocalStorage keys to enable key versioning and smooth migrations if schemas change.

## 8. Service Abstraction Layer (Repository Pattern)

To decouple the UI features from database and storage implementations, the code must implement a service abstraction layer using TypeScript interfaces.
- Define service interfaces in `src/services/interfaces/` (e.g., `IAuthService`, `IRoomService`, `IBookingService`).
- UI features and Redux slices must import and invoke *only* the service interfaces, not direct LocalStorage manipulation.
- This design ensures that swapping the local storage service layer for a production-ready Supabase or REST API client in the future requires modifying only the service implementations, keeping UI component files untouched.

## 9. State Management Boundaries

We maintain strict separation between transient form state, client global state, and server cache state:
1. **React Hook Form + Zod**: Strictly manages form validation, validation error messages, and immediate form field values (e.g., sign-in form inputs, search parameters).
2. **Redux Toolkit (RTK)**: Stores client-only global application state (active UI language, active theme mode, mobile sidebar toggle state, and active shopping cart items).
3. **RTK Query / Custom Service Hooks**: Manages cached client-side repository state, pagination, and fetching logic for branches, rooms, bookings, and reviews.

## 10. Core UX & Architectural Patterns

### A. Testing Strategy
- **Unit & Integration Tests**: Setup Vitest and React Testing Library (RTL) to test business logic services, helper functions, Redux slices, custom hooks, and standalone UI components (like `RoomCard`, `Button`, and `LanguageSwitcher`).
- **End-to-End (E2E) Tests**: Use Playwright or Cypress to validate complete checkout journeys: registering a user -> logging in -> filtering rooms -> adding to cart -> completing simulated payment checkout -> verifying the booking in the profile dashboard.

### B. Reviews & Recommendation System
- **Reviews Schema**: Linked to both `User` and `Room` models. Contains ratings (1-5 stars) and user commentary.
- **Recommendation Logic**: Recommend matching rooms for a detailed room view. Recommendations are calculated client-side using:
  - Rooms located in the same hotel branch.
  - Price proximity within a +/- 20% range of the current room.
  - Prioritizing rooms with the highest average rating stars.

### C. Error Boundary System
- Wrap the main application shell with a custom `ErrorBoundary` component (using `react-error-boundary`).
- The component must intercept React rendering crashes, log details, and display an intuitive `ErrorState` fallback screen featuring a "Try Again" button to reload state safely without a full browser refresh.

### D. Image Handling & CDN Strategy
- Do not store raw `base64` strings inside local storage or database fields as it compromises browser memory.
- Seed data must use optimized, high-resolution CDN images (e.g. Unsplash URLs with resizing query params).
- User profile photo uploading is simulated with custom loading states and resolves to a mock URL saved to the user's LocalStorage profile.

### E. Internationalization (i18n)
- Use standard translation files under `src/locales/` (`ar.json`, `en.json`) structured under nested namespaces (`common`, `auth`, `rooms`, `bookings`).
- Support fallback language to English (`en`) if a key translation is missing in Arabic.
- Support correct pluralization and numerical interpolation (e.g., "1 Room", "3 Rooms").

### F. Dark Mode Tokens
- Implement dark mode using Tailwind CSS `class` strategy.
- Set up standard CSS variables in `src/styles/index.css` for semantic color mappings (e.g., `--background`, `--foreground`, `--primary`, `--card`, `--accent`).
- Apply these variables using Tailwind utility mappings (e.g. `bg-background text-foreground`).

### G. Accessibility (a11y)
- Target WCAG 2.1 AA level compliance.
- Interactive controls must include correct keyboard focus indicators.
- Modals, drop-downs, and drawer overlays must support `Tab` navigation trap and close on `Escape` keypress.
- Use explicit ARIA attributes (e.g., `aria-expanded`, `aria-label`, `aria-live`) on dynamic widgets.

### H. Pagination & Lazy Loading
- **Pagination**: Implement page-by-page controls or "Load More" controls for lists of rooms/bookings to minimize network payload.
- **Lazy Loading**: Use `React.lazy()` and React `Suspense` for path routes. Use native `loading="lazy"` or Intersection Observer for gallery images to improve initial page speed.

### I. Environment Variables & CI/CD
- **Environment Schema**: Setup Vite environment config inside `.env.example` and validate optional dev keys at application boot using Zod.
- **CI/CD Pipeline**: Add a basic GitHub Action workflow (`.github/workflows/ci.yml`) to automatically validate TypeScript compilation, trigger ESLint syntax checks, and run Vitest test suites on pull requests targetting the `main` branch.

### J. Checkout & Payment Simulation Warning
- The booking payment step must clearly present a warning disclaimer to the user: *"This is a simulated checkout demo. No real credit card or bank details are required, and no actual financial transactions will be processed."*

## 11. Components List
Navbar, Footer, Hero, SearchBox, RoomCard, RoomGallery, BookingCard, BookingSummary, BranchCard, FilterSidebar, Pagination, LanguageSwitcher, ThemeSwitcher, UserMenu, Loading, EmptyState, ErrorState, Modal, Toast, ErrorBoundary

## 12. Pages List
Home, About, Rooms, Room Details, Branches, Contact, Login, Register, Booking Cart, Checkout, My Bookings, Profile, 404

## 13. Room Filters
Branch, Price, Stars, Room Size, Capacity, Availability, Search

## 14. Room Card Details
Image, Room Name, Room Number, Price, Stars, Room Size, Capacity, Branch, Availability, Book Button, Details Button

## 15. Booking Flow
Home → Rooms → Room Details → Select Dates → Booking Cart → Checkout → Booking Success → My Bookings

## 16. Application Rules

- Save dynamic application data (users, bookings, reviews) in browser LocalStorage.
- Decouple authentication logic from the UI using Redux Toolkit and a modular Auth Service.
- Keep users logged in after refreshing the page.
- Prevent booking unavailable rooms.
- Automatically calculate booking duration.
- Automatically calculate total price.
- Support RTL and LTR.
- Responsive on all devices.
- Use reusable components.
- Feature-based architecture.
- Separate business logic from UI.
- Strict TypeScript.
- Lazy loading for pages.
- Clean code principles.
