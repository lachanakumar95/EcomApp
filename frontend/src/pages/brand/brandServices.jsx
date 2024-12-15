import axiosInstance from "../../config/axiosConfig";

const createBrand = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/brand', values, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })
        return result.data;
    }
    catch(err)
    {
        console.log('Error Add Record from brand services :', err);
        throw err;
    }
}
const editBrand = async (values, id)=>{
    try
    {
        const result = await axiosInstance.put(`/brand/${id}`, values, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })
        return result.data;
    }
    catch(err)
    {
        console.log('Error Edit Record from brand services :', err);
        throw err;
    }
}
const deleteBrand = async (getID)=>{
    try
    {
        const result = await axiosInstance.delete(`/brand/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error deleting brand from services:', err);
        throw err;
    }
}
const getBrandData = async ()=>{
    try
    {
        const result = await axiosInstance.get('/brand');
        return result.data;
    }
    catch(err)
    {
        console.error('Error fecting from brand services "', err);
        throw err;
    }
}

const published = async (ID)=>{
    try
    {
        const result = await axiosInstance.put(`/brand/published/${ID}`);
        return result.data;
    }
    catch(err)
    {
        console.log('Error fecting form brand services for published', err);
        throw err;
    }
}
export {getBrandData, createBrand, editBrand, deleteBrand, published};