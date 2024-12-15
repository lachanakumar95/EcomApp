import React, { useEffect, useRef, useState } from 'react';
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
//Service
import { getBrandData, published, deleteBrand } from './brandServices';

function Brand() {
    //Toast ref
    const toast = useRef(null);
    //Load Api Data Sate
    const [data, setdata] = useState([]);
    // For global search for datatable
    const [globalFilter, setGlobalFilter] = useState("");
    //navigate
    const navigate = useNavigate();
    //useLoaction
    const location = useLocation();

    //Published 
    const publishedBrand = async (getId) => {
        try {
            const result = await published(getId);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadDataAPI();
            }
        }
        catch (err) {
            console.log("Error fecting from brand component for published data :", err);
        }
    }
    //Load Api Data form Brand
    const loadDataAPI = async () => {
        try {
            const result = await getBrandData();
            if (result.success) {
                setdata(result.data);
            }
            else
            {
                setdata([]);
            }
        }
        catch (err) {
            console.error('Error Fecting form brand componet get data :', err);
        }
    }

    //Delete brand
    const deletebrands = async (getId) => {
        try {
            const result = await deleteBrand(getId);
            if (result.success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                loadDataAPI()
            }
            else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        }
        catch (err) {
            console.error('Error brand component delete:', err);
        }
    }
    //Datatable sno generate
    const snoBodyTemplate = (rowData, options) => {
        return options.rowIndex + 1; // Row index starts from 0, add 1 for S.No
    };

    //Datatable image show
    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.image} className="img_table" />;
    };

    //Datatable published enable
    const publishedBodyTemplate = (rowData) => {
        return <InputSwitch checked={rowData.published} onChange={() => {
            publishedBrand(rowData.id);
        }} />
    }

    //Datatable action button
    const actionBodyTemplate = (rowData) => {
        return <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded severity="warning" tooltip="Edit" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    navigate('/brands/add-brand', {
                        state: {
                            editMode: true,
                            brand: rowData
                        }
                    });
                }}
            />
            <Button icon="pi pi-trash" rounded severity="danger" tooltip="Delete" tooltipOptions={{ position: 'top' }}
                className='delete_option'
                onClick={() => {
                    confirmDialog({
                        message: 'Do you want to delete this record?',
                        header: 'Delete Confirmation',
                        icon: 'pi pi-exclamation-triangle',
                        defaultFocus: 'reject',
                        acceptClassName: 'p-button-danger',
                        accept: () => {
                            deletebrands(rowData.id);
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
                    <div className='page_title'>Brands</div>
                </div>
                <div className="col-12 md:col-8 md:flex justify-content-end">
                    <div className="p-input-icon-left search_textbox_table">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilter}
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search brands..."
                        />
                    </div>
                    <Button label="Add brand" icon="pi pi-plus" className="commanBtn" rounded
                        onClick={() => {
                            navigate('/brands/add-brand')
                        }}
                    />
                </div>

            </div>
        );
    };
    //Datatable header call the function
    const header = renderHeader();

    useEffect(() => {
        loadDataAPI();
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
                <Column header="Image" body={imageBodyTemplate}></Column>
                <Column field="brand_name" sortable header="Brand Name"></Column>
                <Column header="Published" body={publishedBodyTemplate}></Column>
                <Column header="Actions" body={actionBodyTemplate}></Column>
            </DataTable>
            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    )
}

export default Brand