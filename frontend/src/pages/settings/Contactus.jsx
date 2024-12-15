import React, {useEffect, useRef} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Primereact
import { InputText } from 'primereact/inputtext';
import { InputMask } from "primereact/inputmask";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
        
import axiosInstance from '../../config/axiosConfig';
import {createUpdateContactus} from './settingsServices';

function Contactus() {
    const toast = useRef(null);

    const formik = useFormik({
        initialValues : {
            contact_email : "",
            contact_no : "",
            facebook_link : "",
            instagram_link : "",
            google_plus_link : "",
            twitter_link : "",
            youtube_link : ""
        },
        validationSchema : Yup.object({
            //mobile : Yup.string().nullable().matches(/^\d{10}$/, "Allow only 10 digits number"), // Fix mobile validation,
            contact_email : Yup.string().nullable().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
        }),
        onSubmit : (values)=>{
            insertRecord(values);
        }
    });
    const insertRecord = async (getvalue)=>{
        try
        {
            const result = await createUpdateContactus(getvalue);
            if(result.success)
            {
              
                toast.current.show({severity:'success', summary: 'Success', detail:result.message});
                getContactus();
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }
    const getContactus = async ()=>{
        try
        {
            const result = await axiosInstance.get('/contactinfo');
            if(result.data.success)
            {
                const data = result.data.data[0];
                formik.setValues({
                    contact_email: data.contact_email || "",
                    contact_no: data.contact_no || "",
                    facebook_link: data.facebook_link || "",
                    instagram_link: data.instagram_link || "",
                    google_plus_link: data.google_plus_link || "",
                    twitter_link: data.twitter_link || "",
                    youtube_link: data.youtube_link || ""
                });
            }
           else
           {
            
            toast.current.show({severity:'error', summary: 'Error', detail:result.data.message});
           }
          
        }
        catch(err)
        {
            console.error("Fecting error :", err);
        }
    }
    useEffect(()=>{
        getContactus();
    },[]);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className='grid'>
        <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Email Address</label>
                    <InputText 
                    name="contact_email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.contact_email}
                    placeholder='Enter the email address'/>
                    {formik.touched.contact_email && formik.errors.contact_email ? (
                        <small style={{ color: '#e24c4c' }}>
                        {formik.errors.contact_email}
                        </small>
                    ) : null}
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Contact Mobile Number</label>
                    <InputMask
                        name="contact_no"
                        onChange={(e) => formik.setFieldValue("contact_no", e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                        mask="99999-99999"
                        placeholder="Enter the contact mobile number"
                    />
                     {formik.touched.contact_no && formik.errors.contact_no ? (
                        <small style={{ color: '#e24c4c' }}>
                        {formik.errors.contact_no}
                        </small>
                    ) : null}
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Facebook Link</label>
                    <InputText 
                    name="facebook_link"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.facebook_link}
                    placeholder='Enter the facebook link'/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Instagram Link</label>
                    <InputText 
                    name="instagram_link"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.instagram_link}
                    placeholder='Enter the instagram link'/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Google Plus Link</label>
                    <InputText 
                    name="google_plus_link"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.google_plus_link}
                    placeholder='Enter the google plus link'/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Twitter Link</label>
                    <InputText 
                    name="twitter_link"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.twitter_link}
                    placeholder='Enter the facebook link'/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Youtube Link</label>
                    <InputText 
                    name="youtube_link"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.youtube_link}
                    placeholder='Enter the youtibe link'/>
                </div>
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

export default Contactus
