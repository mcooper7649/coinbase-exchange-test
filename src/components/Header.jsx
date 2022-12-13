function Header({ pair, handleSelect }) {
  console.log(pair);
  return (
    <div className="container">
      <div className="px-2">
        <select name="currency" value={pair} onChange={handleSelect}>
          {pair &&
            pair.map((cur, idx) => {
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
