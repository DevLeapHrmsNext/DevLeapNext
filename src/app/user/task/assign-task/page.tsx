// // managers can assign task to employees working under their projects


// 'use client'
// import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
// import LeapHeader from '@/app/components/header'
// import Footer from '@/app/components/footer'
// import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import { useParams, useRouter } from 'next/navigation';
// import { pageURL_userTaskListingPage } from '@/app/pro_utils/stringRoutes'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import { Project, SubProject } from '@/app/models/TaskModel'
// import { CustomerProfile } from '@/app/models/employeeDetailsModel'
// import LeftPannel from '@/app/components/leftPannel'
// import BackButton from '@/app/components/BackButton'
// import { ALERTMSG_addAssetTypeError, deleteDataTypeAsset, ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
// import ShowAlertMessage from '@/app/components/alert'

// interface AssignTaskForm {
//     client_id: string,
//     assigned_to: string,
//     project_id: string,
//     sub_project_id: string,
//     task_type_id: string,
//     task_details: string,
//     task_date: string,
//     task_priority: string,
//     deadline: string,
//     assigned_by: string,
// }

// const AssignLeave: React.FC = () => {
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [taskArray, setTask] = useState<TaskType[]>([]);
//     const [statusArray, setStatus] = useState<TaskStatus[]>([]);
//     const [priorityArray, setPriority] = useState<TaskPriority[]>([]);
//     const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
//     const [projectarray, setProject] = useState<Project[]>([]);
//     const [subProjectarray, setSubProject] = useState<SubProject[]>([]);
//     const [selectedProject, setSelectedProject] = useState<string>("");
//     const [empArray, setEmp] = useState<CustomerProfile[]>([]);
//   const [loadingCursor, setLoadingCursor] = useState(false);

//      const [showAlert,setShowAlert]=useState(false);
//       const [alertForSuccess,setAlertForSuccess]=useState(0);
//       const [alertTitle,setAlertTitle]=useState('');
//       const [alertStartContent,setAlertStartContent]=useState('');
//       const [alertMidContent,setAlertMidContent]=useState('');
//       const [alertEndContent,setAlertEndContent]=useState('');
//       const [alertValue1,setAlertValue1]=useState('');
//       const [alertvalue2,setAlertValue2]=useState('');

//     const handleProjectTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
//         const { name, value} = e.target;
//         setFormValues((prev) => ({ ...prev, [name]: value }));
//         setSelectedProject(value);
//         const subProj = await getSubProject(value);
//         setSubProject(subProj);
//     };

//     const router = useRouter()
//     useEffect(() => {
//         setLoadingCursor(true);
//         const fetchData = async () => {
//             const project = await getProject(contextClientID, contaxtBranchID);
//             setProject(project);
//             const task = await getTaskTypes();
//             setTask(task);
//             const taskStatus = await getStatus();
//             setStatus(taskStatus);
//             const priorityType = await getPriority();
//             setPriority(priorityType);
//             const emp = await getEmployee(contextCustomerID || "4");
//             setEmp(emp);
//             setLoadingCursor(false);
//         };
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
//     }, [])

//     const [formValues, setFormValues] = useState<AssignTaskForm>({
//         client_id: "",
//         assigned_to: "",
//         project_id: "",
//         sub_project_id: "",
//         task_type_id: "",
//         task_details: "",
//         task_date: "",
//         task_priority: "",
//         deadline: "",
//         assigned_by: "",
//     });

//     const handleInputChange = async (e: any) => {
//         const { name, value, type, files } = e.target;
//         setFormValues((prev) => ({ ...prev, [name]: value }));
//     }
//     const formData = new FormData();
//     const [errors, setErrors] = useState<Partial<AssignTaskForm>>({});

//     const validate = () => {
//         const newErrors: Partial<AssignTaskForm> = {};
//         if (!formValues.assigned_to) newErrors.assigned_to = "required";
//         if (!formValues.project_id) newErrors.project_id = "required";
//         if (!formValues.sub_project_id) newErrors.sub_project_id = "required";
//         if (!formValues.task_type_id) newErrors.task_type_id = "required";
//         if (!formValues.task_details) newErrors.task_details = "required";
//         if (!formValues.task_date) newErrors.task_date = "required";
//         if (!formValues.task_priority) newErrors.task_priority = "required";
//         if (!formValues.deadline) newErrors.deadline = "required";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoadingCursor(true);
//     console.log("handle submit called");
//      formData.append("client_id", contextClientID);
//      formData.append("assigned_by", contextCustomerID);
//      formData.append("assigned_to", formValues.assigned_to);
//      formData.append("project_id", formValues.project_id);
//      formData.append("sub_project_id", formValues.sub_project_id);
//      formData.append("task_type_id", formValues.task_type_id);
//      formData.append("task_details", formValues.task_details);
//     //  formData.append("task_date", formValues.task_date);
//      formData.append("task_priority", formValues.task_priority);
//      formData.append("deadline", formValues.deadline);

//     try {
//       const response = await fetch("/api/users/assignTask", {
//           method: "POST",
//           body: formData,
//       });
//       if (response.ok) {
//         setLoadingCursor(false);
//         setShowAlert(true);
//         setAlertTitle("Success")
//         setAlertStartContent("Task assigned Successfully");
//         setAlertForSuccess(1)
//       } else {
//         setLoadingCursor(false);       
//         setShowAlert(true);
//         setAlertTitle("Error")
//         setAlertStartContent("Failed to create task");
//         setAlertForSuccess(2)
//       }
//         } catch (error) {
//         setLoadingCursor(false);
//         setShowAlert(true);
//         console.log("Error adding type:", error);
//         setAlertTitle("Exception");
//         setAlertStartContent(ALERTMSG_exceptionString);
//         setAlertForSuccess(2);
//         }
//     }


//     return (
//         <div className='mainbox'>
//             <header>
//                 <LeapHeader title={createLeaveTitle} />
//             </header>
//             <LeftPannel menuIndex={22} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//                 <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
//                     {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//                         setShowAlert(false)
//                         if (alertForSuccess == 1) {
//                             router.push(pageURL_userTaskListingPage);
//                         }
//                     }} onCloseClicked={function (): void {
//                         setShowAlert(false)
//                     }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//                     <form onSubmit={handleSubmit}>
//                         <div className="container">
//                             <div className="row">
//                                 <div className="col-lg-12">
//                                     <div className="fill_task_mainbox">
//                                         <div className="apply_leave_heading">Assign <span>Tasks</span></div>
//                                         <div className="fill_task_formbox">
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Employee<span className='req_text'>*</span></label>
//                                                 <select id="assigned_to" name="assigned_to" onChange={handleInputChange} className='form-select'>
//                                                     <option value="">Select</option>
//                                                     {empArray.length > 0 ? (
//                                                         empArray.map((type) => (
//                                                             <option value={type.customer_id} key={type.customer_id}>{type.emp_id} : {type.name}</option>

//                                                         ))
//                                                     ) : (
//                                                         <option value="" disabled>Employee does not exists</option>
//                                                     )}

//                                                 </select>
//                                                 {errors.assigned_to && <span className="error" style={{ color: "red" }}>{errors.assigned_to}</span>}
//                                             </div>
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Project Name<span className='req_text'>*</span>  </label>
//                                                 <select id="project_id" name="project_id" onChange={handleProjectTypeChange} className='form-select'>
//                                                     <option value="">Select</option>
//                                                     {projectarray.map((type, index) => (
//                                                         <option value={type.project_id} key={type.project_id}>{type.project_name}</option>
//                                                     ))}
//                                                 </select>
//                                                 {/* {errors.project_id && <span className="error" style={{color: "red"}}>{errors.project_id}</span>} */}
//                                             </div>
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Sub Project Name<span className='req_text'>*</span>  </label>
//                                                 <select id="sub_project_id" name="sub_project_id" onChange={handleInputChange} className='form-select'>
//                                                     <option value="">Select</option>
//                                                     {subProjectarray.length > 0 ? (
//                                                         subProjectarray.map((type, index) => (
//                                                             <option value={type.subproject_id} key={type.subproject_id}>{type.sub_project_name}</option>
//                                                         ))
//                                                     ) : (
//                                                         <option value="" disabled>No Sub project exists for this project</option>
//                                                     )
//                                                     }
//                                                 </select>
//                                                 {errors.sub_project_id && <span className="error" style={{ color: "red" }}>{errors.sub_project_id}</span>}
//                                             </div>
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Task Type<span className='req_text'>*</span>  </label>
//                                                 <select id="task_type_id" name="task_type_id" onChange={handleInputChange} className='form-select'>
//                                                     <option value="">Select</option>
//                                                     {taskArray.map((type, index) => (
//                                                         <option value={type.task_type_id} key={type.task_type_id}>{type.task_type_name}</option>
//                                                     ))}
//                                                 </select>
//                                                 {errors.task_type_id && <span className="error" style={{ color: "red" }}>{errors.task_type_id}</span>}
//                                             </div>
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Deadline<span className='req_text'>*</span>  </label>
//                                                 <input type="date" id="deadline" name="deadline" value={formValues.deadline} onChange={handleInputChange} className='form-control'/>
//                                                 {errors.deadline && <span className="error" style={{ color: "red" }}>{errors.deadline}</span>}
//                                             </div>
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Priority<span className='req_text'>*</span>  </label>
//                                                 <select id="task_priority" name="task_priority" onChange={handleInputChange} className='form-select'>
//                                                     <option value="">Select</option>
//                                                     {priorityArray.map((type, index) => (
//                                                         <option value={type.id} key={type.id}>{type.priority_type}</option>
//                                                     ))}
//                                                 </select>
//                                                 {errors.task_priority && <span className="error" style={{ color: "red" }}>{errors.task_priority}</span>}
//                                             </div>
//                                             <div className="form_new_group">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Task Details<span className='req_text'>*</span>  </label>
//                                                 <input type='text' id="task_details" name="task_details" value={formValues.task_details} onChange={handleInputChange} className='form-control'/>
//                                                 {errors.task_details && <span className="error" style={{ color: "red" }}>{errors.task_details}</span>}
//                                             </div>
//                                             <div className="form_new_group form_new_group_btn">
//                                                 <BackButton isCancelText={true} />
//                                                 <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             }
//             />
//             <div>
//                 <Footer />
//             </div>
//         </div>
//     )
// }

// export default AssignLeave


// async function getProject(client: any, branch: any) {

//     let query = supabase
//         .from('leap_client_project')
//         .select()
//         .eq("client_id", client)
//         .eq("branch_id", branch);


//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

// }

// async function getSubProject(project: any) {

//     let query = supabase
//         .from('leap_client_sub_projects')
//         .select()
//         .eq("project_id", project);


//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

// }
// async function getTaskTypes() {

//     let query = supabase
//         .from('leap_project_task_types')
//         .select()
//     // .eq("asset_status",1);

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

// }
// async function getStatus() {
//     let query = supabase
//         .from('leap_task_status')
//         .select()
//     // .eq("asset_status",1);

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
// }
// async function getPriority() {
//     let query = supabase
//         .from('leap_task_priority_level')
//         .select()
//     // .eq("asset_status",1);

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
// }
// async function getEmployee(managerID: string) {

//     let query = supabase
//         .from('leap_customer')
//         .select()
//         // .eq("branch_id", branchTypeID)
//         .eq("manager_id", managerID)

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

// }

// managers can assign task to employees working under their projects


'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { pageURL_userTaskListingPage } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { Project, SubProject } from '@/app/models/TaskModel'
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import LeftPannel from '@/app/components/leftPannel'
import BackButton from '@/app/components/BackButton'
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

interface AssignTaskForm {
    assigned_to: string,
    // project_id: string,
    sub_project_id: string,
    task_type_id: string,
    task_details: string,
    // task_date: string,
    task_priority: string,
    deadline: string,
}

const AssignTask: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [taskArray, setTask] = useState<TaskType[]>([]);
    const [statusArray, setStatus] = useState<TaskStatus[]>([]);
    const [priorityArray, setPriority] = useState<TaskPriority[]>([]);
    const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
    const [projectarray, setProject] = useState<Project[]>([]);
    const [subProjectarray, setSubProject] = useState<SubProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [empArray, setEmp] = useState<CustomerProfile[]>([]);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    // const handleProjectTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    //     const { name, value} = e.target;
    //     setFormValues((prev) => ({ ...prev, [name]: value }));
    //     setSelectedProject(value);
    //     const subProj = await getSubProject(value);
    //     setSubProject(subProj);
    // };

    const router = useRouter()
    useEffect(() => {
        setLoadingCursor(true);
        const fetchData = async () => {
            const project = await getSubProject(contextClientID);
            setSubProject(project);
            const task = await getTaskTypes();
            setTask(task);
            const taskStatus = await getStatus();
            setStatus(taskStatus);
            const priorityType = await getPriority();
            setPriority(priorityType);
            const emp = await getEmployee(contextCustomerID);
            setEmp(emp);
            setLoadingCursor(false);
        };
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
    }, [])

    const [formValues, setFormValues] = useState<AssignTaskForm>({
        assigned_to: "",
        // project_id: "",
        sub_project_id: "",
        task_type_id: "",
        task_details: "",
        // task_date: "",
        task_priority: "",
        deadline: "",
    });

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }
    // const formData = new FormData();
    const [errors, setErrors] = useState<Partial<AssignTaskForm>>({});

    const validate = () => {
        const newErrors: Partial<AssignTaskForm> = {};
        if (!formValues.assigned_to) newErrors.assigned_to = "required";
        // if (!formValues.project_id) newErrors.project_id = "required";
        if (!formValues.sub_project_id) newErrors.sub_project_id = "required";
        if (!formValues.task_type_id) newErrors.task_type_id = "required";
        if (!formValues.task_details) newErrors.task_details = "required";
        // if (!formValues.task_date) newErrors.task_date = "required";
        if (!formValues.task_priority) newErrors.task_priority = "required";
        if (!formValues.deadline) newErrors.deadline = "required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoadingCursor(true)
        try {
            const response = await fetch("/api/users/assignTask", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "assigned_by": contextCustomerID,
                    "assigned_to": formValues.assigned_to,
                    // "project_id": formValues.project_id,
                    "sub_project_id": formValues.sub_project_id,
                    "task_type_id": formValues.task_type_id,
                    "task_details": formValues.task_details,
                    // "task_date": formValues.task_date,
                    "task_priority": formValues.task_priority,
                    "deadline": formValues.deadline,
                }),
            });
            if (response.ok) {
                setLoadingCursor(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Task assigned Successfully");
                setAlertForSuccess(1)
            } else {
                setLoadingCursor(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to assign task");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoadingCursor(false);
            setShowAlert(true);
            console.log("Error adding type:", error);
            setAlertTitle("Exception");
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
        }
    }

    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={createLeaveTitle} />
            </header>
            <LeftPannel menuIndex={22} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                        if (alertForSuccess == 1) {
                            router.push(pageURL_userTaskListingPage);
                        }
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <form onSubmit={handleSubmit}>
                        <div className='container'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="nw_user_inner_mainbox">
                                        <div className="nw_user_inner_heading_tabbox">
                                            <div className="heading25">
                                                Assign Tasks
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
                                        <div className="nw_user_inner_content_box nw_user_inner_content_form_box" style={{ minHeight: '60vh' }}>
                                            <div className="new_user_inner_form_mainbox">
                                                <div className="new_user_inner_form_box">
                                                    {/* <form onSubmit={handleSubmit}> */}
                                                    <div className="fill_task_formbox">
                                                        <div className="form_new_group">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Employee<span className='req_text'>*</span></label>
                                                            <select id="assigned_to" name="assigned_to" onChange={handleInputChange} className='form-select'>
                                                                <option value="">Select</option>
                                                                {empArray.length > 0 ? (
                                                                    empArray.map((type) => (
                                                                        <option value={type.customer_id} key={type.customer_id}>{type.emp_id} : {type.name}</option>
                                                                    ))
                                                                ) : (
                                                                    <option value="" disabled>Employee does not exists</option>
                                                                )}
                                                            </select>
                                                            {errors.assigned_to && <span className="error" style={{ color: "red" }}>{errors.assigned_to}</span>}
                                                        </div>
                                                        {/* <div className="form_new_group">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Project Name<span className='req_text'>*</span>  </label>
                                                                <select id="project_id" name="project_id" onChange={handleProjectTypeChange} className='form-select'>
                                                                    <option value="">Select</option>
                                                                    {projectarray.map((type, index) => (
                                                                        <option value={type.project_id} key={index}>{type.project_name}</option>
                                                                    ))}
                                                                </select>
                                                                {/* {errors.project_id && <span className="error" style={{color: "red"}}>{errors.project_id}</span>} */}
                                                        {/* </div> */}
                                                        <div className="form_new_group">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Sub Project Name<span className='req_text'>*</span>  </label>
                                                            <select id="sub_project_id" name="sub_project_id" onChange={handleInputChange} className='form-select'>
                                                                <option value="">Select</option>
                                                                {subProjectarray.length > 0 ? (
                                                                    subProjectarray.map((type, index) => (
                                                                        <option value={type.subproject_id} key={index}>{type.sub_project_name}</option>
                                                                    ))
                                                                ) : (
                                                                    <option value="" disabled>No Sub project exists for this project</option>
                                                                )
                                                                }
                                                            </select>
                                                            {errors.sub_project_id && <span className="error" style={{ color: "red" }}>{errors.sub_project_id}</span>}
                                                        </div>
                                                        <div className="form_new_group">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Task Type<span className='req_text'>*</span>  </label>
                                                            <select id="task_type_id" name="task_type_id" onChange={handleInputChange} className='form-select'>
                                                                <option value="">Select</option>
                                                                {taskArray.map((type, index) => (
                                                                    <option value={type.task_type_id} key={index}>{type.task_type_name}</option>
                                                                ))}
                                                            </select>
                                                            {errors.task_type_id && <span className="error" style={{ color: "red" }}>{errors.task_type_id}</span>}
                                                        </div>
                                                        <div className="form_new_group">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Deadline<span className='req_text'>*</span>  </label>
                                                            <input type="date" id="deadline" name="deadline" value={formValues.deadline} onChange={handleInputChange} className='form-control' />
                                                            {errors.deadline && <span className="error" style={{ color: "red" }}>{errors.deadline}</span>}
                                                        </div>
                                                        <div className="form_new_group">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Priority<span className='req_text'>*</span>  </label>
                                                            <select id="task_priority" name="task_priority" onChange={handleInputChange} className='form-select'>
                                                                <option value="">Select</option>
                                                                {priorityArray.map((type, index) => (
                                                                    <option value={type.id} key={index}>{type.priority_type}</option>
                                                                ))}
                                                            </select>
                                                            {errors.task_priority && <span className="error" style={{ color: "red" }}>{errors.task_priority}</span>}
                                                        </div>
                                                        <div className="form_new_group">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Task Details<span className='req_text'>*</span>  </label>
                                                            <input type='text' id="task_details" name="task_details" value={formValues.task_details} onChange={handleInputChange} className='form-control' />
                                                            {errors.task_details && <span className="error" style={{ color: "red" }}>{errors.task_details}</span>}
                                                        </div>
                                                        <div className="form_new_group form_new_group_btn new_leave_formgoup_back_btn">
                                                            <input type='submit' value="Submit" className="red_button"/>
                                                            <BackButton isCancelText={true} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="new_user_inner_img_box">
                                                    <div className="new_user_inner_img_heading">
                                                        NEW TASK <br /> SUBMISSION
                                                    </div>
                                                    <div className="new_user_inner_img">
                                                        <img src={staticIconsBaseURL + "/images/user/task-form-image.svg"} alt="Task image" className="img-fluid" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }
            />
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default AssignTask




async function getSubProject(client: any) {

    let query = supabase
        .from('leap_client_sub_projects')
        .select()
        .eq("client_id", client);
    // .eq("project_manager_id", customerID);


    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getTaskTypes() {

    let query = supabase
        .from('leap_project_task_types')
        .select()
    // .eq("asset_status",1);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getStatus() {
    let query = supabase
        .from('leap_task_status')
        .select()
    // .eq("asset_status",1);

    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}
async function getPriority() {
    let query = supabase
        .from('leap_task_priority_level')
        .select()
    // .eq("asset_status",1);

    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}
async function getEmployee(managerID: string) {

    let query = supabase
        .from('leap_customer')
        .select()
        // .eq("branch_id", branchTypeID)
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

