
// weekly Task list chart of the employee

'use client'
import React, { ChangeEvent } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { AssignedTask, LeapClientSubProjects, LeapTaskStatus, Task } from '@/app/models/TaskModel'
import { pageURL_userFillTask, pageURL_userAssignTask } from '@/app/pro_utils/stringRoutes'
import Select from "react-select";
import moment from 'moment'
import LeftPannel from '@/app/components/leftPannel'
import { staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import PageErrorCenterContent from '@/app/components/pageError'
import ShowAlertMessage from '@/app/components/alert'
import { ALERTMSG_addAssetSuccess } from '@/app/pro_utils/stringConstants'
import EmployeeTaskData from '@/app/components/dialog_userTaskDetails'
import TeamTaskData from '@/app/components/dialog_teamTask'

interface filterApply {
    date: any,
    projectID: any,
    empName: any,
    taskStatus: any,
    customerID: any
}
const EmployeeLeaveList = () => {
    const [taskarray, setTask] = useState<Task[]>([]);
    const [teamTaskarray, setTeamTask] = useState<Task[]>([]);
    const [projectTaskarray, setProjectTask] = useState<Task[]>([]);
    const [assignedTaskarray, setAssignedTask] = useState<AssignedTask[]>([]);
    const { contextClientID, contextRoleID, contextCustomerID, contaxtBranchID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);
    const [detailAppliedID, setDetailAppliedID] = useState(-1);
    const [selectedEmp, setSelectedEmployeeName] = useState({ value: '', label: '' });

    const [isToBeEdited, setisToBeEdited] = useState(false);
    const [editTaskId, setEditTaskId] = useState(0);
    const [numId, setNumId] = useState(0);
    const [taskId, setTaskId] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [showDialog1, setShowDialog1] = useState(false);
    const [viewIndex, setViewIndex] = useState(0);
    const [filters, setFilters] = useState<filterApply>({ date: "", projectID: "", empName: "", taskStatus: "", customerID: "" })
    const [projectarray, setProject] = useState<LeapClientSubProjects[]>([]);
    const [statusarray, setStatus] = useState<LeapTaskStatus[]>([]);
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
    const [loadingCursor, setLoadingCursor] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const subProject = await getProjects(contextClientID);
            setProject(subProject);
            const statusID = await getStatus();
            setStatus(statusID);
            const empData = await getEmployee(contextCustomerID, contaxtBranchID);
            let name: any[] = []
            for (let i = 0; i < empData.length; i++) {
                name.push({
                    value: empData[i].customer_id,
                    label: empData[i].emp_id + "  " + empData[i].name,
                })
            }
            setEmployeeNames(name);
        }
        fetchData();
        fetchTasks("", "");
        fetchTeamTasks("", "");
        fetchProjectTasks("", "");
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

    }, [selectedPage])

    const fetchTasks = async (filterID: any, value: any) => {
        try {
            let formData = {
                "client_id": contextClientID,
                "customer_id": contextCustomerID,
                "task_date": "",
                "sub_project_id": "",
                "task_status": ""
            }
            if (filterID == 1) {
                let taskDate = filters.date.length > 0 && filters.date == value ? filters.date : value;
                formData = {
                    ...formData,
                    "task_date": taskDate
                }
            }
            if (filterID == 2) {
                let subproject = filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value
                formData = {
                    ...formData,
                    "sub_project_id": subproject
                }
            }
            if (filterID == 3) {
                let status = filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value
                formData = {
                    ...formData,
                    "task_status": status
                }
            }
            // formData.append("client_id", "3");
            // formData.append("customer_id", contextCustomerID);
            // formData.append("task_date", "24-03-2024");
            // if (filterID == 1) formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value);
            // if (filterID == 1) { formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value); }
            // else {
            //     formData.append("task_date", formatDateYYYYMMDD(new Date()));
            // }
            // if (filterID == 2) formData.append("sub_project_id", filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value);
            // if (filterID == 3) formData.append("task_status", filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value);
            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }
            const res = await fetch(`/api/users/getTasks`, {
                method: "POST",
                body: JSON.stringify({
                   formData
                }),
            });
            const response = await res.json();
            console.log(response);
            const leaveListData = response.data;
            if (response.status === 1) {
                setTask(leaveListData)
            } else {
                setTask([]);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load task");
                setAlertForSuccess(2)
            }
            setLoadingCursor(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    };
    const fetchAssignedTasks = async (filterID: any, value: any) => {
        try {
            let formData = {
                "assigned_to": contextCustomerID,
                "task_date": formatDateYYYYMMDD(new Date()),
                "sub_project_id": "",
                "task_status": ""
            }
            if (filterID == 1) {
                let taskDate = filters.date.length > 0 && filters.date == value ? filters.date : value;
                formData = {
                    ...formData,
                    "task_date": taskDate
                }
            }
            if (filterID == 2) {
                let subproject = filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value
                formData = {
                    ...formData,
                    "sub_project_id": subproject
                }
            }
            if (filterID == 3) {
                let status = filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value
                formData = {
                    ...formData,
                    "task_status": status
                }
            }
            // formData.append("assigned_to", contextCustomerID);
            // if (filterID == 1) formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value);
            // if (filterID == 1) { formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value); }
            // else {
            //     formData.append("task_date", new Date().toISOString());

            // }
            // if (filterID == 2) formData.append("sub_project_id", filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value);
            // if (filterID == 3) formData.append("task_status", filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value);
            const res = await fetch(`/api/users/getAssignedTask`, {
                method: "POST",
                body: JSON.stringify({
                    formData
                }),
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.data;
            if (response.status == 1) {
                setAssignedTask(taskData);
            } else {
                setAssignedTask([]);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load tasks");
                setAlertForSuccess(2)
            }
            setLoadingCursor(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    };
    const fetchTeamTasks = async (filterID: any, value: any) => {
        try {
           let formData = {
                "manager_id": contextCustomerID,
                "task_date": formatDateYYYYMMDD(new Date()),
                "customer_id": 0,
                "sub_project_id": "",
                "task_status": ""
            }
            if (filterID == 1) {
                let taskDate = filters.date.length > 0 && filters.date == value ? filters.date : value;
                formData = {
                    ...formData,
                    "task_date": taskDate
                }
            }
            if (filterID == 2) {
                let subproject = filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value
                formData = {
                    ...formData,
                    "sub_project_id": subproject
                }
            }
            if (filterID == 3) {
                let status = filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value
                formData = {
                    ...formData,
                    "task_status": status
                }
            }
            if (filterID == 4) {
                let customerID = filters.customerID.length > 0 && filters.customerID == value ? filters.customerID : value
                formData = {
                    ...formData,
                    "customer_id": customerID
                }
            }
            // formData.append("manager_id", contextCustomerID);
            // if (filterID == 1) formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value);
            // if (filterID == 1) {
            //     formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value);
            // } else {
            //     formData.append("task_date", new Date().toISOString());
            // }
            // if (filterID == 2) formData.append("sub_project_id", filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value);
            // if (filterID == 3) formData.append("task_status", filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value);
            // if (filterID == 4) formData.append("customer_id", filters.customerID.length > 0 && filters.customerID == value ? filters.customerID : value);

            const res = await fetch(`/api/users/getTeamTasks`, {
                method: "POST",
                body: JSON.stringify({
                    formData
                }),
            });
            const response = await res.json();
            // console.log(response);

            const taskData = response.taskdata;
            if (response.status == 1 || []) {
                setTeamTask(taskData);
            } else {
                setTeamTask([]);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load Tasks");
                setAlertForSuccess(2)
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
        setLoadingCursor(false);
    };
    const fetchProjectTasks = async (filterID: any, value: any) => {
        try {
            let formData = {
                "project_manager_id": contextCustomerID,
                "task_date": formatDateYYYYMMDD(new Date()),
                "customer_id": 0,
                "sub_project_id": "",
                "task_status": ""
            }
            if (filterID == 1) {
                let taskDate = filters.date.length > 0 && filters.date == value ? filters.date : value;
                formData = {
                    ...formData,
                    "task_date": taskDate
                }
            }
            if (filterID == 2) {
                let subproject = filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value
                formData = {
                    ...formData,
                    "sub_project_id": subproject
                }
            }
            if (filterID == 3) {
                let status = filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value
                formData = {
                    ...formData,
                    "task_status": status
                }
            }
            if (filterID == 4) {
                let customerID = filters.customerID.length > 0 && filters.customerID == value ? filters.customerID : value
                formData = {
                    ...formData,
                    "customer_id": customerID
                }
            }
            // formData.append("project_manager_id", contextCustomerID);
            // if (filterID == 1) { formData.append("task_date", filters.date.length > 0 && filters.date == value ? filters.date : value); }
            // else {
            //     formData.append("task_date", new Date().toISOString());

            // }
            // if (filterID == 2) formData.append("sub_project_id", filters.projectID.length > 0 && filters.projectID == value ? filters.projectID : value);
            // if (filterID == 3) formData.append("task_status", filters.taskStatus.length > 0 && filters.taskStatus == value ? filters.taskStatus : value);
            // if (filterID == 4) formData.append("customer_id", filters.customerID.length > 0 && filters.customerID == value ? filters.customerID : value);

            const res = await fetch(`/api/users/getProjectTasks`, {
                method: "POST",
                body: JSON.stringify({
                    
                }),
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.taskdata;
            if (response.status == 1 || []) {
                setProjectTask(taskData);
            } else {
                setProjectTask([]);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load Tasks");
                setAlertForSuccess(2)
            }
            setLoadingCursor(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    };
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleTaskFilter = (e: any) => {
        const { name, value } = e.target;

        if (name == "date") {
            setFilters((prev) => ({ ...prev, ['date']: value }));
            fetchTasks(1, value);
            fetchTeamTasks(1, value);
            fetchProjectTasks(1, value);
        }
        if (name == "projectID") {
            setFilters((prev) => ({ ...prev, ['projectID']: value }));
            fetchTasks(2, value);
            fetchTeamTasks(2, value);
            fetchProjectTasks(2, value);
        }
        if (name == "taskStatus") {
            setFilters((prev) => ({ ...prev, ['taskStatus']: value }));
            fetchTasks(3, value);
            fetchTeamTasks(3, value)
            fetchProjectTasks(3, value);
        }
    };
    const resetFilter = async (value: any) => {
        // window.location.reload();
        setFilters({
            date: formatDateYYYYMMDD(new Date()), projectID: "", empName: "", taskStatus: "", customerID: ""
        });
        if (value == "fetchTasks") {
            fetchTasks("", "");
        }
        if (value == "fetchTeamTasks") {
            fetchTeamTasks("", "");
        }
        if (value == "fetchAssignedTasks") {
            fetchAssignedTasks("", "");
        }
        if (value == "fetchProjectTasks") {
            fetchProjectTasks("", "");
        }
    };
    const handleEmpSelectChange = async (values: any) => {
        setEmployeeNames(values)
        // setSelectedEmployeeName({ value: '', label: '' });

        // setFilters((prev) => ({ ...prev, ["customerID"]: values.value }));
        fetchProjectTasks(4, values.value);
        fetchTeamTasks(4, values.value);
    };
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={22} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                //  taskarray! && taskarray.length > 0 && teamTaskarray! && teamTaskarray.length > 0 && projectTaskarray! && projectTaskarray.length > 0 ?
                <div>
                    {/* ---------------------------- */}
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="nw_user_inner_mainbox">
                                    <div className="nw_user_inner_heading_tabbox">
                                        <div className="heading25">
                                            Task <span> Manager</span>
                                        </div>
                                        <div className="nw_user_inner_tabs">
                                            <ul>
                                                <li className={viewIndex === 0 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={0}>
                                                    <a onClick={(e) => { setViewIndex(0), setLoadingCursor(true), resetFilter(""), fetchTasks("", "") }} className={viewIndex === 0 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                                                                <g className='black_to_white_fill' fill="#000000">
                                                                    <path d="M18.182 9.382h-5.775c-.451 0-.825-.374-.825-.825s.374-.825.825-.825h5.775a.825.825 0 1 1 0 1.65zm-11.55.836a.816.816 0 0 1-.583-.242l-.825-.825c-.319-.319-.319-.847 0-1.166s.847-.319 1.166 0l.242.242 1.892-1.892a.83.83 0 0 1 1.166 0 .83.83 0 0 1 0 1.166L7.215 9.976a.825.825 0 0 1-.583.242zm11.55 6.864h-5.775c-.451 0-.825-.374-.825-.825s.374-.825.825-.825h5.775a.825.825 0 1 1 0 1.65zm-11.55.836a.816.816 0 0 1-.583-.242l-.825-.825c-.319-.319-.319-.847 0-1.166s.847-.319 1.166 0l.242.242 1.892-1.892a.83.83 0 0 1 1.166 0 .83.83 0 0 1 0 1.166l-2.475 2.475a.825.825 0 0 1-.583.242z" data-original="#000000" />
                                                                    <path d="M15.3 23.825H8.7c-5.973 0-8.525-2.552-8.525-8.525V8.7C.175 2.727 2.727.175 8.7.175h6.6c5.973 0 8.525 2.552 8.525 8.525v6.6c0 5.973-2.552 8.525-8.525 8.525zm-6.6-22c-5.071 0-6.875 1.804-6.875 6.875v6.6c0 5.071 1.804 6.875 6.875 6.875h6.6c5.071 0 6.875-1.804 6.875-6.875V8.7c0-5.071-1.804-6.875-6.875-6.875z" data-original="#000000" />
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Tasks
                                                        </div>
                                                    </a>
                                                </li>
                                                <li className={viewIndex === 1 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={1}>
                                                    <a onClick={(e) => { setViewIndex(1), setLoadingCursor(true), resetFilter(""), fetchAssignedTasks("", "") }} className={viewIndex === 1 ? "nw_user_selected" : "new_list_view_heading"}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg className='black_to_white_fill' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 32">
                                                                <path d="M8.738 24.383a.963.963 0 0 0 0 1.926h7.316a.963.963 0 0 0 0-1.926zm14.524-8.979H8.74a.963.963 0 0 0 0 1.926h14.523a.963.963 0 0 0 0-1.926zm.964 5.454a.963.963 0 0 0-.963-.963H8.74a.963.963 0 0 0 0 1.926h14.523a.963.963 0 0 0 .964-.963z" data-original="#000000" />
                                                                <path d="M26.219 3.908H16.98a.963.963 0 0 0 0 1.926h9.238c1.032 0 1.872.834 1.872 1.862v20.448c0 1.033-.84 1.873-1.872 1.873H5.782a1.875 1.875 0 0 1-1.873-1.873V7.697c0-1.027.84-1.862 1.873-1.862h5.95v3.238a.698.698 0 0 1-1.394 0v-1a.963.963 0 0 0-1.926 0v1c0 1.449 1.178 2.626 2.624 2.626s2.625-1.179 2.625-2.625V3.4c0-1.844-1.5-3.344-3.344-3.344s-3.345 1.5-3.345 3.344v.508h-1.19a3.798 3.798 0 0 0-3.8 3.789v20.446a3.804 3.804 0 0 0 3.8 3.8h20.437a3.804 3.804 0 0 0 3.8-3.8V7.697a3.798 3.798 0 0 0-3.8-3.79zM8.899 3.4c0-.781.636-1.417 1.416-1.417.781 0 1.417.636 1.417 1.417v.508H8.899z" data-original="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Assigned
                                                        </div>
                                                    </a>
                                                </li>
                                                {contextRoleID != "5" &&
                                                    <li className={viewIndex === 2 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={2}>
                                                        <a onClick={(e) => { setViewIndex(2), setLoadingCursor(true), resetFilter(""), fetchTeamTasks("", "") }} className={viewIndex === 2 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg className='black_to_white_fill' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                                                                    <path d="M15.25 9.64c1.14 0 2.065.924 2.065 2.065v5.604a5.311 5.311 0 0 1-10.623 0v-5.604c0-1.14.924-2.065 2.065-2.065zm0 1.77H8.757a.295.295 0 0 0-.295.295v5.604a3.541 3.541 0 0 0 7.083 0v-5.604a.295.295 0 0 0-.295-.295zM2.265 9.64h3.99a3.23 3.23 0 0 0-.73 1.77h-3.26a.295.295 0 0 0-.295.295v3.834a2.951 2.951 0 0 0 3.637 2.87c.1.596.283 1.163.534 1.69A4.721 4.721 0 0 1 .2 15.54v-3.834c0-1.14.925-2.065 2.065-2.065zm15.487 0h3.983c1.141 0 2.065.924 2.065 2.065v3.835a4.72 4.72 0 0 1-5.935 4.562 6.43 6.43 0 0 0 .536-1.69 2.95 2.95 0 0 0 3.629-2.872v-3.835a.295.295 0 0 0-.295-.295h-3.253a3.23 3.23 0 0 0-.73-1.77zM12 1.38a3.54 3.54 0 1 1 0 7.08 3.54 3.54 0 0 1 0-7.08zm7.67 1.18a2.95 2.95 0 1 1 0 5.9 2.95 2.95 0 0 1 0-5.9zm-15.34 0a2.95 2.95 0 1 1 0 5.9 2.95 2.95 0 0 1 0-5.9zm7.67.59a1.77 1.77 0 1 0 0 3.54 1.77 1.77 0 0 0 0-3.54zm7.67 1.18a1.18 1.18 0 1 0 0 2.36 1.18 1.18 0 0 0 0-2.36zm-15.34 0a1.18 1.18 0 1 0 0 2.36 1.18 1.18 0 0 0 0-2.36z" data-original="#000000" />
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Team
                                                            </div>
                                                        </a>
                                                    </li>
                                                }
                                                {contextRoleID != "5" &&
                                                    <li className={viewIndex === 3 ? "nw_user_inner_listing_selected" : "nw_user_inner_listing"} key={3}>
                                                        <a onClick={(e) => { setViewIndex(3), setLoadingCursor(true), resetFilter(""), fetchProjectTasks("", "") }} className={viewIndex === 3 ? "nw_user_selected" : "new_list_view_heading"}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 682.667 682.667">
                                                                    <defs>
                                                                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                                            <path d="M0 512h512V0H0Z" data-original="#000000" />
                                                                        </clipPath></defs>
                                                                    <g fill="none" className='black_to_white_stoke' stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="30" clip-path="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                                                        <path d="M482 144H30c-8.284 0-15 6.716-15 15v298c0 8.284 6.716 15 15 15h452c8.284 0 15-6.716 15-15V159c0-8.284-6.716-15-15-15ZM192 144h128V40H192ZM96 40h320" data-original="#000000" />
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Projects
                                                            </div>
                                                        </a>
                                                    </li>
                                                }
                                            </ul>
                                            <ul>
                                                <li>
                                                    {contextRoleID != "5" &&
                                                        <a href={pageURL_userAssignTask}>
                                                            <div className="nw_user_tab_icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15" x="0" y="0" viewBox="0 0 512 512" className="">
                                                                    <g>
                                                                        <path d="M256 0C114.837 0 0 114.837 0 256s114.837 256 256 256 256-114.837 256-256S397.163 0 256 0zm96.325 274.113L227.163 399.275c-5 4.988-11.55 7.487-18.1 7.487s-13.1-2.5-18.1-7.487c-10-10-10-26.212 0-36.212L298.025 256 190.963 148.95c-10-10-10-26.213 0-36.213 10-9.988 26.2-9.988 36.2 0L352.325 237.9a25.604 25.604 0 0 1 0 36.213z" fill="#ed2024" opacity="1" data-original="#000000" className="red_to_white"></path>
                                                                    </g>
                                                                </svg>
                                                            </div>
                                                            <div className="nw_user_tab_name">
                                                                Assign
                                                            </div>
                                                        </a>
                                                    }
                                                </li>
                                                <li>
                                                    <a href={pageURL_userFillTask}>
                                                        <div className="nw_user_tab_icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                                                                <path className='red_to_white' fill="#ed2024" d="M12 .12A11.88 11.88 0 1 0 23.88 12 11.894 11.894 0 0 0 12 .12zm5.4 12.96h-4.32v4.32a1.08 1.08 0 0 1-2.16 0v-4.32H6.6a1.08 1.08 0 0 1 0-2.16h4.32V6.6a1.08 1.08 0 0 1 2.16 0v4.32h4.32a1.08 1.08 0 0 1 0 2.16z" data-name="Layer 2" data-original="#000000" />
                                                            </svg>
                                                        </div>
                                                        <div className="nw_user_tab_name">
                                                            Add
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="nw_user_inner_content_box">
                                        {viewIndex == 0 ?
                                            // my task
                                            <>
                                                <div className="nw_user_filter_mainbox">
                                                    <div className="filter_whitebox" id="filter_whitebox">
                                                        <div className="nw_filter_form_group_mainbox">
                                                            <div className="nw_filter_form_group">
                                                                <input type="date" className='form-control' name="date" value={filters.date} onChange={handleTaskFilter} />
                                                            </div>
                                                            <div className="nw_filter_form_group">
                                                                <select id="projectID" name="projectID" value={filters.projectID} onChange={handleTaskFilter} className='form-select'>
                                                                    <option value="">Project:</option>
                                                                    {projectarray.map((id, index) => (
                                                                        <option value={id.subproject_id} key={index}>{id.sub_project_name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="nw_filter_form_group">
                                                                <select id="taskStatus" name="taskStatus" value={filters.taskStatus} onChange={handleTaskFilter} className='form-select'>
                                                                    <option value="">Status:</option>
                                                                    {statusarray.map((id, index) => (
                                                                        <option value={id.id} key={index}>{id.status}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="nw_filter_form_group">
                                                                <div className="nw_filter_submit_btn">
                                                                    <a onClick={() => resetFilter("fetchTasks")}>
                                                                        <img src={staticIconsBaseURL+"/images/user/undo.svg"} alt="Filter icon" className="img-fluid" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                        <img src={staticIconsBaseURL+"/images/user/filter-icon.svg"} alt="Filter icon" className="img-fluid" />
                                                    </div>
                                                </div>
                                                <div className="my_task_tabbing_content">
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="row list_label mb-4">
                                                                        <div className="col-lg-2 text-center"><div className="label">Date</div></div>
                                                                        <div className="col-lg-2 text-center"><div className="label">Project</div></div>
                                                                        <div className="col-lg-2 text-center"><div className="label">Task Type</div></div>
                                                                        <div className="col-lg-4 text-center"><div className="label">Details</div></div>
                                                                        <div className="col-lg-1 text-center"><div className="label">Status</div></div>
                                                                    </div>
                                                                    {taskarray.length > 0 ? (
                                                                        taskarray?.map((list, index) => (
                                                                            <div className="list_listbox" key={index}>
                                                                                <div className="list_listing" style={{ backgroundColor: "#fff" }}>
                                                                                    <div className="row">
                                                                                        <div className="col-lg-2 text-center">{list.task_date}</div>
                                                                                        <div className="col-lg-2 text-center">{list.leap_client_sub_projects.sub_project_name}</div>
                                                                                        <div className="col-lg-2 text-center">{list.leap_project_task_types.task_type_name}</div>
                                                                                        <div className="col-lg-4 text-center restrict_two_lines">{list.task_details}</div>
                                                                                        {list.task_status === 3 ? (
                                                                                            <><div className="col-lg-1 text-center" style={{ color: "green" }}>{list.leap_task_status.status}</div></>
                                                                                        ) :
                                                                                            <><div className="col-lg-1 text-center" style={{ color: "orange" }}>{list.leap_task_status.status}</div></>
                                                                                        }
                                                                                        <div className="col-lg-1 text-center">
                                                                                            {list.leap_task_status.status == "Completed" ? <img src={staticIconsBaseURL+"/images/ic_eye.png"} style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }} alt="Search Icon" onClick={() => { setEditTaskId(list.id); setShowDialog(true); setisToBeEdited(false) }} /> :
                                                                                                <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid edit-icon" title='View/Edit' alt="Search Icon" style={{ width: "20px", cursor: "pointer", paddingBottom: "0px", alignItems: "center" }} onClick={() => { setEditTaskId(list.id); setShowDialog(true); setisToBeEdited(true) }} />

                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                                                            <PageErrorCenterContent content={"No tasks yet"} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            : viewIndex == 1 ?
                                                // assigned task 
                                                <>
                                                    <div className="nw_user_filter_mainbox">
                                                        <div className="filter_whitebox" id="filter_whitebox">
                                                            <div className="nw_filter_form_group_mainbox">
                                                                <div className="nw_filter_form_group">
                                                                    <input type="date" name="date" value={filters.date} onChange={handleTaskFilter} className='form-control' />
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <select id="projectID" name="projectID" value={filters.projectID} onChange={handleTaskFilter} className='form-select'>
                                                                        <option value="">Project:</option>
                                                                        {projectarray.map((id, index) => (
                                                                            <option value={id.subproject_id} key={index}>{id.sub_project_name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <select id="taskStatus" name="taskStatus" value={filters.taskStatus} onChange={handleTaskFilter} className='form-select'>
                                                                        <option value="">Status:</option>
                                                                        {statusarray.map((id, index) => (
                                                                            <option value={id.id} key={index}>{id.status}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="nw_filter_form_group">
                                                                    <div className="nw_filter_submit_btn">
                                                                        <a onClick={() => resetFilter("fetchAssignedTasks")}>
                                                                            <img src={staticIconsBaseURL+"/images/user/undo.svg"} alt="Filter icon" className="img-fluid" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                            <img src={staticIconsBaseURL+"/images/user/filter-icon.svg"} alt="Filter icon" className="img-fluid" />
                                                        </div>
                                                    </div>
                                                    <div className="my_task_tabbing_content">
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="row list_label mb-4">
                                                                            {/* <div className="col-lg-2 text-center"><div className="label">Employee</div></div> */}
                                                                            <div className="col-lg-2 text-center"><div className="label">Date</div></div>
                                                                            <div className="col-lg-2 text-center"><div className="label">Priority</div></div>
                                                                            {/* <div className="col-lg-1 text-center"><div className="label">Client</div></div> */}
                                                                            <div className="col-lg-2 text-center"><div className="label">Project</div></div>
                                                                            {/* <div className="col-lg-2 text-center"><div className="label">Assigned by</div></div> */}
                                                                            <div className="col-lg-2 text-center"><div className="label">Deadline</div></div>
                                                                            <div className="col-lg-2 text-center"><div className="label">Assigned By</div></div>
                                                                        </div>
                                                                        {assignedTaskarray.length > 0 ? (
                                                                            assignedTaskarray?.map((list, index) => (
                                                                                <div className="list_listbox" key={index}>
                                                                                    <div className="list_listing" style={{ backgroundColor: "#fff" }}>
                                                                                        <div className="row">
                                                                                            <div className="col-lg-2 text-center">{list.task_date}</div>
                                                                                            <div className="col-lg-2 text-center">{list.leap_task_priority_level.priority_type}</div>
                                                                                            {/* <div className="col-lg-1 text-center">{list.leap_client_sub_projects.leap_client_project.project_name}</div> */}
                                                                                            <div className="col-lg-2 text-center">{list.leap_client_sub_projects.sub_project_name}</div>
                                                                                            {/* <div className="col-lg-2 text-center">{list.assigned_by}</div> */}
                                                                                            <div className="col-lg-2 text-center" style={{ color: "red" }}>{list.deadline ? list.deadline : "--"}</div>
                                                                                            <div className="col-lg-2 text-center">{list.leap_customer.name}</div>
                                                                                            <div className="col-lg-1 text-center">
                                                                                                <img src={staticIconsBaseURL+"/images/ic_eye.png"} style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }} alt="Search Icon" onClick={() => { setEditTaskId(list.id); setNumId(1); setShowDialog(true); setisToBeEdited(false) }} />

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                                                                <PageErrorCenterContent content={"No tasks yet"} />
                                                                            </div>
                                                                        )}
                                                                        {/* {showDialog && <TaskUpdate id={editTaskId} onClose={() => { setShowDialog(false), fetchTasks("","") }} />} */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                : viewIndex == 2 ?
                                                    // Team members task
                                                    <>~~
                                                        <div className="nw_user_filter_mainbox">
                                                            <div className="filter_whitebox" id="filter_whitebox">
                                                                <div className="nw_filter_form_group_mainbox nw_filter_form_group_mainbox_four">
                                                                    <div className="nw_filter_form_group">
                                                                        <input type="date" name="date" value={filters.date} onChange={handleTaskFilter} className='form-control' />
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <select id="projectID" name="projectID" value={filters.projectID} onChange={handleTaskFilter} className='form-select'>
                                                                            <option value="">Project:</option>
                                                                            {projectarray.map((id, index) => (
                                                                                <option value={id.subproject_id} key={index}>{id.sub_project_name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <Select
                                                                            className="custom-select"
                                                                            classNamePrefix="custom"
                                                                            options={employeeName}
                                                                            value={selectedEmp}
                                                                            onChange={(selectedOption) =>
                                                                                handleEmpSelectChange(selectedOption)
                                                                            }
                                                                            placeholder="Employee"
                                                                            isSearchable={true}
                                                                        />
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <select id="taskStatus" name="taskStatus" value={filters.taskStatus} onChange={handleTaskFilter} className='form-select'>
                                                                            <option value="">Status:</option>
                                                                            {statusarray.map((id, index) => (
                                                                                <option value={id.id} key={index}>{id.status}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="nw_filter_form_group">
                                                                        <div className="nw_filter_submit_btn">
                                                                            <a onClick={() => resetFilter("fetchTeamTasks")}>
                                                                                <img src={staticIconsBaseURL+"/images/user/undo.svg"} alt="Filter icon" className="img-fluid" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                                <img src={staticIconsBaseURL+"/images/user/filter-icon.svg"} alt="Filter icon" className="img-fluid" />
                                                            </div>
                                                        </div>
                                                        <div className="my_task_tabbing_content">
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div className="row list_label mb-4">
                                                                                <div className="col-lg-2 text-center"><div className="label">Employee Name</div></div>
                                                                                <div className="col-lg-2 text-center"><div className="label">Date</div></div>
                                                                                <div className="col-lg-2 text-center"><div className="label">Client</div></div>
                                                                                <div className="col-lg-2 text-center"><div className="label">Project</div></div>
                                                                                <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                                                            </div>
                                                                            {teamTaskarray.length > 0 ? (
                                                                                teamTaskarray?.map((list, index) => (
                                                                                    <div className="list_listbox" key={index}>
                                                                                        <div className="list_listing" style={{ backgroundColor: "#fff" }}>
                                                                                            <div className="row">
                                                                                                <div className="col-lg-2 text-center">{list.leap_customer.name}</div>
                                                                                                <div className="col-lg-2 text-center">{list.task_date}</div>
                                                                                                <div className="col-lg-2 text-center">{list.leap_client_sub_projects.leap_client_project.project_name}</div>
                                                                                                <div className="col-lg-2 text-center">{list.leap_client_sub_projects.sub_project_name}</div>
                                                                                                {list.task_status === 3 ? (
                                                                                                    <><div className="col-lg-2 text-center" style={{ color: "green" }}>{list.leap_task_status.status}</div></>
                                                                                                ) :
                                                                                                    <><div className="col-lg-2 text-center" style={{ color: "orange" }}>{list.leap_task_status.status}</div></>
                                                                                                }
                                                                                                <div className="col-lg-1 text-center">
                                                                                                    {list.leap_approval_status.approval_type == "Pending" ?
                                                                                                        <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid edit-icon" title='View/Edit' alt="Search Icon" style={{ width: "20px", cursor: "pointer", paddingBottom: "0px", alignItems: "center" }} onClick={() => { setEditTaskId(list.id); setNumId(2); setShowDialog1(true); setisToBeEdited(true) }} /> :
                                                                                                        <img src={staticIconsBaseURL+"/images/ic_eye.png"} style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }} alt="Search Icon" onClick={() => { setEditTaskId(list.id); setNumId(2); setShowDialog(true); setisToBeEdited(false) }} />
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                                                                    <PageErrorCenterContent content={"No tasks yet"} />
                                                                                </div>
                                                                            )}
                                                                            {/* {showDialog && <TaskUpdate id={editTaskId} onClose={() => { setShowDialog(false), fetchTasks("","") }} />} */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : viewIndex == 3 ?
                                                        // Project members task
                                                        <>
                                                            <div className="nw_user_filter_mainbox">
                                                                <div className="filter_whitebox" id="filter_whitebox">
                                                                    <div className="nw_filter_form_group_mainbox nw_filter_form_group_mainbox_four">
                                                                        <div className="nw_filter_form_group">
                                                                            <input type="date" name="date" value={filters.date} onChange={handleTaskFilter} className='form-control' />
                                                                        </div>
                                                                        <div className="nw_filter_form_group">
                                                                            <select id="projectID" name="projectID" value={filters.projectID} onChange={handleTaskFilter} className='form-select'>
                                                                                <option value="">Project:</option>
                                                                                {projectarray.map((id, index) => (
                                                                                    <option value={id.subproject_id} key={index}>{id.sub_project_name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="nw_filter_form_group">
                                                                            <Select
                                                                                className="custom-select"
                                                                                classNamePrefix="custom"
                                                                                options={employeeName}
                                                                                onChange={(selectedOption) =>
                                                                                    handleEmpSelectChange(selectedOption)
                                                                                }
                                                                                placeholder="Employee"
                                                                                isSearchable
                                                                            // value={filters.empName}
                                                                            />
                                                                        </div>
                                                                        <div className="nw_filter_form_group">
                                                                            <select id="taskStatus" name="taskStatus" value={filters.taskStatus} onChange={handleTaskFilter} className='form-select'>
                                                                                <option value="">Status:</option>
                                                                                {statusarray.map((id, index) => (
                                                                                    <option value={id.id} key={index}>{id.status}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="nw_filter_form_group">
                                                                            <div className="nw_filter_submit_btn">
                                                                                <a onClick={() => resetFilter("fetchProjectTasks")}>
                                                                                    <img src={staticIconsBaseURL+"/images/user/undo.svg"} alt="Filter icon" className="img-fluid" />
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="nw_filter_icon" onClick={filter_whitebox}>
                                                                    <img src={staticIconsBaseURL+"/images/user/filter-icon.svg"} alt="Filter icon" className="img-fluid" />
                                                                </div>
                                                            </div>
                                                            <div className="my_task_tabbing_content">
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="row">
                                                                            <div className="col-lg-12">
                                                                                <div className="row list_label mb-4">
                                                                                    <div className="col-lg-2 text-center"><div className="label">Client</div></div>
                                                                                    <div className="col-lg-3 text-center"><div className="label">Project</div></div>
                                                                                    <div className="col-lg-2 text-center"><div className="label">Employee Name</div></div>
                                                                                    <div className="col-lg-2 text-center"><div className="label">Date</div></div>
                                                                                    <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                                                                </div>
                                                                                {projectTaskarray.length > 0 ? (
                                                                                    projectTaskarray?.map((list, index) => (
                                                                                        <div className="list_listbox" key={index}>
                                                                                            <div className="list_listing" style={{ backgroundColor: "#fff" }}>
                                                                                                <div className="row">
                                                                                                    <div className="col-lg-2 text-center">{list.leap_client_sub_projects.leap_client_project.project_name}</div>
                                                                                                    <div className="col-lg-3 text-center">{list.leap_client_sub_projects.sub_project_name}</div>
                                                                                                    <div className="col-lg-2 text-center">{list.leap_customer.name}</div>
                                                                                                    <div className="col-lg-2 text-center">{list.task_date}</div>
                                                                                                    {/* <div className="col-lg-2 text-center">{list.leap_task_status.status}</div> */}
                                                                                                    {list.task_status === 3 ? (
                                                                                                        <><div className="col-lg-2 text-center" style={{ color: "green" }}>{list.leap_task_status.status}</div></>
                                                                                                    ) :
                                                                                                        <><div className="col-lg-2 text-center" style={{ color: "orange" }}>{list.leap_task_status.status}</div></>
                                                                                                    }
                                                                                                    <div className="col-lg-1 text-center ">
                                                                                                        {list.leap_approval_status.approval_type == "Pending" ?
                                                                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid edit-icon" title='View/Edit' alt="Search Icon" style={{ width: "20px", cursor: "pointer", paddingBottom: "0px", alignItems: "center" }} onClick={() => { setEditTaskId(list.id); setNumId(2); setShowDialog1(true); setisToBeEdited(true) }} /> :
                                                                                                            <img src={staticIconsBaseURL+"/images/ic_eye.png"} style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }} alt="Search Icon" onClick={() => { setEditTaskId(list.id); setNumId(2); setShowDialog(true); setisToBeEdited(false) }} />
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))
                                                                                ) : (
                                                                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                                                                        <PageErrorCenterContent content={"No tasks yet"} />
                                                                                    </div>
                                                                                )}
                                                                                {/* {showDialog && <TaskUpdate id={editTaskId} onClose={() => { setShowDialog(false), fetchTasks("","") }} />} */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        : <div />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nw_user_offcanvas">
                        <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showDialog && <EmployeeTaskData id={editTaskId} isToBeEddited={isToBeEdited} onClose={() => {
                                setShowDialog(false)
                                    , resetFilter(""), fetchTasks("", "")
                            }} />}
                        </div>
                    </div>
                    <div className="nw_user_offcanvas">
                        <div className={showDialog1 ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showDialog1 && <TeamTaskData id={editTaskId} num={numId} isToBeEddited={isToBeEdited} onClose={() => { setShowDialog1(false), resetFilter(""), fetchTasks("", "") }} />}
                        </div>
                    </div>
                    {/* ----------------------------- */}
                </div>
            } />
            <Footer />
        </div>
    )
}
export default EmployeeLeaveList;

async function getProjects(clientID: any) {

    let query = supabase
        .from('leap_client_sub_projects')
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

async function getStatus() {

    let query = supabase
        .from('leap_task_status')
        .select()
        .neq("id", 5);
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}

async function getEmployee(managerID: string, branchTypeID: any) {

    let query = supabase
        .from('leap_customer')
        .select(`customer_id,name,emp_id,branch_id`)
        .eq("manager_id", managerID)
    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}