function Header({
  pair,
  handleSelect,
  currencies,
  granularity,
  setGranularity,
  handleChart,
}) {
  granularity = [60, 300, 900, 3600, 21600, 86400];
  return (
    <div className="flex flex-row">
      <div className="flex flex-col my-auto px-2">
        <label for="cur-select">Token Options</label>
        <select
          id="cur-select"
          className="py-4 bg-gray-800 text-xl rounded"
          name="currency"
          // value={pair}
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
      <div className="flex flex-col my-auto px-2">
        <label for="cur-select">Chart Granularity</label>
        <select
          id="cur-select"
          className="py-4 bg-gray-800 text-xl rounded"
          name="currency"
          // value={value}
          onChange={handleChart}
        >
          <option defaultValue={true}>Minutes</option>
          {granularity.map((cur, idx) => {
            return (
              <option key={idx} value={cur}>
                {cur}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default Header;
