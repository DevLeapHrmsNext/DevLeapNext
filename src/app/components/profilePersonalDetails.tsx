// 'use client'

// import React, { useEffect, useState } from 'react'
// import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useRouter } from 'next/navigation';
// import { error } from 'console';
// import { CustomerProfile, ProfileModel } from '../models/employeeDetailsModel';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import LoadingDialog from './PageLoader';

// export const UserPersonalDetails = () => {
//     const[isLoading,setLoading]=useState(false)
//     const [userData, setUserData] = useState<CustomerProfile>({
//         id: '',
//           customer_id: 0,
//           created_at: '',
//           name: '',
//           contact_number: '',
//           email_id: '',
//           dob: '',
//           client_id: 0,
//           gender: '',
//           date_of_joining: '',
//           employment_status: false,
//           device_id: '',
//           salary_structure: '',
//           user_role: 0,
//           profile_pic: '',
//           emergency_contact: 0,
//           contact_name: '',
//           relation: 0,
//           manager_id: 0,
//           designation_id: 0,
//           authUuid: '',
//           branch_id: 0,
//           emp_id: '',
//           updated_at: '',
//           marital_status: '',
//           nationality: '',
//           blood_group: '',
//           department_id: 0,
//           employment_type: 0,
//           work_location: '',
//           probation_period: '',
//           official_onboard_date: '',
//           alternateContact: '',
//           personalEmail: '',
//           work_mode: 0,
//           leap_client_branch_details: {
//               id: 0,
//               uuid: '',
//               client_id: 0,
//               dept_name: '',
//               is_active: false,
//               created_at: '',
//               updated_at: '',
//               branch_city: '',
//               branch_email: '',
//               time_zone_id: undefined,
//               branch_number: '',
//               branch_address: '',
//               is_main_branch: false,
//               contact_details: 0,
//               total_employees: 0
//           },
//           leap_client: {
//               user_id: '',
//               client_id: 0,
//               parent_id: undefined,
//               created_at: '',
//               is_deleted: false,
//               updated_at: '',
//               is_a_parent: false,
//               sector_type: '',
//               timezone_id: undefined,
//               company_name: '',
//               company_email: '',
//               company_number: '',
//               company_location: '',
//               number_of_branches: 0,
//               total_weekend_days: 0,
//               company_website_url: '',
//               fullday_working_hours: 0,
//               halfday_working_hours: 0
//           },
//           leap_client_designations: {
//               id: 0,
//               department: undefined,
//               designation_name: ''
//           },
//           leap_client_departments: {
//               id: 0,
//               is_active: false,
//               department_name: ''
//           },
//           leap_working_type: {
//               id: 0,
//               type: '',
//               created_at: ''
//           },
//           leap_employement_type: {
//               created_at: '',
//               updated_at: '',
//               employeement_type: '',
//               employment_type_id: 0
//           }
//     });

//     const {contextClientID,contextSelectedCustId,contextRoleID}=useGlobalContext();
//     const router = useRouter();

//     const [isChecked, setIsChecked] = useState(true);
//     const [selectedMaritialStatus, setMaritialStatus] = useState("Single");

//     useEffect(() => {
//         const fetchData = async () => {
            
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

//     const formData = new FormData();


//     const handleInputChange = (e: any) => {
//         const { name, value, type, files } = e.target;
//         console.log("Form values updated:", userData);
//         setUserData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         formData.append("client_id", userData?.client_id+"");
//         formData.append("branch_id", userData.branch_id+'');
//         formData.append("role_id", contextRoleID);
//         formData.append("authUuid", userData.authUuid);
//         formData.append("customer_id", userData.customer_id+"");
//         formData.append("dob", userData.dob+"")
//         formData.append("gender", userData.gender);
//         formData.append("marital_status", userData?.marital_status+"");
//         formData.append("nationality", userData?.nationality+"");
//         formData.append("blood_group", userData?.blood_group+"");
//         formData.append("contact_number", userData?.contact_number+"");
//         formData.append("personal_email", userData?.personalEmail+"");
//         formData.append("email_id", userData?.email_id+"");
//         formData.append("employment_status", userData?.employment_status+"");
//         try{
           
//         const res = await fetch("/api/users/updateEmployee", {
//             method: "POST",
//             body: formData,
//         });
//         const response=await res.json();
//         if(res.ok){
//             setLoading(false);
//             alert(response.message);
//         }else{
//             setLoading(false);
//             alert(response.message);
//         }
//         }catch(e){
//             setLoading(false);
//             alert(e);
//         }

//     }

// return (
//     <>  
//         <form onSubmit={handleSubmit}>
//                 <div className="col-lg-12 mb-5 ">
//                 <div className="grey_box">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="add_form_inner">
                            
//                                 <div className="row">
//                                     <div className="col-lg-12 mb-4" >
//                                         <div className="row" style={{borderBottom: "1px solid #ced9e2",}}>
//                                             <div className='col-lg-4'>
//                                                 <div className="option">
//                                                     <a href="#"><img src="/images/userpic.png" className="img-fluid" style={{ maxHeight: "100px" ,margin: "-37px 0px 0px -50px"}} /><div className="option_label"></div></a>
//                                                 </div>
//                                             </div>
//                                             <div className='col-lg-6'>
//                                                     <div className="row" style={{fontSize: "25px"}}>
//                                                         <label >{userData?.name}</label>
//                                                     </div>
//                                                     <div className="row" >
//                                                         <label >{userData?.emp_id}</label><label >{userData?.leap_client_designations?.designation_name || ""}</label>
//                                                     </div>
//                                             </div>
//                                             <div className='col-lg-2'>
//                                                     <div className="row" style={{fontSize: "5px"}}>
//                                                     <a href="#"><img src="/images/edit.png" className="img-fluid" style={{ maxHeight: '30px' }} /><div className="option_label"></div></a>
//                                                     </div>
                                                    
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row" >
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Date of Birth:  </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="date" className="form-control" id="dob" value={userData?.dob || ""} name="dob" onChange={(e)=>setUserData((prev) => ({ ...prev, ['dob']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Gender:  </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="gender" value={userData?.gender || ""} name="gender" onChange={(e)=>setUserData((prev) => ({ ...prev, ['gender']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Marital Status: </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="marital_status" value={userData?.marital_status || ""} name="marital_status" onChange={(e)=>setUserData((prev) => ({ ...prev, ['marital_status']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Nationality:  </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="nationality" value={userData?.nationality || ""} name="nationality" onChange={(e)=>setUserData((prev) => ({ ...prev, ['nationality']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Blood Group: </label>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="blood_group" value={userData?.blood_group || ""} name="blood_group" onChange={(e)=>setUserData((prev) => ({ ...prev, ['blood_group']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Number: </label>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="contact_number" value={userData?.contact_number || ""} name="contact_number" onChange={(e)=>setUserData((prev) => ({ ...prev, ['contact_number']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Personal Email: </label>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="personalEmail" value={userData?.personalEmail || ""} name="personalEmail" onChange={(e)=>setUserData((prev) => ({ ...prev, ['personalEmail']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Office Email: </label>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <input type="text" className="form-control" id="email_id" value={userData?.email_id || ""} name="email_id" onChange={(e)=>setUserData((prev) => ({ ...prev, ['email_id']: e.target.value }))} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {/* <div className='row' style={{alignItems: "center"}}>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Password: </label>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="form_box mb-3">
//                                                 <a className="info_icon" href="#">
//                                                     <img src="../images/info.png" alt="Information Icon" width={16} height={16} />
//                                                     <div className="tooltiptext tooltip-top">
//                                                         Password must contain combination of character, numbers and symbols.
//                                                     </div>
//                                                 </a>
//                                                 <input
//                                                     type="checkbox"
//                                                     id="show-password"
//                                                     className="show-password"
//                                                     checked={isChecked}
//                                                     onChange={() => setIsChecked(!isChecked)}

//                                                 />
//                                                 <label htmlFor="show-password" className="Control-label Control-label--showPassword">
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 48 48"
//                                                         width="32"
//                                                         height="32"
//                                                         className="svg-toggle-password"
//                                                         aria-labelledby="toggle-password-title"
//                                                     >
//                                                         <title id="toggle-password-title">Hide/Show Password</title>
//                                                         <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
//                                                         <rect x="20.133" y="2.117" height="44" transform="translate(23.536 -8.587) rotate(45)" className="closed-eye" />
//                                                         <rect x="22" y="3.984" width="4" height="44" transform="translate(25.403 -9.36) rotate(45)" style={{ fill: "#fff" }} className="closed-eye" />
//                                                     </svg>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     id="password"
//                                                     placeholder=""
//                                                     autoComplete="off"
//                                                     autoCapitalize="off"
//                                                     autoCorrect="off"
                                                
//                                                     pattern=".{6,}"
//                                                     className="ControlInput ControlInput--password"
//                                                     value={userData?.personalEmail} name="password" onChange={handleInputChange}
//                                                 />                                                                                            
//                                             </div>
//                                         </div>
//                                     </div> */}
//                                 </div>
//                                 <div className="row">
//                                     {/* <label className="switch">
//                                         <input type="checkbox"/>
//                                         <span className="slider round"></span>
//                                     </label> */}
//                                     <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" className={`red_button ${isLoading}:"loading":""`} onClick={handleSubmit} /></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 </div>
//         </form>
    
//     </>
// )
// }


/////////////// Ritika code change 


'use client'

import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import { CustomerProfile, ProfileModel } from '../models/employeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import LoadingDialog from './PageLoader';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';

export const UserPersonalDetails = () => {
    const[isLoading,setLoading]=useState(false)
    
            const [showAlert, setShowAlert] = useState(false);
                const [alertForSuccess, setAlertForSuccess] = useState(0);
                const [alertTitle, setAlertTitle] = useState('');
                const [alertStartContent, setAlertStartContent] = useState('');
                const [alertMidContent, setAlertMidContent] = useState('');
                const [alertEndContent, setAlertEndContent] = useState('');
                const [alertValue1, setAlertValue1] = useState('');
                const [alertvalue2, setAlertValue2] = useState('');
                const [showAlertCancel, setShowAlertCancel] = useState(false);
    const [userData, setUserData] = useState<CustomerProfile>({
        id: '',
          customer_id: 0,
          created_at: '',
          name: '',
          contact_number: '',
          email_id: '',
          dob: '',
          client_id: 0,
          gender: '',
          date_of_joining: '',
          employment_status: false,
          device_id: '',
          salary_structure: '',
          user_role: 0,
          profile_pic: '',
          emergency_contact: 0,
          contact_name: '',
          relation: 0,
          manager_id: 0,
          designation_id: 0,
          authUuid: '',
          branch_id: 0,
          emp_id: '',
          updated_at: '',
          marital_status: '',
          nationality: '',
          blood_group: '',
          department_id: 0,
          employment_type: 0,
          work_location: '',
          probation_period: '',
          official_onboard_date: '',
          alternateContact: '',
          personalEmail: '',
          work_mode: 0,
          leap_client_branch_details: {
              id: 0,
              uuid: '',
              client_id: 0,
              dept_name: '',
              is_active: false,
              created_at: '',
              updated_at: '',
              branch_city: '',
              branch_email: '',
              time_zone_id: undefined,
              branch_number: '',
              branch_address: '',
              is_main_branch: false,
              contact_details: 0,
              total_employees: 0
          },
          leap_client: {
              user_id: '',
              client_id: 0,
              parent_id: undefined,
              created_at: '',
              is_deleted: false,
              updated_at: '',
              is_a_parent: false,
              sector_type: '',
              timezone_id: undefined,
              company_name: '',
              company_email: '',
              company_number: '',
              company_location: '',
              number_of_branches: 0,
              total_weekend_days: 0,
              company_website_url: '',
              fullday_working_hours: 0,
              halfday_working_hours: 0
          },
          leap_client_designations: {
              id: 0,
              department: undefined,
              designation_name: ''
          },
          leap_client_departments: {
              id: 0,
              is_active: false,
              department_name: ''
          },
          leap_working_type: {
              id: 0,
              type: '',
              created_at: ''
          },
          leap_employement_type: {
              created_at: '',
              updated_at: '',
              employeement_type: '',
              employment_type_id: 0
          }
    });

    const {contextClientID,contextSelectedCustId,contextRoleID}=useGlobalContext();
    const router = useRouter();

    const [isChecked, setIsChecked] = useState(true);
    const [selectedMaritialStatus, setMaritialStatus] = useState("Single");

    useEffect(() => {
        const fetchData = async () => {
            
            try{
                const formData = new FormData();
                formData.append("client_id", contextClientID);
                formData.append("customer_id", contextSelectedCustId);

            const res = await fetch("/api/users/getProfile", {
                method: "POST",
                body: JSON.stringify({
                        "client_id":contextClientID,
                        "customer_id":contextSelectedCustId
                    }),
            });
            console.log(res);
            
            const response = await res.json();
            console.log(response);
            
            const user = response.customer_profile[0];
            setUserData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    },[]);

    const formData = new FormData();


    const handleInputChange = (e: any) => {
        const { name, value, type, files } = e.target;
        console.log("Form values updated:", userData);
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const callResetDeviceID = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('leap_customer')
                .update({ device_id: null,auth_token:null }) // Set device_id to null or the desired reset value
                .eq('customer_id', userData.customer_id);

            if (error) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(`Error resetting device ID: ${error.message}`);
                setAlertForSuccess(2)
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Device id reset successfully");
                setAlertForSuccess(1)
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent(`An unexpected error occurred while resetting the device ID.`);
                setAlertForSuccess(3)
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        formData.append("client_id", userData?.client_id+"");
        formData.append("branch_id", userData.branch_id+'');
        formData.append("role_id", contextRoleID);
        formData.append("authUuid", userData.authUuid);
        formData.append("customer_id", userData.customer_id+"");
        formData.append("dob", userData.dob+"")
        formData.append("gender", userData.gender);
        formData.append("marital_status", userData?.marital_status+"");
        formData.append("nationality", userData?.nationality+"");
        formData.append("blood_group", userData?.blood_group+"");
        formData.append("contact_number", userData?.contact_number+"");
        formData.append("personal_email", userData?.personalEmail+"");
        formData.append("email_id", userData?.email_id+"");
        formData.append("employment_status", userData?.employment_status+"");
        try{
           
        const res = await fetch("/api/users/updateEmployee", {
            method: "POST",
            body: formData,
        });
        const response=await res.json();
        if(res.ok){
            setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent(response.message);
                setAlertForSuccess(1)
        }else{
           setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
        }
        }catch(e){
            setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent("Something went wrong while updating profile:-"+e);
                setAlertForSuccess(1)
        }

    }
    function isReadonly(){
        if(contextRoleID == "2" || contextRoleID == "3"){
            return false;
        }else{
            return true;
        }
    }
return (
    <>  
    <LoadingDialog isLoading={isLoading} />
    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                
                if(showAlertCancel){
                    callResetDeviceID();
                    setShowAlertCancel(false);
                    setShowAlert(false)
                }else{
                    setShowAlert(false);
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={showAlertCancel} imageURL={''} successFailure={alertForSuccess} />}
        <form onSubmit={handleSubmit}>
                <div className="col-lg-12 mb-5 ">
                <div className="grey_box mb-3">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="add_form_inner">
                            
                                <div className="row">
                                    <div className="col-lg-12 mb-4" >
                                        <div className="row" style={{borderBottom: "1px solid #ced9e2",}}>
                                            <div className='col-lg-2'>
                                                <div className="option">
                                                    <a href="#"><img src={userData?.profile_pic && userData.profile_pic.length>0? getImageApiURL+"/uploads/"+userData.profile_pic:staticIconsBaseURL+"/images/user/user.png"} className="img-fluid" 
                                                    style={{ maxHeight: "80px" ,margin: "-35px 0px 0px -50px", minHeight:"80px", maxWidth:"80px",minWidth:"80px",borderRadius:"100px"}} /><div className="option_label"></div></a>
                                                </div>
                                            </div>
                                            <div className='col-lg-10 mb-3'>
                                                    <div className="row" style={{fontSize: "25px"}}>
                                                        <label >{userData?.name}</label>
                                                    </div>
                                                    <div className="row" >
                                                        <label >{userData?.emp_id}</label><label >{userData?.leap_client_designations?.designation_name || ""}</label>
                                                    </div>
                                            </div>
                                            {/* <div className='col-lg-1 p-0'>
                                                    <div className="row" style={{fontSize: "5px"}}>
                                                    <a href="#"><img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid" style={{ maxHeight: '20px' }} /><div className="option_label">Edit Profile</div></a>
                                                    </div>
                                                    
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Date of Birth:  </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="date" className="form-control" id="dob" value={userData?.dob || ""} name="dob" readOnly={isReadonly()} onChange={(e)=>setUserData((prev) => ({ ...prev, ['dob']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Gender:  </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="gender" value={userData?.gender || ""} readOnly={isReadonly()} name="gender" onChange={(e)=>setUserData((prev) => ({ ...prev, ['gender']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Marital Status: </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="marital_status" value={userData?.marital_status || ""} readOnly={isReadonly()} name="marital_status" onChange={(e)=>setUserData((prev) => ({ ...prev, ['marital_status']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Nationality:  </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="nationality" value={userData?.nationality || ""} readOnly={isReadonly()} name="nationality" onChange={(e)=>setUserData((prev) => ({ ...prev, ['nationality']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Blood Group: </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="blood_group" value={userData?.blood_group || ""} readOnly={isReadonly()} name="blood_group" onChange={(e)=>setUserData((prev) => ({ ...prev, ['blood_group']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Number: </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="contact_number" value={userData?.contact_number || ""} readOnly={isReadonly()} name="contact_number" onChange={(e)=>setUserData((prev) => ({ ...prev, ['contact_number']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Personal Email: </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="personalEmail" value={userData?.personalEmail || ""} readOnly={isReadonly()} name="personalEmail" onChange={(e)=>setUserData((prev) => ({ ...prev, ['personalEmail']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Office Email: </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="text" className="form-control" id="email_id" value={userData?.email_id || ""} readOnly={isReadonly()} name="email_id" onChange={(e)=>setUserData((prev) => ({ ...prev, ['email_id']: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    {(contextRoleID=="3" || contextRoleID=="2") &&
                                        <div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Employment: </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <select className="form-control" id="employment_status" value={userData?.employment_status ? "true" : "false"} name="employment_status" onChange={(e)=>setUserData((prev) => ({ ...prev, ['employment_status']: e.target.value == "true" ? true : false }))} >
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    {(contextRoleID=="3" || contextRoleID=="2") &&<div className='row' style={{alignItems: "center"}}>
                                        <div className="col-md-6">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Reset Device ID: </label>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form_box mb-2">
                                                <input type="button" className="form-control " id="reset_device_id" value="Reset" readOnly={isReadonly()} name="reset_device_id" onClick={()=>{
                                                    setShowAlert(true);
                                                    setShowAlertCancel(true);
                                                    setAlertTitle("Warning")
                                                    setAlertStartContent(`Press ok to reset device ID`);
                                                    setAlertForSuccess(3)
                                                }} />
                                            </div>
                                        </div>
                                    </div>}
                                    
                                </div>
                                <div className="row">
                                    <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' readOnly={isReadonly()} value="Update" className={`red_button ${isLoading}:"loading":""`} onClick={handleSubmit} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
        </form>
    
    </>
)
}