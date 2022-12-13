import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import { formatData } from './utils/utils';
import './index.css';
import BestBid from './components/BestBid';
import BestAsk from './components/BestAsk';
import OrderBookWrapper from './components/OrderBook';

function App() {
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState('Select');
  const [granularity, setGranularity] = useState(60);
  const [bestAsk, setBestAsk] = useState(0.0);
  const [bestBid, setBestBid] = useState(0.0);
  const [bestAskSize, setBestAskSize] = useState(0.0);
  const [bestBidSize, setBestBidSize] = useState(0.0);

  const [price, setprice] = useState('0.00');
  const [pastData, setpastData] = useState({});

  // const [orderBook, setOrderBook] = useState([]);

  const [depth, setDepth] = useState(20);
  const [ob, setOb] = useState({
    bids: [],
    asks: [],
  });

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

      let filtered = pairs.filter((pair) => {
        if (
          pair.display_name === 'BTC/USD' ||
          pair.display_name === 'ETH/USD' ||
          pair.display_name === 'LTC/USD' ||
          pair.display_name === 'BCH/USD'
        ) {
          return pair;
        }
        return '';
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
      channels: ['ticker', 'level2'],
    };

    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    // Granularity Options {60, 300, 900, 3600, 21600, 86400}

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=${granularity}`;
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
      if (data.type === 'snapshot') {
        setOb((prevOB) => {
          data.asks.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? -1
              : Number(a[0]) > Number(b[0])
              ? 1
              : 0
          );
          data.bids.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? 1
              : Number(a[0]) > Number(b[0])
              ? -1
              : 0
          );
          return {
            ...prevOB,
            asks: data.asks.slice(0, depth),
            bids: data.bids.slice(0, depth),
          };
        });
      }
      if (data.type !== 'ticker') {
        return;
      }

      if (data.product_id === pair) {
        setBestAskSize(data.best_ask_size);
        setBestBidSize(data.best_bid_size);
        setBestBid(data.best_bid);
        setBestAsk(data.best_ask);
        setprice(data.price);
      }
    };
  }, [pair, granularity, depth]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [pair],
      channels: ['ticker', 'level2'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setpair(e.target.value);
  };
  return (
    <div className="App">
      <div className="grid overflow-hidden grid-cols-3 grid-rows-6 gap-1.5 w-auto h-[98vh] body">
        <div className="flex box row-start-1 row-span-1 col-start-1 col-end-4">
          {
            <select
              className="bg-gray-800 text-xl rounded"
              name="currency"
              value={pair}
              onChange={handleSelect}
            >
              {currencies.map((cur, idx) => {
                return (
                  <option key={idx} value={cur.id}>
                    {cur.display_name}
                  </option>
                );
              })}
            </select>
          }
        </div>
        <div className="box p-3 border-double border-4 border-sky-500">
          <BestBid bestBid={bestBid} bestBidSize={bestBidSize} />
        </div>
        <div className="box p-3 border-double border-4 border-orange-400">
          <BestAsk bestAsk={bestAsk} bestAskSize={bestAskSize} />
        </div>

        <div className="box row-start-2 row-end-7 col-start-3 col-end-3">
          <OrderBookWrapper ob={ob} pair={pair} />
        </div>
        <div className="box row-start-3 row-end-7 col-start-1 col-end-3">
          <Dashboard price={price} data={pastData} />
        </div>
      </div>
    </div>
  );
}

export default App;
