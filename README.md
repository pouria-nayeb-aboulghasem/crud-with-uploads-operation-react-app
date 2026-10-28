# Product Studio

A React + TypeScript product catalog with create, read, update, and delete
screens. Forms use React Hook Form and page navigation uses React Router.

## Getting started

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Configure the API server URL in a `.env.local` file at the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The app appends `/api/products` to this URL. The API should support:

- `GET /api/products` — return a product array
- `GET /api/products/:id` — return one product
- `POST /api/products` — create a product
- `PUT /api/products/:id` — update a product
- `DELETE /api/products/:id` — delete a product

Products use the fields `id`, `name`, `price`, `imageUrl`, and `createdAt`.
They may also include `imageUrls`, an array of image names. Create and update
requests use `multipart/form-data` and include the product fields, an optional
`image` file, and zero or more `images` files in the same request.
The API must allow requests from the Vite development origin.

## Validation

```sh
npm run build
npm run lint
```
