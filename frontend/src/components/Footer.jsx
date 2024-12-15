import React from 'react'
import {NavLink} from 'react-router-dom';
function Footer({ collaspe }) {
  return (
      <div className={collaspe ? 'footer_content collapse' : 'footer_content'}>
        <div className="footer_body">
        {/* <p>All Rights Reserved to <NavLink to="" className="footer_copy_right">lachankumar</NavLink></p> */}
        </div>
    </div>
  )
}

export default Footer
