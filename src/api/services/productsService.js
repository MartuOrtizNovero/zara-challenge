import apiClient from "../client/apiClient.js";

const mapProductSummary = (product) => ({
  id: product.id,
  brand: product.brand,
  name: product.name,
  basePrice: product.basePrice,
  imageUrl: product.imageUrl,
});

const mapProductDetail = (product) => ({
  id: product.id,
  brand: product.brand,
  name: product.name,
  description: product.description,
  basePrice: product.basePrice,
  rating: product.rating,
  imageUrl: product.colorOptions?.[0]?.imageUrl || "",
  specs: {
    screen: product.specs?.screen || "",
    resolution: product.specs?.resolution || "",
    processor: product.specs?.processor || "",
    mainCamera: product.specs?.mainCamera || "",
    selfieCamera: product.specs?.selfieCamera || "",
    battery: product.specs?.battery || "",
    os: product.specs?.os || "",
    screenRefreshRate: product.specs?.screenRefreshRate || "",
  },
  colorOptions: (product.colorOptions || []).map((colorOption) => ({
    name: colorOption.name,
    hexCode: colorOption.hexCode,
    imageUrl: colorOption.imageUrl,
  })),
  storageOptions: (product.storageOptions || []).map((storageOption) => ({
    capacity: storageOption.capacity,
    price: storageOption.price,
  })),
  similarProducts: (product.similarProducts || []).map(mapProductSummary),
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

export const getProductById = async (productId) => {
  const result = {
    ok: false,
    product: null,
    errorMessage: "",
    status: null,
  };

  try {
    const { data } = await apiClient.get(`/products/${productId}`);

    result.ok = true;
    result.product = mapProductDetail(data);
  } catch (error) {
    result.status = error?.response?.status ?? null;
    result.errorMessage =
      error?.response?.data?.message ||
      "No fue posible obtener el detalle del producto.";
  }

  return result;
};
