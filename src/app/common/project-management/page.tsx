'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { pageURL_assignLeaveForm, pageURL_leaveTypeListing, leftMenuLeavePageNumbers, leftMenuProjectMGMTPageNumbers, leftMenuProjectsSub1PageNumbers } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import DialogAddCompanyProject from '@/app/components/dialog_addCompanyProject'
import DialogUpdateCompanyProject from '@/app/components/dialog_updateCompanyProject'
import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation'
import { deleteDataTypeProject, deleteDataTypeSubProject, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'


interface FilterValues {
    branchID: any,
    projectName: any,
    status: any,
    showDeleted: boolean,
}


const CompanyProjectList = () => {

    const [isLoading, setLoading] = useState(true);
    const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
    const [showUpdateProjectDialog, setShowUpdateProjectDialog] = useState(false);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [projectID, setProjectID] = useState(0);
    const [projectName, setProjectName] = useState("");
    const [isSubProjectAdd, setIsSubProjectAdd] = useState(false);
    const [isSubProjectEdit, setisSubProjectEdit] = useState(true);
    const [isSubProjectDelete, setisSubProjectDelete] = useState(false);
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [deleteProjectID, setDeleteProjectID] = useState(0);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
    const [companyProjectsArray, setCompanyProjectsArray] = useState<CompanyProjectsDataModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [isExpandedID, setExpanded] = useState(-1)
    const [filterValues, setFilterValues] = useState<FilterValues>({
        branchID: '',
        projectName: '',
        status: '',
        showDeleted: false
    });

    useEffect(() => {

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
    const fetchData = async () => {
        setLoading(true);
        const projectStatuses = await getProjectStatus();
        setProjectStatusArray(projectStatuses)
        const companyProjects = await getCompanyProjects(contextClientID, "", "", "", false);
        setCompanyProjectsArray(companyProjects);
        const branch = await getBranches(contextClientID);
        setBranchArray(branch);
        setLoading(false);
    }



    const resetFilter = async () => {

        window.location.reload();
        setFilterValues({
            projectName: "",
            branchID: "",
            status: '',
            showDeleted: false,
        });
        fetchData();
    }

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;

        setFilterValues((prev) => ({ ...prev, [name]: value }));


    };

    const onFilterSubmit = async () => {
        console.log(filterValues);

        const companyProjects = await getCompanyProjects(contextClientID, filterValues.branchID, filterValues.projectName, filterValues.status, filterValues.showDeleted);
        setCompanyProjectsArray(companyProjects);
        setLoadingCursor(false)
    }

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
            <LeftPannel menuIndex={leftMenuProjectMGMTPageNumbers} subMenuIndex={leftMenuProjectsSub1PageNumbers} showLeftPanel={true} rightBoxUI={


                <div className='container'>
                    <LoadingDialog isLoading={isLoading} />
                    <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                        <div className="row heading25" style={{ alignItems: "center" }}>
                            <div className="col-lg-6">
                                Company <span>Projects</span>
                            </div>
                            <div className="col-lg-6 mb-1" style={{ textAlign: "right" }}>
                                <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div>&nbsp;
                                <a className="red_button" onClick={() => {
                                    setShowAddProjectDialog(true);
                                    setIsSubProjectAdd(true);
                                    setProjectID(0);
                                    setProjectName("")
                                }}>
                                    Add Project
                                </a>&nbsp;
                            </div>
                        </div>
                        <div className={showAddProjectDialog ? "rightpoup rightpoup2 rightpoupopen" : "rightpoup rightpoup2"}>
                            {showAddProjectDialog && <DialogAddCompanyProject onClose={() => { setShowAddProjectDialog(false), fetchData() }} projectID={projectID} projectName={projectName} isSubProject={isSubProjectAdd} />}
                        </div>
                        <div className={showUpdateProjectDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showUpdateProjectDialog && <DialogUpdateCompanyProject onClose={() => { setShowUpdateProjectDialog(false), fetchData() }} update_project_id={projectID} isSubProject={isSubProjectEdit} />}
                        </div>
                            {showDeleteConfirmationDialog && <DeleteConfirmation id={deleteProjectID} deletionType={isSubProjectDelete ? deleteDataTypeSubProject : deleteDataTypeProject} onClose={() => { setShowDeleteConfirmationDialog(false), fetchData() }} deleteDetail={projectName} />}

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="filter_whitebox" id="filter_whitebox">
                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-lg-2">
                                            <div className="form_box mb-1">
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
                                        <div className="col-lg-2">

                                            <div className="form_box mb-1">

                                                <label htmlFor="formFile" className="form-label">Project Name:</label>
                                                <input type="projectName" name="projectName" onChange={(e) => handleFilterChange(e)} />

                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="form_box mb-1">
                                                <label htmlFor="formFile" className="form-label">Status:</label>

                                                <select id="status" name="status" onChange={(e) => handleFilterChange(e)}>
                                                    <option value="">Status:</option>
                                                    {projectStatusArray.map((status) => (
                                                        <option value={status.project_status_id} key={status.project_status_id}>{status.project_status_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="form_box mb-1">

                                                <label htmlFor="formFile" className="form-label">Show Deleted:</label>
                                                <label className="switch" style={{ maxWidth: "35%" }}>
                                                    <input type="checkbox" name="showDeleted" onChange={(e) => handleFilterChange(e)} />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="form_box mb-1">
                                                <a className={`red_button ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), onFilterSubmit() }}>Submit</a>&nbsp;
                                                <a className="red_button" onClick={() => resetFilter()}>Reset</a>&nbsp;
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                <div className="row align-items-center list_label mb-4">
                                    <div className="col-lg-2 text-center"><div className="label">Branch</div></div>
                                    <div className="col-lg-3 text-center"><div className="label">Project Name</div></div>
                                    <div className="col-lg-2 text-center"><div className="label">Client Name</div></div>
                                    <div className="col-lg-2 text-center"><div className="label">Manager</div></div>
                                    {/* <div className="col-lg-2 text-center"><div className="label">Team Lead</div></div> */}

                                    <div className="col-lg-1 text-center"><div className="label">Status</div></div>
                                    <div className="col-lg-2 text-center"><div className="label">Action</div></div>

                                </div>
                                {companyProjectsArray.length > 0 ? companyProjectsArray.map((project) =>
                                    <div className='list_listbox' key={project.project_id}>

                                        <div className="row text-center" style={{alignItems:"center"}}>
                                            <div className="col-lg-2">{project.leap_client_branch_details.branch_number}</div>

                                            <div className="col-lg-3">{project.project_name}</div>
                                            <div className="col-lg-2">{project.project_client}</div>
                                            <div className="col-lg-2">{project.manager.name}</div>
                                            {/* <div className="col-lg-2">
                                                {project.team_lead.name}
                                            </div> */}
                                            <div className="col-lg-1 blinking_text" style={{ color: project.leap_project_status.color_codes }}>
                                                {!project.is_deleted ? project.leap_project_status.project_status_name : "Deleted"}
                                            </div>


                                            <div className="col-lg-2 text-center">
                                                {/* {!project.is_deleted && <img src={staticIconsBaseURL + "/images/ic_add_black_circular.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "25px", paddingBottom: "0px", alignItems: "center", marginRight: '10px', cursor: "pointer" }}
                                                    onClick={() => {
                                                        setShowAddProjectDialog(true);
                                                        setIsSubProjectAdd(true);
                                                        setProjectID(project.project_id);
                                                        setProjectName(project.project_name)
                                                    }}
                                                />} */}
                                                <img src={staticIconsBaseURL + "/images/edit_round_black.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "25px", paddingBottom: "0px", alignItems: "center", marginRight: '10px', cursor: "pointer" }}
                                                    onClick={() => {
                                                        setProjectID(project.project_id);
                                                        setisSubProjectEdit(true)
                                                        setShowUpdateProjectDialog(true)
                                                        setProjectName(project.project_name)

                                                    }}
                                                />
                                                {!project.is_deleted && <img src={staticIconsBaseURL + "/images/delete_circular_black.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "25px", alignItems: "center", marginRight: '10px', cursor: "pointer" }}
                                                    onClick={() => {
                                                        setDeleteProjectID(project.project_id);
                                                        setShowDeleteConfirmationDialog(true);
                                                        setisSubProjectDelete(false);
                                                        setProjectName(project.project_name)

                                                    }}
                                                />}
                                                <img src={staticIconsBaseURL + '/images/ic_arrow_down_round_black.png'} className="img-fluid" style={{ width: "25px", paddingBottom: "0px", alignItems: "center", marginRight: '10px', cursor: "pointer" }} onClick={() => { isExpandedID == project.project_id ? (setExpanded(-1)) : setExpanded(project.project_id) }} />

                                            </div>

                                        </div>
                                        {isExpandedID == project.project_id &&

                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div style={{ backgroundColor: "#fff", boxShadow: "0 0 10px #0000001a", margin: "20px 0 0 0", borderRadius: "10px", padding:"14px 24px", }}>
                                                        <div className="row">
                                                            <div className='col-lg-12 '>

                                                                <div className="row align-items-center list_label mb-4 " >
                                                                    {/* <div className="col-lg-2 text-center" ><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Sub Project name</div></div> */}
                                                                    <div className="col-lg-1 text-center"><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Logo</div></div>

                                                                    <div className="col-lg-2 text-center"><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Department</div></div>
                                                                    <div className="col-lg-7 text-center"><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Details</div></div>
                                                                    <div className="col-lg-2 text-center"><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Primary Color</div></div>

                                                                    {/* <div className="col-lg-1 text-center"><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Status</div></div> */}
                                                                    {/* <div className="col-lg-2 text-center"><div className="label" style={{ backgroundColor: "#f2f2f2" }}>Action</div></div> */}
                                                                    

                                                                    {/* <div className="col-lg-2 text-center"><div className="label">Reason</div></div>
                                                        <div className="col-lg-2 text-center"><div className="label">Status</div></div> */}
                                                                </div>
                                                                {
                                                                    project.leap_client_sub_projects.length > 0 ? project.leap_client_sub_projects.map((subproject) =>
                                                                        <div className='row list_listbox mr-4' key={subproject.subproject_id}>
                                                                            {/* <div className="col-lg-2 text-center font12_Medium"> {subproject.sub_project_name}</div> */}
                                                                            <div className="col-lg-1 text-center">
                                                                                <a href={project.project_logo != null && project.project_logo.length > 0 ?getImageApiURL+"/uploads/"+project.project_logo:""} download={project.project_logo != null && project.project_logo.length > 0}>
                                                                                    <img src={project.project_logo != null && project.project_logo.length > 0 ? getImageApiURL+"/uploads/" + project.project_logo : staticIconsBaseURL+"/images/project_default_logo1.png"} 
                                                                                    className="img-fluid" style={{ maxHeight: "25px", borderRadius: "40px" }} 
                                                                                    onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/project_default_logo1.png"; }}
                                                                                    />
                                                                                </a>
                                                                            </div>

                                                                            <div className="col-lg-2 text-center font12_Medium">
                                                                                {subproject.leap_client_departments.department_name}
                                                                            </div>
                                                                            <div className="col-lg-7 text-center font12_Medium">
                                                                                {subproject.project_details}
                                                                            </div>
                                                                            <div className="col-lg-2 text-center font12_Medium">
                                                                                {/* {subproject.} */}
                                                                                {project.project_color_code}
                                                                            </div>
                                                                            
                                                                            {/* <div className="col-lg-1 text-center font14_Medium blinking_text" style={{ color: subproject.leap_project_status.color_codes }}>
                                                                                {subproject.leap_project_status.project_status_name}
                                                                            </div> */}
                                                                            {/* <div className="col-lg-2 text-center">
                                                                                <img src={staticIconsBaseURL + "/images/edit_round_black.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "25px", paddingBottom: "0px", alignItems: "center", marginLeft: '10px', cursor: "pointer" }}
                                                                                    onClick={() => {
                                                                                        setProjectID(subproject.subproject_id);
                                                                                        setisSubProjectEdit(true)
                                                                                        setShowUpdateProjectDialog(true)
                                                                                    }}
                                                                                />
                                                                                {!subproject.is_deleted && <img src={staticIconsBaseURL + "/images/delete_circular_black.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "25px", paddingBottom: "0px", alignItems: "center", marginLeft: '10px', cursor: "pointer" }}
                                                                                    onClick={() => {
                                                                                        setDeleteProjectID(subproject.subproject_id);
                                                                                        setShowDeleteConfirmationDialog(true);
                                                                                        setisSubProjectDelete(true);

                                                                                    }}
                                                                                />}
                                                                            </div> */}
                                                                        </div>
                                                                    ) : <div className="d-flex justify-content-center align-items-center" style={{ height: "30px" }}>
                                                                        {<div className="font12_Medium text-muted">No sub projects available</div>}

                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        }

                                    </div>
                                )
                                    : <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                        {<h4 className="text-muted">{!isLoading ? "No Projects Available" : ""}</h4>}
                                    </div>}
                            </div>
                        </div>
                    </div>
                    
                </div>

            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default CompanyProjectList;


async function getProjectStatus() {

    let query = supabase
        .from('leap_project_status')
        .select();
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}

async function getCompanyProjects(client_id: any, branch_id: any, projectName: any, project_Status: any, showDeleted: boolean) {

    let query = supabase
        .from('leap_client_project')
        .select('* ,manager:leap_customer!leap_client_project_project_manager_id_fkey(name),team_lead:leap_customer!leap_client_project_team_lead_id_fkey(name),leap_client_sub_projects(*,manager:leap_customer!leap_client_sub_projects_project_manager_id_fkey(name),leap_client_departments(department_name),leap_project_status(project_status_id,project_status_name,color_codes)),leap_project_status(project_status_id,project_status_name,color_codes),leap_client_branch_details(branch_number)')
        .eq("client_id", client_id);
    if (branch_id) {
        query = query.eq("branch_id", branch_id);
    }

    if (projectName) {
        query = query.ilike("project_name", "%" + projectName + "%");
    }
    if (project_Status) {
        query = query.eq("project_status", project_Status);
    }
    if (!showDeleted) {
        query = query.eq("is_deleted", showDeleted).eq("leap_client_sub_projects.is_deleted", showDeleted)
    }
    console.log(query);

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