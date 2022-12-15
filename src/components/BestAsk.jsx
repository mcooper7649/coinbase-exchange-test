import { USDollar } from '../utils/utils';

function BestAsk({ bestAsk, bestAskSize }) {
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-1.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 text-xs md:text-lg">
        <h1 className="text-orange-300 border-b-4 border-gray-300">
          Best Ask: CoinBase Pro
        </h1>
      </div>

      {/* {AskAmount} */}
      {USDollar.format(bestAsk)}
      <p className="text-xs md:text-lg">Ask Price</p>

      {/* <h2>{AskQuantity}</h2> */}
      {bestAskSize}
      <p className="text-xs md:text-lg">Ask Quantity</p>
    </div>
  );
}

export default BestAsk;
