import { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';

import Header from './components/Header';
import Bid from './components/Bid';
import OrderBook from './components/OrderBook';
import Dashboard from './components/Dashboard';
import { formatData } from '../src/utils';

function App() {
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState('');
  const [price, setprice] = useState('0.00');
  const [pastData, setpastData] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = 'https://api.pro.coinbase.com';

  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com');

    let pairs = [];

    const apiCall = async () => {
      await fetch(url + '/products')
        .then((res) => res.json())
        .then((data) => (pairs = data));

      // eslint-disable-next-line array-callback-return
      let filtered = pairs.filter((pair) => {
        if (
          pair.display_name === 'BTC/USD' ||
          pair.display_name === 'ETH/USD' ||
          pair.display_name === 'LTC/USD' ||
          pair.display_name === 'BCH/USD'
        ) {
          return pair;
        }
      });

      console.log(filtered);
      setcurrencies(filtered);

      first.current = true;
    };

    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      console.log('returning on the first render');
      return;
    }

    let msg = {
      type: 'subscribe',
      product_ids: [pair],
      channels: ['ticker'],
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };

    fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== 'ticker') {
        return;
      }

      if (data.product_id === pair) {
        setprice(data.price);
      }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [pair],
      channels: ['ticker'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setpair(e.target.value);
  };

  return (
    <div className="App">
      <div className="grid overflow-hidden grid-cols-3 grid-rows-6 gap-2.5 w-auto h-screen body">
        <div className="box row-start-1 row-span-1 col-start-1 col-end-4">
          <Header
            pair={pair}
            handleSelect={handleSelect}
            currencies={currencies}
          />
        </div>
        <div className="box">
          <Bid />
        </div>
        <div className="box">
          <Bid />
        </div>
        <div className="box row-start-2 row-end-7 col-start-3 col-end-3">
          <OrderBook />
        </div>
        <div className="box row-start-3 row-end-7 col-start-1 col-end-3">
          <Dashboard price={price} data={pastData} />
        </div>
      </div>
    </div>
  );
}

export default App;
