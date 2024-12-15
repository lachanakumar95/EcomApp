import axiosInstance from "../../config/axiosConfig";

const createAttribute = async (getValues)=>{
    try
    {
        const result = await axiosInstance.post('/attribute', getValues);
        return result.data;
    }
    catch(err)
    {
        console.error("Add data from attribute services :", err);
        throw err;
    }
}

const editAttribute = async (getValues, ID)=>{
    try
    {
        const result = await axiosInstance.put(`/attribute/${ID}`, getValues);
        return result.data;
    }
    catch(err)
    {
        console.error("Error edit data from attribute services :", err);
        throw err;
    }
}

const getAttribute = async ()=>{
    try
    {
        const result = await axiosInstance.get('/attribute');
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting error data from attribute services :", err);
        throw err;
    }
}
const deleteAttribute = async (ID)=>{
    try
    {
        const result = await axiosInstance.delete(`/attribute/${ID}`);
        return result.data;
    }
    catch(err)
    {
        console.error("Fecting error data from attribute services delet:", err);
        throw err;
    }
}
const published = async (ID)=>{
    try
    {
        const result = await axiosInstance.put(`/attribute/published/${ID}`);
        return result.data;
    }
    catch(err)
    {
        console.log("Fecting error data from attribute services published", err)
        throw err;
    }
}

export {createAttribute, editAttribute, deleteAttribute, getAttribute, published};