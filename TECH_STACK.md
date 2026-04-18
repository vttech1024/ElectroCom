# MERN E-Commerce Blueprint

## Tech Stack

### Frontend
- React (TypeScript)
- Axios
- Tailwind CSS
- React Hook Form
- React Router DOM

### Backend
- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- `server.ts` as the single app/bootstrap server entry
- Route files inside `routes/`

### Database / Infra
- MongoDB (run with Docker Compose)
- Package manager: pnpm

---

## Backend Folder Blueprint

```txt
backend/
  server.ts
  routes/
    auth.routes.ts
    products.routes.ts
    orders.routes.ts
    seller.routes.ts
  models/
    User.ts
    Product.ts
    Order.ts
```

---

## Backend Routes

### Auth Routes (`routes/auth.routes.ts`)
- `POST /api/auth/signup`
  - Input: `name, email, password`
  - Output: `userId, name, email`
- `POST /api/auth/login`
  - Input: `email, password`
  - Output: `userId, name, email`

> On login, store `userId` in `localStorage` and reuse it for identification on protected APIs.

### Product Routes (`routes/products.routes.ts`)
- `GET /api/products`
  - Discover/list all products
- `GET /api/products/:productId`
  - Product details
- `POST /api/products`
  - Seller adds product
  - Requires `userId` (seller id)
- `GET /api/products/seller/:sellerId`
  - Seller’s own products

### Order Routes (`routes/orders.routes.ts`)
- `POST /api/orders`
  - Buyer places order
  - COD only (`paymentMethod = "COD"`)
  - Requires `userId` (buyer id)
- `GET /api/orders/my/:userId`
  - Buyer “My Orders”

### Seller Routes (`routes/seller.routes.ts`)
- `GET /api/seller/orders/:sellerId`
  - Seller sees orders for seller-owned products

---

## MongoDB Schemas (Mongoose)

### User Schema (`models/User.ts`)
- `name: string`
- `email: string` (unique)
- `passwordHash: string`
- `createdAt: Date`
- `updatedAt: Date`

### Product Schema (`models/Product.ts`)
- `title: string`
- `description: string`
- `price: number`
- `stock: number`
- `imageUrl?: string`
- `sellerId: ObjectId (ref: User)`
- `createdAt: Date`
- `updatedAt: Date`

### Order Schema (`models/Order.ts`)
- `buyerId: ObjectId (ref: User)`
- `items: [OrderItem]`
  - `productId: ObjectId (ref: Product)`
  - `sellerId: ObjectId (ref: User)`
  - `title: string` (snapshot)
  - `price: number` (snapshot)
  - `quantity: number`
- `totalAmount: number`
- `paymentMethod: "COD"` (only value allowed)
- `status: "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"`
- `createdAt: Date`
- `updatedAt: Date`

---

## Frontend Pages Blueprint

```txt
frontend/src/pages/
  SignupPage.tsx
  LoginPage.tsx
  DiscoverProductsPage.tsx
  ProductDetailsPage.tsx
  CheckoutPage.tsx
  MyOrdersPage.tsx
  AddProductPage.tsx
  SellerOrdersPage.tsx
```

### Page Features
- `SignupPage`: register new user
- `LoginPage`: login and save `userId` to `localStorage`
- `DiscoverProductsPage`: browse/search products
- `ProductDetailsPage`: view a product and start buy flow
- `CheckoutPage`: place COD order
- `MyOrdersPage`: buyer order history
- `AddProductPage`: seller creates product listing
- `SellerOrdersPage`: seller views incoming orders for own products

---

## Identification Rule
- Use `localStorage.userId` after login as the identity token across frontend/backend requests.
- No JWT/session in this version (as requested).
