import { ThemeContext } from '../utils/ThemeContext';
import { useContext } from 'react';
function UserOptions({
  pair,
  handleSelect,
  currencies,
  granularity,
  handleChart,
}) {
  const { isDarkMode } = useContext(ThemeContext);
  granularity = [
    [60, '~5 Hours'],
    [300, '~24 Hours'],
    [900, '~3 Days'],
    [3600, '~11 Days'],
    [21600, '~2.5 Months'],
    [86400, '~10 Months'],
  ];
  function checkPair(pair) {
    if (pair === 'Select') {
      return true;
    } else return false;
  }
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-2.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1
          className={`border-b-4 border-gray-300 ${
            isDarkMode ? '' : 'text-sky-300'
          }`}
        >
          User Options:
        </h1>
      </div>

      <label
        className="font-bold text-sm md:text-md sm:hidden md:block"
        htmlFor="cur-select"
      >
        Currency Pair
      </label>
      <select
        id="cur-select"
        className={`cursor-pointer md:pl-2 text-gray-800 text-xs rounded border border-orange-500 focus:outline-none ${
          checkPair(pair) ? 'animate-bounce' : ''
        }`}
        name="currency"
        value={pair}
        onChange={handleSelect}
      >
        <option defaultValue={true}>Select</option>
        {currencies.map((cur, idx) => {
          return (
            <option key={cur.id} value={cur.id}>
              {cur.display_name}
            </option>
          );
        })}
      </select>

      <label
        className="font-bold text-sm md:text-md sm:hidden md:block"
        htmlFor="chart-select"
      >
        Chart Granularity
      </label>
      <select
        id="chart-select"
        className="py-1.5 cursor-pointer md:pl-2 text-gray-800 text-xs border-none rounded border focus:outline-none"
        name="chart"
        // value={value}
        onChange={handleChart}
      >
        <option defaultValue={true}>Granularity</option>
        {granularity.map((gran, idx) => {
          return (
            <option key={idx} value={gran[0]}>
              {gran[1]}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default UserOptions;
