import type { Product } from "./product";

// product
type CreateProductDto = Omit<Product, "id">;
type UpdateProductDto = Pick<
  CreateProductDto,
  "name" | "price" | "imageUrl" | "imageUrls"
>;

export type { Product, CreateProductDto, UpdateProductDto };
