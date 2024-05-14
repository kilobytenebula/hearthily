import React, { useState } from 'react';
import '../css/AddPortion.css';


const AddPortion = () => {
  const [image, setImage] = useState(null);
  const [portionDetails, setPortionDetails] = useState({
    name: "",
    p_type: "rice",
    price: ""
  });
  const [error, setError] = useState("");


  const changeHandler = (e) => {
    setPortionDetails({ ...portionDetails, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (!portionDetails.name.match(/^[a-zA-Z\s]+$/)) {
      setError("Please enter a valid name (only letters and spaces).");
      return false;
    }
    if (isNaN(parseFloat(portionDetails.price))) {
      setError("Please enter a valid price.");
      return false;
    }
  
    setError("");
    return true;
  };

  const Add_Portion = async () => {
    if (!validateInputs()) return;

    console.log(portionDetails);
    let responseData;
    let portion = { ...portionDetails };

    let formData = new FormData();
    formData.append('portion', image);

    // try {
    //   const uploadResponse = await fetch('http://localhost:3500/kitchenPortion/addportion', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   const uploadData = await uploadResponse.json();
    //   responseData = uploadData;
    // } catch (error) {
    //   console.error("Error uploading image:", error);
    //   return;
    // }

    if (true) {
      console.log(portion);
      try {
        const addPortionResponse = await fetch('http://localhost:3500/kitchenPortion/addportion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(portion),
        });
        const addPortionData = await addPortionResponse.json();
        if (addPortionData.success) {
          alert("Portion Added");
        } else {
          alert("Failed to add portion");
        }
      } catch (error) {
        console.error("Error adding portion:", error);
        alert("Failed to add portion");
      }
    } else {
      alert("Failed to upload image");
    }
  };

  return (
    <div className='add-portion'>
      {error && <p className="error-message">{error}</p>}
      <div className="addportion-itemfield">
        <p>Portion title</p>
        <input value={portionDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addportion-itemfield">
        <p>Portion Type</p>
        <select value={portionDetails.p_type} onChange={changeHandler} name="p_type" className='add-portion-selector'>
          <option value="rice">Rice</option>
          <option value="others">Others</option>
        </select>
      </div>
      <div className="addportion-price">
        <div className="addportion-itemfield">
          <p>Price</p>
          <input value={portionDetails.price} onChange={changeHandler} type="text" name='price' placeholder='Type here' />
        </div>
      </div>
      {/* <div className="addportion-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addportion-thumbnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div> */}
      <button onClick={Add_Portion} className='addportion-btn'>ADD</button>
    </div>
  );
};

export default AddPortion;
