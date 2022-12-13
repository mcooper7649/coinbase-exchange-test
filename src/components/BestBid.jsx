function BestBid({ bestBid, bestBidSize }) {
  return (
    <div className="grid overflow-hidden grid-cols-2 grid-rows-2 gap-2.5 w-auto h-auto">
      <div className="row-start-1 row-span-1 col-start-1 col-end-3 ">
        <h1 className="text-blue-300">Best Bid: CoinBase Pro</h1>
      </div>

      <div className="">
        {/* {BidAmount} */}
        {bestBid}
        <p className="">Bid Price</p>
      </div>
      <div>
        {/* <h2>{BidQuantity}</h2> */}
        {bestBidSize}
        <p>Bid Quantity</p>
      </div>
    </div>
  );
}

export default BestBid;
