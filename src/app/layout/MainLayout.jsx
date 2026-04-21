import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header.jsx";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
