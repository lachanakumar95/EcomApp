import React, { useState, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
//React Icons
import { CiMenuFries } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineLightMode } from "react-icons/md";
import { IoClose } from "react-icons/io5";
//Logo
import logo from '../assets/logo.png';
//profile image
import profile from '../assets/profile.png';
//React router dom
import { useNavigate } from 'react-router-dom';
//Primeract menu
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { classNames } from 'primereact/utils';
//Cookies-js
import Cookies from 'js-cookie';
//Crypto Js
import CryptoJS from 'crypto-js';
//JWT
import { jwtDecode } from "jwt-decode";
import axiosInstance from '../config/axiosConfig';

function Navbar({ sidebar }) {
    const [dblogo, setDbLogo] = useState();
    const isMobile = useMediaQuery({ query: '(max-width: 820px)' });
    const [collaspe, setcollapse] = useState(true);
    const [collaspeicon, setcollaspeicon] = useState(true);

    const navigate = useNavigate();

    //Get Cookies
    const token = Cookies.get('X_AUTH_TOKEN');
    const secretKey = "Iamkingofecommerceapp@852456159";
    const decode = jwtDecode(token);

    //Admin Details
    const [adminDetails, setadminDetails] = useState({});
    //Dropdown Menu
    const menuBottom = useRef(null);
    const items = [
        {
            template: (item, options) => {
                return (
                    <button onClick={(e) => options.onClick(e)} className={classNames(options.className, 'w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround')}>
                        <Avatar image={profile} className="mr-2" shape="circle" />
                        <div className="flex flex-column align">
                            <span className="font-bold" style={{ fontSize: '12px' }}>{adminDetails.email}</span>
                            <span className="text-sm">{adminDetails.role}</span>
                        </div>
                    </button>
                );
            }
        },
        {
            separator: true
        },

        {
            label: 'Change Password',
            icon: 'pi pi-key',
            url: '/unstyled'
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                navigate('/');
                logout();
            }
        }
    ];


    const collaspeMenu = () => {
        setcollapse(prevState => !prevState)
        setcollaspeicon(prevState => !prevState)
        sidebar(collaspe);
    }
    const logout = () => {
        Cookies.remove('X_AUTH_TOKEN');
    }
    useEffect(() => {
        if (isMobile) {
            setcollapse(false);
            setcollaspeicon(true);
        }
        else {
            setcollaspeicon(true);
        }
        if (token) {

            try {
                setadminDetails({
                    id: CryptoJS.AES.decrypt(decode.id, secretKey).toString(CryptoJS.enc.Utf8),
                    email: CryptoJS.AES.decrypt(decode.email, secretKey).toString(CryptoJS.enc.Utf8),
                    role: CryptoJS.AES.decrypt(decode.role, secretKey).toString(CryptoJS.enc.Utf8),
                });
            } catch (error) {
                console.error("Failed to decrypt admin details:", error);
            }
        }

    }, [isMobile]);

    useEffect(()=>{
        const getLogoFromDb = async ()=>{
            try
            {
                const result = await axiosInstance.get('/generalinfo');
                setDbLogo(result.data.data[0]);
            }
            catch(err)
            {
                console.log("Error fecting :", err);
            }
        }
        getLogoFromDb();
    },[]);

    useEffect(() => {
        const siteName = dblogo?.site_name || "Ecommerce Application";
        document.title = siteName;
    }, [dblogo]);

    return (
        <>
            {/* navbar */}
            <nav className="navbar">
                <div className="logo_item">
                    <div className="menu_icon" onClick={collaspeMenu}>
                        {collaspeicon ? <CiMenuFries /> : <IoClose />}
                    </div>

                    <img src={dblogo?.image? dblogo?.image : logo} alt="logo" className="logo" />
                </div>
                <div className="search_bar">
                    <input type="text" placeholder="Search" />
                </div>
                <div className="navbar_content">
                    <i className="bi bi-grid" />
                    <MdOutlineLightMode style={{ fontSize: '22px' }} />
                    <IoMdNotificationsOutline style={{ fontSize: '22px' }} />
                    <img src={profile} alt=""
                        className="profile"
                        onClick={(event) => menuBottom.current.toggle(event)}
                        style={{cursor : 'pointer'}}
                    />
                    <Menu popup popupAlignment="bottom" model={items} ref={menuBottom} />
                </div>
            </nav>

        </>
    )
}

export default Navbar
