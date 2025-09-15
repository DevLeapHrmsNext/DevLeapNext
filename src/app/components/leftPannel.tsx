'use client'
import React, { useEffect, useState } from 'react'
import { pageURL_addUserBasicDetailForm, pageURL_announcementListingPage, pageURL_assetListing, pageURL_attendanceList, pageURL_clientAdminSettingsPage, pageURL_clientProfilePage, pageURL_companyDocumentsPage, pageURL_createAnnouncement, pageURL_dashboard, pageURL_employeeDocumentsPage, pageURL_leaveListingPage, leftMenuAddEmployeePageNumbers, leftMenuAnnouncementPageNumbers, leftMenuAssetsPageNumbers, leftMenuAttendancePageNumbers, leftMenuDashboardPageNumbers, leftMenuDocumentsPageNumbers, leftMenuDocumentsSub1PageNumbers, leftMenuDocumentsSub2PageNumbers, leftMenuEmployeeListPageNumbers, leftMenuHRPageNumbers, leftMenuLeavePageNumbers, leftMenuMessagePageNumbers, leftMenuNoticePageNumbers, leftMenuProfilePageNumbers, leftMenuProjectMGMTPageNumbers, leftMenuteamMeetPageNumbers, pageURL_userList, leftMenuPayrollSub1PageNumbers, leftMenuPayrollSub2PageNumbers, pageURL_companyPayroll, pageURL_customizePayroll, leftMenuCompanyPayrollPageNumbers, leftMenuProjectsSub1PageNumbers, leftMenuProjectsSub2PageNumbers, pageURL_ProjectsPage, pageURL_ProjectsTaskPage, leftMenuAdminSettingsPageNumbers, pageURL_userEmpDashboard, pageURL_userAttendance, leftMenuUserDashboard, pageURL_userTaskListingPage, pageURL_userLeave, leftMenuUserLeave, leftMenuUserAttendance, leftMenuUserTask, leftMenuUserAsset, leftMenuUserDocuments, pageURL_userAsset, pageURL_userDoc, pageURL_userOrganisation, leftMenuUserOrg, pageURL_userSupport, leftMenuUserSupport, leftMenuCustomerListPageNumbers, pageURL_clientAdminSupport, pageURL_orgHierarchy, pageURL_customerListPage, leftMenuOrgHierarchy, pageURL_userAnnouncement, leftMenuUserAnnouncement } from '../pro_utils/stringRoutes';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import supabase from '../api/supabaseConfig/supabase';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';

type LeftPanelProps = {
    menuIndex: number;
    subMenuIndex: number;
    showLeftPanel: boolean;
    rightBoxUI: React.ReactNode;
};

interface userPermissionModel {
    permission_id: '',
    is_allowed: false
}

const LeftPannel = ({ menuIndex, subMenuIndex, showLeftPanel, rightBoxUI }: LeftPanelProps) => {
    const [toggleClass, setToggleClass] = useState("middle_box");
    const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(menuIndex);
    const [selectedSubMenuItemIndex, setSelectedSubMenuItemIndex] = useState(subMenuIndex);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [permissionData, setPermissionData] = useState<userPermissionModel[]>();
    const [showDocSubMenu, setShowDocSubMenu] = useState(false);
    const [showProjectSuMenus, setShowProjectSuMenus] = useState(false);
    const [showPayrollSubMenus, setShowPayrollSubMenus] = useState(false);
    const { contaxtBranchID, contextClientID, contextRoleID,isAdmin,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName, dashboard_notify_activity_related_id, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const user = await getUserPermission(contextClientID);
            setPermissionData(user);
        }
        const setsubIndex = () => {
            if (subMenuIndex == leftMenuDocumentsSub1PageNumbers || subMenuIndex == leftMenuDocumentsSub2PageNumbers) {
                setShowDocSubMenu(true);
                setShowProjectSuMenus(false);
                setShowPayrollSubMenus(false);
            } else if (subMenuIndex == leftMenuProjectsSub1PageNumbers || subMenuIndex == leftMenuProjectsSub2PageNumbers) {
                setShowDocSubMenu(false);
                setShowProjectSuMenus(true);
                setShowPayrollSubMenus(false);
            } else if (subMenuIndex == leftMenuPayrollSub1PageNumbers || subMenuIndex == leftMenuPayrollSub2PageNumbers) {
                setShowDocSubMenu(false);
                setShowProjectSuMenus(false);
                setShowPayrollSubMenus(true);
            }
        };
        fetchData();
        setsubIndex();
    }, [])
    const middle_box = () => {
        setToggleClass((prevClass) =>
            prevClass === "middle_box" ? "middle_box middle_box_extra" : "middle_box"
        );
    }
    const handleMenuClick = (index: any) => {
        if (index == leftMenuDocumentsPageNumbers) {
            setShowDocSubMenu(!showDocSubMenu);
            setShowProjectSuMenus(false)
            setShowPayrollSubMenus(false)
        } else if (index == leftMenuCompanyPayrollPageNumbers) {
            setShowDocSubMenu(false);
            setShowProjectSuMenus(false)
            setShowPayrollSubMenus(!showPayrollSubMenus)
        } else if (index == leftMenuProjectMGMTPageNumbers) {
            setShowDocSubMenu(false);
            setShowProjectSuMenus(!showProjectSuMenus)
            setShowPayrollSubMenus(false)
        } else {
            setShowDocSubMenu(false);
            setShowProjectSuMenus(false)
            setShowPayrollSubMenus(false)
        }
        if (index == leftMenuProfilePageNumbers) {
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
                dashboard_notify_cust_id: '',
                dashboard_notify_activity_related_id: '',
                selectedClientCustomerID: '',
                isAdmin: '',
                contextPARAM8: '',
            });
        }
        setSelectedLeftMenuItemIndex(index); // Update the state correctly
        // setLoadingCursor(true);
    };
    const handleSubMenuClick = (index: any, pageURL: string) => {
        setLoadingCursor(true);
        if (index == leftMenuDocumentsSub1PageNumbers || index == leftMenuDocumentsSub2PageNumbers) {
            setShowDocSubMenu(true);
            setShowProjectSuMenus(false)
            setShowPayrollSubMenus(false)
        }
        else if (index == leftMenuPayrollSub1PageNumbers || index == leftMenuPayrollSub2PageNumbers) {
            setShowDocSubMenu(false);
            setShowProjectSuMenus(false)
            setShowPayrollSubMenus(true)
        } else if (index == leftMenuProjectsSub1PageNumbers || index == leftMenuProjectsSub2PageNumbers) {
            setShowDocSubMenu(false);
            setShowProjectSuMenus(true)
            setShowPayrollSubMenus(false)
        }
        setSelectedSubMenuItemIndex(index); // Update the state correctly
        router.push(pageURL)
        setLoadingCursor(false);
    };

    const checkPermission = (permissionId: any) => {
        if (permissionData) {
            for (let i = 0; i < permissionData?.length; i++) {
                if (permissionData[i].permission_id === permissionId) {
                    return permissionData[i].is_allowed;
                }
            }
        }
    }
    if (showLeftPanel) {
        return (
            <div className={toggleClass} id="middle_box">
                <div className={`${loadingCursor ? "cursorLoading nw_user_panel_mainbox" : "nw_user_panel_mainbox"}`} >
                    <div className="left_mainbox">
                        <div className="left_inner">
                            <div className="left_sticky">
                                {contextRoleID == "2" && isAdmin=="1" ? <div className="left_menubox">

                                    <a href={pageURL_dashboard} className={selectedLeftMenuItemIndex == leftMenuDashboardPageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuDashboardPageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/home_icon.png)" }}></div>
                                        <div className="left_menutext">Dashboard</div>
                                    </a>
                                    <a href={pageURL_assetListing} className={selectedLeftMenuItemIndex == leftMenuAssetsPageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuAssetsPageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/attendance_icon.png)" }}></div>
                                        <div className="left_menutext">Assets</div>
                                    </a>
                                    {/* <a className={selectedLeftMenuItemIndex == leftMenuProjectMGMTPageNumbers ? "left_selected" : ""}></a> */}
                                    <a>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/document_icon.png)" }}></div>
                                        <div className={selectedLeftMenuItemIndex == leftMenuDocumentsPageNumbers && showDocSubMenu ||
                                            ((selectedSubMenuItemIndex == leftMenuDocumentsSub1PageNumbers || selectedSubMenuItemIndex == leftMenuDocumentsSub2PageNumbers) && showDocSubMenu) ? "left_menutext active" : "left_menutext"} onClick={() => { setShowDocSubMenu(!showDocSubMenu), handleMenuClick(leftMenuDocumentsPageNumbers) }}>
                                            <div className='submenu_innerbox'>
                                                <div>Documents</div>
                                            </div>
                                            <div className="submenu_otherbox">
                                                <div className={selectedSubMenuItemIndex == leftMenuDocumentsSub1PageNumbers ? "submenu-item-selected" : "submenu-item"} onClick={() => { setLoadingCursor(true), handleSubMenuClick(leftMenuDocumentsSub1PageNumbers, pageURL_companyDocumentsPage) }}>Company Document</div>
                                                <div className={selectedSubMenuItemIndex == leftMenuDocumentsSub2PageNumbers ? "submenu-item-selected" : "submenu-item"} onClick={() => { setLoadingCursor(true), handleSubMenuClick(leftMenuDocumentsSub2PageNumbers, pageURL_employeeDocumentsPage) }}>Employee Document</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href={pageURL_announcementListingPage} className={selectedLeftMenuItemIndex == leftMenuAnnouncementPageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuAnnouncementPageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/announcement_icon.png)" }}></div>
                                        <div className="left_menutext">Announcement/ News</div>
                                    </a>
                                    <a href={pageURL_leaveListingPage} className={selectedLeftMenuItemIndex == leftMenuLeavePageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuLeavePageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/leave_icon.png)" }}></div>
                                        <div className="left_menutext">Leave</div>
                                    </a>
                                    <a href={pageURL_userList} className={selectedLeftMenuItemIndex == leftMenuEmployeeListPageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuEmployeeListPageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/allemployee_icon.png)" }}></div>
                                        <div className="left_menutext">All Employees</div>
                                    </a>
                                    <a href={pageURL_addUserBasicDetailForm} className={selectedLeftMenuItemIndex == leftMenuAddEmployeePageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuAddEmployeePageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/addemployee_icon.png)" }}></div>
                                        <div className="left_menutext">Add Employee</div>
                                    </a>
                                    <a href={pageURL_attendanceList} className={selectedLeftMenuItemIndex == leftMenuAttendancePageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuAttendancePageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/attendance_icon.png)" }}></div>
                                        <div className="left_menutext">Attendance</div>
                                    </a>
                                    <a href={pageURL_clientProfilePage} className={selectedLeftMenuItemIndex == leftMenuProfilePageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuProfilePageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/human_icon.png)" }}></div>
                                        <div className="left_menutext">Profile</div>
                                    </a>
                                    <a>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/payroll_icon.png)" }}></div>
                                        <div className={selectedLeftMenuItemIndex == leftMenuCompanyPayrollPageNumbers && showPayrollSubMenus ||
                                            ((selectedSubMenuItemIndex == leftMenuPayrollSub1PageNumbers || selectedSubMenuItemIndex == leftMenuPayrollSub2PageNumbers) && showPayrollSubMenus) ? "left_menutext active" : "left_menutext"} onClick={() => { handleMenuClick(leftMenuCompanyPayrollPageNumbers) }}>
                                            <div className='submenu_innerbox'>
                                                <div>Payroll</div>
                                            </div>
                                            <div className="submenu_otherbox">
                                                <div className={selectedSubMenuItemIndex == leftMenuPayrollSub1PageNumbers ? "submenu-item-selected" : "submenu-item"} onClick={() => { setLoadingCursor(true), handleSubMenuClick(leftMenuPayrollSub1PageNumbers, pageURL_companyPayroll) }}>Company Payroll</div>
                                                <div className={selectedSubMenuItemIndex == leftMenuPayrollSub2PageNumbers ? "submenu-item-selected" : "submenu-item"} onClick={() => { setLoadingCursor(true), handleSubMenuClick(leftMenuPayrollSub2PageNumbers, pageURL_customizePayroll) }}>Customize Payroll</div>
                                            </div>
                                        </div>
                                    </a>

                                    <a>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/work_icon.png)" }}></div>
                                        <div className={selectedLeftMenuItemIndex == leftMenuProjectMGMTPageNumbers && showProjectSuMenus ||
                                            ((selectedSubMenuItemIndex == leftMenuProjectsSub1PageNumbers || selectedSubMenuItemIndex == leftMenuProjectsSub2PageNumbers) && showProjectSuMenus) ? "left_menutext active" : "left_menutext"} onClick={() => { handleMenuClick(leftMenuProjectMGMTPageNumbers) }}>
                                            <div className='submenu_innerbox'>
                                                <div>Project Management</div>
                                            </div>
                                            <div className="submenu_otherbox">
                                                <div className={selectedSubMenuItemIndex == leftMenuProjectsSub1PageNumbers ? "submenu-item-selected" : "submenu-item"} onClick={() => { setLoadingCursor(true), handleSubMenuClick(leftMenuProjectsSub1PageNumbers, pageURL_ProjectsPage) }}>Projects</div>
                                                <div className={selectedSubMenuItemIndex == leftMenuProjectsSub2PageNumbers ? "submenu-item-selected" : "submenu-item"} onClick={() => { setLoadingCursor(true), handleSubMenuClick(leftMenuProjectsSub2PageNumbers, pageURL_ProjectsTaskPage) }}>Task Management</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href={pageURL_clientAdminSupport} className={selectedLeftMenuItemIndex == leftMenuUserSupport ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserSupport) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/help_icon.png)` }}></div>
                                        <div className="left_menutext">Help</div>
                                    </a>
                                    <a href={pageURL_orgHierarchy} className={selectedLeftMenuItemIndex == leftMenuOrgHierarchy ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuOrgHierarchy) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/organization_icon.png)` }}></div>
                                        <div className="left_menutext">Organization Hierarchy</div>
                                    </a>
                                    <a href={pageURL_customerListPage} className={selectedLeftMenuItemIndex == leftMenuCustomerListPageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuCustomerListPageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/setting_icon.png)", }}></div>
                                        <div className="left_menutext">Our Customers</div>
                                    </a>
                                    <a href={pageURL_clientAdminSettingsPage} className={selectedLeftMenuItemIndex == leftMenuAdminSettingsPageNumbers ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuAdminSettingsPageNumbers) }}>
                                        <div className="left_menuicon" style={{ backgroundImage: "url(/images/left-menu/setting_icon.png)", }}></div>
                                        <div className="left_menutext">Admin Settings</div>
                                    </a>
                                </div> :
                                    contextRoleID == "5" || contextRoleID == "4" || contextRoleID == "9"|| isAdmin=="0" ?
                                        <div className="left_menubox">
                                            <a href={pageURL_userEmpDashboard} className={selectedLeftMenuItemIndex == leftMenuUserDashboard ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserDashboard) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/home_icon.png)` }}></div>
                                                <div className="left_menutext">Dashboard</div>
                                            </a>
                                            <a href={pageURL_userAttendance} className={selectedLeftMenuItemIndex == leftMenuUserAttendance ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserAttendance) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/attendance_icon.png)` }}></div>
                                                <div className="left_menutext">Attendance</div>
                                            </a>
                                            <a href={pageURL_userTaskListingPage} className={selectedLeftMenuItemIndex == leftMenuUserTask ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserTask) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/attendance_icon.png)` }}></div>
                                                <div className="left_menutext">Task</div>
                                            </a>
                                            <a href={pageURL_userLeave} className={selectedLeftMenuItemIndex == leftMenuUserLeave ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserLeave) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/leave_icon.png)` }}></div>
                                                <div className="left_menutext">Leave</div>
                                            </a>
                                            <a href={pageURL_userAsset} className={selectedLeftMenuItemIndex == leftMenuUserAsset ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserAsset) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/attendance_icon.png)` }}></div>
                                                <div className="left_menutext">Asset</div>
                                            </a>
                                            <a href={pageURL_userDoc} className={selectedLeftMenuItemIndex == leftMenuUserDocuments ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserDocuments) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(/images/left-menu/document_icon.png)` }}></div>
                                                <div className="left_menutext">Documents</div>
                                            </a>
                                            {contextRoleID!="2" &&  <a href={pageURL_userOrganisation} className={selectedLeftMenuItemIndex == leftMenuUserOrg ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserOrg) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/allemployee_icon.png)` }}></div>
                                                <div className="left_menutext">About Organization</div>
                                            </a>}
                                            {contextRoleID!="2" &&<a href={pageURL_userAnnouncement} className={selectedLeftMenuItemIndex == leftMenuUserAnnouncement ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserAnnouncement) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/announcement_icon.png)` }}></div>
                                                <div className="left_menutext">Announcement</div>
                                            </a>}
                                            {contextRoleID!="2" &&<a href={pageURL_userSupport} className={selectedLeftMenuItemIndex == leftMenuUserSupport ? "left_selected" : ""} onClick={() => { setLoadingCursor(true), handleMenuClick(leftMenuUserSupport) }}>
                                                <div className="left_menuicon" style={{ backgroundImage: `url(${staticIconsBaseURL}/images/left-menu/help_icon.png)` }}></div>
                                                <div className="left_menutext">Help</div>
                                            </a>}
                                        </div> : <></>}
                                <div onClick={middle_box} className="toggle_box"></div>
                            </div>
                        </div>
                    </div>
                    <div className="right_mainbox">
                        {rightBoxUI}
                        {/* <img src="images/dashboard.png" className="img-fluid" style={{margin: "-20px 0 0 0;" }}/> */}
                    </div>
                </div>
                {/* <div className="copyright_box">
                    Copyright ©2024 <a href="https://www.evonix.co/" target="_blank">Evonix Technologies Pvt.</a> Ltd. All right reserved.
                </div> */}
            </div>
        )
    } else {
        return null;
    }
}

export default LeftPannel

async function getUserPermission(clientId: string) {

    let query = supabase
        .from('leap_client_module_permission')
        .select(`*`)
        .eq('client_id', clientId);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}