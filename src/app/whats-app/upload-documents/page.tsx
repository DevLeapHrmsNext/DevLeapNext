

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { SubProject } from '@/app/models/TaskModel'
import { ALERTMSG_exceptionString, employeeDocUpload } from '@/app/pro_utils/stringConstants'

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
const ApplyTaskApp: React.FC = () => {
    const [docTypes, setDocTypes] = useState<LeapDocumentType[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');

    const [alertStartContent, setAlertStartContent] = useState('');
    const searchParams = useSearchParams();
    const contactNumber = searchParams.get("contact_number");
    const [userData, setuserData] = useState<whatsappCustomerInfoModel[]>([]);
    const [formFilledData, setformFilledData] = useState<FormEmpUploadDocDialog>({
        customer_id: "",
        emp_id: '',
        branch_id: '',
        doc_type_id: "",
        selectedFile: null,
        showToUsers: false
    });
    // const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();



    useEffect(() => {
        const fetchData = async () => {
            const custData = await getCustomerClientIds(contactNumber!);
            setuserData(custData);
            const docTypes = await getDocumentsTypes()
            setDocTypes(docTypes);
        };
        fetchData();
    }, [userData[0].client_id])

    const handleEmpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        if (type === "file") {
            const file = files ? files[0] : null;
            setformFilledData((prev) => ({ ...prev, [name]: file }));
        } else {
            setformFilledData((prev) => ({ ...prev, [name]: value }));
        }
    };
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
        formData.append("uploadType", employeeDocUpload);

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
        formData.append("client_id", userData[0].client_id);
        formData.append("customer_id", userData[0].customer_id);
        formData.append("file", formFilledData.selectedFile!);
        formData.append("branch_id", userData[0].branch_id);
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
                // onClose();
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

    return (
        <div className='apply-task-container'>
            <h2>Add Document</h2>

            <form onSubmit={uploadDocument}>
                <div className="form-group">
                    <label>Document Type <span className='req_text'>*</span></label>
                    <select name="doc_type_id" onChange={handleEmpInputChange}>
                        <option value="">Select</option>
                        {docTypes.map((type) => (
                            <option value={type.id} key={type.id}>{type.document_name}</option>
                        ))}
                    </select>
                    {errors.doc_type_id && <span className="error">{errors.doc_type_id}</span>}
                </div>
                
                <div className="form-group" style={{ alignItems: "center" }}>
                    <div className="nw_user_doc_uploadbox" style={{ alignItems: "center" }}>
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
                </div>

                <div className="form-group">
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        </div>

    )
}

export default ApplyTaskApp

async function getCustomerClientIds(contact_number: string) {
    const { data, error } = await supabase
        .from('leap_customer')
        .select('customer_id, client_id, branch_id')
        .eq('contact_number', contact_number);

    if (error) throw error;
    return data;
}

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
