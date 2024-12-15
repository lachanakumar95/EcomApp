import React, { useState, useRef, useEffect } from 'react';
//logo
import logo from '../../assets/logo.png';
import logoimage from '../../assets/login_img.png';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
//React Router
import { Link, useNavigate } from 'react-router-dom'
// Form Validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
//Login Services
import { isLogin } from './AuthServices';
import axiosInstance from '../../config/axiosConfig';
//Cookies
import Cookies from 'js-cookie';

function Login() {
    //Toaster
    const toast = useRef(null);
    //Showpasswoard state
    const [showPassword, setShowPassword] = useState(false);
    //Navigate
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email addreess filed required').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
            password: Yup.string().required('Password filed required'),
        }),
        onSubmit: (values) => {
            adminLogin(values);
           
        }
    });
    // API call the function
    const adminLogin = async (getvalues) => {
        try
        {
            const result = await isLogin(getvalues);
            if(result.success)
            {
                //toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                Cookies.set("X_AUTH_TOKEN", result.token);
                navigate('/dashboard');
            }
            else{
                toast.current.show({ severity: 'error', summary: 'error', detail: result.message });
            }
        }
        catch(err)
        {
            if(err.code === "ERR_NETWORK")
            {
                toast.current.show({ severity: 'error', summary: 'error', detail: `${err.message} or API server not start` });
            }
            console.error('Error admin login:', err);
        }
    }
    const [dblogo, setDbLogo] = useState();
    useEffect(()=>{
      const getLogoFromDb = async ()=>{
          try
          {
              const result = await axiosInstance.get('/generalinfo');
              setDbLogo(result.data.data[0]);
          }
          catch(err)
          {
              console.log("Error fecting :", err);
          }
      }
      getLogoFromDb();
    },[]);

    useEffect(() => {
        const siteName = dblogo?.site_name || "Ecommerce Application";
        document.title = siteName;
    }, [dblogo]);

    return (
        <>
            <div className="login">
                <div className="grid">
                    <div className="col-12 md:col-4 sm:col-12">
                        <div className="login_box">
                            <div style={{ textAlign: 'center' }}>
                                <img src={dblogo?.image || logo} alt="logo" className="logo" />
                            </div>
                            <h1>Welcome✌</h1>
                            <p>Enter your credential to login</p>
                            <form onSubmit={formik.handleSubmit}>
                                <div>
                                    <label htmlFor="Email Address" style={{ paddingLeft: '18px' }}>Email Address</label>
                                    <InputText type="text"
                                        name="email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        placeholder="Enter the email address"
                                        invalid={formik.touched.email && formik.errors.email ? true : false}
                                        className="p-inputtext-lg login_text_box" />
                                    <small style={{ paddingLeft: '18px', color: 'red' }}>
                                        {formik.touched.email && formik.errors.email ? <>{formik.errors.email}</> : ""}
                                    </small>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <label htmlFor="Password" style={{ paddingLeft: '18px' }}>Password</label>
                                    <InputText type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        placeholder="Enter the password"
                                        invalid={formik.touched.password && formik.errors.password ? true : false}
                                        className="p-inputtext-lg login_text_box" />
                                    <i
                                        className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`}
                                        style={{
                                            position: 'absolute',
                                            transform: 'translateY(-50%)',
                                            marginLeft: '-40px',
                                            marginTop: '33px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={togglePasswordVisibility}
                                    ></i>
                                    <small style={{ paddingLeft: '18px', color: 'red' }}>
                                        {formik.touched.password && formik.errors.password ? <>{formik.errors.password}</> : ""}
                                    </small>
                                </div>
                                <Link to='' className="forget_password">Forget Password?</Link>
                                <Button type="submit" label="Login" className="login_btn" style={{ width: '100%' }} />
                            </form>

                        </div>

                    </div>
                    <div className="col-12 md:col-8 sm:col-12">
                        <div className="login_card">
                            <img src={logoimage} alt="" />
                            <h1>Your One - Stop Online Shop for<br /> Everything You Need!</h1>
                            <p>Discover the ultimate online shopping experience with our eCommerce store, offering a wide range of products to suit your lifestyle. Shop now for the best deals, fast delivery, and top-notch customer service!</p>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </>
    )
}

export default Login
