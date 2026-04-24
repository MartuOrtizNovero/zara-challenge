import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cart/useCart.js";
import LoadingBar from "../loading-bar/LoadingBar.jsx";
import logoMbst from "../../assets/icons/logo-mbst.svg";
import bagIcon from "../../assets/icons/bag-icon.svg";
import styles from "./Header.module.css";

const HEADER_LOADING_DURATION = 1800;

const Header = () => {
  const { totalItems } = useCart();
  const [showLoadingBar, setShowLoadingBar] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowLoadingBar(false);
    }, HEADER_LOADING_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.logoLink} to="/" aria-label="Go to home">
          <img className={styles.logo} src={logoMbst} alt="MBST" />
        </Link>

        <Link className={styles.cartLink} to="/cart" aria-label="Go to cart">
          <img
            className={styles.cartIcon}
            src={bagIcon}
            alt=""
            aria-hidden="true"
          />
          <span className={styles.cartCount}>{totalItems}</span>
        </Link>
      </div>
       {showLoadingBar ? <LoadingBar /> : null}
    </header>
  );
};

export default Header;
