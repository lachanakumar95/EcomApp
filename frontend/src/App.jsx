import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { SpeedDial } from 'primereact/speeddial';

import { IoColorPaletteOutline } from "react-icons/io5";

function App() {
  const [visible, setVisible] = useState(false);
  return (
    <>
    {/* Entire page route outlet */}
      <Outlet />

      <Sidebar visible={visible} position="right"  onHide={() => setVisible(false)}>
        <h2>Sidebar</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Sidebar>
      <SpeedDial showIcon={<IoColorPaletteOutline />} buttonClassName="p-button-outlined" onClick={() => setVisible(true)} style={{ right: 10, bottom: 10, position: 'fixed' }} />
    </>
  )
}

export default App
