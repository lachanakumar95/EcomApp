import axiosInstance from "../../../config/axiosConfig";

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

const getAllAttributevalues = async ()=>{
    try{
        const result = await axiosInstance.get('/attributevalues');
        return result.data;
    }
    catch(err)
    {
        console.error("Error fecting from attribute values services :", err);
        throw err;
    }
}

const getAttributevalues = async (getID)=>{
    try{
        const result = await axiosInstance.get(`/attributevalues/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error("Error fecting from attribute values services :", err);
        throw err;
    }
}

const createAttributevalues = async (getValues)=>{
    try
    {
        const result = await axiosInstance.post('/attributevalues', getValues);
        return result.data;
    }
    catch(err)
    {
        console.error("Error Fecting from attribute values services create record :", err);
        throw err;
    }
}

const editAttributevalues = async (getValues, idvalue)=>{
    try
    {
        const result = await axiosInstance.put(`/attributevalues/${idvalue}`, getValues);
        return result.data;
    }
    catch(err)
    {
        console.error("Error Fecting from attribute values services create record :", err);
        throw err;
    }
}

const published = async (ID)=>{
    try
    {
        const result = await axiosInstance.put(`/attributevalues/published/${ID}`);
        return result.data;
    }
    catch(err)
    {
        console.error("Error Fecting from attribute values services published :", err);
        throw err;
    }
}

export {getAttribute, getAttributevalues, getAllAttributevalues, createAttributevalues, editAttributevalues, published};