import styles from "./SearchBar.module.css";

const SearchBar = ({ id, label, name, value, placeholder, onChange }) => {
  return (
    <div className={styles.searchBar}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        className={styles.input}
        type="search"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
