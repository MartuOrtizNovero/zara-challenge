import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/header/Header.jsx";
import { CartContext } from "../context/cart/cartContext.js";

const renderHeader = (totalItems = 0) =>
  render(
    <MemoryRouter>
      <CartContext.Provider value={{ totalItems }}>
        <Header />
      </CartContext.Provider>
    </MemoryRouter>,
  );

describe("Header", () => {
  it("displays 0 when the cart is empty", () => {
    renderHeader(0);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays the correct item count when items are in the cart", () => {
    renderHeader(3);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a link to the home page", () => {
    renderHeader();
    expect(
      screen.getByRole("link", { name: /go to home/i }),
    ).toBeInTheDocument();
  });

  it("renders a link to the cart page", () => {
    renderHeader();
    expect(
      screen.getByRole("link", { name: /go to cart/i }),
    ).toBeInTheDocument();
  });
});
