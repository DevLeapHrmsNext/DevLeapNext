
'use client'
import React, { useRef } from 'react'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { UserNotification } from '../models/userDashboardModel'
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants'
import { pageURL_attendanceDetails, pageURL_attendanceList, pageURL_clientAdminSupport, pageURL_leaveListingPage, pageURL_ProjectsTaskPage, pageURL_userAttendance, pageURL_userLeave, pageURL_userSupport, pageURL_userTaskListingPage, pageURL_userTeamAttendanceList, pageURL_userTeamLeave } from '../pro_utils/stringRoutes'
import moment from 'moment'
import { useRouter } from 'next/navigation'

const UserNotificationCorner = ({ onClose }: { onClose: any }) => {
     const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
                contextLogoURL, contextRoleID,isAdmin, contextProfileImage, contextUserName,
                setGlobalState } = useGlobalContext();
    const router=useRouter();
                
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [notificationData, setNotifyData] = useState<UserNotification[]>([]);
    const [showLeaveApprovalDialog,setShowLeaveApprovalDialog]=useState(false);        
    const [leaveToBeEdited,setLeaveToBeEdited]=useState(false); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            let res ;
           if(contextRoleID=='2' && isAdmin=='1'){
                res = await fetch("/api/clientAdmin/notifications", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        
                    }),
                });
           } else{
                res = await fetch("/api/users/appNotification", {
                        method: "POST",
                        body: JSON.stringify({
                            "client_id": contextClientID,
                            "customer_id": contextCustomerID,
                            "role_id": contextRoleID
                        }),
                    });
            }
            const response = await res.json();
            const user = response.data;
            if (response.status == 1) {
                setNotifyData(user);
                setLoading(false);
            } else {
                setLoading(false);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load noti");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    }

    function handleViewNavigation(type_id:any,customer_id:any,relatedId:any){
    
            console.log("hadndle view navigation callied and the id is ",relatedId);
            
            
            if(type_id==3){
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
                    contextAnnouncementID: '',
                    contextAddFormCustID: '',
                    dashboard_notify_cust_id: customer_id+"",
                    dashboard_notify_activity_related_id: relatedId,
                    selectedClientCustomerID: '',
                    isAdmin: isAdmin,
                    contextPARAM8: '',
        
                });
                setLeaveToBeEdited(false)
                router.push(pageURL_leaveListingPage); 
                // return pageURL_leaveListingPage;
            }else if(type_id==2){
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
                    contextAnnouncementID: '',
                    contextAddFormCustID: '',
                    dashboard_notify_cust_id:customer_id+"",
                    dashboard_notify_activity_related_id: relatedId,
                    selectedClientCustomerID: '',
                    isAdmin: isAdmin,
                    contextPARAM8: '',
        
                });
                setLeaveToBeEdited(false)
                router.push(pageURL_ProjectsTaskPage); 
                // return pageURL_leaveListingPage;
            }else if(type_id==1){
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
                    contextAnnouncementID: '',
                    contextAddFormCustID: '',
                    dashboard_notify_cust_id: customer_id+'',
                    dashboard_notify_activity_related_id: relatedId,
                    selectedClientCustomerID: '',
                    isAdmin: isAdmin,
                    contextPARAM8: '',
        
                });
                router.push(pageURL_attendanceDetails);
            }
        }
    return (
        <div className="">
            <div className="">
                <LoadingDialog isLoading={isLoading} />
                <div className='rightpoup_close' onClick={(e) => onClose(false)}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="nw_user_offcanvas_mainbox">
                    <div className="nw_user_offcanvas_heading">
                        Notification Corner
                    </div>
                    <div className="nw_user_offcanvas_listing_mainbox">
                        
                        <div className="">
                            {/*activity_type_id:- 1 - attendance, 
                                                    2 - task,
                                                    3 - leave,
                                                    5 - support */}
                            {notificationData && notificationData.length > 0 ?
                                notificationData.map((noti, index) => (
                                    <React.Fragment key={index}>
                                    {noti.date && <div className='nw_notification_date_listing'>{moment(noti.date, "DD/MM/YYYY").format("Do MMMM")}</div>}
                                    {noti.listing.map((notiList, i) => (
                                        notiList.type == "user" ?
                                            <ul className="nw_notification_table_listing" key={i} style={{fontSize:"15px"}}>
                                                {/* <li> */}
                                                {notiList.activity_type_id.id === 1 ? ( //attendance
                                                    <div style={{ cursor: "pointer" }} onClick={() => contextRoleID=='2' && isAdmin=='1'? handleViewNavigation(notiList.activity_type_id.id,notiList.customer_id,notiList.activity_related_id):window.location.href = pageURL_userAttendance}>
                                                        {notiList.activity_type_id.activity_type} : {notiList.activity_details}
                                                        <span className='notification_detail_icon'>
                                                        </span>
                                                    </div>
                                                ) : notiList.activity_type_id.id === 2 ? ( //task
                                                    <div style={{ cursor: "pointer" }} onClick={() => contextRoleID=='2' && isAdmin=='1'? handleViewNavigation(notiList.activity_type_id.id,notiList.customer_id,notiList.activity_related_id):window.location.href = pageURL_userTaskListingPage}>
                                                        {notiList.activity_type_id.activity_type} : {notiList.activity_details}
                                                    </div>
                                                ) : notiList.activity_type_id.id === 3 ? ( //leave
                                                    <div style={{ cursor: "pointer" }} onClick={() => contextRoleID=='2' && isAdmin=='1'? handleViewNavigation(notiList.activity_type_id.id,notiList.customer_id,notiList.activity_related_id):window.location.href = pageURL_userLeave}>
                                                        {notiList.activity_type_id.activity_type} : {notiList.activity_details}
                                                    </div>
                                                ) : notiList.activity_type_id.id === 5 ? ( //support
                                                    <div style={{ cursor: "pointer" }} onClick={() => contextRoleID=='2' && isAdmin=='1'? handleViewNavigation(notiList.activity_type_id.id,notiList.customer_id,notiList.activity_related_id):window.location.href = pageURL_userSupport}>
                                                        {notiList.activity_type_id.activity_type} : {notiList.activity_details}
                                                    </div>
                                                ) : (
                                                    <div >
                                                        {notiList.activity_type_id.activity_type} : {notiList.activity_details}
                                                        
                                                    </div>
                                                )}
                                            </ul> : notiList.type == "team" ?
                                                <ul className="nw_notification_table_listing" key={index}>
                                                    {notiList.activity_type_id.id === 1 ? (
                                                        <div style={{ cursor: "pointer" }} onClick={() => window.location.href = pageURL_userTeamAttendanceList}>
                                                            {notiList.customer_name} : {notiList.activity_type_id.activity_type} - {notiList.activity_details}
                                                            
                                                        </div>
                                                    ) : notiList.activity_type_id.id === 2 ? (
                                                        <div style={{ cursor: "pointer" }} onClick={() => window.location.href = pageURL_userTaskListingPage}>
                                                            {notiList.customer_name} : {notiList.activity_type_id.activity_type} - {notiList.activity_details}
                                                            
                                                        </div>
                                                    ) : notiList.activity_type_id.id === 3 ? (
                                                        <div style={{ cursor: "pointer" }} onClick={() => window.location.href = pageURL_userTeamLeave}>
                                                            {notiList.customer_name} : {notiList.activity_type_id.activity_type} - {notiList.activity_details}
                                                           
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {notiList.customer_name} : {notiList.activity_type_id.activity_type} - {notiList.activity_details}
                                                            
                                                        </div>
                                                    )}
                                                </ul>
                                                : <></>
                                    ))}
                                    </React.Fragment>
                                )) : (
                                    <div className="user_notification_list" style={{fontSize:"23px",textAlign:"center"}}>No Notifications!</div>
                                )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserNotificationCorner;