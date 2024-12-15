import React, {useEffect, useRef} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Primereact

import { Editor } from 'primereact/editor';       
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
        
import axiosInstance from '../../config/axiosConfig';
import {createUpdatePolicy} from './settingsServices';

function Policy() {
    const toast = useRef(null);

    const formik = useFormik({
        initialValues : {
            terms_condition : "",
            shipping_policy : "",
            privacy_policy : "",
            return_policy : "",
        },
        validationSchema : Yup.object({
            //terms_condition : Yup.string().required(),

        }),
        onSubmit : (values)=>{
            insertRecord(values);
        }
    });
    const insertRecord = async (getvalue)=>{
        try
        {
            const result = await createUpdatePolicy(getvalue);
            if(result.success)
            {
              
                toast.current.show({severity:'success', summary: 'Success', detail:result.message});
                getPolicycontent();
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }
    const getPolicycontent = async ()=>{
        try
        {
            const result = await axiosInstance.get('/policymangement');
            if(result.data.success)
            {
                const data = result.data.data[0];
                formik.setValues({
                    terms_condition: data.terms_condition || "",
                    shipping_policy: data.shipping_policy || "",
                    privacy_policy: data.privacy_policy || "",
                    return_policy: data.return_policy || "",
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
        getPolicycontent();
    },[]);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className='grid'>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Terms & Conditions</label>
                    <Editor 
                    name ="terms_condition"
                    onTextChange={(e)=>formik.setFieldValue('terms_condition', e.htmlValue)}
                    onBlur={formik.handleBlur}
                    value = {formik.values.terms_condition}
                    style={{ height: '180px' }}/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Shipping Policy</label>
                    <Editor 
                    name ="shipping_policy"
                    onTextChange={(e)=>formik.setFieldValue('shipping_policy', e.htmlValue)}
                    onBlur={formik.handleBlur}
                    value = {formik.values.shipping_policy}
                    style={{ height: '180px' }}/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Privacy Policy</label>
                    <Editor 
                    name ="privacy_policy"
                    onTextChange={(e)=>formik.setFieldValue('privacy_policy', e.htmlValue)}
                    onBlur={formik.handleBlur}
                    value = {formik.values.privacy_policy}
                    style={{ height: '180px' }}/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Return Policy</label>
                    <Editor 
                    name ="return_policy"
                    onTextChange={(e)=>formik.setFieldValue('return_policy', e.htmlValue)}
                    onBlur={formik.handleBlur}
                    value = {formik.values.return_policy}
                    style={{ height: '180px' }}/>
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

export default Policy
