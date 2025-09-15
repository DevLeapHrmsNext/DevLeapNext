// //Company Details form component called from company profile to, can update from here too

// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { Client } from '@/app/models/companyModel';
// import LeapHeader from '@/app/components/header';
// import { clientAdminDashboard } from '@/app/pro_utils/stringConstants';
// import LeftPannel from '@/app/components/leftPannel';
// import Footer from '@/app/components/footer';

// interface spesificBranchData{
//     id: number; branch_address: any; branch_city: any; contact_details: any; branch_email: any; branch_number: any; is_main_branch: boolean; 
// }
//  const CompanyProfileDetails = () => {
//     const [compData, setCompData] = useState<Client>({
//         client_id: 3,
//         created_at: '',
//         company_name: '',
//         number_of_branches: '',
//         sector_type: '',
//         company_location: '',
//         company_number: '',
//         company_email: '',
//         fullday_working_hours: '',
//         halfday_working_hours: '',
//         total_weekend_days: '',
//         is_deleted: false,
//         company_website_url: '',
//         timezone_id: '',
//         is_a_parent: true,
//         user_id: '',
//         parent_id: '',
//         updated_at: '',
//         leap_client_branch_details: {
//             id: 0,
//             uuid: '',
//             client_id: 3,
//             dept_name: '',
//             is_active: true,
//             created_at: '',
//             updated_at: '',
//             branch_city: '',
//             branch_email: '',
//             time_zone_id: '',
//             branch_number: '',
//             branch_address: '',
//             is_main_branch: false,
//             contact_details: '',
//             total_employees: ''
//         },
//         leap_sector_type: {
//             id: 0,
//             sector_type: '',
//         }
//   });

//     const [branchesArray, setBranches] = useState<spesificBranchData[]>([{
//         id: 0,
//         branch_address: '',
//         branch_city: '',
//         contact_details: '',
//         branch_email: '',
//         branch_number: '',
//         is_main_branch: false
//     }]);
//     const [sectorArray, setSector] = useState<SectorModel[]>([]);
//     const [scrollPosition, setScrollPosition] = useState(0);

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

//         const fetchData = async () => {
//             const branches = await getBranch();
//             setBranches(branches);
//             const sector = await getSector();
//             setSector(sector);

//             try{
//                 const formData = new FormData();
//                 formData.append("client_id", '3');

//             const res = await fetch("/api/clientAdmin/getClientProfile", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response = await res.json();
//             const user = response.clients[0];
//             setCompData(user);
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
 
//     const validate = () => {
//       const newErrors: Partial<Client> = {};

//       if (!compData.company_name) newErrors.company_name = "required";
//       if (!compData.company_email) newErrors.company_email = "required";
//       if (!compData.company_website_url) newErrors.company_website_url = "required";
//       if (!compData.company_number) newErrors.company_number = "required";
//       if (!compData.company_location) newErrors.company_location = "required";
//       if (!compData.sector_type) newErrors.sector_type = "required";
//       if (!compData.number_of_branches) newErrors.number_of_branches = "required";
//       if (!compData.total_weekend_days) newErrors.total_weekend_days = "required";
//       if (!compData.fullday_working_hours) newErrors.fullday_working_hours = "required";
//       if (!compData.halfday_working_hours) newErrors.halfday_working_hours = "required";      

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };
//     const formData = new FormData();

//     const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     formData.append("client_id", '3');
//     formData.append("company_name", compData.company_name);
//     formData.append("company_email", compData.company_email);
//     formData.append("company_website_url", compData.company_website_url);
//     formData.append("company_number", compData.company_number);
//     formData.append("company_location", compData.company_location);
//     formData.append("sector_type", compData.sector_type);
//     formData.append("number_of_branches", compData.number_of_branches);
//     formData.append("total_weekend_days", compData.total_weekend_days);
//     formData.append("fullday_working_hours", compData.fullday_working_hours);
//     formData.append("halfday_working_hours", compData.halfday_working_hours);

//     try{
//         const res = await fetch("/api/clientAdmin/updateClientProfile", {
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

//     return (
  
//                 <form onSubmit={handleSubmit}>
//                     <div className="col-lg-11 mb-5">  
//                         <div className="grey_box">
//                             <div className="row">
//                                 <div className="col-lg-12">
//                                     <div className="add_form_inner">
                                        
//                                     <div className="row">
//                                         <div className="col-lg-12 mb-4" >
//                                             <div className="row" style={{borderBottom: "1px solid #ced9e2",}}>
//                                                 <div className='col-lg-4'>
//                                                     <div className="option">
//                                                         <a href="#"><img src="/images/logo.png" className="img-fluid" style={{ maxHeight: "100px" ,margin: "0px 0px 10px 0px"}} /><div className="option_label"></div></a>
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-lg-6 mb-2'>
//                                                         <div className="row" style={{fontSize: "21px"}}>
//                                                             <label >{compData?.company_name || ""}</label>
//                                                         </div>
                                                        
//                                                 </div>
//                                                 <div className='col-lg-2'>
//                                                         <div className="row" style={{fontSize: "5px"}}>
//                                                         <a href="#"><img src="/images/edit.png" className="img-fluid" style={{ maxHeight: '20px' }} /><div className="option_label"></div></a>
//                                                         </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                         <div>
//                                             {/* <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-md-6">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Company Name:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-6">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="company_name"  value={compData?.company_name || ""} name="company_name" readOnly />
//                                                     </div>
//                                                 </div>
//                                             </div> */}
//                                             <div className="row" style={{alignItems: "center"}}>

//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Email: </label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="company_email" value={compData?.company_email || ""} name="company_email" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_email']: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Website:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="company_website_url" value={compData?.company_website_url || ""} name="company_website_url" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_website_url']: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Contact number:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="company_number" value={compData?.company_number || ""} name="company_number" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_number']: e.target.value }))} />                                                            
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Location:  </label>

//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="company_location" value={compData?.company_location || ""} name="company_location" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_location']: e.target.value }))} />                                                                                                                    </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Sector:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <select id="employment_type" name="work_mode" onChange={(e)=>setCompData((prev) => ({ ...prev, ['sector_type']: e.target.value }))}>
//                                                             <option value={compData?.leap_sector_type.id|| ""}>{compData?.leap_sector_type.sector_type || ""}</option>
//                                                             {sectorArray.map((id, index) => (
//                                                                 <option value={id.id} key={id.id}>{id.sector_type}</option>
//                                                             ))}
//                                                         </select>             
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Branches:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="number_of_branches"  value={compData?.number_of_branches || ""} name="number_of_branches" readOnly />
//                                                     </div>
//                                                 </div>
//                                                 </div>
//                                                 <div className="row">
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Total weekdays working:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="total_weekend_days" value={compData?.total_weekend_days || ""} name="total_weekend_days" onChange={(e)=>setCompData((prev) => ({ ...prev, ['total_weekend_days']: e.target.value }))} />                                                                                                                    
//                                                     </div>
//                                                 </div>
//                                             </div>       
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Full day working hours:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="fullday_working_hours"  value={compData?.fullday_working_hours || ""} name="fullday_working_hours"  onChange={(e)=>setCompData((prev: any) => ({ ...prev, ['fullday_working_hours']: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{alignItems: "center"}}>
//                                                 <div className="col-lg-12">
//                                                     <div className="form_box">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Full day working hours:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-lg-12">
//                                                     <div className="form_box mb-3">
//                                                     <input type="text" className="form-control" id="halfday_working_hours" value={compData?.halfday_working_hours || ""} name="halfday_working_hours" onChange={(e)=>setCompData((prev) => ({ ...prev, ['halfday_working_hours']: e.target.value }))} />                                                            
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>&nbsp;
//                         <div className="row">
//                                 <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" className="red_button" onClick={handleSubmit} /></div>
//                         </div>
//                     </div>
                
               
//                 </form>
           
//     )
// }

// export default CompanyProfileDetails

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

//Company Details form component called from company profile to, can update from here too

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { Client } from '@/app/models/companyModel';
import LeapHeader from '@/app/components/header';
import { ALERTMSG_exceptionString, clientAdminDashboard, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import LeftPannel from '@/app/components/leftPannel';
import Footer from '@/app/components/footer';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';

interface spesificBranchData{
    id: number; branch_address: any; branch_city: any; contact_details: any; branch_email: any; branch_number: any; is_main_branch: boolean; 
}
 const CompanyProfileDetails = () => {
    const [compData, setCompData] = useState<Client>({
        client_id: 3,
        created_at: '',
        company_name: '',
        number_of_branches: '',
        sector_type: '',
        company_location: '',
        company_number: '',
        company_email: '',
        fullday_working_hours: '',
        halfday_working_hours: '',
        total_weekend_days: '',
        is_deleted: false,
        company_website_url: '',
        timezone_id: '',
        is_a_parent: true,
        user_id: '',
        parent_id: '',
        updated_at: '',
        leap_client_branch_details: {
            id: 0,
            uuid: '',
            client_id: 3,
            dept_name: '',
            is_active: true,
            created_at: '',
            updated_at: '',
            branch_city: '',
            branch_email: '',
            time_zone_id: '',
            branch_number: '',
            branch_address: '',
            is_main_branch: false,
            contact_details: '',
            total_employees: ''
        },
        leap_sector_type: {
            id: 0,
            sector_type: '',
        },
        leap_client_basic_info: [{
            client_id: 0,
            created_at: '',
            updated_at: '',
            company_logo: '',
            company_name: '',
            primary_color: '',
            compnay_websit: '',
            secondary_color: '',
            company_short_name: '',
            client_basic_detail_id: 0
        }]
  });

    const [branchesArray, setBranches] = useState<spesificBranchData[]>([{
        id: 0,
        branch_address: '',
        branch_city: '',
        contact_details: '',
        branch_email: '',
        branch_number: '',
        is_main_branch: false
    }]);
    const [sectorArray, setSector] = useState<SectorModel[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const {contextClientID,selectedClientCustomerID}=useGlobalContext();

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
            const branches = await getBranch(selectedClientCustomerID.length>0?selectedClientCustomerID:contextClientID);
            setBranches(branches);
            const sector = await getSector();
            setSector(sector);

            try{
                

            const res = await fetch("/api/clientAdmin/getClientProfile", {
                method: "POST",
                body: JSON.stringify({"client_id":contextClientID}),
            });
            const response = await res.json();

            if(res.ok){
                
                const user = response.clients[0];
                setCompData(user);
            }else{
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(selectedClientCustomerID?"Failed to get profile":"Failed to get Customer Branch Details");
                setAlertForSuccess(1)
            }
            
            } catch (error) {
                setShowAlert(true);
                            setAlertTitle("Exception")
                            setAlertStartContent(ALERTMSG_exceptionString);
                            setAlertForSuccess(2)
                console.error("Error fetching user data:", error);
            }
        } 
        fetchData();
        
        window.addEventListener('scroll', handleScroll);
        return () => {
           
            window.removeEventListener('scroll', handleScroll);
          };
    }, []);
    const [errors, setErrors] = useState<Partial<Client>>({});
 
    const validate = () => {
      const newErrors: Partial<Client> = {};

    //   if (!compData.company_name) newErrors.company_name = "required";
      if (!compData.company_email) newErrors.company_email = "required";
      if (!compData.company_website_url) newErrors.company_website_url = "required";
    //   if (!compData.company_number) newErrors.company_number = "required";
      if (!compData.company_location) newErrors.company_location = "required";
      if (!compData.sector_type) newErrors.sector_type = "required";
    //   if (!compData.number_of_branches) newErrors.number_of_branches = "required";
    //   if (!compData.total_weekend_days) newErrors.total_weekend_days = "required";
    //   if (!compData.fullday_working_hours) newErrors.fullday_working_hours = "required";
    //   if (!compData.halfday_working_hours) newErrors.halfday_working_hours = "required";      

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };
    const formData = new FormData();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    formData.append("client_id", selectedClientCustomerID.length>0?selectedClientCustomerID:contextClientID);
    formData.append("company_name", compData.company_name);
    formData.append("company_email", compData.company_email);
    formData.append("company_website_url", compData.company_website_url);
    formData.append("company_number", compData.company_number);
    formData.append("company_location", compData.company_location);
    formData.append("sector_type", compData.sector_type);
    formData.append("number_of_branches", compData.number_of_branches);
    formData.append("total_weekend_days", compData.total_weekend_days);
    formData.append("fullday_working_hours", compData.fullday_working_hours);
    formData.append("halfday_working_hours", compData.halfday_working_hours);

    try{
        const res = await fetch("/api/clientAdmin/updateClientProfile", {
            method: "POST",
            body: formData,
        });
        const response=await res.json();
        if(res.ok){
            setShowAlert(true);
                        setAlertTitle("Success")
                        setAlertStartContent(response.message);
                        setAlertForSuccess(1)
        }else{
            setShowAlert(true);
                        setAlertTitle("Exception")
                        setAlertStartContent(response.message);
                        setAlertForSuccess(2)
        }
        }catch(e){
            setShowAlert(true);
                        setAlertTitle("Exception")
                        setAlertStartContent(ALERTMSG_exceptionString);
                        setAlertForSuccess(2)
            
        }
    }

    return (
  
                <form onSubmit={handleSubmit}>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                                setShowAlert(false)
                                            }} onCloseClicked={function (): void {
                                                setShowAlert(false)
                                            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className="col-lg-12 mb-5">  
                        <div className="grey_box">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="add_form_inner">
                                        
                                    <div className="row">
                                        <div className="col-lg-12 mb-4" >
                                            <div className="row" style={{borderBottom: "1px solid #ced9e2",}}>
                                                <div className='col-lg-4'>
                                                    <div className="option">
                                                        <a href="#"><img src={staticIconsBaseURL+"/images/logo.png"} className="img-fluid" style={{ maxHeight: "100px" ,margin: "0px 0px 10px 0px"}} /><div className="option_label"></div></a>
                                                    </div>
                                                </div>
                                                <div className='col-lg-6 mb-2'>
                                                        <div className="row" style={{fontSize: "21px"}}>
                                                            <label >{compData?.company_name || ""}</label>
                                                        </div>
                                                        
                                                </div>
                                                <div className='col-lg-2'>
                                                        <div className="row" style={{fontSize: "5px"}}>
                                                        <a href="#"><img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid" style={{ maxHeight: '20px' }} /><div className="option_label"></div></a>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        <div>
                                            {/* <div className="row" style={{alignItems: "center"}}>
                                                <div className="col-md-6">
                                                    <div className="form_box mb-3">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Company Name:  </label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form_box mb-3">
                                                        <input type="text" className="form-control" id="company_name"  value={compData?.company_name || ""} name="company_name" readOnly />
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="row" style={{alignItems: "center"}}>

                                                <div className="col-lg-12">
                                                    <div className="form_box">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Email<span className='req_text'>*</span>: </label>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="form_box mb-3">
                                                    <input type="text" className="form-control" id="company_email" value={compData?.company_email || ""} name="company_email" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_email']: e.target.value }))} />
                                                     {errors.company_email && <span className='error' style={{ color: "red" }}>{errors.company_email}</span>}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row" style={{alignItems: "center"}}>
                                                <div className="col-lg-12">
                                                    <div className="form_box">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Website<span className='req_text'>*</span>:  </label>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form_box mb-3">
                                                    <input type="text" className="form-control" id="company_website_url" value={compData?.company_website_url || ""} name="company_website_url" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_website_url']: e.target.value }))} />
                                                                                                         {errors.company_email && <span className='error' style={{ color: "red" }}>{errors.company_email}</span>}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row" style={{alignItems: "center"}}>
                                                <div className="col-lg-12">
                                                    <div className="form_box">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Number:</label>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="form_box mb-3">
                                                    <input type="text" className="form-control" id="company_number" value={compData?.company_number || ""} name="company_number" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_number']: e.target.value }))} />                                                            
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row" style={{alignItems: "center"}}>
                                                <div className="col-lg-12">
                                                    <div className="form_box">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Location<span className='req_text'>*</span>:  </label>

                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form_box mb-3">
                                                    <input type="text" className="form-control" id="company_location" value={compData?.company_location || ""} name="company_location" onChange={(e)=>setCompData((prev) => ({ ...prev, ['company_location']: e.target.value }))} />                                                                                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row" style={{alignItems: "center"}}>
                                                <div className="col-lg-12">
                                                    <div className="form_box">
                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Sector<span className='req_text'>*</span>:</label>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="form_box mb-3">
                                                    <select id="employment_type" name="work_mode" onChange={(e)=>setCompData((prev) => ({ ...prev, ['sector_type']: e.target.value }))}>
                                                            <option value={compData?.leap_sector_type.id|| ""}>{compData?.leap_sector_type.sector_type || ""}</option>
                                                            {sectorArray.map((id, index) => (
                                                                <option value={id.id} key={id.id}>{id.sector_type}</option>
                                                            ))}
                                                        </select>             
                                                    </div>
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
           
    )
}

export default CompanyProfileDetails

async function getBranch(client_id:any) {

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
async function getSector() {

    let query = supabase
        .from('leap_sector_type')
        .select();
       

    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }
}