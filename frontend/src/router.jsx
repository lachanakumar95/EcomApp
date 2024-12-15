
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Layout from './components/Layout';
import ProtectRouter from './utils/ProtectRoute';

//Login
const Login = lazy(()=>import('./pages/auth/Login'));
//Categories
const Categories = lazy(()=>import('./pages/categories/Categories'));
//Add Categorires
const AddCategories = lazy(()=>import('./pages/categories/AddCategories'));
//Sub categories
const Subcategories = lazy(()=>import('./pages/subcategories/Subcategories'));
//Add Sub Categories
const Addsubcategories = lazy(()=>import('./pages/subcategories/Addsubcategories'));
//Brand
const Brand = lazy(()=>import('./pages/brand/Brand'));
//Add Brand
const Addbrand = lazy(()=>import('./pages/brand/Addbrand'));
//Tags
const Tag = lazy(()=>import('./pages/tag/Tag'));
//Add Tag
const Addtag = lazy(()=>import('./pages/tag/Addtag'));
//Attribute
const Attribute = lazy(()=>import('./pages/attribute/Attribute'));
//Add Attribute
const Addattribute = lazy(()=>import('./pages/attribute/Addattribute'));
//Attribute Values
const Atrtributevalues = lazy(()=>import('./pages/attribute/attributevalues/Attributevalues'));
//Add attributevalues
const Addattributevalues = lazy(()=>import('./pages/attribute/attributevalues/Addattributevalues'));
//Product list
const ProductList = lazy(()=>import('./pages/product/Products'));
//Add Product
const AddProduct = lazy(()=>import('./pages/product/AddProduct'));
//Tax
const Tax = lazy(()=>import('./pages/tax/Tax'));
//Settingd
const Settings = lazy(()=>import('./pages/settings/settings'));
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <Login/>,
                index: true,
            },
            {
                element : <ProtectRouter/>,
                children: [
                    {
                        element: <Layout />,
                        children : [
                            {
                                path: 'categories',
                                element:<Categories/>
                            },
                            {
                                path: 'categories/add-categories',
                                element: <AddCategories/>
                            },
                            {
                                path : 'sub-categories',
                                element : <Subcategories/>
                            },
                            {
                                path: 'sub-categories/add-subcategories',
                                element : <Addsubcategories/>
                            },
                            {
                                path : 'brands',
                                element : <Brand/>
                            },
                            {
                                path : 'brands/add-brand',
                                element : <Addbrand/>
                            },
                            {
                                path : 'tags',
                                element : <Tag/>
                            },
                            {
                                path :'tags/add-tag',
                                element : <Addtag/>
                            },
                            {
                                path : 'attributes',
                                element : <Attribute/>
                            },
                            {
                                path: 'attributes/add-attribute',
                                element : <Addattribute/>
                            },
                            {
                                path: 'attributes/attributevalues',
                                element : <Atrtributevalues/>
                            },
                            {
                                path: 'attributes/add-attributevalues',
                                element : <Addattributevalues/>
                            },
                            {
                                path: 'products',
                                element: <ProductList/>
                            },
                            {
                                path : 'products/add-product',
                                element : <AddProduct/>
                            },
                            {
                                path : 'tax',
                                element : <Tax/>
                            },
                            {
                                path : 'settings',
                                element : <Settings/>
                            }
                        ]
                    }
                ]
            },
        ]
    },
   
]);

export default router;