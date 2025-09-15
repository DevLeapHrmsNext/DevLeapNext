import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import supabase from '../api/supabaseConfig/supabase';
import { SingleSupportRequest } from '../models/supportModel';
import moment from 'moment';
import { EmployeeORGHierarchyDataModel } from '../models/OrgHierarchyDataModel';
import { LeapUserRole } from '../models/DashboardModel';
import Select from "react-select";

// interface NewUpdates {
//     designation_id: any
//     department_id: any
//     role_id: any
//     teamLead_id: any
//     Manager_id: any
//     isActive: boolean
// }

const DialogUpdateEmployeeHierarchy = ({ onClose, customer_id }: { onClose: (isUpdated: any) => void, customer_id: any }) => {

    const { contextClientID, contextCustomerID } = useGlobalContext();
    const [statusArray, setStatus] = useState<SupportRequestStatus[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeORGHierarchyDataModel>();
    // const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
    // const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
    // const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    // const [userRoleArray, setUserRoleArray] = useState<LeapUserRole[]>([]);
    // const [TeamLeadsArray, setTeamLeadsArray] = useState<CustomerNameEmpIDCustIDModel[]>([]);
    // const [managersArray, setManagersArray] = useState<CustomerNameEmpIDCustIDModel[]>([]);

    const [designationArray, setDesignationsArray] = useState([{ value: '', label: '' }]);
    const [selectedDesignation, setSelectedDesignation] = useState({ value: '', label: '' });

    const [departmentArray, setDepartmentArray] = useState([{ value: '', label: '' }]);
    const [selectedDepartment, setSelectedDepartment] = useState({ value: '', label: '' });

    const [branchArray, setBranchArray] = useState([{ value: '', label: '' }]);
    const [selectedBranch, setSelectedBranch] = useState({ value: '', label: '' });

    const [userRoleArray, setUserRoleArray] = useState([{ value: '', label: '' }]);
    const [selectedUserRole, setSelectedUserRole] = useState({ value: '', label: '' });

    const [TeamLeadsArray, setTeamLeadsArray] = useState([{ value: '', label: '' }]);
    const [selectedTeamLeads, setSelectedTeamLeads] = useState({ value: '', label: '' });

    const [managersArray, setManagersArray] = useState([{ value: '', label: '' }]);
    const [selectedManagers, setSelectedManagers] = useState({ value: '', label: '' });

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {
        setLoading(true);
        const status = await getStatus();
        const designations = await getDesignations(contextClientID);
        
        setDesignationsArray(designations);
        const department = await getDepartments(contextClientID);
        setDepartmentArray(department);
        const branch = await getBranches(contextClientID);
        setBranchArray(branch);
        const userRoles = await getUserRoles();
        setUserRoleArray(userRoles);
        const managers = await getManagersTeamLeads(contextClientID, false);
        setManagersArray(managers);
        const teamLeads = await getManagersTeamLeads(contextClientID, true);
        setTeamLeadsArray(teamLeads);
        setStatus(status);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", customer_id);
            const res = await fetch("/api/clientAdmin/getAllEmployeeHierarchy", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            if (response.status == 1) {
                setLoading(false);
                setEmployeeDetails(response.data[0])
                designations.map((designation)=>{
                    if(designation.value==response.data[0].designation_id){
                     setSelectedDesignation({value:designation.value,label:designation.label})
                    }
                   
                });
                department.map((dep)=>{
                    if(dep.value==response.data[0].department_id){
                     setSelectedDepartment({"value":dep.value,"label":dep.label})
                    }
                    
                });
                
                
                
                branch.map((branchs)=>{
                    ("selected Branch")
                    if(branchs.value==response.data[0].branch_id){
                        
                     setSelectedBranch({"value":branchs.value,"label":branchs.label})
                    }
                    
                });
                userRoles.map((role)=>{
                    if(role.value==response.data[0].user_role) { 
                        
                        setSelectedUserRole({value:role.value,label:role.label})
                    }
                    
                });
                teamLeads.map((lead)=>{

                    if(lead.value==response.data[0].manager_id){
                      setSelectedTeamLeads({value:lead.value,label:lead.label})
                    }
                   
                });
                managers.map((manager)=>{

                     if(manager.value==response.data[0].manager_id){
                        setSelectedManagers({"value":manager.value,"label":manager.label})
                    }
                    
                });
                
            } else {
                setLoading(false);
                alert("Failed to fetch request")
            }
        } catch (error) {
            setLoading(false);
            alert("Something went wrong exception occured")
            console.error("Error fetching user data:", error);
        }
    }
    const handleEmpSelectChange = async (values: any,selectedType:number) => {
        if(selectedType==1){
            setSelectedBranch(values)
        }else  if(selectedType==2){
            setSelectedDesignation(values)
        }
        else  if(selectedType==3){
            setSelectedDepartment(values)
        }
        else  if(selectedType==4){
            setSelectedUserRole(values)
        }
        else  if(selectedType==5){
            setSelectedTeamLeads(values)
        }
        else  if(selectedType==6){
            setSelectedManagers(values)
        }
        
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("handle submit is called");
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("customer_id", customer_id);
            formData.append("branch_id", selectedBranch.value);
            formData.append("designation_id", selectedDesignation.value);
            formData.append("department_id", selectedDepartment.value);
            formData.append("teamLead_id", selectedTeamLeads.value);
            formData.append("manager_id", selectedManagers.value);
            formData.append("userrole_id", selectedUserRole.value);


            const res = await fetch("/api/clientAdmin/update_supportrequest", {
                method: "POST",
                body: formData,
            });
            console.log(res);

            const response = await res.json();
            if (response.status == 1) {
                setLoading(false);
                onClose(true);
            } else {
                setLoading(false);
                alert("Failed to fetch request")
            }

        } catch (error) {
            setLoading(false);
            alert("Something went wrong exception occured")
            console.error("Error fetching user data:", error);
        }
    }
   

    return (
        <div >
            <div className='rightpoup_close' onClick={() => onClose(false)}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            <div className="row">
                <div className="col-lg-12 mb-3 inner_heading25">
                    Update Employee
                </div>
            </div>
            {isLoading ?
                <div className="loader-spinner"></div> :
                <div className="row">
                    <div className="col-lg-4"><div className="label">Name:</div></div>
                    <div className="col-lg-8 mb-3">{employeeDetails?.name}</div>
                    <div className="col-lg-4"><div className="label">Emp ID :</div></div>
                    <div className="col-lg-8 mb-3">{employeeDetails?.emp_id}</div>
                    <div className="col-lg-4"><div className="label">Branch :{selectedBranch.label}</div></div>
                    <div className="col-lg-8 mb-3">
                        
                        <Select
                            className="custom-select"
                            classNamePrefix="custom"
                            options={branchArray}
                            value={selectedBranch}
                            onChange={(selectedOption) =>
                                handleEmpSelectChange(selectedOption,1)
                            }
                            placeholder="Designation"
                            isSearchable={true}
                        />
                    </div>
                    <div className="col-lg-4"><div className="label">Designation :</div></div>
                    <div className="col-lg-8 mb-3">
                        
                        <Select
                            className="custom-select"
                            classNamePrefix="custom"
                            options={designationArray}
                            value={selectedDesignation}
                            onChange={(selectedOption) =>
                                handleEmpSelectChange(selectedOption,2)
                            }
                            placeholder="Designation"
                            isSearchable={true}
                        />
                    </div>
                    <div className="col-lg-4"><div className="label">Department :</div></div>
                    <div className="col-lg-8 mb-3">
                        

                        <Select
                            className="custom-select"
                            classNamePrefix="custom"
                            options={departmentArray}
                            value={selectedDepartment}
                            onChange={(selectedOption) =>
                                handleEmpSelectChange(selectedOption,3)
                            }
                            placeholder="Department"
                            isSearchable={true}
                        />
                    </div>
                    <div className="col-lg-4"><div className="label">Role :{selectedUserRole.value}</div></div>
                    <div className="col-lg-8 mb-3">
                        
                        <Select
                            className="custom-select"
                            classNamePrefix="custom"
                            options={userRoleArray}
                            value={selectedUserRole}
                            onChange={(selectedOption) =>
                                handleEmpSelectChange(selectedOption,4)
                            }
                            placeholder="Role"
                            isSearchable={true}
                        />
                    </div>
                    {selectedUserRole.value=='5' && <div className="col-lg-4"><div className="label">Team Lead :</div></div>}
                    {selectedUserRole.value=='5' && <div className="col-lg-8 mb-3">
                        
                        <Select
                            className="custom-select"
                            classNamePrefix="custom"
                            options={TeamLeadsArray}
                            value={selectedTeamLeads}
                            onChange={(selectedOption) =>
                                handleEmpSelectChange(selectedOption,5)
                            }
                            placeholder="Team Lead"
                            isSearchable={true}
                        />
                    </div>}
                    {selectedUserRole.value=='9' && <div className="col-lg-4"><div className="label">Manager :</div></div>}
                    {selectedUserRole.value=='9' && <div className="col-lg-8 mb-3">
                        
                        <Select
                            className="custom-select"
                            classNamePrefix="custom"
                            options={managersArray}
                            value={selectedManagers}
                            onChange={(selectedOption) =>
                                handleEmpSelectChange(selectedOption,6)
                            }
                            placeholder="Manager"
                            isSearchable={true}
                        />
                    </div>}
                    
                    <div className="row mb-2">
                        <div className="col-lg-12" style={{textAlign: "right"}}>
                            <input type='submit' value="Update" className="red_button" onClick={handleSubmit} />
                        </div>
                    </div>

                </div>}


        </div>
    )
}

export default DialogUpdateEmployeeHierarchy


async function getStatus() {

    let query = supabase
        .from('leap_request_status')
        .select();

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}

async function getDesignations(client_id: any) {

    let query = supabase
        .from('leap_client_designations')
        .select('designation_id,designation_name').eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {

        const mapped = data.map(item => ({
            value: item.designation_id,
            label: item.designation_name
          })) ;
        return mapped;
    }
}

async function getDepartments(client_id: any) {

    let query = supabase
        .from('leap_client_departments')
        .select("department_id,department_name").eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        const mappedDepartments = data.map(item => ({
            value: item.department_id,
            label: item.department_name
          })) ;
        return mappedDepartments;
    }

}

async function getBranches(client_id: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select('id,branch_number')
        .eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        const mapped = data.map(item => ({
            value: item.id,
            label: item.branch_number
          })) ;
        return mapped;
    }

}
async function getUserRoles() {

    let query = supabase
        .from('leap_user_role')
        .select('id,user_role')
        .not('id', 'in', '(1,2,3)');
        
    console.log("this is the user role query", query);
    
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        const mapped = data.map(item => ({
            value: item.id,
            label: item.user_role
          })) ;
        return mapped;
    }

}
async function getManagersTeamLeads(client_id: any, getTeamLeads: boolean) {

    let query = supabase
        .from('leap_customer')
        .select('customer_id,emp_id,name,id')
        .eq("client_id", client_id);
    if (getTeamLeads) {
        query = query.eq("user_role", 9)
    } else {
        query = query.eq("user_role", 4)
    }

    const { data, error } = await query;
    if (error) {

        return [];
    } else {
        const mapped = data.map(item => ({
            value: item.customer_id,
            label: item.emp_id +" "+ item.name
          })) ;
        return mapped;
    }

}

