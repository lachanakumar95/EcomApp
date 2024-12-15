import axiosInstance from "../../config/axiosConfig";

//Parrent Categories data get
const getCategories = async ()=>{
    try
    {
        const response = await axiosInstance.get('/admin/category');
        return response.data;
    }
    catch(err)
    {
        console.error('Error fetching categories:', err);
        throw err;
    }
}

const createSubCategory = async (getData)=>{
    try
    {
        const result = await axiosInstance.post('/subcategory', getData, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.error('Error creating subcategories:', err);
        throw err;
    }
}
const editSubCategory = async (getValues, IDvalue)=>{
    try
    {
        const result = await axiosInstance.put(`/subcategory/${IDvalue}`, getValues, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.error('Error Editing subcategories:', err);
        throw err;
    }
}
const getSubcategories = async ()=>{
    try
    {
        const result = await axiosInstance.get('/subcategory');
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching subcategories:', err);
        throw err;
    }
}
const deleteSubCategory = async (getID)=>{
    try
    {
        const result = await axiosInstance.delete(`/subcategory/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error deleting categories:', err);
        throw err;
    }
}
const published = async (getID)=>{
    try
    {
        const result = await axiosInstance.put(`/subcategory/published/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching subcategories published:', err);
    }
}

const homeDisplay = async (getID)=>{
    try
    {
        const result = await axiosInstance.put(`/subcategory/hoemdisplay/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching subcategories published:', err);
    }
}
export {getCategories, createSubCategory, editSubCategory, getSubcategories, deleteSubCategory, published, homeDisplay};