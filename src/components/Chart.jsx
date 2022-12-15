import { Line } from 'react-chartjs-2';
import { USDollar } from '../utils/utils';

function Chart({ price, data, pair, granularity }) {
  const opts = {
    tooltips: {
      intersect: true,
      mode: 'index',
    },
    title: {
      display: true,
      text: `${pair} ${granularity} minutes Chart`,
    },
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
  };
  if (price === 0.0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-3xl font-bold underline ">
          Please Select A Currency Pair
        </h2>
      </div>
    );
  } else {
    return (
      <div className="chart">
        <h2 className="py-2 text-center text-3xl">{`${USDollar.format(
          price
        )}`}</h2>

        <div className="chart-container h-[75vh]">
          <Line data={data} options={opts} setPastData />
          {console.log(data)}
        </div>
      </div>
    );
  }
}

export default Chart;
