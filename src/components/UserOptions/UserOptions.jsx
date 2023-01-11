import { ThemeContext } from '../../contexts/ThemeContext';
import { useContext } from 'react';
import TokenDropdown from '../Dropdown/TokenDropdown';
import ChartDropdown from '../Dropdown/ChartDropdown';

function UserOptions({
  pair,
  handleSelect,
  currencies,
  granularity,
  handleChart,
  activeGranularity,
}) {
  const { isDarkMode } = useContext(ThemeContext);
  granularity = [
    [60, '5 Hours'],
    [300, '24 Hours'],
    [900, '3 Days'],
    [3600, '11 Days'],
    [21600, '2.5 Months'],
    [86400, '10 Months'],
  ];

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2.5 w-auto h-auto ">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1
          className={`border-b-4  ${
            isDarkMode ? 'border-gray-800' : 'text-sky-300 border-gray-300'
          }`}
        >
          User Options:
        </h1>
      </div>

      <label
        className="col-start-1 py-1 col-end-1 row-start-2 row-span-2 font-bold text-sm lg:text-md hidden lg:block"
        htmlFor="cur-select"
      >
        Currency Pair
      </label>
      <div>
        <TokenDropdown
          className="z-10 col-start-1 col-end-1 lg:col-start-2 lg:col-end-2 row-start-2 row-span-2"
          handleSelect={handleSelect}
          currencies={currencies}
          activePair={pair}
        />
      </div>

      {/* <select
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
          let newIcon = findIcon(cur.base_currency);
          return (
            <option key={cur.id} value={cur.id}>
              {`${newIcon && newIcon}`}
            </option>
          );
        })}
      </select> */}

      <label
        className="row-start-3 py-1 row-span-3 col-start-1 col-end-1 font-bold text-sm hidden lg:text-md lg:block"
        htmlFor="chart-select"
      >
        Chart Granularity
      </label>
      {/* <select
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
      </select> */}
      <div className="row-start-3 row-span-3 col-start-1 col-end-1 lg:row-start-3 lg:row-span-3 lg:col-start-2 lg:col-end-2">
        <ChartDropdown
          handleChart={handleChart}
          granularity={granularity}
          activePair={pair}
          activeGranularity={activeGranularity}
        />
      </div>
    </div>
  );
}

export default UserOptions;
