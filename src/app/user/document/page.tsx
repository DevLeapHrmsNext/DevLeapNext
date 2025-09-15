// // here employee can view their own personal documents and organizational related documents

// // btn 1 : org doc-- /clientadmin/documents
// // btn 2 : emp personal doc-- user/document/employee-doc
// // pages/page.js

// 'use client'
// import React from 'react'
// import LeapHeader from '@/app/components/header'
// import Footer from '@/app/components/footer'
// import { useEffect, useState } from 'react'
// import { pageURL_assignLeaveForm, leftMenuLeavePageNumbers, leftMenuProjectMGMTPageNumbers, leftMenuProjectsSub1PageNumbers, baseUrl } from '@/app/pro_utils/stringRoutes'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import { FaFilePdf, FaFileAlt, FaDownload } from "react-icons/fa";
// import LeftPannel from '@/app/components/leftPannel'
// import DialogUploadDocument from '@/app/components/dialog_addDocument'
// import { ALERTMSG_addAssetSuccess, employeeDocUpload, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
// import PageErrorCenterContent from '@/app/components/pageError'
// import ShowAlertMessage from '@/app/components/alert'
// import DialogUserUploadDocument from '@/app/components/dialog_userAddDoc'

// const EmployeeDocuments = () => {

//     const [loadingCursor, setLoadingCursor] = useState(false);
//     const { contextClientID, contextCustomerID, contaxtBranchID } = useGlobalContext();
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
//     const [orgDocArray, setOrgDoc] = useState<LeapClientDocuments[]>([]);
//     const [empOrgArray, setEmpOrgDoc] = useState<OrganizationSpecific[]>([]);
//     const [empPerArray, setEmpPerDoc] = useState<EmployeePersonal[]>([]);
//     const [showUploadDialog, setShowUploadDialog] = useState(false);

//     const [showAlert, setShowAlert] = useState(false);
//     const [alertForSuccess, setAlertForSuccess] = useState(0);
//     const [alertTitle, setAlertTitle] = useState('');
//     const [alertStartContent, setAlertStartContent] = useState('');
//     const [alertMidContent, setAlertMidContent] = useState('');
//     const [alertEndContent, setAlertEndContent] = useState('');
//     const [alertValue1, setAlertValue1] = useState('');
//     const [alertvalue2, setAlertValue2] = useState('');

//     useEffect(() => {
//         fetchCompanyDoc();
//         fetchEmployeeDoc();
//         const handleScroll = () => {
//             setScrollPosition(window.scrollY); // Update scroll position
//             const element = document.querySelector('.mainbox');
//             if (window.pageYOffset > 0) {
//                 element?.classList.add('sticky');
//             } else {
//                 element?.classList.remove('sticky');
//             }
//         };
//         window.addEventListener('scroll', handleScroll);
//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, [])

//     const fetchCompanyDoc = async () => {
//         // setLoading(true);
//         try {
//             const formData = new FormData();

//             // for (const [key, value] of formData.entries()) {
//             //     console.log(`${key}: ${value}`);
//             // }
//             const res = await fetch(`/api/users/getCompanyDocuments`, {
//                 method: "POST",
//                 body: JSON.stringify({
//                     "client_id": contextClientID,
//                     "branch_id": contaxtBranchID,
//                     "customer_id": contextCustomerID
//                 }),
//             });
//             const response = await res.json();
//             console.log(response);
//             const companyDoc = response.data;
//             if (response.status == 1) {
//                 setOrgDoc(companyDoc)
//                 // setLoading(false);
//             } else {
//                 setOrgDoc([]);
//                 // setLoading(false);
//                 setShowAlert(true);
//                 setAlertTitle("Error")
//                 setAlertStartContent("No documents uploaded yet!");
//                 setAlertForSuccess(2)
//             }
//         } catch (error) {
//             // setLoading(false);
//             console.error("Error fetching user data:", error);
//             setShowAlert(true);

//             setAlertTitle("Exception")
//             setAlertStartContent(ALERTMSG_addAssetSuccess);
//             setAlertForSuccess(2)
//         }
//         setLoadingCursor(false);
//     }

//     const fetchEmployeeDoc = async () => {
//         try {
//             const formData = new FormData();
//             // formData.append("client_id", contextClientID);
//             // // formData.append("branch_id", contaxtBranchID )
//             // formData.append("customer_id", contextCustomerID);

//             for (const [key, value] of formData.entries()) {
//                 console.log(`${key}: ${value}`);
//             }
//             const res = await fetch(`/api/users/getEmployeeDocuments`, {
//                 method: "POST",
//                 body: JSON.stringify({
//                     "client_id": contextClientID,
//                     // "branch_id": contaxtBranchID,
//                     "customer_id": contextCustomerID
//                 }),
//             });
//             const response = await res.json();
//             // console.log(response);
//             const empOrgDoc = response.organization_specific;
//             const empPerDoc = response.employee_personal;

//             if (response.status == 1 && empOrgDoc.length > 0) {
//                 setEmpOrgDoc(empOrgDoc)
//                 // setLoading(false);
//             } else {
//                 setEmpOrgDoc(empOrgDoc);
//                 // setLoading(false);
//                 setShowAlert(true);
//                 setAlertTitle("Error")
//                 setAlertStartContent("No documents uploaded yet!");
//                 setAlertForSuccess(2)
//             }
//             if (response.status == 1 && empPerDoc.length > 0) {
//                 setEmpPerDoc(empPerDoc)
//                 // setLoading(false);
//             } else {
//                 setEmpPerDoc(empPerDoc);
//                 // setLoading(false);
//                 setShowAlert(true);
//                 setAlertTitle("Error")
//                 setAlertStartContent("No documents uploaded yet!");
//                 setAlertForSuccess(2)
//             }
//         } catch (error) {
//             // setLoading(false);
//             console.error("Error fetching user data:", error);
//             setShowAlert(true);
//             setAlertTitle("Exception")
//             setAlertStartContent(ALERTMSG_addAssetSuccess);
//             setAlertForSuccess(2)
//         }
//         setLoadingCursor(false);
//     }
//     const getFileIcon = (type: string, url: string) => {
//         switch (type) {
//             case "pdf":
//                 return <FaFilePdf className="text-danger fs-2" />;
//             case "image":
//                 return <img src={baseUrl + url} alt="Thumbnail" width={50} height={50} />;
//             case "xls":
//                 return <FaFileAlt className="text-success fs-2" />;
//             case "doc":
//                 return <FaFileAlt className="text-primary fs-2" />;
//             default:
//                 return <FaFileAlt className="text-secondary fs-2" />;
//         }
//     };
//     return (
//         <div className='mainbox user_mainbox_new_design'>
//             <header>
//                 <LeapHeader title="Welcome!" />
//             </header>
//             <LeftPannel menuIndex={25} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//                 <div>
//                     {/* <LoadingDialog isLoading={isLoading} /> */}
//                     {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//                         setShowAlert(false)
//                     }} onCloseClicked={function (): void {
//                         setShowAlert(false)
//                     }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//                     {/* ---------------------- */}
//                     <div className='container'>
//                         <div className="row">
//                             <div className="col-lg-12">
//                                 <div className="nw_user_inner_mainbox">
//                                     <div className="nw_user_inner_heading_tabbox">
//                                         <div className="heading25 pt-3">
//                                             Documents
//                                         </div>
//                                         <div className="nw_user_inner_tabs nw_user_inner_right_tabs new_righ_two_tabs">
//                                             <ul className='new_righ_four_tabs'>
//                                                 <li className={tabSelectedIndex == 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
//                                                     <a onClick={(e) => { setTabSelectedIndex(0), setLoadingCursor(true), fetchCompanyDoc() }} className={tabSelectedIndex == 0 ? "nw_user_selected" : "new_list_view_heading"}>
//                                                         <div className="nw_user_tab_icon">
//                                                             <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
//                                                                 <g>
//                                                                     <path fill="#ffffff" d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v3h20V8c0-1.103-.897-2-2-2zM9 4h6v2H9zm5 10h-4v-2H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-8z" opacity="1" data-original="#000000"></path>
//                                                                 </g>
//                                                             </svg>
//                                                         </div>
//                                                         <div className="nw_user_tab_name">
//                                                             Company
//                                                         </div>
//                                                     </a>
//                                                 </li>
//                                                 <li className={tabSelectedIndex == 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
//                                                     <a onClick={(e) => { setTabSelectedIndex(1), setLoadingCursor(true), fetchEmployeeDoc() }} className={tabSelectedIndex == 1 ? "nw_user_selected" : "new_list_view_heading"}>
//                                                         <div className="nw_user_tab_icon">
//                                                             <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512">
//                                                                 <g>
//                                                                     <path d="M136 242C61.561 242 1 302.561 1 377s60.561 135 135 135 135-60.561 135-135-60.561-135-135-135zm59.606 118.606-70 70C122.678 433.535 118.839 435 115 435s-7.678-1.465-10.606-4.394l-30-30c-5.858-5.857-5.858-15.355 0-21.213 5.857-5.857 15.355-5.857 21.213 0L115 398.787l59.394-59.394c5.857-5.857 15.355-5.857 21.213 0 5.857 5.858 5.857 15.356-.001 21.213z" fill="#ffffff" opacity="1" data-original="#000000"></path>
//                                                                     <path d="M396 130c-8.284 0-15-6.716-15-15V0H166c-24.813 0-45 20.187-45 45v167.689c4.942-.448 9.943-.689 15-.689 51.128 0 96.897 23.376 127.186 60H426c8.284 0 15 6.716 15 15s-6.716 15-15 15H282.948a163.749 163.749 0 0 1 17.363 60H426c8.284 0 15 6.716 15 15s-6.716 15-15 15H300.311c-4.486 49.539-30.954 92.826-69.553 120H466c24.813 0 45-20.187 45-45V130zm30 82H206c-8.284 0-15-6.716-15-15s6.716-15 15-15h220c8.284 0 15 6.716 15 15s-6.716 15-15 15z" fill="#ffffff" opacity="1" data-original="#000000"></path>
//                                                                     <path d="M411 8.783V100h91.211z" fill="#ffffff" opacity="1" data-original="#000000"></path>
//                                                                 </g>
//                                                             </svg>
//                                                         </div>
//                                                         <div className="nw_user_tab_name">
//                                                             Official
//                                                         </div>
//                                                     </a>
//                                                 </li>
//                                                 <li className={tabSelectedIndex == 2 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={2}>
//                                                     <a onClick={(e) => { setTabSelectedIndex(2), setLoadingCursor(true), fetchEmployeeDoc() }} className={tabSelectedIndex == 2 ? "nw_user_selected" : "new_list_view_heading"}>
//                                                         <div className="nw_user_tab_icon">
//                                                             <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512">
//                                                                 <g>
//                                                                     <path d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" fill="#ffffff" opacity="1" data-original="#000000"></path>
//                                                                 </g>
//                                                             </svg>
//                                                         </div>
//                                                         <div className="nw_user_tab_name">
//                                                             Personal
//                                                         </div>
//                                                     </a>
//                                                 </li>
//                                             </ul>
//                                             {tabSelectedIndex === 2 && <ul className='new_righ_sub_two_tabs'>
//                                                 <li>
//                                                     <a className="" onClick={() => { setShowUploadDialog(true) }}>
//                                                         <div className="nw_user_tab_icon">
//                                                             <svg width="18" height="18" x="0" y="0" viewBox="0 0 64 64">
//                                                                 <g>
//                                                                     <g fill="#000">
//                                                                         <path fill-rule="evenodd" d="M42 2v10a8 8 0 0 0 8 8h11.977c.015.201.023.404.023.607V46c0 8.837-7.163 16-16 16H18C9.163 62 2 54.837 2 46V18C2 9.163 9.163 2 18 2zm1 30a2 2 0 0 1-2 2h-7v7a2 2 0 1 1-4 0v-7h-7a2 2 0 1 1 0-4h7v-7a2 2 0 1 1 4 0v7h7a2 2 0 0 1 2 2z" clip-rule="evenodd" fill="#ffffff" opacity="1" data-original="#000000"></path>
//                                                                         <path d="M46 2.742V12a4 4 0 0 0 4 4h10.54a7.995 7.995 0 0 0-1.081-1.241L48.093 4.152A7.998 7.998 0 0 0 46 2.742z" fill="#ffffff" opacity="1" data-original="#000000"></path>
//                                                                     </g>
//                                                                 </g>
//                                                             </svg>
//                                                         </div>
//                                                         <div className="nw_user_tab_name">
//                                                             Add
//                                                         </div>
//                                                     </a>
//                                                 </li>
//                                             </ul>
//                                             }
//                                         </div>
//                                     </div>
//                                     <div className="nw_user_inner_content_box" style={{ minHeight: '60vh' }}>
//                                         {tabSelectedIndex == 0 ?
//                                             // Company documents
//                                             <>
//                                                 <div className="user_document_right_listing mt-4">
//                                                     {orgDocArray.length > 0 ? (
//                                                         <div className="user_document_right_cardbox">
//                                                             {orgDocArray.map((doc, index) => {
//                                                                 const docEntry = doc.leap_client_documents?.[0]; // ✅ might be undefined
//                                                                 const fileUrl = docEntry?.document_url ?? ""; // fallback to empty string
//                                                                 const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
//                                                                 const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";

//                                                                 return (
//                                                                     <div className="user_document_right_card_listing" key={index}>
//                                                                         <div className="user_document_right_card_icon">
//                                                                             <img src="/images/user/adobe-pdf-icon.png" alt="PDF icon" className="img-fluid" />
//                                                                         </div>
//                                                                         <div className="user_document_right_card_content">
//                                                                             <div className="user_document_right_card_heading">
//                                                                                 {doc.leap_client_documents[0].document_url.substring(doc.leap_client_documents[0].document_url.lastIndexOf('/') + 1)}
//                                                                             </div>
//                                                                             <div className="user_document_right_card_two_btns">
//                                                                                 <div className="user_document_right_card_two_btns_list">
//                                                                                     <a href={doc.leap_client_documents[0].document_url} download >Download</a>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 )
//                                                             })}
//                                                         </div>
//                                                     ) : (
//                                                         <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                                                             <PageErrorCenterContent content={"No documents uploaded"} />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </>
//                                             : tabSelectedIndex == 1 ?
//                                                 // Official documents
//                                                 <>
//                                                     <div className="user_document_right_listing mt-4">
//                                                         {empOrgArray.length > 0 ? (
//                                                             <div className="user_document_right_cardbox">
//                                                                 {empOrgArray.map((doc, index) => {
//                                                                     const fileName = doc.leap_customer_documents[0].bucket_url!.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf("/") + 1) || "";
//                                                                     const fileExt = fileName.split(".").pop().toLowerCase();
//                                                                     return (
//                                                                         <div className="user_document_right_card_listing" key={index}>
//                                                                             <div className="user_document_right_card_icon">
//                                                                                 <img src="/images/user/adobe-pdf-icon.png" alt="PDF icon" className="img-fluid" />
//                                                                             </div>
//                                                                             <div className="user_document_right_card_content">
//                                                                                 <div className="user_document_right_card_heading">
//                                                                                     {doc.leap_customer_documents[0].bucket_url.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf('/') + 1)}
//                                                                                 </div>
//                                                                                 <div className="user_document_right_card_two_btns">
//                                                                                     <div className="user_document_right_card_two_btns_list">
//                                                                                         <a href={doc.leap_customer_documents[0].bucket_url} download >Download</a>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     )
//                                                                 })}
//                                                             </div>
//                                                         ) : (
//                                                             <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                                                                 <PageErrorCenterContent content={"No documents uploaded"} />
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </>
//                                                 : tabSelectedIndex == 2 ?
//                                                     // Personal documents
//                                                     <>
//                                                         <div className="user_document_right_listing mt-4">
//                                                             {empPerArray.length > 0 ? (
//                                                                 <div className="user_document_right_cardbox">
//                                                                     {empPerArray.map((doc, index) => {
//                                                                         const docEntry = doc.leap_customer_documents?.[0]; // ✅ might be undefined

//                                                                         const fileUrl = docEntry?.bucket_url ?? ""; // fallback to empty string
//                                                                         const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
//                                                                         const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";
//                                                                         return (
//                                                                             <div className="user_document_right_card_listing" key={index}>
//                                                                                 <div className="user_document_right_card_icon">
//                                                                                     <img src="/images/user/adobe-pdf-icon.png" alt="PDF icon" className="img-fluid" />
//                                                                                 </div>
//                                                                                 <div className="user_document_right_card_content">
//                                                                                     <div className="user_document_right_card_heading">
//                                                                                         {doc.leap_customer_documents[0].bucket_url.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf('/') + 1)}
//                                                                                     </div>
//                                                                                     <div className="user_document_right_card_two_btns">
//                                                                                         <div className="user_document_right_card_two_btns_list">
//                                                                                             <a href={doc.leap_customer_documents[0].bucket_url} download >Download</a>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         )
//                                                                     })}
//                                                                 </div>
//                                                             ) : (
//                                                                 <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                                                                     <PageErrorCenterContent content={"No documents uploaded"} />
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </>
//                                                     : <div />
//                                         }
//                                         {/* {showUploadDialog && <DialogUploadDocument onClose={() => { setShowUploadDialog(false); fetchEmployeeDoc() }} docType={employeeDocUpload} />} */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* ---------------------- */}
//                     <div className="nw_user_offcanvas">
//                                             <div className={showUploadDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
//                                                 {showUploadDialog && <DialogUserUploadDocument onClose={() => { setShowUploadDialog(false); fetchEmployeeDoc() }} docType={employeeDocUpload} />}
//                                             </div>
//                                         </div>
//                 </div>
//             } />
//             {/* </div> */}
//             <div>
//                 <Footer />
//             </div>
//         </div>
//     )
// }
// export default EmployeeDocuments;

// here employee can view their own personal documents and organizational related documents

// btn 1 : org doc-- /clientadmin/documents
// btn 2 : emp personal doc-- user/document/employee-doc
// pages/page.js

'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import { useEffect, useState } from 'react'
import { pageURL_assignLeaveForm, leftMenuLeavePageNumbers, leftMenuProjectMGMTPageNumbers, leftMenuProjectsSub1PageNumbers, baseUrl } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { FaFilePdf, FaFileAlt, FaDownload } from "react-icons/fa";
import LeftPannel from '@/app/components/leftPannel'
import DialogUploadDocument from '@/app/components/dialog_addDocument'
import { ALERTMSG_addAssetSuccess, ALERTMSG_exceptionString, employeeDocUpload, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'
import DialogUserUploadDocument from '@/app/components/dialog_userAddDoc'

const EmployeeDocuments = () => {

    const [loadingCursor, setLoadingCursor] = useState(false);
    const { contextClientID, contextCustomerID, contaxtBranchID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [orgDocArray, setOrgDoc] = useState<LeapClientDocuments[]>([]);
    const [empOrgArray, setEmpOrgDoc] = useState<OrganizationSpecific[]>([]);
    const [empPerArray, setEmpPerDoc] = useState<EmployeePersonal[]>([]);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        fetchCompanyDoc();
        fetchEmployeeDoc();
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

    const fetchCompanyDoc = async () => {
        // setLoading(true);
        try {
            const formData = new FormData();

            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }
            const res = await fetch(`/api/users/getCompanyDocuments`, {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                    "customer_id": contextCustomerID
                }),
            });
            const response = await res.json();
            console.log(response);
            const companyDoc = response.data;
            if (response.status == 1) {
                setOrgDoc(companyDoc)
                // setLoading(false);
            } else {
                setOrgDoc([]);
                // setLoading(false);
                // setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No documents uploaded yet!");
                setAlertForSuccess(2)
            }
        } catch (error) {
            // setLoading(false);
            console.error("Error fetching user data:", error);
            // setShowAlert(true);

            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
        setLoadingCursor(false);
    }

    const fetchEmployeeDoc = async () => {
        try {
            const formData = new FormData();
            // formData.append("client_id", contextClientID);
            // // formData.append("branch_id", contaxtBranchID )
            // formData.append("customer_id", contextCustomerID);

            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            const res = await fetch(`/api/users/getEmployeeDocuments`, {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    // "branch_id": contaxtBranchID,
                    "customer_id": contextCustomerID
                }),
            });
            const response = await res.json();
            // console.log(response);
            const empOrgDoc = response.organization_specific;
            const empPerDoc = response.employee_personal;

            if (response.status == 1 && empOrgDoc.length > 0) {
                setEmpOrgDoc(empOrgDoc)
                // setLoading(false);
            } else {
                setEmpOrgDoc(empOrgDoc);
                // setLoading(false);
                // setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No documents uploaded yet!");
                setAlertForSuccess(2)
            }
            if (response.status == 1 && empPerDoc.length > 0) {
                setEmpPerDoc(empPerDoc)
                // setLoading(false);
            } else {
                setEmpPerDoc(empPerDoc);
                // setLoading(false);
                // setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("No documents uploaded yet!");
                setAlertForSuccess(2)
            }
        } catch (error) {
            // setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
        setLoadingCursor(false);
    }
    const getFileIcon = (type: string, url: string) => {
        switch (type) {
            case "pdf":
                return <FaFilePdf className="text-danger fs-2" />;
            case "image":
                return <img src={baseUrl + url} alt="Thumbnail" width={50} height={50} />;
            case "xls":
                return <FaFileAlt className="text-success fs-2" />;
            case "doc":
                return <FaFileAlt className="text-primary fs-2" />;
            default:
                return <FaFileAlt className="text-secondary fs-2" />;
        }
    };
    return (
        <div className='mainbox user_mainbox_new_design new_user_support_mainbox user_black_overlay_main'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={25} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div>
                    {/* <LoadingDialog isLoading={isLoading} /> */}
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    {/* ---------------------- */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25 pt-3">
                                            Documents
                                        </div>
                                        <div className="nw_user_inner_tabs nw_user_inner_right_tabs new_righ_two_tabs">
                                            <ul className='new_righ_four_tabs'>
                                                <li className={tabSelectedIndex == 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
                                                    <a onClick={(e) => { setTabSelectedIndex(0), setLoadingCursor(true), fetchCompanyDoc() }} className={tabSelectedIndex == 0 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                <g>
                                                                    <path fill="#ffffff" d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v3h20V8c0-1.103-.897-2-2-2zM9 4h6v2H9zm5 10h-4v-2H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-8z" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Company
                                                        </div>
                                                    </a>
                                                </li>
                                                <li className={tabSelectedIndex == 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
                                                    <a onClick={(e) => { setTabSelectedIndex(1), setLoadingCursor(true), fetchEmployeeDoc() }} className={tabSelectedIndex == 1 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512">
                                                                <g>
                                                                    <path d="M136 242C61.561 242 1 302.561 1 377s60.561 135 135 135 135-60.561 135-135-60.561-135-135-135zm59.606 118.606-70 70C122.678 433.535 118.839 435 115 435s-7.678-1.465-10.606-4.394l-30-30c-5.858-5.857-5.858-15.355 0-21.213 5.857-5.857 15.355-5.857 21.213 0L115 398.787l59.394-59.394c5.857-5.857 15.355-5.857 21.213 0 5.857 5.858 5.857 15.356-.001 21.213z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                    <path d="M396 130c-8.284 0-15-6.716-15-15V0H166c-24.813 0-45 20.187-45 45v167.689c4.942-.448 9.943-.689 15-.689 51.128 0 96.897 23.376 127.186 60H426c8.284 0 15 6.716 15 15s-6.716 15-15 15H282.948a163.749 163.749 0 0 1 17.363 60H426c8.284 0 15 6.716 15 15s-6.716 15-15 15H300.311c-4.486 49.539-30.954 92.826-69.553 120H466c24.813 0 45-20.187 45-45V130zm30 82H206c-8.284 0-15-6.716-15-15s6.716-15 15-15h220c8.284 0 15 6.716 15 15s-6.716 15-15 15z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                    <path d="M411 8.783V100h91.211z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Official
                                                        </div>
                                                    </a>
                                                </li>
                                                <li className={tabSelectedIndex == 2 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={2}>
                                                    <a onClick={(e) => { setTabSelectedIndex(2), setLoadingCursor(true), fetchEmployeeDoc() }} className={tabSelectedIndex == 2 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512">
                                                                <g>
                                                                    <path d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Personal
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                            {tabSelectedIndex === 2 && <ul className='new_righ_sub_two_tabs'>
                                                <li>
                                                    <a className="" onClick={() => { setShowUploadDialog(true) }}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg width="18" height="18" x="0" y="0" viewBox="0 0 64 64">
                                                                <g>
                                                                    <g fill="#000">
                                                                        <path fill-rule="evenodd" d="M42 2v10a8 8 0 0 0 8 8h11.977c.015.201.023.404.023.607V46c0 8.837-7.163 16-16 16H18C9.163 62 2 54.837 2 46V18C2 9.163 9.163 2 18 2zm1 30a2 2 0 0 1-2 2h-7v7a2 2 0 1 1-4 0v-7h-7a2 2 0 1 1 0-4h7v-7a2 2 0 1 1 4 0v7h7a2 2 0 0 1 2 2z" clip-rule="evenodd" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                        <path d="M46 2.742V12a4 4 0 0 0 4 4h10.54a7.995 7.995 0 0 0-1.081-1.241L48.093 4.152A7.998 7.998 0 0 0 46 2.742z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                    </g>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Add
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                            }
                                        </div>
                                    </div>
                                    <div className="nw_user_inner_content_box" style={{ minHeight: '60vh' }}>
                                        {tabSelectedIndex == 0 ?
                                            // Company documents
                                            <>
                                                <div className="user_document_right_listing mt-4 mb-4">
                                                    {orgDocArray.length > 0 ? (
                                                        <div className="user_document_right_cardbox">
                                                            {orgDocArray.map((doc, index) => {
                                                                const docEntry = doc.leap_client_documents?.[0]; // ✅ might be undefined
                                                                const fileUrl = docEntry?.document_url ?? ""; // fallback to empty string
                                                                const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                                                                const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";

                                                                return (
                                                                    <div className="user_document_right_card_listing" key={index}>
                                                                        {/* ------ */}
                                                                        <div className="user_document_right_card_icon_download_box">
                                                                            <div className="user_document_right_card_icon">
                                                                                <img src={staticIconsBaseURL + "/images/user/adobe-pdf-icon.png"} alt="PDF icon" className="img-fluid" />
                                                                            </div>
                                                                            <div className="user_document_right_card_download">
                                                                                <a href={getImageApiURL + "/uploads/" + doc.leap_client_documents[0].document_url} download>
                                                                                    <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                                        <g>
                                                                                            <g fill="#000">
                                                                                                <path d="m15.241 10-1.982 1.982V3.25a1.25 1.25 0 1 0-2.5 0v8.732L8.777 10a1.25 1.25 0 0 0-1.768 1.768l4.116 4.116a1.25 1.25 0 0 0 1.768 0l4.116-4.116A1.25 1.25 0 0 0 15.24 10z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                                                <path d="M20.009 14c-.69 0-1.25.56-1.25 1.25v3.5h-13.5v-3.5a1.25 1.25 0 0 0-2.5 0V19a2.25 2.25 0 0 0 2.25 2.25h14a2.25 2.25 0 0 0 2.25-2.25v-3.75c0-.69-.56-1.25-1.25-1.25z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                                            </g>
                                                                                        </g>
                                                                                    </svg>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user_document_right_card_content">
                                                                            <div className="user_document_right_card_heading">
                                                                                {doc.leap_client_documents[0].document_url.substring(doc.leap_client_documents[0].document_url.lastIndexOf('/') + 1)}
                                                                            </div>
                                                                            <div className="user_document_right_card_type">
                                                                               {doc.document_name}
                                                                            </div>
                                                                        </div>
                                                                        {/* ------ */}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                            <PageErrorCenterContent content={"No documents uploaded"} />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                            : tabSelectedIndex == 1 ?
                                                // Official documents
                                                <>
                                                    <div className="user_document_right_listing mt-4 mb-4">
                                                        {empOrgArray.length > 0 ? (
                                                            <div className="user_document_right_cardbox">
                                                                {empOrgArray.map((doc, index) => {
                                                                    const fileName = doc.leap_customer_documents[0].bucket_url!.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf("/") + 1) || "";
                                                                    const fileExt = fileName.split(".").pop().toLowerCase();
                                                                    return (
                                                                        <div className="user_document_right_card_listing" key={index}>
                                                                            {/* ------ */}
                                                                            <div className="user_document_right_card_icon_download_box">
                                                                                <div className="user_document_right_card_icon">
                                                                                    <img src={staticIconsBaseURL + "/images/user/adobe-pdf-icon.png"} alt="PDF icon" className="img-fluid" />
                                                                                </div>
                                                                                <div className="user_document_right_card_download">
                                                                                    <a href={getImageApiURL + "/uploads/" + doc.leap_customer_documents[0].bucket_url} download>
                                                                                        <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                                            <g>
                                                                                                <g fill="#000">
                                                                                                    <path d="m15.241 10-1.982 1.982V3.25a1.25 1.25 0 1 0-2.5 0v8.732L8.777 10a1.25 1.25 0 0 0-1.768 1.768l4.116 4.116a1.25 1.25 0 0 0 1.768 0l4.116-4.116A1.25 1.25 0 0 0 15.24 10z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                                                    <path d="M20.009 14c-.69 0-1.25.56-1.25 1.25v3.5h-13.5v-3.5a1.25 1.25 0 0 0-2.5 0V19a2.25 2.25 0 0 0 2.25 2.25h14a2.25 2.25 0 0 0 2.25-2.25v-3.75c0-.69-.56-1.25-1.25-1.25z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                                                </g>
                                                                                            </g>
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                            <div className="user_document_right_card_content">
                                                                                <div className="user_document_right_card_heading">
                                                                                    {doc.leap_customer_documents[0].bucket_url.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf('/') + 1)}
                                                                                </div>
                                                                                <div className="user_document_right_card_type">
                                                                                    {doc.document_name}
                                                                                </div>
                                                                            </div>
                                                                            {/* ------ */}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                                <PageErrorCenterContent content={"No documents uploaded"} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                                : tabSelectedIndex == 2 ?
                                                    // Personal documents
                                                    <>
                                                        <div className="user_document_right_listing mt-4 mb-4">
                                                            {empPerArray.length > 0 ? (
                                                                <div className="user_document_right_cardbox">
                                                                    {empPerArray.map((doc, index) => {
                                                                        const docEntry = doc.leap_customer_documents?.[0]; // ✅ might be undefined

                                                                        const fileUrl = docEntry?.bucket_url ?? ""; // fallback to empty string
                                                                        const fullFileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                                                                        const fileExt = fullFileName.split(".").pop()?.toLowerCase() ?? "";
                                                                        const originalFileName = fullFileName.replace(/_client_org_docs.*$/, "") + "." + fileExt;
                                                                        return (
                                                                            <div className="user_document_right_card_listing" key={index}>
                                                                                {/* ------ */}
                                                                                <div className="user_document_right_card_icon_download_box">
                                                                                    <div className="user_document_right_card_icon">
                                                                                        <img src={staticIconsBaseURL + "/images/user/adobe-pdf-icon.png"} alt="PDF icon" className="img-fluid" />
                                                                                    </div>
                                                                                    <div className="user_document_right_card_download">
                                                                                        <a href={getImageApiURL + "/uploads/" + doc.leap_customer_documents[0].bucket_url} download> 
                                                                                            <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                                                <g>
                                                                                                    <g fill="#000">
                                                                                                        <path d="m15.241 10-1.982 1.982V3.25a1.25 1.25 0 1 0-2.5 0v8.732L8.777 10a1.25 1.25 0 0 0-1.768 1.768l4.116 4.116a1.25 1.25 0 0 0 1.768 0l4.116-4.116A1.25 1.25 0 0 0 15.24 10z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                                                        <path d="M20.009 14c-.69 0-1.25.56-1.25 1.25v3.5h-13.5v-3.5a1.25 1.25 0 0 0-2.5 0V19a2.25 2.25 0 0 0 2.25 2.25h14a2.25 2.25 0 0 0 2.25-2.25v-3.75c0-.69-.56-1.25-1.25-1.25z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                                                    </g>
                                                                                                </g>
                                                                                            </svg>
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="user_document_right_card_content">
                                                                                    <div className="user_document_right_card_heading">
                                                                                        {/* {doc.leap_customer_documents[0].bucket_url.substring(doc.leap_customer_documents[0].bucket_url.lastIndexOf('/') + 1)} */}
                                                                                        {originalFileName}
                                                                                    </div>
                                                                                    <div className="user_document_right_card_type">
                                                                                        {doc.document_name}
                                                                                    </div>
                                                                                </div>
                                                                                {/*------*/}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                                                    <PageErrorCenterContent content={"No documents uploaded"} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                    : <div />
                                        }
                                        {/* {showUploadDialog && <DialogUploadDocument onClose={() => { setShowUploadDialog(false); fetchEmployeeDoc() }} docType={employeeDocUpload} />} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ---------------------- */}
                    <div className="nw_user_offcanvas">
                        <div className={showUploadDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showUploadDialog && <DialogUserUploadDocument onClose={() => { setShowUploadDialog(false); fetchEmployeeDoc() }} docType={employeeDocUpload} />}
                        </div>
                        <div className="overlay_offcanvas"></div>
                    </div>
                </div>
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}
export default EmployeeDocuments;