import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../context/cart/CartProvider.jsx";
import { useCart } from "../context/cart/useCart.js";

const mockItem = {
  cartItemId: "abc-123",
  productId: "1",
  name: "iPhone 15",
  brand: "Apple",
  price: 999,
  storage: "128GB",
  color: { name: "Black", hexCode: "#000000" },
  imageUrl: "https://example.com/image.jpg",
};

const secondItem = {
  cartItemId: "xyz-456",
  productId: "2",
  name: "Samsung S24",
  brand: "Samsung",
  price: 799,
  storage: "256GB",
  color: { name: "White", hexCode: "#ffffff" },
  imageUrl: "https://example.com/samsung.jpg",
};

const TestConsumer = ({ itemToAdd }) => {
  const { cartItems, totalItems, totalPrice, addItemToCart, removeItemFromCart } =
    useCart();
  return (
    <div>
      <span data-testid="totalItems">{totalItems}</span>
      <span data-testid="totalPrice">{totalPrice}</span>
      <button onClick={() => addItemToCart(itemToAdd)}>Add</button>
      {cartItems.map((item) => (
        <button
          key={item.cartItemId}
          onClick={() => removeItemFromCart(item.cartItemId)}
        >
          Remove {item.name}
        </button>
      ))}
    </div>
  );
};

const renderWithProvider = (itemToAdd = mockItem) => {
  return render(
    <CartProvider>
      <TestConsumer itemToAdd={itemToAdd} />
    </CartProvider>,
  );
};

beforeEach(() => {
  localStorage.clear();
});

describe("CartProvider", () => {
  it("starts with zero items and zero total", () => {
    renderWithProvider();
    expect(screen.getByTestId("totalItems").textContent).toBe("0");
    expect(screen.getByTestId("totalPrice").textContent).toBe("0");
  });

  it("addItemToCart increments totalItems", async () => {
    renderWithProvider();
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByTestId("totalItems").textContent).toBe("1");
  });

  it("addItemToCart adds the correct price to totalPrice", async () => {
    renderWithProvider();
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByTestId("totalPrice").textContent).toBe("999");
  });

  it("totalPrice sums prices of all items", async () => {
    renderWithProvider(mockItem);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    const { rerender } = render(
      <CartProvider>
        <TestConsumer itemToAdd={mockItem} />
      </CartProvider>,
    );

    const totals = screen.getAllByTestId("totalPrice");
    expect(totals[0].textContent).toBe("999");
  });

  it("removeItemFromCart decrements totalItems", async () => {
    renderWithProvider();
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByTestId("totalItems").textContent).toBe("1");
    await userEvent.click(screen.getByRole("button", { name: /remove iphone 15/i }));
    expect(screen.getByTestId("totalItems").textContent).toBe("0");
  });

  it("removeItemFromCart subtracts the price from totalPrice", async () => {
    renderWithProvider();
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.click(screen.getByRole("button", { name: /remove iphone 15/i }));
    expect(screen.getByTestId("totalPrice").textContent).toBe("0");
  });
});
