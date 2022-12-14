import { Line } from 'react-chartjs-2';

function Chart({ price, data }) {
  const opts = {
    tooltips: {
      intersect: true,
      mode: 'index',
    },
    responsive: true,
    maintainAspectRatio: true,
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
      <div className="hart">
        <h2 className="py-2 text-center text-3xl">{`$${price}`}</h2>

        <div className="chart-container">
          <Line data={data} options={opts} />
        </div>
      </div>
    );
  }
}

export default Chart;