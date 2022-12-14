import { Line } from 'react-chartjs-2';
import { USDollar } from '../../utils/utils';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useContext } from 'react';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import './Chart.styles.css';

function Chart({ price, data, pair, granularity }) {
  const { isDarkMode } = useContext(ThemeContext);

  function findColor() {
    return pair === 'ETH-USD'
      ? 'rgb(67, 73, 83)'
      : pair === 'BTC-USD'
      ? 'rgb(242, 169, 0, 0.8)'
      : pair === 'LTC-USD'
      ? 'rgb(67, 73, 83)'
      : pair === 'BCH-USD'
      ? 'rgb(238, 140, 40, 0.8)'
      : 'rgb(238, 140, 40, 0.8)';
  }

  const opts = {
    tooltips: {
      intersect: true,
      mode: 'index',
      titleFontSize: 12,
      bodyFontSize: 16,
    },

    title: {
      display: true,
      position: 'bottom',
      fontSize: 16,
      fontFamily: 'Verdana',
      text: `${pair} ${granularity} minutes Chart`,
    },
    elements: {
      point: {
        radius: 3,
        pointStyle: 'circle',
      },
      line: {
        stepped: true,
        borderColor: `${isDarkMode ? findColor() : findColor()}`,
        borderWidth: 1,
        backgroundColor: `${isDarkMode ? findColor() : findColor()}`,
      },
    },
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    legend: {
      display: true,
      labels: {
        fontColor: `${isDarkMode ? findColor() : findColor()}`,
        fontFamily: 'Verdana',
      },
    },
  };

  if (pair === 'Select') {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <IconContext.Provider
          value={{ className: 'top-react-icons animate-bounce' }}
        >
          <BsChevronDoubleDown />
        </IconContext.Provider>
        <h2
          className={`text-3xl font-bold  ${
            !isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          Please Select A Currency Pair
        </h2>
      </div>
    );
  }
  if (granularity === 'Granularity' || granularity === 'Minutes') {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <IconContext.Provider
          value={{ className: 'top-react-icons animate-bounce' }}
        >
          <BsChevronDoubleDown />
        </IconContext.Provider>
        <h2
          className={`text-3xl font-bold ${
            !isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          Please Set Granularity
        </h2>
      </div>
    );
  } else {
    return (
      <div className={`chart ${isDarkMode ? 'bg-gray-800' : 'bg-sky-100'}`}>
        <h2
          className={`py-2 text-center text-3xl ${
            !isDarkMode
              ? 'bg-gray-800 text-gray-100'
              : 'text-gray-600 bg-sky-100'
          }`}
        >{`${USDollar.format(price)}`}</h2>

        <div
          className={`chart-container h-[75vh] ${
            isDarkMode ? 'bg-sky-100' : 'bg-gray-800'
          }`}
        >
          <Line data={data} options={opts} />
        </div>
      </div>
    );
  }
}

export default Chart;
