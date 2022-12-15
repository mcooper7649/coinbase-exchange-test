import { useEffect, useState } from 'react';
import OBP from './OBP';

function OrderBookWrapper({ ob }) {
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    // console.log(ob);

    let { bids, asks } = ob;
    if (asks[0] && bids[0]) {
      setSpread((Number(asks[0][0]) - Number(bids[0][0])).toFixed(2));
    }

    // return () => clearInterval(interval);
  }, [ob, spread]);

  return (
    <div className="OB flex relative h-screen flex-col rounded">
      <div>
        <OBP type="ask" orders={ob.asks} pair={ob.pair} />
      </div>

      <div className="OB__S">
        <div className="OB__SL">USD Spread: </div>
        <div className="OB__SP">{spread}</div>
      </div>

      <div>
        <OBP type="bid" orders={ob.bids} pair={ob.pair} />
      </div>

      <div className="OB__header">
        <div className="OB__header1">Order Book</div>
        <div className="OB__header2">
          <div>Size</div>
          <div>Price</div>
        </div>
      </div>
    </div>
  );
}

export default OrderBookWrapper;
