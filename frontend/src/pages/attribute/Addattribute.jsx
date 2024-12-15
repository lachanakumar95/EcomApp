import React, { useEffect, useState } from 'react';

//React router dom
import { useNavigate, useLocation } from 'react-router-dom';
//Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';
//Primereact
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


//Services
import { createAttribute, editAttribute } from './attributeServices';

function Addattribute() {
    //Edit state
    const [editMode, setEditMode] = useState(false);
    //Navigate
    const navigate = useNavigate();
    //Location
    const location = useLocation();

    //Initial formik value
    const formik = useFormik({
        initialValues: {
            attribute_name: ""
        },
        validationSchema: Yup.object({
            attribute_name: Yup.string().required('Attribute filed required'),
        }),
        onSubmit: (values) => {
            if (editMode) {
                editAttributeData(values);
            }
            else {
                addAttributeData(values);
            }
        }
    });

    //Add Attribute
    const addAttributeData = async (values)=>{
        try
        {
            const result = await createAttribute(values);
            if(result.success)
            {
                navigate('/attributes', {
                    state : {
                        toast : {severity: 'success', summary: 'Success', detail: result.message }
                    }
                });
            }
        }
        catch(err)
        {
            console.log("Add Data error from add attribute component :", err);
        }
    }

    //Edit Attribute
    const editAttributeData = async (values)=>{
        try
        {
            const result = await editAttribute(values, location.state?.attribute.id);
            if(result.success)
            {
                navigate('/attributes', {
                    state :{
                        toast : {severity: 'success', summary: 'Success', detail: result.message}
                    }
                });
            }
        }
        catch(err)
        {
            console.log('Error Edit attribute values from add attribute component :', err);
        }
    }

    useEffect(()=>{
        if(location.state?.editMode)
        {
            setEditMode(true);
            let attribute = location.state?.attribute;
            formik.setValues({
                attribute_name : attribute.attribute_name
            });
        }
    },[location.state]);
    return (
        <>
            <div className="grid flex flex-column md:flex-row pt-2">
                <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-start'>
                    <div className='page_title'>{editMode ? 'Edit Attribute' : 'Add Attribute'}</div>
                </div>
                <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-end sm:justify-content-start'>
                    <Button label="Back to Attribute" icon="pi pi-arrow-right" className="commanBtn" rounded
                        onClick={() => {
                            navigate('/attributes');
                        }} />
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='grid flex gap-4'>
                    <div className='col-12 md:col-12'>
                        <div className="flex flex-column gap-2">
                            <label>Attribute Name</label>
                            <InputText
                                name="attribute_name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.attribute_name}
                                invalid={formik.touched.attribute_name && formik.errors.attribute_name}
                                placeholder='Enter the category name'
                            />
                            {formik.touched.attribute_name && formik.errors.attribute_name ? (
                                <small style={{ color: '#e24c4c' }}>
                                    {formik.errors.attribute_name}
                                </small>
                            ) : null}
                        </div>
                    </div>
                </div>
               
                <div className="flex md:justify-content-end gap-2 pt-3">
                    <Button type="button" label="Clear" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { formik.resetForm() }} />
                    <Button type="submit" label={editMode ? 'Update' : 'Submit'} className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
                </div>
            </form>
        </>
    )
}

export default Addattribute
