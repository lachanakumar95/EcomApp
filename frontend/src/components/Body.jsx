import React from 'react'
import { Outlet } from 'react-router-dom'

function Body({collaspe}) {
  return (
      <div className={collaspe ? 'body_content collapse' : 'body_content'}>
        <Outlet/>
    </div>
  )
}

export default Body
