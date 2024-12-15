import React, { useEffect, useRef, useState } from 'react';

//React Router dom
import { useNavigate, useLocation } from 'react-router-dom';

//Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

//Primereact
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Dropdown } from 'primereact/dropdown';

//Services
import { getCategories, createSubCategory, editSubCategory } from './subcategoriesServices';


function Addsubcategories() {
    //Toast sate
    const toast = useRef(null);
    //Editmode
    const [editMode, setEditMode] = useState(false);
    //Image Data
    const [editImage, setEditImage] = useState(null);
    //Load parentcategories
    const [parentcategorydata, setParentcategorydata] = useState([]);
    //Usenaviage for page pass
    const navigate = useNavigate();
    //Useloaction
    const location = useLocation();

    //Formik initial values
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
    const formik = useFormik({
        initialValues: {
            subcategory_name: '',
            parentcategory: '',
            file: null
        },
        validationSchema: Yup.object({
            subcategory_name: Yup.string().required('Sub Category  filed required'),
            parentcategory: Yup.string().required('Category  filed required'),
            file: editMode
                ? Yup.mixed().nullable() // No validation for file in edit mode
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
                : Yup.mixed()
                    .required('Sub Category image file field is required')
                    .test(
                        'fileSize',
                        'File size must be less than or equal to 1 MB',
                        (value) => !value || value.size <= MAX_FILE_SIZE // Check if the file size is <= 1 MB
                    )
                    .test(
                        'fileType',
                        'Only image files are allowed from .jpeg, .png, .gif',
                        (value) => !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type) // Check file MIME type
                    ),
        }),
        onSubmit: (values) => {
            if (editMode) {
                editSubCategories(values);
            }
            else {
                createSubCategories(values);
            }
        }
    });
    //Sub Category create 
    const createSubCategories = async (categoryValues) => {
        try {
            const result = await createSubCategory(categoryValues);
            if (result.success) {
                navigate('/sub-categories', {
                    state: {
                        toast: { severity: 'success', summary: 'Success', detail: result.message }
                    }
                });
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
            console.log(result);
        }
        catch (err) {
            console.error('Error category component create:', err);
        }
    }

    //SubCategory Edit 
    const editSubCategories = async (categoryValues) => {
        try {
            const result = await editSubCategory(categoryValues, location.state?.category.id);
            if (result.success) {
                navigate('/sub-categories', {
                    state: {
                        toast: { severity: 'success', summary: 'Success', detail: result.message }
                    }
                });
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
            console.log(result);
        }
        catch (err) {
            console.error('Error subcategory component edit:', err);
        }
    }

    //Parent Category data
    const getParentCategory = async () => {
        try {
            const result = await getCategories();
            if (result.success) {
                setParentcategorydata(result.data);
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        }
        catch (err) {
            console.log("Subcategories compoent get record from parent category :", err);
        }
    }

    //File upload use prime react. it use onSelect menthod
    const handleSelect = (event) => {
        const files = event.files[0];
        formik.setFieldValue('file', files);
    };
    //File upload use prime react. it use onRemove menthod
    const handleRemove = (event) => {
        // Remove the file from Formik's state
        formik.setFieldValue("file", null); // Set Formik's file field to null
    };

    //Model have the dropdown template
    const categoryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.image} className={`mr-2 flag flag-${option.category_name.toLowerCase()}`} style={{ width: '30px' }} />
                <div>{option.category_name}</div>
            </div>
        );
    };
    useEffect(() => {
        getParentCategory();
        if (location.state?.editMode) {
            setEditMode(true);
            const category = location.state.category;
            formik.setValues(
                { 
                    subcategory_name: category.subcategory_name,
                    parentcategory : category.parentCategory.id
                 });
            setEditImage(category.images); // Assume `image` contains the URL of the existing image
        }
    }, [location.state]);
    return (
        <>
            <div className="grid flex flex-column md:flex-row pt-2">
                <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-start'>
                    <div className='page_title'>{editMode ? 'Edit Sub Category' : 'Add Sub Category'}</div>
                </div>
                <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-end sm:justify-content-start'>
                    <Button label="Back to Sub Categories" icon="pi pi-arrow-right" className="commanBtn" rounded
                        onClick={() => {
                            navigate('/sub-categories');
                        }} />
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className='grid'>
                    <div className='col-12 md:col-6'>
                        <div className="flex flex-column gap-2">
                            <label>Category Name</label>
                            <Dropdown
                                name="parentcategory"
                                options={parentcategorydata}
                                optionLabel="category_name"
                                optionValue="id"
                                filter
                                itemTemplate={categoryOptionTemplate}
                                placeholder="Select Category"
                                onChange={(e) => formik.setFieldValue('parentcategory', e.value)}
                                onBlur={formik.handleBlur}
                                value={formik.values.parentcategory}
                                invalid={formik.touched.parentcategory && formik.errors.parentcategory}
                            />

                            {formik.touched.parentcategory && formik.errors.parentcategory ? (
                                <small style={{ color: '#e24c4c' }}>
                                    {formik.errors.parentcategory}
                                </small>
                            ) : null}
                        </div>
                    </div>
                    <div className='col-12 md:col-6'>
                        <div className="flex flex-column gap-2">
                            <label>Sub Category Name</label>
                            <InputText
                                name="subcategory_name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.subcategory_name}
                                invalid={formik.touched.subcategory_name && formik.errors.subcategory_name}
                                placeholder='Enter the category name'
                            />

                            {formik.touched.subcategory_name && formik.errors.subcategory_name ? (
                                <small style={{ color: '#e24c4c' }}>
                                    {formik.errors.subcategory_name}
                                </small>
                            ) : null}
                        </div>
                    </div>
                    <div className='col-12 md:col-5'>
                        {editMode && <>
                            <div className='default_image_title'>Default Image</div>
                            <Image src={editImage} alt="Image" preview className='default_image' />
                        </>}
                    </div>
                </div>
                <div className='grid'>
                    <div className="col-12 md:col-12">
                        <FileUpload
                            name="file"
                            auto={true}
                            customUpload
                            uploadHandler={handleSelect}
                            onRemove={handleRemove}
                            chooseLabel="Select subcategory image file" // Custom label for "Choose"
                            className={`fileUploadFile ${formik.touched.file && formik.errors.file ? 'error' : ''}`}
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        />
                        {formik.touched.file && formik.errors.file ? (
                            <small style={{ color: '#e24c4c' }}>
                                {formik.errors.file}
                            </small>
                        ) : null}
                    </div>
                </div>
                <div className="flex justify-content-end gap-2 pt-3">
                    <Button type="button" label="Clear" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { formik.resetForm() }} />
                    <Button type="submit" label={editMode ? 'Update' : 'Submit'} className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
                </div>
            </form>
            <Toast ref={toast} />
        </>
    )
}

export default Addsubcategories
