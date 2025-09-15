// 'use client'
// import React, { useEffect, useState } from 'react'
// import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useRouter } from 'next/navigation';
// import { error } from 'console';
// import { Bank, BankDetail, BankModel, SalaryDetail, TotalSalary } from '../models/employeeDetailsModel';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

// export const UserBankDetails = () => {

//     const [salaryComponentsArray, setSalaryComponents] = useState<SalaryComponentsModel[]>([]);

//     const [bankDetails, setbankDetails] = useState<BankDetail>({
//         id: 0,
//         created_at: '',
//         customer_id: 0,
//         client_id: 0,
//         bank_name: '',
//         account_number: '',
//         IFSC_code: '',
//         UAN_number: '',
//         ESIC_number: '',
//         PAN_number: '',
//         updated_at: '',
//         TIN_number: 0,
//         security_insurance_no: 0,
//         branch_name: ''
//     });
//     const [salaryDetails, setSalaryDetails] = useState<SalaryDetail[]>([{
//         id: 0,
//         client_id: 0,
//         branch_id: 0,
//         customer_id: 0,
//         salary_component_id: 0,
//         amount: '',
//         leap_client_salary_components: {
//             client_Salary_compionent_id:0,
//             salary_component_id: 0,
//             leap_salary_components: {
//                 id: 0,
//                 salary_add: false,

//                 salary_component_name: ''
//             }
//         }
//     }]);
//     const [totalSalaryDetails, setTotalSalaryDetails] = useState<TotalSalary>({
//         id: 0,
//         gross_salary: 0,
//         total_deduction: 0,
//         net_pay: 0,
//         customer_id: 0,
//     })

//     const { contextClientID, contextCustomerID, contextRoleID,contextSelectedCustId,contaxtBranchID } = useGlobalContext();

//     const router = useRouter();

//     useEffect(() => {
//         const fetchData = async () => {

//             try {
//                 const formData = new FormData();
//                 formData.append("client_id", contextClientID);
//                 formData.append("customer_id", contextSelectedCustId);
//                 formData.append("role_id", contextRoleID);


//                 const res = await fetch("/api/users/getProfile/getEmpSalaryDetails", {
//                     method: "POST",
//                     body: formData,
//                 });

//                 const response = await res.json();
//                 console.log(response);
//                 if (res.ok) {
//                     const bankDeta = response.data.bankDetails[0];
//                     const salaryData = response.data.salaryDetails;
//                     const totalSalaryData = response.data.totalSalary[0];

//                     setbankDetails(bankDeta);

//                     if (salaryData.length == 0) {
//                         console.log("hello the data is not present conditon called");

//                         const arraySalaryDetails:SalaryDetail[]=[];
//                         const employeebranchID=await getEmployeeBranch(contextClientID,contextSelectedCustId)
//                         const salaryComponents = await getSalaryComponents(contextClientID,employeebranchID);
//                         console.log("this are the salary components retrived",salaryComponents);
//                         // {
//                         //     "id": 22,//this is the leap client salary component id
//                         //     "client_id": 3,
//                         //     "branch_id": 3,
//                         //     "salary_component_id": 2,
//                         //     "is_active": true,
//                         //     "created_at": "2025-03-18T14:01:42+00:00",
//                         //     "updated_at": "2025-03-18T14:01:49.589662+00:00",
//                         //     "pay_accural": 4,
//                         //     "is_deleted": false,
//                         //     "leap_salary_components": {
//                         //         "id": 2,
//                         //         "created_at": "2024-12-31T10:54:28+00:00",
//                         //         "salary_add": true,
//                         //         "updated_at": "2024-12-31T10:54:35.463779+00:00",
//                         //         "is_basic_component": null,
//                         //         "salary_component_name": "HRA",
//                         //         "is_other_component_client_id": null
//                         //     }
//                         // },
//                         setSalaryComponents(salaryComponents);

//                         for(let i=0;i<salaryComponents.length;i++){

//                             const data:SalaryDetail={
//                                 id: 0,
//                                 client_id: bankDetails.client_id?bankDetails.client_id:parseInt(contextClientID),
//                                 branch_id: parseInt(employeebranchID),
//                                 customer_id: bankDetails.customer_id,
//                                 salary_component_id: salaryComponents[i].salary_component_id,
//                                 amount: '',

//                                 leap_client_salary_components: {
//                                     client_Salary_compionent_id:salaryComponents[i].id,
//                                     salary_component_id: salaryComponents[i].salary_component_id,
//                                     leap_salary_components: {
//                                         id: salaryComponents[i].leap_salary_components.id,
//                                         salary_add: salaryComponents[i].leap_salary_components.salary_add,

//                                         salary_component_name: salaryComponents[i].leap_salary_components.salary_component_name || 0
//                                     }
//                                 }
//                             }
//                             arraySalaryDetails.push(data);

//                         }
//                         setSalaryDetails(arraySalaryDetails);


//                     } else {
//                         setSalaryDetails(salaryData);
//                         if(totalSalaryData.length==0){
//                             setTotalSalaryDetails({
//                                 id: 0,
//                                 gross_salary: 0,
//                                 total_deduction: 0,
//                                 net_pay: 0,
//                                 customer_id: parseInt(contextSelectedCustId),
//                             });
//                         }else{
//                         setTotalSalaryDetails(totalSalaryData);
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         }
//         fetchData();
//     }, []);

//     const formData = new FormData();
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         formData.append("customer_id",bankDetails.customer_id? bankDetails.customer_id+'':contextSelectedCustId);
//         formData.append("client_id", bankDetails.client_id?bankDetails.client_id+'':contextClientID);
//         // formData.append("client_id", bankDetails.client_id+'');
//         formData.append("account_number", bankDetails.account_number+'');
//         formData.append("bank_id", bankDetails.id?bankDetails.id+'':"");
//         formData.append("bank_name", bankDetails.bank_name+'');
//         formData.append("branch_name", bankDetails.branch_name+'');
//         formData.append("PAN_number", bankDetails.PAN_number+'');
//         formData.append("IFSC_code", bankDetails.IFSC_code+'');
//         formData.append("TIN_number", bankDetails.TIN_number+'');
//         formData.append("UAN_number", bankDetails.UAN_number+'');
//         formData.append("ESIC_number", bankDetails.ESIC_number+'');
//         formData.append("security_insurance_no", bankDetails.security_insurance_no+'');

//         formData.append("salaryAmountsArray",JSON.stringify(salaryDetails))

//         formData.append("total_salary_table_id", totalSalaryDetails.id+'');
//         formData.append("total_gross_salary", totalSalaryDetails.gross_salary+'');
//         formData.append("total_deduction", totalSalaryDetails.total_deduction+'');
//         formData.append("net_payable_salary", totalSalaryDetails.net_pay+'');


// try{

//             const res = await fetch("/api/users/updateEmployee/updateEmpBankDetails", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response=await res.json();

//             if(res.ok){
//                 alert(response.message);
//             }else{
//                 alert(response.message);
//             }
//             }catch(e){
//                 console.log("this is page exception error",e);

//                 alert(e);
//             }


//     }

//     function calculateGrossAndNet(){
//         let totalGross=0,totalDeduction=0;
//         for(let i=0;i<salaryDetails.length;i++){
//             if(salaryDetails[i].leap_client_salary_components.leap_salary_components.salary_add){
//                 totalGross=totalGross+parseFloat(salaryDetails[i].amount.length>0?salaryDetails[i].amount:"0")
//             }else{
//                 totalDeduction=totalDeduction+parseFloat(salaryDetails[i].amount.length>0?salaryDetails[i].amount:"0")
//             }
//         }
//         setTotalSalaryDetails({
//             id: totalSalaryDetails.id,
//             gross_salary: totalGross,
//             total_deduction: totalDeduction,
//             net_pay: totalGross-totalDeduction,
//             customer_id: totalSalaryDetails.customer_id,
//         })

// }

//     return (
//         <>
//             <form onSubmit={handleSubmit}>
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12 mb-5">

//                             <div className="grey_box">
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="add_form_inner">
//                                             <div className="row">

//                                             </div>
//                                             <div className="row">
//                                                 <div className="col-lg-12 mb-4 inner_heading25">
//                                                     Bank Details
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Account No:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="account_number" value={bankDetails?.account_number || ""} name="account_number" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["account_number"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Bank Name: </label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="bank_name" value={bankDetails?.bank_name || ""} name="bank_name" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["bank_name"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Branch Name:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="branch_name" value={bankDetails?.branch_name ||""} name="branch_name" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["branch_name"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >IFSC code: </label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="IFSC_code" value={bankDetails?.IFSC_code ||""} name="IFSC_code" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["IFSC_code"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >TAX Insurance Number:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="TIN_number" onKeyDown={(e) => {
//                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                     e.preventDefault();
//                                                 }
//                                             }} value={bankDetails?.TIN_number ||""} name="TIN_number" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["TIN_number"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >UAN number:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="UAN_number" value={bankDetails?.UAN_number ||""} name="UAN_number" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["UAN_number"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >ESIC number:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="ESIC_number" value={bankDetails?.ESIC_number ||""} name="ESIC_number" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["ESIC_number"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Social Security Number:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="security_insurance_no" onKeyDown={(e) => {
//                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                     e.preventDefault();
//                                                 }
//                                             }} value={bankDetails?.security_insurance_no ||""} name="security_insurance_no" onChange={(e) => setbankDetails((prev) => ({ ...prev, ["security_insurance_no"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>&nbsp;
//                             <div className="grey_box">
//                                 <div className="row">
//                                     <div className="col-lg-12 mb-5">
//                                         <div className="add_form_inner">
//                                             <div className="row">

//                                             </div>
//                                             <div className="row">
//                                                 <div className="col-lg-12 mb-4 inner_heading25">
//                                                     Salary Details
//                                                 </div>
//                                             </div>
//                                             <div className="row">

//                                                 {salaryDetails.length>0 && salaryDetails.map((salary) => (
//                                                     <div className="col-lg-6" key={salary.salary_component_id}>
//                                                         <div className="row"  style={{ alignItems: "center" }}>
//                                                             <div className="col-md-4">
//                                                                 <div className="form_box mb-3">
//                                                                     <label htmlFor="exampleFormControlInput1" className="form-label" > {salary.leap_client_salary_components.leap_salary_components.salary_component_name} </label>
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-md-8">
//                                                                 <div className="form_box mb-3">
//                                                                     <input type="text" className="form-control" id="amount" value={salary.amount}  
//                                                                     onChange={(e) => {
//                                                                         setSalaryDetails((prev) => {
//                                                                         const existingComponentIndex = prev.findIndex((item) => item.salary_component_id === salary.salary_component_id);
//                                                                         if (existingComponentIndex > -1) {
//                                                                             // Update the value for the existing component
//                                                                             const updatedArray = [...prev];
//                                                                             updatedArray[existingComponentIndex].amount = e.target.value;
//                                                                             return updatedArray;
//                                                                         } else {
//                                                                             // Add a new component with its value
//                                                                             // return [...prev, { amount : e.target.value }];
//                                                                             return [...prev, {
//                                                                                 id: 0,
//                                                                                 client_id: salary.client_id,
//                                                                                 branch_id: salary.branch_id,
//                                                                                 customer_id: salary.customer_id,
//                                                                                 salary_component_id: salary.salary_component_id,
//                                                                                 amount: e.target.value,

//                                                                                 leap_client_salary_components: {
//                                                                                     client_Salary_compionent_id:salary.leap_client_salary_components.client_Salary_compionent_id,
//                                                                                     salary_component_id: salary.leap_client_salary_components.salary_component_id,
//                                                                                     leap_salary_components: {
//                                                                                         id: salary.leap_client_salary_components.leap_salary_components.id,
//                                                                                         salary_add:salary.leap_client_salary_components.leap_salary_components.salary_add,
//                                                                                         salary_component_name: salary.leap_client_salary_components.leap_salary_components.salary_component_name
//                                                                                     }
//                                                                                 }
//                                                                             }];
//                                                                         }

//                                                                     });

//                                                                 }
//                                                                     } />
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row">


//                                     <div className="col-md-4">
//                                         <div className="form_box mb-3">
//                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Gross Salary:</label>
//                                             <input type="text" className="form-control" readOnly onKeyDown={(e) => {
//                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                     e.preventDefault();
//                                                 }
//                                             }} id="gross_salary" name="gross_salary" value={totalSalaryDetails.gross_salary} onChange={(e) => setTotalSalaryDetails((prev) => ({ ...prev, ["gross_salary"]: e.target.value }))} placeholder="Enter gross salary" />
//                                             {/* {errors.gross_salary && <span className='error' style={{color: "red"}}>{errors.gross_salary}</span>} */}

//                                         </div>

//                                     </div>

//                                     <div className="col-md-4">
//                                         <div className="form_box mb-3">
//                                             <label htmlFor="formFile" className="form-label">Total Deduction:</label>
//                                             <input type="text" className="form-control" readOnly onKeyDown={(e) => {
//                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                     e.preventDefault();
//                                                 }
//                                             }} id="total_deduction" placeholder="Enter total deduction" name="total_deduction" value={totalSalaryDetails.total_deduction} onChange={(e) => setTotalSalaryDetails((prev) => ({ ...prev, ["total_deduction"]: e.target.value }))} />
//                                             {/* {errors.total_deduction && <span className='error' style={{color: "red"}}>{errors.total_deduction}</span>} */}

//                                         </div>
//                                     </div>

//                                     <div className="col-md-4">
//                                         <div className="form_box mb-3">
//                                             <label htmlFor="formFile" className="form-label">Net Pay:</label>
//                                             <input type="text" className="form-control" readOnly onKeyDown={(e) => {
//                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                     e.preventDefault();
//                                                 }
//                                             }} id="net_pay" placeholder="Enter net payable salary" name="net_pay" value={totalSalaryDetails.net_pay} onChange={(e) => setTotalSalaryDetails((prev) => ({ ...prev, ["net_pay"]: e.target.value }))} />
//                                             {/* {errors.net_pay && <span className='error' style={{color: "red"}}>{errors.net_pay}</span>} */}

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="row">
//                                 <div className="col-lg-12 " style={{ textAlign: "right" }}>
//                                     <a className="red_button" onClick={() => calculateGrossAndNet()}>Calculate</a>&nbsp;
//                                     <input type='submit' value="Update" className="red_button" onClick={handleSubmit} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </>
//     )
// }



// async function getSalaryComponents(client_id:any,branch_id:any) {
//     console.log(branch_id);

//     let query = supabase
//         .from('leap_client_salary_components')
//         .select("*,leap_salary_components(*)")
//         .eq("client_id", client_id)
//         .eq("branch_id", branch_id)
//         .eq("is_active", true);

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }

// async function getEmployeeBranch(client_id:any,customer_id:any) {

//     let query = supabase
//         .from('leap_customer')
//         .select("branch_id")
//         .eq("client_id", client_id)
//         .eq("customer_id", customer_id)

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return 0;
//     } else {
//         return data[0].branch_id;
//     }

// }

///////////////////// ritika code merge

'use client'
import React, { useEffect, useState } from 'react'
import { Bank, BankDetail } from '../models/userEmployeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

export const UserBankDetails = () => {

    const [bankDetails, setbankDetails] = useState<BankDetail[]>([]);
    const { contextClientID, contextCustomerID, contextRoleID, contextSelectedCustId, contaxtBranchID } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {

            try {

                const res = await fetch("/api/users/getProfile/getEmpSalaryDetails", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID,
                        "role_id": contextRoleID
                    }),
                });
                const response = await res.json();
                if (res.ok) {
                    const bankDeta = response.bankDetails || [];
                    setbankDetails(bankDeta);
                }
            }
            catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);


    return (
        <>
            <div className="container" id='bank_id'>
                <div className="row">
                    <div className="col-lg-12">
                        {/* Bank details start */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Bank Details</div>
                            <div className="d_user_profile_details_listing_box">
                                {bankDetails.map((item, index) => {
                                    const id = item.bank_component_id?.id;
                                    const value = item.component_value || "--";
                                    const label =
                                        id === 1 ? "Bank Name" :
                                            id === 2 ? "Branch Name" :
                                                id === 3 ? "Account No" :
                                                    id === 4 ? "IFSC code" : "--";

                                    return (
                                        <div className="d_user_profile_details_listing" key={index}>
                                            <div className="d_user_profile_details_subheading">{label}</div>
                                            <div className="d_user_profile_details_content">{value}</div>
                                        </div>
                                    );
                                })}

                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
