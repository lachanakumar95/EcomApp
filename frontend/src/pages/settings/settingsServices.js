import axiosInstance from "../../config/axiosConfig"

const createUpdateGeneralInfo = async (getValues)=>{
    try
    {
        const result = await axiosInstance.post('/generalinfo', getValues, {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        });
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services general info :", err);
        throw err;
    }
}

const createUpdateCompanyDetails = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/companyinfo', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services company details :", err);
        throw err;
    }
}

const createUpdateMetaContent = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/metadatainfo', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services :", err);
        throw err;
    }
}

const createUpdateAboutus = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/aboutusinfo', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services :", err);
        throw err;
    }
}

const createUpdatePolicy = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/policymangement', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services :", err);
        throw err;
    }
}

const createUpdateContactus = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/contactinfo', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services :", err);
        throw err;
    }
}

const createUpdateLoginConfig = async (values)=>{
    try
    {
        const result = await axiosInstance.post('/loginconfig', values);
        return result.data;
    }
    catch(err)
    {
        console.log("Record insert and update error from services :", err);
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

export {createUpdateGeneralInfo, genealInfomation, createUpdateCompanyDetails,
     createUpdateMetaContent, createUpdateAboutus, createUpdatePolicy, createUpdateContactus, createUpdateLoginConfig};