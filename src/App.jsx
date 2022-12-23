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

  const [currencies, setCurrencies] = useState([]);
  const [aggregate, setAggregate] = useState(0.5);

  const [bestAsk, setBestAsk] = useState(null);
  const [bestBid, setBestBid] = useState(null);
  const [bestAskSize, setBestAskSize] = useState(null);
  const [bestBidSize, setBestBidSize] = useState(null);

  const [price, setPrice] = useState(0);
  const [pastData, setPastData] = useState({});
  const [depth] = useState(60);
  const [ob, setOb] = useState({
    bids: [],
    asks: [],
  });

  // const [aggData, setAggData] = useState({});

  const ws = useRef(null);
  const firstRun = useRef(false);

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

      console.log('useeffect1 render, currencies set');
      setCurrencies(filtered);
      first.current = true;
    };

    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      console.log('2nd use effect');
      return;
    }

    console.log('useEffect2 render');
    let msg = {
      type: 'subscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2', 'snapshot', 'heartbeat'],
    };

    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    let historicalDataURL = `${url}/products/${
      activePair === 'Select' ? 'BTC/USD' : activePair
    }/candles?granularity=${granularity === 'Minutes' ? 60 : granularity}`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      setPastData(formatData(dataArr, activePair));
    };

    fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);

      if (data.type === 'snapshot') {
        console.log('snapshot hit');
        let prevAskEndRange = 0;
        let prevBidEndRange = 0;
        setOb((prevOB) => {
          let aggData = {
            asks: [],
            bids: [],
          };
          // let prevEndRange = 0;
          let firstRun = true;
          // console.log(data);
          for (let i = 0; i <= depth; i++) {
            let startAsk = +data.asks[i][0];
            let startBid = +data.bids[i][0];
            let askStartRange = firstRun
              ? startAsk - aggregate
              : prevAskEndRange;
            let bidStartRange = firstRun
              ? startBid - aggregate
              : prevBidEndRange;
            let askEndRange = (askStartRange += aggregate);
            let bidEndRange = (bidStartRange -= aggregate);
            firstRun = false;
            // console.log(bidStartRange);

            data.asks.sort((a, b) =>
              Number(a[0]) < Number(b[0])
                ? -1
                : Number(a[0]) > Number(b[0])
                ? 1
                : 0
            );
            data.bids.sort((a, b) =>
              Number(a[0]) > Number(b[0])
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
              askEndRange = askStartRange -= aggregate;
              aggData.asks.push([askEndRange, totalAskAmount]);
            });

            bidsRange.forEach((el) => {
              let totalBidAmount = Number();
              // console.log(el);
              let totalledEl = Number(el[1]);

              totalBidAmount += totalledEl;
              // console.log(endRange);
              bidEndRange = bidStartRange += aggregate;
              aggData.bids.push([bidEndRange, totalBidAmount]);
            });
            prevBidEndRange = bidEndRange;
            prevAskEndRange = askEndRange;

            // console.log(aggData);
          }
          return {
            ...prevOB,
            asks: aggData.asks.slice(0, depth),
            bids: aggData.bids.slice(0, depth),
          };
        });
      } else if (data.type === 'ticker') {
        setBestAskSize(Number(data.best_ask_size));
        setBestBidSize(Number(data.best_bid_size));
        setBestBid(Number(data.best_bid));
        setBestAsk(Number(data.best_ask));
        setPrice(Number(data.price));
        return;
      }

      // else if (data.type === 'l2update') {
      //   const removedItems = data.changes.filter((el) => Number(el[2]) === 0);
      //   const removedAsks = removedItems
      //     .filter((el) => el[0] === 'sell')
      //     .map((el) => el[1]);
      //   const removedBuys = removedItems
      //     .filter((el) => el[0] === 'buy')
      //     .map((el) => el[1]);
      //   const addedItems = data.changes.filter((el) => Number(el[2]) !== 0);
      //   const addedAsks = addedItems
      //     .filter((el) => el[0] === 'sell')
      //     .map((el) => el.slice(1));
      //   const addedBuys = addedItems
      //     .filter((el) => el[0] === 'buy')
      //     .map((el) => el.slice(1));

      //   let prevAskEndRange = 0;
      //   let prevBidEndRange = 0;
      //   setOb((prevOB) => {
      //     let aggData = {
      //       asks: [],
      //       bids: [],
      //     };
      //     const asks = [...prevOB.asks]
      //       .filter((ask) => !removedAsks.includes(ask[0]))
      //       .concat(addedAsks);
      //     const buys = [...prevOB.bids]
      //       .filter((bid) => !removedBuys.includes(bid[0]))
      //       .concat(addedBuys);

      //     asks.sort((a, b) =>
      //       Number(a[0]) < Number(b[0])
      //         ? 1
      //         : Number(a[0]) > Number(b[0])
      //         ? -1
      //         : 0
      //     );
      //     buys.sort((a, b) =>
      //       Number(a[0]) > Number(b[0])
      //         ? 1
      //         : Number(a[0]) > Number(b[0])
      //         ? -1
      //         : 0
      //     );
      //     aggData.bids = buys;
      //     aggData.asks = asks;
      //     let firstRun = true;
      //     // console.log(data);
      //     for (let i = 0; i <= depth; i++) {
      //       let startAsk = aggData.asks[i][0];
      //       let startBid = aggData.bids[i][0];
      //       let askStartRange = firstRun
      //         ? startAsk - aggregate
      //         : prevAskEndRange;
      //       let bidStartRange = firstRun
      //         ? startBid + aggregate
      //         : prevBidEndRange;
      //       let askEndRange = (askStartRange += aggregate);
      //       let bidEndRange = (bidStartRange -= aggregate);
      //       firstRun = false;

      //       let asksRange = [];
      //       let bidsRange = [];

      //       aggData.asks.forEach((el) => {
      //         if (Number(el[i]) < askEndRange) {
      //           asksRange.push(el);
      //         }
      //       });

      //       aggData.bids.forEach((el) => {
      //         if (Number(el[i]) > bidEndRange) {
      //           bidsRange.push(el);
      //         }
      //       });

      //       asksRange.forEach((el) => {
      //         let totalAskAmount = Number();
      //         // console.log(el);
      //         let totalledEl = Number(el[1]);

      //         totalAskAmount += totalledEl;
      //         // console.log(endRange);
      //         askEndRange = askEndRange += aggregate;
      //         aggData.asks.push([+askEndRange, +totalAskAmount]);
      //       });

      //       bidsRange.forEach((el) => {
      //         let totalBidAmount = Number();
      //         // console.log(el);
      //         let totalledEl = Number(el[1]);

      //         totalBidAmount += totalledEl;
      //         // console.log(endRange);
      //         bidEndRange = bidEndRange += aggregate;
      //         aggData.bids.push([+bidEndRange, +totalBidAmount]);
      //       });

      //       prevBidEndRange = bidEndRange;
      //       prevAskEndRange = askEndRange;
      //       //   // console.log(data);
      //       //   // setOb(data);

      //       //   const removedItems = data.changes.filter((el) => Number(el[2]) === 0);
      //       //   const removedAsks = removedItems
      //       //     .filter((el) => Number(el[0]) === 'sell')
      //       //     .map((el) => Number(el[1]));
      //       //   const removedBuys = removedItems
      //       //     .filter((el) => Number(el[0]) === 'buy')
      //       //     .map((el) => Number(el[1]));
      //       //   const addedItems = data.changes.filter((el) => Number(el[2]) !== 0);
      //       //   const addedAsks = addedItems
      //       //     .filter((el) => Number(el[0]) === 'sell')
      //       //     .map((el) => Number(el.slice(1)));
      //       //   const addedBuys = addedItems
      //       //     .filter((el) => Number(el[0]) === 'buy')
      //       //     .map((el) => Number(el.slice(1)));
      //       //   // console.log(addedAsks);
      //       //   setOb((prevOB) => {
      //       //     if (prevOB) {
      //       //       // console.log(prevOB);
      //       //       const asks = [...prevOB.asks]
      //       //         .filter((ask) => !removedAsks.includes(ask[0]))
      //       //         .concat(addedAsks);
      //       //       const buys = [...prevOB.bids]
      //       //         .filter((buy) => !removedBuys.includes(buy[0]))
      //       //         .concat(addedBuys);
      //       //       asks.sort((a, b) =>
      //       //         Number(a[0]) < Number(b[0])
      //       //           ? -1
      //       //           : Number(a[0]) > Number(b[0])
      //       //           ? 1
      //       //           : 0
      //       //       );
      //       //       buys.sort((a, b) =>
      //       //         Number(a[0]) > Number(b[0])
      //       //           ? 1
      //       //           : Number(a[0]) > Number(b[0])
      //       //           ? -1
      //       //           : 0
      //       //       );

      //       //       //   let aggData = {
      //       //       //     asks,
      //       //       //     buys,
      //       //       //   };

      //       //       setAggData({
      //       //         asks: asks.slice(0, depth),
      //       //         bids: buys.slice(0, depth),
      //       //       });
      //     }
      //     return {
      //       ...prevOB,
      //       asks: aggData.asks.slice(0, depth),
      //       bids: aggData.bids.slice(0, depth),
      //     };
      //   });
      // }
    };
  }, [ob, activePair, granularity, aggregate, depth]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2', 'heartbeat', 'l2update'],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    dispatch(setActivePair(e.target.value));
  };

  const handleAgg = (e) => {
    let amounts = [0.5, 0.1, 0.5, 1];
    if (Number(e.target.value) === 0.5) {
      setAggregate(amounts[0]);
    } else if (Number(e.target.value) === 0.1) {
      setAggregate(amounts[1]);
    } else if (Number(e.target.value) === 0.5) {
      setAggregate(amounts[2]);
    } else if (Number(e.target.value) === 1) {
      setAggregate(amounts[3]);
    }
  };

  const handleChart = (e) => {
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
          {console.log(ob)}
          <OrderBook
            aggregate={aggregate}
            handleAgg={handleAgg}
            ob={ob}
            setAggregate={setAggregate}
            pair={activePair}
          />
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
