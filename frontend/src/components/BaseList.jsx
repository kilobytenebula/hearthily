import React, { useEffect, useState } from 'react'
import '../css/baseList.css' 
import cross_icon from '../icons/cross_icon.png'

const BaseList = () => {
  
  const [allbases, setAllBases] =useState([]);

  const fetchInfo= async () =>{
    await fetch('http://localhost:3500/kitchenBase/allbases')
   .then((res)=>res.json())
   .then((data)=>{setAllBases(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_base = async (id) =>{
    await fetch('http://localhost:3500/kitchenBase/removebase',{
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:id})
    })
    await fetchInfo();
  }


  return (
    <div className='list-base'>
       <h1> All Bases list</h1>
      <div className="listbase-format-main">
        <p> Bases </p>
        <p> Title</p>
        <p> Category</p>
        <p> Type </p>
        <p> Regular Price</p>
        <p> Full Price</p>
        <p> Remove </p>
      </div>
      <div className="listbase-allbases">
        <hr/>
           
        {allbases.map((base,index)=>{
              return<>
              <div key={index} className="listbase-format-main listbase-format">
                  <img src={base.image} alt="" className="listbase-base-icon" />
                  <p> {base.base_name}</p>
                  <p> {base.category} </p>
                  <p> {base.base_type} </p>
                  <p>LKR{base.reg_price} </p>
                  <p>LKR {base.full_price} </p>
                  <img onClick={()=>{remove_base(base.id)}} className='listbase-remove-icon' src={cross_icon} alt="" />
              </div>
              <hr/></>
          })}
      </div>
    </div>
  )
}

export default BaseList