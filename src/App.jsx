import React, { useState, useEffect, useRef } from 'react';
import Chart from './components/Chart';
import { formatData } from './utils/utils';
import './index.css';
import UserOptions from './components/UserOptions';
import BestBid from './components/BestBid';
import BestAsk from './components/BestAsk';
import OrderBook from './components/OrderBook';
import { useSelector, useDispatch } from 'react-redux';

import { setActivePair, setGranularity } from './store/pairSlice';

function App() {
  const dispatch = useDispatch();

  const activePair = useSelector((state) => state.pairer.activePair);
  const granularity = useSelector((state) => state.pairer.granularity);
  const [prevAskEndRange, setPrevAskEndRange] = useState();
  const [prevBidEndRange, setPrevBidEndRange] = useState(0);

  const [currencies, setCurrencies] = useState([]);
  const [aggregate, setAggregate] = useState(0.5);

  const [bestAsk, setBestAsk] = useState(0.0);
  const [bestBid, setBestBid] = useState(0.0);
  const [bestAskSize, setBestAskSize] = useState(0.0);
  const [bestBidSize, setBestBidSize] = useState(0.0);

  const [price, setPrice] = useState(0);
  const [pastData, setPastData] = useState({});
  const [depth] = useState(600);
  const [ob, setOb] = useState({
    bids: [],
    asks: [],
  });

  const ws = useRef(null);

  let first = useRef(false);
  const url = 'https://api.pro.coinbase.com';

  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com');
    ws.current.onopen = () => {
      console.log('Connection Established!');
    };

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
      return;
    }

    let msg = {
      type: 'subscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2', 'l2update'],
    };

    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    let historicalDataURL = `${url}/products/${activePair}/candles?granularity=${
      granularity === 'Minutes' ? 60 : granularity
    }`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      let formattedData = formatData(dataArr, activePair);
      setPastData(formattedData);
    };

    fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === 'ticker') {
        setBestAskSize(Number(data.best_ask_size));
        setBestBidSize(Number(data.best_bid_size));
        setBestBid(Number(data.best_bid));
        setBestAsk(Number(data.best_ask));
        setPrice(Number(data.price));
      } else if (data.type === 'snapshot') {
        setOb((prevOB) => {
          let aggData = {
            asks: [],
            bids: [],
          };
          // let prevEndRange = 0;
          let firstRun = true;
          for (let i = 0; i <= depth; i++) {
            let askStartRange = firstRun
              ? Number(data.asks[i][0])
              : prevAskEndRange;
            let bidStartRange = firstRun
              ? Number(data.bids[i][0])
              : prevBidEndRange;
            let askEndRange = (askStartRange += aggregate);
            let bidEndRange = (bidStartRange -= aggregate);
            firstRun = false;
            // console.log(startRange);

            // console.log(endRange);
            // console.log(newData);
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

            let asksRange = [];
            let bidsRange = [];

            data.asks.forEach((el) => {
              if (Number(el[i]) > askEndRange) {
                asksRange.push(el);
              }
            });

            data.bids.forEach((el) => {
              if (Number(el[i]) < bidEndRange) {
                bidsRange.push(el);
              }
            });

            asksRange.forEach((el) => {
              let totalAskAmount = Number();
              // console.log(el);
              let totalledEl = Number(el[1]);

              totalAskAmount += totalledEl;
              // console.log(endRange);
              askEndRange = askEndRange += aggregate;
              aggData.asks.push([askEndRange, totalAskAmount]);
            });

            bidsRange.forEach((el) => {
              let totalBidAmount = Number();
              // console.log(el);
              let totalledEl = Number(el[1]);

              totalBidAmount += totalledEl;
              // console.log(endRange);
              bidEndRange = bidEndRange += aggregate;
              aggData.bids.push([bidEndRange, totalBidAmount]);
            });

            setPrevBidEndRange(bidEndRange);
            setPrevAskEndRange(askEndRange);
            // console.log(aggData);
          }

          return {
            ...prevOB,
            asks: aggData.asks.slice(0, depth),
            bids: aggData.bids.slice(0, depth),
          };
        });
      } else if (data.type === 'l2update') {
        //   const removedItems = data.changes.filter((el) => Number(el[2]) === 0);
        //   const removedAsks = removedItems
        //     .filter((el) => Number(el[0]) === 'sell')
        //     .map((el) => Number(el[1]));
        //   const removedBuys = removedItems
        //     .filter((el) => Number(el[0]) === 'buy')
        //     .map((el) => Number(el[1]));
        //   const addedItems = data.changes.filter((el) => Number(el[2]) !== 0);
        //   const addedAsks = addedItems
        //     .filter((el) => Number(el[0]) === 'sell')
        //     .map((el) => Number(el.slice(1)));
        //   const addedBuys = addedItems
        //     .filter((el) => Number(el[0]) === 'buy')
        //     .map((el) => Number(el.slice(1)));
        //   // console.log(addedAsks);
        //   setOb((prevOB) => {
        //     const asks = [...prevOB.asks]
        //       .filter((ask) => !removedAsks.includes(ask[0]))
        //       .concat(addedAsks);
        //     const buys = [...prevOB.bids]
        //       .filter((buy) => !removedBuys.includes(buy[0]))
        //       .concat(addedBuys);
        //     for (let i = 0; i <= depth; i++) {
        //       let askStartRange = i === 0 ? Number(asks[i][0]) : prevAskEndRange;
        //       let bidStartRange = i === 0 ? Number(buys[i][0]) : prevBidEndRange;
        //       let askEndRange = (askStartRange += aggregate);
        //       let bidEndRange = (bidStartRange -= aggregate);
        //       asks.sort((a, b) =>
        //         Number(a[0]) < Number(b[0])
        //           ? -1
        //           : Number(a[0]) > Number(b[0])
        //           ? 1
        //           : 0
        //       );
        //       buys.sort((a, b) =>
        //         Number(a[0]) > Number(b[0])
        //           ? 1
        //           : Number(a[0]) > Number(b[0])
        //           ? -1
        //           : 0
        //       );
        //       let asksRange = [];
        //       let bidsRange = [];
        //       asks.forEach((el) => {
        //         console.log(el[0]);
        //         if (Number(el[0]) < askEndRange) {
        //           asksRange.push(el);
        //         }
        //       });
        //       console.log(asksRange);
        //       buys.forEach((el) => {
        //         if (Number(el[i]) < bidEndRange) {
        //           bidsRange.push(el);
        //         }
        //       });
        //       let aggData = {
        //         asks: [],
        //         bids: [],
        //       };
        //       //console.log("setting from update");
        //       //console.log(prevOB);
        //       //console.log({...prevOB, asks: asks, buys: buys });
        //       // aggData.asks.push(asksRange);
        //       // aggData.bids.push(bidsRange);
        //       // console.log(asksRange);
        //       return {
        //         ...prevOB,
        //         asks: aggData.asks.slice(0, depth),
        //         bids: aggData.bids.slice(0, depth),
        //       };
        //     }
        //   });
      } else {
        console.log('not correct data', data);
      }
    };
    return () => {
      //console.log('unmounted');
      // ws.current.close();
    };
  }, [
    activePair,
    granularity,
    aggregate,
    depth,
    prevBidEndRange,
    prevAskEndRange,
  ]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2', 'l2update'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    dispatch(setActivePair(e.target.value));
  };

  const handleChart = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2', 'l2update'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    dispatch(setGranularity(e.target.value));
  };
  return (
    <div className="App">
      <div className="grid overflow-hidden grid-cols-3 grid-rows-6 gap-1.5 w-auto h-[98vh] body">
        <div className="box pl-3 pt-3 pr-3 border-double border-4 border-sky-500">
          <UserOptions
            pair={activePair}
            handleChart={handleChart}
            handleSelect={handleSelect}
            currencies={currencies}
            granularity={granularity}
            setGranularity={setGranularity}
          />
        </div>
        <div className="box pl-3 pt-3 pr-3 border-double border-4 border-green-500">
          <BestBid bestBid={bestBid} bestBidSize={bestBidSize} />
        </div>
        <div className="box pl-3 pt-3 pr-3 border-double border-4 border-red-400">
          <BestAsk bestAsk={bestAsk} bestAskSize={bestAskSize} />
        </div>

        <div className="box row-start-2 row-end-7 col-start-3 col-end-3">
          <OrderBook ob={ob} pair={activePair} />
        </div>
        <div className="box row-start-2 row-end-7 col-start-1 col-end-3">
          <Chart
            granularity={granularity}
            pair={activePair}
            price={price}
            data={pastData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
