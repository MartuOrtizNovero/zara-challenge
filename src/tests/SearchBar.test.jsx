import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/search-bar/SearchBar.jsx";

const defaultProps = {
  id: "search",
  label: "Search for a smartphone",
  name: "search",
  value: "",
  placeholder: "Search...",
  onChange: vi.fn(),
  onClear: vi.fn(),
};

describe("SearchBar", () => {
  it("renders the input with the correct placeholder", () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("does not render the clear button when value is empty", () => {
    render(<SearchBar {...defaultProps} value="" />);
    expect(
      screen.queryByRole("button", { name: /clear search/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the clear button when value is not empty", () => {
    render(<SearchBar {...defaultProps} value="iPhone" />);
    expect(
      screen.getByRole("button", { name: /clear search/i }),
    ).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const onChange = vi.fn();
    render(<SearchBar {...defaultProps} onChange={onChange} />);
    await userEvent.type(screen.getByRole("searchbox"), "Samsung");
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onClear when the clear button is clicked", async () => {
    const onClear = vi.fn();
    render(<SearchBar {...defaultProps} value="iPhone" onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
