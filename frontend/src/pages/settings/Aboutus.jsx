import React, {useEffect, useRef} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
//Primereact

import { Editor } from 'primereact/editor';       
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
        
import axiosInstance from '../../config/axiosConfig';
import {createUpdateAboutus} from './settingsServices';

function Aboutus() {
    const toast = useRef(null);

    const formik = useFormik({
        initialValues : {
            about_content : "",
        },
        validationSchema : Yup.object({
            //about_content : Yup.string().nullable(),

        }),
        onSubmit : (values)=>{
            insertRecord(values);
        }
    });
    const insertRecord = async (getvalue)=>{
        try
        {
            const result = await createUpdateAboutus(getvalue);
            if(result.success)
            {
              
                toast.current.show({severity:'success', summary: 'Success', detail:result.message});
                getAboutuscontent();
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }
    const getAboutuscontent = async ()=>{
        try
        {
            const result = await axiosInstance.get('/aboutusinfo');
            if(result.data.success)
            {
                const data = result.data.data[0];
                formik.setValues({
                    about_content: data.about_content || "",
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
        getAboutuscontent();
    },[]);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className='grid'>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>About Us</label>
                    <Editor 
                    name ="about_content"
                    onTextChange={(e)=>formik.setFieldValue('about_content', e.htmlValue)}
                    onBlur={formik.handleBlur}
                    value = {formik.values.about_content}
                    style={{ height: '280px' }}/>
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

export default Aboutus
