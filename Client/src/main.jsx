import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import router from './Routes/Routes.jsx'
import {AppContextProvider} from './Context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <RouterProvider router={router}>
      <App/>
    </RouterProvider>
  </AppContextProvider>
)
