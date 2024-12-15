import axiosInstance from "../../config/axiosConfig";
//====Get attrubute name Api
const getAttributeName = async ()=>{
    try
    {
        const result = await axiosInstance.get('/admin/attribute');
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting data form product services :", err);
        throw err;
    }

}
//Get attribute values
const getAttributevalues = async (getID)=>{
    try{
        const result = await axiosInstance.get(`/admin/attributevalues/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error("Error fecting from attribute values services :", err);
        throw err;
    }
}
//Get Category
//Parrent Categories data get
const getCategories = async ()=>{
    try
    {
        const response = await axiosInstance.get('/admin/category');
        return response.data;
    }
    catch(err)
    {
        console.error('Error fetching categories from product services:', err);
        throw err;
    }
}
//Get subcategory data
const getSubCategory = async (ID)=>{
    try
    {
        if(ID === null)
        {
            return;
        }
        const result = await axiosInstance.get(`/admin/subcategory/${ID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Fecting data get sub category form product services:', err);
        throw err;
    }
}
//Get brand data
const getBrandData = async ()=>{
    try
    {
        const result = await axiosInstance.get('/admin/brand');
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting get brand data form product services :", err);
        throw err;
    }
}

//Get tax data
const getTaxData = async ()=>{
    try
    {
        const result = await axiosInstance.get('/admin/tax');
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting get brand data form product services :", err);
        throw err;
    }
}

const getTagsData = async ()=>{
    try
    {
        const result = await axiosInstance.get('/admin/tags');
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting get tags from product services :", err);
        throw err;
    }
}

//Create a Products
const createProducts = async (getValues)=>{
    try
    {
        const result = await axiosInstance.post('/product', getValues, {
            headers : {
                 "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.error('Error from product services for create record :', err);
        throw err;
    }
}

//Update the products
const updateProducts = async (getProductId, getValues)=>{
    try
    {
        const result = await axiosInstance.put(`/product/${getProductId}`, getValues, {
            headers : {
               "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.log("Update the product error from product services :", err);
        throw err;
    }
}

//Get all product
const getAllProducts = async ()=>{
    try
    {
        const result = await axiosInstance('/product');
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting error from product services :", err);
        throw err;
    }
}

//Product published
const published = async (IDValues)=>{
    try
    {
        const result = await axiosInstance.put(`product/published/${IDValues}`);
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting error from product services published :", err);
        throw err;
    }
}

//Product Outofstock
const outOfStock = async (IDValues)=>{
    try
    {
        const result = await axiosInstance.put(`product/outOfStock/${IDValues}`);
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting error from product services outOfStock :", err);
        throw err;
    }
}


//Company general information

const genealInfomation = async ()=>{
    try
    {
        const result = await axiosInstance.get('/generalinfo')
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching data:', err);
        throw err;
    }
}
export {getAttributeName, getAttributevalues, getCategories, getSubCategory,
     getBrandData, getTagsData, getTaxData, createProducts, updateProducts,
    getAllProducts, genealInfomation, published, outOfStock};