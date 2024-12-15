import React, { useEffect, useState } from 'react';

//React router dom
import { useNavigate, useLocation } from 'react-router-dom';
//Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';
//Primereact
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker } from 'primereact/colorpicker';
//Services
import { getAttribute, createAttributevalues, editAttributevalues } from './attributevaluesSerivice';

function Addattributevalues() {
    //Attribute
    const [attribute, setattribute] = useState([]);
    //Edit state
    const [editMode, setEditMode] = useState(false);
    //Set attribute color name
    const [colorName, setColorName] = useState(null);
    //Navigate
    const navigate = useNavigate();
    //Location
    const location = useLocation();

    //Initial formik value
    const formik = useFormik({
        initialValues: {
            attribute_value: "",
            attributename: ""
        },
        validationSchema: Yup.object({
            attribute_value: Yup.string().required('Attribute Value filed required'),
            attributename: Yup.string().required('Attribute name filed required'),
        }),
        onSubmit: (values) => {
            if (editMode) {
                editAttributeValuesData(values);
            }
            else {
                createAttributeValuesData(values);
            }
        }
    });
    //create attributevalue
    const createAttributeValuesData = async (values) => {
        try {
            const result = await createAttributevalues(values);
            if (result.success) {
                navigate('/attributes/attributevalues', {
                    state: {
                        toast: { severity: 'success', summary: 'Success', detail: result.message }
                    }
                });
            }
        }
        catch (err) {
            console.log('Fecting error data from attribute value component :', err);
        }
    }
    //create attributevalue
    const editAttributeValuesData = async (values) => {
        try {
            const result = await editAttributevalues(values, location.state.attributevalues.id);
            if (result.success) {
                navigate('/attributes/attributevalues', {
                    state: {
                        toast: { severity: 'success', summary: 'Success', detail: result.message }
                    }
                });
            }
        }
        catch (err) {
            console.log('Fecting error data from attribute value component :', err);
        }
    }
    const loadGetattribute = async () => {
        try {
            const result = await getAttribute();
            if (result.success) {
                setattribute(result.data);
            }
            else {
                setattribute([]);
            }
        }
        catch (err) {
            console.error("Fecting data from addattributevalues component :", err);
        }
    }

    useEffect(() => {
        loadGetattribute();
        if (location.state?.attributevalues) {
            setEditMode(true);
            const attributeValues = location.state.attributevalues;
            formik.setValues({
                attribute_value: attributeValues.attribute_value,
                attributename: attributeValues.fk_attribute._id
            });
            setColorName(attributeValues.fk_attribute.attribute_name);
            console.log(location.state?.attributevalues);
        }
        console.log(formik.values);
    }, [location.state]);
    return (
        <>
            <div className="grid flex flex-column md:flex-row pt-2">
                <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-start'>
                    <div className='page_title'>{editMode ? 'Edit Attribute Value' : 'Add Attribute Value'}</div>
                </div>
                <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-end sm:justify-content-start'>
                    <Button label="Back to Attribute" icon="pi pi-arrow-right" className="commanBtn" rounded
                        onClick={() => {
                            navigate('/attributes/attributevalues');
                        }} />
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='grid'>
                    <div className='col-12 md:col-6'>
                        <div className="flex flex-column gap-2">
                            <label>Attribute Name</label>
                            <Dropdown
                                name="attributename"
                                options={attribute}
                                optionLabel="attribute_name"
                                optionValue="id"
                                filter
                                placeholder="Select attribute name"
                                onChange={(e) => {
                                    const selectedAttribute = attribute.find(attr => attr.id === e.value);
                                    const attributeName = selectedAttribute ? selectedAttribute.attribute_name : null;
                                    setColorName(attributeName); // Update the color name state (if necessary)
                                    formik.setFieldValue('attributename', e.value);
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.attributename}
                                invalid={formik.touched.attributename && formik.errors.attributename}
                            />
                            {formik.touched.attributename && formik.errors.attributename ? (
                                <small style={{ color: '#e24c4c' }}>
                                    {formik.errors.attributename}
                                </small>
                            ) : null}
                        </div>
                    </div>
                    {['color', 'colors'].includes(colorName?.toLowerCase()) ? <>
                        <div className='col-12 md:col-6'>
                            <div className="flex flex-column gap-2">
                                <label>Attribute Value</label>
                                <ColorPicker
                                    name="attribute_value"
                                    value={formik.values.attribute_value} // Value from Formik
                                    onChange={(e) => {
                                        // Ensure '#' is added to the color value if not present
                                        const colorValue = e.value.startsWith('#') ? e.value : `#${e.value}`;
                                        formik.setFieldValue('attribute_value', colorValue)
                                    }} // Correctly handle the color value
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.attribute_value && formik.errors.attribute_value ? 'p-invalid' : ''}
                                    inline
                                />
                                {formik.touched.attribute_value && formik.errors.attribute_value ? (
                                    <small style={{ color: '#e24c4c' }}>
                                        {formik.errors.attribute_value}
                                    </small>
                                ) : null}
                            </div>

                        </div>
                    </> : <>
                        <div className='col-12 md:col-6'>
                            <div className="flex flex-column gap-2">
                                <label>Attribute Value</label>
                                <InputText
                                    name="attribute_value"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.attribute_value}
                                    invalid={formik.touched.attribute_value && formik.errors.attribute_value}
                                    placeholder='Enter the attribute value'
                                />
                                {formik.touched.attribute_value && formik.errors.attribute_value ? (
                                    <small style={{ color: '#e24c4c' }}>
                                        {formik.errors.attribute_value}
                                    </small>
                                ) : null}
                            </div>
                        </div>
                    </>}


                </div>

                <div className="flex md:justify-content-end gap-2 pt-3">
                    <Button type="button" label="Clear" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { formik.resetForm() }} />
                    <Button type="submit" label={editMode ? 'Update' : 'Submit'} className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
                </div>
            </form>
        </>
    )
}

export default Addattributevalues
