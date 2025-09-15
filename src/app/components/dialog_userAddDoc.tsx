'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { LeapDashboardShortcuts } from '../models/DashboardModel';
import { companyDocUpload, employeeDocUpload, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';


interface FormCompanyUploadDocDialog {
    docTypeID: any
    selectedFile: File | null,
    showToUsers: boolean
}
interface FormEmpUploadDocDialog {
    customer_id: any
    emp_id: any,
    branch_id: any,
    doc_type_id: any
    selectedFile: File | null,
    showToUsers: boolean
}

const DialogUserUploadDocument = ({ onClose, docType }: { onClose: () => void, docType: any }) => {

    const [docTypes, setDocTypes] = useState<LeapDocumentType[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    // const [inputData, setInputData] = useState<FormCompanyUploadDocDialog>({
    //     docTypeID: "",
    //     selectedFile: null,
    //     showToUsers: false
    // });
    const [formFilledData, setformFilledData] = useState<FormEmpUploadDocDialog>({
        customer_id: "",
        emp_id: '',
        branch_id: '',
        doc_type_id: "",
        selectedFile: null,
        showToUsers: false
    });
    const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            const docTypes = await getDocumentsTypes()
            setDocTypes(docTypes);
        };
        fetchData();
    }, []);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formFilledData.doc_type_id) newErrors.doc_type_id = "required";
        if (formFilledData.selectedFile == null) newErrors.selectedFile = "required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadDocument = async () => {
        if (!validate()) return;
        const formData = new FormData();
        formData.append("uploadType", docType);

        // if (formFilledData.selectedFile == null) {
        //     // return alert("Please select File to upload");
        //     // setShowAlert(true);
        //     setAlertTitle("Error")
        //     setAlertStartContent("No documents uploaded yet!");
        //     setAlertForSuccess(2)
        // }
        // if (formFilledData.docTypeID.length > 0) {
        //     return alert("Please select type of document");
        // }
        formData.append("client_id", contextClientID);
        formData.append("customer_id", contextCustomerID);
        formData.append("file", formFilledData.selectedFile!);
        formData.append("branch_id", contaxtBranchID);
        formData.append("doc_type_id", formFilledData.doc_type_id);

        try {
            const res = await fetch("/api/clientAdmin/org_documents", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            // console.log(response);

            if (response.status == 1) {
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Documents uploaded!");
                setAlertForSuccess(2)
                // alert(response.message)
                onClose();
            } else {
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No Documents uploaded yet!");
                setAlertForSuccess(2)
            }
        } catch (e) {
            console.log(e);
            alert("Somthing went wrong! Please try again.")
        }
    };

    const handleEmpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        if (type === "file") {
            const file = files ? files[0] : null;
            setformFilledData((prev) => ({ ...prev, [name]: file }));
        } else {
            setformFilledData((prev) => ({ ...prev, [name]: value }));
        }
    };
    return (
        <div >
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            {/* -------------- */}
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)
            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className="nw_user_offcanvas_mainbox">
                {/* <LoadingDialog isLoading={isLoading} /> */}
                <div className="nw_user_offcanvas_heading">
                    Add <span>Document</span>
                </div>
                <div className="nw_user_offcanvas_listing_mainbox">
                    <div className="row">
                        <div className="col-lg-10">
                            <div className="nw_user_doc_mainbox">
                                <div className="nw_user_doc_selectbox">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Document Type</label>
                                    {/* <select id="docTypeID" name="docTypeID" className='form-select' onChange={handleEmpInputChange}>
                                        <option value="">Select</option>
                                        {docTypes.map((type, index) => (
                                            <option value={type.id} key={index}>{type.document_name}</option>
                                        ))}
                                    </select> */}


                                    <select id="doc_type_id" name="doc_type_id" className='form-select' onChange={handleEmpInputChange}>
                                        <option value="">Select</option>
                                        {docTypes.map((type) => (
                                            <option value={type.id} key={type.id}>{type.document_name}</option>
                                        ))}
                                    </select>
                                    {errors.doc_type_id && <span className="error" style={{ color: "red" }}>{errors.doc_type_id}</span>}


                                </div>
                                <div className="nw_user_doc_uploadbox">
                                    <label htmlFor="selectedFile" className='nw_user_doc_upload_lablebox'>
                                        <div className="user_upload_iconbox">
                                            <svg width="40" height="40" x="0" y="0" viewBox="0 0 512.056 512.056">
                                                <g>
                                                    <path d="M426.635 188.224C402.969 93.946 307.358 36.704 213.08 60.37 139.404 78.865 85.907 142.542 80.395 218.303 28.082 226.93-7.333 276.331 1.294 328.644c7.669 46.507 47.967 80.566 95.101 80.379h80v-32h-80c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64 8.837 0 16-7.163 16-16-.08-79.529 64.327-144.065 143.856-144.144 68.844-.069 128.107 48.601 141.424 116.144a16 16 0 0 0 13.6 12.8c43.742 6.229 74.151 46.738 67.923 90.479-5.593 39.278-39.129 68.523-78.803 68.721h-64v32h64c61.856-.187 111.848-50.483 111.66-112.339-.156-51.49-35.4-96.241-85.42-108.46z" fill="#000000" opacity="1" data-original="#000000"></path><path d="m245.035 253.664-64 64 22.56 22.56 36.8-36.64v153.44h32v-153.44l36.64 36.64 22.56-22.56-64-64c-6.241-6.204-16.319-6.204-22.56 0z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="user_upload_headingbox">
                                            {formFilledData.selectedFile
                                                ? formFilledData.selectedFile.name
                                                : "Choose a file"}
                                        </div>
                                        <div className="user_upload_subheadingbox">
                                            {formFilledData.selectedFile
                                                ? `${(formFilledData.selectedFile.size / 1024).toFixed(1)} KB`
                                                : "DOC, PDF formats, up to 5 MB."}
                                        </div>

                                        <div className="user_upload_btnbox">
                                            Browse File
                                        </div>
                                    </label>
                                    <input type="file" className="upload_document" name="selectedFile" id="selectedFile" onChange={handleEmpInputChange} />
                                    {errors.selectedFile && <span className="error" style={{ color: "red" }}>{errors.selectedFile}</span>}
                                </div>
                                <div className="nw_user_doc_btnbox new_leave_formgoup_back_btn">
                                    <a className="red_button" onClick={uploadDocument}>Upload</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* -------------- */}
        </div>
    )
}


export default DialogUserUploadDocument


async function getDocumentsTypes() {

    let query = supabase
        .from('leap_document_type')
        .select()
        .eq("document_type_id", 5);
      

    const { data, error } = await query;

    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }
}

async function getBranches(clientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select().eq("client_id", clientID);
    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }

}
async function getSelectedCustomerBranch(customerID: any) {
    console.log("getSelectedCustomerBranch called--------------------------", customerID);

    let query = supabase
        .from('leap_customer')
        .select(`branch_id`).eq("customer_id", customerID);

    const { data, error } = await query;

    if (error) {
        console.log(error);

        return 0;
    } else {

        console.log(data[0].branch_id);

        return data[0].branch_id;

    }

}

async function getEmployees(client_id: any, branchID: any) {

    let query = supabase
        .from('leap_customer')
        .select(`customer_id,name,emp_id,branch_id`).eq("client_id", client_id);
    if (branchID > 0) {
        query = query.eq("branch_id", branchID);
    }


    const { data, error } = await query;


    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
