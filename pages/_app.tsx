import '../styles/index.css';

import { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import WebSocketProvider from '../lib/webSocket';
import store from '../store';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Component {...pageProps} />
      </WebSocketProvider>
    </Provider>
  );
};

export default MyApp;
