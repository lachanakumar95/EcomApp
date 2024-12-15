import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';

function ProtectRouter()
{
    if (!Cookies.get('X_AUTH_TOKEN')) {
        return <Navigate to="/" replace />;
      }    
    return <Outlet/>
}

export default ProtectRouter;