// Leave type update dialog called from company leave type list

'use client'
import React, { useEffect, useRef, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import Select from "react-select";
import LoadingDialog from './PageLoader';
import moment from 'moment';
import { FaPen } from 'react-icons/fa';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';


interface interfaceFormData {
    projectName: string,
    mainprojectID: string,
    clientName: string,
    projectTypeID: any,
    managerID: any,
    teamLeadID: any,
    branchID: any,
    departmentID: any,
    start_date: any,
    end_date: any,
    project_details: any,
    project_status: any,
    colorCode: any,
    setDeleted: any,
    logoURL: any,
    logo: File | null,

}
const DialogUpdateCompanyProject = ({ update_project_id, isSubProject, onClose, }: { update_project_id: any, isSubProject: boolean, onClose: () => void, }) => {
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [isProjectDeleted, setIsDeleted] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [formValues, setFormValues] = useState<interfaceFormData>({
        projectName: "",
        mainprojectID: "",
        clientName: "",
        projectTypeID: '',
        managerID: '',
        teamLeadID: '',
        branchID: '',
        departmentID: '',
        start_date: '',
        end_date: '',
        project_details: '',
        project_status: '',
        colorCode: '',
        setDeleted: '',
        logo: null,
        logoURL: '',

    });

    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [projectTypesArray, setProjectTypesArray] = useState<LeapProjectTypeModel[]>([]);
    const [projectTechStackArray, setProjectTechStackArray] = useState<LeapProjectTechStacksModel[]>([]);
    const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
    const [managerArray, setManagerArray] = useState([{ value: '', label: '' }]);
    const [manager, setManager] = useState({ value: '', label: '' });
    const [teamLeadArray, setTeamLeadArray] = useState([{ value: '', label: '' }]);
    const [teamLead, setTeamLead] = useState({ value: '', label: '' });
    const [selectedTechStacksArray, setSelectedTechStacksArray] = useState<any[]>([]); // ✅ Explicit type
    const [companyProject, setCompanyProject] = useState<CompanySingleProjectModel[]>([]);
    const [companySubProject, setCompanySubProjects] = useState<CompanySingleSubProjectModel[]>([]);
    const [departmentArray, setDepartmentsArray] = useState<DepartmentTableModel[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageURL, setImageURL] = useState<string>();
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
            setLoading(true)
            const branch = await getBranches(contextClientID);
            setBranchArray(branch);
            const projectTypes = await getProjectsTypes();
            setProjectTypesArray(projectTypes);

            const techStacks = await getProjectsTechStacks();
            setProjectTechStackArray(techStacks);
            const pro_status = await getStatuses();
            setProjectStatusArray(pro_status);
            const depart = await getDepartments();
            setDepartmentsArray(depart);
            // if (isSubProject) {
            //     const depart = await getDepartments();
            //     setDepartmentsArray(depart);
            //     const projectData = await getSubProjectData(update_project_id);
            //     setCompanySubProjects(projectData)
            //     if (projectData.length > 0) {
            //         setFormValues(
            //             {
            //                 projectName: projectData[0].sub_project_name,
            //                 mainprojectID: projectData[0].project_id + '',
            //                 clientName: '',
            //                 projectTypeID: projectData[0].project_type_id,
            //                 managerID: projectData[0].project_manager_id,
            //                 teamLeadID: '',
            //                 branchID: projectData[0].branch_id,
            //                 departmentID: projectData[0].department_id,
            //                 start_date: formatDateYYYYMMDD(projectData[0].start_date),
            //                 end_date: formatDateYYYYMMDD(projectData[0].end_date),
            //                 project_details: projectData[0].project_details,
            //                 project_status: projectData[0].sub_project_status,
            //                 colorCode: '',
            //                 setDeleted: projectData[0].is_deleted,
            //                 logo: null,
            //                 logoURL: '',
            //             }

            //         )
            //         setIsDeleted(projectData[0].is_deleted)

            //         setSelectedTechStacksArray(projectData[0].tech_stacks)
            //         const managers = await getManagers(contextClientID, projectData[0].branch_id);
            //         let extractManagers: any[] = []
            //         for (let i = 0; i < managers.length; i++) {

            //             extractManagers.push({
            //                 value: managers[i].customer_id,
            //                 label: managers[i].emp_id + "  " + managers[i].name,
            //             })
            //         }
            //         setManagerArray(extractManagers);
            //         const teamLeads = await getTeamLeads(contextClientID, projectData[0].branch_id);
            //         let extractTL: any[] = []
            //         for (let i = 0; i < teamLeads.length; i++) {

            //             extractTL.push({
            //                 value: teamLeads[i].customer_id,
            //                 label: teamLeads[i].emp_id + "  " + teamLeads[i].name,
            //             })
            //         }
            //         setTeamLeadArray(extractTL)
            //         for (let i = 0; i < extractManagers.length; i++) {
            //             if (extractManagers[i].value == projectData[0].project_manager_id) {
            //                 setManager({ value: extractManagers[i].value, label: extractManagers[i].label });

            //             }
            //         }
            //         for (let j = 0; j < extractTL.length; j++) {
            //             if (extractTL[j].value == projectData[0].team_lead_id) {
            //                 setTeamLead({ value: extractTL[j].value, label: extractTL[j].label })
            //             }

            //         }
            //     }
            // } else {
            const projectData = await getProjectData(update_project_id);
            setCompanyProject(projectData)
            console.log(projectData);
            
            if (projectData.length > 0) {
                setFormValues(
                    {
                        projectName: projectData[0].project_name,
                        mainprojectID: projectData[0].project_id + '',
                        clientName: projectData[0].project_client,
                        projectTypeID: projectData[0].project_type_id,
                        managerID: projectData[0].project_manager_id,
                        teamLeadID: projectData[0].team_lead_id,
                        branchID: projectData[0].branch_id,
                        departmentID: projectData[0].leap_client_sub_projects[0].department_id,
                        start_date: formatDateYYYYMMDD(projectData[0].leap_client_sub_projects[0].start_date),
                        end_date: formatDateYYYYMMDD(projectData[0].leap_client_sub_projects[0].start_date),
                        project_details: projectData[0].project_details,
                        project_status: projectData[0].project_status,
                        colorCode: projectData[0].project_color_code,
                        setDeleted: projectData[0].is_deleted,
                        logo: null,
                        logoURL: projectData[0].project_logo
                    }

                )
                // const logoURl=projectData[0].project_logo.sub+'';
                // const firstSlashIndex = logoURl.indexOf('/');

                // setLogourlImagePath(logoURl.substring(firstSlashIndex))
                // alert(logoURl.substring(firstSlashIndex))
                setIsDeleted(projectData[0].is_deleted)
                const managers = await getManagers(contextClientID, projectData[0].branch_id);
                let extractManagers: any[] = []
                for (let i = 0; i < managers.length; i++) {

                    extractManagers.push({
                        value: managers[i].customer_id,
                        label: managers[i].emp_id + "  " + managers[i].name,
                    })
                }
                setManagerArray(extractManagers);
                // const teamLeads = await getTeamLeads(contextClientID, projectData[0].branch_id);
                // let extractTL: any[] = []
                // for (let i = 0; i < teamLeads.length; i++) {

                //     extractTL.push({
                //         value: teamLeads[i].customer_id,
                //         label: teamLeads[i].emp_id + "  " + teamLeads[i].name,
                //     })
                // }
                // setTeamLeadArray(extractTL)
                for (let i = 0; i < extractManagers.length; i++) {
                    if (extractManagers[i].value == projectData[0].project_manager_id) {
                        setManager({ value: extractManagers[i].value, label: extractManagers[i].label });

                    }
                }
                // for (let j = 0; j < extractTL.length; j++) {
                //     if (extractTL[j].value == projectData[0].team_lead_id) {
                //         setTeamLead({ value: extractTL[j].value, label: extractTL[j].label })
                //     }

                // }
                // }
            }


            setLoading(false);

        }
        fetchData();

    }, []);

    const handleInputChange = async (e: any) => {

        const { name, type, checked, value } = e.target;

        if (name == "setDeleted") {
            console.log("checked values=================", value);
            if (formValues.setDeleted) {
                setFormValues((prev) => ({
                    ...prev,
                    ["setDeleted"]: false,
                }));
            } else {
                setFormValues((prev) => ({
                    ...prev,
                    ["setDeleted"]: true,
                }));
            }

        }
        else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }

        if (name == "branchID") {
            if (formValues.managerID != value) {
                setManager({ value: '', label: '' });
                setTeamLead({ value: '', label: '' });

                const managers = await getManagers(contextClientID, value);
                let extractManagers: any[] = []
                for (let i = 0; i < managers.length; i++) {

                    extractManagers.push({
                        value: managers[i].customer_id,
                        label: managers[i].emp_id + "  " + managers[i].name,
                    })
                }
                setManagerArray(extractManagers);
                const teamLeads = await getTeamLeads(contextClientID, value);
                let extractTL: any[] = []
                for (let i = 0; i < teamLeads.length; i++) {

                    extractTL.push({
                        value: teamLeads[i].customer_id,
                        label: teamLeads[i].emp_id + "  " + teamLeads[i].name,
                    })
                }
                setTeamLeadArray(extractTL)
            }
        }

    };
    const [errors, setErrors] = useState<Partial<interfaceFormData>>({});

    const validate = () => {
        const newErrors: Partial<interfaceFormData> = {};
        if (!formValues.projectName) newErrors.projectName = "required";

        if (isSubProject && !formValues.clientName) newErrors.clientName = "required";
        if (!formValues.projectTypeID) newErrors.projectTypeID = "required";
        if (!formValues.branchID) newErrors.branchID = "required";
        if (!formValues.managerID) newErrors.managerID = "required";

        if (isSubProject && !formValues.teamLeadID) newErrors.teamLeadID = "required";


        if (isSubProject && !formValues.start_date) newErrors.start_date = "required";
        if (isSubProject && !formValues.end_date) newErrors.end_date = "required";

        if (isSubProject && !formValues.project_details) newErrors.project_details = "required";
        // if (!selectedTechStacksArray) newErrors.project_details = "required";



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", formValues.branchID);
        formData.append("isSubProject", isSubProject + '');
        formData.append("project_id", formValues.mainprojectID);
        formData.append("project_name", formValues.projectName);
        formData.append("clientName", formValues.clientName);
        formData.append("projectTypeID", formValues.projectTypeID);
        formData.append("managerID", formValues.managerID);
        formData.append("teamLeadID", formValues.teamLeadID);
        formData.append("project_details", formValues.project_details);
        formData.append("tech_stacks", selectedTechStacksArray + '');
        formData.append("start_date", formValues.start_date);
        formData.append("end_date", formValues.end_date);
        formData.append("project_status", formValues.project_status);
        formData.append("update_project_id", update_project_id);
        formData.append("is_deleted", formValues.setDeleted);
        if (formValues.logo) {
            formData.append("file", formValues.logo);
        }
        formData.append("project_color_code", formValues.colorCode);
        console.log(formData);

        try {
            const response = await fetch("/api/clientAdmin/project/update_project", {
                method: "POST",
                body: formData,
            });
            const res = await response.json();

            if (response.ok && res.status == 1) {
                setLoading(false)
                onClose();
            } else {
                setLoading(false)
                alert("Failed to submit form.");
            }
        } catch (e) {
            setLoading(false)
            console.log(e);
            alert("Somthing went wrong! Please try again.")

        }
    }
    const handleManagerChange = async (values: any) => {
        setManager(values);
        setFormValues((prev) => ({ ...prev, ["managerID"]: values.value }));

    };
    const handleTeamLeadChange = async (values: any) => {
        setTeamLead(values);
        setFormValues((prev) => ({ ...prev, ["teamLeadID"]: values.value }));

    };
    const handleCheckboxChange = (value: any) => {
        let updatedValues = selectedTechStacksArray.includes(value)
            ? selectedTechStacksArray.filter((item) => item !== value)
            : [...selectedTechStacksArray, value];
        setSelectedTechStacksArray(updatedValues);
    };
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormValues((prev) => ({ ...prev, ["logo"]: file }));

            const newURL = URL.createObjectURL(file);
            setImageURL(newURL);
        }
    };


    return (
        <div >
            <LoadingDialog isLoading={isLoading} />
            <div style={{ textAlign: "left" }}>
                {/* <div className="row">
                    <div className="col-lg-12" style={{ textAlign: "right" }}>
                        <img src="/images/close.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
                            onClick={onClose} />
                    </div>
                </div> */}
                <div className='rightpoup_close' onClick={() => onClose()}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-3 inner_heading25">
                        Update Project
                    </div>
                </div>
                <div className="row">
                    {isSubProject && <div className='col-lg-4 mb-3'>
                        <div className="com_project_logobox">
                            <div onClick={handleIconClick} className='com_project_logo'>
                                <img src={staticIconsBaseURL + "/images/edit_round_black.png"} className="img-fluid edit-icon" style={{ width: "25px", paddingBottom: "0px", alignItems: "center", marginRight: '10px', cursor: "pointer" }} />
                            </div>
                            <a href={`${getImageApiURL}/uploads/${formValues.logoURL}`} download className='com_project_edit'>
                                {imageURL ? <img src={`${imageURL}`} className="img-fluid" style={{ borderRadius: "10px" }} /> :
                                    <img src={`${getImageApiURL}/uploads/${formValues.logoURL}`} className="img-fluid" />
                                }
                            </a>
                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                    </div>}
                    {/* <div className="col-lg-11 mb-4 inner_heading25">
                        {formValues.projectName}
                    </div>
                    <div className="col-lg-1" style={{ textAlign: "right" }}>
                        <img src={staticIconsBaseURL + "/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", cursor: "pointer", padding: "10px 0 0 0", alignItems: "right" }}
                            onClick={onClose} />
                    </div> */}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Name<span className="text-red-500">*</span>:  </label>
                                <input type="text" className="form-control" value={formValues.projectName} name="projectName" onChange={(e) => setFormValues((prev) => ({ ...prev, ['projectName']: e.target.value }))} id="leave_name" placeholder="Enter Project name" />
                                {errors.projectName && <span className="error" style={{ color: "red" }}>{errors.projectName}</span>}
                            </div>
                        </div>
                        {isSubProject && <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Client Name<span className="text-red-500">*</span>:  </label>
                                <input type="text" className="form-control" value={formValues.clientName} name="clientName" onChange={(e) => setFormValues((prev) => ({ ...prev, ['clientName']: e.target.value }))} id="leave_name" placeholder="Enter client name" />
                                {errors.clientName && <span className="error" style={{ color: "red" }}>{errors.clientName}</span>}
                            </div>
                        </div>}
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Project Type<span className="text-red-500">*</span>:  </label>
                                <select id="projectTypeID" name="projectTypeID" value={formValues.projectTypeID} onChange={(e) => setFormValues((prev) => ({ ...prev, ['projectTypeID']: e.target.value }))}>
                                    <option value="">Select</option>

                                    {projectTypesArray.map((type) => (
                                        <option value={type.id} key={type.id}>{type.project_type}</option>
                                    ))}
                                </select>
                                {errors.projectTypeID && <span className="error" style={{ color: "red" }}>{errors.projectTypeID}</span>}
                            </div>
                        </div>



                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch<span className="text-red-500">*</span>:  </label>
                                <select id="branchID" name="branchID" value={formValues.branchID} onChange={(e) => handleInputChange(e)}>
                                    <option value="">Select</option>
                                    {branchArray.map((branch) => (
                                        <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                    ))}
                                </select>
                                {errors.branchID && <span className="error" style={{ color: "red" }}>{errors.branchID}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Manager<span className="text-red-500">*</span>:  </label>
                                <Select
                                    className="custom-select"
                                    classNamePrefix="custom"
                                    options={managerArray}
                                    value={manager}
                                    onChange={(selectedOption) =>
                                        handleManagerChange(selectedOption)
                                    }
                                    placeholder="Search Manager"
                                    isSearchable
                                />
                                {errors.managerID && <span className="error" style={{ color: "red" }}>{errors.managerID}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* {!isSubProject ?
                                <div className="form_box mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Team Lead<span className="text-red-500">*</span>: </label>
                                    <Select
                                        className="custom-select"
                                        classNamePrefix="custom"
                                        options={teamLeadArray}
                                        value={teamLead}
                                        onChange={(selectedOption) =>
                                            handleTeamLeadChange(selectedOption)
                                        }
                                        placeholder="Search Team Lead"
                                        isSearchable
                                    />
                                    {errors.teamLeadID && <span className="error" style={{ color: "red" }}>{errors.teamLeadID}</span>}
                                </div> : */}
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Department : </label>
                                <select id="departmentID" name="departmentID" value={formValues.departmentID} onChange={(e) => handleInputChange(e)}>
                                    <option value="">Select</option>
                                    {departmentArray.map((department) => (
                                        <option value={department.department_id} key={department.department_id}>{department.department_name}</option>
                                    ))}
                                </select>
                                {errors.teamLeadID && <span className="error" style={{ color: "red" }}>{errors.teamLeadID}</span>}
                            </div>
                            {/* } */}
                        </div>


                        {/* {!isSubProject && <div className="col-md-6">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Logo:  </label>
                                <input type="file" accept="image/*" className="upload_document" name="logo" id="logo" onChange={(e) => setFormValues((prev) => ({ ...prev, ['logo']: e.target.files![0] }))} />
                            </div>
                        </div>} */}
                        {isSubProject &&
                            <div className="col-md-6">
                                <div className="form_box mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Color Code:  </label>
                                    <input type="text" id="colorCode" name="colorCode" value={formValues.colorCode} onChange={handleInputChange} />
                                </div>
                            </div>}
                        {isSubProject &&
                            <div className="col-md-6">
                                <div className="form_box mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Start Date:  </label>
                                    <input type="date" id="start_date" name="start_date" value={formValues.start_date} onChange={handleInputChange} />
                                    {/* {errors.logo && <span className="error" style={{ color: "red" }}>{errors.logo}</span>} */}
                                </div>
                            </div>


                        }
                        {isSubProject && <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >End Date:  </label>
                                <input type="date" id="end_date" name="end_date" value={formValues.end_date} onChange={handleInputChange} />
                                {/* {errors.end_date && <span className="error" style={{ color: "red" }}>{errors.end_date}</span>} */}
                            </div>
                        </div>}
                        {isProjectDeleted &&
                            <div className="col-md-6">
                                <div className="form_box mb-3">

                                    <label htmlFor="formFile" className="form-label">Undo Deleted: {formValues.setDeleted}</label>
                                    <label className="switch" style={{ maxWidth: "23%" }}>
                                        <input type="checkbox" name="setDeleted" checked={formValues.setDeleted} onChange={(e) => handleInputChange(e)} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                        }





                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Status:<span className="text-red-500">*</span>:  </label>
                                <select id="project_status" name="project_status" value={formValues.project_status} onChange={(e) => handleInputChange(e)}>
                                    <option value="">Select</option>
                                    {projectStatusArray.map((status) => (
                                        <option value={status.project_status_id} key={status.project_status_id}>{status.project_status_name}</option>
                                    ))}
                                </select>
                                {errors.project_status && <span className="error" style={{ color: "red" }}>{errors.project_status}</span>}
                            </div>
                        </div>

                        {isSubProject && <div className="col-md-12">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Details:<span className="text-red-500">*</span>:  </label>
                                <textarea className='form-control' style={{ fontSize: "13px", minHeight: "50px", minWidth: '100%' }} id="project_details" name="project_details" value={formValues.project_details} onChange={handleInputChange}></textarea>
                                {errors.project_details && <span className="error" style={{ color: "red" }}>{errors.project_details}</span>}
                            </div>
                        </div>}


                    </div>

                    {isSubProject && <div className='row'>
                        <label htmlFor="exampleFormControlInput1" className="form-label" >Tech Stacks<span className="text-red-500">*</span>:  </label>

                    </div>}
                    {isSubProject &&

                        <div className="row mb-2">
                            <div className="col-md-12 techstack_listing">
                                <div style={{ maxHeight: "100px", overflowY: "scroll", scrollbarColor: "rgb(212, 170, 112) rgb(228, 228, 228)", scrollbarWidth: "thin" }}>
                                    {projectTechStackArray.map((option) => (

                                        <label key={option.id} className="flex items-center border rounded-md" style={{ cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                value={option.id}
                                                checked={selectedTechStacksArray.includes(option.id)}
                                                onChange={() => handleCheckboxChange(option.id)}
                                                className="h-5 w-5 accent-blue-500"
                                            />
                                            <span className="text-sm mr-2" style={{ padding: "5px" }}>{option.tech_name}</span>
                                        </label>

                                    ))}
                                </div>
                            </div>
                        </div>
                    }


                    <div className="row mb-5">
                        <div className="col-lg-12 ">
                            <input type='submit' value="Update" className="red_button" />
                        </div>

                    </div>
                </form>
                {showResponseMessage && <div className="row md-5"><label>Project Updated Successfully</label></div>}
            </div>
        </div>
    )
}

export default DialogUpdateCompanyProject

async function getProjectsTechStacks() {

    let query = supabase
        .from('leap_projects_tech_stack')
        .select("id,tech_name")
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
async function getDepartments() {

    let query = supabase
        .from('leap_client_departments')
        .select();


    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getProjectsTypes() {

    let query = supabase
        .from('leap_project_types')
        .select("id,project_type")
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

async function getManagers(client_id: any, branch_id: any) {

    let query = supabase
        .from('leap_customer')
        .select("name,emp_id,customer_id")
        .eq("client_id", client_id)
        .eq("branch_id", branch_id)
        .eq("user_role", 4)
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

async function getTeamLeads(client_id: any, branch_id: any) {

    let query = supabase
        .from('leap_customer')
        .select("name,emp_id,customer_id")
        .eq("client_id", client_id).eq("branch_id", branch_id).eq("user_role", 9)
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

async function getStatuses() {

    let query = supabase
        .from('leap_project_status')
        .select('project_status_id,project_status_name,color_codes')

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



async function getSubProjectData(sub_projectID: any) {

    let query = supabase
        .from('leap_client_sub_projects')
        .select()
        .eq("subproject_id", sub_projectID);


    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}
async function getProjectData(projectID: any) {

    let query = supabase
        .from('leap_client_project')
        .select('*,leap_client_sub_projects(*)')
        .eq("project_id", projectID);


    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {

        return data;
    }
}