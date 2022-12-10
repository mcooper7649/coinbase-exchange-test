function Header({ pair, handleSelect, currencies }) {
  return (
    <div className="container">
      <div className="px-20">
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
            return (
              <option key={idx} value={cur.id}>
                {cur.display_name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default Header;
