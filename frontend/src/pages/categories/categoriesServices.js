import axiosInstance from "../../config/axiosConfig";

const createCategory = async (getData)=>{
    try
    {
        const result = await axiosInstance.post('/category', getData, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.error('Error creating categories:', err);
        throw err;
    }
}
const editCategory = async (getValues, IDvalue)=>{
    try
    {
        const result = await axiosInstance.put(`/category/${IDvalue}`, getValues, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.error('Error Editing categories:', err);
        throw err;
    }
}
const getCategories = async ()=>{
    try
    {
        const response = await axiosInstance.get('/category');
        return response.data;
    }
    catch(err)
    {
        console.error('Error fetching categories:', err);
        throw err;
    }
}
const deleteCategory = async (getID)=>{
    try
    {
        const result = await axiosInstance.delete(`/category/${getID}`);
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
        const result = await axiosInstance.put(`/category/published/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching categories published:', err);
    }
}

const homeDisplay = async (getID)=>{
    try
    {
        const result = await axiosInstance.put(`/category/hoemdisplay/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching categories published:', err);
    }
}
export {createCategory, editCategory, getCategories, deleteCategory, published, homeDisplay};