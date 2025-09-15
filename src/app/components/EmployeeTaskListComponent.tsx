// import moment from 'moment';
// import React from 'react'
// import Select from "react-select";
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'

// import { useEffect, useState } from 'react'
// import supabase from '../api/supabaseConfig/supabase';
// import LoadingDialog from './PageLoader';
// import DialogEmployeeTaskData from './dialog_employeeTaskDetails';


// import { DateRange, RangeKeyDict } from 'react-date-range';
// import { Range } from 'react-date-range';
// import { format } from 'date-fns'

// interface FilterValues {
//     branchID: any,
//     projectID: any,
//     subProjectID: any,
//     customerID: any,
//     startDate: any,
//     endDate: any,
//     taskStatus: any,
// }

// const EmployeeTaskListComponent = () => {
//     const [isLoading, setLoading] = useState(true);
//     const [showTaskDetailDialog, setShowTaskDetailDialog] = useState(false);
//     const [loadingCursor, setLoadingCursor] = useState(false);
//     const [projectID, setProjectID] = useState(0);
//     const [isSubProjectAdd, setIsSubProjectAdd] = useState(false);
//     const { contextClientID } = useGlobalContext();
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
//     const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
//     const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
//     const [taskData, setTaskData] = useState<TaskListResponseModel[]>([]);
//     const [showTaskDetailData, setShowTaskDetailData] = useState<TaskListResponseModel>({
//         name: '',
//         emp_id: '',
//         customer_id: 0,
//         leap_customer_project_task: [],
//         leap_client_departments: {
//             department_name: ''
//         },
//         leap_client_designations: {
//             designation_name: ''
//         },
//         leap_client_branch_details: {
//             branch_number: '',
//             leap_client_working_hour_policy: {
//                 full_day: 0,
//                 half_day: 0
//             }
//         }
//     });

//     const [projectName, setProjectName] = useState([{ value: '', label: '' }]);
//     const [subProjectName, setSubProjectName] = useState([{ value: '', label: '' }]);
//     const [employeeName, setEmployeeName] = useState([{ value: '', label: '' }]);
//     const [selectedEmp, setSelectedEmployeeName] = useState({ value: '', label: '' });

//     const [showCalendar, setShowCalendar] = useState(false);
//     const [state, setState] = useState<Range[]>([
//         {
//             startDate: new Date() || null,
//             endDate: new Date() || null,
//             key: 'selection'
//         }
//     ]);

//     const [filterValues, setFilterValues] = useState<FilterValues>({
//         branchID: '',
//         projectID: '',
//         subProjectID: '',
//         customerID: '',
//         startDate: '',
//         endDate: '',
//         taskStatus: '',
//     });

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
//             branchID: '',
//             projectID: '',
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
//         const subProjects = await getSubProjects(contextClientID, null);
//         let subPro: any[] = []
//         for (let i = 0; i < subProjects.length; i++) {
//             subPro.push({
//                 value: subProjects[i].subproject_id,
//                 label: subProjects[i].sub_project_name,
//             })
//         }
//         setSubProjectName(subPro);
//         const employee = await getEmployees(contextClientID, null);
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
//             formData.append("branch_id", filterValues.branchID);
//             formData.append("project_id", filterValues.projectID);
//             formData.append("sub_project_id", filterValues.subProjectID);
//             formData.append("customer_id", filterValues.customerID);
//             formData.append("task_status", filterValues.taskStatus);
//             formData.append("start_date", formatDateYYYYMMDD(filterValues.startDate) || formatDateYYYYMMDD(new Date()))
//             formData.append("end_date", formatDateYYYYMMDD(filterValues.endDate) || formatDateYYYYMMDD(new Date()))

//             const res = await fetch(`/api/commonapi/getEmployeeTask`, {
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
//             branchID: '',
//             projectID: '',
//             subProjectID: '',
//             customerID: '',
//             startDate: '',
//             endDate: '',
//             taskStatus: '',
//         });
//         fetchData();
//     }

//     const handleFilterChange = async (e: any) => {
//         const { name, value } = e.target;

//         setFilterValues((prev) => ({ ...prev, [name]: value }));
//         if (name == "branchID") {
//             setSelectedEmployeeName({ value: '', label: '' });
//             setFilterValues((prev) => ({ ...prev, ["customerID"]: '' }));
//             const subProjects = await getSubProjects(contextClientID, value);
//             let subPro: any[] = []
//             for (let i = 0; i < subProjects.length; i++) {
//                 subPro.push({
//                     value: subProjects[i].subproject_id,
//                     label: subProjects[i].sub_project_name,
//                 })
//             }
//             setSubProjectName(subPro);
//             const employee = await getEmployees(contextClientID, value);
//             let emp: any[] = []
//             for (let i = 0; i < employee.length; i++) {
//                 emp.push({
//                     value: employee[i].customer_id,
//                     label: employee[i].emp_id + "  " + employee[i].name,
//                 })
//             }
//             setEmployeeName(emp);
//         }


//     };
//     const handleEmpSelectChange = async (values: any) => {
//         setSelectedEmployeeName(values);
//         setFilterValues((prev) => ({ ...prev, ["customerID"]: values.value }));
//     };

//     const onFilterSubmit = async () => {
//         console.log(filterValues);
//         fetchData();

//     }
//     const handleInputChange = async (e: any) => {
//         const { name, value } = e.target;
//         // console.log("Form values updated:", formValues);
//         setFilterValues((prev) => ({ ...prev, [name]: value }));
//     }
//     const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;


//     const handleChange = (ranges: RangeKeyDict) => {
//         console.log(ranges);

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
//                                     <label htmlFor="formFile" className="form-label">Branch:</label>
//                                     <select id="branchID" name="branchID" onChange={(e) => handleFilterChange(e)}>
//                                         <option value="">Select</option>
//                                         {branchArray.map((branch, index) => (
//                                             <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
//                                         ))}
//                                     </select>
//                                     {/* {errors.branchID && <span className='error' style={{ color: "red" }}>{errors.branchID}</span>} */}
//                                 </div>
//                             </div>
//                             {/* <div className="col-lg-3">

//                                         <div className="form_box mb-2">

//                                             <label htmlFor="formFile" className="form-label">Project Name:</label>

//                                             <div className="form_box mb-2">
//                                                 <div className="row d-flex align-items-center">
                                                    
//                                                     <div className="col-lg-12 search_select_element">
//                                                         <Select
//                                                             className="custom-select"
//                                                             classNamePrefix="custom"
//                                                             options={projectName}
//                                                             onChange={(selectedOption) =>
//                                                                 handleProjectSelectChange(selectedOption)
//                                                             }
//                                                             placeholder="Search Project"
//                                                             isSearchable
//                                                         />
//                                                     </div>
//                                                 </div>

//                                             </div>

//                                         </div>
//                                     </div>
//                                     <div className="col-lg-3">

//                                         <div className="form_box mb-2">

//                                             <label htmlFor="formFile" className="form-label">Sub Project Name:</label>

//                                             <div className="form_box mb-3">
//                                                 <div className="row d-flex align-items-center">
                                                    
//                                                     <div className="col-lg-12 search_select_element">
//                                                         <Select
//                                                             className="custom-select"
//                                                             classNamePrefix="custom"
//                                                             options={subProjectName}
//                                                             onChange={(selectedOption) =>
//                                                                 handleProjectSelectChange(selectedOption)
//                                                             }
//                                                             placeholder="Sub Project"
//                                                             isSearchable
//                                                         />
//                                                     </div>
//                                                 </div>

//                                             </div>

//                                         </div>
//                                     </div> */}
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
//                                                     value={selectedEmp}
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
//                             <div className="col-lg-3" style={{ textAlign: "start" }}>

//                                 <div className="form_box mb-2 mt-4">

//                                     <a className="red_button" onClick={() => resetFilter()}>Reset</a>&nbsp;
//                                     <a className={`red_button ${loadingCursor ? "loading" : ""}`} onClick={() => { onFilterSubmit() }}>Submit</a>&nbsp;

//                                 </div>

//                             </div>


//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="row mt-5">

//                 <div className="grey_box" style={{ backgroundColor: "#fff" }}>
//                     <div className="row list_label mb-4">
//                         <div className="col-lg-12">
//                             <div className="all_form_new_mainbox_top">
//                                 <div className="label">Emp ID</div>
//                                 <div className="label">Name</div>
//                                 <div className="label">Designation</div>
//                                 <div className="label">Department</div>
//                                 {/* <div className="label">Project</div> */}
//                                 <div className="label">Total Hours</div>
//                                 <div className="label">Total Tasks</div>
//                             </div>
//                         </div>
//                         {/* <div className="col-lg-1 text-center"><div className="label">Emp ID</div></div>
//             <div className="col-lg-2 text-center"><div className="label">Name</div></div>
//             <div className="col-lg-2 text-center"><div className="label">Designation</div></div>
//             <div className="col-lg-2 text-center"><div className="label">Department</div></div>
//             <div className="col-lg-2 text-center"><div className="label">Project</div></div>
//             <div className="col-lg-1 text-center"><div className="label">Total Hours</div></div>
//             <div className="col-lg-1 text-center"><div className="label">Total Tasks</div></div> */}
//                     </div>

//                     {taskData.map((task, index) => {
//                         let totalTaskHours = 0
//                         for (let i = 0; i < task.leap_customer_project_task.length; i++) {
//                             const hoursTominutes = task.leap_customer_project_task[i].total_hours * 60;
//                             totalTaskHours = totalTaskHours + hoursTominutes + task.leap_customer_project_task[i].total_minutes;
//                         }
//                         return (
//                             // <div className="container">
//                             //     <div className="row">
//                             //         <div className="col-lg-12">
//                             <div className="all_form_new_mainbox" onClick={(e) => { setShowTaskDetailDialog(true), setShowTaskDetailData(task) }} key={index}>
//                                 <div className="label">{task.emp_id}</div>
//                                 <div className="label">{task.name}</div>
//                                 <div className="label">{task.leap_client_designations?.designation_name ? task.leap_client_designations?.designation_name : "--"}</div>
//                                 <div className="label">{task.leap_client_departments?.department_name ? task.leap_client_departments?.department_name : "--"}</div>
//                                 <div className="label">{totalTaskHours + " minutes"} </div>

//                                 <div className="label">{task.leap_customer_project_task.length}</div>
//                             </div>
//                             //             </div>
//                             //     </div>
//                             // </div>

//                         )
//                     })}
//                 </div>

//                 {showTaskDetailDialog && <DialogEmployeeTaskData passedData={showTaskDetailData} onClose={() => { setShowTaskDetailDialog(false); }} startDate={filterValues.startDate} endDate={filterValues.endDate} />}
//             </div>
//         </>
//     )
// }

// export default EmployeeTaskListComponent


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
// async function getSubProjects(clientID: any, branchID: any) {

//     let query = supabase
//         .from('leap_client_sub_projects')
//         .select()
//         .eq("client_id", clientID);
//     if (branchID) {
//         query = query.eq("branch_id", branchID)
//     }

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getEmployees(clientID: any, branchID: any) {

//     let query = supabase
//         .from('leap_customer')
//         .select()
//         .eq("client_id", clientID);
//     if (branchID) {
//         query = query.eq("branch_id", branchID)
//     }

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





////// after swapnil share code 

import moment from 'moment';
import React from 'react'
import Select from "react-select";
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'

import { useEffect, useState } from 'react'
import supabase from '../api/supabaseConfig/supabase';
import LoadingDialog from './PageLoader';
import DialogEmployeeTaskData from './dialog_employeeTaskDetails';


import { DateRange, RangeKeyDict } from 'react-date-range';
import { Range } from 'react-date-range';
import { format } from 'date-fns'

interface FilterValues {
    branchID: any,
    projectID: any,
    subProjectID: any,
    customerID: any,
    startDate: any,
    endDate: any,
    taskStatus: any,
}

const EmployeeTaskListComponent = () => {
    const [isLoading, setLoading] = useState(true);
    const [showTaskDetailDialog, setShowTaskDetailDialog] = useState(false);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [projectID, setProjectID] = useState(0);
    const [isSubProjectAdd, setIsSubProjectAdd] = useState(false);
    const { contextClientID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [taskData, setTaskData] = useState<TaskListResponseModel[]>([]);
    const [showTaskDetailData, setShowTaskDetailData] = useState<TaskListResponseModel>({
        name: '',
        emp_id: '',
        customer_id: 0,
        leap_customer_project_task: [],
        leap_client_departments: {
            department_name: ''
        },
        leap_client_designations: {
            designation_name: ''
        },
        leap_client_branch_details: {
            branch_number: '',
            leap_client_working_hour_policy: {
                full_day: 0,
                half_day: 0
            }
        }
    });

    const [projectName, setProjectName] = useState([{ value: '', label: '' }]);
    const [subProjectName, setSubProjectName] = useState([{ value: '', label: '' }]);
    const [employeeName, setEmployeeName] = useState([{ value: '', label: '' }]);
    const [selectedEmp, setSelectedEmployeeName] = useState({ value: '', label: '' });

    const [showCalendar, setShowCalendar] = useState(false);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);

    const [filterValues, setFilterValues] = useState<FilterValues>({
        branchID: '',
        projectID: '',
        subProjectID: '',
        customerID: '',
        startDate: '',
        endDate: '',
        taskStatus: '',
    });

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
            branchID: '',
            projectID: '',
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
        const subProjects = await getSubProjects(contextClientID, null);
        let subPro: any[] = []
        for (let i = 0; i < subProjects.length; i++) {
            subPro.push({
                value: subProjects[i].subproject_id,
                label: subProjects[i].sub_project_name,
            })
        }
        setSubProjectName(subPro);
        const employee = await getEmployees(contextClientID, null);
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
            formData.append("branch_id", filterValues.branchID);
            formData.append("project_id", filterValues.projectID);
            formData.append("sub_project_id", filterValues.subProjectID);
            formData.append("customer_id", filterValues.customerID);
            formData.append("task_status", filterValues.taskStatus);
            formData.append("start_date", formatDateYYYYMMDD(filterValues.startDate) || formatDateYYYYMMDD(new Date()))
            formData.append("end_date", formatDateYYYYMMDD(filterValues.endDate) || formatDateYYYYMMDD(new Date()))

            const res = await fetch(`/api/commonapi/getEmployeeTask`, {
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
            branchID: '',
            projectID: '',
            subProjectID: '',
            customerID: '',
            startDate: '',
            endDate: '',
            taskStatus: '',
        });
        fetchData();
    }

    const handleFilterChange = async (e: any) => {
        const { name, value } = e.target;

        setFilterValues((prev) => ({ ...prev, [name]: value }));
        if (name == "branchID") {
            setSelectedEmployeeName({ value: '', label: '' });
            setFilterValues((prev) => ({ ...prev, ["customerID"]: '' }));
            const subProjects = await getSubProjects(contextClientID, value);
            let subPro: any[] = []
            for (let i = 0; i < subProjects.length; i++) {
                subPro.push({
                    value: subProjects[i].subproject_id,
                    label: subProjects[i].sub_project_name,
                })
            }
            setSubProjectName(subPro);
            const employee = await getEmployees(contextClientID, value);
            let emp: any[] = []
            for (let i = 0; i < employee.length; i++) {
                emp.push({
                    value: employee[i].customer_id,
                    label: employee[i].emp_id + "  " + employee[i].name,
                })
            }
            setEmployeeName(emp);
        }


    };
    const handleEmpSelectChange = async (values: any) => {
        setSelectedEmployeeName(values);
        setFilterValues((prev) => ({ ...prev, ["customerID"]: values.value }));
    };

    const onFilterSubmit = async () => {
        console.log(filterValues);
        fetchData();

    }
    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        // console.log("Form values updated:", formValues);
        setFilterValues((prev) => ({ ...prev, [name]: value }));
    }
    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;


    const handleChange = (ranges: RangeKeyDict) => {
        console.log(ranges);

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
                                    <label htmlFor="formFile" className="form-label">Branch:</label>
                                    <select id="branchID" name="branchID" onChange={(e) => handleFilterChange(e)}>
                                        <option value="">Select</option>
                                        {branchArray.map((branch, index) => (
                                            <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                        ))}
                                    </select>
                                    {/* {errors.branchID && <span className='error' style={{ color: "red" }}>{errors.branchID}</span>} */}
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
                                                    value={selectedEmp}
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
                            <div className="col-lg-3" style={{ textAlign: "start" }}>

                                <div className="form_box mb-2 mt-2">
                                    <a className={`red_button ${loadingCursor ? "loading" : ""}`} onClick={() => { onFilterSubmit() }}>Submit</a>&nbsp;&nbsp;
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
                                    <div className="label">Emp ID</div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="label">Name</div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="label">Designation</div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="label">Department</div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="label">Total Hours</div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="label">Total Tasks</div>
                                </div>                            
                        </div>

                        {taskData.map((task, index) => {
                            let totalTaskHours = 0
                            for (let i = 0; i < task.leap_customer_project_task.length; i++) {
                                const hoursTominutes = task.leap_customer_project_task[i].total_hours * 60;
                                totalTaskHours = totalTaskHours + hoursTominutes + task.leap_customer_project_task[i].total_minutes;
                            }
                            return (
                                <div className="list_listbox" style={{cursor:"pointer"}} onClick={(e) => { setShowTaskDetailDialog(true), setShowTaskDetailData(task) }} key={index}>
                                    <div className="row text-center">
                                        <div className="col-lg-1">{task.emp_id}</div>
                                        <div className="col-lg-3">{task.name}</div>
                                        <div className="col-lg-2">{task.leap_client_designations?.designation_name ? task.leap_client_designations?.designation_name : "--"}</div>
                                        <div className="col-lg-2">{task.leap_client_departments?.department_name ? task.leap_client_departments?.department_name : "--"}</div>
                                        <div className="col-lg-2">{totalTaskHours + " minutes"} </div>
                                        <div className="col-lg-2">{task.leap_customer_project_task.length}</div>
                                    </div>
                                </div>
                                

                            )
                        })}
                    </div>
                </div>
                <div className={showTaskDetailDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                    {showTaskDetailDialog && <DialogEmployeeTaskData passedData={showTaskDetailData} onClose={() => { setShowTaskDetailDialog(false); }} startDate={filterValues.startDate} endDate={filterValues.endDate} />}
                </div>
            </div>
        </>
    )
}

export default EmployeeTaskListComponent


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
async function getSubProjects(clientID: any, branchID: any) {

    let query = supabase
        .from('leap_client_sub_projects')
        .select()
        .eq("client_id", clientID);
    if (branchID) {
        query = query.eq("branch_id", branchID)
    }

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getEmployees(clientID: any, branchID: any) {

    let query = supabase
        .from('leap_customer')
        .select()
        .eq("client_id", clientID);
    if (branchID) {
        query = query.eq("branch_id", branchID)
    }

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