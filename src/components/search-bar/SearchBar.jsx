import PropTypes from "prop-types";
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

SearchBar.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default SearchBar;
