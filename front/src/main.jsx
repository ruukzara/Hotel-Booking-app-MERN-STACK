import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux"
import { store } from "./store"
import { ToastContainer } from 'react-toastify'
import { SearchContextProvider } from './useContext/SearchContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchContextProvider>
      <Provider store={store}>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Provider>
    </SearchContextProvider>
  </StrictMode>
)
