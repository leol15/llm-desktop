import { BrowserRouter, Route, Routes } from 'react-router'
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import { Provider } from 'react-redux'
import AppWrapper from './AppWrapper'
import { store } from './redux/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route index element={<App />} />
            <Route path="prompt-playground" element={<span>promt playgroud</span>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
