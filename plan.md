# Implementation Plan - Admin Interface for Amara Farms

Add a backend administrator interface for product management and order viewing.

## 1. State Management & Data
- Update `Product` interface to include `inStock: boolean`.
- Create an `Order` interface:
  ```typescript
  interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    location: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'pending' | 'completed';
    createdAt: string;
  }
  ```
- Initialize `products` state in `App.tsx` with `inStock` property.
- Create a `mockOrders` initial state.
- Add `view` state to track 'store', 'admin-login', or 'admin-dashboard'.

## 2. Components to Create/Modify
### Modify `App.tsx`
- **Main Layout Wrapper**: Add conditional rendering based on `currentView` ('store' | 'admin-login' | 'admin-dashboard').
- **Product Display**: Show "Out of Stock" for products where `inStock` is false. Disable "Add to Cart" for these.
- **Footer**: Update "Made by Teckocraft Industries" to be a button that sets `currentView` to 'admin-login'.

### New Section: `AdminLogin`
- Form with username and password fields.
- Validation for `shifter77` and `amara&hope`.
- Success: transition to 'admin-dashboard'.
- Error: show toast notification using `sonner`.

### New Section: `AdminDashboard`
- **Navigation Header**: Admin title and Logout button.
- **Tabs**: "Inventory" and "Orders".
- **Inventory Management**:
  - Table of all products.
  - Switch/Toggle for "In Stock" vs "Out of Stock".
- **Order Management**:
  - List of orders with details: customer, items, quantity, total, location, and date.
- **Back to Store**: Simple way to return.

## 3. Styling
- Colors: Green (`#064e3b`), White, Black, Gold (`#fbbf24`).
- Maintain existing responsive design patterns.

## 4. Interaction
- Ensure `addToCart` only works for available items.
- Footer admin link at the very bottom.
