import styles from "./SearchBar.module.css";

const SearchBar = ({
  id,
  label,
  name,
  value,
  placeholder,
  onChange,
  onClear,
}) => {
  const showClearButton = value.trim().length > 0;

  return (
    <div className={styles.searchBar}>
      <input
        id={id}
        className={styles.input}
        type="search"
        name={name}
        value={value}
        placeholder={placeholder}
        aria-label={label}
        onChange={onChange}
      />

      {showClearButton ? (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          aria-label="Clear search"
        >
          ×
        </button>
      ) : null}
    </div>
  );
};

export default SearchBar;