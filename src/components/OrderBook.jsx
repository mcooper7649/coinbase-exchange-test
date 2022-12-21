import { useEffect, useState } from 'react';
import OBP from './OBP';
import Loader from './Loader';

function OrderBookWrapper({ ob, setAggregate, handleAgg, pair, aggregate }) {
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    let { bids, asks } = ob;

    if (asks[1] && bids[1]) {
      setSpread((Number(asks[0][0]) - Number(bids[0][0])).toFixed(2));
    }
  }, [ob, spread]);

  return (
    <div className="OB flex relative h-screen flex-col rounded">
      {ob?.asks.length && ob?.bids.length ? (
        <>
          <div>
            <OBP type="ask" orders={ob.asks} pair={pair} />
          </div>

          <div className="OB__S">
            <div className="OB__SL">USD Spread: </div>
            <div className="OB__SP">{spread}</div>
          </div>

          <div>
            <OBP type="bid" orders={ob.bids} pair={pair} />
          </div>

          <div className="OB__header">
            <div className="OB__header1">Order Book</div>
            <div className="OB__header3">
              <div
                className="flex flex-col"
                onClick={(e) => {
                  setAggregate(Number(e.target.innerHTML));
                  console.log(Number(e.target.innerHTML));
                  console.log(aggregate);
                }}
              >
                <button>.05</button>
              </div>
              <div
                className="flex flex-col"
                onClick={(e) => {
                  setAggregate(Number(e.target.innerHTML));
                  console.log(Number(e.target.innerHTML));
                  console.log(aggregate);
                }}
              >
                <button>.10</button>
              </div>
              <div
                className="flex flex-col"
                onClick={(e) => {
                  setAggregate(Number(e.target.innerHTML));
                  console.log(Number(e.target.innerHTML));
                  console.log(aggregate);
                }}
              >
                <button>.50</button>
              </div>
              <div
                value="1"
                className="flex flex-col"
                onClick={(e) => {
                  setAggregate(Number(e.target.innerHTML));
                  console.log(Number(e.target.innerHTML));
                  console.log(aggregate);
                }}
              >
                <button>1</button>
              </div>
            </div>
            <div className="OB__header2">
              <div>Size</div>
              <div>Price</div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default OrderBookWrapper;
