import React, { useEffect, useRef, useState } from 'react'
//Formik
import {useFormik} from 'formik';
import * as Yup from 'yup';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';

import {createUpdateGeneralInfo, genealInfomation} from './settingsServices';
function GeneralInfo() {
    //Toast state
    const toast = useRef(null);
    //Data APi State
    const [data, setData] = useState([]);
    const currency = [
    {
        "currency": "Indian Rupee",
        "isoCode": "INR",
        "symbol": "₹",
        "join" : "Indian Rupee - ₹"
        },
    {
        "currency": "Dollar",
        "isoCode": "USD",
        "symbol": "$",
        "join" : "Dollar - $"
    },
    {
        "currency": "Euro",
        "isoCode": "EUR",
        "symbol": "€",
        "join" : "Euro - €"
    },
    {
        "currency": "Pound Sterling",
        "isoCode": "GBP",
        "symbol": "£",
        "join" : "Pound Sterling - £"
    },
    {
        "currency": "Japanese Yen",
        "isoCode": "JPY",
        "symbol": "¥",
        "join" : "Japanese Yen - ¥"
    }
    ];
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes 
const formik = useFormik({
    initialValues : {
        site_name : "",
        footer_copywrite : "",
        currency_symboll : "",
        file : null
    },
    validationSchema : Yup.object({
        file : Yup.mixed().nullable() // No validation for file in edit mode
            .test(
            'fileSize',
            'File size must be less than or equal to 1 MB',
            (value) => !value || value.size <= MAX_FILE_SIZE // Check if the file size is <= 1 MB
            )
            .test(
            'fileType',
            'Only image files are allowed from .jpeg, .png, .gif',
            (value) => !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type) // Check file MIME type
            )
            .test(
                'fileDimensions',
                'Image dimensions must be 476x144 pixels',
                (value) => {
                    if (!value) return true; // Skip validation if no file is uploaded
                    return new Promise((resolve) => {
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(value);
                        img.onload = () => {
                            resolve(img.width === 476 && img.height === 144);
                        };
                        img.onerror = () => resolve(false);
                    });
                }
            )
    }),
    onSubmit : (values)=>{

        insertUpdateData(values);
    }
});
  //File upload use prime react. it use onSelect menthod
  const handleSelect = (event) => {
    const files = event.files[0];
    formik.setFieldValue('file', files);
  };
  //File upload use prime react. it use onRemove method
  const handleRemove = (event) => {
    // Remove the file from Formik's state
    formik.setFieldValue("file", null); // Set Formik's file field to null
  };
  const insertUpdateData = async (values)=>{
    try {
        const result = await createUpdateGeneralInfo(values);
        if (result.success) {
            setData(result.data);
            toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
           
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
        }
    } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
    }
  }

  useEffect(() => {
    const loadData = async () => {
        const result = await genealInfomation();
        if (result.success) {
            setData(result.data);
            formik.setValues({
                site_name: result.data[0]?.site_name || "",
                footer_copywrite: result.data[0]?.footer_copywrite || "",
                currency_symboll: result.data[0]?.currency_symboll || "",
                file: null,
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
        }
    };
    loadData();
}, []);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className="grid">
            <div className='col-12 md:col-6'>
                <div className="flex flex-column gap-2">
                    <label>Site Name</label>
                    <InputText 
                    name = "site_name"
                    onChange={formik.handleChange}
                    onBlur = {formik.onBlur}
                    value = {formik.values.site_name}
                    placeholder='Enter the site name'/>
                </div>
            </div>
            <div className='col-12 md:col-6'>
                <div className="flex flex-column gap-2">
                    <label>Currency Symbol</label>
                    <Dropdown 
                    name ="currency_symboll"
                    onChange={(e)=> formik.setFieldValue('currency_symboll', e.value)}
                    onBlur = {formik.handleBlur}
                    value = {formik.values.currency_symboll}
                    options={currency} optionLabel="join"
                    optionValue='symbol'
                    placeholder="Select a City" className="w-full" />
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Footer Copyright Text</label>
                    <InputText 
                    name ="footer_copywrite"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.footer_copywrite}
                    placeholder='Enter the footer copyright text'/>
                </div>
            </div>
            {/* <div className='col-12 md:col-4'>
                <div className="flex flex-column gap-2">
                    <label>Footer Copyright Text</label>
                    <InputText placeholder='Enter the footer copyright text'/>
                </div>
            </div> */}
            
    
        {
            data.length > 0 && data[0].image ? (
                <div className="col-12 md:col-5">
                    <div className="default_image_title">Default Image</div>
                    <Image src={data[0].image} alt="Image" preview className="default_image_logo" />
                </div>
            ) : null
        }
            <div className="col-12 md:col-12">
            <label>Company Logo (476 X 144)</label>
             <FileUpload
                name="file"
                customUpload
                onSelect={handleSelect}
                onRemove={handleRemove}
                chooseLabel='Select Company logo file' // Custom label for "Choose"
                className={`w-full fileUploadFile ${formik.touched.file && formik.errors.file ? 'error' : ''}`}
                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
            />
            {formik.touched.file && formik.errors.file ? (
                <small style={{ color: '#e24c4c' }}>
                {formik.errors.file}
                </small>
            ) : null}
            
            </div>
        </div>
        <div className="flex md:justify-content-end gap-2 pt-3">
            <Button type="button" label="Clear" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { formik.resetForm() }} />
            <Button type="submit" label='Save' className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
        </div>
    </form>
    <Toast ref={toast} />
    </>
  )
}

export default GeneralInfo
