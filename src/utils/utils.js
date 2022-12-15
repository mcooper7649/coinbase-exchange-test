export const formatData = (data, pair) => {
  function findColor() {
    return pair === 'ETH-USD'
      ? 'rgb(67, 73, 83)'
      : pair === 'BTC-USD'
      ? 'rgb(242, 169, 0, 0.8)'
      : pair === 'LTC-USD'
      ? 'rgb(211, 211, 211, 0.8)'
      : 'rgb(238, 140, 40, 0.8)';
  }
  let finalData = {
    labels: [],
    datasets: [
      {
        label: `${pair}`,
        data: [],
        backgroundColor: 'rgb(255, 99, 132, 0.8)',
        borderColor: `${findColor()}`,
        fill: false,
      },
    ],
  };

  let dates = data.map((val) => {
    const ts = val[0];
    let date = new Date(ts * 1000);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let final = `${month}-${day}-${year}`;
    return final;
  });

  let priceArr = data.map((val) => {
    return val[4];
  });

  priceArr.reverse();
  dates.reverse();
  finalData.labels = dates;
  finalData.datasets[0].data = priceArr;

  return finalData;
};

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
