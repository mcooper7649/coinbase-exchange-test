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
            <label className="px-3" htmlFor="cur-select">
              Choose Aggregate:
            </label>
            <select
              id="cur-select"
              className={`cursor-pointer md:pl-2 bg-gray-800 text-xs rounded border border-orange-500`}
              name="currency"
              onChange={(e) => {
                handleAgg(e);
              }}
            >
              <option defaultValue={true}>In USD</option>
              {[0.05, 0.1, 0.5, 1.0].map((agg, idx) => {
                return (
                  <option key={agg} value={agg}>
                    {agg}
                  </option>
                );
              })}
            </select>
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
