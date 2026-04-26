import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CartPage from "../pages/cart/CartPage.jsx";
import { CartContext } from "../context/cart/cartContext.js";

const mockCartItem = {
  cartItemId: "abc-123",
  productId: "1",
  name: "iPhone 15",
  brand: "Apple",
  price: 999,
  storage: "128GB",
  color: { name: "Black", hexCode: "#000000" },
  imageUrl: "https://example.com/image.jpg",
};

const renderCartPage = (contextValue) => {
  return render(
    <MemoryRouter>
      <CartContext.Provider value={contextValue}>
        <CartPage />
      </CartContext.Provider>
    </MemoryRouter>,
  );
};

describe("CartPage", () => {
  it("shows the cart title with item count", () => {
    renderCartPage({
      cartItems: [mockCartItem],
      totalPrice: 999,
      removeItemFromCart: vi.fn(),
    });
    expect(screen.getByText("CART (1)")).toBeInTheDocument();
  });

  it("renders each cart item with name, storage and color", () => {
    renderCartPage({
      cartItems: [mockCartItem],
      totalPrice: 999,
      removeItemFromCart: vi.fn(),
    });
    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("128GB | Black")).toBeInTheDocument();
  });

  it("renders the formatted total price in the summary", () => {
    renderCartPage({
      cartItems: [mockCartItem],
      totalPrice: 999,
      removeItemFromCart: vi.fn(),
    });
    const totalRow = screen.getByText("TOTAL").closest("p");
    expect(totalRow).toHaveTextContent("999 EUR");
  });

  it("calls removeItemFromCart with the correct cartItemId when Remove is clicked", async () => {
    const removeItemFromCart = vi.fn();
    renderCartPage({
      cartItems: [mockCartItem],
      totalPrice: 999,
      removeItemFromCart,
    });
    await userEvent.click(
      screen.getByRole("button", { name: /remove iphone 15 from cart/i }),
    );
    expect(removeItemFromCart).toHaveBeenCalledWith("abc-123");
  });

  it("does not render the summary when the cart is empty", () => {
    renderCartPage({
      cartItems: [],
      totalPrice: 0,
      removeItemFromCart: vi.fn(),
    });
    expect(screen.queryByText(/total/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /pay/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the continue shopping link", () => {
    renderCartPage({
      cartItems: [],
      totalPrice: 0,
      removeItemFromCart: vi.fn(),
    });
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toBeInTheDocument();
  });
});
