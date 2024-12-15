import React, { useEffect, useState, useRef } from 'react'
//React router dom
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { getAttributevalues, getAllAttributevalues, published } from './attributevaluesSerivice';
function Attributevalues() {
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

    //load API value
    const loadApiData = async (getIdValues) => {
        try {
            const result = await getAttributevalues(getIdValues);
            if (result.success) {
                setdata(result.data);
            }
            else {
                setdata([]);
            }
        }
        catch (err) {
            console.error("Fecting error from attributevalue component :", err);
        }
    }
    //Load all attributevalue
    const loadApiDataFull = async () => {
        try {
            const result = await getAllAttributevalues();
            if (result.success) {
                setdata(result.data);
            }
            else {
                setdata([]);
            }
        }
        catch (err) {
            console.error("Fecting error from attributevalue component :", err);
        }
    }
    //publishedData
    const publishedData = async (getid)=>{
        try
        {
            const result = await published(getid);
            if(result.success)
            {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadApiDataFull();
            }
            else
            {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadApiDataFull();
            }
        }
        catch(err)
        {

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
                    navigate('/add-attributevalues', {
                        state: {
                            editMode: true,
                            attributevalues: rowData,
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

    // Render header with global search
    const renderHeader = () => {
        return (
            // <div className="table-header flex justify-content-between align-items-center">
            <div className="grid flex flex-column md:flex-row">
                <div className='col-12 md:col-4'>
                    <div className='page_title'>Attribute Values</div>
                    <Link to='/attributes' style={{position: 'absolute'}}>Back to Attribute</Link>
                </div>
                <div className="col-12 md:col-8 md:flex justify-content-end">
                    <div className="p-input-icon-left search_textbox_table">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilter}
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search attribute values..."
                        />
                    </div>
                    <Button label="Add Attribute Values" icon="pi pi-plus" className="commanBtn" rounded
                        onClick={() => {
                            navigate('/attributes/add-attributevalues')
                        }}
                    />
                </div>

            </div>
        );
    };
    //Datatable header call the function
    const header = renderHeader();

    useEffect(() => {
        if (location.state?.attribute) {
            const attribute = location.state?.attribute;
            loadApiData(attribute.id);
        }
        else
        {
            loadApiDataFull();
        }
        if (location.state?.toast) {
            toast.current.show(location.state.toast);
            loadApiDataFull();
            // Clear the state after showing the toast
            navigate(location.pathname, { replace: true });
        }

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
                <Column field="fk_attribute.attribute_name" sortable header="Attribute Names"></Column>
                <Column field="attribute_value" sortable header="Attribute Values"></Column>
                <Column header="Published" body={publishedBodyTemplate}></Column>
                <Column header="Actions" body={actionBodyTemplate}></Column>
            </DataTable>


            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    )
}

export default Attributevalues
