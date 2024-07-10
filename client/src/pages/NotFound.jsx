import React from 'react'
import image from '../constants/Images/dance-dancing-duck.gif'
const NotFound = () => {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '3rem'
    }}>
      <img src={image} alt="NOT FOUND" width={400}/>
      <h1 style={{
        textAlign: 'center'
      }}>ERROR 404: PAGE NOT FOUND</h1>
    </div>
  )
}

export default NotFound
