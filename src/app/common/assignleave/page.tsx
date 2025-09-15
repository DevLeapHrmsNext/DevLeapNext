// 'use client'
// import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
// import LeapHeader from '@/app/components/header'
// import LeftPannel from '@/app/components/leftPannel' 
// import Footer from '@/app/components/footer'
// import { employeeResponse } from '@/app/models/clientAdminEmployee'
// import { createLeaveTitle } from '@/app/pro_utils/stringConstants'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import { useParams, useRouter } from 'next/navigation';
// import { CustomerProfile } from '@/app/models/employeeDetailsModel'
// import { LeaveType } from '@/app/models/leaveModel'
// import { pageURL_leaveListingPage, leftMenuLeavePageNumbers } from '@/app/pro_utils/stringRoutes'
// import { LeapClientBranchDetail } from '@/app/models/companyModel'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import BackButton from '@/app/components/BackButton'

// interface AssignEmpLeave {
//     client_id: string,
//     branchID: string,
//     customerID: string,
//     leaveType: string,
//     fromDate: string,
//     toDate: string,
//     remark: string,
//     duration: string,
// }

// const AssignLeave : React.FC = () => {
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [empArray, setEmp] = useState<CustomerProfile[]>([]);
//   const [leaveArray, setLeave] = useState<LeaveType[]>([]);
//   const [branchArray, setBranchArray] = useState<LeapClientBranchDetail[]>([]);
//   const [selectedBranchID, setSelectedBranchID] = useState<string>("");
//   const [isHalfDayDisabled, setIsHalfDayDisabled] = useState(false);
//   const {contextClientID}=useGlobalContext();

//   const handleBranchIDChange = async (e: ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedBranchID(value);
//     const emp = await getEmployee(value);
//         setEmp(emp);
// };
//   const router = useRouter()

//   useEffect(() => {
//       const fetchData = async () => {
//         const leavetype = await getLeave();
//         setLeave(leavetype);

//         const branches = await getBranch();
//         setBranchArray(branches);
//   };
//   fetchData();
//   const handleScroll = () => {
//       setScrollPosition(window.scrollY); // Update scroll position
//       const element = document.querySelector('.mainbox');
// if (window.pageYOffset > 0) {
//   element?.classList.add('sticky');
// } else {
//   element?.classList.remove('sticky');
// }
//     };
//   window.addEventListener('scroll', handleScroll);
//   return () => {

//       window.removeEventListener('scroll', handleScroll);
//     };

//   },[])

//   const [formValues, setFormValues] = useState<AssignEmpLeave>({
//     client_id: "",
//     branchID: "",
//     customerID: "",
//     leaveType: "",
//     fromDate: "",
//     toDate: "",
//     remark: "",
//     duration: "",
//    } );

//    useEffect(() => {
//     if (formValues.fromDate && formValues.toDate && formValues.fromDate == formValues.toDate) {
//         setIsHalfDayDisabled(false);
//     } else {
//         setIsHalfDayDisabled(true);
//     }
// }, [formValues.fromDate, formValues.toDate]);

//   const handleInputChange = async (e: any) => {
//     const { name, value, type, files } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));

//   }

//     const formData = new FormData();
//     const [errors, setErrors] = useState<Partial<AssignEmpLeave>>({});
//     const [selected, setSelected] = React.useState(formValues.duration);

//     const validate = () => {
//       const newErrors: Partial<AssignEmpLeave> = {};
//        if (!formValues.customerID) newErrors.customerID = "required";
//        if (!formValues.leaveType) newErrors.leaveType = "required";
//        if (!formValues.fromDate) newErrors.fromDate = "required";
//        if (!formValues.toDate) newErrors.toDate = "required";
//        if (!formValues.remark) newErrors.remark = "required";
//        if (!formValues.duration && !isHalfDayDisabled) newErrors.duration = "required";

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };

//    const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     console.log("handle submit called");

//      formData.append("client_id", contextClientID);
//      formData.append("branch_id", formValues.branchID);
//      formData.append("customer_id", formValues.customerID);
//      formData.append("leave_type", formValues.leaveType);
//      formData.append("from_date", formValues.fromDate);
//      formData.append("to_date", formValues.toDate);
//      formData.append("leave_remark", formValues.remark);
//      formData.append("duration", formValues.duration);

//     try {
//       const response = await fetch("/api/clientAdmin/leave/assignLeave", {
//           method: "POST",
//           body: formData,

//       });
//       // console.log(response);

//       if (response.ok) {

//           router.push(pageURL_leaveListingPage);
//       } else {
//           alert("Failed to submit form.");
//       }
//   } catch (error) {
//       console.log("Error submitting form:", error);
//       alert("An error occurred while submitting the form.");
//   }
//   }



//     return (
//       <div className='mainbox'>
//       <header>
//       <LeapHeader title={createLeaveTitle} />
//       </header>
//       <LeftPannel menuIndex={leftMenuLeavePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

//               <form onSubmit={handleSubmit}>
//               <div className="container">
//                 <div className="row"> 
//                   <div className="col-lg-8 mb-5">
//                     <div className="grey_box">
//                       <div className="row">
//                         <div className="col-lg-12">
//                           <div className="add_form_inner">
//                             <div className="row">
//                                 <div className="col-lg-12 mb-4 inner_heading25">
//                                     Assign Leave:
//                                 </div>
//                             </div>
//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:</label>
//                                             <select id="branchID" name="branchID" onChange={handleBranchIDChange}>
//                                                 <option value="">Select</option>
//                                                 {branchArray.map((type, index) => (
//                                                     <option value={type.id} key={type.id}>{type.branch_number} </option>
//                                                 ))}
//                                             </select> 
//                                             {/* {errors.customerID && <span className="error" style={{color: "red"}}>{errors.customerID}</span>} */}
//                                         </div>
//                                     </div>
//                                 <div className="col-md-4">
//                                 <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Employee:</label>
//                                             <select id="customerID" name="customerID" onChange={handleInputChange}>
//                                                 <option value="">Select</option>
//                                                 {empArray.length > 0 ? (
//                                                     empArray.map((type) => (
//                                                         <option value={type.customer_id} key={type.customer_id}>{type.emp_id} : {type.name}</option>

//                                                     ))
//                                                 ) : (
//                                                     <option value="" disabled>No Employee exists in this branch</option>
//                                                 )}
//                                                 {/* {empArray.map((type, index) => (
//                                                 ))}*/}
//                                             </select>  
//                                             {errors.customerID && <span className="error" style={{color: "red"}}>{errors.customerID}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Type:  </label>
//                                         <select id="leaveType" name="leaveType" onChange={handleInputChange}>
//                                                 <option value="">Select</option>
//                                                 {leaveArray.map((type, index) => (
//                                                     <option value={type.leave_id} key={type.leave_id}>{type.leave_name}</option>
//                                                 ))}
//                                             </select>
//                                             {errors.leaveType && <span className="error" style={{color: "red"}}>{errors.leaveType}</span>}
//                                     </div>
//                                 </div>
//                             </div> 

//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                     <label htmlFor="exampleFormControlInput1" className="form-label" >From Date:  </label>
//                                     <input type="date" id="fromDate" name="fromDate" value={formValues.fromDate} onChange={handleInputChange} />
//                                             {errors.fromDate && <span className="error" style={{color: "red"}}>{errors.fromDate}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >To Date:  </label>
//                                         <input type="date" id="toDate" name="toDate" value={formValues.toDate} onChange={handleInputChange} />
//                                             {errors.toDate && <span className="error" style={{color: "red"}}>{errors.toDate}</span>}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="row">
//                                 <div className="col-md-4" >
//                                     <div className="form_box mb-3" >
//                                     <label htmlFor="exampleFormControlInput1" className="form-label" >Duration:  </label>
//                                     <div className="row" >
//                                         <div className="col-md-4"><label htmlFor="exampleFormControlInput1">Full day</label></div>
//                                         <div className="col-md-6" style={{alignContent: "center"}}><input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="Full day" onChange={handleInputChange}/></div>
//                                     </div>
//                                     <div className="row" >
//                                         <div className="col-md-4"><label htmlFor="exampleFormControlInput1">1st half</label></div>
//                                         <div className="col-md-6" style={{alignContent: "center"}}><input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="1st half day" onChange={handleInputChange}/></div>
//                                     </div>
//                                     <div className="row" >
//                                         <div className="col-md-4"><label htmlFor="exampleFormControlInput1">2nd half</label></div>
//                                         <div className="col-md-6" style={{alignContent: "center"}}><input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="2nd half day" onChange={handleInputChange}/></div>
//                                     </div>
//                                     {/* <input type="text" id="fromDate" name="fromDate" value={formValues.fromDate} onChange={handleInputChange} /> */}
//                                             {errors.duration && <span className="error" style={{color: "red"}}>{errors.duration}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Remark:  </label>
//                                         <textarea id="remark" name="remark"  value={formValues.remark} onChange={handleInputChange} />
//                                             {errors.remark && <span className="error" style={{color: "red"}}>{errors.remark}</span>}
//                                     </div>
//                                 </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>&nbsp;
//                     <div className="row">
//                             <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton isCancelText={true}/><input type='submit' value="Submit" className="red_button" onClick={handleSubmit} /></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               </form>
//              }
//         />
//     <div>
//       <Footer />
//     </div>
//         </div>
//     )
// }

// export default AssignLeave


// async function getLeave() {

//     let query = supabase
//         .from('leap_client_leave')
//         .select()
//         // .eq("asset_status",1);

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

//   }
//   async function getEmployee(branchTypeID: string) {

//     let query = supabase
//         .from('leap_customer')
//         .select()
//         .eq("branch_id", branchTypeID);

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

//   }
//   async function getBranch() {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select()
//         .eq("client_id","3");

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

//   }




///////swapnil desgin changes on 16 april 2025



'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { ALERTMSG_exceptionString, createLeaveTitle, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { LeaveType } from '@/app/models/leaveModel'
import { pageURL_leaveListingPage, leftMenuLeavePageNumbers } from '@/app/pro_utils/stringRoutes'
import { LeapClientBranchDetail } from '@/app/models/companyModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import BackButton from '@/app/components/BackButton'
import LoadingDialog from '@/app/components/PageLoader'
import ShowAlertMessage from '@/app/components/alert'
import Select from "react-select";


interface AssignEmpLeave {
    client_id: string,
    branchID: string,
    customerID: string,
    leaveType: string,
    fromDate: string,
    toDate: string,
    remark: string,
    duration: string,
}

const AssignLeave: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [empArray, setEmp] = useState<CustomerProfile[]>([]);
    const [leaveArray, setLeave] = useState<LeaveType[]>([]);
    const [branchArray, setBranchArray] = useState<LeapClientBranchDetail[]>([]);
    const [selectedBranchID, setSelectedBranchID] = useState<string>("");
    const [isHalfDayDisabled, setIsHalfDayDisabled] = useState(false);
    const { contextClientID } = useGlobalContext();

    const [isLoading, setLoading] = useState(true);
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const handleBranchIDChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedBranchID(value);
        const emp = await getEmployee(value);
        setEmp(emp);
        let name: any[] = []
            for (let i = 0; i < emp.length; i++) {

                name.push({
                    value: emp[i].customer_id,
                    label: emp[i].emp_id + "  " + emp[i].name,
                })
            }
            setEmployeeNames(name);
    };
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const leavetype = await getLeave();
            const branches = await getBranch();

            if (leavetype.length > 0 && branches.length > 0) {
                setLoading(false);
                setLeave(leavetype);
                setBranchArray(branches);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get data");
                setAlertForSuccess(2)
            }
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

    const [formValues, setFormValues] = useState<AssignEmpLeave>({
        client_id: "",
        branchID: "",
        customerID: "",
        leaveType: "",
        fromDate: "",
        toDate: "",
        remark: "",
        duration: "",
    });

    useEffect(() => {
        if (formValues.fromDate && formValues.toDate && formValues.fromDate == formValues.toDate) {
            setIsHalfDayDisabled(false);
        } else {
            setIsHalfDayDisabled(true);
        }
    }, [formValues.fromDate, formValues.toDate]);

    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));

    }

    const handleEmpSelectChange = async (values: any) => {

        setFormValues((prev) => ({ ...prev, ["customerID"]: values.value }));

    };

    const formData = new FormData();
    const [errors, setErrors] = useState<Partial<AssignEmpLeave>>({});
    const [selected, setSelected] = React.useState(formValues.duration);

    const validate = () => {
        const newErrors: Partial<AssignEmpLeave> = {};
        if (!formValues.branchID) newErrors.branchID = "required";
        if (!formValues.customerID) newErrors.customerID = "required";
        if (!formValues.leaveType) newErrors.leaveType = "required";
        if (!formValues.fromDate) newErrors.fromDate = "required";
        if (!formValues.toDate) newErrors.toDate = "required";
        if (!formValues.remark) newErrors.remark = "required";
        if (!formValues.duration && !isHalfDayDisabled) newErrors.duration = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("handle submit called");

        formData.append("client_id", contextClientID);
        formData.append("branch_id", formValues.branchID);
        formData.append("customer_id", formValues.customerID);
        formData.append("leave_type", formValues.leaveType);
        formData.append("from_date", formValues.fromDate);
        formData.append("to_date", formValues.toDate);
        formData.append("leave_remark", formValues.remark);
        formData.append("duration", formValues.duration);

        try {
            const response = await fetch("/api/clientAdmin/leave/assignLeave", {
                method: "POST",
                body: formData,

            });
            // console.log(response);

            if (response.ok) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Leave assigned successfully");
                setAlertForSuccess(1)
                
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to submit form data");
                setAlertForSuccess(2)
                
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2)
        }
    }



    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={createLeaveTitle} />
            </header>
            <LeftPannel menuIndex={leftMenuLeavePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                            if(alertForSuccess==1){
                                router.push(pageURL_leaveListingPage);
                            }
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                        <div className="row heading25 pt-2">
                            <div className="col-lg-12">Assign <span>Leave:</span></div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8 mb-5 mt-3">
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="add_form_inner">

                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Branch<span className='req_text'>*</span>:</label>
                                                            <select id="branchID" name="branchID" onChange={handleBranchIDChange}>
                                                                <option value="">Select</option>
                                                                {branchArray.map((type, index) => (
                                                                    <option value={type.id} key={type.id}>{type.branch_number} </option>
                                                                ))}
                                                            </select>
                                                            {errors.branchID && <span className="error" style={{color: "red"}}>{errors.branchID}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Employee<span className='req_text'>*</span>:</label>
                                                            {/* <select id="customerID" name="customerID" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {empArray.length > 0 ? (
                                                                    empArray.map((type) => (
                                                                        <option value={type.customer_id} key={type.customer_id}>{type.emp_id} : {type.name}</option>

                                                                    ))
                                                                ) : (
                                                                    <option value="" disabled>No Employee exists in this branch</option>
                                                                )}
                                                                
                                                            </select> */}
                                                            <Select
                                                                                                                    className="custom-select"
                                                                                                                    classNamePrefix="custom"
                                                                                                                    options={employeeName}
                                                                                                                    onChange={(selectedOption) =>
                                                                                                                        handleEmpSelectChange(selectedOption)
                                                                                                                    }
                                                                                                                    placeholder="Search Employee"
                                                                                                                    isSearchable
                                                                                                                />
                                                            {errors.customerID && <span className="error" style={{ color: "red" }}>{errors.customerID}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Type<span className='req_text'>*</span>:  </label>
                                                            <select id="leaveType" name="leaveType" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {leaveArray.map((type, index) => (
                                                                    <option value={type.leave_id} key={type.leave_id}>{type.leave_name}</option>
                                                                ))}
                                                            </select>
                                                            {errors.leaveType && <span className="error" style={{ color: "red" }}>{errors.leaveType}</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >From Date<span className='req_text'>*</span>:  </label>
                                                            <input type="date" id="fromDate" name="fromDate" value={formValues.fromDate} onChange={handleInputChange} />
                                                            {errors.fromDate && <span className="error" style={{ color: "red" }}>{errors.fromDate}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >To Date:  </label>
                                                            <input type="date" id="toDate" name="toDate" value={formValues.toDate} min={formValues.fromDate} onChange={handleInputChange} />
                                                            {errors.toDate && <span className="error" style={{ color: "red" }}>{errors.toDate}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12" >
                                                        <div className="form_box2 mb-3" >
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Duration:  </label>
                                                            <div className="row" >
                                                                <div className="col-lg-12 assionleave_duration_mainbox">
                                                                    <label htmlFor="test1">
                                                                        <input type="radio" id="test1" disabled={isHalfDayDisabled} name="duration" value="Full day" onChange={handleInputChange} />&nbsp;
                                                                        Full day
                                                                    </label>
                                                                    <label htmlFor="test2">
                                                                        <input type="radio" id="test2" disabled={isHalfDayDisabled} name="duration" value="1st half day" onChange={handleInputChange} />&nbsp;
                                                                        1st half
                                                                    </label>
                                                                    <label htmlFor="test3">
                                                                        <input type="radio" id="test3" disabled={isHalfDayDisabled} name="duration" value="2nd half day" onChange={handleInputChange} />&nbsp;
                                                                        2nd half
                                                                    </label>
                                                                </div>

                                                            </div>

                                                            {/* <input type="text" id="fromDate" name="fromDate" value={formValues.fromDate} onChange={handleInputChange} /> */}
                                                            {errors.duration && <span className="error" style={{ color: "red" }}>{errors.duration}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Remark:  </label>
                                                            <textarea className="form-control" style={{ minHeight: "120px", width: "100%" }} id="remark" name="remark" value={formValues.remark} onChange={handleInputChange} />
                                                            {errors.remark && <span className="error" style={{ color: "red" }}>{errors.remark}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>&nbsp;
                                <div className="row">
                                    <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton isCancelText={true} /><input type='submit' value="Submit" className="red_button" onClick={handleSubmit} /></div>
                                </div>
                            </div>
                            <div className='col-lg-4 p-0'><img src={staticIconsBaseURL + "/images/assignleave_img.png"} className="img-fluid" /></div>
                        </div>
                    </div>
                </form>
            }
            />
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default AssignLeave


async function getLeave() {

    let query = supabase
        .from('leap_client_leave')
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
async function getEmployee(branchTypeID: string) {

    let query = supabase
        .from('leap_customer')
        .select()
        .eq("branch_id", branchTypeID);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getBranch() {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq("client_id", "3");

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}