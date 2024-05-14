import React, { useEffect, useState } from 'react'
import '../css/baseList.css' 
import {Link, useParams} from 'react-router-dom'
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
    // <div className='list-base'>
    //    <h1> All Bases list</h1>
    //    <button className="listbase-add-button"> Add Base</button>
    //   <div className="listbase-format-main">
    //     <p> Bases </p>
    //     <p> Title</p>
    //     <p> Category</p>
    //     <p> Type </p>
    //     <p> Regular Price</p>
    //     <p> Full Price</p>
    //     <p> Remove </p>
    //   </div>
    //   <div className="listbase-allbases">
    //     <hr/>
           
    //     {allbases.map((base,index)=>{
    //           return<>
    //           <div key={index} className="listbase-format-main listbase-format">
    //               <img src={base.image} alt="" className="listbase-base-icon" />
    //               <p> {base.base_name}</p>
    //               <p> {base.category} </p>
    //               <p> {base.base_type} </p>
    //               <p>LKR{base.reg_price} </p>
    //               <p>LKR {base.full_price} </p>
    //               <img onClick={()=>{remove_base(base.id)}} className='listbase-remove-icon' src={cross_icon} alt="" />
    //           </div>
    //           <hr/></>
    //       })}
    //   </div>
    // </div>
    <div className='list-base'>
      <div className="base-list-title-bar">
                <div className="base-list-heading">Base List</div>
                <div>
                    <Link to="/add-base" className="requestedRefunds">Add a Base</Link>
                </div>
            </div>
            <div className="base-list-container">
                <div class="ktn-Title"> Title</div>
                <div class="ktn-Category"> Category</div>
                <div class="ktn-Type"> Type </div>
                <div class="ktn-RegularPrice"> Regular Price</div>
                <div class="ktn-FullPrice"> Full Price</div>
                <div class="ktn-Remove"> Remove </div>

            
            </div>
            
                {allbases.map((base, index) => (
                    <div key={index} className="base-list-item-container">
                        <div className="ktn-Title">{base.name}</div>
                        <div className="ktn-Category">{base.category}</div>
                        <div className="ktn-Type">{base.m_type}</div>
                        <div className="ktn-RegularPrice">LKR {base.reg_price}</div>
                        <div className="ktn-FullPrice">LKR {base.full_price}</div>
                        <div className="ktn-Remove">
                            <img onClick={() => { remove_base(base.id) }} className='listbase-remove-icon' src={cross_icon} alt="" />
                        </div>
                    </div>
                ))}



      </div>
  )
}

export default BaseList