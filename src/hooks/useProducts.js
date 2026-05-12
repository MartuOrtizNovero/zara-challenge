import { useEffect, useState } from "react";
import { getProducts } from "../api/services/productsService.js";

const SEARCH_DEBOUNCE_DELAY = 300;

const useProducts = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [products, setProducts] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [animationDirection, setAnimationDirection] = useState("filter");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      setErrorMessage("");
      const result = await getProducts({ search: debouncedSearchValue });

      if (!isActive) {
        return;
      }

      if (!result.ok) {
        setProducts([]);
        setErrorMessage(result.errorMessage);
        return;
      }

      setProducts(result.products);
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [debouncedSearchValue]);

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;

    setAnimationDirection(
      nextValue.trim().length >= searchValue.trim().length ? "filter" : "clear",
    );

    setSearchValue(nextValue);
  };

  const handleClearSearch = () => {
    setAnimationDirection("clear");
    setSearchValue("");
  };

  return {
    products,
    errorMessage,
    searchValue,
    debouncedSearchValue,
    animationDirection,
    handleSearchChange,
    handleClearSearch,
  };
};

export default useProducts;
