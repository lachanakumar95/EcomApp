import React, { useEffect, useState, useRef } from 'react';
//Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

//PrimeReact
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
//Services
import { getCategories, createSubCategory, editSubCategory, getSubcategories, deleteSubCategory, published, homeDisplay } from './subcategoriesServices';

function Subcategories() {
    //Toast ref
    const toast = useRef(null);
    //Load Api data State
    const [data, setdata] = useState([]);
    //Load parentcategories
    const [parentcategorydata, setParentcategorydata] = useState([]);
    // For global search for datatable
    const [globalFilter, setGlobalFilter] = useState("");
    //Modal visiable and disable
    const [visible, setVisible] = useState(false);
    //Model Dialog title
    const [modalTitle, setModalTitle] = useState(null);
    //Edit Mode
    const [editMode, setEditMode] = useState(false);
    //Image Data
    const [editImage, setEditImage] = useState(null);
    //Edit Id
    const [editID, setEditID] = useState(null);


    //Published
    const PublishedSubCategories = async (ID) => {
        try {
            const result = await published(ID);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadDataFromAPi();
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        }
        catch (err) {
            console.error('Error category component published:', err);
        }
    }

    //Home Display
    const homeDisplaySubCategories = async (ID) => {
        try {
            const result = await homeDisplay(ID);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadDataFromAPi();
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        }
        catch (err) {
            console.error('Error category component hoem dispaly:', err);
        }
    }
    //Delete Categories
    const deleteSubCategories = async (getId) => {
        try {
            const result = await deleteSubCategory(getId);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadDataFromAPi();
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        }
        catch (err) {
            console.error('Error category component delete:', err);
        }
    }

    //Get subcategories record
    const loadDataFromAPi = async () => {
        try {
            const result = await getSubcategories();
            if (result.success) {
                setdata(result.data);
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        }
        catch (err) {
            console.log("Subcategories compoent get record :", err);
        }
    }

    //Sub Category create 
    const createSubCategories = async (categoryValues) => {
        try {
            const result = await createSubCategory(categoryValues);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                setVisible(false);
                formik.resetForm();
                loadDataFromAPi();
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
            const result = await editSubCategory(categoryValues, editID);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                setVisible(false);
                formik.resetForm();
                loadDataFromAPi();
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
                        'Only image files are allowed',
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
                        'Only image files are allowed',
                        (value) => !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type) // Check file MIME type
                    ),
        }),
        onSubmit: (values) => {
            if (editID) {
                editSubCategories(values);
            }
            else {
                createSubCategories(values);
            }
        }
    });

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
    //Edit Mode image upload
    const editHandleSelect = (event) => {
        setEditImage(event.files[0].objectURL);
        const files = event.files[0];
        formik.setFieldValue('file', files);
    }
    //Datatable sno generate
    const snoBodyTemplate = (rowData, options) => {
        return options.rowIndex + 1; // Row index starts from 0, add 1 for S.No
    };
    //Datatable image show
    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.images} alt={rowData.image} className="img_table" />;
    };
    //Datatable published enable
    const publishedBodyTemplate = (rowData) => {
        return <InputSwitch checked={rowData.published}
            onChange={() => {
                PublishedSubCategories(rowData.id);
            }}
        />
    }
    //Datatable Homedisplay enable
    const homedisplayBodyTemplate = (rowData) => {
        return <InputSwitch checked={rowData.home_display}
            onChange={() => {
                homeDisplaySubCategories(rowData.id);
            }}
        />
    }

    //Datatable action button
    const actionBodyTemplate = (rowData) => {
        return <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    //Set modal Title
                    setModalTitle("Edit Sub Category Record");
                    //Set edit mode on
                    setEditMode(true);
                    //Modal show
                    setVisible(true);
                    console.log(rowData);
                    formik.setValues({
                        subcategory_name: rowData.subcategory_name,
                        parentcategory: rowData.parentCategory.id
                    });
                    console.log(rowData);
                    setEditImage(rowData.images);
                    //Get Edit Id
                    setEditID(rowData.id);
                }}
            />
            <Button icon="pi pi-trash" rounded severity="danger" tooltip="Delete" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    confirmDialog({
                        message: 'Do you want to delete this record?',
                        header: 'Delete Confirmation',
                        icon: 'pi pi-exclamation-triangle',
                        defaultFocus: 'reject',
                        acceptClassName: 'p-button-danger',
                        accept: () => {
                            deleteSubCategories(rowData.id);
                        },
                        reject: () => {
                            //console.log("Rejected!");
                        }
                    });
                }}
            />
        </div>
    }
    // Render header with global search
    const renderHeader = () => {
        return (
            // <div className="table-header flex justify-content-between align-items-center">
            <div className="grid flex">
                <div className="col-12 md:col-6 sm:col-6">
                    <div className="p-input-icon-left search_textbox_table">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilter}
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search categories..."
                        />
                    </div>
                </div>
                <div className="col-12 flex justify-content-end md:col-6 sm:col-6">
                    <Button label="Add Sub Categories" icon="pi pi-plus" className="commanBtn" rounded
                        onClick={() => {
                            //Modal Header title
                            setModalTitle("Add Sub Category Record")
                            //Model Show
                            setVisible(true);
                            //EditMode off
                            setEditMode(false);
                            //Null value from editID
                            setEditID(null);
                            formik.resetForm();
                        }}
                    />
                </div>

            </div>
        );
    };
    //Datatable header call the function
    const header = renderHeader();

    //Model have the dropdown template
    const categoryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.image} className={`mr-2 flag flag-${option.category_name.toLowerCase()}`} style={{ width: '30px' }} />
                <div>{option.category_name}</div>
            </div>
        );
    };
    //Component render
    useEffect(() => {
        loadDataFromAPi();
        getParentCategory();
    }, []);
    return (
        <>
            {/*Primereact Table*/}
            <DataTable value={data}
                size="small"
                paginator // Enables pagination
                rows={10} // Number of rows per page
                rowsPerPageOptions={[5, 10, 20]} // Rows per page dropdown
                globalFilter={globalFilter} // Enables global filtering
                header={header} // Table header with search
                sortMode="multiple" // Allows multi-column sorting
                tableStyle={{ minWidth: '50rem' }}>
                <Column header="S.No" body={snoBodyTemplate}></Column>
                <Column header="Image" body={imageBodyTemplate}></Column>
                <Column field="parentCategory.category_name" sortable header="Parent Category Name"></Column>
                <Column field="subcategory_name" sortable header="Sub Category Name"></Column>
                <Column header="Published" body={publishedBodyTemplate}></Column>
                <Column header="Home Display" body={homedisplayBodyTemplate}></Column>
                <Column header="Actions" body={actionBodyTemplate}></Column>
            </DataTable>
            <Dialog header={modalTitle} visible={visible} maximizable
                onHide={() => { if (!visible) return; setVisible(false); setEditMode(true) }}
                style={{ width: '50vw' }}
                className='dialog_modal'
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <form onSubmit={formik.handleSubmit}>
                    {editMode ? <>
                        {/*===========Edit Record============== */}
                        <div className='grid'>
                            <div className='col-12 md:col-12'>
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
                        </div>
                        <div className='grid'>
                            <div className='col-12 md:col-12'>
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
                        </div>
                        <div className='grid'>
                            <div className="col-12 md:col-12">
                                <Image src={editImage} alt="Image" width="250" preview />
                                <FileUpload mode="basic" accept="image/*"
                                    name="file"
                                    auto
                                    customUpload
                                    uploadHandler={editHandleSelect}
                                    className={`fileUploadFile ${formik.touched.file && formik.errors.file ? 'error' : ''}`}
                                    chooseLabel="Change subcategory image file" />
                                {formik.touched.file && formik.errors.file ? (
                                    <small style={{ color: '#e24c4c' }}>
                                        {formik.errors.file}
                                    </small>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex justify-content-end gap-2 pt-3">
                            <Button type="button" label="Cancel" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { setVisible(false); setEditMode(true) }} />
                            <Button type="submit" label="Update" className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
                        </div>
                    </> : <>
                        {/*===========Add Record============== */}
                        <div className='grid'>
                            <div className='col-12 md:col-12'>
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
                        </div>
                        <div className='grid'>
                            <div className='col-12 md:col-12'>
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
                            <Button type="button" label="Cancel" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { setVisible(false); setEditMode(true) }} />
                            <Button type="submit" label="Submit" className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
                        </div>
                    </>}
                </form>
            </Dialog>
            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    )
}

export default Subcategories
