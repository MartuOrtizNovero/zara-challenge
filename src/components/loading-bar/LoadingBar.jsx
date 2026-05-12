import PropTypes from "prop-types";
import styles from "./LoadingBar.module.css";

const LoadingBar = ({ onComplete = () => {} }) => {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.bar} onAnimationEnd={onComplete} />
    </div>
  );
};

LoadingBar.propTypes = {
  onComplete: PropTypes.func,
};

export default LoadingBar;
