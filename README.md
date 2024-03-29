## Welcome to the CoinBase Pro API Orderbook Dashboard

---

![Dashboard](https://img001.prntscr.com/file/img001/zkw9ocn9TWy1RjGROFEKtw.png)

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

![User-Options](https://img001.prntscr.com/file/img001/wxy2b1OPSpKQMwLFhcBqbw.png)

1. UserOptions
   1. import and destructure our props. Pass our granularity options.
   2. ternirary logic for choosing pair first time
   3. map through currencies, set a default value
   4. Style and make it responsive
   5. Add HeadlessUI for Custom Dropdowns. Add SVGs for the Tokens
   6. Create another Custom Dropdown for the Granularity and import logic

![Best-Bid](https://img001.prntscr.com/file/img001/k-qUqtQySFa_eRHKNWD_dw.png)

1. BestBid
   1. import utils for dollar conversion
   2. import props and destructure
   3. Style and make it responsive
   4. Added Animations for new Price Updates
   5. Integrated ToolTip feature to Relay High/Lows of Selected Token

![Best-Ask](https://img001.prntscr.com/file/img001/AMy_UHMHQQyGzZTMe5pYpw.png)

1. BestAsk
   1. import utils for dollar conversion
   2. import props and destructure
   3. Style and make it responsive
   4. Added Animations for new Price Updates
   5. Integrated ToolTip feature to Relay High/Lows of Selected Token

![Chart](https://img001.prntscr.com/file/img001/1fbW8kEURhaXv9FSE0Pt6A.png)

1. Chart
   1. import react-chartjs2 package and read documenation
   2. import props and desctructure
   3. configure options
   4. add dynamic styles off project RGBA
   5. Changed the Labels to Display hours or Data depending on Selection
   6. Added Utils for Dollar Conversion

![OrderBook](https://img001.prntscr.com/file/img001/cayNCMaZRiKJbSnRZ38lzQ.png)

1. Orderbook
   1. import props and destructure
   2. configure useEffect for spread
   3. pass asks and bids to OBP components
      1. OBP component
      2. Format currency
   4. Create Loader
   5. Created Aggregate Feature
      1. Utilizing sub/unsub to trigger appropriate updates was the blocker
   6. Added Dark Mode in Settings Area as addtional UI feature.

![RTK-Store](https://img001.prntscr.com/file/img001/MqkkjAlESde1Lw_ueCXXrw.png)

1. Redux ToolKit (State Management)
   1. Configure Store
   2. Add pairSlice
      1. create setActivePair and setGranularity Actions
      2. create reduce
   3. Remove old useState and add actions with dispatch
   4. Added setAggregate to state management system

![RTK-Slice](https://img001.prntscr.com/file/img001/PNZR84FKQaGQ9bfBdNGjug.png)

1. Additional Features
   1. ToolTip was added with slight delay for Best Ask/Bid Components and Orderbook
   2. Utilizied useToggleState custom hook with DarkMode. Can be reutilized.
   3. ThemeContext was the Context Provider created for Dark Mode Feature.
