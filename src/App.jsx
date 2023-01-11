import Main from '../src/components/Main';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div>
      <Helmet>
        <meta charset="utf-8" data-react-helmet="true" />
        <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta
          name="title"
          content="CoinRoutes | Coinbase API"
          property="og:title"
          data-react-helmet="true"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" data-react-helmet="true" />
        <meta
          name="image"
          property="og:image"
          content="https://i.ibb.co/gTkzyFH/linkedin-shared-link-1.png"
          data-react-helmet="true"
        />
        <meta
          name="url"
          property="og:url"
          content="https://coinroutes-mc.netlify.app/"
        />
        <meta
          name="description"
          property="og:description"
          content="CoinRoutes | An Dashboard for Viewing Realtime Coinbase Pro Crypto Transactions"
          data-react-helmet="true"
        />
        <meta name="author" property="og:author" content="Michael Cooper" />
        <meta
          name="publish_date"
          property="og:publish_date"
          content="2023-01-11T00:00:00-0600"
        />
        <title>CoinRoutes | Coinbase API Dashboard</title>
      </Helmet>
      <Main />
    </div>
  );
}

export default App;
