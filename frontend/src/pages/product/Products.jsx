import React, { useEffect, useState, useRef } from 'react'
//React router dom
import { useNavigate, useLocation } from 'react-router-dom';
//PrimeReact
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ConfirmDialog } from 'primereact/confirmdialog';
// import { confirmDialog } from 'primereact/confirmdialog';

//Services
import {getAllProducts, genealInfomation, published, outOfStock} from './productServices';

function Products() {
   //Toast state
   const toast = useRef(null);
  //Api Data Store state
  const [data, setData] = useState([]);
  //Genralinfo
  const [generalInfo, setGeneralInfo] = useState({});
  // For global search for datatable
  const [globalFilter, setGlobalFilter] = useState("");
  //Navigate
  const navigate = useNavigate();
  //useLocatio
  const location = useLocation();


  //Datatable sno generate
  const snoBodyTemplate = (rowData, options) => {
    return options.rowIndex + 1; // Row index starts from 0, add 1 for S.No
  };

  //Datatable image show
  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.product_thumbnail_path} alt={rowData.product_thumbnail_path} className="img_table" />;
  };

  //Datatable published enable
  const publishedBodyTemplate = (rowData) => {
    console.log(rowData);
    return <InputSwitch checked={rowData.published} onChange={() => {
      publishedProduct(rowData._id);
    }} />
  }

  //Datatable action button
  const actionBodyTemplate = (rowData) => {
    return <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }}
        onClick={() => {
          navigate('/products/add-product', {
            state: {
              editMode: true,
              product: rowData
            }
          });
        }} />
    </div>
  }

  //Price show
  const priceBodyTemplate = (rowData)=>{
    const price = rowData.variants?.[0]?.price;
    const formattedPrice = price !== undefined && price !== null 
    ? price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    : "-";
    return <>
     <label>{generalInfo.currency_symboll !== undefined ? formattedPrice == "-" ? '-' :  `${generalInfo.currency_symboll} ${formattedPrice}`
          : formattedPrice == "-" ? '-' :  `${formattedPrice}`  
        }</label>
    </>;
  }

  //Selling price
  const sellingPriceBodyTemplate = (rowData) => {
    const sellingPrice = rowData.variants?.[0]?.selling_price;
  
    // Format the price if it exists, otherwise use a fallback like "N/A" or 0
    const formattedPrice = sellingPrice !== undefined && sellingPrice !== null 
      ? sellingPrice.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "-"; // Fallback if price is missing
  
    return (
      <>
          <label>{generalInfo.currency_symboll !== undefined ? formattedPrice == "-" ? '-' :  `${generalInfo.currency_symboll} ${formattedPrice}`
          : formattedPrice == "-" ? '-' :  `${formattedPrice}`  
        }</label>
      </>
    );
  };

   //Datatable Stock  enable
   const stockBodyTemplate = (rowData) => {
    return <InputSwitch checked={rowData.outOfStockProduct} onChange={() => {
      outOfStockProduct(rowData._id);
    }} />
  }

    // Render header with global search
    const renderHeader = () => {
      return (
        // <div className="table-header flex justify-content-between align-items-center">
        <div className="grid flex flex-column md:flex-row">
          <div className='col-12 md:col-4'>
            <div className='page_title'>Products</div>
          </div>
          <div className="col-12 md:col-8 md:flex justify-content-end">
            <div className="p-input-icon-left search_textbox_table">
              <i className="pi pi-search" />
              <InputText
                type="search"
                value={globalFilter}
                onInput={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search products..."
              />
            </div>
            <Button label="Add Product" icon="pi pi-plus" className="commanBtn" rounded
              onClick={() => {
                navigate('/products/add-product', {
                  state: {
                    editMode: false
                  }
                });
              }} />
          </div>
  
        </div>
      );
    };
    //Datatable header call the function
    const header = renderHeader();

  //Api Call the load the product data
  const loadApiData = async ()=>{
    try
    {
      const result = await getAllProducts();
      if(result.success)
      {
        setData(result.data);
      }
    }
    catch(err)
    {
      console.error('Load api data from product component', err);
    }
  }

  //Published product
  const publishedProduct = async (ID)=>{
    try
    {
      const result = await published(ID);
      if(result.success)
      {
        toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
        loadApiData();
      }
      else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
      }
    }
    catch(err)
    {
      console.error('Published product from product component', err);
    }
  }

  //Published OutofStock
  const outOfStockProduct = async (ID)=>{
    try
    {
      const result = await outOfStock(ID);
      if(result.success)
      {
        toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
        loadApiData();
      }
      else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
      }
    }
    catch(err)
    {
      console.error('Published product from product component', err);
    }
  }
  
  const companyGeneralInfo = async ()=>{
    try
    {
        const result = await genealInfomation();
        if(result.success)
        {
          setGeneralInfo(result.data[0]);
        }
    }
    catch(err)
    {
        console.error('General Info:', err);
    }
}
  useEffect(()=>{
    loadApiData();
    companyGeneralInfo();
    //Location state
    if (location.state?.toast) {
      toast.current.show(location.state.toast);
    }
     // Clear the state after showing the toast
     navigate(location.pathname, { replace: true });
  },[location.state]);
  return (
    <>
{/*Primereact Table*/}
<DataTable value={data}
        size="small"
        paginator // Enables pagination
        rows={10} // Number of rows per page
        rowsPerPageOptions={[5, 10, 20]} // Rows per page dropdown
        globalFilter={globalFilter} // Enables global filtering
        header={header} // Table header with search
        sortMode="multiple" // Allows multi-column sorting
        tableStyle={{ minWidth: '50rem' }}>
        <Column header="S.No" body={snoBodyTemplate}></Column>
        <Column header="Image" body={imageBodyTemplate}></Column>
        <Column field="product_name" sortable header="Product Name" className='text_product_name'></Column>
        <Column field="fk_category.category_name" sortable header="Category"></Column>
        <Column sortable header="Price" body={priceBodyTemplate}></Column>
        <Column sortable header="Selling Price" body={sellingPriceBodyTemplate}></Column>
        <Column header="Published" body={publishedBodyTemplate}></Column>
        <Column header="Out of Stock" body={stockBodyTemplate}></Column>
        <Column header="Actions" body={actionBodyTemplate}></Column>
      </DataTable>
      <Toast ref={toast} />
    </>
  )
}

export default Products
