// universal api Static Messages
export const apiServerError ='Internal Server Error'
export const apiwentWrong="Something Went wrong! Please try again later";
export const apifailedWithException="Failed with an exception";

//Attendence api static messages
export const attendanceStarted="Attendance Started Successfully";
export const attendanceStopped="Attendance Stoped Successfully";
export const attendancePaused="Attendance Paused Successfully";
export const attendanceResumed="Attendance Resumed Successfully";


export const clientAddedSuccess="Client Added Successfully";
export const permissionsAddedSuccess="Permissions Added Successfully";
export const clientAddedFailed="Failed to add Client";
export const allClientsData="All Clients Data";
export const allLeavesData="All Leaves Data";
export const allAssetData="Asset fetched";
export const clientAssetSuccess="Asset Added Successfully";
export const assetUpdatedSuccess="Asset Updated";
export const assetUpdateFailed="Updated failed";
export const assetDeletedSuccess="Asset Deleted";
export const assetDeleteFailed="Asset Deletion failed";
export const shrotcutsUpdated="Shortcuts updated successfully";
export const DepartmentDeletedSuccess="Department Deleted";
export const DesignationDeletedSuccess="Department Deleted";
export const BankComponentDeletedSuccess="Department Deleted";



///payroll constants
export const clientSalaryComponentSuccess="New Salary Component Added Successfully";
export const clientSalaryUpdateComponentSuccess="Salary Component Updated Successfully";
export const componentDeletedSuccess="Component Deleted";
export const payrollFetched="All Payroll Data";

// Project Management constants
export const clientAddProjectSuccess="New Project Added Successfully";
export const clientUpdateProjectSuccess="Project Updated Successfully";

export const projectDeletedSuccess="Project Deleted";






// Emplye update messages to send for api

export const personaldetailsfailure="Personal details failed to update";
export const authEmailfailure="Auth Email failed to update";
export const personaldetailsSuccess="Personal details updated";
export const updateAdrressFailure="Failed to update address";
export const updateAdrressSuccess="Address updated successfully";
export const updateEmployementFailure="Failed to update employement details";
export const updateEmployementSuccess="Employement details updated";

export const updateBankFailure="Failed to update Bank details";
export const updateSalaryFailure="Failed to update salary details";
export const updateGrossSalaryFailure="Failed to update gross salary details";
export const updateBankSuccess="Bank details updated";
export const leaveUpdateSuccess="Leave type updated successfully";
export const companyData="Company Profile fetched";
export const companyUpdatedData="Company Profile Updated";
export const companyUpdateFailed="Company Profile Failed";
export const allEmployeeListData="All Clients Data";




export const apiStatusSuccessCode=200;
export const apiStatusFailureCode=500;
export const apiStatusInvalidDataCode=200;
export const apiStatusUnAuthenticated=202;
export const apiMessageUnAuthenticated='User not authenticated';

export const dashedString="--------------------------------------------------------------------------";


export let globalColorTheme='#ed2024'

export const addEmpFormTitle="Welcome!"
export const clientAdminDashboard="Welcome!"
export const EmpListTitle=addEmpFormTitle
export const addEmpEmployementFormTitle=addEmpFormTitle
export const addEmpAddressTitle=addEmpFormTitle
export const addEmpDocumentsTitle=addEmpFormTitle
export const addEmpFinanceFormTitle=addEmpFormTitle
export const employeeProfileDetails=addEmpFormTitle
export const announcementListingPage=addEmpFormTitle
export const createLeaveTitle=addEmpFormTitle
export const addAssetTitle=addEmpFormTitle


export const sessionClientID='client_id'
export const sessionBranchID='branch_id'
export const sessionCustomerID='customer_id'
export const sessionEmployeeID='employee_id'
export const sessionEmployeeName='name'
export const sessionRoleID='role_id'
export const sessionLogoURL='logoURL'
export const sessionCompanyName='companyName'

export const bulkUploadTypeEmployee="Employee"
export const bulkUploadTypeAssets="Assets"
export const bulkUploadTypeHolidays="Holidays"


export const companyDocUpload="company";
export const employeeDocUpload="employee";
export const assetsDocUpload="assets";
export const attendanceDocUpload="attendance";
export const exportTypeAsset="assets";
export const exportTypeHoliday="holidays";
export const exportTypeBirthdays="birthday";
export const exportTypeLeave="leave";
export const exportTypeAttendance="attendance";
export const exportTypeEmployee="employee";




export const addEarningComponentTitle="Add earning component";
export const updateEarningComponentTitle="Update earning component";
export const addDeductionComponentTitle="Add deduction component";
export const updateDeductionComponentTitle="Update deduction component";


export const deleteDataTypeAsset="Asset"
export const deleteDataTypeSalaryComponent="Salary Component"
export const deleteDataTypeProject="Project"
export const deleteDataTypeSubProject="Sub Project"
export const deleteDataTypeDepartment="Department"
export const deleteDataTypeDesignation="Designation"
export const deleteDataTypeHolidayYear="Holiday Year"
export const deleteDataTypeBankComponent="Bank Component"
export const deleteDataTypeAnnouncement="Announcement"

//add employe form components name for OCR Extraction
export const ocrComponent_FirstName="firstName"
export const ocrComponent_MiddleName="middleName"
export const ocrComponent_LastName="lastName"
export const ocrComponent_DateOfBirth="dateOfBirth"
export const ocrComponent_Gender="Gender"
export const ocrComponent_IDNumber="IDNumber"
export const ocrComponent_Nationality="Nationality"
export const ocrComponent_Address="Address"
export const ocrComponent_AccountNumber="Account Number"
export const ocrComponent_BankName="Bank Name"
export const ocrComponent_BankBranch="Branch Name"
export const ocrComponent_IFSCCode="IFSC Code"
export const ocrComponent_IBAN="IBAN"

//// this is the array of data type used for seting datat type for bank components input types adding to Database

export const bankComponentDataType:any[]=[
    {
        value:2,
        label:"Numbers"

    },
    {
        value:1,
        label:"Text"

    },
]


// below are the constants used to add the action type in the error log table of supabase 
// here the reference to the api is also added;

export const selectBranch_AddEmployement="SelectBranch-AddEmployement"
export const UpdateBranchEmployeeCount_AddEmployement="UpdateBranchEmployeeCount-AddEmployement"








///////////////////////////////////////////ritika code merge


export const taskUpdatedData="Task Updated";
export const taskUpdateFailed="Task Failed";
export const raiseSupportTitle=addEmpFormTitle


export const getImageApiURL=`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads?imagePath=`
export const staticIconsBaseURL=`${process.env.NEXT_PUBLIC_BASE_URL}`


////////------------Exceptions and error stings for alerts---------------


export const ALERTMSG_exceptionString="Somthing went wrong! Please try again."
export const ALERTMSG_FormExceptionString="An error occurred while submitting the form."

export const ALERTMSG_getAssetTypeError="Failed to get Asset Types"
export const ALERTMSG_addAssetTypeError="Failed to add Asset Type"

export const ALERTMSG_addAssetSuccess="Asset added Successfully"
export const ALERTMSG_addAssetError="Failed to add Asset"

// export const leaveTypeIconURLS=[
//         "/images/leave_type_icons/sick_Leave.png",
//         "/images/leave_type_icons/paternity_Leave.png",
//         "/images/leave_type_icons/maternity_Leave.png",
//         "/images/leave_type_icons/personal_Leave.png",
//         "/images/leave_type_icons/comp_Off_Leave.png",
//         "/images/leave_type_icons/annual_Leave.png"
//     ]

// export const leaveIconBGColor=[
//     "#C7EFCF","#E0B0D5","#FEC3A6","#7BDFF2","#F0B67F","#D3D0CB"
// ]    



/////------------- User Permission IDs ---------

export const permission_m_dashboard_id="1"
export const permission_m_attendance_id="2"
export const permission_m_announcement_id="3"
export const permission_m_payroll_id="4"
export const permission_m_task_id="5"
export const permission_m_asset_id="6"
export const permission_m_leave_id="7"
export const permission_m_document_id="8"
export const permission_m_notification_id="9"
export const permission_m_help_id="10"
export const permission_m_profile_id="11"
export const permission_m_customer_id="12"
export const permission_m_subscription_id="13"
export const permission_m_others_id="14"
export const permission_m_holiday_id="15"

export const permission_s_attendanceTracking_id="1"
export const permission_s_attendanceSelfie_id="2"
export const permission_s_attendanceGeoloc_id="3"
export const permission_s_attendanceMap_id="4"
export const permission_s_attendanceWorkMode_id="5"
export const permission_s_attendanceGeofence_id="6"
export const permission_s_addTask_id="7"
export const permission_s_updateTask_id="8"
export const permission_s_assetList_id="9"
export const permission_s_leave_id="10"
export const permission_s_viewDoc_id="11"
export const permission_s_downloadOrgDoc_id="12"
export const permission_s_downloadOfficialDoc_id="13"
export const permission_s_uploadPersonalDoc_id="14"
export const permission_s_organization_id="15"
export const permission_s_help_id="16"
export const permission_s_googleMeetCalender_id="17"
export const permission_s_holidayList_id="18"

///-------------SUPER ADMIN STATIC TABLES-----------//

export const table_LeapApprovalStatus="1"
export const table_LeapAssetCondition="2"
export const table_LeapAssetStatus="3"
export const table_LeapCity="4"
export const table_LeapClientEmployeePermissionTypes="5"
export const table_LeapDashboardGreetings="6"
export const table_LeapDepartment="7"
export const table_LeapDesignation="8"
export const table_LeapDocumentMainTypes="9"
export const table_LeapDocumentType="10"
export const table_LeapEmployementType="11"
export const table_LeapHolidayTypes="12"
export const table_LeapLeaveTypeIconAndColor="13"
export const table_LeapPermissionMaster="14"
export const table_LeapProjectStatus="15"
// export const table_LeapProjectTaskType="16" // check again
export const table_LeapProjectType="17"
export const table_LeapProjectsTechStack="18"
export const table_LeapRelations="19"
export const table_LeapRequestMaster="20"
export const table_LeapRequestPriority="21"
export const table_LeapRequestStatus="22"
export const table_LeapSalaryPayableDays="23"
export const table_LeapSalaryStructure="24"
export const table_LeapSectorType="25"
export const table_LeapTaskPriorityLevel="26"
export const table_LeapTaskStatus="27"
export const table_LeapUserActivityType="28"
export const table_LeapUserRole="29"
export const table_LeapWebSidePanelMenu="30"
export const table_LeapWorkingType="31"

