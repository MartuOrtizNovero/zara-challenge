import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/product-card/ProductCard.jsx";

const defaultProps = {
  productId: "1",
  brand: "Apple",
  name: "iPhone 15",
  price: "€999",
  imageUrl: "https://example.com/image.jpg",
  imageAlt: "iPhone 15",
};

const renderProductCard = (props = {}) => {
  return render(
    <MemoryRouter>
      <ProductCard {...defaultProps} {...props} />
    </MemoryRouter>,
  );
};

describe("ProductCard", () => {
  it("renders brand, name and price", () => {
    renderProductCard();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("€999")).toBeInTheDocument();
  });

  it("renders the product image with the correct alt text", () => {
    renderProductCard();
    const image = screen.getByRole("img", { name: "iPhone 15" });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", defaultProps.imageUrl);
  });

  it("renders a placeholder when imageUrl is not provided", () => {
    renderProductCard({ imageUrl: "" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("links to the correct product detail page", () => {
    renderProductCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/product/1");
  });
});
