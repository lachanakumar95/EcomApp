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
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
//Services
import { getAttribute, published, deleteAttribute } from './attributeServices';


function Attribute() {

    //Toast state
    const toast = useRef(null);
    //Set data from api
    const [data, setdata] = useState([]);
    // For global search for datatable
    const [globalFilter, setGlobalFilter] = useState("");
    //navigate
    const navigate = useNavigate();
    //location
    const location = useLocation();

    //Published
    const publishedData = async (getId) => {
        try {
            const result = await published(getId);
            if (result.success) {
                loadDataApi();
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
            }
            else {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
            }
        }
        catch (err) {
            console.error("Error fecting data from attribute component :", err);
        }
    }
    //Delete Attribute data

    const deleteAttributeData = async (getIDValues) => {
        try {
            const result = await deleteAttribute(getIDValues);
            if (result.success) {
                loadDataApi();
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
            }
        }
        catch (err) {
            console.error("Error fecting data from attribute component :", err);
        }
    }
    //Load data from Api
    const loadDataApi = async () => {
        try {
            const result = await getAttribute();
            if (result.success) {
                setdata(result.data);
            }
            else {
                setdata([]);
            }
        }
        catch (err) {
            console.error("Error fecting from attribute component :", err);
        }
    }
    //Datatable sno generate
    const snoBodyTemplate = (rowData, options) => {
        return options.rowIndex + 1; // Row index starts from 0, add 1 for S.No
    };
    //Datatable published enable
    const publishedBodyTemplate = (rowData) => {
        return <InputSwitch checked={rowData.published} onChange={() => {
            publishedData(rowData.id);
        }} />
    }
    //Datatable action button
    const actionBodyTemplate = (rowData) => {
        return <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    navigate('/attributes/add-attribute', {
                        state: {
                            editMode: true,
                            attribute: rowData,
                        }
                    });
                }}
            />
            <Button icon="pi pi-trash" rounded severity="danger" tooltip="Delete" tooltipOptions={{ position: 'top' }}
                className="delete_option"
                onClick={() => {
                    confirmDialog({
                        message: 'Do you want to delete this record?',
                        header: 'Delete Confirmation',
                        icon: 'pi pi-exclamation-triangle',
                        defaultFocus: 'reject',
                        acceptClassName: 'p-button-danger',
                        accept: () => {
                            deleteAttributeData(rowData.id);
                        },
                        reject: () => {
                            //console.log("Rejected!");
                        }
                    });
                }}
            />
        </div>
    }
    //Attribute value 
    const attributeViewBodyTemplate = (rowData) => {
        return <Button label="values" icon="pi pi-eye" rounded severity="warning"
            className='attr_values_btn'
            tooltip="View Attribute Values" tooltipOptions={{ position: 'top' }}
            onClick={()=>{
                navigate('/attributes/attributevalues', {
                    state: {
                        attribute : rowData
                    }
                });
            }}
        />
    }
    // Render header with global search
    const renderHeader = () => {
        return (
            // <div className="table-header flex justify-content-between align-items-center">
            <div className="grid flex flex-column md:flex-row">
                <div className='col-12 md:col-4'>
                    <div className='page_title'>Attributes</div>
                </div>
                <div className="col-12 md:col-8 md:flex justify-content-end">
                    <div className="p-input-icon-left search_textbox_table">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilter}
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search attributes..."
                        />
                    </div>
                    <Button label="Add Attributes" icon="pi pi-plus" className="commanBtn" rounded
                        onClick={() => {
                            navigate('/attributes/add-attribute')
                        }}
                    />
                </div>

            </div>
        );
    };
    //Datatable header call the function
    const header = renderHeader();

    useEffect(() => {
        loadDataApi();
        if (location.state?.toast) {
            toast.current.show(location.state.toast);
        }
        // Clear the state after showing the toast
        navigate(location.pathname, { replace: true });
    }, [location.state]);
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
                <Column field="attribute_name" sortable header="Attribute Name"></Column>
                <Column header="Published" body={publishedBodyTemplate}></Column>
                <Column header="View Values" body={attributeViewBodyTemplate}></Column>
                <Column header="Actions" body={actionBodyTemplate}></Column>
            </DataTable>


            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    )
}

export default Attribute
