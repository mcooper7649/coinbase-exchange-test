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
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-2.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1 className="text-green-300 border-b-4 border-gray-300">
          User Options:
        </h1>
      </div>

      <label className="text-xs md:text-md" htmlFor="cur-select">
        Currency Pair
      </label>
      <select
        id="cur-select"
        className="bg-gray-800 text-xs rounded border border-orange-500 focus:outline-none"
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

      <label className="text-xs md:text-md" htmlFor="chart-select">
        Chart Granularity
      </label>
      <select
        id="chart-select"
        className=" bg-gray-800 text-xs border-none rounded border focus:outline-none"
        name="chart"
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
  );
}

export default Header;
