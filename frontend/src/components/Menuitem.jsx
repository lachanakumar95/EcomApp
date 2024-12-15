import React, { useState, useEffect } from "react";

import { LuLayoutDashboard } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { TbCategoryPlus } from "react-icons/tb";
import { PiBuildingOffice } from "react-icons/pi";
import { LuTags } from "react-icons/lu";
import { IoLayersOutline } from "react-icons/io5";
import { BsLayers } from "react-icons/bs";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { FaRegClone } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { CiBoxList } from "react-icons/ci";
import { MdOutlineSettingsSystemDaydream } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import { TfiGift } from "react-icons/tfi";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { GrContact } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaPercentageSolid } from "react-icons/lia";

//Cookies-js
import Cookies from 'js-cookie';
//Crypto Js
import CryptoJS from 'crypto-js';
//JWT
import { jwtDecode } from "jwt-decode";

export const useMenuItems = () => {
    const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {
        const token = Cookies.get('X_AUTH_TOKEN');
        let setadminDetails = {};
        if (token) {
            const secretKey = "Iamkingofecommerceapp@852456159";
            const decode = jwtDecode(token);
            setadminDetails = {
                id: CryptoJS.AES.decrypt(decode.id, secretKey).toString(CryptoJS.enc.Utf8),
                email: CryptoJS.AES.decrypt(decode.email, secretKey).toString(CryptoJS.enc.Utf8),
                role: CryptoJS.AES.decrypt(decode.role, secretKey).toString(CryptoJS.enc.Utf8),
            };

        }
        if (setadminDetails.role === "admin") {
            setMenuItems([
                {
                    title: 'Dashboard',
                    icon: <LuLayoutDashboard />,
                    link: '/dashboard'
                },
                {
                    title: 'User Manage',
                    icon: <LuUsers />,
                    link: '/user_manage'
                },
                {
                    title: 'Category Manage',
                    icon: <TbCategoryPlus />,
                    subitem: [
                        {
                            title: 'Categories',
                            icon: <IoLayersOutline />,
                            link: '/categories'
                        },
                        {
                            title: 'Sub Categories',
                            icon: <BsLayers />,
                            link: '/sub-categories'
                        }
                    ]
                },
                {
                    title: 'Brand Manage',
                    icon: <PiBuildingOffice />,
                    link: '/brands'
                },
                {
                    title: 'Tag Manage',
                    icon: <LuTags />,
                    link: '/tags'
                },
                {
                    title: 'Attribute',
                    icon: <TfiLayoutListThumb />,
                    link: '/attributes'
                },
                {
                    title: 'Tax & Vat',
                    icon: <LiaPercentageSolid />,
                    link: '/tax'
                },
                {
                    title: 'Product Manage',
                    icon: <TbCategoryPlus />,
                    subitem: [
                        {
                            title: 'Products',
                            icon: <FaRegClone />,
                            link: '/products'
                        },
                        {
                            title: 'Stock Management',
                            icon: <HiOutlineDocumentReport />,
                            link: '/stock_management'
                        }
                    ]
                },
                {
                    title: 'Order Manage',
                    icon: <TfiShoppingCartFull />,
                    subitem: [
                        {
                            title: 'Orders',
                            icon: <CiBoxList />,
                            link: '/orders'
                        }
                    ]
                },
                {
                    title: 'Banner Manage',
                    icon: <MdOutlineSettingsSystemDaydream />,
                    subitem: [
                        {
                            title: 'Banner Images',
                            icon: <IoImageOutline />,
                            link: '/banners'
                        },
                        {
                            title: 'Offer Banner',
                            icon: <BiSolidOffer />,
                            link: '/offer_banner'
                        }
                    ]
                },
                {
                    title: 'Offer Manage',
                    icon: <TfiGift />,
                    subitem: [
                        {
                            title: 'Promo Code',
                            icon: <MdOutlineConfirmationNumber />,
                            link: '/banners'
                        }
                    ]
                },
                {
                    title: 'Contacts',
                    icon: <GrContact />,
                    link: '/contacts'
                },
                {
                    title: 'Settings',
                    icon: <IoSettingsOutline />,
                    link: '/settings'
                },

            ]);
        }
        else if (setadminDetails.role === "staff") {
            setMenuItems([

                {
                    title: 'Tag Manage',
                    icon: <LuTags />,
                    link: '/tags'
                },
                {
                    title: 'Product Manage',
                    icon: <TbCategoryPlus />,
                    subitem: [
                        {
                            title: 'Attribute',
                            icon: <TfiLayoutListThumb />,
                            link: '/attributes'
                        },
                        {
                            title: 'Products',
                            icon: <FaRegClone />,
                            link: '/products'
                        },
                        {
                            title: 'Stock Management',
                            icon: <HiOutlineDocumentReport />,
                            link: '/stock_management'
                        }
                    ]
                },
                {
                    title: 'Order Manage',
                    icon: <TfiShoppingCartFull />,
                    subitem: [
                        {
                            title: 'Orders',
                            icon: <CiBoxList />,
                            link: '/orders'
                        }
                    ]
                },
                {
                    title: 'Banner Manage',
                    icon: <MdOutlineSettingsSystemDaydream />,
                    subitem: [
                        {
                            title: 'Banner Images',
                            icon: <IoImageOutline />,
                            link: '/banners'
                        },
                        {
                            title: 'Offer Banner',
                            icon: <BiSolidOffer />,
                            link: '/offer_banner'
                        }
                    ]
                },
                {
                    title: 'Offer Manage',
                    icon: <TfiGift />,
                    subitem: [
                        {
                            title: 'Promo Code',
                            icon: <MdOutlineConfirmationNumber />,
                            link: '/banners'
                        }
                    ]
                },
                {
                    title: 'Contacts',
                    icon: <GrContact />,
                    link: '/contacts'
                },
                {
                    title: 'Settings',
                    icon: <IoSettingsOutline />,
                    link: '/settings'
                },

            ]);
        }
    },[]);
    return menuItems;
}
