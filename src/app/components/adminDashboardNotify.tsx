import React, { useState } from 'react'
import { pageURL_attendanceDetails, pageURL_attendanceList, pageURL_leaveListingPage, pageURL_ProjectsTaskPage, pageURL_userTaskListingPage } from '../pro_utils/stringRoutes';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { useRouter } from 'next/navigation';
import LeaveStatusUpdate from './dialog_approvalStatus';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';

const AdminDashboardNotify = ({ activity }: { activity: LeapUserActivitiesModel }) => {
    
    let i = 1;
    const router=useRouter();
    const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
            contextLogoURL, contextRoleID, contextProfileImage, contextUserName,
            setGlobalState } = useGlobalContext();
    const [leaveID,setLeaveID]=useState();        
    const [showLeaveApprovalDialog,setShowLeaveApprovalDialog]=useState(false);        
    const [leaveToBeEdited,setLeaveToBeEdited]=useState(false);        
    function handleViewNavigation(){

        console.log("hadndle view navigation callied and the id is ",activity.activity_related_id);
        
        
        if(activity.activity_type_id==3){
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
                dashboard_notify_cust_id: activity.customer_id+"",
                dashboard_notify_activity_related_id: activity.activity_related_id,
                selectedClientCustomerID: '',
                isAdmin: '',
                contextPARAM8: '',
    
            });
            setLeaveToBeEdited(false)
            router.push(pageURL_leaveListingPage); 
            // return pageURL_leaveListingPage;
        }else if(activity.activity_type_id==2){
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
                dashboard_notify_cust_id: activity.customer_id+"",
                dashboard_notify_activity_related_id: activity.activity_related_id,
                selectedClientCustomerID: '',
                isAdmin: '',
                contextPARAM8: '',
    
            });
            setLeaveToBeEdited(false)
            router.push(pageURL_ProjectsTaskPage); 
            // return pageURL_leaveListingPage;
        }else if(activity.activity_type_id==1){
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
                dashboard_notify_cust_id: activity.customer_id+'',
                dashboard_notify_activity_related_id: activity.activity_related_id,
                selectedClientCustomerID: '',
                isAdmin: '',
                contextPARAM8: '',
    
            });
            router.push(pageURL_attendanceDetails);
        }
    }
    
    
        return (
            <div className="col-lg-12 mb-3">
                <div style={{ backgroundColor: "#fff9ed", width: "100%", padding: "10px", borderRadius: "10px", fontSize: "14px" }}>
                    <div className="row">
                        <div className="col-lg-12 mb-2"><b>{activity.leap_user_activity_type.activity_type}</b></div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3" style={{height:"60px"}}>
                            <img src={activity.customer_image && activity.customer_image.length>0?getImageApiURL+"/uploads/"+activity.customer_image  :staticIconsBaseURL+"/images/userlist/userimg2.png"} 
                            className="img-fluid" style={{ height: "100%", width: "auto", objectFit: "contain" }}
                            onError={(e) => {
                                    e.currentTarget.src = staticIconsBaseURL + "/images/attendance_profile_img.png"; // fallback
                                }}
                            />
                            </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-lg-12"><b>{activity.customer_name}</b></div>
                                <div className="col-lg-12 mb-2">{activity.designation_name} / {activity.department_name}</div>
                                <div className="col-lg-12 leave_links">
                                    
                               {activity.activity_status==1 && activity.activity_type_id==3? 
                                        <a onClick={()=>{
                                            if(activity.activity_status==1){
                                            setShowLeaveApprovalDialog(true);
                                            setLeaveToBeEdited(true)
                                            setLeaveID(activity.activity_related_id);
                                        }}} 
                                            style={{ backgroundColor: "#71ab46" ,color:"#FFF", cursor:"pointer"}}>Approve</a>:<></>}
                                    {activity.activity_status==1 && activity.activity_type_id==3? 
                                    <a onClick={()=>{
                                        if(activity.activity_status==1){
                                        setShowLeaveApprovalDialog(true);
                                        setLeaveToBeEdited(true)
                                        setLeaveID(activity.activity_related_id);
                                        }}} 
                                        style={{ backgroundColor: "#ed2024",color:"#FFF", cursor:"pointer", marginLeft:5,marginRight:5 }}>Reject</a>:<></>}

                                {activity.activity_status==2 && activity.activity_type_id==3? 
                                                <a style={{ backgroundColor: "#71ab46" ,color:"#FFF", cursor:"pointer", marginRight:"5px"}}>Approved</a>
                                            :activity.activity_status==3 && activity.activity_type_id==3? 
                                                <a style={{ backgroundColor: "#ed2024" ,color:"#FFF", cursor:"pointer" ,marginRight:"5px"}}>Rejected</a> :<></>}        
                               {/* href={handleViewNavigation()} */}
                                <a onClick={()=>{handleViewNavigation()}} style={{color:"#FFF", cursor:"pointer"}}>View</a>
                                </div>
                            </div>
                            <div className={showLeaveApprovalDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showLeaveApprovalDialog && <LeaveStatusUpdate id={activity.activity_related_id} selectedShortCutID={activity.id} onClose={() => { setShowLeaveApprovalDialog(false); } } isToBeEddited={leaveToBeEdited} />}

                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    
    // if (activity.activity_type_id === 2) {///task Notification
    //     <div className="col-lg-12 mb-3">
    //         <div style={{ backgroundColor: "#ecf8e7", width: "100%", padding: "10px", borderRadius: "10px", fontSize: "14px " }}>
    //             <div className="row">
    //                 <div className="col-lg-12 mb-2"><b>{activity.leap_user_activity_type.activity_type}</b></div>
    //             </div>
    //             <div className="row">
    //                 <div className="col-lg-4"><img src="./images/userlist/userimg2.png" className="img-fluid" /></div>
    //                 <div className="col-lg-8">
    //                     <div className="row">
    //                         <div className="col-lg-12"><b>{activity.customer_id}</b></div>
    //                         <div className="col-lg-12 mb-2">{activity.designation_name} / {activity.department_name}</div>
    //                         <div className="col-lg-12 leave_links">
    //                             <a href="#" style={{ backgroundColor: "#71ab46" }}>Approve</a>
    //                             <a href="#" style={{ backgroundColor: "#ed2024" }}>Reject</a>
    //                             <a href="#">View</a>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // } else {
    //     return (
    //         <div className="col-lg-12">
    //             <div style={{ backgroundColor: "#fff9ed", width: "100%", padding: "10px", borderRadius: "10px", fontSize: "14px" }}>
    //                 <div className="row">
    //                     <div className="col-lg-12 mb-2"><b>Leave Request</b></div>
    //                 </div>
    //                 <div className="row">
    //                     <div className="col-lg-4"><img src="./images/userlist/userimg2.png" className="img-fluid" /></div>
    //                     <div className="col-lg-8">
    //                         <div className="row">
    //                             <div className="col-lg-12"><b>Suyog Despande</b></div>
    //                             <div className="col-lg-12 mb-2">Network Admin / Department</div>
    //                             <div className="col-lg-12 leave_links">
    //                                 <a href="#" style={{ backgroundColor: "#71ab46" }}>Approve</a>
    //                                 <a href="#" style={{ backgroundColor: "#ed2024" }}>Reject</a>
    //                                 <a href="#">View</a>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }
}

export default AdminDashboardNotify