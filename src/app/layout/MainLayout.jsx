import { useCallback, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header.jsx";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [hasLoadingBarCompleted, setHasLoadingBarCompleted] = useState(true);
  const [loadingBarKey, setLoadingBarKey] = useState(0);

  const startPageLoading = useCallback(() => {
    setIsPageLoading(true);
    setHasLoadingBarCompleted(false);
    setLoadingBarKey((currentKey) => currentKey + 1);
  }, []);

  const finishPageLoading = useCallback(() => {
    setIsPageLoading(false);
  }, []);

  const handleLoadingBarComplete = useCallback(() => {
    setHasLoadingBarCompleted(true);
  }, []);

  const canShowPageContent = !isPageLoading && hasLoadingBarCompleted;
  const showLoadingBar = isPageLoading || !hasLoadingBarCompleted;

  const outletContext = useMemo(
    () => ({
      startPageLoading,
      finishPageLoading,
      canShowPageContent,
    }),
    [startPageLoading, finishPageLoading, canShowPageContent],
  );

  return (
    <div className={styles.layout}>
      <Header
        showLoadingBar={showLoadingBar}
        loadingBarKey={loadingBarKey}
        onLoadingBarComplete={handleLoadingBarComplete}
      />
      <Outlet context={outletContext} />
    </div>
  );
};

export default MainLayout;
