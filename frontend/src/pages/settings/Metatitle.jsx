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
import {createUpdateMetaContent} from './settingsServices';

function Metatitle() {
    const toast = useRef(null);

    const formik = useFormik({
        initialValues : {
            meta_title : "",
            meta_description : "",
        },
        validationSchema : Yup.object({
            meta_title : Yup.string().nullable(),
            meta_description : Yup.string().nullable(),

        }),
        onSubmit : (values)=>{
            insertRecord(values);
        }
    });
    const insertRecord = async (getvalue)=>{
        try
        {
            const result = await createUpdateMetaContent(getvalue);
            if(result.success)
            {
              
                toast.current.show({severity:'success', summary: 'Success', detail:result.message});
                getMetacontent();
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }
    const getMetacontent = async ()=>{
        try
        {
            const result = await axiosInstance.get('/getMetaContent');
            if(result.data.success)
            {
                const data = result.data.data[0];
                formik.setValues({
                    meta_title: data.meta_title || "",
                    meta_description: data.meta_description || "",
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
        getMetacontent();
    },[]);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className='grid'>
            <div className='col-12 md:col-12'>
                <div className="flex flex-column gap-2">
                    <label>Meta Title</label>
                    <InputText
                    name ="meta_title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value = {formik.values.meta_title}
                    placeholder='Enter the meta title'/>
                </div>
            </div>
            <div className='col-12 md:col-12'>
                 <div className="flex flex-column gap-2">
                    <label>Meta Description</label>
                    <InputTextarea 
                    name="meta_description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.meta_description}
                    placeholder='Enter the meta description'/>
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

export default Metatitle
