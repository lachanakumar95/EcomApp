import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {useMenuItems} from './Menuitem';

//React Icons
import { IoIosArrowForward } from "react-icons/io";


function Sidebar({ collaspe }) {
    const menuItem =  useMenuItems();
    const location = useLocation();
    const [expandedIndex, setExpandedIndex] = useState(null); // Track which submenu is expanded
    const toggleMenu = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Toggle submenu
    };

    const closeSubmenu = () => {
        setExpandedIndex(null); // Collapse any open submenu
    };

    const handleMouseEnter = () => {
        let sidbarOpen = document.querySelector('.sidebar');
        let bodyOpen = document.querySelector('.body_content');
        let FooterOpen = document.querySelector('.footer_content ');
        if (collaspe) {
            if (sidbarOpen.classList.contains('close')) {
                sidbarOpen.classList.remove('close');
                bodyOpen.classList.remove('collapse');
                FooterOpen.classList.remove('collapse');
            }
            else {
                sidbarOpen.classList.add('close');
                bodyOpen.classList.add('collapse');
                FooterOpen.classList.add('collapse');
            }
        }
    };

    const handleMouseLeave = () => {
        let sidbarOpen = document.querySelector('.sidebar');
        let bodyOpen = document.querySelector('.body_content');
        let FooterOpen = document.querySelector('.footer_content ');
        if (collaspe) {
            if (sidbarOpen.classList.contains('close')) {
                sidbarOpen.classList.remove('close');
                bodyOpen.classList.remove('collapse');
                FooterOpen.classList.remove('collapse');
            }
            else {
                sidbarOpen.classList.add('close');
                bodyOpen.classList.add('collapse');
                FooterOpen.classList.add('collapse');
            }
        }

    };
    

    useEffect(() => {
        // Automatically expand the submenu if any subitem matches the current URL
        const activePage = location.pathname.split('/');
        const activeIndex = menuItem.findIndex(item =>
            item.subitem && item.subitem.some(sitem => sitem.link === `/${activePage[1]}`)
        );
        setExpandedIndex(activeIndex !== -1 ? activeIndex : null);
    }, [location, menuItem]);

    return (
        <>
            <nav className={collaspe ? 'sidebar close' : 'sidebar'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="menu_content">
                    <ul className="menu_items">

                        <div className="menu_title" />
                        {menuItem.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.subitem ? (
                                    <li className="item" key={`item-${index}`}>
                                        <div
                                            className={`nav_link submenu_item ${expandedIndex === index ? "show_submenu" : ""}`}
                                            onClick={() => toggleMenu(index)}
                                        >
                                            <span className="navlink_icon active_link">
                                                {item.icon}
                                            </span>
                                            <span className="navlink active_link">{item.title}</span>
                                            <IoIosArrowForward className='arrow-left active_link' />
                                        </div>
                                        <ul className={`menu_items submenu ${expandedIndex === index ? "show" : ""}`}>
                                            {item.subitem.map((sitem, sindex) => (
                                                <li key={`subitem-${index}-${sindex}`}>
                                                    <NavLink
                                                        to={sitem.link}
                                                        className="nav_link sublink"
                                                        onClick={(e) => e.stopPropagation()} // Prevents submenu click from toggling parent menu
                                                    >
                                                        <span className="navlink_icon">
                                                            {sitem.icon}
                                                        </span>
                                                        <span className="navlink_sub_title">{sitem.title}</span>
                                                        {/* {sitem.title} */}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ) : (
                                    <li className="item" key={`item-${index}`}>
                                        <NavLink
                                            to={item.link}
                                            className="nav_link"
                                            onClick={closeSubmenu} // Close any expanded submenu
                                        >
                                            <span className="navlink_icon">
                                                {item.icon}
                                            </span>
                                            <span className="navlink">{item.title}</span>
                                        </NavLink>
                                    </li>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>

                </div>
            </nav>
         
        </>
    );
}

export default Sidebar;
