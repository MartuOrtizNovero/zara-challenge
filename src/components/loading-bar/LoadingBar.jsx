import styles from "./LoadingBar.module.css";

const LoadingBar = () => {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.bar} />
    </div>
  );
};

export default LoadingBar;