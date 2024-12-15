import React, { useState, useRef, useEffect } from 'react';
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

//Services       
import { createCategory, editCategory } from './categoriesServices';

function AddCategories() {
  //Toast sate
  const toast = useRef(null);
  //Editmode
  const [editMode, setEditMode] = useState(false);
  //Image Data
  const [editImage, setEditImage] = useState(null);

  //Usenaviage for page pass
  const navigate = useNavigate();
  //Useloaction
  const location = useLocation();


  //Formik initial values
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
  const formik = useFormik({
    initialValues: {
      category_name: '',
      file: null
    },
    validationSchema: Yup.object({
      category_name: Yup.string().required('Category name filed required'),
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
          .required('Category image file field is required')
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
        editCategories(values);
      }
      else {
        createCategories(values);
      }
    }
  });

  //Category create 
  const createCategories = async (categoryValues) => {
    try {
      const result = await createCategory(categoryValues);
      if (result.success) {
        navigate('/categories', {
          state: {
            toast: { severity: 'success', summary: 'Success', detail: result.message }
          }
        });
        formik.resetForm();
      }
      else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
      }
    }
    catch (err) {
      console.error('Error addcategory component create:', err);
    }
  }
  //Category Edit 
  const editCategories = async (categoryValues) => {
    try {
      const result = await editCategory(categoryValues, location.state?.category.id);
      if (result.success) {
        navigate('/categories', {
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
      console.error('Error category component edit:', err);
    }
  }
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
  
  //Componet load
  useEffect(() => {
    if (location.state?.editMode) {
      setEditMode(true);
      const category = location.state.category;
      formik.setValues({ category_name: category.category_name });
      setEditImage(category.image); // Assume `image` contains the URL of the existing image
    }
  }, [location.state]);


  return (
    <>
      <div className="grid flex flex-column md:flex-row pt-2">
        <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-start'>
          <div className='page_title'>{editMode ? 'Edit Category' : 'Add Category'}</div>
        </div>
        <div className='col-12 md:col-6 sm:col-12 flex md:justify-content-end sm:justify-content-start'>
          <Button label="Back to Categories" icon="pi pi-arrow-right" className="commanBtn" rounded
            onClick={() => {
              navigate('/categories');
            }} />
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='grid flex gap-4'>
          <div className='col-12 md:col-6'>
            <div className="flex flex-column gap-2">
              <label>Category Name</label>
              <InputText
                name="category_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category_name}
                invalid={formik.touched.category_name && formik.errors.category_name}
                placeholder='Enter the category name'
              />
              {formik.touched.category_name && formik.errors.category_name ? (
                <small style={{ color: '#e24c4c' }}>
                  {formik.errors.category_name}
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
              customUpload
              onSelect={handleSelect}
              onRemove={handleRemove}
              chooseLabel={editMode ? 'Change category image file' : 'Select category image file'} // Custom label for "Choose"
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

        <div className="flex md:justify-content-end gap-2 pt-3">
          <Button type="button" label="Clear" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { formik.resetForm() }} />
          <Button type="submit" label={editMode ? 'Update' : 'Submit'} className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
        </div>

      </form >

      <Toast ref={toast} />
    </>
  )
}

export default AddCategories
