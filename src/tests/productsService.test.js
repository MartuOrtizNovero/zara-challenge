import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/client/apiClient.js", () => ({
  default: { get: vi.fn() },
}));

import apiClient from "../api/client/apiClient.js";
import { getProducts, getProductById } from "../api/services/productsService.js";

const mockApiProduct = {
  id: "1",
  brand: "Apple",
  name: "iPhone 15",
  basePrice: 999,
  imageUrl: "http://example.com/image.jpg",
};

const mockApiProductDetail = {
  id: "1",
  brand: "Apple",
  name: "iPhone 15",
  description: "A great phone",
  basePrice: 999,
  rating: 4.5,
  specs: {
    screen: "6.1 inches",
    resolution: "2556x1179",
    processor: "A16 Bionic",
    mainCamera: "48MP",
    selfieCamera: "12MP",
    battery: "3279 mAh",
    os: "iOS 17",
    screenRefreshRate: "60Hz",
  },
  colorOptions: [
    {
      name: "Black",
      hexCode: "#000000",
      imageUrl: "http://example.com/black.jpg",
    },
  ],
  storageOptions: [
    { capacity: "128GB", price: 999 },
    { capacity: "256GB", price: 1099 },
  ],
  similarProducts: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getProducts", () => {
  it("returns mapped products on success", async () => {
    apiClient.get.mockResolvedValue({ data: [mockApiProduct] });

    const result = await getProducts();

    expect(result.ok).toBe(true);
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toMatchObject({
      id: "1",
      brand: "Apple",
      name: "iPhone 15",
      basePrice: 999,
    });
  });

  it("normalizes http image URLs to https", async () => {
    apiClient.get.mockResolvedValue({ data: [mockApiProduct] });

    const result = await getProducts();

    expect(result.products[0].imageUrl).toBe("https://example.com/image.jpg");
  });

  it("returns error result when the API fails", async () => {
    apiClient.get.mockRejectedValue({
      response: { status: 500, data: { message: "Server error" } },
    });

    const result = await getProducts();

    expect(result.ok).toBe(false);
    expect(result.products).toEqual([]);
    expect(result.errorMessage).toBe("Server error");
  });

  it("returns a fallback error message when the API gives no message", async () => {
    apiClient.get.mockRejectedValue({});

    const result = await getProducts();

    expect(result.ok).toBe(false);
    expect(result.errorMessage).toBeTruthy();
  });
});

describe("getProductById", () => {
  it("returns a mapped product detail on success", async () => {
    apiClient.get.mockResolvedValue({ data: mockApiProductDetail });

    const result = await getProductById("1");

    expect(result.ok).toBe(true);
    expect(result.product).toMatchObject({
      id: "1",
      name: "iPhone 15",
      brand: "Apple",
    });
  });

  it("normalizes http image URLs to https in colorOptions", async () => {
    apiClient.get.mockResolvedValue({ data: mockApiProductDetail });

    const result = await getProductById("1");

    expect(result.product.colorOptions[0].imageUrl).toBe(
      "https://example.com/black.jpg",
    );
  });

  it("maps storageOptions correctly", async () => {
    apiClient.get.mockResolvedValue({ data: mockApiProductDetail });

    const result = await getProductById("1");

    expect(result.product.storageOptions).toEqual([
      { capacity: "128GB", price: 999 },
      { capacity: "256GB", price: 1099 },
    ]);
  });

  it("returns error result when the API fails", async () => {
    apiClient.get.mockRejectedValue({
      response: { status: 404, data: { message: "Not found" } },
    });

    const result = await getProductById("999");

    expect(result.ok).toBe(false);
    expect(result.product).toBeNull();
    expect(result.errorMessage).toBe("Not found");
  });
});
