# Implementation Plan - Amara Farms Admin & Customer Enhancements

## 1. Data Model & Supabase Integration
- Since `IS_SUPABASE_REQUIRED: true`, I will implement a Supabase client in `src/lib/supabase.ts`.
- Update the `Order` interface to ensure it captures: `customerName`, `customerPhone`, `location`, and `customerPreference`.
- The `Product` interface will continue to support `price` and `inStock`.
- Logic will be implemented to sync these with Supabase tables (`products`, `orders`).

## 2. Customer UI Enhancements
- **Checkout Modal**:
  - Group customer information fields (Name, Phone, Location, Preference).
  - Add icons and clear labels for each field.
  - Ensure validation for all required fields.
  - Add a "Preference" textarea for special instructions.

## 3. Administrator Portal Enhancements
- **Authentication**: Keep existing credentials (`shifter77` / `amara&hope`).
- **Inventory Management**:
  - Enhance the table to allow inline price editing.
  - Use a clear "Save" and "Cancel" mechanism for price updates.
  - Maintain the stock toggle.
- **Order Management**:
  - Create a detailed "Order Details" view or expanded card for each order.
  - Ensure the customer's phone number, location, and preference are prominently displayed.
  - Add status management (Pending -> Paid -> Delivered).

## 4. Visual Design (Theme Preservation)
- Primary Color: Emerald Green (`#064e3b` / `text-emerald-800`).
- Accent Color: Gold (`#fbbf24` / `text-amber-400`).
- Clean, modern layout using Tailwind CSS and `framer-motion` for smooth transitions.

## 5. Implementation Steps
- Create `src/lib/supabase.ts`.
- Update `src/App.tsx` with enhanced logic and UI components.
- Validate the build and ensure responsiveness.
