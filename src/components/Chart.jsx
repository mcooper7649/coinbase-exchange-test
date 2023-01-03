import { Line } from 'react-chartjs-2';
import { USDollar } from '../utils/utils';
import { ThemeContext } from '../utils/ThemeContext';
import { useContext } from 'react';

function Chart({ price, data, pair, granularity }) {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  function findColor() {
    return pair === 'ETH-USD'
      ? 'rgb(67, 73, 83)'
      : pair === 'BTC-USD'
      ? 'rgb(242, 169, 0, 0.8)'
      : pair === 'LTC-USD'
      ? 'rgb(211, 211, 211, 0.8)'
      : 'rgb(238, 140, 40, 0.8)';
  }

  const opts = {
    tooltips: {
      intersect: false,
      mode: 'index',
      titleFontSize: 12,
      bodyFontSize: 16,
    },
    title: {
      display: true,
      position: 'bottom',
      fontSize: 16,
      fontColor: 'rgb(255,255,255)',
      fontFamily: 'Verdana',
      text: `${pair} ${granularity} minutes Chart`,
    },
    elements: {
      point: {
        radius: 3,
        pointStyle: 'cross',
      },
      line: {
        // stepped: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1.5,
        fill: true,
      },
    },
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    legend: {
      display: true,
      labels: {
        fontColor: `${findColor()}`,
        fontFamily: 'Verdana',
      },
    },
  };
  if (pair === 'Select') {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-3xl font-bold underline ">
          Please Select A Currency Pair
        </h2>
      </div>
    );
  }
  // if (granularity === 'Minutes') {
  //   return (
  //     <div className="flex flex-col justify-center items-center h-screen">
  //       <h2 className="text-3xl font-bold underline ">
  //         Please Set Granularity
  //       </h2>
  //     </div>
  //   );
  // } else {
  return (
    <div className={`chart {isDarkMode ? 'bg-gray-400' : '' }`}>
      <h2
        className={`py-2 text-center text-3xl ${
          isDarkMode ? 'bg-gray-300' : 'text-gray-100'
        }`}
      >{`${USDollar.format(price)}`}</h2>

      <div
        className={`chart-container h-[75vh] ${
          isDarkMode ? 'bg-gray-300' : ''
        }`}
      >
        <Line data={data} options={opts} setPastData />
      </div>
    </div>
  );
  // }
}

export default Chart;
