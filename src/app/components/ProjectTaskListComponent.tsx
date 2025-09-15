// import moment from 'moment';
// import React from 'react'
// import Select from "react-select";
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'

// import { useEffect, useState } from 'react'
// import supabase from '../api/supabaseConfig/supabase';
// import LoadingDialog from './PageLoader';
// import { DateRange, RangeKeyDict } from 'react-date-range';
// import { Range } from 'react-date-range';
// import { format } from 'date-fns'

// interface FilterValues {

//     subProjectID: any,
//     customerID: any,
//     startDate: any,
//     endDate: any,
//     taskStatus: any,
// }

// const ProjectTaskListComponent = () => {
//     const [isLoading, setLoading] = useState(true);
//     const [showApproveTaskDialog, setshowApproveTaskDialog] = useState(false);
//     const [loadingCursor, setLoadingCursor] = useState(false);
//     const [projectID, setProjectID] = useState(0);
//     const [isSubProjectAdd, setIsSubProjectAdd] = useState(false);
//     const { contextClientID } = useGlobalContext();
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
//     const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
//     const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
//     const [taskData, setTaskData] = useState<ProjectTaskDataResponseModel[]>([]);
//     const [selectedEmp, setSelectedEmployeeName] = useState({ value: '', label: '' });

//     const [projectName, setProjectName] = useState([{ value: '', label: '' }]);
//     const [subProjectName, setSubProjectName] = useState([{ value: '', label: '' }]);
//     const [employeeName, setEmployeeName] = useState([{ value: '', label: '' }]);

//     const [filterValues, setFilterValues] = useState<FilterValues>({

//         subProjectID: '',
//         customerID: '',
//         startDate: '',
//         endDate: '',
//         taskStatus: '',
//     });
//     const [showCalendar, setShowCalendar] = useState(false);
//     const [state, setState] = useState<Range[]>([
//         {
//             startDate: new Date() || null,
//             endDate: new Date() || null,
//             key: 'selection'
//         }
//     ]);
//     useEffect(() => {
//         fetchFilterTables()
//         fetchData()
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
//     const fetchFilterTables = async () => {
//         setLoading(true);
//         const taskStatuses = await getTaskStatus();
//         setProjectStatusArray(taskStatuses)
//         const branch = await getBranches(contextClientID);
//         setBranchArray(branch);
//         setFilterValues({

//             subProjectID: '',
//             customerID: '',
//             startDate: formatDateYYYYMMDD(new Date()),
//             endDate: formatDateYYYYMMDD(new Date()),
//             taskStatus: ''
//         })
//         const projects = await getProjects(contextClientID);
//         let pro: any[] = []
//         for (let i = 0; i < projects.length; i++) {
//             pro.push({
//                 value: projects[i].project_id,
//                 label: projects[i].project_name,
//             })
//         }
//         setProjectName(pro);
//         const subProjects = await getSubProjects(contextClientID);
//         let subPro: any[] = []
//         for (let i = 0; i < subProjects.length; i++) {
//             subPro.push({
//                 value: subProjects[i].subproject_id,
//                 label: subProjects[i].sub_project_name,
//             })
//         }
//         setSubProjectName(subPro);
//         const employee = await getEmployees(contextClientID);
//         let emp: any[] = []
//         for (let i = 0; i < employee.length; i++) {
//             emp.push({
//                 value: employee[i].customer_id,
//                 label: employee[i].emp_id + "  " + employee[i].name,
//             })
//         }
//         setEmployeeName(emp);

//     }
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
//             formData.append("sub_project_id", filterValues.subProjectID);
//             formData.append("customer_id", filterValues.customerID);
//             formData.append("task_status", filterValues.taskStatus);
//             formData.append("start_date", formatDateYYYYMMDD(filterValues.startDate) || formatDateYYYYMMDD(new Date()))
//             formData.append("end_date", formatDateYYYYMMDD(filterValues.endDate) || formatDateYYYYMMDD(new Date()))

//             const res = await fetch(`/api/commonapi/getProjectEmployeeTask`, {
//                 method: "POST",
//                 body: formData,
//             });
//             const response = await res.json();
//             console.log(response);


//             if (response.status == 1) {
//                 setLoading(false);
//                 setTaskData(response.data)

//             } else if (response.status == 0) {
//                 setLoading(false);

//             }

//         } catch (error) {
//             setLoading(false);
//             alert("Exception occured while fetching task data")
//             console.error("Error fetching user data:", error);
//         }

//     }




//     const resetFilter = async () => {

//         window.location.reload();
//         setFilterValues({
//             subProjectID: '',
//             customerID: '',
//             startDate: '',
//             endDate: '',
//             taskStatus: '',
//         });
//         fetchData();
//     }

//     const handleProjectSelectChange = async (values: any) => {

//         setFilterValues((prev) => ({ ...prev, ["subProjectID"]: values.value }));
//     };
//     const handleEmpSelectChange = async (values: any) => {

//         setFilterValues((prev) => ({ ...prev, ["customerID"]: values.value }));
//     };

//     const onFilterSubmit = async () => {
//         console.log(filterValues);
//         fetchData()
//         setLoadingCursor(false)
//     }

//     const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
//     const handleChange = (ranges: RangeKeyDict) => {
//         setState([ranges.selection]);
//         setShowCalendar(false)
//         if (ranges.selection.startDate == ranges.selection.endDate) {
//             setFilterValues((prev) => ({ ...prev, ['startDate']: ranges.selection.startDate }));
//         } else {
//             setFilterValues((prev) => ({ ...prev, ['startDate']: ranges.selection.startDate }));
//             setFilterValues((prev) => ({ ...prev, ['endDate']: ranges.selection.endDate }));
//         }
//     };

//     return (
//         <>
//             <LoadingDialog isLoading={isLoading} />
//             <div className="row">
//                 <div className="col-lg-12">
//                     <div className="filter_whitebox filter_whitebox_open" id="filter_whitebox_open">
//                         <div className="row" style={{ alignItems: "center" }}>


//                             <div className="col-lg-3">

//                                 <div className="form_box mb-2">

//                                     <label htmlFor="formFile" className="form-label">Sub Project Name:</label>

//                                     <div className="form_box mb-3">
//                                         <div className="row d-flex align-items-center">

//                                             <div className="col-lg-12 search_select_element">
//                                                 <Select
//                                                     className="custom-select"
//                                                     classNamePrefix="custom"
//                                                     options={subProjectName}
//                                                     onChange={(selectedOption) =>
//                                                         handleProjectSelectChange(selectedOption)
//                                                     }
//                                                     placeholder="Sub Project"
//                                                     isSearchable
//                                                 />
//                                             </div>
//                                         </div>

//                                     </div>

//                                 </div>
//                             </div>
//                             <div className="col-lg-3">

//                                 <div className="form_box mb-2">

//                                     <label htmlFor="formFile" className="form-label">Employee Name:</label>

//                                     <div className="form_box mb-3">
//                                         <div className="row d-flex align-items-center">

//                                             <div className="col-lg-12 search_select_element">
//                                                 <Select
//                                                     className="custom-select"
//                                                     classNamePrefix="custom"
//                                                     options={employeeName}
//                                                     onChange={(selectedOption) =>
//                                                         handleEmpSelectChange(selectedOption)
//                                                     }
//                                                     placeholder="Search Employee"
//                                                     isSearchable={true}


//                                                 />
//                                             </div>
//                                         </div>

//                                     </div>

//                                 </div>
//                             </div>
//                             <div className="col-lg-3">
//                                 <div className="form_box mb-2">

//                                     <label htmlFor="formFile" className="form-label">Date:</label>
//                                     {/* <input type="date" name="startDate" value={filterValues.startDate} onChange={handleInputChange} /> */}
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={formattedRange}
//                                         readOnly
//                                         onClick={() => setShowCalendar(!showCalendar)}
//                                     />
//                                     {showCalendar && (
//                                         <div style={{ position: 'absolute', zIndex: 1000 }}>
//                                             <DateRange
//                                                 editableDateInputs={true}
//                                                 onChange={handleChange}
//                                                 moveRangeOnFirstSelection={false}
//                                                 ranges={state}
//                                                 maxDate={new Date()}
//                                             />
//                                         </div>)}
//                                 </div>
//                             </div>

//                             <div className="col-lg-3">
//                                 <div className="form_box mb-2 mt-4">

//                                     <a className="red_button" onClick={() => resetFilter()}>Reset</a>&nbsp;
//                                     <a className={`red_button ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), onFilterSubmit() }}>Submit</a>&nbsp;

//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="row mt-5">

//                 <div className="project_grey_box" style={{ backgroundColor: "#fff" }}>
//                     <div className="row list_label mb-4">
//                         <div className="col-lg-12">
//                             <div className="all_project_task_new_mainbox">
//                                 <div className="project_label">Emp_ID</div>
//                                 <div className="project_label">Name</div>
//                                 <div className="project_label">Task Details</div>
//                                 <div className="project_label">Client</div>
//                                 <div className="project_label">Project</div>
//                                 <div className="project_label">Task Type</div>
//                                 <div className="project_label">Task Status</div>
//                                 {/* <div className="label">Project</div> */}
//                                 <div className="project_label">Hours</div>
//                                 <div className="project_label">Minutes</div>
//                             </div>
//                         </div>

//                     </div>

//                     {taskData.map((task, index) => {

//                         return (

//                             <div className="all_project_task" onClick={(e) => { alert("clicked") }} key={index}>
//                                 <div className="label">{task.leap_customer.emp_id}</div>
//                                 <div className="label">{task.leap_customer.name}</div>
//                                 <div className="label">{task.task_details}</div>
//                                 <div className="label">{task.leap_client_project.project_client}</div>
//                                 <div className="label">{task.leap_client_sub_projects.sub_project_name}</div>
//                                 <div className="label">{task.leap_project_task_types.task_type_name}</div>
//                                 <div className="label">{task.leap_task_status.status}</div>
//                                 <div className="label">{task.total_hours}</div>
//                                 <div className="label">{task.total_minutes}</div>

//                             </div>
//                             //             </div>
//                             //     </div>
//                             // </div>

//                         )
//                     })}
//                 </div>





//             </div>
//         </>
//     )
// }

// export default ProjectTaskListComponent


// async function getTaskStatus() {

//     let query = supabase
//         .from('leap_task_status')
//         .select();
//     const { data, error } = await query;
//     if (error) {
//         console.log(error);
//         return [];
//     } else {
//         return data;
//     }
// }



// async function getBranches(clientID: any) {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select()
//         .eq("client_id", clientID);

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getProjects(clientID: any) {

//     let query = supabase
//         .from('leap_client_project')
//         .select()
//         .eq("client_id", clientID);

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getSubProjects(clientID: any) {

//     let query = supabase
//         .from('leap_client_sub_projects')
//         .select()
//         .eq("client_id", clientID);

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getEmployees(clientID: any) {

//     let query = supabase
//         .from('leap_customer')
//         .select()
//         .eq("client_id", clientID);

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }

// const formatDateYYYYMMDD = (date: any, isTime = false) => {
//     if (!date) return '';
//     const parsedDate = moment(date);

//     if (isTime) return parsedDate.format('HH:mm A');

//     return parsedDate.format('YYYY-MM-DD');
// };



//// after swapnil design share



import moment from 'moment';
import React from 'react'
import Select from "react-select";
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'

import { useEffect, useState } from 'react'
import supabase from '../api/supabaseConfig/supabase';
import LoadingDialog from './PageLoader';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'

interface FilterValues {

    subProjectID: any,
    customerID: any,
    startDate: any,
    endDate: any,
    taskStatus: any,
}

const ProjectTaskListComponent = () => {
    const [isLoading, setLoading] = useState(true);
    const [showApproveTaskDialog, setshowApproveTaskDialog] = useState(false);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [projectID, setProjectID] = useState(0);
    const [isSubProjectAdd, setIsSubProjectAdd] = useState(false);
    const { contextClientID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [taskData, setTaskData] = useState<ProjectTaskDataResponseModel[]>([]);
    const [selectedEmp, setSelectedEmployeeName] = useState({ value: '', label: '' });

    const [projectName, setProjectName] = useState([{ value: '', label: '' }]);
    const [subProjectName, setSubProjectName] = useState([{ value: '', label: '' }]);
    const [employeeName, setEmployeeName] = useState([{ value: '', label: '' }]);

    const [filterValues, setFilterValues] = useState<FilterValues>({

        subProjectID: '',
        customerID: '',
        startDate: '',
        endDate: '',
        taskStatus: '',
    });
    const [showCalendar, setShowCalendar] = useState(false);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);
    useEffect(() => {
        fetchFilterTables()
        fetchData()
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
    const fetchFilterTables = async () => {
        setLoading(true);
        const taskStatuses = await getTaskStatus();
        setProjectStatusArray(taskStatuses)
        const branch = await getBranches(contextClientID);
        setBranchArray(branch);
        setFilterValues({

            subProjectID: '',
            customerID: '',
            startDate: formatDateYYYYMMDD(new Date()),
            endDate: formatDateYYYYMMDD(new Date()),
            taskStatus: ''
        })
        const projects = await getProjects(contextClientID);
        let pro: any[] = []
        for (let i = 0; i < projects.length; i++) {
            pro.push({
                value: projects[i].project_id,
                label: projects[i].project_name,
            })
        }
        setProjectName(pro);
        const subProjects = await getSubProjects(contextClientID);
        let subPro: any[] = []
        for (let i = 0; i < subProjects.length; i++) {
            subPro.push({
                value: subProjects[i].subproject_id,
                label: subProjects[i].sub_project_name,
            })
        }
        setSubProjectName(subPro);
        const employee = await getEmployees(contextClientID);
        let emp: any[] = []
        for (let i = 0; i < employee.length; i++) {
            emp.push({
                value: employee[i].customer_id,
                label: employee[i].emp_id + "  " + employee[i].name,
            })
        }
        setEmployeeName(emp);

    }
    const fetchData = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("sub_project_id", filterValues.subProjectID);
            formData.append("customer_id", filterValues.customerID);
            formData.append("task_status", filterValues.taskStatus);
            formData.append("start_date", formatDateYYYYMMDD(filterValues.startDate) || formatDateYYYYMMDD(new Date()))
            formData.append("end_date", formatDateYYYYMMDD(filterValues.endDate) || formatDateYYYYMMDD(new Date()))

            const res = await fetch(`/api/commonapi/getProjectEmployeeTask`, {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);


            if (response.status == 1) {
                setLoading(false);
                setTaskData(response.data)

            } else if (response.status == 0) {
                setLoading(false);

            }

        } catch (error) {
            setLoading(false);
            alert("Exception occured while fetching task data")
            console.error("Error fetching user data:", error);
        }

    }




    const resetFilter = async () => {

        window.location.reload();
        setFilterValues({
            subProjectID: '',
            customerID: '',
            startDate: '',
            endDate: '',
            taskStatus: '',
        });
        fetchData();
    }

    const handleProjectSelectChange = async (values: any) => {

        setFilterValues((prev) => ({ ...prev, ["subProjectID"]: values.value }));
    };
    const handleEmpSelectChange = async (values: any) => {

        setFilterValues((prev) => ({ ...prev, ["customerID"]: values.value }));
    };

    const onFilterSubmit = async () => {
        console.log(filterValues);
        fetchData()
        setLoadingCursor(false)
    }

    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;
    const handleChange = (ranges: RangeKeyDict) => {
        setState([ranges.selection]);
        setShowCalendar(false)
        if (ranges.selection.startDate == ranges.selection.endDate) {
            setFilterValues((prev) => ({ ...prev, ['startDate']: ranges.selection.startDate }));
        } else {
            setFilterValues((prev) => ({ ...prev, ['startDate']: ranges.selection.startDate }));
            setFilterValues((prev) => ({ ...prev, ['endDate']: ranges.selection.endDate }));
        }
    };

    return (
        <>
            <LoadingDialog isLoading={isLoading} />
            <div className="row">
                <div className="col-lg-12">
                    <div className="filter_whitebox filter_whitebox_open" id="filter_whitebox_open">
                        <div className="row" style={{ alignItems: "center" }}>


                            <div className="col-lg-3">

                                <div className="form_box mb-2">

                                    <label htmlFor="formFile" className="form-label">Sub Project Name:</label>

                                    <div className="form_box">
                                        <div className="row d-flex align-items-center">

                                            <div className="col-lg-12 search_select_element">
                                                <Select
                                                    className="custom-select"
                                                    classNamePrefix="custom"
                                                    options={subProjectName}
                                                    onChange={(selectedOption) =>
                                                        handleProjectSelectChange(selectedOption)
                                                    }
                                                    placeholder="Sub Project"
                                                    isSearchable
                                                />
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-3">

                                <div className="form_box mb-2">

                                    <label htmlFor="formFile" className="form-label">Employee Name:</label>

                                    <div className="form_box">
                                        <div className="row d-flex align-items-center">

                                            <div className="col-lg-12 search_select_element">
                                                <Select
                                                    className="custom-select"
                                                    classNamePrefix="custom"
                                                    options={employeeName}
                                                    onChange={(selectedOption) =>
                                                        handleEmpSelectChange(selectedOption)
                                                    }
                                                    placeholder="Search Employee"
                                                    isSearchable={true}


                                                />
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form_box mb-2">

                                    <label htmlFor="formFile" className="form-label">Date:</label>
                                    {/* <input type="date" name="startDate" value={filterValues.startDate} onChange={handleInputChange} /> */}
                                    <input
                                        type="text"
                                        className="form-control calender_icon"
                                        value={formattedRange}
                                        readOnly
                                        onClick={() => setShowCalendar(!showCalendar)}
                                    />
                                    {showCalendar && (
                                        <div style={{ position: 'absolute', zIndex: 1000 }}>
                                            <DateRange
                                                editableDateInputs={true}
                                                onChange={handleChange}
                                                moveRangeOnFirstSelection={false}
                                                ranges={state}
                                                maxDate={new Date()}
                                            />
                                        </div>)}
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="form_box mb-2 mt-2">
                                    <a className={`red_button ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), onFilterSubmit() }}>Submit</a>&nbsp;&nbsp;
                                    <a className="red_button" onClick={() => resetFilter()}>Reset</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-lg-12">
                    <div className="grey_box" style={{ backgroundColor: "#fff" }}>
                        <div className="row text-center list_label mb-4">
                            <div className="col-lg-1">
                                <div className="label">Emp_ID</div>
                            </div>
                            <div className="col-lg-1">
                                <div className="label">Name</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Task Details</div>
                            </div>
                            <div className="col-lg-1">
                                <div className="label">Client</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Project</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Task Type</div>
                            </div>
                            <div className="col-lg-1">
                                <div className="label">Task Status</div>
                            </div>
                            <div className="col-lg-1">
                                <div className="label">Hours</div>
                            </div>
                            <div className="col-lg-1">
                                <div className="label">Minutes</div>
                            </div>

                        </div>

                        {taskData.map((task, index) => {

                            return (
                                <div className="list_listbox" onClick={(e) => { alert("clicked") }} key={index}>
                                    <div className="row text-center">
                                        <div className="col-lg-1">{task.leap_customer.emp_id}</div>
                                        <div className="col-lg-1">{task.leap_customer.name}</div>
                                        <div className="col-lg-2">{task.task_details}</div>
                                        <div className="col-lg-1">{task.leap_client_project && task.leap_client_project.project_client ?task.leap_client_project.project_client:"--"}</div>
                                        <div className="col-lg-2">{task.leap_client_sub_projects && task.leap_client_sub_projects.sub_project_name?task.leap_client_sub_projects.sub_project_name:"--"}</div>
                                        <div className="col-lg-2">{task.leap_project_task_types.task_type_name}</div>
                                        <div className="col-lg-1">{task.leap_task_status.status}</div>
                                        <div className="col-lg-1">{task.total_hours}</div>
                                        <div className="col-lg-1">{task.total_minutes}</div>
                                    </div>
                                </div>
                                

                            )
                        })}
                    </div>
                </div>

            </div>
        </>
    )
}

export default ProjectTaskListComponent


async function getTaskStatus() {

    let query = supabase
        .from('leap_task_status')
        .select();
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
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
async function getProjects(clientID: any) {

    let query = supabase
        .from('leap_client_project')
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
async function getSubProjects(clientID: any) {

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
async function getEmployees(clientID: any) {

    let query = supabase
        .from('leap_customer')
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

const formatDateYYYYMMDD = (date: any, isTime = false) => {
    if (!date) return '';
    const parsedDate = moment(date);

    if (isTime) return parsedDate.format('HH:mm A');

    return parsedDate.format('YYYY-MM-DD');
};