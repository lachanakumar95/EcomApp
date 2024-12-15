import React, { useEffect, useState, useRef } from 'react'
//Formik
import {useFormik} from 'formik';
import * as Yup from 'yup';

import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';

//Services
import {addTax, updateTax, getTax, published} from './taxServices';

function Tax() {
  //Api Data State
  const [data, setData] = useState([]);
  //Update tax Id State
  const [taxID, setTaxID] = useState(null);
  //Toast sate
  const toast = useRef(null);
  // For global search for datatable
  const [globalFilter, setGlobalFilter] = useState("");
  //Modal visiable
  const [visible, setVisible] = useState(false);
  //Editmode
  const [editMode, setEditMode] = useState(false);

  //Initial Formik 
  const formik = useFormik({
    initialValues : {
      tax_type : "",
      percentage : ""
    },
    validationSchema : Yup.object({
      tax_type: Yup.string().required('Tax type filed required'),
      percentage: Yup.number().required('Percentage filed required')
      .min(1, 'Percentage must be greater than or equal to 1')
      .max(100, 'Percentage must be less than or equal to 100'),
    }),
    onSubmit : (values)=>{
      if(editMode)
      {
        updateTaxData(values);
      }
      else
      {
        addTaxData(values);
      }
    }
  });
  //Datatable sno generate
  const snoBodyTemplate = (rowData, options) => {
    return options.rowIndex + 1; // Row index starts from 0, add 1 for S.No
};
 //Datatable published enable
    const publishedBodyTemplate = (rowData) => {
        return <InputSwitch checked={rowData.published} onChange={() => {
          Publishedtax(rowData._id);
        }} />
    }

    //Datatable action button
    const actionBodyTemplate = (rowData) => {
        return <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                  setEditMode(true);
                  setTaxID(rowData._id);
                  formik.setValues({
                    tax_type : rowData.tax_type,
                    percentage : rowData.percentage
                  });
                  setVisible(true);
                }}
            />
        </div>
    }
   // Render header with global search
  const renderHeader = () => {
      return (
          // <div className="table-header flex justify-content-between align-items-center">
          <div className="grid flex flex-column md:flex-row">
              <div className='col-12 md:col-4'>
                  <div className='page_title'>Tax & Vat</div>
              </div>
              <div className="col-12 md:col-8 md:flex justify-content-end">
                  <div className="p-input-icon-left search_textbox_table">
                      <i className="pi pi-search" />
                      <InputText
                          type="search"
                          value={globalFilter}
                          onInput={(e) => setGlobalFilter(e.target.value)}
                          placeholder="Search tax & vat..."
                      />
                  </div>
                  <Button label="Add Tax & Vat" icon="pi pi-plus" className="commanBtn" rounded
                      onClick={() => {
                        setEditMode(false);
                        formik.resetForm();
                        setVisible(true);
                      }}
                  />
              </div>

          </div>
      );
  };
  //Datatable header call the function
  const header = renderHeader();

  //Add Tax Data
  const addTaxData = async (values)=>{
    try
    {
      const result = await addTax(values);
       if(result.success)
       {
        toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
        formik.resetForm();
        loadApiData();
        setVisible(false);
       }
       else
       {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
       }
    }
    catch(err)
    {
      console.log("Error add data from tax component :", err);
    }
  }

    //Add Tax Data
    const updateTaxData = async (values)=>{
      try
      {
        const result = await updateTax(values, taxID);
         if(result.success)
         {
          toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
          formik.resetForm();
          loadApiData();
          setVisible(false);
         }
         else
         {
          toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
         }
      }
      catch(err)
      {
        console.log("Error add data from tax component :", err);
      }
    }

    //Published
  const Publishedtax = async (ID) => {
    try {
      const result = await published(ID);
      if (result.success) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
        loadApiData();
      }
      else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
      }
    }
    catch (err) {
      console.error('Error category component published:', err);
    }
  }
  //Get Tax data
  const loadApiData = async()=>{
    try
    {
      const result = await getTax();
      if(result.success)
      {
        setData(result.data);
      }
      else
      {
        setData([]);
      }
    }
    catch(err)
    {
      console.log("Error fecting from tax component :", err);
    }
  }
  useEffect(()=>{
    loadApiData();
  },[]);
  return (
    <>
      {/*Primereact Table*/}
        <DataTable
            value={data}
            size="small"
            paginator // Enables pagination
            rows={10} // Number of rows per page
            rowsPerPageOptions={[5, 10, 20]} // Rows per page dropdown
            globalFilter={globalFilter} // Enables global filtering
            header={header} // Table header with search
            sortMode="multiple" // Allows multi-column sorting
            tableStyle={{ minWidth: '50rem' }}>
            <Column header="S.No" body={snoBodyTemplate}></Column>
            <Column field="tax_type" sortable header="Tax Type"></Column>
            <Column field="percentage" sortable header="Percentage(%)"></Column>
            <Column header="Published" body={publishedBodyTemplate}></Column>
            <Column header="Actions" body={actionBodyTemplate}></Column>
        </DataTable>

        <Dialog header={editMode ? 'Update Tax & Vat' : 'Add Taxt & Vat'} visible={visible} maximizable style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
          <form onSubmit={formik.handleSubmit}>
            <div className='grid'>
                <div className='col-12 md:col-6'>
                  <div className="flex flex-column gap-2">
                    <label style={{fontWeight: 600, color: '#000', marginBottom: '-5px'}}>Tax Type</label>
                    <InputText
                      name="tax_type"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.tax_type}
                      invalid={formik.touched.tax_type && formik.errors.tax_type}
                      placeholder='Enter the tax type'
                    />
                    {formik.touched.tax_type && formik.errors.tax_type ? (
                      <small style={{ color: '#e24c4c' }}>
                        {formik.errors.tax_type}
                      </small>
                    ) : null}
                  </div>
                </div>

                <div className='col-12 md:col-6'>
                  <div className="flex flex-column gap-2">
                    <label style={{fontWeight: 600, color: '#000', marginBottom: '-5px'}}>Percentage</label>
                    <InputNumber
                      name="percentage"
                      onChange={(e)=>formik.setFieldValue('percentage', e.value)}
                      onBlur={formik.handleBlur}
                      value={formik.values.percentage}
                      invalid={formik.touched.percentage && formik.errors.percentage}
                      prefix='%'
                      placeholder='Enter the percentage'
                    />
                    {formik.touched.percentage && formik.errors.percentage ? (
                      <small style={{ color: '#e24c4c' }}>
                        {formik.errors.percentage}
                      </small>
                    ) : null}
                  </div>
                </div>
            </div>
             <div className="flex md:justify-content-end gap-2 pt-3">
                <Button type="button" label="Clear" className='modalButton_btn' rounded severity="warning" icon="pi pi-times" onClick={() => { formik.resetForm() }} />
                <Button type="submit" label={editMode ? 'Update' : 'Submit'} className='modalButton_btn' rounded severity="success" icon="pi pi-check" autoFocus />
              </div>
          </form>
      </Dialog>
      <Toast ref={toast} />
    </>
  )
}

export default Tax
