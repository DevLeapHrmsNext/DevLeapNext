'use client'
import React, { useRef } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'

import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { AssetList } from '@/app/models/AssetModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { FaFilePdf, FaFileAlt, FaDownload } from "react-icons/fa";
import { baseUrl, leftMenuDocumentsPageNumbers, leftMenuDocumentsSub1PageNumbers } from '@/app/pro_utils/stringRoutes'
import mammoth from "mammoth";
import ExcelJS from "exceljs";
import { getDocument } from "pdfjs-dist";
import PDFPreview from '@/app/components/PDFPreview'
import DOCXFilePreview from '@/app/components/DOCXFilePreview'
import XLSXFilePreview from '@/app/components/XLSXFilePreview'
import DialogUploadDocument from '@/app/components/dialog_addDocument'
import { companyDocUpload, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import DialogUpdateDocument from '@/app/components/dialog_updateDocument'

const OrganizationalDocuments = () => {


    const [scrollPosition, setScrollPosition] = useState(0);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [replaceDocID, setReplaceDocID] = useState(0);
    const { contextClientID, contextCustomerID, contextRoleID } = useGlobalContext();
    const [documentsArray, setDocumentsArray] = useState<LeapClientDocuments[]>([]);
    // const [documentURL,setDocumentUrls]=useState<any[]>([]);
    // const [empDocumentsArray, setEmpDocumentArray] = useState<LeapCustomerDocuments[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchData();


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

    }, []);



    // Converts DOCX to text preview


    // Reads XLSX and shows first sheet preview



    const fetchData = async () => {
        setLoading(true);
        const docs = await getDocuments(contextClientID);
        setDocumentsArray(docs);
         setLoading(false);
    }
    
    const getFileIcon = (type: string, url: string) => {
        switch (type) {
            case "pdf":
                return <FaFilePdf className="text-danger fs-2" />;
            case "image":
                return <img src={getImageApiURL+"/uploads/" + url} alt="Thumbnail" width={50} height={50} />;
            case "xls":
            case "xlsx":
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
            <LoadingDialog isLoading={isLoading} />
            <LeftPannel menuIndex={leftMenuDocumentsPageNumbers} subMenuIndex={leftMenuDocumentsSub1PageNumbers} showLeftPanel={true} rightBoxUI={
                

                    <div>
                        <div className='container'>
                            <div className="row heading25 mb-3">
                                <div className="col-lg-9">
                                    Company <span>Documents</span>
                                </div>
                                {contextRoleID == "2" ?
                                    <div className="col-lg-3" style={{ textAlign: "right" }}>
                                        <div className="row" >
                                            <div className="col-lg-12">
                                                <a className="red_button" onClick={() => {setShowUploadDialog(true)}}>Add Document</a>&nbsp;
                                            </div>
                                        </div>
                                    </div> : <></>
                                }
                            </div>
                            {documentsArray.length > 0 ?<div>
                            <div className={showUploadDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showUploadDialog && <DialogUploadDocument onClose={() => {setShowUploadDialog(false);fetchData()}} docType={companyDocUpload} />}
                            </div>
                            <div className={showUpdateDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showUpdateDialog && <DialogUpdateDocument onClose={() => { setShowUpdateDialog(false); fetchData() } } replaceType={companyDocUpload} edit_id={replaceDocID} />}
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row">
                                        {documentsArray.map((doc) => {
                                            const fileName = doc.document_url.substring(doc.document_url.lastIndexOf("/") + 1);
                                            const fileExt = fileName.split(".").pop().toLowerCase();
                                            return (
                                                
                                                <div className="col-md-3 col-sm-6 mb-4" key={doc.id}>
                                                    <div className="document_list text-center" >
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-3">
                                                                <div className='document_list_icon'>{getFileIcon(fileExt, baseUrl + doc.document_url)}</div>
                                                                {/* <img src={staticIconsBaseURL+"/images/document_list_icon.png"} style={{maxHeight:"100px"}} className='img-fluid'/> */}
                                                            </div>
                                                            <div className="col-lg-12 mb-3 document_name" style={{ wordWrap:"break-word"}}>
                                                                {doc.document_url.substring(doc.document_url.lastIndexOf('/') + 1)}
                                                            </div>
                                                            <div className="col-lg-12 mb-3">
                                                                <a className='red_button filter_submit_btn ' onClick={()=>{setShowUpdateDialog(true),setReplaceDocID(doc.id)}} >
                                                                    <img src={staticIconsBaseURL + "/images/replace_doc_icon.png"} className='img-fluid' /> Replace
                                                                </a>&nbsp;&nbsp;
                                                                <a className='red_button filter_submit_btn ' href={getImageApiURL+"/uploads/"+doc.document_url} download >
                                                                    <img src={staticIconsBaseURL + "/images/download_doc_icon.png"} className='img-fluid' /> Download 
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            </div>:(
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                        <h4 className="text-muted">No documents uploaded</h4>
                                            
                                    </div>
                                ) }

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

async function getDocuments(clientID: any) {

    let query = supabase
        .from('leap_client_documents')
        .select().eq("client_id", clientID);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
// async function getEmployeeDocuments(clientID: any, customer_id: any) {

//     let query = supabase
//         .from('leap_customer_documents')
//         .select().eq("customer_id", "14");

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

// }