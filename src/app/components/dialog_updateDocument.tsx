'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { LeapDashboardShortcuts } from '../models/DashboardModel';
import { ALERTMSG_exceptionString, companyDocUpload, employeeDocUpload } from '../pro_utils/stringConstants';
import Select from "react-select";
import ShowAlertMessage from './alert';
import LoadingDialog from './PageLoader';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';


interface FormCompanyUploadDocDialog {
    docTypeID: any
    selectedFile: File | null,
    showToUsers: boolean
}
interface FormEmpUploadDocDialog {
    customer_id: any
    emp_id: any,
    branch_id: any,
    docTypeID: any
    selectedFile: File | null | string,
    showToUsers: boolean
}
interface formvalues{
    branch_id:string,
    customer_id:string,
    docType_id:string,
    document:string,
}

const DialogUpdateDocument = ({ onClose,replaceType,edit_id }: { onClose: () => void,replaceType:string,edit_id:number }) => {

    const [docTypes, setDocTypes] = useState<LeapDocumentType[]>([]);
    const [employeeData, setEmployee] = useState<LeapEmployeeBasic[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [empIDArray, setEmpIDArray] = useState<any[]>([]);
    const [branchSelected, setBranchSelected]= useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
    const [inputData, setInputData] = useState<FormCompanyUploadDocDialog>({
        docTypeID: "",
        selectedFile: null,
        showToUsers: false
    });
    const [formFilledData, setformFilledData] = useState<FormEmpUploadDocDialog>({
        customer_id: "",
        emp_id: '',
        branch_id: '',
        docTypeID: "",
        selectedFile: null,
        showToUsers: false
    });
    const { contextClientID, contaxtBranchID, contextRoleID, contextCustomerID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);

    const [isLoading, setLoading] = useState(false);
    
        const [showAlert, setShowAlert] = useState(false);
        const [alertForSuccess, setAlertForSuccess] = useState(0);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertStartContent, setAlertStartContent] = useState('');
        const [alertMidContent, setAlertMidContent] = useState('');
        const [alertEndContent, setAlertEndContent] = useState('');
        const [alertValue1, setAlertValue1] = useState('');
        const [alertvalue2, setAlertValue2] = useState('');

  

    

    const [errors, setErrors] = useState<Partial<formvalues>>({});

    const validate = () => {
        const newErrors: Partial<formvalues> = {};
        console.log("formFilledData-----------------------",formFilledData);
        console.log("inputData---------------------------",inputData);
        console.log("!formFilledData.docTypeID",!formFilledData.docTypeID);
        
        
        
        if(inputData.selectedFile==null ) newErrors.document="required"
        
        console.log(newErrors);
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    }
    const uploadDocument = async () => {
        const formData = new FormData();
        
        
         if(!validate()){return;}
           
        
        if (replaceType == companyDocUpload) {
           
            formData.append("doc_pk_id", edit_id.toString());
           
            formData.append("file", inputData.selectedFile!);
            
        } else {
                       
            formData.append("doc_pk_id", edit_id.toString());
            if (contextRoleID == "2" || contextRoleID == "3") {
                formData.append("customer_id", formFilledData.customer_id);
            } else {
                formData.append("customer_id", contextCustomerID);
            }

            formData.append("file", formFilledData.selectedFile!);
            

        }
        try {
            const res = await fetch("/api/clientAdmin/org_documents/updateDocuments", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            if (response.status == 1) {
                
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent(response.message);
                setAlertForSuccess(1)
                
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
                
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }

    };

    const handleInputChange =  (e: any) => {
        const { name, type, files } = e.target;
        if (type === "file") {
            setInputData((prev) => ({ ...prev, [name]: files[0] }));
        }
    
    };
    // this is for only single drop down where search will be their to search emp by name and set the selected customer id
    
    if (replaceType == companyDocUpload) {
        return (
            
                <div>
                    <div className='rightpoup_close' onClick={onClose}>
                        <img src={staticIconsBaseURL+"/images/close_white.png"} alt="Search Icon" title='Close'/>
                    </div>
                    <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                            if(alertForSuccess==1){
                                onClose();
                            }
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className="row">
                        <div className="col-lg-12 mb-4 inner_heading25">
                        Replace Company Document
                        </div>
                    </div>
                   
                    <div className="row">
                        
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12 mb-1">Document<span className='req_text'>*</span>: </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 mb-4">
                                    <input type="file" style={{fontSize:"14px"}} className="upload_document" name="selectedFile" id="selectedFile" onChange={handleInputChange} />
                                    {errors.document && <span className='error' style={{ color: "red" }}>{errors.document.toString()}</span>}

                                </div>
                                
                            </div>
                        </div>
                        
                    </div>


                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <a className="red_button" onClick={uploadDocument}>Upload</a>&nbsp;&nbsp;
                            <a className="red_button" onClick={onClose}>Close</a>
                        </div>
                    </div>
                </div>
            
        )
    }
    else {
        return (
            
                <div>
                    <div className='rightpoup_close' onClick={onClose}>
                        <img src={staticIconsBaseURL+"/images/close_white.png"} alt="Search Icon" title='Close'/>
                    </div>
                <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)

                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    
                    <div className="row">
                        <div className="col-lg-12 mb-4 inner_heading25">
                        Replace Employee Document
                        </div>
                    </div>
                    
                    <div className="row mb-3">

                        
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-lg-12 mb-1">Document<span className='req_text'>*</span>: </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <input type="file" className="upload_document" name="selectedFile" id="selectedFile" onChange={handleInputChange} />
                                    {errors.document && <span className="error" style={{color: "red"}}>{errors.document}</span>}                            

                                </div>
                            </div>
                            
                        </div>

                    </div>
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <a className="red_button" onClick={uploadDocument}>Upload</a>&nbsp;&nbsp;
                            <a className="red_button" onClick={onClose}>Close</a>
                        </div>
                    </div>
                    {/* {showResponseMessage && <div className="row md-5"><label>Holiday Added Successfully</label></div>} */}
                </div>
           
        )
    }
}

export default DialogUpdateDocument

