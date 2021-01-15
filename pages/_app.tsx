import '../styles/index.css';

import store from '@lib/store';
import WebSocketProvider from '@lib/webSocket';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';

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
