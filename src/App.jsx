import React, { useState, useEffect, useRef } from 'react';
import Chart from './components/Chart';
import { formatData } from './utils/utils';
import './index.css';
import Header from './components/Header';
import BestBid from './components/BestBid';
import BestAsk from './components/BestAsk';
import OrderBookWrapper from './components/OrderBook';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState('Select');
  const [granularity, setGranularity] = useState(60);
  const [bestAsk, setBestAsk] = useState(0.0);
  const [bestBid, setBestBid] = useState(0.0);
  const [bestAskSize, setBestAskSize] = useState(0.0);
  const [bestBidSize, setBestBidSize] = useState(0.0);

  const [price, setprice] = useState(0.0);
  const [pastData, setPastData] = useState({});
  const [depth, setDepth] = useState(14);
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
      setCurrencies(filtered);

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
      channels: ['ticker', 'level2', 'subscriptions', 'l2update'],
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
      setPastData(formattedData);
    };

    fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === 'snapshot') {
        setOb((prevOB) => {
          console.log(prevOB);

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
      } else if (data.type === 'l2update') {
        const removedItems = data.changes.filter((el) => Number(el[2]) === 0);
        const removedAsks = removedItems
          .filter((el) => el[0] === 'sell')
          .map((el) => el[1]);
        const removedBuys = removedItems
          .filter((el) => el[0] === 'buy')
          .map((el) => el[1]);
        const addedItems = data.changes.filter((el) => Number(el[2]) !== 0);
        const addedAsks = addedItems
          .filter((el) => el[0] === 'sell')
          .map((el) => el.slice(1));
        const addedBuys = addedItems
          .filter((el) => el[0] === 'buy')
          .map((el) => el.slice(1));
        setOb((prevOB) => {
          const asks = [...prevOB.asks]
            .filter((ask) => !removedAsks.includes(ask[0]))
            .concat(addedAsks);
          const buys = [...prevOB.bids]
            .filter((buy) => !removedBuys.includes(buy[0]))
            .concat(addedBuys);
          asks.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? -1
              : Number(a[0]) > Number(b[0])
              ? 1
              : 0
          );
          buys.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? 1
              : Number(a[0]) > Number(b[0])
              ? -1
              : 0
          );
          //console.log("setting from update");
          //console.log(prevOB);
          //console.log({...prevOB, asks: asks, buys: buys });
          return {
            ...prevOB,
            asks: asks.slice(0, depth),
            bids: buys.slice(0, depth),
          };
        });
      } else if (data.type === 'subscriptions') {
      } else if (data.product_id === pair) {
        setBestAskSize(data.best_ask_size);
        setBestBidSize(data.best_bid_size);
        setBestBid(data.best_bid);
        setBestAsk(data.best_ask);
        setprice(data.price);
      } else {
        console.log('not correct data');
      }
    };
    return () => {
      //console.log('unmounted');
      // ws.current.close();
    };
  }, [pair, granularity, depth]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [pair],
      channels: ['ticker', 'level2', 'subscriptions', 'l2update'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setPair(e.target.value);
  };

  const handleChart = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [pair],
      channels: ['ticker', 'level2', 'subscriptions', 'l2update'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setGranularity(e.target.value);
  };
  return (
    <div className="App">
      <div className="grid overflow-hidden grid-cols-3 grid-rows-6 gap-1.5 w-auto h-[98vh] body">
        <div className="box p-3 border-double border-4 border-green-500">
          <Header
            pair={pair}
            handleChart={handleChart}
            handleSelect={handleSelect}
            currencies={currencies}
            granularity={granularity}
            setGranularity={setGranularity}
          />
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
        <div className="box row-start-2 row-end-7 col-start-1 col-end-3">
          <Chart pair={pair} price={price} data={pastData} />
        </div>
      </div>
    </div>
  );
}

export default App;
