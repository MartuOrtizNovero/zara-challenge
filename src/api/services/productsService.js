import apiClient from "../client/apiClient";

const mapProductSummary = (product) => ({
  id: product.id,
  brand: product.brand,
  name: product.name,
  basePrice: product.basePrice,
  imageUrl: product.imageUrl,
});

export const getProducts = async ({
  search = "",
  limit = 20,
  offset = 0,
} = {}) => {
  const result = {
    ok: false,
    products: [],
    errorMessage: "",
    status: null,
  };

  try {
    const trimmedSearch = search.trim();

    const params = {
      limit,
      offset,
    };

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    const { data } = await apiClient.get("/products", { params });

    result.ok = true;
    result.products = data.map(mapProductSummary);
  } catch (error) {
    result.status = error?.response?.status ?? null;
    result.errorMessage =
      error?.response?.data?.message || "No fue posible obtener los productos.";
  }

  return result;
};
