// Leave type update dialog called from company leave type list

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import Select from "react-select";
import LoadingDialog from './PageLoader';
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';


interface interfaceFormData {
    projectName: string,
    clientName: string,
    projectTypeID: any,
    managerID: any,
    teamLeadID: any,
    branchID: any,
    departmentID: any,
    start_date: any,
    end_date: any,
    project_details: any,
    colorCode: any,
    logo: File | null,

}
const DialogAddCompanyProject = ({ projectID, projectName, isSubProject, onClose, }: { projectID: any, projectName: any, isSubProject: boolean, onClose: () => void, }) => {
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [formValues, setFormValues] = useState<interfaceFormData>({
        projectName: "",
        clientName: "",
        projectTypeID: '',
        managerID: '',
        teamLeadID: '',
        branchID: '',
        departmentID: '',
        start_date: '',
        end_date: '',
        project_details: '',
        colorCode: '',
        logo: null

    });

    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [projectTypesArray, setProjectTypesArray] = useState<LeapProjectTypeModel[]>([]);
    const [projectTechStackArray, setProjectTechStackArray] = useState<LeapProjectTechStacksModel[]>([]);
    const [departmentArray, setDepartmentsArray] = useState<DepartmentTableModel[]>([]);
    const [managerArray, setManagerArray] = useState([{ value: '', label: '' }]);
    const [manager, setManager] = useState({ value: '', label: '' });
    const [teamLeadArray, setTeamLeadArray] = useState([{ value: '', label: '' }]);
    const [teamLead, setTeamLead] = useState({ value: '', label: '' });
    const [selectedTechStacksArray, setSelectedTechStacksArray] = useState<any[]>([]); // ✅ Explicit type

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
            const branch = await getBranches(contextClientID);
            setBranchArray(branch);
            const projectTypes = await getProjectsTypes();
            setProjectTypesArray(projectTypes);
            if(isSubProject){
            const depart = await getDepartments();
            setDepartmentsArray(depart);
            }
            const techStacks = await getProjectsTechStacks();
            setProjectTechStackArray(techStacks);
            setLoading(false);

        }
        fetchData();

    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
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
        if (!formValues.clientName) newErrors.clientName = "required";
        if (!formValues.projectTypeID) newErrors.projectTypeID = "required";
        if (!formValues.branchID) newErrors.branchID = "required";
        if (!formValues.managerID) newErrors.managerID = "required";
       
        // if (!isSubProject && !formValues.teamLeadID) newErrors.teamLeadID = "required";
        
        
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
        formData.append("project_id", projectID);
        formData.append("project_name", formValues.projectName);
        formData.append("clientName", formValues.clientName);
        formData.append("projectTypeID", formValues.projectTypeID);
        formData.append("managerID", formValues.managerID);
        formData.append("teamLeadID", formValues.teamLeadID);
        formData.append("departmentID", formValues.departmentID);
        formData.append("project_details", formValues.project_details);
        formData.append("tech_stacks", selectedTechStacksArray + '');
        formData.append("start_date", formValues.start_date);
        formData.append("end_date", formValues.end_date);
        if (formValues.logo) {
            formData.append("file", formValues.logo);
        }
        formData.append("project_color_code", formValues.colorCode);
        console.log(formData);

        try {
            const response = await fetch("/api/clientAdmin/project/add_project_sub_project", {
                method: "POST",
                body: formData,
            });
            const res = await response.json();

            if (response.ok && res.status == 1) {
                setLoading(false)
                onClose();
            } else {
                setLoading(false)
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to add project");
                setAlertForSuccess(2)
            }
        } catch (e) {
            setLoading(false)
            console.log(e);
            alert("Somthing went wrong! Please try again.")
            setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2)

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

    return (
        <div className="">
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)

                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className="" style={{ textAlign: "left"}}>
            
            <div className='rightpoup_close' onClick={onClose}>
                            <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                        </div>
                        <div className="row">
                            <div className="col-lg-12 mb-3 inner_heading25">Add Project
                            {/* {isSubProject ? `Add Sub Project in ${projectName}` : "Add Project"} */}
                            </div>
                        </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Project Name<span className='req_text'>*</span> :</label>
                                {/* {isSubProject ? "Sub Project Name" : "Project Name:"}  </label> */}
                                <input type="text" className="form-control" value={formValues.projectName} name="projectName" onChange={(e) => setFormValues((prev) => ({ ...prev, ['projectName']: e.target.value }))} id="leave_name" placeholder="Enter Project name" />
                                {errors.projectName && <span className="error" style={{ color: "red" }}>{errors.projectName}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Client Name<span className='req_text'>*</span> :  </label>
                                <input type="text" className="form-control" value={formValues.clientName} name="clientName" onChange={(e) => setFormValues((prev) => ({ ...prev, ['clientName']: e.target.value }))} id="leave_name" placeholder="Enter client name" />
                                {errors.clientName && <span className="error" style={{ color: "red" }}>{errors.clientName}</span>}
                            </div>
                        </div>
                        
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Project Type<span className='req_text'>*</span> :  </label>
                                <select id="projectTypeID" name="projectTypeID" value={formValues.projectTypeID} onChange={(e) => setFormValues((prev) => ({ ...prev, ['projectTypeID']: e.target.value }))}>
                                    <option value="">Select</option>

                                    {projectTypesArray.map((type) => (
                                        <option value={type.id} key={type.id}>{type.project_type}</option>
                                    ))}
                                </select>
                                {errors.projectTypeID && <span className="error" style={{ color: "red" }}>{errors.projectTypeID}</span>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch<span className='req_text'>*</span> :  </label>
                                <select id="branchID" name="branchID" value={formValues.branchID} onChange={(e) => handleInputChange(e)}>
                                    <option value="">Select</option>
                                    {branchArray.map((branch) => (
                                        <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                    ))}
                                </select>
                                {errors.branchID && <span className="error" style={{ color: "red" }}>{errors.branchID}</span>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Manager<span className='req_text'>*</span> :  </label>
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
                      
                        
                        <div className="col-md-4">
                            {!isSubProject ?
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Team Lead<span className='req_text'>*</span> : </label>
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
                            </div>:
                            <div className="form_box mb-2">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Department<span className='req_text'>*</span> : </label>
                            <select id="departmentID" name="departmentID" value={formValues.departmentID} onChange={(e) => handleInputChange(e)}>
                                    <option value="">Select</option>
                                    {departmentArray.map((department) => (
                                        <option value={department.department_id} key={department.department_id}>{department.department_name}</option>
                                    ))}
                                </select>
                            {errors.teamLeadID && <span className="error" style={{ color: "red" }}>{errors.teamLeadID}</span>}
                        </div>
                            }
                        </div>


                        {isSubProject &&

                            <div className="col-md-4">
                                <div className="form_box mb-2">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Logo<span className='req_text'>*</span> :  </label>
                                    <input type="file" accept="image/*" className="upload_document" name="logo" id="logo" onChange={(e) => setFormValues((prev) => ({ ...prev, ['logo']: e.target.files![0] }))} />
                                </div>
                            </div>
                        }
                        {isSubProject &&
                            <div className="col-md-4">
                                <div className="form_box mb-2">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Color Code<span className='req_text'>*</span> :  </label>
                                    <input type="text" id="colorCode" name="colorCode" value={formValues.colorCode} onChange={handleInputChange} />
                                </div>
                            </div>
                        }
                        
                        {isSubProject&&
                            
                            <div className="col-md-4">
                                <div className="form_box mb-2">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Start Date<span className='req_text'>*</span> :  </label>
                                    <input type="date" id="start_date" name="start_date" value={formValues.start_date} onChange={handleInputChange} />
                                    {/* {errors.logo && <span className="error" style={{ color: "red" }}>{errors.logo}</span>} */}
                                </div>
                            </div>
                        }
                            {isSubProject &&<div className="col-md-4">
                                <div className="form_box mb-2">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >End Date<span className='req_text'>*</span> :  </label>
                                    <input type="date" id="end_date" name="end_date" value={formValues.end_date} onChange={handleInputChange} />
                                    {errors.end_date && <span className="error" style={{ color: "red" }}>{errors.end_date}</span>}
                                </div>
                            </div>
                            }
                       
                        
                    </div>    
                    
                    {isSubProject &&
                        <div className='row'>
                            <div className="col-md-12">
                                <div className="form_box mb-2">
                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Project Details<span className='req_text'>*</span> :  </label>
                                    <textarea id="project_details" className="form-control" name="project_details" value={formValues.project_details} onChange={handleInputChange} />
                                    {errors.project_details && <span className="error" style={{ color: "red" }}>{errors.project_details}</span>}
                                </div>
                            </div>
                            {!isSubProject && <div className="col-md-6">
                            <div className="form_box mb-2">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Logo<span className='req_text'>*</span> :  </label>
                                <input type="file" accept="image/*" className="upload_document" name="logo" id="logo" onChange={(e) => setFormValues((prev) => ({ ...prev, ['logo']: e.target.files![0] }))} />
                            </div>
                        </div>}
                        </div>

                    }
                    {isSubProject && <label htmlFor="exampleFormControlInput1" className="form-label" >Tech Stacks:  </label>
                    }
                    {isSubProject &&
                        <div className="row mb-2">
                            <div className="col-md-12 techstack_listing">

                                {projectTechStackArray.map((option) => (

                                    <label key={option.id} className="flex items-center border rounded-md">
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
                    }

                    <div className="row mb-5">
                        <div className="col-lg-12 mt-4">
                            <input type='submit' value="Add" className="red_button" />
                        </div>

                    </div>
                </form>
                {showResponseMessage && <div className="row md-5"><label>Project Added Successfully</label></div>}
            </div>
        </div>
    )
}

export default DialogAddCompanyProject

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