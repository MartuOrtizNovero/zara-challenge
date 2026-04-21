import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.logo} to="/">
          MBST
        </Link>

        <Link className={styles.cartLink} to="/cart" aria-label="Go to cart">
          <span className={styles.cartText}>CART</span>
          <span className={styles.cartCount}>0</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
