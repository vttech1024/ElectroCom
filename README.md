# e-com

MERN e-commerce app with:
- **Frontend:** React + Axios + Tailwind + React Hook Form (JavaScript)
- **Backend:** Express + MongoDB (Mongoose) (JavaScript)
- **Infra:** MongoDB via Docker Compose

## Project structure

```txt
backend/
frontend/
docker-compose.yml
```

## 1. Start MongoDB (Docker Compose)

```bash
docker compose up -d
```

MongoDB will run on `mongodb://localhost:27017`.

## 2. Run backend

```bash
cd backend
cp .env.example .env
pnpm install
pnpm start
```

Backend runs on `http://localhost:4000`.
If your frontend runs on a different local origin, add it in `backend/.env` via `FRONTEND_URLS`.

## 3. Run frontend

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:5173`.

## Implemented features

### Auth
- Signup
- Login
- Stores `userId` in localStorage after login/signup

### Buyer
- Discover/list/search products
- Product details
- Buy product with **COD only**
- View **My Orders**

### Seller
- Add own products
- View orders placed for own products (**Seller Orders**)

## API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:productId`
- `POST /api/products`
- `GET /api/products/seller/:sellerId`
- `POST /api/orders`
- `GET /api/orders/my/:userId`
- `GET /api/seller/orders/:sellerId`
