## Welcome to the CoinBase Pro API Orderbook Dashboard

---

### Getting Started

---

- npm start to run the application locally
- npm build to build it for production
- No ENV variables were utilized for this project.

### App

---

In the main App file we have stateful logic and the base layout of our application.

1. In our App we connect to our WS Stream and filter by pairs.
2. Then we subscribe to the channels ticker, level2, subscriptions, l2update for our filtered pair.
3. fetch historical data, format the data with utils, and setPastData and send it to our Chart.
4. Next we configured the WS stream to listen for event messages and sort via prevOB data and specified depth.
5. We also set stateful Values for our BestBid and BestAsk components and pass that data via props
6. HandleSelect handler function for unsubscribing our websockets, which we pass our pair, and active channels. We also set the value of the handler to be our active pair

### Components

1. UserOptions
   1. import and destructure our props. Pass our granularity options.
   2. ternirary logic for choosing pair first time
   3. map through currencies, set a default value
   4. Style and make it responsive
2. BestBid
   1. import utils for dollar conversion
   2. import props and destructure
   3. Style and make it responsive
3. BestAsk
   1. import utils for dollar conversion
   2. import props and destructure
   3. Style and make it responsive
4. Chart
   1. import react-chartjs2 package and read documenation
   2. import props and desctructure
   3. configure options
   4. add dynamic styles off project RGBA
5. Orderbook
   1. import props and destructure
   2. configure useEffect for spread
   3. pass asks and bids to OBP components
      1. OBP component
      2. Format currency
