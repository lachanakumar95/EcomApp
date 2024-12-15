import axiosInstance from "../../config/axiosConfig";

const createTag= async (values)=>{
    try
    {
        const result = await axiosInstance.post('/tags', values, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })
        return result.data;
    }
    catch(err)
    {
        console.log('Error Add Record from tag services :', err);
        throw err;
    }
}
const editTag = async (values, id)=>{
    try
    {
        const result = await axiosInstance.put(`/tags/${id}`, values, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        })
        return result.data;
    }
    catch(err)
    {
        console.log('Error Edit Record from tag services :', err);
        throw err;
    }
}
const deleteTag = async (getID)=>{
    try
    {
        const result = await axiosInstance.delete(`/tags/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error deleting tag from services:', err);
        throw err;
    }
}
const getTagData = async ()=>{
    try
    {
        const result = await axiosInstance.get('/tags');
        return result.data;
    }
    catch(err)
    {
        console.error('Error fecting from tag services "', err);
        throw err;
    }
}

const published = async (ID)=>{
    try
    {
        const result = await axiosInstance.put(`/tags/published/${ID}`);
        return result.data;
    }
    catch(err)
    {
        console.log('Error fecting form tag services for published', err);
        throw err;
    }
}
export {getTagData, createTag, editTag, deleteTag, published};