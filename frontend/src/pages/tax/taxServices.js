import axiosInstance from "../../config/axiosConfig";

//Add Tax Data
const addTax = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/tax', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Add data from tax services :", err);
        throw err;
    }
}

//Update Tax Data
const updateTax = async (values, IDValues)=>{
    try
    {
        const result = await axiosInstance.put(`/tax/${IDValues}`, values);
        return result.data;
    }
    catch(err)
    {
        console.log("Add data from tax services :", err);
        throw err;
    }
}
//Tax published
const published = async (getID)=>{
    try
    {
        const result = await axiosInstance.put(`/admin/published/${getID}`);
        return result.data;
    }
    catch(err)
    {
        console.error('Error fetching categories published:', err);
    }
}
const getTax = async ()=>{
    try
    {
        const result = await axiosInstance.get('/tax');
        return result.data;
    }
    catch(err)
    {
        console.log("Error fecting from tax services :", err);
        throw err;
    }
}

export {addTax, updateTax, published, getTax};