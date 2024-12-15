import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//Primereact theme css
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';

//Entire application Router
import Loader from './components/Loader';
import { RouterProvider } from 'react-router-dom';
import router from './router';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <Suspense fallback={<Loader/>}>
      <RouterProvider router={router} />
    </Suspense>
 // </StrictMode>,
)
