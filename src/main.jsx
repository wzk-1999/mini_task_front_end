import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store ,{ persistor } from "./store/store.js";
import { Provider } from "react-redux";
import 'antd/dist/reset.css';
import { PersistGate } from 'redux-persist/integration/react';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
  <StrictMode>
    <App />
  </StrictMode>
  </PersistGate>
  </Provider>,
)
