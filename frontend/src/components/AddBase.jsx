import React, { useState } from 'react';
import '../css/AddBase.css';

const AddBase = () => {
  const [image, setImage] = useState(null);
  const [baseDetails, setBaseDetails] = useState({
    name: "",
    // image: "",
    category: "sl_dishes",
    m_type: "rice",
    reg_price: "",
    full_price: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!baseDetails.name.trim()) {
      errors.name = "Base title is required";
      isValid = false;
    }

    // if (!image) {
    //   errors.image = "Image is required";
    //   isValid = false;
    // }

    if (!baseDetails.reg_price.trim()) {
      errors.reg_price = "Regular price is required";
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(baseDetails.reg_price)) {
      errors.reg_price = "Regular price must be a valid number";
      isValid = false;
    }

    if (!baseDetails.full_price.trim()) {
      errors.full_price = "Full price is required";
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(baseDetails.full_price)) {
      errors.full_price = "Full price must be a valid number";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setBaseDetails({ ...baseDetails, [e.target.name]: e.target.value });
  };

  const Add_Base = async () => {
    if (!validateForm()) {
      return;
    }

    let formData = new FormData();
    formData.append('base', image);

    try {
      const uploadResponse = await fetch('http://localhost:3500/kitchenBase/addbase', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        const updatedBaseDetails = { ...baseDetails, image: uploadData.image_url };

        const addBaseResponse = await fetch('http://localhost:3500/kitchenBase/addbase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBaseDetails),
        });

        const addBaseData = await addBaseResponse.json();

        if (addBaseData.success) {
          alert("Base Added");
        } else {
          alert("Failed to add base");
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='add-base'>
      <div className="addbase-itemfield">
        <p>Base title</p>
        <input value={baseDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'/>
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div className="addbase-itemfield">
        <p>Base Category</p>
        <select value={baseDetails.category} onChange={changeHandler} name="category" className='add-base-selector'>
          <option value="sl_dishes">Sri Lankan Dishes</option>
          <option value="bakery_items">Bakery Items</option>
          <option value="beverages">Beverages</option>
        </select>
      </div>
      {baseDetails.category === 'sl_dishes' && (
        <div className="addbase-itemfield">
          <p>Base Type</p>
          <select value={baseDetails.type} onChange={changeHandler} name="m_type" className='add-base-selector'>
            <option value="rice">Rice</option>
            <option value="others">Others</option>
          </select>
        </div>
      )}
      {(baseDetails.category === 'sl_dishes' || baseDetails.category === 'beverages' || baseDetails.category === 'bakery_items') && (
        <div className="addbase-price">
          <div className="addbase-itemfield">
            <p>Regular Price</p>
            <input value={baseDetails.reg_price} onChange={changeHandler} type="text" name='reg_price' placeholder='Type here'/>
            {errors.reg_price && <span className="error">{errors.reg_price}</span>}
          </div>
          <div className="addbase-itemfield">
            <p>Full Price</p>
            <input value={baseDetails.full_price} onChange={changeHandler} type="text" name='full_price' placeholder='Type here'/>
            {errors.full_price && <span className="error">{errors.full_price}</span>}
          </div>
        </div>
      )}

      
      {/* <div className="addbase-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addbase-thumbnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        {errors.image && <span className="error">{errors.image}</span>}
      </div> */}
      <button onClick={Add_Base} className='addbase-btn'>ADD</button>
    </div>
  );
};

export default AddBase;
