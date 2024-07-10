import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {CssBaseline} from '@mui/material'
import {HelmetProvider} from 'react-helmet-async'
import { LayoutLoader } from './components/layout/Loaders';
import {Provider} from 'react-redux'
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <HelmetProvider>
      <CssBaseline/>
      <Suspense fallback={<LayoutLoader/>}>
        <div onContextMenu={e=> e.preventDefault()}>
          <App />
        </div>
      </Suspense>
    </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
