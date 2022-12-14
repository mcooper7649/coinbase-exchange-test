function Header({ pair, handleSelect, currencies }) {
  return (
    <div className="flex flex-col my-auto px-2">
      <label for="cur-select">Token Options</label>
      <select
        id="cur-select"
        className="py-4 bg-gray-800 text-xl rounded"
        name="currency"
        value={pair}
        onChange={handleSelect}
      >
        <option defaultValue={true}>Select</option>
        {currencies.map((cur, idx) => {
          return (
            <option key={idx} value={cur.id}>
              {cur.display_name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Header;
