import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
const Layout =  ({children}) => {
    const isNavbarVisible = true;
    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    });
    return (
        <>
            <Navbar/>
            <Sidebar/>
            <div id="content" className={!isNavbarVisible ? "active" : ""}>
                {children}
            </div>
        </>
    )
}

export default withRouter(Layout)