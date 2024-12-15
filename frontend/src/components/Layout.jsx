import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import Body from './Body';
import Footer from './Footer';
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
    const [collaspe, setcollaspe] = useState(false);
    const collaspeSidebar = (getvalue) => {
        setcollaspe(getvalue);
    }
    const isMobile = useMediaQuery({ query: '(max-width: 820px)' });
    useEffect(() => {
        if (isMobile) {
            setcollaspe(true);
        }
        else
        {
            setcollaspe(false);
        }
    }, [isMobile]);
    return (
        <>
            <Navbar sidebar={collaspeSidebar} />
            <Sidebar collaspe={collaspe} />
            {/* Show backdrop only on mobile and when sidebar is not collapsed */}
            {isMobile && !collaspe && (
                <div className="sidebar-backdrop"></div>
            )}

            <Body collaspe={collaspe} />
            {/* <Footer collaspe={collaspe} /> */}
        </>
    )
}

export default Layout
