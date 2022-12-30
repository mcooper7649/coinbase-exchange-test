import { useEffect, useState } from 'react';
import OBP from './OBP';
import Loader from './Loader';

function OrderBookWrapper({
  bestAsk,
  bestBid,
  ob,
  setAggregate,
  handleAgg,
  pair,
  aggregate,
}) {
  const [spread, setSpread] = useState(0);
  let { bids, asks } = ob;
  useEffect(() => {
    if (asks[1] && bids[1]) {
      setSpread((Number(bestAsk) - Number(bestBid)).toFixed(2));
    }
  }, [ob, asks, bids, spread, bestAsk, bestBid]);

  // console.log(asks, bids);

  return (
    <div className="OB flex relative h-screen flex-col rounded">
      (
      <>
        <div>
          <OBP key={ob.asks} type="ask" orders={asks} pair={pair} />
        </div>

        <div className="OB__S">
          <div className="OB__SL">USD Spread: </div>
          <div className="OB__SP">{spread}</div>
        </div>

        <div>
          <OBP key={ob.bids} type="bid" orders={bids} pair={pair} />
        </div>

        <div className="OB__header">
          <div className="OB__header1">Order Book</div>
          <div className="OB__header1">
            Choose Aggregate Below: Default is .50 cents
          </div>
          <div className="OB__header3">
            <div
              className="flex flex-col"
              onClick={(e) => {
                handleAgg(e);
              }}
            >
              .05
            </div>
            <div
              className="flex flex-col"
              onClick={(e) => {
                handleAgg(e);
              }}
            >
              .10
            </div>
            <div
              className="flex flex-col"
              onClick={(e) => {
                handleAgg(e);
              }}
            >
              .50
            </div>
            <div
              className="flex flex-col"
              onClick={(e) => {
                handleAgg(e);
              }}
            >
              1
            </div>
          </div>
          <div className="OB__header2">
            <div>Size</div>
            <div>Price</div>
          </div>
        </div>
      </>
      ) : (
      <Loader />)
    </div>
  );
}

export default OrderBookWrapper;
