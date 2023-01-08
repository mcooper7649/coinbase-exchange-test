import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Chart from './components/Chart/Chart';
import { formatData } from './utils/utils';
import './index.css';
import UserOptions from './components/UserOptions';
import BestBid from './components/BestBid';
import BestAsk from './components/BestAsk';
import Orderbook from './components/Orderbook/Orderbook';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from './hooks/useSocket';

import { setActivePair, setGranularity, setAggregate } from './store/pairSlice';

function App() {
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);

  const activePair = useSelector((state) => state.pairer.activePair);
  const granularity = useSelector((state) => state.pairer.granularity);
  const aggregate = useSelector((state) => state.pairer.aggregate);

  const [currencies, setCurrencies] = useState([]);

  const [bestAsk, setBestAsk] = useState(null);
  const [bestBid, setBestBid] = useState(null);
  const [bestAskSize, setBestAskSize] = useState(null);
  const [bestBidSize, setBestBidSize] = useState(null);

  const [price, setPrice] = useState(0);
  const [pastData, setPastData] = useState({});
  const [depth] = useState(20);
  const [day, setDay] = useState(1);
  const [ob, setOb] = useState({
    bids: [],
    asks: [],
  });
  const socket = useSocket();
  function isOpen(socket) {
    return socket.readyState === socket.OPEN;
  }

  const handleStats = useCallback((data) => {
    setBestAskSize(Number(data.best_ask_size));
    setBestBidSize(Number(data.best_bid_size));
    setBestBid(Number(data.best_bid));
    setBestAsk(Number(data.best_ask));
    setPrice(Number(data.price));
  }, []);

  const handleUpdate = useCallback(
    (data) => {
      if (!isOpen(socket)) return;
      let unsubMsg = {
        type: 'unsubscribe',
        product_ids: [activePair],
        channels: ['level2_batch'],
      };
      let unsub = JSON.stringify(unsubMsg);

      socket.send(unsub);
      let aggData = {
        asks: [],
        bids: [],
      };
      if (data.changes !== undefined) {
        const removedItems = data.changes.filter(
          (el) =>
            Number(el[2]) === 0 ||
            Number(el) === isNaN ||
            Number(el) === 0 ||
            el === undefined
        );
        const removedAsks = removedItems
          .filter((el) => el[0] === 'sell' && +el[2] > 0)
          .map((el) => +el[1]);
        const removedBuys = removedItems
          .filter((el) => el[0] === 'buy' && +el[2] > 0)
          .map((el) => +el[1]);
        const addedItems = data.changes.filter(
          (el) =>
            Number(el[2]) !== 0 || el === isNaN || el === 0 || el === undefined
        );
        const addedAsks = addedItems
          .filter((el) => el[0] === 'sell' && +el[2] > 0)
          .map((el) => +el[1]);
        const addedBuys = addedItems
          .filter((el) => el[0] === 'buy' && +el[2] > 0)
          .map((el) => +el[1]);

        setOb((prevOB) => {
          const asks = [...prevOB.asks]
            .filter((ask) => !removedAsks.includes(ask[0]))
            .concat(addedAsks);
          const buys = [...prevOB.bids]
            .filter((bid) => !removedBuys.includes(bid[0]))
            .concat(addedBuys);

          aggData.bids = buys;
          aggData.asks = asks;

          for (let i = 0; i <= depth; i++) {
            if (
              aggData.asks[i] !== undefined ||
              aggData.bids[i] !== undefined
            ) {
              let startAsk = aggData.asks[0];
              let startBid = aggData.bids[0];
              let askStartRange = startAsk;
              let bidStartRange = startBid;
              let askEndRange = askStartRange - aggregate;
              let bidEndRange = bidStartRange > aggregate;

              let asksRange = [];
              let bidsRange = [];

              aggData.asks.forEach((el) => {
                if (Number(el[i]) > askEndRange) {
                  asksRange.push(el);
                }
              });

              aggData.bids.forEach((el) => {
                if (Number(el[i]) < bidEndRange) {
                  bidsRange.push(el);
                }
              });

              asksRange.forEach((el) => {
                let totalAskAmount = Number();

                let totalledEl = Number(el[1]);

                totalAskAmount += totalledEl;
                aggData.asks.push([askEndRange, totalAskAmount]);
              });

              bidsRange.forEach((el) => {
                let totalBidAmount = Number();
                let totalledEl = Number(el[1]);

                totalBidAmount += totalledEl;
                aggData.bids.push([bidEndRange, totalBidAmount]);
              });
            } else {
              console.log('no change update');
            }
          }

          return {
            ...prevOB,
            asks: aggData.asks.slice(0, depth),
            bids: aggData.bids.slice(0, depth),
          };
        });
      }
    },
    [aggregate, depth, activePair, socket]
  );

  const onMessageLogic = useCallback(
    (e) => {
      let data = JSON.parse(e.data);

      if (data.type === 'snapshot') {
        let aggData = {
          asks: [],
          bids: [],
        };
        // let prevEndRange = 0;
        let firstRun = true;
        // console.log(data);
        for (let i = 0; i <= depth; i++) {
          if (data.asks[i][0] !== undefined || data.bids[i][0] !== undefined)
            data.asks.sort((a, b) =>
              Number(a[0]) > Number(b[0])
                ? 1
                : Number(a[0]) < Number(b[0])
                ? -1
                : 0
            );
          data.bids.sort((a, b) =>
            Number(a[0]) < Number(b[0])
              ? 1
              : Number(a[0]) > Number(b[0])
              ? -1
              : 0
          );

          let prevAskEndRange = Number();
          let prevBidEndRange = Number();
          let startAsk = firstRun ? bestAsk : prevAskEndRange;
          let startBid = firstRun ? bestBid : prevBidEndRange;
          let askStartRange = startAsk;
          let bidStartRange = startBid;
          let askEndRange = (askStartRange += aggregate);
          let bidEndRange = (bidStartRange -= aggregate);
          // console.log(bidStartRange);

          firstRun = false;
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

          // console.log(aggData.bids[0], aggData.asks[0]);
        }

        setOb((prevOB) => {
          return {
            ...prevOB,
            asks: aggData.asks.slice(0, depth),
            bids: aggData.bids.slice(0, depth),
          };
        });
      } else if (data.type === 'ticker') {
        handleStats(data);
      } else if (data.type === 'l2update') {
        handleUpdate(data);
        let msg = {
          type: 'subscribe',
          product_ids: [activePair],
          channels: ['level2_batch'],
        };

        let jsonMsg = JSON.stringify(msg);
        if (!isOpen(socket)) return;
        socket.send(jsonMsg);
      }
    },
    [
      aggregate,
      depth,
      handleUpdate,
      bestAsk,
      bestBid,
      handleStats,
      activePair,
      socket,
    ]
  );

  let first = useRef(false);
  const url = 'https://api.pro.coinbase.com';
  useEffect(() => {
    // ws.current = socket;
    socket.onopen = () => {
      console.log(socket.readyState);
      console.log('Connection Established!');
      if (!isOpen(socket)) return;
      let msg = {
        type: 'subscribe',
        product_ids: [activePair],
        channels: ['ticker', 'level2_batch'],
      };

      let jsonMsg = JSON.stringify(msg);
      if (!isOpen(socket)) return;
      socket.send(jsonMsg);
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
  }, [socket, activePair]);

  useEffect(() => {
    if (!first.current) {
      return;
    }
    let msg = {
      type: 'subscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2_batch'],
    };

    console.log('useEffect2 render');

    let historicalDataURL = `${url}/products/${
      activePair === 'Select' ? 'BTC/USD' : activePair
    }/candles?granularity=${granularity === 'Minutes' ? 60 : granularity}`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));

      setPastData(formatData(dataArr, activePair, day));
    };

    console.log('updating charts');
    fetchHistoricalData();
    let jsonMsg = JSON.stringify(msg);
    if (!isOpen(socket)) return;
    socket.send(jsonMsg);
  }, [activePair, granularity, socket, day]);

  useEffect(() => {
    socket.onmessage = (e) => {
      onMessageLogic(e);
    };
  }, [
    activePair,
    granularity,
    aggregate,
    depth,
    socket,
    handleUpdate,
    ob,
    onMessageLogic,
  ]);
  // });

  const handleSelect = (e) => {
    dispatch(setActivePair(e.target.value));

    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2_batch'],
    };
    let unsub = JSON.stringify(unsubMsg);
    if (!isOpen(socket)) return;
    socket.send(unsub);
  };

  const handleAgg = (e) => {
    dispatch(setAggregate(Number(e.target.value)));
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2_batch'],
    };
    let unsub = JSON.stringify(unsubMsg);
    if (!isOpen(socket)) return;
    socket.send(unsub);
  };

  const handleChart = (e) => {
    dispatch(setGranularity(e.target.value));
    if (e.target.value > 899) {
      setDay(0);
    } else {
      setDay(1);
    }
    let unsubMsg = {
      type: 'unsubscribe',
      product_ids: [activePair],
      channels: ['ticker', 'level2_batch'],
    };
    let unsub = JSON.stringify(unsubMsg);
    if (!isOpen(socket)) return;
    socket.send(unsub);
  };
  return (
    <div className="App">
      <div className="grid overflow-hidden grid-cols-3 grid-rows-6 gap-1.5 w-auto h-[98vh] body">
        <div
          className={`box pl-3 pt-3 pr-3 border border-8 ${
            isDarkMode
              ? 'border-sky-500 bg-gray-300 text-gray-800'
              : 'bg-gray-800 border-sky-500 text-gray-100'
          }`}
        >
          <UserOptions
            pair={activePair}
            handleChart={handleChart}
            handleSelect={handleSelect}
            currencies={currencies}
            granularity={granularity}
          />
        </div>
        <div
          className={`box pl-3 pt-3 pr-3 border border-8 ${
            isDarkMode
              ? 'border-green-500 bg-gray-300 text-gray-800'
              : 'bg-gray-800 border-green-500 text-gray-100'
          }`}
        >
          <BestBid bestBid={bestBid} bestBidSize={bestBidSize} />
        </div>
        <div
          className={`box pl-3 pt-3 pr-3 border border-8 ${
            isDarkMode
              ? 'border-red-500 bg-gray-300 text-gray-800'
              : 'bg-gray-800 border-red-500 text-gray-100'
          }`}
        >
          <BestAsk bestAsk={bestAsk} bestAskSize={bestAskSize} />
        </div>

        <div
          className={`box row-start-2 row-end-7 col-start-3 col-end-3 ${
            isDarkMode ? 'bg-gray-300' : 'bg-gray-800'
          }`}
        >
          <Orderbook
            aggregate={aggregate}
            handleAgg={handleAgg}
            ob={ob}
            bestAsk={bestAsk}
            bestBid={bestBid}
            setAggregate={setAggregate}
            pair={activePair}
          />
        </div>
        <div
          className={`box row-start-2 row-end-7 col-start-1 col-end-3 ${
            isDarkMode
              ? 'bg-gray-300 text-gray-100'
              : 'bg-gray-800 text-gray-800'
          }`}
        >
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
