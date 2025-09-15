'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'

import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { AssetList } from '@/app/models/AssetModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { FaFilePdf, FaFileAlt, FaDownload } from "react-icons/fa";
import { baseUrl, leftMenuDocumentsPageNumbers, leftMenuDocumentsSub2PageNumbers } from '@/app/pro_utils/stringRoutes'
import DialogUploadDocument from '@/app/components/dialog_addDocument'
import { employeeDocUpload, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import Select from "react-select";
import ShowAlertMessage from '@/app/components/alert'

interface AssetType {
    assetType: string
}

const OrganizationalDocuments = () => {


    const [scrollPosition, setScrollPosition] = useState(0);
    const { contextClientID, contextCustomerID, contextRoleID } = useGlobalContext();
    const [empDocumentsArray, setEmpDocumentArray] = useState<LeapCustomerDocuments[]>([]);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [selectedCustomerID, setCustomerID] = useState(0);
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);

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
        fetchEmployeeData();


        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };

    }, [])


    const fetchEmployeeData = async () => {
        // if (contextRoleID == "2" || contextRoleID == "3") {
            const empData = await getEmployees(contextClientID)
            let name: any[] = []
            for (let i = 0; i < empData.length; i++) {

                name.push({
                    value: empData[i].customer_id,
                    label: empData[i].emp_id + "  " + empData[i].name,
                })
            }
            console.log(name);

            setEmployeeNames(name);
        // } 
        // else {
        //     const empDocs = await getEmployeeDocuments(contextClientID, contextCustomerID);
        //     setEmpDocumentArray(empDocs);
        // }
        setLoading(false);

    }
    const handleEmpSelectChange = async (values: any) => {
        setLoading(true)
        setCustomerID(values.value);
        const empDocs = await getEmployeeDocuments(contextClientID, values.value);
        if (empDocs.length > 0) {
            setLoading(false);
            setEmpDocumentArray(empDocs);
        } else {
            setEmpDocumentArray(empDocs);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Error")
            setAlertStartContent(values.label+ " has no documents added");
            setAlertForSuccess(2)
        }

    };
    const getFileIcon = (type: string, url: string) => {
        console.log("this is the doc type file ext passed",type);
        
        switch (type) {
            case "pdf":
                return <FaFilePdf className="text-danger fs-2" />;
            case "image":
                return <img src={getImageApiURL+"/uploads/" + url} alt="Thumbnail" width={80} height={50} />;
            case "webp":
                return <img src={getImageApiURL+"/uploads/" + url} alt="Thumbnail" width={80} height={50} />;
            case "jpeg":
                return <img src={getImageApiURL+"/uploads/" + url} alt="Thumbnail" width={80} height={50} />; 
            case "jpg":
                return <img src={getImageApiURL+"/uploads/" + url} alt="Thumbnail" width={80} height={50} />; 
            case "png":
                return <img src={getImageApiURL+"/uploads/" + url} alt="Thumbnail" width={80} height={50} />;  
            case "xls":
                    return <FaFileAlt className="text-success fs-2" />;
            case "doc":
                    return <FaFileAlt className="text-primary fs-2" />;
            default:
                    return <FaFileAlt className="text-secondary fs-2" />;
        }
    };

    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuDocumentsPageNumbers} subMenuIndex={leftMenuDocumentsSub2PageNumbers} showLeftPanel={true} rightBoxUI={


                <div>

                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)

                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>
                        <div className="row heading25 mb-3">
                            <div className="col-lg-7">
                                Employee <span>Document</span>
                            </div>
                            <div className="col-lg-5">
                                <div className="row" >

                                    {/* <div className="col-lg-12"> */}

                                    <div className="col-lg-7">
                                            <div className="form_box mb-2">
                                                <div className="row d-flex align-items-center">
                                                    <div className="col-lg-12 search_select_element">
                                                        <Select
                                                            className="custom-select"
                                                            classNamePrefix="custom"
                                                            options={employeeName}
                                                            onChange={(selectedOption) =>
                                                                handleEmpSelectChange(selectedOption)
                                                            }
                                                            placeholder="Search Employee"
                                                            isSearchable
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-lg-5">
                                        <a className="red_button" onClick={() => { setShowUploadDialog(true) }}>Add Document</a>&nbsp;
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                        <div className={showUploadDialog ? "rightpoup rightpoupopen" : "rightpoup"}>                                  
                            {showUploadDialog && <DialogUploadDocument onClose={() => { setShowUploadDialog(false); fetchEmployeeData() }} docType={employeeDocUpload} />}
                        </div>
                        
                        <div className="row">
                            <div className="col-lg-12">
                                {empDocumentsArray.length > 0 ? (
                                    <div className="row">
                                        {empDocumentsArray.map((doc) => {
                                            const fileName = doc.bucket_url!.substring(doc.bucket_url.lastIndexOf("/") + 1) || "";
                                            const fileExt = fileName.split(".").pop().toLowerCase();
                                            return (

                                                <div className="col-md-3 col-sm-6 mb-4" key={doc.id}>
                                                    <div className="document_list text-center" >
                                                        
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-3">
                                                                <div className='document_list_icon'>{getFileIcon(fileExt, doc.bucket_url)}</div>
                                                            </div>
                                                            <div className="col-lg-12 mb-3 document_name" style={{ wordWrap: "break-word" }}>
                                                                {doc.bucket_url.substring(doc.bucket_url.lastIndexOf('/') + 1)}
                                                            </div>
                                                            <div className="col-lg-12 mb-3">
                                                                <a className='red_button filter_submit_btn'>
                                                                    <img src={staticIconsBaseURL + "/images/replace_doc_icon.png"} className='img-fluid' /> Replace
                                                                </a>&nbsp;&nbsp;
                                                                <a className='red_button filter_submit_btn' href={getImageApiURL+"/uploads/"+ doc.bucket_url} download >
                                                                    <img src={staticIconsBaseURL + "/images/download_doc_icon.png"} className='img-fluid' /> Download 
                                                                </a>
                                                            </div>

                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>) : (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                        {selectedCustomerID ? <h4 className="text-muted">No documents uploaded</h4>
                                            : <h4 className="text-muted">Please select Employee to view documents</h4>}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>


            } />


            <div>
                <Footer />
            </div>
        </div>
    )
}

export default OrganizationalDocuments;


async function getEmployeeDocuments(clientID: any, customer_id: any) {

    let query = supabase
        .from('leap_customer_documents')
        .select().eq("customer_id", customer_id);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}

async function getEmployees(client_id: any) {

    let query = supabase
        .from('leap_customer')
        .select(`customer_id,name,emp_id,branch_id`).eq("client_id", client_id);

    const { data, error } = await query;

    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}