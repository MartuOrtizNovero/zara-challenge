import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getProductById } from "../api/services/productsService.js";

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { startPageLoading, finishPageLoading } = useOutletContext();

  useEffect(() => {
    let isActive = true;

    const loadProductDetail = async () => {
      setIsLoading(true);
      setErrorMessage("");
      startPageLoading();

      const result = await getProductById(productId);

      if (!isActive) {
        return;
      }

      if (!result.ok) {
        setProduct(null);
        setErrorMessage(result.errorMessage);
        setIsLoading(false);
        finishPageLoading();
        return;
      }

      setProduct(result.product);
      setIsLoading(false);
      finishPageLoading();
    };

    loadProductDetail();

    return () => {
      isActive = false;
      finishPageLoading();
    };
  }, [productId, startPageLoading, finishPageLoading]);

  return { product, isLoading, errorMessage };
};

export default useProductDetail;
