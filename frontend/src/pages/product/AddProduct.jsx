import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//Formik
import { useFormik } from "formik";
import * as Yup from "yup";

//Prime react
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
        
//Tab css
import './tab.css';
//Services
import {
    getAttributeName, getAttributevalues, getCategories,
    getSubCategory, getBrandData, getTagsData, getTaxData,
    createProducts, updateProducts, genealInfomation
} from './productServices';


function AddProduct() {
    const toast = useRef(null);
    //Genralinfo currency
    const [generalInfo, setGeneralInfo] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    //Editmode
    const [editMode, setEditMode] = useState(false);
   
    ///Edit the product component load
    useEffect(()=>{
        if (location.state?.editMode) {
            setEditMode(true);
            const product = location.state.product;
            console.log("API", product);
            formik.setValues({
                ...formik.values,
                product_name: product.product_name || "",
                fk_category: product.fk_category ? product.fk_category._id : "",
                fk_subcategory: product.fk_subcategory ? product.fk_subcategory._id : "",
                fk_brand: product.fk_brand ? product.fk_brand._id : "",
                tags: product.tags || [],
                product_short_desc: product.product_short_desc || "",
                produt_long_desc: product.product_long_desc || "",
                specification: product.specification || "",
                product_thumbnail: product.product_thumbnail_path || "", // Assuming null is acceptable here
                product_desc_images: product.product_desc_images || [],
                video_provider: product.video_provider || "",
                video_url: product.video_url || "",
                offer_start_date: product.offer_start_date ? new Date(product.offer_start_date) : "",
                offer_end_date: product.offer_end_date ? new Date(product.offer_end_date) : "",
                offer_discount_type: product.offer_discount_type || "",
                offer_discount: product.offer_discount || "",
                flash_sale: product.flash_sale || false, // Default to false if boolean
                min_order_qty: product.min_order_qty || "",
                min_stock_warning: product.min_stock_warning || "",
                tax: product.tax || [], // Default to an empty string
                skuid: product.skuid || "",
                //attr_name: product.attr_name, // Match the MultiSelect state
                variants: product.variants
                ? product.variants.map((variant) => {
                      return {
                          attributes: variant.attributes || {}, // Default to empty object
                          stock: variant.stock || "", // Default to empty string
                          price: variant.price || "", // Default to empty string
                          selling_price: variant.selling_price || "", // Default to empty string
                          images: variant.images || [], // Default to empty array
                          id : variant._id || ""
                      };
                  })
                : [],
                shipping_fee_type: product.shipping_fee_type || "",
                shipping_fee: product.shipping_fee || "",
                shipping_days: product.shipping_days || "",
                refundable: product.refundable || false,
                featured: product.featured || false,
                today_deal: product.today_deal || false,
            });
       
        }
    },[location.state]);

    
    //*==========Tab function and state==========*//
    const [activeTab, setActiveTab] = useState("tab1");
    // Tab list for sequential navigation
    const tabOrder = ["tab1", "tab2", "tab3", "tab4"];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleNext = () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex < tabOrder.length - 1) {
            setActiveTab(tabOrder[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabOrder[currentIndex - 1]);
        }
    };

    //*=========Import of varint state and functionality code*===============
    //Start the Variant code
    const [attributeName, setAttributeName] = useState([]); // Store the Attribute Name Sate
    const [attributeValues, setAttributeValues] = useState({}); // Store options for each attribute
    const [selectedAttributes, setSelectedAttributes] = useState([]); // Select the attrubtename
    const [editselectedAttributes, setEditSelectedAttributes] = useState([]); // Eidtmode Select the attrubtename

    useEffect(() => {
        fetchAttributeNames();
    }, []);

    // Example API call to fetch attribute names
    const fetchAttributeNames = async () => {
        
        const result = await getAttributeName();
        if (result.success) {
            setAttributeName(result.data);
        }
        else {
            setAttributeName([]);
        }
    };

    const fetchAttributeValues = async (attributeId) => {
        // Fetch the attribute values based on attributeId (e.g., Size, Color, etc.)
        if(attributeId)
        {
            const result = await getAttributevalues(attributeId);
            //const data = await result.json();
            setAttributeValues((prevState) => ({
                ...prevState,
                [attributeId]: result.data
            }));
        }

    };
    const colorCodeChangeColor = (option)=>{
        console.log(option);
        return(
            <div className='flex'>
                <span style={{backgroundColor : option.value, display: 'inline-block', borderRadius: '15px', height: '25px', width: '25px', marginRight: '10px'}}></span>
                <span>{option.value}</span>
            </div>

        );
    }

    //This function use of get attribute value show drop down
    const getAttributeOptions = (attrName) => {
        //Default edit mode show the values for attribute values
        const attribute = editMode ?  editselectedAttributes.find((attr) => attr.attribute_name === attrName)
             : selectedAttributes.find((attr) => attr.attribute_name === attrName);

        const attributeId = attribute ? attribute.id : null;
        return attributeId && attributeValues[attributeId]
            ? attributeValues[attributeId].map((value) => ({
                label: value.attribute_value,
                value: value.attribute_value,
            }))
            : [];
    };

    const handleAttributeName = (e)=>{
        //This is non selected attribute name. It's important
        // if(editMode)
        // {
        //     setSelectedAttributes([]);
        // }
        //Default attribute name select after fectvh the attribute values
        e.value.forEach((IDValue) => {
             fetchAttributeValues(IDValue);
        });
        const filteredArray = attributeName.filter(item1 => 
            e.value.some(item2 => item1.id === item2)
        );
        setSelectedAttributes(filteredArray);
       
    }
    const addVariant = () => {
        const newAttributes = selectedAttributes.reduce((acc, attr) => {
            acc[attr.attribute_name] = ""; // Initialize dynamic attributes with empty values
            return acc;
        }, {});
        const newVariant = {
            attributes: newAttributes, // it selectd attribute name
            stock: "",
            price: "",
            selling_price: "",
            images: []
        };

        // Ensure attribute values are loaded before adding variant
        const allAttributesFetched = selectedAttributes.every(attr => attributeValues[attr.id]);
        if (!allAttributesFetched) {
            console.log("Waiting for all attributes to be fetched...");
            return; // or show a loading spinner
        }
        formik.setFieldValue("variants", [...formik.values.variants, newVariant]);

    };

    const removeVariant = (index) => {
        // const remvoeVariantImages = formik.values.variants[index].images;
        // if(remvoeVariantImages.length <= 0)
        // {
        //     const updatedVariants = formik.values.variants.filter((_, i) => i !== index);
        //     formik.setFieldValue("variants", updatedVariants);
        // }
        // else
        // {
        //     toast.current.show({severity:'warn', summary: 'Warning', detail:'Please remove all images associated with this variant before deleting it.', life: 3000});
        // }
        const updatedVariants = formik.values.variants.filter((_, i) => i !== index);
        formik.setFieldValue("variants", updatedVariants);

    };
    //Image file select convert to array variant images
    const handleFileUpload = (event, index) => {
        if (editMode) {
            // If in edit mode, add new files to the existing files
            const existingFiles = formik.values.variants[index]?.images || [];
            const uploadedFiles = Array.from(event.files); // Convert uploaded files to array
            const updatedFiles = [...existingFiles, ...uploadedFiles]; // Combine existing and new files
            formik.setFieldValue(`variants[${index}].images`, updatedFiles);
        } else {
            // Replace images in non-edit mode
            const uploadedFiles = Array.from(event.files);
            formik.setFieldValue(`variants[${index}].images`, uploadedFiles);
        }
    };
    //File upload use prime react. it use onRemove method
    const handleFileUploadRemove = (file, index) => {
        const existingFiles = formik.values.variants[index]?.images || [];
        const updatedFiles = existingFiles.filter((existingFile) => existingFile !== file);
        formik.setFieldValue(`variants[${index}].images`, updatedFiles);
    };
    //======End the variant code============

    //=========Satrt Get categories state and API Function=========
    const [categoryData, setCategoryData] = useState([]);

    const categoriesData = async () => {
        const result = await getCategories();
        if (result.success) {
            setCategoryData(result.data);
        }
        else {
            setCategoryData([]);
        }
    }
    //Model have the dropdown template
    const categoryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.image} className={`mr-2 flag flag-${option.category_name.toLowerCase()}`} style={{ width: '30px' }} />
                <div>{option.category_name}</div>
            </div>
        );
    };
    //=========Stop Get categories state and API Function code=========

    //=========Satrt Get Subcategories state and API Function=========
    const [subcategoryData, setSubCategoryData] = useState([]);
    const subcategoriesData = async () => {
        const categroryId = formik.values.fk_category;
        const result = await getSubCategory(categroryId);
        if(result)
        {
            if (result.success) {
                setSubCategoryData(result.data);
            }
            else {
                setSubCategoryData([]);
            }
        }
    }
    //Model have the dropdown template
    const subcategoryOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.images} className={`mr-2 flag flag-${option.subcategory_name.toLowerCase()}`} style={{ width: '30px' }} />
                <div>{option.subcategory_name}</div>
            </div>
        );
    };
  
    //=========Stop Get categories state and API Function code=========

    //==========Start the get brand data================
    const [getBrand, setGetBrand] = useState([]);
    const brandPublishedData = async () => {
        const result = await getBrandData();
        if (result.success) {
            setGetBrand(result.data);
        }
        else {
            setGetBrand([]);
        }
    }
    const brandOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.image} className={`mr-2 flag flag-${option.brand_name.toLowerCase()}`} style={{ width: '30px' }} />
                <div>{option.brand_name}</div>
            </div>
        );
    }
    //==========Stop the get brand data================

    //====Satrt the get tag data code ======
    const [getTags, setGetTags] = useState([]);
    const getTagsPublished = async () => {
        const result = await getTagsData();
        if (result.success) {
            setGetTags(result.data);
        }
        else {
            setGetTags([]);
        }
    }
    const tagsOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.image} className={`mr-2 flag flag-${option.tag_name.toLowerCase()}`} style={{ width: '30px' }} />
                <div>{option.tag_name}</div>
            </div>
        );
    }
    //====Stop the get tag data code ======

     //====Satrt the tax data code ======
     const [getTax, setGetTax] = useState([]);
     const getTaxAPI = async ()=>{
         const result = await getTaxData();
         if(result.success)
         {
             setGetTax(result.data);
         }
         else
         {
             setGetTax([]);
         }
     }

     const taxOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.tax_type} - {option.percentage} %</div>
            </div>
        );
    }
     //====End the tax data code ======
//General Company information
     const companyGeneralInfo = async ()=>{
        try
        {
            const result = await genealInfomation();
            if(result.success)
            {
              setGeneralInfo(result.data[0]);
            }
        }
        catch(err)
        {
            console.error('General Info:', err);
        }
    }
    useEffect(() => {
        categoriesData(); // Call Category api data
        brandPublishedData(); // Call Brand api data
        getTagsPublished(); // Call Tags api data
        getTaxAPI(); // Call Tax api data
        companyGeneralInfo();
    }, []);

/*===================================
    Main Function of add edit
======================================
*/
    //list of video provider
    const Videoprovider = [
        {provider : "YouTube"},
        {provider : "Vimeo"},
        {provider : "Mp4"}
    ];
    //List of shipping fee type
    const shippingFeeType = [
        {type : 'Flat Rate'},
        {type : 'Free Shipping'}
    ];
    //Discount Type
    const discountType = [
        {type : 'Percentage'},
        {type : 'Flat Rate'}
    ];

    
    //Initial formik
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
        const formik = useFormik({
            initialValues: {
                product_name: "",
                fk_category: null,
                fk_subcategory: null,
                fk_brand: null,
                tags: [],
                product_short_desc: "",
                produt_long_desc: "",
                specification: "",
                product_thumbnail: null,
                product_desc_images: [],
                video_provider: null,
                video_url: "",
                offer_start_date: null,
                offer_end_date: null,
                offer_discount_type: null,
                offer_discount: null,
                flash_sale: "No",
                min_order_qty: null,
                min_stock_warning: null,
                tax: [],
                skuid: "",
                attr_name :[],
                variants: [
                    {
                        attributes: {}, // Dynamically store attributes here
                        stock: null,
                        price: null,
                        selling_price: "",
                        images: []
                    }
                ],
                shipping_fee_type: null,
                shipping_fee: "",
                shipping_days: "",
                refundable: false,
                featured: false,
                today_deal: false
            },
            enableReinitialize : true,
            validationSchema: Yup.object({
                product_name: Yup.string().required('Product name filed required'),
                fk_category: Yup.string().required('Category filed required'),
                product_thumbnail: editMode
                ? Yup.mixed().nullable() // No validation in edit mode
                : Yup.mixed()
                      .required('Product Thumbnail file field is required')
                      .test(
                          'fileSize',
                          'File size must be less than or equal to 1 MB',
                          (value) => !value || value.size <= MAX_FILE_SIZE // Check file size
                      )
                      .test(
                          'fileType',
                          'Only image files are allowed (.jpeg, .jpg, .png)',
                          (value) =>
                              !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type) // Check MIME type
                      ),
            product_desc_images: editMode
                ? Yup.array().nullable() // No validation in edit mode
                : Yup.array()
                      .of(
                          Yup.mixed()
                              .nullable()
                              .test(
                                  'fileSize',
                                  'File size must be less than or equal to 1 MB',
                                  (value) => !value || value.size <= MAX_FILE_SIZE // Check file size
                              )
                              .test(
                                  'fileType',
                                  'Only image files are allowed (.jpeg, .jpg, .png)',
                                  (value) =>
                                      !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type) // Check MIME type
                              )
                      ),
                variants: Yup.array().of(
                    Yup.object({
                        stock: Yup.number()
                            .required("Stock field is required")
                            .min(1, "Stock must be at least 1"),
                        price: Yup.number()
                            .required("Price field is required")
                            .min(0, "Price must be non-negative"),
                        // selling_price: Yup.number()
                        // .typeError('Selling price must be a valid number'), // Handle non-numeric input,
                        images: Yup.array()
                            .of(
                                Yup.lazy(() =>
                                    editMode
                                        ? Yup.mixed().nullable() // Skip validation for images in edit mode
                                        : Yup.mixed()
                                              .required('Product variant image is required')
                                              .test(
                                                  'fileSize',
                                                  'File size must be less than or equal to 1 MB',
                                                  (value) => !value || value.size <= MAX_FILE_SIZE
                                              )
                                              .test(
                                                  'fileType',
                                                  'Only image files are allowed (.jpeg, .jpg, .png)',
                                                  (value) =>
                                                      !value ||
                                                      ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
                                              )
                                )
                            )
                            .min(editMode ? 0 : 1, 'At least one image is required'), // Minimum one image in non-edit mode
                    })
                )
            }),
            onSubmit: (values) => {
                if (editMode) {
                    updateProductsData(values);
                    // Handle edit mode logic if needed
                } else {
                    // Create product with the form data
                    productCreateData(values);
                }
                
            console.log("Submitted Values:", values); // Optional: for debugging
            }
        });

/*============================
    Product Thumbnail image
===============================*/

//File upload use prime react. it use onSelect menthod
  const handleSelectProductThumb = (event) => {
    const files = event.files[0];
    console.log(files);
    formik.setFieldValue('product_thumbnail', files);
  };
  //File upload use prime react. it use onRemove method
  const handleRemoveProductThumb = (event) => {
    // Remove the file from Formik's state
    formik.setFieldValue("product_thumbnail", null); // Set Formik's file field to null
  };
/*============================
    Product description image
===============================*/
// Handle file selection for product description images
const handleSelectProductDescImage = (event) => {
    // Convert uploaded files to an array (files might be a FileList object)
    const uploadedFiles = Array.from(event.files);
    // Set the array of files to Formik's field
    formik.setFieldValue('product_desc_images', uploadedFiles);
};
const edithandleSelectProductDescImage = (event) => {
    const selectedFiles = Array.from(event.files);
    // const newImages = selectedFiles.map((file) => ({
    //     //id: Date.now() + Math.random(),
    //     product_dec_images: URL.createObjectURL(file), // For preview
    //     fileName: file.name, // Store file name for comparison
    //     fileLastModified: file.lastModified, // Optional, for uniqueness
    // }));

    formik.setFieldValue('product_desc_images', [
        ...formik.values.product_desc_images,
        //...newImages,
        selectedFiles
    ]);
};
// Handle file removal for product description images
const handleRemoveProductDescImage = (file) => {
    // Get the current array of files in Formik
    const existingFiles = formik.values.product_desc_images || [];
    // Filter out the file that is being removed
    const updatedFiles = existingFiles.filter((existingFile) => existingFile !== file);
    // Update the Formik field with the remaining files
    formik.setFieldValue('product_desc_images', updatedFiles);
};
// Handle file removal for product description images
const edithandleRemoveProductDescImage = (index) => {
    const updatedImages = formik.values.product_desc_images.filter(
        (_, i) => i !== index
    );

    // Update Formik values
    formik.setFieldValue('product_desc_images', updatedImages);
};
/*===============================
         Product create api      
==================================*/

const productCreateData = async (values)=>{
    try
    {
        const result = await createProducts(values);
        if(result.success)
        {
            navigate('/products', {
                state : {
                    toast: { severity: 'success', summary: 'Success', detail: result.message }
                }
            });
        }
    }
    catch(err)
    {
        console.log("Product create error from add product componet :", err);
    }
}

/*===============================
         Product Update api      
==================================*/
const updateProductsData = async (getvalues)=>{
    try
    {
        const result = await updateProducts(location.state.product._id, getvalues);
        if(result.success)
            {
                navigate('/products', {
                    state : {
                        toast: { severity: 'success', summary: 'Success', detail: result.message }
                    }
                });
            }
    }
    catch(err)
    {
        console.log("Update the product error from add product component");
    }
}

useEffect(()=>{
    //Generate Automatically Skuid
    const generateSkuid = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    formik.setFieldValue('skuid', generateSkuid);
},[]);

/*==================Import parent category change call the sub category value
=============================*/
useEffect(() => {
    // Avoid running the effect for null values
    if (formik.values.fk_category === null) {
        return; // Exit early if the value is null
    }
    subcategoriesData();
}, [formik.values.fk_category]);
/*=====Importan of variant edit======*/
//This edit the mode attribute value show the dropdown
useEffect(() => {
    if (editMode) {
         // Fetch attribute options for each attribute name in the product
         const fetchOptionsForAttributes = async () => {
            // Fetch values for each selected attribute name
            if(attributeName.length > 0)
            {
                 for (let item of attributeName) {
                     await fetchAttributeValues(item.id);
                }
            }
            // for (let item of location.state.product.attr_name) {
            //     await fetchAttributeValues(item);
            // }
        };
        fetchOptionsForAttributes();
        // const filteredArray = attributeName.filter(item =>
        //     location.state.product.attr_name.includes(item.id)
        // );
        /*=== Default load the attribue value so i have mentioned attributenam===*/
        setEditSelectedAttributes(attributeName);
    }
}, [attributeName, editMode]);


return (
<>

<div className="grid flex flex-column md:flex-row pt-2">
<div className='col-12 md:col-6 sm:col-12 flex md:justify-content-start'>
    <div className='page_title'>Add Product</div>
</div>          
<div className='col-12 md:col-6 sm:col-12 flex md:justify-content-end sm:justify-content-start'>
    <Button label="Back to Products" icon="pi pi-arrow-right" className="commanBtn" rounded
        onClick={()=>{
            navigate('/products');
        }}
    />
</div>
</div>

<form onSubmit={formik.handleSubmit}>
{/*=====Tab Start========*/}
<div className="tab-container">
    {/* Start Tab Buttons */}
    {/* Tab Buttons */}
    <div className="tab-buttons">
        {tabOrder.map((tab, index) => (
            <button
                type="button" // Ensure it doesn't submit the form
                key={tab}
                className={`tab-button ${activeTab === tab ? "tab_active" : ""}`}
                onClick={() => handleTabClick(tab)}
            >
                {tab === "tab1"
                    ? "Product Information"
                    : tab === "tab2"
                        ? "Offer & Specification"
                        : tab === "tab3"
                            ? "Product Variation"
                            : "Shipping & Statuses"}
            </button>
        ))}
    </div>
    {/* End Tab Buttons */}

    {/* === Product information Start Tab body === */}
    <div className={`tab-content ${activeTab === "tab1" ? "tab_active" : ""}`}>
        <div className="grid">
            <div className="col-12 md:col-12">
                <div className="flex flex-column gap-1">
                    <label>Product Name *</label>
                    <InputText
                        name="product_name"
                        value={formik.values.product_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.product_name && formik.errors.product_name}
                        placeholder="Enter the product name *"
                    />
                    {formik.touched.product_name && formik.errors.product_name ? <>
                        <small className='p-error'>{formik.errors.product_name}</small>
                    </> : ""}
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Category *</label>
                    <Dropdown placeholder="Select a category"
                        name="fk_category"
                        options={categoryData}
                        optionLabel="category_name"
                        optionValue="id"
                        filter
                        itemTemplate={categoryOptionTemplate}
                        onChange={(e) => {
                            formik.setFieldValue('fk_category', e.value);
                           subcategoriesData();// Call Subcategory fun
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.fk_category}
                        className="w-full"
                        showClear
                        invalid={formik.touched.fk_category && formik.errors.fk_category}
                    />
                    {formik.touched.fk_category && formik.errors.fk_category ? <>
                        <small className='p-error'>{formik.errors.fk_category}</small>
                    </> : ""}
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Sub category</label>
                    <Dropdown placeholder="Select a sub category"
                        name="fk_subcategory"
                        options={subcategoryData}
                        optionLabel="subcategory_name"
                        optionValue="id"
                        filter
                        itemTemplate={subcategoryOptionTemplate}
                        onChange={(e) => formik.setFieldValue('fk_subcategory', e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.fk_subcategory}
                        showClear 
                        className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Brand</label>
                    <Dropdown placeholder="Select a brand"
                        name="fk_brand"
                        options={getBrand}
                        optionLabel="brand_name"
                        optionValue="id"
                        filter
                        itemTemplate={brandOptionTemplate}
                        onChange={(e) => formik.setFieldValue('fk_brand', e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.fk_brand}
                        showClear 
                        className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Tags</label>
                    <MultiSelect placeholder="Select a tags"
                        name="tags"
                        options={getTags}
                        optionLabel="tag_name"
                        optionValue="tag_name"
                        filter
                        display="chip"
                        itemTemplate={tagsOptionTemplate}
                        onChange={(e) => formik.setFieldValue('tags', e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.tags}
                        showClear 
                        className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-12">
                <div className="flex flex-column gap-1">
                    <label>Product short description</label>
                    <InputTextarea 
                    name="product_short_desc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value ={formik.values.product_short_desc}
                    placeholder="Enter the product short description" autoResize rows={1} />
                </div>
            </div>
            <div className="col-12 md:col-12">
                <div className="flex flex-column gap-1">
                    <label>Product long description</label>
                    <InputTextarea 
                    name="produt_long_desc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.produt_long_desc}
                    placeholder="Enter the product long description" autoResize rows={3} />
                </div>
            </div>
            <div className="col-12 md:col-12">
                <div className="flex flex-column gap-1">
                    <label>Specification</label>
                    <Editor 
                        name="specification"
                        onTextChange={(e) => formik.setFieldValue("specification", e.htmlValue)} // Handle onChange properly
                        onBlur={formik.handleBlur}
                        value={formik.values.specification}
                        style={{ height: '250px' , fontWeight: '400 !important'}} />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    {editMode && <>
                        <div className='default_image_title'>Default Product thumbnail image </div>
                        <div className='custom_img_box'>
                            {/* <button type="button" className='remove_btn_img_box'>X</button> */}
                            {/* <img src={formik.values.product_thumbnail} alt="" /> */}
                            <img src={formik.values.product_thumbnail instanceof File ? location.state.product.product_thumbnail_path : formik.values.product_thumbnail} alt="" />
                            
                        </div>
                     </>
                    }
                    <label>Product thumbnail image *</label>
                    <FileUpload
                        name="product_thumbnail"
                        customUpload
                        onSelect={handleSelectProductThumb}
                        onRemove={handleRemoveProductThumb}
                        chooseLabel={editMode ? 'Change product thumbnail image file' : 'Choose product thumbnail image'} // Custom label for "Choose"
                        className={`fileUploadFile ${formik.touched.product_thumbnail && formik.errors.product_thumbnail ? 'error' : ''}`}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                        {formik.touched.product_thumbnail && formik.errors.product_thumbnail ? (
                            <small className='p-error'>
                                {formik.errors.product_thumbnail}
                            </small>
                            ) : null}
                </div>
            </div>
            <div className="col-12 md:col-6">
         <div className="flex flex-column gap-1">
            {editMode && (
                 <>
                {formik.values.product_desc_images.some((item) => item.id) && (
                    <div className="default_image_title">
                        Default Product Description Images
                    </div>
                    )}
                <div className="grid">
                    {formik.values.product_desc_images.map((item, index) => (
                        <div className="col-12 md:col-3" key={item.id || index}>
                            {item.id &&  <div className="custom_img_box" style={{marginTop: '-30px'}}>
                               <button
                                    type="button"
                                    className="remove_btn_img_box"
                                    onClick={() => edithandleRemoveProductDescImage(index)}
                                >
                                    X
                                </button> 
                                <img src={item.product_dec_images} alt={`Image ${index}`} />
                            </div>}
                           
                        </div>
                    ))}
                </div>
            </>
        )}

            <label>Product Description Images</label>
            <FileUpload
                multiple
                name="product_desc_images"
                onSelect={(e)=>{
                    if(editMode)
                    {
                        edithandleSelectProductDescImage(e)
                    }else
                    {
                        handleSelectProductDescImage(e)
                    }
                }}
                onRemove={(e) => {
                    if(editMode)
                    {
                        const fileIndex = formik.values.product_desc_images.findIndex(
                            (item) => item.fileName === e.file.name && item.fileLastModified === e.file.lastModified
                        );
                        if (fileIndex !== -1) {
                            edithandleRemoveProductDescImage(fileIndex);
                        }
                    }
                    else
                    {
                        handleRemoveProductDescImage(e)
                    }

                }}
                chooseLabel={
                    editMode
                        ? 'Change Product Description Image File'
                        : 'Choose Product Description Image File'
                }
                className={`fileUploadFile ${
                    formik.touched.product_desc_images && formik.errors.product_desc_images
                        ? 'error'
                        : ''
                }`}
                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
            />
            {formik.touched.product_desc_images && formik.errors.product_desc_images ? (
                <small className="p-error">{formik.errors.product_desc_images}</small>
            ) : null}
        </div>
    </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Video provider</label>
                    <Dropdown  placeholder="Select a video provider" 
                        showClear 
                        name="video_provider"
                        options={Videoprovider}
                        optionLabel="provider"
                        optionValue='provider'
                        onChange={(e) => formik.setFieldValue('video_provider', e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.video_provider}
                       className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Video URL</label>
                    <InputText 
                    name="video_url"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.video_url}
                    placeholder="Enther the video url" />
                </div>
            </div>
        </div>
        {/* =====Next Button===== */}
        <div className="flex pt-2 justify-content-end">
            <Button type="button" label="Next" icon="pi pi-arrow-right" className='commanBtn' rounded iconPos="right" onClick={handleNext} />
        </div>
    </div>


{/*==============================
Offer and Specification
=============================== */}

    {/* === Offer and Specification Start Tab body === */}
    <div className={`tab-content ${activeTab === "tab2" ? "tab_active" : ""}`}>
        <div className="grid">
            <div className="col-12 md:col-3">
                <div className="flex flex-column gap-1">
                    <label>Offer Start Date</label>
                    <Calendar 
                        name="offer_start_date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.offer_start_date}
                        readOnlyInput 
                        showTime hourFormat="24"
                        className="small-datepicker"
                        showButtonBar placeholder="Select a offer start date" />
                </div>
            </div>
            <div className="col-12 md:col-3">
                <div className="flex flex-column gap-1">
                    <label>Offer End Date</label>
                    <Calendar
                        name="offer_end_date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.offer_end_date}
                        readOnlyInput
                        showTime hourFormat="24"
                        className="small-calendar"
                        showButtonBar placeholder="Select a offer end date" />
                </div>
            </div>
            <div className='col-12 md:col-3'>
            <div className="flex flex-column gap-1">
                    <label>Discount Type</label>
                    <Dropdown placeholder="Select a discount type" 
                        showClear 
                        name="offer_discount_type"
                        options={discountType}
                        optionLabel="type"
                        optionValue='type'
                        onChange={(e) => {
                            const discountType = e.value;
                            formik.setFieldValue("offer_discount_type", discountType);
                
                            // Recalculate selling prices whenever the discount type changes
                            const discount = formik.values.offer_discount || 0;
                            formik.values.variants.forEach((variant, index) => {
                                const price = variant.price;
                                let sellingPrice = 0;
                
                                if (discountType === "Percentage") {
                                    sellingPrice = price - (price * discount) / 100;
                                } else if (discountType === "Flat Rate") {
                                    sellingPrice = price - discount;
                                }
                
                                // Ensure selling price is not negative
                                sellingPrice = Math.max(Math.ceil(sellingPrice), 0);
                
                                // Update the selling price for each variant
                                formik.setFieldValue(`variants.${index}.selling_price`, sellingPrice);
                            });
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.offer_discount_type}
                       className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-3">
                <div className="flex flex-column gap-1">
                    <label>Discount Value</label>
                    <InputNumber 
                    name="offer_discount"
                    onChange={(e) => {
                        const discount = e.value;
                        const discountType = formik.values.offer_discount_type;
                        formik.setFieldValue("offer_discount", discount);
            
                        // Recalculate selling prices whenever the discount value changes
                        formik.values.variants.forEach((variant, index) => {
                            const price = variant.price;
                            let sellingPrice = 0;
            
                            if (discountType === "Percentage") {
                                sellingPrice = price - (price * discount) / 100;
                            } else if (discountType === "Flat Rate") {
                                sellingPrice = price - discount;
                            }
            
                            // Ensure selling price is not negative
                            sellingPrice = Math.max(Math.ceil(sellingPrice), 0);
            
                            // Update the selling price for each variant
                            formik.setFieldValue(`variants.${index}.selling_price`, sellingPrice);
                        });
                    }}
                    prefix={formik.values.offer_discount_type === "Percentage" ? '%' : generalInfo.currency_symboll}
                    onBlur={formik.handleBlur}
                    value={formik.values.offer_discount_type ? formik.values.offer_discount : ""}
                    disabled={!formik.values.offer_discount_type}
                    placeholder="Enter the discount value" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label> Do You Want to Add in the Flash Sale ?</label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton 
                            name="flash_sale"
                            value="Yes" 
                            inputId="Yes"
                            onChange={(e) => formik.setFieldValue('flash_sale', e.value)}
                            checked={formik.values.flash_sale === 'Yes'}
                            />
                            <label htmlFor="Yes" className="ml-2">Yes</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton  
                            name="flash_sale"
                            value="No"
                            inputId="No"
                            onChange={(e) => formik.setFieldValue('flash_sale', e.value)}
                            checked={formik.values.flash_sale === 'No'}
                            />
                            <label htmlFor="No" className="ml-2">No</label>
                        </div>
                    </div>
                </div>
            </div>
            <Divider align="center">
                <label style={{ fontWeight: "bold" }}>Stock and Tax</label>
            </Divider>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Min Order Qty</label>
                    <InputNumber 
                    name="min_order_qty"
                    onChange={(e)=>formik.setFieldValue('min_order_qty', e.value)}
                    onBlur={formik.handleBlur}
                    value={formik.values.min_order_qty}
                    min={1} // Minimum value
                    placeholder="Enter the min order qty" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Min stock warning</label>
                    <InputNumber 
                    name="min_stock_warning"
                    onChange={(e)=>formik.setFieldValue('min_stock_warning', e.value)}
                    onBlur={formik.handleBlur}
                    value={formik.values.min_stock_warning}
                    placeholder="Enter the min stock warning" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Tax</label>
                    <MultiSelect placeholder="Select a tax"
                        name="tax"
                        options={getTax}
                        optionLabel="joinValue"
                        optionValue="id"
                        filter
                        display="chip"
                        itemTemplate={taxOptionTemplate}
                        onChange={(e) => formik.setFieldValue('tax', e.value)}
                        onBlur={formik.handleBlur}
                        value={formik.values.tax}
                        showClear 
                        className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Skuid *</label>
                    <InputText 
                    name="skuid"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                     value={formik.values.skuid}
                     readOnly
                     placeholder="Enter the Skuid *" className="w-full" />
                </div>
            </div>
        </div>

        {/* =====Next and back Button===== */}
        <div className="flex pt-2 justify-content-between">
            <Button type="button" label="Back" className='backBtn_stepper' rounded severity="secondary" icon="pi pi-arrow-left" onClick={handleBack} />
            <Button type="button" label="Next" icon="pi pi-arrow-right" className='commanBtn' rounded iconPos="right" onClick={handleNext} />
        </div>
    </div>


{/*==============================
Product Variation
=============================== */}
    {/* === Product Variation Start Tab body === */}
    <div className={`tab-content ${activeTab === "tab3" ? "tab_active" : ""}`}>
        <div className="grid">
            <div className="col-12 md:col-12">
                <div className="flex flex-column gap-1">
                    <label>Atribute name</label>
                   
                    <MultiSelect
                        name="attr_name"
                        value={formik.values.attr_name}
                        onBlur={formik.handleBlur}
                        onChange={(e)=>{
                            handleAttributeName(e);
                            formik.setFieldValue('attr_name', e.value)
                        }}
                        // onChange={(e) => {
                        //     setSelectedAttributes(e.value || []); // Update state with fallback
                        //     // Fetch attribute values for the selected attributes
                        //     e.value.forEach((attr) => {
                        //         fetchAttributeValues(attr.id);
                        //     });
                        //     formik.setFieldValue("attr_name", e.value);   
                        // }}
                        options={attributeName}
                        optionLabel="attribute_name"
                        optionValue='id'
                        display="chip"
                        placeholder="Select a attributes name"
                        //maxSelectedLabels={3}
                        className="w-full"
                    />
                </div>
                <Button label="Add Variant" icon="pi pi-plus pt-10" type="button"
                iconPos="right" className="variant_btn mt-3" onClick={addVariant} />
            </div>
        </div>
        
        <div className="grid">
            {/* This start form variant loop */}
            {formik.values.variants.map((variant, index) => (
                <div className="col-12 md:col-12" key={index}>
                    <Panel
                        header={
                            <div className="flex justify-content-between align-items-center">
                                <span className="pr-2">{`Variant ${index + 1}`}</span>
                                {/* Remove the variant click event */}
                                <Button
                                    type="button"
                                    icon="pi pi-times"
                                    rounded severity="danger"
                                    className="p-button-danger p-button-text"
                                    onClick={() => removeVariant(index)}
                                    tooltip="Remove Variant"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                        }
                        key={index} toggleable>
                        <div className="grid">
                            {/* This is important of seleted attribute name show the key value. It's like that loop */}
                            {Object.keys(variant.attributes).map((attrName, attrIndex) => (
                                <div key={attrIndex} className="col-12 md:col-4">
                                    <div className="flex flex-column gap-1">
                                        <label htmlFor={`variants.${index}.attributes.${attrName}`}>{attrName}</label>
                                        {/* Render a dropdown for each attribute */}
                                        <Dropdown
                                            id={`variants.${index}.attributes.${attrName}`}
                                            name={`variants.${index}.attributes.${attrName}`} //Atrribute name
                                            value={formik.values.variants[index].attributes[attrName]}
                                            options={getAttributeOptions(attrName)}
                                            itemTemplate={['color', 'colors'].includes(attrName.toLowerCase()) && colorCodeChangeColor}
                                            onChange={(e) =>
                                                formik.setFieldValue(
                                                    `variants.${index}.attributes.${attrName}`,
                                                    e.value
                                                )
                                            }
                                            onBlur={formik.handleBlur}
                                            placeholder={`Select ${attrName}`}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="col-12 md:col-4">
                                <div className="flex flex-column gap-1">
                                    <label htmlFor={`variants.${index}.stock`}>Stock *</label>
                                    <InputNumber
                                        id={`variants.${index}.stock`}
                                        name={`variants.${index}.stock`}
                                        onChange={(e) =>
                                            formik.setFieldValue(`variants.${index}.stock`, e.value)
                                        }
                                        onBlur={formik.handleBlur}
                                        value={formik.values.variants[index].stock}
                                        placeholder="Enter the stock"
                                        className={formik.errors.variants?.[index]?.stock && formik.touched.variants?.[index]?.stock ? "p-invalid" : ""}
                                    />
                                    {formik.errors.variants?.[index]?.stock && formik.touched.variants?.[index]?.stock && (
                                        <small className="p-error">
                                            {formik.errors.variants[index].stock}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column gap-1">
                                    <label htmlFor={`variants.${index}.price`}>Price *</label>
                                    <InputNumber
                                        id={`variants.${index}.price`}
                                        name={`variants.${index}.price`}
                                        onChange={(e) => {
                                            const newPrice = e.value;  // Get the new price value
                                            // Update the price for the specific variant
                                            formik.setFieldValue(`variants.${index}.price`, newPrice);
                            
                                            // Get the discount and discount type
                                            const discount = formik.values.offer_discount || 0; // Get current discount value
                                            const discountType = formik.values.offer_discount_type; // Get discount type (Percentage/Flat Rate)
                            
                                            let sellingPrice;
                            
                                            // Calculate selling price based on the discount type
                                            if (discountType === "Percentage") {
                                                // Percentage discount calculation
                                                sellingPrice = newPrice - (newPrice * discount) / 100;
                                                sellingPrice = Math.max(Math.ceil(sellingPrice), 0);
                                                formik.setFieldValue(`variants.${index}.selling_price`, sellingPrice);
                                            } else if (discountType === "Flat Rate") {
                                                // Flat rate discount calculation
                                                sellingPrice = newPrice - discount;
                                                sellingPrice = Math.max(Math.ceil(sellingPrice), 0);
                                                formik.setFieldValue(`variants.${index}.selling_price`, sellingPrice);
                                            }
                                           
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.variants[index].price}
                                        placeholder="Enter the price"
                                        prefix={generalInfo.currency_symboll}
                                        className={formik.errors.variants?.[index]?.price && formik.touched.variants?.[index]?.price ? "p-invalid" : ""}
                                    />
                                    {formik.errors.variants?.[index]?.price && formik.touched.variants?.[index]?.price && (
                                        <small className="p-error">
                                            {formik.errors.variants[index].price}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column gap-1">
                                    <label htmlFor={`variants.${index}.selling_price`}>Selling Price</label>
                                    <InputNumber
                                        id={`variants.${index}.selling_price`}
                                        name={`variants.${index}.selling_price`}
                                        onChange={(e)=>formik.setFieldValue(`variants.${index}.selling_price`, e.value)}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.variants[index].selling_price}
                                        placeholder="Enter the selling price"
                                        prefix={generalInfo.currency_symboll}
                                        className={formik.errors.variants?.[index]?.selling_price && formik.touched.variants?.[index]?.selling_price ? "p-invalid" : ""}
                                    />
                                    {formik.errors.variants?.[index]?.selling_price && formik.touched.variants?.[index]?.selling_price && (
                                        <small className="p-error">
                                            {formik.errors.variants[index].selling_price}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <div className="col-12 md:col-12">
                                <div className="flex flex-column gap-1">
                                {formik.values.variants[index]?.images?.some((item) => item.id) && (
                                    <div className="default_image_title" style={{color: '#000', fontWeight: '600', fontSize: '14px'}}>
                                        Default Product Variant Images
                                    </div>
                                    )}
                                {editMode && (
                                    <div className="grid">
                                        {formik.values.variants[index]?.images?.map((image, imgIndex) => (
                                            <div className="col-12 md:col-2 col_custom_width" key={`${index}-${imgIndex}`} style={{marginTop: '-30px'}}>
                                                {/* {image instanceof File ? <div className="empty_remove_image"></div> :
                                                 <button
                                                        type="button"
                                                        className="remove_btn_img_box"
                                                        onClick={() => handleFileUploadRemove(image, index)} // Use handleFileUploadRemove to remove the image
                                                    >
                                                        X
                                                    </button>
                                                } */}
                                                {image.id &&  <button
                                                        type="button"
                                                        className="remove_btn_img_box"
                                                        onClick={() => handleFileUploadRemove(image, index)} // Use handleFileUploadRemove to remove the image
                                                    >
                                                        X
                                                </button>}
                                               
                                                <div className="custom_img_box">
                                                    {image.id &&                                                     <img
                                                        src={image.image} // Check if it's a File or an object with 'image' property
                                                        alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                                                    />}
                                                    {/* <img
                                                        src={image instanceof File ? URL.createObjectURL(image) : image.image} // Check if it's a File or an object with 'image' property
                                                        alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                                                    /> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <label>Product images</label>
                                <FileUpload multiple
                                    name={`variants.${index}.images`}
                                    chooseLabel={editMode ? 'Change product image file' : 'Choose product image file'} // Custom label for "Choose"
                                    onSelect={(event) => handleFileUpload(event, index)}
                                    onRemove={(event) => {
                                        if(editMode)
                                        {
                                            handleFileUploadRemove(event.file, index)
                                        }
                                        else
                                        {
                                            handleFileUploadRemove(event, index)
                                        }
                                    }}
                                    className={`fileUploadFile ${formik.touched.variants?.[index]?.images && formik.errors.variants?.[index]?.images ? 'error' : ''}`}
                                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                                {formik.errors.variants?.[index]?.images && formik.touched.variants?.[index]?.images && (
                                    <small className="p-error">
                                        {formik.errors.variants[index].images}
                                    </small>
                                )}
                                </div>
                            </div>
                        </div>

                    </Panel>
                </div>
            ))}
        </div>
        {/* =====Next and back Button===== */}
        <div className="flex pt-2 justify-content-between">
            <Button type="button" label="Back" className='backBtn_stepper' rounded severity="secondary" icon="pi pi-arrow-left" onClick={handleBack} />
            <Button type="button" label="Next" icon="pi pi-arrow-right" className='commanBtn' rounded iconPos="right" onClick={handleNext} />
        </div>
    </div>
{/*==============================
Shipping Info
=============================== */}
    {/* === Shipping Info Start Tab body === */}
    <div className={`tab-content ${activeTab === "tab4" ? "tab_active" : ""}`}>
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Shipping Fee Type</label>
                    <Dropdown 
                    options={shippingFeeType}
                    optionLabel='type'
                    optionValue='type'
                    onChange={(e)=>{
                        formik.setFieldValue('shipping_fee_type', e.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.shipping_fee_type}
                    showClear 
                    placeholder="Select a shipping fee type" className="w-full" />
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Shipping Fee</label>
                    <InputText
                    name="shipping_fee"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} 
                    value={formik.values.shipping_fee}
                    placeholder="Enter the shipping fee" className="w-full" disabled={formik.values.shipping_fee_type !== "Flat Rate"}/>
                </div>
            </div>
            <div className="col-12 md:col-6">
                <div className="flex flex-column gap-1">
                    <label>Shipping Days</label>
                    <InputText 
                    name="shipping_days"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value = {formik.values.shipping_days}
                    placeholder="Enter the shipping days" className="w-full" />
                </div>
            </div>
            <Divider align="center">
                <label style={{ fontWeight: "bold" }}>Statuses</label>
            </Divider>
            <div className="col-12 md:col-4">
                <div className="flex">
                    <InputSwitch
                    name="refundable"
                    checked={formik.values.refundable}
                    onChange={(e) => formik.setFieldValue('refundable', e.value)}
                    className="mr-2" />
                    <span>Is Product Refundable</span>
                </div>
            </div>
            <div className="col-12 md:col-4">
                <div className="flex">
                    <InputSwitch 
                     name="featured"
                     checked={formik.values.featured}
                     onChange={(e) => formik.setFieldValue('featured', e.value)}
                     className="mr-2" />
                    <span>Add to Featured</span>
                </div>
            </div>
            <div className="col-12 md:col-4">
                <div className="flex">
                    <InputSwitch
                    name="today_deal"
                    checked={formik.values.today_deal}
                    onChange={(e) => formik.setFieldValue('today_deal', e.value)}
                    className="mr-2" />
                    <span>Add to Today's Deal</span>
                </div>
            </div>
        </div>
        {/* =====Next and back Button===== */}
        <div className="flex pt-2 justify-content-between">
            <Button type="button" label="Back" className='backBtn_stepper' rounded severity="secondary" icon="pi pi-arrow-left" onClick={handleBack} />
            <Button type="submit" label='Submit' className='modalButton_btn' rounded severity="success" icon="pi pi-check" /></div>
    </div>
    {/*=======End tab container=====*/}
</div>
</form>
<Toast ref={toast} />
</>
)
}


export default AddProduct
