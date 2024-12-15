import React, {useEffect, useRef} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Primereact
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
        
import axiosInstance from '../../config/axiosConfig';
import {createUpdateLoginConfig} from './settingsServices';

function LoginConfig() {
    const toast = useRef(null);

    const formik = useFormik({
        initialValues : {
            google_clientID : "",
            google_clientSecret : "",
        },
        validationSchema : Yup.object({
            // meta_title : Yup.string().nullable(),
            // meta_description : Yup.string().nullable(),

        }),
        onSubmit : (values)=>{
            insertRecord(values);
        }
    });
    const insertRecord = async (getvalue)=>{
        try
        {
            const result = await createUpdateLoginConfig(getvalue);
            if(result.success)
            {
              
                toast.current.show({severity:'success', summary: 'Success', detail:result.message});
                getLoginconfig();
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }
    const getLoginconfig = async ()=>{
        try
        {
            const result = await axiosInstance.get('/loginconfig');
            if(result.data.success)
            {
                const data = result.data.data[0];
                console.log(data);
                formik.setValues({
                    google_clientID: data.google_clientId || "",
                    google_clientSecret: data.google_clientSecret || "",
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
        getLoginconfig();
    },[]);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className='grid'>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Google Client ID</label>
                    <InputText
                    name ="google_clientID"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value = {formik.values.google_clientID}
                    placeholder='Enter the google client ID'/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Google Client Secret Key</label>
                    <InputText
                    name ="google_clientSecret"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value = {formik.values.google_clientSecret}
                    placeholder='Enter the google client Secret'/>
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

export default LoginConfig
