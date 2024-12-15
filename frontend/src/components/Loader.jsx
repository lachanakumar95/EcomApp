import React, {useEffect, useState} from 'react';
import axiosInstance from '../config/axiosConfig';
//Logo
import logo from '../assets/logo.png';
import loader from '../assets/loader.gif';

function Loader() {
  const [dblogo, setDbLogo] = useState();
  useEffect(()=>{
    const getLogoFromDb = async ()=>{
        try
        {
            const result = await axiosInstance.get('/generalinfo');
            setDbLogo(result.data.data[0]);
            console.log("Loader", result)
        }
        catch(err)
        {
            console.log("Error fecting :", err);
        }
    }
    getLogoFromDb();
  },[]);
  return (
    <>
        <div className="pageloader">
            <img src={dblogo?.image || logo} alt="logo" style={{width : '250px'}}/>
            <img src={loader} alt="Loader"/>
              <p>Please wait we are preparing awesome things to preview...</p>
        </div>
    </>
  )
}

export default Loader
