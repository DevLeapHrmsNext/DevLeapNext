// 'use client'

// import React, { useEffect, useState } from 'react'
// import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useRouter } from 'next/navigation';
// import { error } from 'console';
// import LoadingDialog from '@/app/components/PageLoader';
// import { ProfileModel, CustomerProfile, LeapWorkingType } from '../models/employeeDetailsModel';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

// export const UserEmployement = () => {
//     const [userData, setUserData] = useState<CustomerProfile>({
//               id: '',
//               customer_id: 0,
//               created_at: '',
//               name: '',
//               contact_number: '',
//               email_id: '',
//               dob: '',
//               client_id: 0,
//               gender: '',
//               date_of_joining: '',
//               employment_status: false,
//               device_id: '',
//               salary_structure: '',
//               user_role: 0,
//               profile_pic: '',
//               emergency_contact: 0,
//               contact_name: '',
//               relation: 0,
//               manager_id: 0,
//               designation_id: 0,
//               authUuid: '',
//               branch_id: 0,
//               emp_id: '',
//               updated_at: '',
//               marital_status: '',
//               nationality: '',
//               blood_group: '',
//               department_id: 0,
//               employment_type: 0,
//               work_location: '',
//               probation_period: '',
//               official_onboard_date: '',
//               alternateContact: '',
//               personalEmail: '',
//               work_mode: 0,
//               leap_client_branch_details: {
//                   id: 0,
//                   uuid: '',
//                   client_id: 0,
//                   dept_name: '',
//                   is_active: false,
//                   created_at: '',
//                   updated_at: '',
//                   branch_city: '',
//                   branch_email: '',
//                   time_zone_id: undefined,
//                   branch_number: '',
//                   branch_address: '',
//                   is_main_branch: false,
//                   contact_details: 0,
//                   total_employees: 0
//               },
//               leap_client: {
//                   user_id: '',
//                   client_id: 0,
//                   parent_id: undefined,
//                   created_at: '',
//                   is_deleted: false,
//                   updated_at: '',
//                   is_a_parent: false,
//                   sector_type: '',
//                   timezone_id: undefined,
//                   company_name: '',
//                   company_email: '',
//                   company_number: '',
//                   company_location: '',
//                   number_of_branches: 0,
//                   total_weekend_days: 0,
//                   company_website_url: '',
//                   fullday_working_hours: 0,
//                   halfday_working_hours: 0
//               },
//               leap_client_designations: {
//                   id: 0,
//                   department: undefined,
//                   designation_name: ''
//               },
//               leap_client_departments: {
//                   id: 0,
//                   is_active: false,
//                   department_name: ''
//               },
//               leap_working_type: {
//                   id: 0,
//                   type: '',
//                   created_at: ''
//               },
//               leap_employement_type: {
//                   created_at: '',
//                   updated_at: '',
//                   employeement_type: '',
//                   employment_type_id: 0
//               }
//         });
//     const router = useRouter();
//     const {contextClientID,contextRoleID,contextSelectedCustId}=useGlobalContext();


//     const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
//     const [branchesArray, setBranches] = useState<ClientBranchTableModel[]>([]);
//     const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
//     const [EmploymentTypeArray, setEmployementTypeArray] = useState<ClientEmployementType[]>([]);
//     const [managerArray, setManagerArray] = useState<RoleManagerNameModel[]>([]);
//     const [workingTypeArray, setWorkingType] = useState<LeapWorkingType[]>([]);
//     const[isLoading,setLoading]=useState(false)

//     useEffect(() => {
//         const fetchData = async () => {
//             const branches = await getBranches(contextClientID);
//             setBranches(branches);
//             const designationType = await getDesignations(contextClientID);
//             setDesignations(designationType);
//             const departmentType = await getDepartments(contextClientID);
//             setDepartment(departmentType);
//             const managerName = await getManagers();
//             setManagerArray(managerName);
//             const employmentsType = await getEmploymentType();
//             setEmployementTypeArray(employmentsType);
//             const workingType = await getWorkingType();
//             setWorkingType(workingType);


//             try{
//                 const formData = new FormData();
//                 formData.append("client_id", contextClientID);
//                 formData.append("customer_id", contextSelectedCustId);

//             const res = await fetch("/api/users/getProfile", {
//                 method: "POST",
//                 body: formData,
//             });
//             console.log(res);

//             const response = await res.json();
//             console.log(response);

//             const user = response.customer_profile[0];
//             setUserData(user);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         }
//         fetchData();
//     },[]);



//     const handleSubmit = async (e: React.FormEvent) => {
//         {/* Address details 1 */}
//         setLoading(true)
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("client_id", userData?.client_id+"");
//         formData.append("branch_id", userData.branch_id+'');
//         formData.append("customer_id", userData.customer_id+'');
//         formData.append("role_id", contextRoleID);
//         formData.append("designation_id", userData?.designation_id+"");
//         formData.append("department_id", userData?.department_id+"");
//         formData.append("manager_id", userData?.manager_id+"");
//         formData.append("employment_type", userData?.employment_type+"");
//         formData.append("branch_id", userData?.branch_id+"");
//         formData.append("work_mode", userData?.work_mode+"");
//         formData.append("work_location", userData?.work_location+"");
//         formData.append("date_of_joining", userData?.date_of_joining+"");
//         formData.append("email_id", userData?.email_id+"");
//         formData.append("authUuid", userData.authUuid);
//         try{

//             const res = await fetch("/api/users/updateEmployee/updateEmpEmployment", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response=await res.json();
//             if(res.ok){
//                 setLoading(false)
//                 alert(response.message);
//             }else{
//                 setLoading(false)
//                 alert(response.message);
//             }
//             }catch(e){
//                 setLoading(false)
//                 alert(e);
//             }

//     }

// return (


//                     <div className="container">
//                         <div className="row">
//                             <div className="col-lg-12 mb-5">  
//                                 <div className="grey_box">
//                                     <div className="row">
//                                         <div className="col-lg-12">
//                                             <div className="add_form_inner">
//                                                 <div className="row">
//                                                     <div className="col-lg-12 mb-4 inner_heading25">
//                                                         Employement Details
//                                                     </div>
//                                                 </div>

//                                                 <div className="row" style={{alignItems: "center"}}>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Employee ID:  </label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <input type="text" className="form-control" id="emp_id"  value={userData?.emp_id || ""} name="emp_id" readOnly />
//                                                             {/* (e)=>setFormValues((prev) => ({ ...prev, ["emp_id"]: e.target.value }))} */}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Designation: </label>
//                                                         </div>
//                                                     </div>

//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <select className='form-select' id="department_id" name="designation_id" value={userData?.designation_id||""} onChange={(e)=>setUserData((prev) => ({ ...prev, ['designation_id']: parseInt(e.target.value) }))}>
//                                                                 <option value={userData?.designation_id || ""} key={userData?.leap_client_designations?.designation_name!}>{userData?.leap_client_designations?.designation_name! || ""}</option>
//                                                                 {designationArray.map((designationType, index) => (
//                                                                     <option value={designationType.id} key={designationType.id}>{designationType.designation_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="row" style={{alignItems: "center"}}>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Department:  </label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_client_departments.department_name} name="middleName" onChange={handleInputChange} /> */}
//                                                             <select className='form-select' id="department_id" name="department_id" onChange={(e)=>setUserData((prev) => ({ ...prev, ['department_id']: parseInt(e.target.value) }))}>
//                                                                 <option value={userData?.department_id || ""} >{userData?.leap_client_departments?.department_name || ""}</option>
//                                                                 {departmentArray.map((departmentType, index) => (
//                                                                     <option value={departmentType.id} key={departmentType.id}>{departmentType.department_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Reporting Manager:</label>
//                                                         </div>
//                                                     </div>

//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_customer[0]?.name} name="middleName" onChange={handleInputChange} /> */}
//                                                             <select className='form-select' id="manager_id" name="manager_id" onChange={(e)=>setUserData((prev) => ({ ...prev, ['manager_id']: parseInt(e.target.value) }))}>
//                                                                 <option value={userData?.manager_id || ""}>{userData?.name || ""}</option>
//                                                                 {managerArray.map((managerName, index) => (
//                                                                     <option value={managerName.customer_id} key={managerName.customer_id}>{managerName.name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="row" style={{alignItems: "center"}}>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Employement Type:  </label>

//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_employement_type.employeement_type} name="middleName" onChange={handleInputChange} /> */}
//                                                             <select className='form-select' id="employment_type" name="employment_type" onChange={(e)=>{setUserData((prev) => ({ ...prev, ['employment_type']: parseInt(e.target.value) })); 
//                                                             }}>
//                                                                 <option value={userData?.leap_employement_type?.employeement_type || ""}>{userData?.leap_employement_type?.employeement_type || ""}</option>
//                                                                 {EmploymentTypeArray.map((employmentsType, index) => (
//                                                                     <option value={employmentsType.employment_type_id} key={employmentsType.employment_type_id}>{employmentsType.employeement_type}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:</label>
//                                                         </div>
//                                                     </div>

//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             {/* <input type="text" className="form-control" id="" value={userData?.leap_client_branch_details.branch_number} name="work_location" onChange={(e)=>setUserData((prev) => ({ ...prev, ['designation_id']: parseInt(e.target.value) }))} /> */}
//                                                             <select className='form-select' id="branch_id" name="branch_id" onChange={(e)=>setUserData((prev) => ({ ...prev, ['branch_id']: parseInt(e.target.value) }))}>
//                                                                 <option value={userData?.leap_client_branch_details?.branch_number || ""}>{userData?.leap_client_branch_details?.branch_number || ""}</option>
//                                                                 {branchesArray.map((branch) => (
//                                                                     <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                     </div>
//                                                 </div>
//                                                 <div className="row" style={{alignItems: "center"}}>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Work Mode:  </label>

//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_employement_type.employeement_type} name="middleName" onChange={handleInputChange} /> */}
//                                                             <select className='form-select' id="employment_type" name="work_mode" onChange={(e)=>setUserData((prev) => ({ ...prev, ['work_mode']: parseInt(e.target.value) }))}>
//                                                                 <option value={userData?.leap_working_type?.type || ""}>{userData?.leap_working_type?.type || ""}</option>
//                                                                 {workingTypeArray.map((workingType, index) => (
//                                                                     <option value={workingType.id} key={workingType.id}>{workingType.type}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Work Location:</label>
//                                                         </div>
//                                                     </div>

//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <input type="text" className="form-control" id="work_location" value={userData?.work_location || ""} name="work_location" onChange={(e)=>setUserData((prev) => ({ ...prev, ['work_location']: e.target.value }))} />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="row" style={{alignItems: "center"}}>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Date of Joining:  </label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <input type="date" className="form-control" id="date_of_joining" value={userData?.date_of_joining || ""} name="date_of_joining" onChange={(e)=>setUserData((prev) => ({ ...prev, ['date_of_joining']: e.target.value }))} />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-2">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Official email:</label>
//                                                         </div>
//                                                     </div>

//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <input type="text" className="form-control" id="email_id" value={userData?.email_id || ""} name="email_id" onChange={(e)=>setUserData((prev) => ({ ...prev, ['email_id']: e.target.value }))} />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                         <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" className={`red_button ${isLoading}:"loading":""`} onClick={handleSubmit} /></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//     )
// }


// async function getBranches(contextClientID:any) {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select().eq("client_id",contextClientID);

//     const { data, error } = await query;
//     if (error) {


//         return [];
//     } else {


//         return data;
//     }
// }

// async function getDesignations(client_id:any) {

//     let query = supabase
//         .from('leap_client_designations')
//         .select().eq("client_id",client_id);

//     const { data, error } = await query;
//     if (error) {


//         return [];
//     } else {


//         return data;
//     }
// }
// async function getDepartments(client_id:any) {

//     let query = supabase
//         .from('leap_client_departments')
//         .select().eq("client_id",client_id);

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

// }
// async function getWorkingType() {

//     let query = supabase
//         .from('leap_working_type')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getEmploymentType() {

//     let query = supabase
//         .from('leap_employement_type')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getManagers() {
//     const clientID=3;
//     let query = supabase
//         .from('leap_customer')
//         .select("customer_id,emp_id,name,client_id,branch_id")
//         .eq("client_id", 3);

//     if(clientID==3){
//       query=  query.eq("user_role", 4);
//     } else{
//         query=  query.eq("user_role", 6);
//     }   

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }
// async function getDesignationSetUserRole(designation_id:any){
//     let userRole={role:5,isMAnager:false,isTeamlead:false,isemployee:true}
//     const {data:Designation,error:desigError}=await supabase.from('leap_client_designations').select('*').eq('id',designation_id);
//     console.log("this isthe designation got------",Designation);
//     if(Designation![0].designation_name.toLowerCase().includes('manager')){
//         userRole={role:4,isMAnager:true,isTeamlead:false,isemployee:false}
//     }else if(Designation![0].designation_name.toLowerCase().includes('team lead')) {
//         userRole={role:9,isMAnager:false,isTeamlead:true,isemployee:false}
//     }

//     return userRole;
//   }

////////////////// ritika code merge 


'use client'

import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import LoadingDialog from '@/app/components/PageLoader';
import { ProfileModel, CustomerProfile} from '../models/userEmployeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import moment from 'moment';
export const UserEmployement = () => {
    const [userData, setUserData] = useState<CustomerProfile>();
    const { contextClientID, contextCustomerID } = useGlobalContext();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/users/getProfile", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID
                    }),
                });

                const response = await res.json();

                const user = response.customer_profile[0];
                setUserData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="container" id='employement_id'>
            <div className="row">
                <div className="col-lg-12">
                    <div className="d_user_new_details_mainbox">
                        <div className="d_user_profile_heading">Employment Details</div>
                        <div className="d_user_profile_details_listing_box">
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Employee ID</div>
                                <div className="d_user_profile_details_content">{userData?.emp_id || "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Designation</div>
                                <div className="d_user_profile_details_content">{userData?.designation_id.designation_name || "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Department</div>
                                <div className="d_user_profile_details_content">{userData?.department_id.department_name || "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Reporting Manager</div>
                                <div className="d_user_profile_details_content">{userData?.manager_id.name|| "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Employment Type</div>
                                <div className="d_user_profile_details_content">{userData?.employment_type.employeement_type|| "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Branch</div>
                                <div className="d_user_profile_details_content">{userData?.leap_client_branch_details.branch_number || "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Work Mode</div>
                                <div className="d_user_profile_details_content">{userData?.work_mode ? userData?.work_mode.type : "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Work Location</div>
                                <div className="d_user_profile_details_content">{userData?.leap_client_branch_details.branch_city || "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Date of Joining</div>
                                <div className="d_user_profile_details_content">{moment(userData?.date_of_joining).format('DD-MM-YYYY') || "--"}</div>
                            </div>
                            <div className="d_user_profile_details_listing">
                                <div className="d_user_profile_details_subheading">Official email</div>
                                <div className="d_user_profile_details_content">{userData?.email_id || "--"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}