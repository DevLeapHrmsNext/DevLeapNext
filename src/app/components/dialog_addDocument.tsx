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

const DialogUploadDocument = ({ onClose, docType }: { onClose: () => void, docType: any }) => {

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

    const [isLoading, setLoading] = useState(true);
    
        const [showAlert, setShowAlert] = useState(false);
        const [alertForSuccess, setAlertForSuccess] = useState(0);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertStartContent, setAlertStartContent] = useState('');
        const [alertMidContent, setAlertMidContent] = useState('');
        const [alertEndContent, setAlertEndContent] = useState('');
        const [alertValue1, setAlertValue1] = useState('');
        const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const docTypes = await getDocumentsTypes(contextRoleID,docType)
            
            const branch = await getBranches(contextClientID);
            if(docTypes.length>0 && branch.length>0){
                setDocTypes(docTypes);
                setBranchArray(branch);
                fetchEmployeeData(contextClientID,0)
            }else{
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get data");
                setAlertForSuccess(2)
            }
            
        };
        fetchData();
    }, []);

    const fetchEmployeeData=async (client_id:any,branch_id:any)=>{
        if (contextRoleID == "2" || contextRoleID == "3") {
            const empData = await   getEmployees(client_id,branch_id)
            setEmployee(empData);
            let name: any[] = []
            for(let i=0;i<empData.length;i++){
                
                name.push({
                    value: empData[i].customer_id,
                    label: empData[i].emp_id+"  "+ empData[i].name,
                })
            }
            console.log(name);
            
            setEmployeeNames(name);
            setLoading(false);
        }

    }

    const [errors, setErrors] = useState<Partial<formvalues>>({});

    const validate = () => {
        const newErrors: Partial<formvalues> = {};
        console.log("formFilledData-----------------------",formFilledData);
        console.log("inputData---------------------------",inputData);
        console.log("!formFilledData.docTypeID",!formFilledData.docTypeID);
        
        
        if(docType==companyDocUpload){
        if(inputData.selectedFile==null ) newErrors.document="required"
        if(!inputData.docTypeID) newErrors.docType_id="required"
        }else{
        if( formFilledData.selectedFile==null) newErrors.document="required"
        if(!formFilledData.docTypeID) newErrors.docType_id="required"
        if(!formFilledData.branch_id) newErrors.branch_id="required"
        if(!formFilledData.customer_id) newErrors.customer_id="required"

        }
        console.log(newErrors);
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    }
    const uploadDocument = async () => {
        const formData = new FormData();
        formData.append("uploadType", docType);
        
         if(!validate()){return;}
           
        
        if (docType == companyDocUpload) {
           
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);
            formData.append("customer_id", contextCustomerID);
            formData.append("file", inputData.selectedFile!);
            formData.append("doc_type_id", inputData.docTypeID);
            formData.append("show_to_users", inputData.showToUsers + "");
        } else {
                       
            formData.append("client_id", contextClientID);
            if (contextRoleID == "2" || contextRoleID == "3") {
                formData.append("customer_id", formFilledData.customer_id);
            } else {
                formData.append("customer_id", contextCustomerID);
            }

            formData.append("file", formFilledData.selectedFile!);
            formData.append("branch_id", formFilledData.branch_id!);
            formData.append("doc_type_id", formFilledData.docTypeID);

        }
        try {
            const res = await fetch("/api/clientAdmin/org_documents", {
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
        const { name, value, checked, type, files } = e.target;
        if (type === "file") {
            setInputData((prev) => ({ ...prev, [name]: files[0] }));
        }
        else if (name === "showToUsers") {
            setInputData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setInputData((prev) => ({ ...prev, [name]: value }));
        }
    };
    // this is for only single drop down where search will be their to search emp by name and set the selected customer id
    const handleEmpSelectChange = async(values: any) => {
        
        setformFilledData((prev) => ({ ...prev, ["customer_id"]: values.value }));
        
        const branch = await getSelectedCustomerBranch(values.value);
        
        setSelectedEmployee(values)
        setformFilledData((prev) => ({ ...prev, ["branch_id"]: branch }))
        // setBranchArray(branch);
    };

    const handleEmpInputChange = (e: any) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setformFilledData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setformFilledData((prev) => ({ ...prev, [name]: value }));
        }
        
        
        if(name == "branch_id"){
            setSelectedEmployee(null);
            setformFilledData((prev)=>({...prev,['customer_id']:''}))
            if(value){
                console.log("on select branch dropdown value of branch id",value);

            setBranchSelected(true);
            }else{
                setBranchSelected(false)
            }
            fetchEmployeeData(contextClientID,value);
            
        }

    };

    const handleDocTypeChange = (docTypeID: any) => {
        
        setInputData((prev) => ({ ...prev, ["docTypeID"]: docTypeID }));
       
    };


    if (docType == companyDocUpload) {
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
                        Company Document
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12"><label htmlFor="exampleFormControlInput1" className="form-label" >Document Type<span className='req_text'>*</span>:</label></div>
                        <div className="col-lg-12 mb-4">
                            <div>
                                {docTypes.map((type, index) => (
                                    <div key={type.id} className={inputData.docTypeID == type.id ?"comp_list comp_select":"comp_list"} onClick={() => handleDocTypeChange(type.id)}>{type.document_name}</div>
                                ))}
                            </div>
                            {errors.docType_id && <span className='error' style={{ color: "red" }}>{errors.docType_id}</span>}

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
                        <div className="col-lg-12 mb-5">
                            <div className="col-lg-12">
                                <label htmlFor="formFile" className="form-label ">Show to users:</label>
                            </div>
                            <div className="col-lg-12">
                                <label className="switch">
                                    <input type="checkbox" name="showToUsers" onChange={handleInputChange} />
                                    <span className="slider round"></span>
                                </label>
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
                        Employee Document
                        </div>
                    </div>
                    <div className="row mb-2">
                        {/* <div className="col-lg-12">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:</label>
                        </div>
                        <div className="col-lg-12 mb-4">
                            <div>
                                {branchArray.map((branch) => (
                                    <div key={branch.id} className='comp_list' onClick={() => handleEmpInputChange(type.id)}>{branch.branch_number}</div>
                                ))}
                            </div>
                        </div> */}
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch<span className='req_text'>*</span>:</label>
                                <select id="branch_id" name="branch_id" value={formFilledData.branch_id} onChange={handleEmpInputChange}>
                                    <option value="">Select</option>
                                    {branchArray.map((branch) => (
                                        <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                    ))}
                                </select>
                                {errors.branch_id && <span className="error" style={{color: "red"}}>{errors.branch_id}</span>}
                                {/* {errors.typeID && <span className="error" style={{color: "red"}}>{errors.typeID}</span>}                             */}
                            </div>
                        </div>
                        {branchSelected && (contextRoleID == "2" || contextRoleID == "3") ?
                            <div className="col-md-6">
                                <div className="form_box mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Employee Name<span className='req_text'>*</span>:</label>
                                    
                                    <Select
                                        value={selectedEmployee}
                                        options={employeeName}
                                        onChange={(selectedOption) =>
                                            handleEmpSelectChange(selectedOption)
                                        }
                                        placeholder="Select..."
                                        isSearchable
                                    />
                                    {errors.customer_id && <span className="error" style={{color: "red"}}>{errors.customer_id}</span>}
                                </div>
                            </div> : <></>
                        }
                    </div>
                    <div className="row mb-3">

                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Document Type<span className='req_text'>*</span>:</label>
                                <select id="docTypeID" name="docTypeID" onChange={handleEmpInputChange}>
                                    <option value="">Select</option>
                                    {docTypes.map((type) => (
                                        <option value={type.id} key={type.id}>{type.document_name}</option>
                                    ))}
                                </select>
                                {errors.docType_id && <span className="error" style={{color: "red"}}>{errors.docType_id}</span>}                            
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-lg-12 mb-1">Document<span className='req_text'>*</span>: </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <input type="file" className="upload_document" name="selectedFile" id="selectedFile" onChange={handleEmpInputChange} />
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

export default DialogUploadDocument


async function getDocumentsTypes(roleID: any,docTypes:any) {

    let query = supabase
        .from('leap_document_type')
        .select();
    if (roleID == "2" || roleID == "3") {
        if(docTypes==companyDocUpload){
        query = query.eq("document_type_id", 2);
        }else{
            query = query.eq("document_type_id", 5);
        }
    }
    if (roleID == "4" || roleID == "5" || roleID == "9") {
        query = query.eq("document_type_id", 5);
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
    console.log("getSelectedCustomerBranch called--------------------------",customerID);
    
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

async function getEmployees(client_id: any,branchID:any) {

    let query = supabase
        .from('leap_customer')
        .select(`customer_id,name,emp_id,branch_id`).eq("client_id", client_id);
    if(branchID>0){
        query=query.eq("branch_id", branchID);
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
