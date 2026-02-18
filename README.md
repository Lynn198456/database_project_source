# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




## Backend (Next.js + PostgreSQL)

This repo includes a separate Next.js backend in `../database_project_backend/` with API routes and a PostgreSQL connection.

### Setup

1. Install backend dependencies:

```bash
cd ../database_project_backend
npm install
```

2. Create `../database_project_backend/.env.local` with your PostgreSQL connection string:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/database_project
FRONTEND_ORIGIN=http://localhost:5173
```

3. Run the backend:

```bash
cd ../database_project_backend
npm run dev
```

The backend runs on `http://localhost:4000` by default.

### Endpoints

- `GET /api/health` -> service health check
- `GET /api/items` -> list items
- `POST /api/items` -> create item `{ "name": "...", "value": "..." }`
- `GET /api/items/:id` -> fetch item by id
- `PUT /api/items/:id` -> update item `{ "name": "...", "value": "..." }`
- `DELETE /api/items/:id` -> delete item

## Frontend API Config

Set `VITE_API_BASE_URL` in a local `.env` file if your backend is not running on the default `http://localhost:4000`.
