// 'use client'
// import Footer from '@/app/components/footer';
// import LeapHeader from '@/app/components/header';
// import LeftPannel from '@/app/components/leftPannel';
// import LoadingDialog from '@/app/components/PageLoader';
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
// import { announcementListingPage, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'

// import { ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants'
// import ShowAlertMessage from '@/app/components/alert'
// import PageErrorCenterContent from '@/app/components/pageError';
// const AnnouncementListing = () => {
//     const [showAlert,setShowAlert]=useState(false);
//     const [alertForSuccess,setAlertForSuccess]=useState(0);
//     const [alertTitle,setAlertTitle]=useState('');
//     const [alertStartContent,setAlertStartContent]=useState('');
//     const [alertMidContent,setAlertMidContent]=useState('');
//     const [alertEndContent,setAlertEndContent]=useState('');
//     const [alertValue1,setAlertValue1]=useState('');
//     const [alertvalue2,setAlertValue2]=useState('');
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
//     const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
//         contextLogoURL, contextRoleID, contextProfileImage, contextUserName, setGlobalState } = useGlobalContext();
//     const router = useRouter();
//     const [isLoading, setLoading] = useState(true);
//     useEffect(() => {
//         // checkIfLogin();
//         fetchData();
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
//     }, []);
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             // formData.append("client_id", contextClientID);
//             // // formData.append("customer_id", contextCustomerID);
//             // formData.append("branch_id", contaxtBranchID);
//             // formData.append("role_id", contextRoleID);

//             const res = await fetch(`/api/clientAdmin/getAnnouncementList`, {
//                 cache: "no-store",
//                 method: "POST",
//                 body: JSON.stringify({
//                     "client_id": contextClientID,
//                     "branch_id": contaxtBranchID,
//                     "role_id": contextRoleID
//                 }),
//             });
//             if (res.ok) {
//                 const response = await res.json();
//                 console.log(response);
//                 if (response.status === 1) {
//                     setAnnouncementList(response.data);
//                     setLoading(false);
//                 } else {
//                     setLoading(false);
//                     setShowAlert(true);
//                     setAlertTitle("Error");
//                     setAlertStartContent("No data exists.");
//                     setAlertForSuccess(2);
//                 }
//             } else {
//             setLoading(false);
//             setShowAlert(true);
//             setAlertTitle("Exception");
//             setAlertStartContent(ALERTMSG_exceptionString);
//             setAlertForSuccess(2);
//             }
//         } catch (error) {
//             setLoading(false);
//             alert("Exception occured :- " + error)
//             console.log("Error fetching data:", error);
//         }
//     };
    
//     return (
//         <div className='mainbox user_mainbox_new_design'>
//             <header>
//                 <LeapHeader title={announcementListingPage} />
//             </header>
//             <LeftPannel menuIndex={29} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//                 <div className='container'>
//                     <LoadingDialog isLoading={isLoading} />
//                     {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//                             setShowAlert(false)
//                         }} onCloseClicked={function (): void {
//                             setShowAlert(false)
//                         }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//                     <div className="row heading25 mb-3">
//                         <div className="col-lg-8">
//                             Announcement/ News <span>list</span>
//                         </div>
//                     </div>&nbsp;
//                         <div className="row">
//                             {announcementList && announcementList.length > 0 ? (announcementList.map((announcement, index) => (
//                                 <div className="col-md-3 text-center col-sm-6 mb-3" key={index} >
//                                     <div className='announcement_list'>
//                                         <div className="row">
//                                             <div className="col-lg-12 mb-3">
//                                                 <div className='announcement_img'>
//                                                     <img src={announcement.leap_client_announcements.announcement_image && announcement.leap_client_announcements.announcement_image.length > 0 ? getImageApiURL + announcement.leap_client_announcements.announcement_image : staticIconsBaseURL + "/images/"} onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/announcement_default_img.png"; }} alt='text' className="img-fluid" style={{ objectFit: 'cover', }} />
//                                                 </div>
//                                             </div>
//                                             <div className="col-lg-12 mb-2 announcement_heading">{announcement.leap_client_announcements.announcement_title}</div>
//                                             <div className="col-lg-12 mb-3 announcement_content">{announcement.leap_client_announcements.announcement_details}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))): 
//                                 <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
//                                     <PageErrorCenterContent content={"No recent Announcement"}/>
//                                 </div>
//                             }
//                         </div>
//                     </div> } />
//             <Footer />
//         </div>
//     );
// }

// export default AnnouncementListing
'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header';
import LeftPannel from '@/app/components/leftPannel';
import LoadingDialog from '@/app/components/PageLoader';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { announcementListingPage, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import { ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import PageErrorCenterContent from '@/app/components/pageError';
const AnnouncementListing = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
    const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
        contextLogoURL, contextRoleID, contextProfileImage, contextUserName, setGlobalState } = useGlobalContext();
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        // checkIfLogin();
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
    const fetchData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            // formData.append("client_id", contextClientID);
            // // formData.append("customer_id", contextCustomerID);
            // formData.append("branch_id", contaxtBranchID);
            // formData.append("role_id", contextRoleID);

            const res = await fetch(`/api/clientAdmin/getAnnouncementList`, {
                cache: "no-store",
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": contaxtBranchID,
                    "role_id": contextRoleID
                }),
            });
            if (res.ok) {
                const response = await res.json();
                console.log(response);
                if (response.status === 1) {
                    setAnnouncementList(response.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setShowAlert(true);
                    setAlertTitle("Error");
                    setAlertStartContent("No data exists.");
                    setAlertForSuccess(2);
                }
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception");
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2);
            }
        } catch (error) {
            setLoading(false);
            alert("Exception occured :- " + error)
            console.log("Error fetching data:", error);
        }
    };

    return (
        <div className='mainbox user_mainbox_new_design user_announcement_mainbox'>
            <header>
                <LeapHeader title={announcementListingPage} />
            </header>
            <LeftPannel menuIndex={29} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                // -------New structure statrt---------
                <div className='container'>
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="nw_user_inner_mainbox">
                                <div className="nw_user_inner_heading_tabbox">
                                    <div className="heading25">
                                        Announcement/ News list
                                    </div>
                                    <div className="nw_user_inner_tabs nw_user_inner_right_tabs">
                                        <ul>
                                            <li className='filter_relative_li' style={{ visibility: 'hidden', opacity: '1' }}>
                                                <a href="#">
                                                    <div className="nw_user_tab_icon">
                                                        <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                            <g>
                                                                <path fill="#ffffff" d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v3h20V8c0-1.103-.897-2-2-2zM9 4h6v2H9zm5 10h-4v-2H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-8z" opacity="1" data-original="#000000"></path>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="nw_user_inner_content_box" style={{ minHeight: '60vh' }}>
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <div className="new_user_aanouncement_mainbox">
                                                {announcementList && announcementList.length > 0 ? (announcementList.map((announcement, index) => (
                                                    <div className="new_user_announcement_listing" key={index}>
                                                        <div className="new_user_announcement_imgbox">
                                                            <img src={announcement.leap_client_announcements.announcement_image && announcement.leap_client_announcements.announcement_image.length > 0 ? getImageApiURL + "/uploads/" + announcement.leap_client_announcements.announcement_image : staticIconsBaseURL + "/images/"}
                                                                onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/announcement_default_img.png"; }}
                                                                alt='text' className="img-fluid" />
                                                        </div>
                                                        <div className="new_user_announcement_heading_contentbox">
                                                            <div className="new_user_announcement_heading">
                                                                {announcement.leap_client_announcements.announcement_title}
                                                            </div>
                                                            <div className="new_user_announcement_content">
                                                                {announcement.leap_client_announcements.announcement_details}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))) :
                                                    <div className="d-flex justify-content-center align-items-center announcment_no_data_box">
                                                        <PageErrorCenterContent content={"No recent Announcement"} />
                                                    </div>
                                                }
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                // -------New structure ends-----------
            }
            />
            <Footer />
        </div>
    );
}

export default AnnouncementListing