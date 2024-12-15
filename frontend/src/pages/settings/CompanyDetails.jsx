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
import {createUpdateCompanyDetails} from './settingsServices';

function CompanyDetails() {
    const toast = useRef(null);

    const formik = useFormik({
        initialValues : {
            company_name : "",
            GST_register_no : "",
            mobile : "",
            email : "",
            address : ""
        },
        validationSchema : Yup.object({
            company_name : Yup.string().nullable(),
            GST_register_no : Yup.string().nullable(),
            //mobile : Yup.string().nullable().matches(/^\d{10}$/, "Allow only 10 digits number"), // Fix mobile validation,
            email : Yup.string().nullable().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
        }),
        onSubmit : (values)=>{
            insertRecord(values);
        }
    });
    const insertRecord = async (getvalue)=>{
        try
        {
            const result = await createUpdateCompanyDetails(getvalue);
            if(result.success)
            {
              
                toast.current.show({severity:'success', summary: 'Success', detail:result.message});
                getCompanyInfo();
            }
        }
        catch(err)
        {
            console.error(err);
        }
    }
    const getCompanyInfo = async ()=>{
        try
        {
            const result = await axiosInstance.get('/companyinfo');
            if(result.data.success)
            {
                const data = result.data.data[0];
                formik.setValues({
                    company_name: data.company_name || "",
                    GST_register_no: data.GST_register_no || "",
                    mobile: data.mobile || "",
                    email: data.email || "",
                    address: data.address || ""
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
        getCompanyInfo();
    },[]);
  return (
    <>
    <form onSubmit={formik.handleSubmit}>
        <div className='grid'>
            <div className='col-12 md:col-6'>
                <div className="flex flex-column gap-2">
                    <label>Company Name</label>
                    <InputText
                    name ="company_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value = {formik.values.company_name}
                    placeholder='Enter the company name'/>
                </div>
            </div>
            <div className='col-12 md:col-6'>
                <div className="flex flex-column gap-2">
                    <label>GST Number</label>
                    <InputText 
                    name="GST_register_no"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.GST_register_no}
                    placeholder='Enter the GST number'/>
                </div>
            </div>
            <div className='col-12 md:col-6'>
                <div className="flex flex-column gap-2">
                    <label>Mobile Number</label>
                    <InputMask
                        name="mobile"
                        onChange={(e) => formik.setFieldValue("mobile", e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                        mask="99999-99999"
                        placeholder="Enter the mobile number"
                    />
                     {formik.touched.mobile && formik.errors.mobile ? (
                        <small style={{ color: '#e24c4c' }}>
                        {formik.errors.mobile}
                        </small>
                    ) : null}
                </div>
            </div>
            <div className='col-12 md:col-6'>
                <div className="flex flex-column gap-2">
                    <label>Email Address</label>
                    <InputText 
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder='Enter the email address'/>
                    {formik.touched.email && formik.errors.email ? (
                        <small style={{ color: '#e24c4c' }}>
                        {formik.errors.email}
                        </small>
                    ) : null}
                </div>
            </div>
            <div className='col-12 md:col-12'>
                 <div className="flex flex-column gap-2">
                    <label>Address</label>
                    <InputTextarea 
                    name="address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    placeholder='Enter the address' rows={3}/>
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

export default CompanyDetails
