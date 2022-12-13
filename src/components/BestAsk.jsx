function BestAsk({ bestAsk, bestAskSize }) {
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-2.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3">
        <h1 className="text-orange-300">Best Ask: CoinBase Pro</h1>
      </div>
      <div className="">
        {/* {AskAmount} */}
        {bestAsk}
        <p>Ask Price</p>
      </div>
      <div className="">
        {/* <h2>{AskQuantity}</h2> */}
        {bestAskSize}
        <p>Ask Quantity</p>
      </div>
    </div>
  );
}

export default BestAsk;
