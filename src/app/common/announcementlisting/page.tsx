'use client'
import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation';
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header';
import LeftPannel from '@/app/components/leftPannel';
import LoadingDialog from '@/app/components/PageLoader';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { announcementListingPage, deleteDataTypeAnnouncement, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { pageURL_createAnnouncement, leftMenuAnnouncementPageNumbers, pageURL_updateAnnouncement } from '@/app/pro_utils/stringRoutes';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AnnouncementListing = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [AnnouncementDeleteID, setAnnouncementDeleteID] = useState(0);
    const [ShowDeleteAnnouncementDialog, setShowDeleteAnnouncementDialog] = useState(false);
    const [AnnouncementDeleteTitle, setAnnouncementDeleteTitle] = useState('');
    const [announcementList, setAnnouncementList] = useState<AnnouncementList[]>([]);
    const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
        contextLogoURL, contextRoleID, contextProfileImage,isAdmin, contextUserName, setGlobalState } = useGlobalContext();
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
            formData.append("client_id", contextClientID);
            formData.append("customer_id", contextCustomerID);
            formData.append("branch_id", contaxtBranchID);
            formData.append("role_id", contextRoleID);


            const res = await fetch(`/api/clientAdmin/getAnnouncementList`, {
                cache: "no-store",
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "customer_id": contextCustomerID,
                    "branch_id": contaxtBranchID,
                    "role_id": contaxtBranchID
                }),
            });
            if (res.ok) {
                const response = await res.json();
                if (response.status === 1) {
                    setAnnouncementList(response.data);
                    setLoading(false);
                } else {
                    alert(response.message)
                    setLoading(false);
                }

            } else {
                setLoading(false);
                alert("Something went wrong")
            }
        } catch (error) {
            setLoading(false);
            alert("Exception occured :- " + error)
            console.log("Error fetching data:", error);
        }

    };

    const goToUpdate = (e: any, contextAnnouncementID: any) => {
        console.log("edit", contextAnnouncementID);
        
        
        setGlobalState({
            contextUserName: contextUserName,
            contextClientID: contextClientID,
            contaxtBranchID: contaxtBranchID,
            contextCustomerID: contextCustomerID,
            contextRoleID: contextRoleID,
            contextProfileImage: contextProfileImage,
            contextEmployeeID: contextEmployeeID,
            contextCompanyName: contextCompanyName,
            contextLogoURL: contextLogoURL,
            contextSelectedCustId: '',
            contextAddFormEmpID: '',
            contextAnnouncementID: contextAnnouncementID,
            contextAddFormCustID: '',
            dashboard_notify_cust_id: '',
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            isAdmin: isAdmin,
            contextPARAM8: '',
        });
        
        router.push(pageURL_updateAnnouncement);
    }

    return (

        <div className='mainbox'>
            <header>
                <LeapHeader title={announcementListingPage} />
            </header>
            <LeftPannel menuIndex={leftMenuAnnouncementPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                <div className='container'>
                    <LoadingDialog isLoading={isLoading} />
                    <div className='inner_heading_sticky'>
                        <div className="row heading25 mb-3 pt-2">
                            <div className="col-lg-8">
                                Announcement/ News <span>list</span>
                            </div>
                            <div className="col-lg-4 mb-2" style={{ textAlign: "right" }}>
                                <a href={pageURL_createAnnouncement} className="red_button" >Create Announcement</a>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="row">
                            {announcementList && announcementList.length>0?announcementList.map((announcement) => (
                                <div className="col-md-3 text-center col-sm-6 mb-3" key={announcement.announcement_id} >
                                    <div className='announcement_list'>
                                        <div className="row">
                                            <div className="col-lg-12 mb-3">
                                                <div className='announcement_img' style={{height:'100px'}}>
                                                    <img src={announcement.announcement_image && announcement.announcement_image.length > 0 ? getImageApiURL + "/uploads/" + announcement.announcement_image : staticIconsBaseURL + "/images/"} onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/announcement_default_img.png"; }} alt='text' className="img-fluid" style={{ objectFit: 'cover', }} />
                                                </div>
                                            </div>

                                            <div className="col-lg-12 mb-2 announcement_heading" style={{
                                                wordWrap: "break-word",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3, // max lines
                                                WebkitBoxOrient: "vertical"
                                            }}>{announcement.announcement_title}</div>
                                            <div className="col-lg-12 mb-3 announcement_content" style={{
                                                wordWrap: "break-word",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3, // max lines
                                                WebkitBoxOrient: "vertical"
                                            }}>{announcement.announcement_details}</div>
                                            <div className="col-lg-12 mb-3">
                                                <div className='announcement_edit' onClick={(e) => goToUpdate(e, announcement.announcement_id)}>Edit</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )):isLoading?<></>:<div className="no_data_available">
                                        <h4 className="text-muted">No Announcement Available</h4>
                                    </div>}
                        </div>
                    </div> </div>} />
            <Footer />
        </div>
    );
}

export default AnnouncementListing