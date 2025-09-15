// // Add New Branch POP-UP from Company Management Profile Page

// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { Client } from '@/app/models/companyModel';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import { staticIconsBaseURL } from '../pro_utils/stringConstants';

// interface BranchData{
//         time_zone_id: '',is_active:any,
//     id: any; branch_address: any; branch_city: any; contact_details: any; branch_email: any; branch_number: any; is_main_branch: any; 
// }
//  const AddBranchDetails = ({ onClose }: { onClose: () => void}) => {
    
//     const [formValues, setFormValues] = useState<BranchData>({
//         id: '',
//         branch_address: '',
//         branch_city: '',
//         contact_details: '',
//         branch_email: '',
//         branch_number: '',
//         time_zone_id: '',
//         is_main_branch: false,
//         is_active: true,
    
//     });
//     const [scrollPosition, setScrollPosition] = useState(0);
    
//     const [timeZone, setTimeZone] = useState<TimeZoneModel[]>([]);
//     const { contextClientID, contextCustomerID, contaxtBranchID, contextRoleID } = useGlobalContext();


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
          
//             const timezone = await getTimeZone();
//             setTimeZone(timezone);
//         } 
//         fetchData();
        
//         window.addEventListener('scroll', handleScroll);
//         return () => {
           
//             window.removeEventListener('scroll', handleScroll);
//           };
//     }, []);
//     const [errors, setErrors] = useState<Partial<BranchData>>({});
 
//     const validate = () => {
//       const newErrors: Partial<BranchData> = {};

//       if (!formValues.branch_number) newErrors.branch_number = "required";
//       if (!formValues.branch_address) newErrors.branch_address = "required";
//       if (!formValues.branch_city) newErrors.branch_city = "required";
//       if (!formValues.contact_details) newErrors.contact_details = "required";
//       if (!formValues.branch_email) newErrors.branch_email = "required";
//     //   if (!formValues.time_zone_id) newErrors.time_zone_id = "required";
//       if (!formValues.is_main_branch) newErrors.is_main_branch = "required";
//       if (!formValues.is_active) newErrors.is_active = "required";


//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };

// const handleInputChange = (e: any) => {
//     const { name, value, type, files } = e.target;
//     console.log("Form values updated:", formValues);
    
//     setFormValues((prev) => ({ ...prev, [name]: value }));
    
// };
//     const formData = new FormData();

//     const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // if (!validate()) return;

//     formData.append("client_id", contextClientID);

//     formData.append("branch_number", formValues.branch_number);
//     formData.append("branch_address",formValues.branch_address);
//     formData.append("branch_city", formValues.branch_city);
//     formData.append("contact_details",formValues.contact_details);
//     formData.append("branch_email", formValues.branch_email);
//     formData.append("time_zone_id", formValues.time_zone_id);
//     formData.append("is_main_branch", formValues.is_main_branch);
//     formData.append("is_active", formValues.is_active);

//     try{
//         const res = await fetch("/api/client/addClientBranchDetails", {
//             method: "POST",
//             body: formData,
//         });
//         const response=await res.json();
//         if(res.ok){
//             alert(response.message);
//             onClose();
//         }else{
//             alert(response.message);
//         }
//         }catch(e){
//             alert(e);
//         }
//     }
    
//     return (
//             <>

            
//             <div className="loader-overlay">
//             <div className="loader-dialog">
//             <div className="row">
//                 <div className="col-lg-12" style={{textAlign: "right"}}>
//                     <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                      onClick={onClose}/>
//                 </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12 mb-4 inner_heading25 text-center">
//                     Add New Branch
//                     </div>
//                 </div>
//                     <form onSubmit={handleSubmit}>

//                                                 <div className="row">
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Branch Number:  </label>
//                                                             <input type="text" className="form-control" id="branch_number" value={formValues.branch_number} name="branch_number" onChange={handleInputChange} />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Email address: </label>
//                                                             <input type="text" className="form-control" id="branch_email" value={formValues.branch_email} name="branch_email" onChange={handleInputChange}  />
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Branch City:  </label>
//                                                             <input type="text" className="form-control" id="branch_city" value={formValues.branch_city} name="branch_city" onChange={handleInputChange}  />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="row">
//                                                     <div className="col-md-8">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Address:</label>
//                                                             <input type="text" className="form-control" id="branch_address" value={formValues.branch_address}name="branch_address" onChange={handleInputChange}  />
//                                                             {errors.branch_address && <span className="error" style={{color: "red"}}>{errors.branch_address}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Contact Details:  </label>
//                                                             <input type="text" className="form-control" id="contact_details" value={formValues.contact_details} name="contact_details" onChange={handleInputChange}  />                                                                                                                   
//                                                             {errors.contact_details && <span className="error" style={{color: "red"}}>{errors.contact_details}</span>}
//                                                         </div>
//                                                     </div>
                                                    

//                                                 </div>
//                                                 <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label">Is main branch:</label>
//                                                         <select id="is_main_branch" name="is_main_branch" value={formValues.is_main_branch} onChange={handleInputChange} >
//                                                                 <option value="">--</option>
//                                                                 <option value="TRUE">TRUE</option>
//                                                                 <option value="FALSE">FALSE</option>
//                                                             </select>
//                                                             {errors.is_main_branch && <span className="error" style={{color: "red"}}>{errors.is_main_branch}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Time zone:</label>
//                                                             <select id="time_zone_id" name="time_zone_id" onChange={handleInputChange} >
//                                                                 <option value="">Select</option>
//                                                                 {timeZone.map((id) => (
//                                                                     <option value={id.id} key={id.id}>{id.time_zone_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                             {/* {errors.time_zone_id && <span className="error" style={{color: "red"}}>{errors.time_zone_id}</span>} */}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label">Is active:</label>
//                                                             <select id="is_active" name="is_active" value={formValues.is_active} onChange={handleInputChange} >
//                                                                 <option value="">--</option>
//                                                                 <option value="TRUE">TRUE</option>
//                                                                 <option value="FALSE">FALSE</option>
//                                                             </select>
//                                                             {errors.is_active && <span className="error" style={{color: "red"}}>{errors.is_active}</span>}
//                                                         </div>
//                                                     </div>
//                                                 </div>
                                              
//                                                 <div className="row mb-5">
//                                                     <div className="col-lg-12 " style={{ textAlign: "center" }}>
//                                                     <input type='submit' value="Update" className="red_button"  />
//                                                 </div>
                   
//                             </div>
//                     </form>
//                 </div>
//             </div>

                
//             </>
           
//     )
//                 }
// export default AddBranchDetails

// async function getBranch(clientId: any) {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select()
//         .eq('client_id', clientId );

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



// Add New Branch POP-UP from Company Management Profile Page

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { Client } from '@/app/models/companyModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { ALERTMSG_FormExceptionString, apifailedWithException, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';
import LoadingDialog from './PageLoader';

interface BranchData{
        time_zone_id: '',is_active:any,
    id: any; branch_address: any; branch_city: any; contact_details: any; branch_email: any; branch_number: any; is_main_branch: any; 
}
 const AddBranchDetails = ({ onClose }: { onClose: () => void}) => {

      const [loading, setLoading] = useState(false);
      const [showAlert, setShowAlert] = useState(false);
      const [alertForSuccess, setAlertForSuccess] = useState(0);
      const [alertTitle, setAlertTitle] = useState('');
      const [alertStartContent, setAlertStartContent] = useState('');
      const [alertMidContent, setAlertMidContent] = useState('');
      const [alertEndContent, setAlertEndContent] = useState('');
      const [alertValue1, setAlertValue1] = useState('');
      const [alertvalue2, setAlertValue2] = useState('');
    
    const [formValues, setFormValues] = useState<BranchData>({
        id: '',
        branch_address: '',
        branch_city: '',
        contact_details: '',
        branch_email: '',
        branch_number: '',
        time_zone_id: '',
        is_main_branch: false,
        is_active: true,
    
    });
    const [scrollPosition, setScrollPosition] = useState(0);
    
    const [timeZone, setTimeZone] = useState<TimeZoneModel[]>([]);
    const { contextClientID, contextCustomerID, contaxtBranchID, contextRoleID } = useGlobalContext();


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
          
            const timezone = await getTimeZone();
            setTimeZone(timezone);
        } 
        fetchData();
        
        window.addEventListener('scroll', handleScroll);
        return () => {
           
            window.removeEventListener('scroll', handleScroll);
          };
    }, []);
    const [errors, setErrors] = useState<Partial<BranchData>>({});
 
    const validate = () => {
      const newErrors: Partial<BranchData> = {};

      if (!formValues.branch_number) newErrors.branch_number = "required";
      if (!formValues.branch_address) newErrors.branch_address = "required";
      if (!formValues.branch_city) newErrors.branch_city = "required";
      if (!formValues.contact_details) newErrors.contact_details = "required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formValues.branch_email || !emailRegex.test(formValues.branch_email)) {
            newErrors.branch_email = "Valid email is required";
        }
    //   if (!formValues.branch_email) newErrors.branch_email = "required";
    //   if (!formValues.time_zone_id) newErrors.time_zone_id = "required";
      if (!formValues.is_main_branch) newErrors.is_main_branch = "required";
      if (!formValues.is_active) newErrors.is_active = "required";


      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

const handleInputChange = (e: any) => {
    const { name, value, type, files } = e.target;
    console.log("Form values updated:", formValues);
    
    setFormValues((prev) => ({ ...prev, [name]: value }));
    
};
    const formData = new FormData();

    const handleSubmit = async (e: React.FormEvent) => {
        
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    formData.append("client_id", contextClientID);

    formData.append("branch_number", formValues.branch_number);
    formData.append("branch_address",formValues.branch_address);
    formData.append("branch_city", formValues.branch_city);
    formData.append("contact_details",formValues.contact_details);
    formData.append("branch_email", formValues.branch_email);
    formData.append("time_zone_id", formValues.time_zone_id);
    formData.append("is_main_branch", formValues.is_main_branch);
    formData.append("is_active", formValues.is_active);

    try{
        const res = await fetch("/api/client/addClientBranchDetails", {
            method: "POST",
            body: formData,
        });
        const response=await res.json();
        if(res.ok){
            setLoading(false);
          setShowAlert(true);
          setAlertTitle("Success")
          setAlertStartContent("Branch Added");
          setAlertForSuccess(1)
            
        }else{
            setLoading(false);
            setShowAlert(true);
          setAlertTitle("Error")
          setAlertStartContent(response.message);
          setAlertForSuccess(1)
        }
        }catch(e:any){
            console.log(e);
            
            setShowAlert(true);
          setAlertTitle("Error")
          setAlertStartContent(ALERTMSG_FormExceptionString);
          setAlertForSuccess(1)
            alert(e);
        }
    }
    
    return (
  
            <div className="">
                <LoadingDialog isLoading={loading}/>
                
                {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                            if(alertForSuccess==1){onClose()}
                            

                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                <div className='rightpoup_close' onClick={onClose}>
                    <img src={staticIconsBaseURL+"/images/close_white.png"} alt="Search Icon" title='Close'/>
                </div>
                <div className="row">
                {/* <div className="col-lg-12" style={{textAlign: "right"}}>
                    <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right", cursor:"pointer" }}
                     onClick={onClose}/>
                </div> */}
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">Add New Branch</div>
                </div>
                    <form onSubmit={handleSubmit}>

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Branch Number<span className='req_text'>*</span> :  </label>
                                                            <input type="text" className="form-control" id="branch_number" value={formValues.branch_number} name="branch_number" onChange={handleInputChange} />
                                                            {errors.branch_number && <span className="error" style={{color: "red"}}>{errors.branch_number}</span>}

                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Branch City<span className='req_text'>*</span> :  </label>
                                                            <input type="text" className="form-control" id="branch_city" value={formValues.branch_city} name="branch_city" onChange={handleInputChange}  />
                                                            {errors.branch_city && <span className="error" style={{color: "red"}}>{errors.branch_city}</span>}

                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Email Address: </label>
                                                            <input type="text" className="form-control" id="branch_email" value={formValues.branch_email} name="branch_email" onChange={handleInputChange}  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Address<span className='req_text'>*</span> :</label>
                                                            <input type="text" className="form-control" id="branch_address" value={formValues.branch_address}name="branch_address" onChange={handleInputChange}  />
                                                            {errors.branch_address && <span className="error" style={{color: "red"}}>{errors.branch_address}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Contact Details<span className='req_text'>*</span> :  </label>
                                                            <input type="text" className="form-control" id="contact_details" value={formValues.contact_details} name="contact_details" onChange={handleInputChange}  />                                                                                                                   
                                                            {errors.contact_details && <span className="error" style={{color: "red"}}>{errors.contact_details}</span>}
                                                        </div>
                                                    </div>
                                                    

                                                </div>
                                                <div className="row" style={{ alignItems: "center" }}>
                                                <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label">Is main branch<span className='req_text'>*</span> :</label>
                                                        <select id="is_main_branch" name="is_main_branch" value={formValues.is_main_branch} onChange={handleInputChange} >
                                                                <option value="">--</option>
                                                                <option value="TRUE">Yes</option>
                                                                <option value="FALSE">No</option>
                                                            </select>
                                                            {errors.is_main_branch && <span className="error" style={{color: "red"}}>{errors.is_main_branch}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Time zone:</label>
                                                            <select id="time_zone_id" name="time_zone_id" onChange={handleInputChange} >
                                                                <option value="">Select</option>
                                                                {timeZone.map((id) => (
                                                                    <option value={id.id} key={id.id}>{id.time_zone}</option>
                                                                ))}
                                                            </select>
                                                            {/* {errors.time_zone_id && <span className="error" style={{color: "red"}}>{errors.time_zone_id}</span>} */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label">Is active:</label>
                                                            <select id="is_active" name="is_active" value={formValues.is_active} onChange={handleInputChange} >
                                                                <option value="">--</option>
                                                                <option value="TRUE">Yes</option>
                                                                <option value="FALSE">No</option>
                                                            </select>
                                                            {errors.is_active && <span className="error" style={{color: "red"}}>{errors.is_active}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                              
                                                <div className="row mb-5">
                                                    <div className="col-lg-12 ">
                                                    <input type='submit' value="Add" className="red_button"  />
                                                </div>
                            </div>
                    </form>
                </div>
            
    )
                }
export default AddBranchDetails

async function getBranch(clientId: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq('client_id', clientId );

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