'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { leftMenuAdminSettingsPageNumbers, pageURL_createLeaveTypeForm } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { LeaveType } from '@/app/models/leaveModel'
import Select from "react-select";
import AddBranchDetails from '@/app/components/dialog_addClientBranch'
import DialogClientAddDesignationDepartment from '@/app/components/dialog_addDesignationsDepartment'
import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation'
import { ALERTMSG_exceptionString, deleteDataTypeBankComponent, deleteDataTypeDepartment, deleteDataTypeDesignation, deleteDataTypeHolidayYear, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import DialogAddEditBankComponents from '@/app/components/dialog_addEditBankComponents'
import { useRouter } from 'next/navigation'
import ShowAlertMessage from '@/app/components/alert'
import LeaveTypeUpdate from '@/app/components/dialog_leaveType'
import AddHolidayYear from '@/app/components/dialog_addHolidayYear'

interface SearchValues {
    designationSearchText: any,
    departmentSearchText: any,
}

interface WorkingFormValues {
    id:any,
    full_day: any,
    half_day: any,
    lunch_time: any,
    holiday_per_week: any,
}


const ClientAdminSettings = () => {

    const router = useRouter()
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const { contextClientID, contaxtBranchID, contextRoleID, contextCustomerID } = useGlobalContext();
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [searchText, setSearchText] = useState<SearchValues>({
        designationSearchText: '',
        departmentSearchText: '',
    });
    const [clientDepartmentArray, setClientDepartmentArray] = useState<ClientDepartmentDataModel[]>([]);
    const [clientDesignationArray, setClientDesinationArray] = useState<ClientDesignationDataModel[]>([]);
    const [clientBankConponentsArray, setClientBankComponentsArray] = useState<ClientBankComponentsDataModel[]>([]);
    const [clientLeaveTypeArray, setLeaveType] = useState<LeaveType[]>([]);
    const [clientWorkingHour, setWorkingHour] = useState<ClientWorkingHoursDataModel[]>([]);
    const [employeePermissionArray, setEmployeeyermissionArray] = useState<EmployeePermissionDataSetting[]>([]);
    const [employeeArray, setEmployeeArray] = useState([{ value: '', label: '' }]);
    const [selectedEmployee, setSelectedEmployee] = useState({ value: '', label: '' });
    const [searchBranchArray, setSearchBranchArray] = useState([{ value: '', label: '' }]);
    const [selectedBankBranch, setSelectedBankBranch] = useState({ value: '', label: '' });
    const [selectedLeaveTypeBranch, setSelectedLeaveTypeBranch] = useState({ value: '', label: '' });
    const [selectedWorkingHourBranch, setSelectedWorkingHourBranch] = useState({ value: '', label: '' });

    const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
    const [showAddDesignation, setShowAddDesignation] = useState(false);
    const [addWorkingHours, setWorkingHoursAdd] = useState(false);
    const [workingHoursDataChanged, setWorkingHoursDataChanged] = useState(false);

    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showAddLeaveType, setShowAddLeaveType] = useState(false);


    const [dataDeleteID, setdataDeleteID] = useState(-1);
    const [dataDeleteDetail, setDataDeleteDetail] = useState('');

    const [showDeleteDesignation, setShowDeleteDesignation] = useState(false);
    const [showDeleteDepartment, setShowDeleteDepartment] = useState(false);
    const [showDeleteHolidayYear, setShowDeleteHolidayYear] = useState(false);

    const [dataEditID, setDataEditID] = useState(-1);
    const [dataEditDetail, setDataEditDetail] = useState('');

    const [showEditDesignation, setShowEditDesignation] = useState(false);
    const [showEditDepartment, setShowEditDepartment] = useState(false);
    const [showEditHolidayYear, setShowEdithHolidayYear] = useState(false);

    const [arePermissionChanged, setArePermissionsChanged] = useState(false);
    const [errors, setErrors] = useState<Partial<WorkingFormValues>>({});
        const [holidayYearArray, setholidayYear] = useState<HolidayListYear[]>([]);
    
    const [workingDayformValues, setWorkingDayFormValues] = useState<WorkingFormValues>({
        id:0,
        full_day: '',
        half_day: '',
        lunch_time: '',
        holiday_per_week: '',
    })

    const [showAddBankComponent, setShowAddBankComponent] = useState(false);
    const [showDeleteBankComponent, setShowDeleteBankComponent] = useState(false);
    const [showEditBankComponents, setShowEditBankComponents] = useState(false);
    const [editBankDetail, setEditBankComponentsDetails] = useState<ClientBankComponentsDataModel>({
        id: 0,
        client_id: 0,
        branch_id: 0,
        component_name: '',
        data_type: 0
    });

    const [editLeaveTypeId, setEditLeaveTypeId] = useState('0');
        const [showEditLeaveType, setshowEditLeaveType] = useState(false);

        const [showAlert, setShowAlert] = useState(false);
        const [alertForSuccess, setAlertForSuccess] = useState(0);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertStartContent, setAlertStartContent] = useState('');
        const [alertMidContent, setAlertMidContent] = useState('');
        const [alertEndContent, setAlertEndContent] = useState('');
        const [alertValue1, setAlertValue1] = useState('');
        const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        // const customers=getClientDepartments(contextClientID,contaxtBranchID);
        if (isLoading || showAddBranchDialog || showAddDepartment || showAddDesignation || showAddLeaveType) {
            document.body.style.overflow = 'hidden';
        } else {
            fetchData();
        }
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
            document.body.style.overflow = 'auto';
            window.removeEventListener('scroll', handleScroll);
        };

    }, [showAddBranchDialog, showAddDepartment, showAddDesignation, showAddLeaveType])
    const fetchData = async () => {
        setLoading(true);
        const branch = await getBranches(contextClientID);
        let extractBranch: any[] = []
        for (let i = 0; i < branch.length; i++) {

            extractBranch.push({
                value: branch[i].id,
                label: branch[i].branch_number,
            })
            if (contaxtBranchID == branch[i].id) {
                setSelectedBankBranch({
                    value: branch[i].id,
                    label: branch[i].branch_number,
                })
                setSelectedLeaveTypeBranch({
                    value: branch[i].id,
                    label: branch[i].branch_number,
                })
                setSelectedWorkingHourBranch({
                    value: branch[i].id,
                    label: branch[i].branch_number,
                })
            }
        }
        setSearchBranchArray(extractBranch);
        setBranchArray(branch);
        const departments = await getClientDepartments(contextClientID, '', '');
        setClientDepartmentArray(departments);
        const designation = await getClientDesignations(contextClientID, '', '');
        setClientDesinationArray(designation);
        const bankComponents = await getClientBankComponents(contextClientID, selectedBankBranch.value != '' ? selectedBankBranch.value : contaxtBranchID);
        setClientBankComponentsArray(bankComponents);
        const leaveTypes = await getLeaveTypes(contextClientID, selectedLeaveTypeBranch.value != '' ? selectedLeaveTypeBranch.value : contaxtBranchID);
        setLeaveType(leaveTypes);
        const workingHours = await getBranchWorkingHours(contextClientID, selectedWorkingHourBranch.value != '' ? selectedWorkingHourBranch.value : contaxtBranchID);
        setWorkingHour(workingHours);
         const holidayYear = await getHolidayYear(contextClientID);
         setholidayYear(holidayYear);
        if(workingHours.length>0){
        setWorkingDayFormValues({
            id:workingHours[0].id,
            full_day: workingHours[0].full_day,
            half_day: workingHours[0].half_day,
            lunch_time: workingHours[0].lunch_time,
            holiday_per_week: workingHours[0].holiday_per_week,
        })
        }else{
            setWorkingHoursAdd(true)
        }
        const employees = await getEmployees(contextClientID, contaxtBranchID);
        if (employees) {
            let extractEmp: any[] = []
            for (let i = 0; i < employees.length; i++) {

                extractEmp.push({
                    value: employees[i].customer_id,
                    label: employees[i].emp_id + "  " + employees[i].name,
                })
            }
            setEmployeeArray(extractEmp)
            setSelectedEmployee(extractEmp[0])
            const permissionTypes = await getPermissionTypes(contextClientID);

            const employeePermissions = await getEmployeePermissions(extractEmp[0].value);
            const permissionSet: EmployeePermissionDataSetting[] = []
            for (let i = 0; i < permissionTypes.length; i++) {
                permissionSet.push({
                    emp_permission_id: permissionTypes[i].emp_permission_id,
                    permission_name: permissionTypes[i].permission_name,
                    isAllowed: false
                });
            }
            if (employeePermissions.length > 0) {
                for (let i = 0; i < permissionSet.length; i++) {
                    for (let j = 0; j < employeePermissions.length; j++) {
                        if (permissionSet[i].emp_permission_id == employeePermissions[j].permission_id) {
                            permissionSet[i].isAllowed = employeePermissions[j].is_allowed
                        }
                    }
                }
            }
            setEmployeeyermissionArray(permissionSet)
        }

        setLoading(false);
        // setBranchArray(branch);
    }
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if(clientWorkingHour && clientWorkingHour.length>0){
        if(name=="full_day" && value!=clientWorkingHour[0].full_day){
            setWorkingHoursDataChanged(true)
        }
        else if(name=="half_day" && value!=clientWorkingHour[0].half_day){
            setWorkingHoursDataChanged(true)
        }
        else if(name=="lunch_time" && value!=clientWorkingHour[0].lunch_time){
            setWorkingHoursDataChanged(true)
        }
        else if(name=="holiday_per_week" && value!=clientWorkingHour[0].holiday_per_week){
            setWorkingHoursDataChanged(true)
        }else{
            setWorkingHoursDataChanged(false)
        }
        }else if((name=="full_day" || name=="half_day"||name=="lunch_time"|| name=="holiday_per_week") &&value.length>0){
            setWorkingHoursDataChanged(true)
        }else{
            setWorkingHoursDataChanged(false)

        }
        setWorkingDayFormValues((prev) => ({ ...prev, [name]: value }));
    }
    const handleEmployeeChange = async (values: any) => {
        setLoading(true);
        setSelectedEmployee(values)
        const employeePermissions = await getEmployeePermissions(values.value);
        const permissionTypes = await getPermissionTypes(contextClientID);

        const permissionSet: EmployeePermissionDataSetting[] = []
        for (let i = 0; i < permissionTypes.length; i++) {
            permissionSet.push({
                emp_permission_id: permissionTypes[i].emp_permission_id,
                permission_name: permissionTypes[i].permission_name,
                isAllowed: false
            });
        }
        if (employeePermissions.length > 0) {
            for (let i = 0; i < permissionSet.length; i++) {
                for (let j = 0; j < employeePermissions.length; j++) {
                    if (permissionSet[i].emp_permission_id == employeePermissions[j].permission_id) {
                        permissionSet[i].isAllowed = employeePermissions[j].is_allowed
                    }
                }
            }
        }
        setEmployeeyermissionArray(permissionSet)
        setLoading(false);
    };

    const handleBranchChange = async (values: any, dataType: number) => {
        if (dataType == 1) {
            setSelectedBankBranch(values);
            const bankComponents = await getClientBankComponents(contextClientID, values.value);
            setClientBankComponentsArray(bankComponents);
        } else if (dataType == 2) {
            setSelectedLeaveTypeBranch(values)
            const leaveTypes = await getLeaveTypes(contextClientID, values.value);
            setLeaveType(leaveTypes);
        } else if (dataType == 3) {
            setSelectedWorkingHourBranch(values)
            const workingHours = await getBranchWorkingHours(contextClientID, values.value);
            setWorkingHour(workingHours);
            if(workingHours.length>0){
                setWorkingDayFormValues({
                    id:workingHours[0].id,
                    full_day: workingHours[0].full_day,
                    half_day: workingHours[0].half_day,
                    lunch_time: workingHours[0].lunch_time,
                    holiday_per_week: workingHours[0].holiday_per_week,
                })
            }else{
                setWorkingHoursAdd(true)
            }
              
        }

    }
    const callSearchData = async () => {
        const departments = await getClientDepartments(contextClientID, contaxtBranchID, searchText.departmentSearchText);
        setClientDepartmentArray(departments);
        const designation = await getClientDesignations(contextClientID, contaxtBranchID, searchText.designationSearchText);
        setClientDesinationArray(designation);
    }
    const handlePermissionChange = (permission_id: any) => {
        setArePermissionsChanged(true);
        setEmployeeyermissionArray(prev =>
            prev.map(emp =>
                emp.emp_permission_id === permission_id ? { ...emp, isAllowed: !emp.isAllowed } : emp
            )
        );
    };

    const validate = () => {
        const newErrors: Partial<WorkingFormValues> = {};
         if (!workingDayformValues.full_day) newErrors.full_day = "required";
         if (!workingDayformValues.half_day) newErrors.half_day = "required";
         if (!workingDayformValues.lunch_time) newErrors.lunch_time = "required";
         if (!workingDayformValues.holiday_per_week) newErrors.holiday_per_week = "required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleWorkingHourUpdate = async (e: React.FormEvent) => {
        setLoading(true);
        if (!validate()) return;
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", selectedWorkingHourBranch.value);
        formData.append("id", workingDayformValues.id||'');
        formData.append("full_day", workingDayformValues.full_day);
        formData.append("half_day", workingDayformValues.half_day);
        formData.append("lunch_time", workingDayformValues.lunch_time);
        formData.append("holiday_per_week", workingDayformValues.holiday_per_week);
        formData.append("is_insert", addWorkingHours?"true":"false");

        try{

            const apiCall = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/clientAdmin/setBranchWorkingHours", {
                method: "POST",
                body: formData,

            });
            console.log(apiCall);

            const response = await apiCall.json();
            console.log(response);
            
            if (apiCall.ok && response.status==1) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Working hour uopdated Successfully");
                setAlertForSuccess(1)
                fetchData();

            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
            }
            

        }catch (error){
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception");
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
            // alert("Exception Occured while updating woking hour")
        }
    }

    const callSetEmployeePermissions = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("customer_id", selectedEmployee.value);
        formData.append("permission_list", JSON.stringify(employeePermissionArray));
        try {
            const apiCall = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/clientAdmin/setEmployeePermissions", {
                method: "POST",
                body: formData,

            });
            console.log(apiCall);

            const response = await apiCall.json();
            console.log(response);

            if (apiCall.ok) {

                // alert(response.message)
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent(response.message);
                setAlertForSuccess(1)
                fetchData();

            } else {
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
                
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // alert("An error occurred." + error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }

    };
    return (
        <div className='mainbox client_admin_mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuAdminSettingsPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                            

                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>
                        <div className="row heading25 mb-3">
                            <div className="col-lg-6">
                                Permissions & <span>Settings</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row mb-3">
                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3">

                                            <div className="col-lg-10 settings_title">Branches</div>
                                            <div className="col-lg-2">
                                                <div onClick={() => { setShowAddBranchDialog(true) }} className='red_button filter_submit_btn ' style={{ float: "right" }}>Add Branches</div>
                                            </div>


                                        </div>
                                        {branchArray && branchArray.length > 0 ?
                                            <div className="mb-2" >
                                                <div className="row list_label mb-4">
                                                    <div className="col-lg-2 text-center"><div className="label">Name</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Email</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Contact No.</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Address</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">City</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Total Employees</div></div>
                                                </div>
                                                {branchArray.map((branch) => (
                                                    <div className="row list_listbox" key={branch.id} >
                                                        <div className="col-lg-2 text-center">{branch.branch_number || "--"}</div>
                                                        <div className="col-lg-2 text-center">{branch.branch_email || "--"}</div>
                                                        <div className="col-lg-2 text-center">{branch.contact_details || "--"}</div>
                                                        <div className="col-lg-2 text-center">{branch.branch_address || "--"}</div>
                                                        <div className="col-lg-2 text-center">{branch.branch_city || "--"}</div>
                                                        <div className="col-lg-2 text-center">{branch.total_employees || "0"}</div>


                                                    </div>
                                                ))}
                                            </div> : <div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                                                {<h5 className="text-muted">No branches are available</h5>}
                                            </div>
                                        }

                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{alignItems:"center"}}>

                                            <div className="col-lg-6 settings_title"> All Departments</div>
                                            <div className="col-md-4">
                                                <div className="form_box">
                                                    <div className="row">
                                                        <div className="col-lg-10">
                                                            <input type="text" className="form-control" value={searchText.departmentSearchText} name="departmentSearchText" onChange={(e) => setSearchText((prev) => ({ ...prev, ['departmentSearchText']: e.target.value }))} id="departmentSearchText" placeholder='Search Department' />
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <img src={staticIconsBaseURL+"/images/search_icon.png"} className="img-fluid" style={{ maxHeight: '25px', maxWidth: "25px" }} onClick={() => callSearchData()} />
                                                        </div></div>
                                                    {/* {errors.leave_count && <span className="error" style={{color: "red"}}>{errors.leave_count}</span>} */}
                                                </div>
                                            </div>
                                            <div className="col-lg-2">
                                                <div onClick={() => { setShowAddDepartment(true) }} className='red_button filter_submit_btn ' style={{ float: "right" }}>Add Departments</div>
                                            </div>
                                        </div>
                                        <div className="pb-2" >
                                            {clientDepartmentArray && clientDepartmentArray.length > 0 ? clientDepartmentArray.map((department) => (
                                                <div className="announcement_branch_box mb-2" key={department.department_id} >

                                                    <a>
                                                        <div className="list_view_heading text-center"> {department.department_name}
                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "8px" }}
                                                                onClick={() => {
                                                                    setDataEditID(department.department_id);
                                                                    setShowEditDepartment(true);
                                                                    setDataEditDetail(department.department_name)
                                                                }}
                                                            />

                                                            <img src={staticIconsBaseURL+"/images/delete.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "5px" }}
                                                                onClick={() => {
                                                                    setdataDeleteID(department.department_id);
                                                                    setShowDeleteDepartment(true);
                                                                    setDataDeleteDetail(department.department_name)
                                                                }}
                                                            />
                                                        </div>
                                                    </a>
                                                </div>
                                            )) : <div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                                                {<h5 className="text-muted">No Departments available</h5>}
                                            </div>}
                                        </div>

                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{ alignItems: "center" }}>
                                            <div className="col-lg-6 settings_title">All Designation</div>
                                            <div className="col-md-4">
                                                <div className="form_box">
                                                    <div className="row">
                                                        <div className="col-lg-10">
                                                            <input type="text" className="form-control" value={searchText.designationSearchText} name="designationSearchText" onChange={(e) => setSearchText((prev) => ({ ...prev, ['designationSearchText']: e.target.value }))} id="designationSearchText" placeholder='Search Designation' />
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <img src={staticIconsBaseURL+"/images/search_icon.png"} className="img-fluid" style={{ maxHeight: '25px', maxWidth: "25px" }} onClick={() => callSearchData()} />
                                                        </div></div>
                                                    {/* {errors.leave_count && <span className="error" style={{color: "red"}}>{errors.leave_count}</span>} */}
                                                </div>
                                            </div>

                                            <div className="col-lg-2" >
                                                <div onClick={() => { setShowAddDesignation(true) }} className='red_button filter_submit_btn ' style={{ float: "right" }}>Add Designation</div>
                                            </div>
                                        </div>
                                        <div className="pb-2 overflow_div" style={{height:"200px"}}>
                                            {clientDesignationArray && clientDesignationArray.length > 0 ? clientDesignationArray.map((designation) => (
                                                <div className="announcement_branch_box mb-2" key={designation.designation_id} >

                                                    <a>
                                                        <div className="list_view_heading text-center">
                                                            {designation.designation_name}
                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "8px" }}
                                                                onClick={() => {
                                                                    setDataEditID(designation.designation_id);
                                                                    setShowEditDesignation(true);
                                                                    setDataEditDetail(designation.designation_name)
                                                                }}
                                                            />

                                                            <img src={staticIconsBaseURL+"/images/delete.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "5px" }}
                                                                onClick={() => {
                                                                    setdataDeleteID(designation.designation_id);
                                                                    setShowDeleteDesignation(true);
                                                                    setDataDeleteDetail(designation.designation_name)
                                                                }}
                                                            />
                                                        </div>
                                                    </a>
                                                </div>
                                            )) : <div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                                                {<h5 className="text-muted">No Designations available</h5>}
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">

                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{ alignItems: "center" }}>
                                            <div className="col-lg-7 settings_title">Bank Components</div>

                                            <div className="col-lg-3">

                                                <Select
                                                    className="custom-select"
                                                    classNamePrefix="custom"
                                                    options={searchBranchArray}
                                                    value={selectedBankBranch}
                                                    onChange={(selectedOption) =>
                                                        handleBranchChange(selectedOption, 1)

                                                    }
                                                    placeholder="Search Branch"
                                                    isSearchable
                                                />
                                            </div>
                                            <div className="col-lg-2">
                                                <div onClick={() => { setShowAddBankComponent(true) }} className='red_button filter_submit_btn ' style={{ float: "right" }}>Add Bank Components</div>
                                            </div>
                                        </div>
                                        <div className="pb-2" >
                                            {clientBankConponentsArray && clientBankConponentsArray.length > 0 ? clientBankConponentsArray.map((bankComponent) => (
                                                <div className="announcement_branch_box" key={bankComponent.id} >

                                                    <a>
                                                        <div className="list_view_heading text-center"> {bankComponent.component_name}<label className="font12"> ({bankComponent.data_type == 1 ? "Text" : "Number"})</label>
                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "8px" }}
                                                                onClick={() => {
                                                                    setDataEditID(bankComponent.id);
                                                                    setShowEditBankComponents(true);
                                                                    setEditBankComponentsDetails(bankComponent)
                                                                }}
                                                            />
                                                            <img src={staticIconsBaseURL+"/images/delete.png"} className="img-fluid mr-2 content-align-center" style={{ maxHeight: '18px', marginLeft: "8px", marginRight: "8px" }}
                                                                onClick={() => {
                                                                    setdataDeleteID(bankComponent.id);
                                                                    setDataDeleteDetail(bankComponent.component_name)
                                                                    setShowDeleteBankComponent(true);
                                                                }}
                                                            />
                                                        </div>
                                                    </a>
                                                </div>
                                            )) : <div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                                                {<h5 className="text-muted">No bank input components available</h5>}
                                            </div>}
                                        </div>

                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{ alignItems: "center" }}>
                                            <div className="col-lg-7 settings_title">Leave Types</div>

                                            <div className="col-lg-3">
                                                <Select
                                                    className="custom-select"
                                                    classNamePrefix="custom"
                                                    options={searchBranchArray}
                                                    value={selectedLeaveTypeBranch}
                                                    onChange={(selectedOption) =>
                                                        handleBranchChange(selectedOption, 2)

                                                    }
                                                    placeholder="Search Branch"
                                                    isSearchable
                                                />
                                            </div>
                                            <div className="col-lg-2">
                                                <div onClick={() => { router.push(pageURL_createLeaveTypeForm) }} className='red_button filter_submit_btn ' style={{ float: "right" }}>Add Leave Types</div>
                                            </div>
                                        </div>
                                        {clientLeaveTypeArray && clientLeaveTypeArray.length > 0 ?
                                            <div className="mb-2" >

                                                <div className="row list_label mb-4">
                                                    <div className="col-lg-1 text-center"><div className="label">Icon</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Name</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Description</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Category</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Count</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Accural</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Applicable To</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Unused</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Action</div></div>
                                                </div>
                                                {clientLeaveTypeArray.map((leave) => (
                                                    <div className="row list_listbox" key={leave.leave_id} >
                                                        <div className="col-lg-1 text-center"><img src={leave.leap_leave_type_icon_and_color.icon_url != null && leave.leap_leave_type_icon_and_color.icon_url.length > 0 ? staticIconsBaseURL + leave.leap_leave_type_icon_and_color.icon_url : staticIconsBaseURL+"/images/leave_type_icons/leave.svg"} className="img-fluid" style={{ maxHeight: "25px", borderRadius: "40px" }} /></div>

                                                        <div className="col-lg-2 text-center">{leave.leave_name || "--"}</div>
                                                        <div className="col-lg-2 text-center">{leave.leave_discription || "--"}</div>
                                                        <div className="col-lg-1 text-center">{leave.leave_category || "--"}</div>
                                                        <div className="col-lg-1 text-center">{leave.leave_count || "--"}</div>
                                                        <div className="col-lg-1 text-center">{leave.leave_accrual || "--"}</div>
                                                        <div className="col-lg-2 text-center">{leave.gender || "--"}</div>
                                                        <div className="col-lg-1 text-center">{leave.if_unused || "--"}</div>
                                                        <div className="col-lg-1 text-center">
                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", cursor: "pointer"}}
                                                                onClick={() => {
                                                                    setEditLeaveTypeId(leave.leave_id);
                                                                    setshowEditLeaveType(true)
                                                                }}
                                                            />
                                                        </div>  

                                                    </div>
                                                ))}
                                            </div> : <div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                                                {<h5 className="text-muted">No leave types are available</h5>}
                                            </div>}


                                    </div>
                                </div>

                                <div className="row mb-3">

                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{ alignItems: "center" }}>
                                            <div className="col-lg-9 settings_title">Employee Permissions</div>

                                            {/* <div className="col-lg-2 text-center">
                                                Search Employee
                                            </div> */}
                                            <div className="col-lg-3">
                                                <Select
                                                    className="custom-select"
                                                    classNamePrefix="custom"
                                                    options={employeeArray}
                                                    value={selectedEmployee}
                                                    onChange={(selectedOption) =>
                                                        handleEmployeeChange(selectedOption)
                                                    }
                                                    placeholder="Search Team Lead"
                                                    isSearchable
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4" >
                                            <div className="row list_label mb-4">
                                                <div className="col-lg-3 text-center"><div className="label">Employee ID</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Name</div></div>

                                            </div>

                                            <div className="row list_listbox" >

                                                <div className="col-lg-3 text-center">{selectedEmployee.label.substring(0, selectedEmployee.label.indexOf(" "))}</div>
                                                <div className="col-lg-2 text-center">{selectedEmployee.label.substring(selectedEmployee.label.indexOf(" ") + 1)}</div>


                                            </div>

                                        </div>
                                        <div style={{backgroundColor:"#fff", padding:"30px", borderRadius:"20px"}}>
                                            <div className="mb-2" >
                                                <div className="row list_label mb-4">
                                                    <div className="col-lg-3 text-center"><div className="label">Permissions</div></div>
                                                </div>
                                            </div>
                                            <div className="row mb-2" >
                                                {employeePermissionArray.map((empPermission, index) => (
                                                    <div className="col-lg-4 announcement_switch_row mb-3" key={index}>
                                                        <label htmlFor="formFile" className="form-label">{empPermission.permission_name}:</label>
                                                        <label className="switch" style={{float:"right"}}>
                                                            <input type="checkbox" name="isAllowed" checked={empPermission.isAllowed} onChange={(e) => handlePermissionChange(empPermission.emp_permission_id)} />
                                                            <span className="slider round"></span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-12" style={{ textAlign: "right" }}>
                                                    {arePermissionChanged && <a className="red_button" onClick={() => callSetEmployeePermissions()}>Update </a>}
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>


                                <div className="row mb-3">

                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{ alignItems: "center" }}>
                                            <div className="col-lg-9 settings_title">Branch Working Hours</div>


                                            <div className="col-lg-3">
                                                <Select
                                                    className="custom-select"
                                                    classNamePrefix="custom"
                                                    options={searchBranchArray}
                                                    value={selectedWorkingHourBranch}
                                                    onChange={(selectedOption) =>
                                                        handleBranchChange(selectedOption, 3)
                                                    }
                                                    placeholder="Search Branch"
                                                    isSearchable
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Full Day Working Time:(minutes)<span className='req_text'>*</span>:</label>
                                                    <input type="numeric" className="form-control" id="full_day" value={workingDayformValues.full_day} name="full_day" onChange={handleInputChange} placeholder="Enter Nationality" />
                                                    {errors.full_day && <span className='error' style={{ color: "red" }}>{errors.full_day}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Half Day Working Time:(minutes)<span className='req_text'>*</span>:</label>
                                                    <input type="numeric" className="form-control" id="half_day" value={workingDayformValues.half_day} name="half_day" onChange={handleInputChange} placeholder="Enter Nationality" />
                                                    {errors.half_day && <span className='error' style={{ color: "red" }}>{errors.half_day}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Total Break Time:(hours)<span className='req_text'>*</span>:</label>
                                                    <input type="numeric" className="form-control" id="lunch_time" value={workingDayformValues.lunch_time} name="lunch_time" onChange={handleInputChange} placeholder="Enter Nationality" />
                                                    {errors.lunch_time && <span className='error' style={{ color: "red" }}>{errors.lunch_time}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Working off Days:(per week)<span className='req_text'>*</span>:</label>
                                                    <input type="numeric" className="form-control" id="holiday_per_week" value={workingDayformValues.holiday_per_week} name="holiday_per_week" onChange={handleInputChange} placeholder="Enter Nationality" />
                                                    {errors.holiday_per_week && <span className='error' style={{ color: "red" }}>{errors.holiday_per_week}</span>}
                                                </div>
                                            </div>
                                            {workingHoursDataChanged && <div className="col-lg-4 " >
                                            
                                                <input type='submit' value={addWorkingHours?"Insert":"Update"}  className="red_button" onClick={handleWorkingHourUpdate} />
                                            </div>}
                                        </div>
                                    </div>
                                </div>


                                 <div className="row mb-3">

                                    <div className="grey_box">
                                        <div className="row settings-title-bg mb-3" style={{ alignItems: "center" }}>
                                            <div className="col-lg-9 settings_title">Holiday Years</div>


                                            
                                        </div>
                                        
                                        {holidayYearArray && holidayYearArray.length>0 ? holidayYearArray.map((holiday, index) => (
                                               

                                                <div className="announcement_branch_box mb-2" key={holiday.id} >

                                                    <a>
                                                        <div className="list_view_heading text-center"> {holiday.list_name}
                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "8px" }}
                                                                onClick={() => {
                                                                    setDataEditID(holiday.id);
                                                                    setShowEdithHolidayYear(true);
                                                                    setDataEditDetail(holiday.list_name);
                                                                }}
                                                            />

                                                            <img src={staticIconsBaseURL+"/images/delete.png"} className="img-fluid mr-2" style={{ maxHeight: '18px', marginLeft: "5px" }}
                                                                onClick={() => {
                                                                    setdataDeleteID(holiday.id);
                                                                    setShowDeleteHolidayYear(true);
                                                                    setDataDeleteDetail(holiday.list_name);
                                                                }}
                                                            />
                                                        </div>
                                                    </a>
                                                </div>
                                            )) : <div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                                                {<h5 className="text-muted">No holiday years available</h5>}
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={showAddBranchDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showAddBranchDialog && <AddBranchDetails onClose={() => { setShowAddBranchDialog(false) }} />}
                    </div>

                    <div className={showAddDepartment ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showAddDepartment && <DialogClientAddDesignationDepartment onClose={() => { setShowAddDepartment(false) }} isDesignationAdd={false} editDataType={''} editID={-1} dataToEdit={''} />}
                    </div>

                    <div className={showAddDesignation ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showAddDesignation && <DialogClientAddDesignationDepartment onClose={() => { setShowAddDesignation(false)}} isDesignationAdd={true} editDataType={''} editID={-1} dataToEdit={''} />}
                    </div>

                    <div className={showEditHolidayYear ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showEditHolidayYear && <AddHolidayYear onClose={() => { setShowEdithHolidayYear(false),fetchData() } } isedit={true} editid={dataEditID} />}
                    </div>
                    
                    {showDeleteHolidayYear && <DeleteConfirmation
                        onClose={() => { setShowDeleteHolidayYear(false), fetchData() }}
                        id={dataDeleteID}
                        deletionType={deleteDataTypeHolidayYear}
                        deleteDetail={dataDeleteDetail}
                    />
                    }
                    {showDeleteDesignation && <DeleteConfirmation
                        onClose={() => { setShowDeleteDesignation(false), fetchData() }}
                        id={dataDeleteID}
                        deletionType={deleteDataTypeDesignation}
                        deleteDetail={dataDeleteDetail}
                    />
                    }
                    {showDeleteDepartment && <DeleteConfirmation
                        onClose={() => { setShowDeleteDepartment(false), fetchData() }}
                        id={dataDeleteID}
                        deletionType={deleteDataTypeDepartment}
                        deleteDetail={dataDeleteDetail}
                    />
                    }
                    {showDeleteBankComponent && <DeleteConfirmation
                        onClose={() => { setShowDeleteBankComponent(false), fetchData() }}
                        id={dataDeleteID}
                        deletionType={deleteDataTypeBankComponent}
                        deleteDetail={dataDeleteDetail}
                    />
                    }

                    <div className={showEditDepartment ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showEditDepartment && <DialogClientAddDesignationDepartment onClose={() => { setShowEditDepartment(false), fetchData() }} isDesignationAdd={false} editDataType={"Department"} editID={dataEditID} dataToEdit={dataEditDetail} />}
                    </div>

                    <div className={showEditDesignation ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showEditDesignation && <DialogClientAddDesignationDepartment onClose={() => { setShowEditDesignation(false), fetchData() }} isDesignationAdd={false} editDataType={"Designation"} editID={dataEditID} dataToEdit={dataEditDetail} />}
                    </div>
                    
                    <div className={showAddBankComponent ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showAddBankComponent && <DialogAddEditBankComponents onClose={() => { setShowAddBankComponent(false), fetchData() }} isComponentAdd={true} componentValue={editBankDetail} />}
                    </div>
                    <div className={showEditBankComponents ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showEditBankComponents && <DialogAddEditBankComponents onClose={() => { setShowEditBankComponents(false), fetchData() }} isComponentAdd={false} componentValue={editBankDetail} />}
                    </div>

                    <div className={showEditLeaveType ? "rightpoup rightpoupopen" : "rightpoup"}>                                  
                    
                        {showEditLeaveType && <LeaveTypeUpdate id={editLeaveTypeId} onClose={() => { setshowEditLeaveType(false), fetchData() }} />}
                    </div>
                </div>


                //  : <LoadingDialog isLoading={true} />
            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default ClientAdminSettings;

async function getClientDepartments(client_id: any, branch_id: any, searchText: any) {

    let query = supabase
        .from('leap_client_departments')
        .select()
        .eq("client_id", client_id)
        .eq("is_active", true)

    if (branch_id) {
        query = query.eq("branch_id", branch_id)
    }
    if (searchText) {
        query = query.ilike("department_name", "%" + searchText + "%")
    }
    query = query.order("department_name", { ascending: true })

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}

async function getClientDesignations(client_id: any, branch_id: any, searchText: any) {

    let query = supabase
        .from('leap_client_designations')
        .select()
        .eq("client_id", client_id)
        .eq("is_active", true)

    if (branch_id) {
        query = query.eq("branch_id", branch_id)
    }
    if (searchText) {
        query = query.ilike("designation_name", "%" + searchText + "%")
    }
    query = query.order("designation_name", { ascending: true })
    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getClientBankComponents(client_id: any, branch_id: any) {

    let query = supabase
        .from('leap_client_bank_details_components')
        .select().eq("client_id", client_id).eq("is_active", true);

    if (branch_id) {
        query = query.eq("branch_id", branch_id)
    }
    query = query.order("component_name", { ascending: true })

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
        .select()
        .eq("client_id", clientID);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getLeaveTypes(clientID: any, branch_id: any) {

    let query = supabase
        .from('leap_client_leave')
        .select('*,leap_leave_type_icon_and_color(leave_type_icon_id,icon_url,bg_color)')
        .eq("client_id", clientID);
    if (branch_id) {
        query = query.eq("branch_id", branch_id)
    }
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getPermissionTypes(clientID: any) {

    let query = supabase
        .from('leap_client_employee_permission_types')
        .select('emp_permission_id,permission_name')

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getEmployees(clientID: any, branch_id: any) {

    let query = supabase
        .from('leap_customer')
        .select('emp_id,customer_id,name')
        .eq("client_id", clientID);
    if (branch_id) {
        query = query.eq("branch_id", branch_id)
    }
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getEmployeePermissions(customer_id: any) {

    let query = supabase
        .from('leap_client_employee_permissions')
        .select('permission_id,is_allowed')
        .eq("customer_id", customer_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}


async function getBranchWorkingHours(clientID: any, branch_id: any) {

    let query = supabase
        .from('leap_client_working_hour_policy')
        .select()
        .eq("client_id", clientID);
    if (branch_id) {
        query = query.eq("branch_id", branch_id)
    }
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getHolidayYear(clientID: any) {

    let query = supabase
        .from('leap_holiday_year')
        .select()
        .eq("client_id", clientID).eq("is_deleted", false);
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
