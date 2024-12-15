import axiosInstance from '../../config/axiosConfig';

//Login
const isLogin = async (loginData)=>{
    try
    {
        const response = await axiosInstance.post('/admin/login', loginData);
        return response.data;
    }
    catch(err)
    {
        console.error('Error fetching data:', err);
        throw err;
    }
}

//Get logo
const getGeneralInfo = async ()=>{
    try
    {
        const result = await axiosInstance.get('/generalinfo');
        return result.data;
    }
    catch(err)
    {
        console.error("Get Data from general information :", err);
        throw err;
    }
}
// Export the service functions
export {
    isLogin,
    getGeneralInfo
};

