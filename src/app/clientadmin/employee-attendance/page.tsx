// 'use client'
// import React from 'react'
// import LeapHeader from '@/app/components/header'
// import LeftPannel from '@/app/components/leftPannel'
// import Footer from '@/app/components/footer'
// import LoadingDialog from '@/app/components/PageLoader'
// import { useEffect, useState } from 'react'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import moment from 'moment'
// import { Employee, LeapCustomerAttendanceAPI } from '@/app/models/AttendanceDataModel'
// import dynamic from 'next/dynamic'
// import { leftMenuAttendancePageNumbers } from '@/app/pro_utils/stringRoutes'
// import Select from "react-select";

// // import AttendanceMap from '@/app/components/trackerMap'
// const AttendanceMap = dynamic(() => import('@/app/components/trackerMap'), { ssr: false });


// interface FilterValues {
//     start_date: any,
//     end_date: any,
//     name: any
// }
// interface selectedAttendance {
//     selected_attendanceID: any,
//     selected_date: any,
//     selected_empID: any
//     selected_empName: any
//     selected_empDesignation: any
//     selected_empDepartment: any
// }

// const EmpAttendancePage = () => {


//     const [scrollPosition, setScrollPosition] = useState(0);
//     const { contaxtBranchID, contextClientID, contextRoleID,
//         contextUserName,contextCustomerID,contextEmployeeID,contextLogoURL,contextProfileImage,
//         contextCompanyName,dashboard_notify_activity_related_id,dashboard_notify_cust_id,setGlobalState } = useGlobalContext();
//     const [loadingCursor, setLoadingCursor] = useState(false);
//     const [showMap,setShowMap] =useState(false);
//     const [isDataPresent,setDataPresent] =useState(false);
//     const [empAttendanceData, setEmpAttendanceData] = useState<Employee[]>([]);
//     const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);

//     const [selectedData, setSelectedData] = useState<selectedAttendance>({
//         selected_attendanceID: '',
//         selected_date: '',
//         selected_empName: '',
//         selected_empID: '',
//         selected_empDepartment: '',
//         selected_empDesignation: '',
//     });
//     const [dateRange, setDateRange] = useState<string[]>([]);

//     const [filterValues, setFilterValues] = useState<FilterValues>({
//         name: '',
//         start_date: '',
//         end_date: ''
//     })
//     useEffect(() => {
//         const handleScroll = () => {
//             setScrollPosition(window.scrollY); // Update scroll position
//             const element = document.querySelector('.mainbox');
//             if (window.pageYOffset > 0) {
//                 element?.classList.add('sticky');
//             } else {
//                 element?.classList.remove('sticky');
//             }
//         };
//         window.addEventListener('scroll', handleScroll);

//         setFilterValues({
//             start_date: formatDateYYYYMMDD(new Date()),
//             end_date: formatDateYYYYMMDD(new Date()),
//             name: dashboard_notify_cust_id,
//         })


//         fetchData();
//         return () => {

//             window.removeEventListener('scroll', handleScroll);
//         };



//     }, []);

//     const formatDateYYYYMMDD = (date: any, isTime = false) => {
//         if (!date) return '';
//         const parsedDate = moment(date);

//         if (isTime) return parsedDate.format('HH:mm A');

//         return parsedDate.format('YYYY-MM-DD');
//     };
//     const formatDateDDMMYYYY = (date: any, isTime = false) => {
//         if (!date) return '';
//         const parsedDate = moment(date);

//         if (isTime) return parsedDate.format('HH:mm A');

//         return parsedDate.format('DD/MM/YYYY');
//     };
//     const fetchData = async () => {

//         try {
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
//             formData.append("branch_id", contaxtBranchID);
//             formData.append('start_date', filterValues.start_date || formatDateYYYYMMDD(new Date()));
//             formData.append('end_date', filterValues.end_date || formatDateYYYYMMDD(new Date()));
//             formData.append('emp_name', filterValues.name || dashboard_notify_cust_id);

//             const response = await fetch("/api/clientAdmin/getAllEmployeeAttendance", {
//                 method: "POST",
//                 body: formData,
//             });
//             if (!response.ok) {
//                 alert('Network response was not ok');
//             }

//             const apiResponse = await response.json();
//             setEmpAttendanceData(apiResponse.data);
//             let empNames: any[] = []
//             for(let i=0;i<apiResponse.data.length;i++){

//                 empNames.push({
//                     value: apiResponse.data[i].customer_id,
//                     label: apiResponse.data[i].emp_id+"  "+ apiResponse.data[i].name,
//                 })

//             }
//             setEmployeeNames(empNames);


//             if(dashboard_notify_cust_id.length>0){
//                 const values:any={value: apiResponse.data[0].customer_id, label: apiResponse.data[0].emp_id+"  "+ apiResponse.data[0].name}
//                 setSelectedEmployee(values);
//                 showDatesData(apiResponse.data[0].emp_id)
//                 setShowMap(true);
//                 setShowAttendance(
//                     apiResponse.data[0].leap_customer_attendance[0].attendance_id,
//                     formatDateYYYYMMDD(new Date()),
//                     apiResponse.data[0].emp_id,
//                     apiResponse.data[0].name,
//                     apiResponse.data[0].leap_client_designations.designation_name,
//                     apiResponse.data[0].leap_client_departments.department_name

//                 ) 
//             }else{
//             setSelectedData({
//                 selected_attendanceID: '',
//                 selected_date: '',
//                 selected_empID: '',
//                 selected_empName: '',
//                 selected_empDesignation: '',
//                 selected_empDepartment: '',
//             })
//         }
//             setLoadingCursor(false);


//         } catch (e) {
//             alert("Something went Wrong")
//             console.log(e);

//         }
//     }
//     const resetFilter = async () => {
//         setGlobalState({
//             contextUserName: contextUserName,
//             contextClientID: contextClientID,
//             contaxtBranchID: contaxtBranchID,
//             contextCustomerID: contextCustomerID,
//             contextRoleID: contextRoleID,
//             contextProfileImage: contextProfileImage,
//             contextEmployeeID: contextEmployeeID,
//             contextCompanyName: contextCompanyName,
//             contextLogoURL: contextLogoURL,
//             contextSelectedCustId: '',
//             contextAddFormEmpID: '',
//             contextAnnouncementID: '',
//             contextAddFormCustID: '',
//             dashboard_notify_cust_id: '',
//             dashboard_notify_activity_related_id: '',
//             selectedClientCustomerID: '',
//             isAdmin: '',
//             contextPARAM8: '',
//         });
//         window.location.reload();
//         setFilterValues({
//             start_date: formatDateYYYYMMDD(new Date()),
//             end_date: formatDateYYYYMMDD(new Date()),
//             name: ""
//         });
//         fetchData();
//     }
//     const onFilterSubmit = async () => {
//         setFilterValues({
//             start_date: filterValues.start_date,
//             end_date: filterValues.end_date,
//             name: filterValues.name
//         });

//         setDateRange(generateDateRange(filterValues.start_date, filterValues.end_date));
//         fetchData();
//     }
//     const handleInputChange = async (e: any) => {
//         const { name, value } = e.target;
//         // console.log("Form values updated:", formValues);
//         setFilterValues((prev) => ({ ...prev, [name]: value }));
//     }
//     const handleEmpSelectChange = async(values: any) => {
//         console.log(values);

//         setFilterValues((prev) => ({ ...prev, ["name"]: values.value }));
//         setSelectedEmployee(values)
//         // setBranchArray(branch);
//     };
//     const showDatesData = (empID: string | null) => {
//         console.log("fetch data filterValues.start_date 2");

//         setEmpAttendanceData(prev =>
//             prev.map(emp =>
//                 empID && emp.emp_id === empID
//                     ? { ...emp, showAttendanceData: true }
//                     : { ...emp, showAttendanceData: false } // Ensure all others are set to false
//             )
//         );

//         setDateRange(generateDateRange(filterValues.start_date, filterValues.end_date));

//     };
//     const setShowAttendance = (attendanceID: any, date: any, empID: any, empName: any,
//         empDesignation: any, empDepartment: any) => {


//         window.scrollTo({ top: 60, behavior: "smooth" });   
//         setSelectedData({
//             selected_attendanceID: attendanceID,
//             selected_date: date,
//             selected_empID: empID,
//             selected_empName: empName,
//             selected_empDesignation: empDesignation,
//             selected_empDepartment: empDepartment,
//         })
//     };

//     function checkIfPresent(attendanceData:LeapCustomerAttendanceAPI[],date:any){
//         let isPresent=-1;       
//         attendanceData.map((attendance,index) =>{

//             if(date == attendance.date){
//                 isPresent=index;
//             }        
//         }        
//         );

//         return isPresent;
//     }

//     return (
//         <div className='mainbox'>
//             <header>
//                 <LeapHeader title="Welcome!" />
//             </header>
//             <LeftPannel menuIndex={leftMenuAttendancePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
//                 empAttendanceData.length > 0 ?

//                     <div>
//                         <div className='container'>
//                         <div className={`${loadingCursor ? "cursorLoading" : ""}`}>

//                             <div style={{ backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
//                                 <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
//                                     <div className="col-lg-7">
//                                         Attendance <span>List</span>
//                                     </div>

//                                     <div className="col-lg-5" style={{ textAlign: "right" }}>
//                                         <div className="row" >

//                                             <div className="col-lg-12">

//                                                 <a className="red_button" >Export All</a>&nbsp;
//                                                 <a className="red_button" >Export Selected</a>&nbsp;
//                                                 {/* <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div> */}

//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row" style={{ marginBottom: "20px" }}>
//                                     <div className="col-lg-12">
//                                         <div className="attendance_filter_box" id="filter_whitebox_open">
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-lg-3">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Name:</label>
//                                                         {/* <input type="text" className="form-control" value={filterValues.name} name="name" onChange={handleInputChange} id="firstName" placeholder="Enter First Name" /> */}
//                                                         <Select
//                                         value={selectedEmployee}
//                                         options={employeeName}
//                                         onChange={(selectedOption) =>
//                                             handleEmpSelectChange(selectedOption)
//                                         }
//                                         placeholder="Select..."
//                                         isSearchable
//                                     />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-3">

//                                                     <div className="form_box mb-3">

//                                                         <label htmlFor="formFile" className="form-label">Start Date:</label>
//                                                         <input type="date" name="start_date" value={filterValues.start_date} onChange={handleInputChange} />

//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-3">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="formFile" className="form-label">End Date: </label>
//                                                         <input type="date" id="date" name="end_date" value={filterValues.end_date} onChange={handleInputChange} />


//                                                     </div>
//                                                 </div>
//                                                 <div className="col-lg-3">
//                                                     <div className="form_box mb-3">

//                                                         <a className={`red_button ${loadingCursor?"loading":""}`}  onClick={() =>{setLoadingCursor(true), onFilterSubmit()}}>Submit</a>&nbsp;
//                                                         <a className="red_button" onClick={() => resetFilter()}>Reset</a>&nbsp;
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>

//                             <div className="row ">
//                                 <div className="col-lg-4">

//                                     <div className="row mb-5">
//                                         <div className="col-lg-12">
//                                             <div className="grey_box" style={{ backgroundColor: "#fff" }} >
//                                                 <div className="row list_label mb-4">
//                                                     <div className="col-lg-6 text-center"><div className="label">Employee ID</div></div>
//                                                     <div className="col-lg-6 text-center"><div className="label">Employee Name</div></div>

//                                                 </div>
//                                                 {empAttendanceData.map((emp) => (
//                                                     <div className="row list_listbox" key={emp.emp_id} >
//                                                         <div className="row" style={{cursor:"pointer"}} onClick={() => {setShowMap(false), showDatesData(emp.emp_id)}}>
//                                                         <div className="col-lg-6 text-center">{emp.emp_id}</div>
//                                                         <div className="col-lg-6 text-center" >{emp.name}</div>
//                                                         </div>
//                                                         {emp.showAttendanceData ?
//                                                             <>
//                                                                 <div className="row list_label mb-4">
//                                                                     {/* <div className="col-lg-5 text-center"><div className="label">Date</div></div>
//                                                                     <div className="col-lg-5 text-center"><div className="label">Status</div></div> */}

//                                                                 </div>
//                                                                 {dateRange.map((date, dateRangeindex) => {
//                                                                     const isPresentIndex=checkIfPresent(emp.leap_customer_attendance,date);
//                                                                     return(
//                                                                     <div className="row list_listbox" key={dateRangeindex}>
//                                                                         <div className="col-lg-5 text-center"  >{date}</div>
//                                                                         <div className="col-lg-7">
//                                                                             {
//                                                                                 isPresentIndex>=0?<div className="col-lg-8"  >
//                                                                                 <div className="row">
//                                                                                     <div className="col-lg-6 text-center">Present</div>
//                                                                                     <div className="col-lg-6 text-center" >
//                                                                                         <img src="/images/ic_eye.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center", cursor:"pointer" }}
//                                                                                             onClick={() => {
//                                                                                                 console.log("show image on click called", emp.leap_customer_attendance[isPresentIndex].attendance_id);
//                                                                                                 setShowMap(true)

//                                                                                                 setShowAttendance(
//                                                                                                     emp.leap_customer_attendance[isPresentIndex].attendance_id,
//                                                                                                     date,
//                                                                                                     emp.emp_id,
//                                                                                                     emp.name,
//                                                                                                     emp.leap_client_designations!=null?emp.leap_client_designations!.designation_name: "--",
//                                                                                                     emp.leap_client_departments!=null?emp.leap_client_departments!.department_name :"--")
//                                                                                             }}
//                                                                                         /></div>
//                                                                                 </div></div> :<div className="col-lg-5 text-center">Absent</div>


//                                                                             // emp.leap_customer_attendance.length > 0 ? emp.leap_customer_attendance.map((attendance) =>{

//                                                                             }
//                                                                         </div>
//                                                                     </div>
//                                                                     )
//                                                                 })}


//                                                             </> : <></>
//                                                         }

//                                                     </div>
//                                                 ))}

//                                             </div>
//                                         </div>

//                                     </div>
//                                 </div>
//                                 <div className="col-lg-8 mr-5">
//                                 {showMap ?
//                                         <AttendanceMap attendanceID={selectedData.selected_attendanceID}
//                                             date={selectedData.selected_date}
//                                             empName={selectedData.selected_empName}
//                                             empID={selectedData.selected_empID}
//                                             empDesignation={selectedData.selected_empDesignation}
//                                             empDepartment={selectedData.selected_empDepartment}
//                                         />:<></>
//                                     }
//                                 </div>

//                             </div>



//                         </div>
//                         </div>
//                     </div>


//                     : <LoadingDialog isLoading={true} />} />


//             <div>
//                 <Footer />
//             </div>
//         </div>
//     )
// }

// export default EmpAttendancePage;

// const generateDateRange = (start: string, end: string) => {
//     if (!start || !end) return []; // Avoid generating if dates are not selected

//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const tempDates: string[] = [];

//     while (startDate <= endDate) {

//         tempDates.push(startDate.toISOString().split("T")[0]); // Converts to YYYY-MM-DD format
//         startDate.setDate(startDate.getDate() + 1);
//     }
//     console.log("this is the temp dates", tempDates);

//     return tempDates;

// };


////// design changes shared by swapnil on 11th april 2025

'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import moment from 'moment'
import { Employee, LeapCustomerAttendanceAPI } from '@/app/models/AttendanceDataModel'
import dynamic from 'next/dynamic'
import { leftMenuAttendancePageNumbers, pageURL_attendanceDetails } from '@/app/pro_utils/stringRoutes'
import Select from "react-select";
import { useRouter } from 'next/navigation'
import { staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { el } from 'date-fns/locale'

// import AttendanceMap from '@/app/components/trackerMap'
const AttendanceMap = dynamic(() => import('@/app/components/trackerMap'), { ssr: false });


interface FilterValues {
    
    name: any
}
interface selectedAttendance {
    selected_attendanceID: any,
    selected_date: any,
    selected_empID: any
    selected_empName: any
    selected_empDesignation: any
    selected_empDepartment: any
}

const EmpAttendancePage = () => {


    const [scrollPosition, setScrollPosition] = useState(0);
    const { contaxtBranchID, contextClientID, contextRoleID,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName, dashboard_notify_activity_related_id,isAdmin, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [empAttendanceData, setEmpAttendanceData] = useState<Employee[]>([]);
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const router = useRouter();

    const [isLoading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [filterValues, setFilterValues] = useState<FilterValues>({
        name: '',
    })
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
        window.addEventListener('scroll', handleScroll);

        setFilterValues({
            
            name: dashboard_notify_cust_id,
        })


        fetchData();
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };



    }, []);

    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    const fetchData = async () => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);
            formData.append('customer_id', filterValues.name );

            const response = await fetch("/api/clientAdmin/getAllEmployee", {
                method: "POST",
                body: formData,
            });
            const apiResponse = await response.json();
            if (!response.ok) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get customer profile");
                setAlertForSuccess(2)
            }
            else if(apiResponse.status!=1){
                
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get customer profile");
                setAlertForSuccess(2)
            }else if(apiResponse.status==1){

            
            setEmpAttendanceData(apiResponse.data);
            let empNames: any[] = []
            for (let i = 0; i < apiResponse.data.length; i++) {

                empNames.push({
                    value: apiResponse.data[i].customer_id,
                    label: apiResponse.data[i].emp_id + "  " + apiResponse.data[i].name,
                })

            }
            setEmployeeNames(empNames);


            //     if(dashboard_notify_cust_id.length>0){
            //         const values:any={value: apiResponse.data[0].customer_id, label: apiResponse.data[0].emp_id+"  "+ apiResponse.data[0].name}
            //         setSelectedEmployee(values);
            //         showDatesData(apiResponse.data[0].emp_id)
            //         setShowMap(true);
            //         setShowAttendance(
            //             apiResponse.data[0].leap_customer_attendance[0].attendance_id,
            //             formatDateYYYYMMDD(new Date()),
            //             apiResponse.data[0].emp_id,
            //             apiResponse.data[0].name,
            //             apiResponse.data[0].leap_client_designations.designation_name,
            //             apiResponse.data[0].leap_client_departments.department_name

            //         ) 
            //     }else{
            //     setSelectedData({
            //         selected_attendanceID: '',
            //         selected_date: '',
            //         selected_empID: '',
            //         selected_empName: '',
            //         selected_empDesignation: '',
            //         selected_empDepartment: '',
            //     })
            // }
            setLoading(false);
            setLoadingCursor(false);
        }


        } catch (e) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Error")
            setAlertStartContent("Failed to get customer profile");
            setAlertForSuccess(2)
            
            console.log(e);

        }
    }
    const resetFilter = async () => {
        
        setFilterValues({
            
            name: ""
        });
        fetchData();
    }

    const handleEmpSelectChange = async (values: any) => {
        console.log(values);

        setFilterValues((prev) => ({ ...prev, ["name"]: values.value }));
        setSelectedEmployee(values)
        // setBranchArray(branch);
    };

    const go_to_details_Page = (customer_id: any) => {
    
        setGlobalState({
            contextUserName: contextUserName,
            contextClientID: contextClientID,
            contaxtBranchID: contaxtBranchID,
            contextCustomerID: contextCustomerID,
            contextRoleID: contextRoleID,
            contextProfileImage: contextProfileImage,
            contextEmployeeID: contextEmployeeID,
            contextCompanyName: contextCompanyName,
            contextLogoURL: contextLogoURL,
            contextSelectedCustId: '',
            contextAddFormEmpID: '',
            contextAnnouncementID: '',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: customer_id,
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            isAdmin: isAdmin,
            contextPARAM8: '',

        });
        router.push(pageURL_attendanceDetails)


    };


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            
            <LeftPannel menuIndex={leftMenuAttendancePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                    <div>
                        <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                    setShowAlert(false)
                                }} onCloseClicked={function (): void {
                                    setShowAlert(false)
                                }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                        <div className='container'>
                            <div className={`${loadingCursor ? "cursorLoading" : ""}`}>

                                    <div className='inner_heading_sticky'>
                                        <div className="row heading25 pt-2" style={{ alignItems: "center", backgroundColor:"#ebeff2" }}>
                                            <div className="col-lg-7 mt-1 mb-1 p-0">
                                                Attendance <span>List</span>
                                            </div>

                                            {/* <div className="col-lg-5" style={{ textAlign: "right" }}>
                                                <div className="row" >

                                                    <div className="col-lg-12 mb-2">

                                                        <a className="red_button">Export All</a>&nbsp;&nbsp;
                                                        <a className="red_button red_button2">Export Selected</a>

                                                    </div>

                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="row" style={{ marginBottom: "20px" }}>
                                            <div className="col-lg-12 p-0">
                                                <div className="filter_whitebox filter_whitebox_open" id="filter_whitebox_open">
                                                    <div className="row" style={{ alignItems: "center" }}>
                                                        <div className="col-lg-3">
                                                            <div className="form_box mb-2">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Name:</label>
                                                                {/* <input type="text" className="form-control" value={filterValues.name} name="name" onChange={handleInputChange} id="firstName" placeholder="Enter First Name" /> */}
                                                                <Select
                                                                    value={selectedEmployee}
                                                                    options={employeeName}
                                                                    onChange={(selectedOption) =>
                                                                        handleEmpSelectChange(selectedOption)
                                                                    }
                                                                    placeholder="Select..."
                                                                    isSearchable
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3">
                                                            <div className="form_box mb-2 mt-2">
                                                                <a className={`red_button filter_submit_btn ${loadingCursor ? "loading" : ""}`} onClick={() => { setLoadingCursor(true), fetchData() }}>Submit</a>&nbsp;
                                                                <a className="red_button filter_submit_btn" onClick={() => resetFilter()}>Reset</a>&nbsp;
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                <div className="row ">
                                    <div className="col-lg-12">
                                        <div className="row mb-3 attendance_headingbox" style={{ fontFamily: "Outfit-SemiBold" }}>
                                            <div className="col-lg-3"><span>Name</span></div>
                                            <div className="col-lg-1 text-center"><span>Emp ID</span></div>
                                            <div className="col-lg-3 text-center"><span>Designation</span></div>
                                            <div className="col-lg-2 text-center"><span>Department</span></div>
                                            <div className="col-lg-2 text-center"><span>Contact No.</span></div>
                                            <div className="col-lg-1 text-center"><span>Action</span></div>
                                        </div>
                                        {empAttendanceData.map((emp) => (
                                            <div className='attendance_listbox' key={emp.emp_id}>
                                                <div className="row"  style={{ cursor: "pointer" }} onClick={() => { go_to_details_Page(emp.customer_id) }}>
                                                    <div className="col-lg-3 attendance_memberimg" style={{ paddingLeft: "60px" }}><img src={emp.profile_pic != null && emp.profile_pic.length > 0 ? process.env.NEXT_PUBLIC_BASE_URL + emp.profile_pic : "/images/user.png"} className="img-fluid" />{emp.name}</div>
                                                    <div className="col-lg-1 text-center">{emp.emp_id}</div>
                                                    <div className="col-lg-3 text-center">{emp.leap_client_designations?.designation_name || "--"}</div>
                                                    <div className="col-lg-2 text-center">{emp.leap_client_departments?.department_name || "--"}</div>
                                                    <div className="col-lg-2 text-center">{emp.contact_number}</div>
                                                    <div className="col-lg-1 text-center">
                                                        <img src={staticIconsBaseURL+"/images/view_icon.png"} className="img-fluid" alt="Search Icon" style={{ width: "20px" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}


                                    </div>


                                </div>



                            </div>
                        </div>
                    </div>


                                    }/>


            <div>
                <Footer />
            </div>
        </div>
    )
}

export default EmpAttendancePage;

const generateDateRange = (start: string, end: string) => {
    if (!start || !end) return []; // Avoid generating if dates are not selected

    const startDate = new Date(start);
    const endDate = new Date(end);
    const tempDates: string[] = [];

    while (startDate <= endDate) {

        tempDates.push(startDate.toISOString().split("T")[0]); // Converts to YYYY-MM-DD format
        startDate.setDate(startDate.getDate() + 1);
    }
    console.log("this is the temp dates", tempDates);

    return tempDates;

};

