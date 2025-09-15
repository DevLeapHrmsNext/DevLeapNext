// // Branch Details form called from company profile to, can update from here too

// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { Client } from '@/app/models/companyModel';
// import LeapHeader from '@/app/components/header';
// import { clientAdminDashboard } from '@/app/pro_utils/stringConstants';
// import LeftPannel from '@/app/components/leftPannel';
// import Footer from '@/app/components/footer';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

// interface spesificBranchData{
//         time_zone_id: '',is_active:any,
//     id: any; branch_address: any; branch_city: any; contact_details: any; branch_email: any; branch_number: any; is_main_branch: any; 
// }
//  const BranchDetails = () => {

//     const [branchesArray, setBranches] = useState<spesificBranchData[]>([{
//         id: '',
//         branch_address: '',
//         branch_city: '',
//         contact_details: '',
//         branch_email: '',
//         branch_number: '',
//         time_zone_id: '',
//         is_main_branch: false,
//         is_active: true,

//     }]);
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [branchIndex, setBranchIndex] = useState(0);
//     const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
//     const { contextClientID, contextCustomerID, contaxtBranchID, contextRoleID } = useGlobalContext();

//     const [timeZone, setTimeZone] = useState<TimeZoneModel[]>([]);


//     useEffect(() => {
//         const handleScroll = () => {
//             setScrollPosition(window.scrollY); // Update scroll position
//             const element = document.querySelector('.mainbox');
//       if (window.pageYOffset > 0) {
//         element?.classList.add('sticky');
//       } else {
//         element?.classList.remove('sticky');
//       }
//           };
//           const fetchData = async () => {
//             const branches = await getBranch();
//             setBranches(branches);
//             const timezone = await getTimeZone();
//             setTimeZone(timezone);


//             try{
//                 const formData = new FormData();
//                 formData.append("client_id", contextClientID || "3");

//             const res = await fetch("/api/clientAdmin/getClientProfile", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response = await res.json();
//             const user = response.clients[0];
//             // setCompData(user);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         } 
//         fetchData();

//         window.addEventListener('scroll', handleScroll);
//         return () => {

//             window.removeEventListener('scroll', handleScroll);
//           };
//     }, []);
//     const [errors, setErrors] = useState<Partial<Client>>({});

// //     const validate = () => {
// //       const newErrors: Partial<Client> = {};

// //       if (!compData.company_name) newErrors.company_name = "required";
// //       

// //       setErrors(newErrors);
// //       return Object.keys(newErrors).length === 0;
// //   };
//     const formData = new FormData();

//     const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // if (!validate()) return;

//     formData.append("client_id", contextClientID || "3");
//     formData.append("id", branchesArray[branchIndex].id);

//     formData.append("branch_number", branchesArray[branchIndex].branch_number);
//     formData.append("branch_address", branchesArray[branchIndex].branch_address);
//     formData.append("branch_city", branchesArray[branchIndex].branch_city);
//     formData.append("contact_details", branchesArray[branchIndex].contact_details);
//     formData.append("branch_email", branchesArray[branchIndex].branch_email);
//     formData.append("time_zone_id", branchesArray[branchIndex].time_zone_id);
//     formData.append("is_main_branch", branchesArray[branchIndex].is_main_branch);
//     formData.append("is_active", branchesArray[branchIndex].is_active);

//     try{
//         const res = await fetch("/api/clientAdmin/updateBranchDetails", {
//             method: "POST",
//             body: formData,
//         });
//         const response=await res.json();
//         if(res.ok){
//             alert(response.message);
//         }else{
//             alert(response.message);
//         }
//         }catch(e){
//             alert(e);
//         }
//     }
//     const handleValuesChange = (e: any, id: any) => {
//         const { value , name} = e.target;
//         setBranches((prev) => {
//             const existingComponentIndex = prev.findIndex((item) => item.id === id);
//             if (existingComponentIndex > -1) {
//                 // Update the value for the existing component
//                 const updatedArray = [...prev];
//                 name=="branch_address"?updatedArray[existingComponentIndex].branch_address = value:
//                 name=="branch_city"?updatedArray[existingComponentIndex].branch_city = value:
//                 name=="branch_email"?updatedArray[existingComponentIndex].branch_email = value:
//                 name=="branch_number"?updatedArray[existingComponentIndex].branch_number = value:
//                 name=="contact_details"?updatedArray[existingComponentIndex].contact_details = value:
//                 name=="is_active"?updatedArray[existingComponentIndex].is_active = value:

//                 updatedArray[existingComponentIndex].is_main_branch = value;
//                 return updatedArray;
//             } else {
//                 // Add a new component with its value
//                 return [...prev, { 
//                     id:id,
//                     branch_address: name == "branch_address" ? value : branchesArray[existingComponentIndex].branch_address,
//                     branch_city:name=="branch_city"?value:branchesArray[existingComponentIndex].branch_city,
//                     branch_email:name=="branch_email"?value:branchesArray[existingComponentIndex].branch_email,
//                     branch_number:name=="branch_number"?value:branchesArray[existingComponentIndex].branch_number,
//                     contact_details:name=="contact_details"?value:branchesArray[existingComponentIndex].contact_details,
//                     is_main_branch:name=="is_main_branch"?value:branchesArray[existingComponentIndex].is_main_branch,
//                     time_zone_id:name=="time_zone_id"?value:branchesArray[existingComponentIndex].time_zone_id,
//                     is_active:name=="is_active"?value:branchesArray[existingComponentIndex].is_active,
//                 }];
//             }
//         });
//         // console.log("this is the salary values ------=------", salaryValuesArray);
//     };
//     const handleMenuClick = (index:any) => {
//         setSelectedLeftMenuItemIndex(index); // Update the state correctly
//       };
//     return (
//             <>

//             <div className="row mb-3">
//                 <div className="col-lg-12">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             {branchesArray.map((branch, index) =>(
//                                 <div className={branchIndex==index?"announcement_branch_box_selected":"announcement_branch_box"} key={branch.id}>
//                                     <a onClick={(e) => setBranchIndex(index)}>
//                                         <div className={"list_view_heading text-center"} >
//                                             {branch.branch_number}

//                                         </div>
//                                     </a>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="row">
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <div>
//                             <div className="col-lg-12 mb-5">
//                                 <div className="grey_box test">
//                                     <div className="row">
//                                         <div className="col-lg-12">
//                                             <div className="add_form_inner">
//                                                 <div className="row">
//                                                     <div className="col-lg-12 mb-4 inner_heading25">
//                                                         Branch Details
//                                                     </div>
//                                                 </div>
//                                                 <div className="row">
//                                                     <div className="col-md-6">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Branch Number:  </label>
//                                                         </div>
//                                                         <div className="col-lg-12">
//                                                             <input type="text" className="form-control" id="branch_number" value={branchesArray[branchIndex]?.branch_number || ""} name="branch_number" readOnly />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Email address: </label>
//                                                         </div>
//                                                         <div className="col-lg-12">
//                                                             <input type="text" className="form-control" id="branch_email" value={branchesArray[branchIndex]?.branch_email || ""} name="branch_email" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Branch City:  </label>
//                                                         </div>
//                                                         <div className="col-lg-12">
//                                                             <input type="text" className="form-control" id="branch_city" value={branchesArray[branchIndex]?.branch_city || ""} name="branch_city" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Address:</label>
//                                                         </div>
//                                                         <div className="col-lg-12">
//                                                             <input type="text" className="form-control" id="branch_address" value={branchesArray[branchIndex]?.branch_address || ""} name="branch_address" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Contact Details:  </label>
//                                                         </div>
//                                                         <div className="col-lg-12">
//                                                             <input type="text" className="form-control" id="contact_details" value={branchesArray[branchIndex]?.contact_details || ""} name="contact_details" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Is main branch:</label>
//                                                         </div>
//                                                         <div className="col-lg-12 form_box">
//                                                             <select id="is_main_branch" name="is_main_branch" value={branchesArray[branchIndex]?.is_main_branch} onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))}>
//                                                                 {/* <option value={branchesArray[branchIndex]?.is_main_branch}>{branchesArray[branchIndex]?.is_main_branch}</option> */}
//                                                                 <option value="TRUE">TRUE</option>
//                                                                 <option value="FALSE">FALSE</option>
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Time zone:</label>
//                                                         </div>
//                                                         <div className="col-lg-12 form_box">
//                                                             <select id="time_zone_id" name="time_zone_id" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))}>
//                                                                 <option value={branchesArray[branchIndex]?.time_zone_id}>{branchesArray[branchIndex]?.time_zone_id || ""}</option>
//                                                                 {timeZone.map((id) => (
//                                                                     <option value={id.id} key={id.id}>{id.time_zone_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-6 mb-4">
//                                                         <div className="col-lg-12">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Is active:</label>
//                                                         </div>
//                                                         <div className="col-lg-12 form_box">
//                                                             <select id="is_active" name="is_active" value={branchesArray[branchIndex]?.is_active} onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))}>
//                                                                 {/* <option value={branchesArray[branchIndex]?.is_active}>{branchesArray[branchIndex]?.is_active}</option> */}
//                                                                 <option value="TRUE">TRUE</option>
//                                                                 <option value="FALSE">FALSE</option>
//                                                             </select>
//                                                         </div>
//                                                     </div>



//                                                 </div>

//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>&nbsp;
//                                 <div className="row">
//                                     <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" className="red_button" onClick={handleSubmit} /></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>


//             </>

//     )
//                 }
// export default BranchDetails

// async function getBranch() {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select()
//         .eq('client_id', '3');

//     const { data, error } = await query;
//     if (error) {
//         return [];
//     } else {
//         return data;
//     }
// }
// async function getSector() {

//     let query = supabase
//         .from('leap_sector_type')
//         .select();


//     const { data, error } = await query;
//     if (error) {
//         return [];
//     } else {
//         return data;
//     }
// }
// async function getTimeZone() {

//     let query = supabase
//         .from('leap_time_zone')
//         .select();


//     const { data, error } = await query;
//     if (error) {
//         return [];
//     } else {
//         return data;
//     }
// }

// Branch Details form called from company profile to, can update from here too

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { Client } from '@/app/models/companyModel';
import LeapHeader from '@/app/components/header';
import { ALERTMSG_exceptionString, clientAdminDashboard } from '@/app/pro_utils/stringConstants';
import LeftPannel from '@/app/components/leftPannel';
import Footer from '@/app/components/footer';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';

interface spesificBranchData {
    time_zone_id: '', is_active: any,
    id: any; branch_address: any; branch_city: any; contact_details: any; branch_email: any; branch_number: any; is_main_branch: any;
}
const BranchDetails = () => {

    const [branchesArray, setBranches] = useState<spesificBranchData[]>([{
        id: '',
        branch_address: '',
        branch_city: '',
        contact_details: '',
        branch_email: '',
        branch_number: '',
        time_zone_id: '',
        is_main_branch: false,
        is_active: true,

    }]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [branchIndex, setBranchIndex] = useState(0);
    const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
    const { contextClientID, selectedClientCustomerID } = useGlobalContext();

    const [timeZone, setTimeZone] = useState<TimeZoneModel[]>([]);
    const [currentTimeZone, setCurrentTimeZone] = useState("");
    const [isLoading, setLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        const fetchData = async () => {
            setLoading(true);
            const branches = await getBranch(selectedClientCustomerID.length > 0 ? selectedClientCustomerID : contextClientID);
            setBranches(branches);
            const timezone = await getTimeZone();
            setTimeZone(timezone);
            for(let i=0;i<timeZone.length;i++){

                if(branches[branchIndex].time_zone_id==timeZone[i].id){
                    setCurrentTimeZone(timeZone[i].time_zone);
                }
            }

            try {
                const formData = new FormData();
                formData.append("client_id", selectedClientCustomerID.length > 0 ? selectedClientCustomerID : contextClientID);

                const res = await fetch("/api/clientAdmin/getClientProfile", {
                    method: "POST",
                    body: JSON.stringify({ "client_id": selectedClientCustomerID.length > 0 ? selectedClientCustomerID : contextClientID }),
                });
                const response = await res.json();
                if (res.ok) {
                    setLoading(false);
                    const user = response.clients[0];
                } else {
                    setLoading(false);
                    setShowAlert(true);
                    setAlertTitle("Error")
                    setAlertStartContent(selectedClientCustomerID ? "Failed to get profile" : "Failed to get Customer Branch Details");
                    setAlertForSuccess(1)
                }

            } catch (error) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(1)
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();

        window.addEventListener('scroll', handleScroll);
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const [errors, setErrors] = useState<Partial<spesificBranchData>>({});
    const validate = () => {
        const newErrors: Partial<spesificBranchData> = {};
        if (!branchesArray[branchIndex].branch_number) newErrors.branch_number = "required";



        if (!branchesArray[branchIndex].branch_number) newErrors.branch_number = "required";
        if (!branchesArray[branchIndex].branch_address) newErrors.branch_address = "required";
        if (!branchesArray[branchIndex].branch_city) newErrors.branch_city = "required";
        if (!branchesArray[branchIndex].contact_details) newErrors.contact_details = "required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!branchesArray[branchIndex].branch_email || !emailRegex.test(branchesArray[branchIndex].branch_email)) {
            newErrors.branch_email = "Valid email is required";
        }
        //   if (!formValues.branch_email) newErrors.branch_email = "required";
        //   if (!formValues.time_zone_id) newErrors.time_zone_id = "required";
        if (!branchesArray[branchIndex].is_main_branch) newErrors.is_main_branch = "required";
        if (!branchesArray[branchIndex].is_active) newErrors.is_active = "required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;


    }

    const formData = new FormData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        formData.append("client_id", selectedClientCustomerID.length > 0 ? selectedClientCustomerID : contextClientID);
        formData.append("id", branchesArray[branchIndex].id);

        formData.append("branch_number", branchesArray[branchIndex].branch_number);
        formData.append("branch_address", branchesArray[branchIndex].branch_address);
        formData.append("branch_city", branchesArray[branchIndex].branch_city);
        formData.append("contact_details", branchesArray[branchIndex].contact_details);
        formData.append("branch_email", branchesArray[branchIndex].branch_email);
        formData.append("time_zone_id", branchesArray[branchIndex].time_zone_id);
        formData.append("is_main_branch", branchesArray[branchIndex].is_main_branch);
        formData.append("is_active", branchesArray[branchIndex].is_active);

        try {
            const res = await fetch("/api/clientAdmin/updateBranchDetails", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            if (res.ok) {
                alert(response.message);
            } else {
                alert(response.message);
            }
        } catch (e) {
            alert(e);
        }
    }
    const handleValuesChange = (e: any, id: any) => {
        const { value, name } = e.target;
        setBranches((prev) => {
            const existingComponentIndex = prev.findIndex((item) => item.id === id);
            if (existingComponentIndex > -1) {
                // Update the value for the existing component
                const updatedArray = [...prev];
                name == "branch_address" ? updatedArray[existingComponentIndex].branch_address = value :
                    name == "branch_city" ? updatedArray[existingComponentIndex].branch_city = value :
                        name == "branch_email" ? updatedArray[existingComponentIndex].branch_email = value :
                            name == "branch_number" ? updatedArray[existingComponentIndex].branch_number = value :
                                name == "contact_details" ? updatedArray[existingComponentIndex].contact_details = value :
                                    name == "is_active" ? updatedArray[existingComponentIndex].is_active = value :

                                        updatedArray[existingComponentIndex].is_main_branch = value;
                return updatedArray;
            } else {
                // Add a new component with its value
                return [...prev, {
                    id: id,
                    branch_address: name == "branch_address" ? value : branchesArray[existingComponentIndex].branch_address,
                    branch_city: name == "branch_city" ? value : branchesArray[existingComponentIndex].branch_city,
                    branch_email: name == "branch_email" ? value : branchesArray[existingComponentIndex].branch_email,
                    branch_number: name == "branch_number" ? value : branchesArray[existingComponentIndex].branch_number,
                    contact_details: name == "contact_details" ? value : branchesArray[existingComponentIndex].contact_details,
                    is_main_branch: name == "is_main_branch" ? value : branchesArray[existingComponentIndex].is_main_branch,
                    time_zone_id: name == "time_zone_id" ? value : branchesArray[existingComponentIndex].time_zone_id,
                    is_active: name == "is_active" ? value : branchesArray[existingComponentIndex].is_active,
                }];
            }
        });
        // console.log("this is the salary values ------=------", salaryValuesArray);
    };
    const handleMenuClick = (index: any) => {
        setSelectedLeftMenuItemIndex(index); // Update the state correctly
    };
    return (
        <>
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)


            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}

            <div className="row mb-3">
                <div className="col-lg-12">
                    <div className="row">
                        <div className="col-lg-12">
                            {branchesArray.map((branch, index) => (
                                <div onClick={(e) => {
                                    setBranchIndex(index);
                                     for(let i=0;i<timeZone.length;i++){
                                        if(branch.time_zone_id){
                                        if(parseInt(branch.time_zone_id)==timeZone[i].id){
                                            setCurrentTimeZone(timeZone[i].time_zone);
                                        }
                                    }
                                    }

                                }} className={branchIndex == index ? "announcement_branch_box announcement_branch_box_selected" : "announcement_branch_box"} key={branch.id}>
                                    {branch.branch_number}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {branchesArray.length == 0 ? <h3>No branch details added by customer</h3> :
                <div className="row">
                    <form onSubmit={handleSubmit}>


                        <div className="col-lg-12 mb-5">
                            <div className="grey_box test">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="add_form_inner">
                                            <div className="row">
                                                <div className="col-lg-12 mb-4 inner_heading25">
                                                    Branch Details
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Branch Number:  </label>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <input type="text" className="form-control" id="branch_number" value={branchesArray[branchIndex]?.branch_number || ""} name="branch_number" readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Email Address: </label>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <input type="text" className="form-control" id="branch_email" value={branchesArray[branchIndex]?.branch_email || ""} name="branch_email" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Branch City<span className='req_text'>*</span>:  </label>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <input type="text" className="form-control" id="branch_city" value={branchesArray[branchIndex]?.branch_city || ""} name="branch_city" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
                                                        {errors.branch_city && <span className="error" style={{ color: "red" }}>{errors.branch_city}</span>}

                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Address<span className='req_text'>*</span>:</label>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <input type="text" className="form-control" id="branch_address" value={branchesArray[branchIndex]?.branch_address || ""} name="branch_address" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
                                                        {errors.branch_address && <span className="error" style={{ color: "red" }}>{errors.branch_address}</span>}

                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Contact Details<span className='req_text'>*</span>:  </label>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <input type="text" className="form-control" id="contact_details" value={branchesArray[branchIndex]?.contact_details || ""} name="contact_details" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))} />
                                                        {errors.contact_details && <span className="error" style={{ color: "red" }}>{errors.contact_details}</span>}

                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Is Main Branch<span className='req_text'>*</span>:</label>
                                                    </div>
                                                    <div className="col-lg-12 form_box">
                                                        <select id="is_main_branch" name="is_main_branch" value={branchesArray[branchIndex]?.is_main_branch || branchesArray[branchIndex]?.is_main_branch == "TRUE" ? "TURE" : "FALSE"} onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))}>
                                                            {/* <option value={branchesArray[branchIndex]?.is_main_branch}>{branchesArray[branchIndex]?.is_main_branch}</option> */}
                                                            <option value="TRUE">TRUE</option>
                                                            <option value="FALSE">FALSE</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Time Zone:</label>
                                                    </div>
                                                    <div className="col-lg-12 form_box">
                                                        <select id="time_zone_id" name="time_zone_id" onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))}>
                                                            <option value={branchesArray[branchIndex]?.time_zone_id}>{currentTimeZone || ""}</option>
                                                            {timeZone.map((id) => (
                                                                <option value={id.id} key={id.id}>{id.time_zone}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="col-lg-12">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Is Active<span className='req_text'>*</span>:</label>
                                                    </div>
                                                    <div className="col-lg-12 form_box">
                                                        <select id="is_active" name="is_active" value={branchesArray[branchIndex]?.is_active || branchesArray[branchIndex]?.is_active == "TRUE" ? "TRUE" : "FALSE"} onChange={(e) => (handleValuesChange(e, branchesArray[branchIndex].id))}>
                                                            {/* <option value={branchesArray[branchIndex]?.is_active}>{branchesArray[branchIndex]?.is_active}</option> */}
                                                            <option value="TRUE">TRUE</option>
                                                            <option value="FALSE">FALSE</option>
                                                        </select>
                                                    </div>
                                                </div>



                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>&nbsp;
                            <div className="row">
                                <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" className="red_button" onClick={handleSubmit} /></div>
                            </div>
                        </div>


                    </form>
                </div>}


        </>

    )
}
export default BranchDetails

async function getBranch(client_id: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq('client_id', client_id);

    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }
}

async function getTimeZone() {

    let query = supabase
        .from('leap_time_zone')
        .select();


    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }
}