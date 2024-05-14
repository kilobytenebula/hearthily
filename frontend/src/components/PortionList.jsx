import React, { useEffect, useState } from 'react'
import '../css/portionList.css' 
import cross_icon from '../icons/cross_icon.png'
import {Link, useParams} from 'react-router-dom'

const ListPortion = () => {

  const [allportions, setAllPortions] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:3500/kitchenPortion/allportions')
      .then((res) => res.json())
      .then((data) => { setAllPortions(data) });
  }
  useEffect(() => {
    fetchInfo();
  }, [])

  const remove_portion = async (id) =>{
    await fetch('http://localhost:3500/kitchenPortion/removeportion',{
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
    // <div className='list-portion'>
    //   <h1> All Portions List</h1>
    //   <div className="listportion-format-main">
    //     <p> Portions </p>
    //     <p> Title</p>
    //     <p> Type </p>
    //     <p> Price</p>
    //     <p> Remove </p>
    //   </div>
    //   <div className="listportion-allportions">
    //     <hr/>
          
    //     {allportions.map((portion,index)=>{
    //           return <>
    //           <div key={index} className="listportion-format-main listportion-format">
    //               <img src={portion.image} alt="" className="listportion-portion-icon" />
    //               <p> {portion.name}</p>
    //               <p> {portion.p_type} </p>
    //               <p>LKR{portion.price} </p>
                  
    //               <img onClick={()=>{remove_portion(portion.id)}} className='listportion-remove-icon' src={cross_icon} alt="" />
    //           </div>
    //           <hr/></>
    //       })}
    //   </div>  
    // </div>

    <div className='list-portion'>
      <div className="base-list-title-bar">
                <div className="base-list-heading">Portion List</div>
                <div>
                    <Link to="/add-portion" className="requestedRefunds">Add a Portion</Link>
                </div>
            </div>

            <div className="portion-list-container">
                
                <div class="ktn-p-titile"> Title</div>
                <div class="ktn-p-Type"> Type </div>
                <div class="ktn-p-price">Price</div>
                <div class="ktn-p-Remove"> Remove </div>
            
            </div>
            {allportions.map((portion,index)=>{
               return <>
               <div key={index} className="base-list-item-container">
                   <div class="ktn-p-titile"> {portion.name}</div>
                   <div class="ktn-p-Type"> {portion.p_type} </div>
                   <div class="ktn-p-price">LKR{portion.price} </div>
                  
                   <img onClick={()=>{remove_portion(portion.id)}} className='listportion-remove-icon' src={cross_icon} alt="" />
               </div>
              </>
           })}
    </div>
   )
}

export default ListPortion
