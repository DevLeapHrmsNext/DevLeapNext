'use client'
import supabase from '@/app/api/supabaseConfig/supabase';
import ShowAlertMessage from '@/app/components/alert';
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import LoadingDialog from '@/app/components/PageLoader';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { addEmpEmployementFormTitle, ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants';
import { pageURL_addUserDocumentsForm, leftMenuAddEmployeePageNumbers, pageURL_userList } from '@/app/pro_utils/stringRoutes';
import { createClient } from '@supabase/supabase-js';
import { Form } from 'multiparty';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface SalaryFormComponent {

    salary_component_id: any
    salary_component_amount: any

}

interface EmploymentForm {
    branchID: string,
    designationID: string,
    departmentID: string,
    managerID: string,
    employmentType: string,
    dateOfJoining: string,
    workLocation: string,
    probationPeriod: string,
    payrollTypeID: string,
    salEffectiveDate: string,
    gross_salary: string,
    total_deduction: string,
    net_pay: string,

}
interface AddEmployeeProps {
    employeeID: any; // Adjust the type as needed
}
const AddEmployeeEmployementDetails: React.FC = () => {
    const { employeeID } = useParams();
    const router = useRouter()

    const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
    const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [managerArray, setManagerArray] = useState<RoleManagerNameModel[]>([]);
    const [EmploymentTypeArray, setEmployementTypeArray] = useState<ClientEmployementType[]>([]);
    const [salaryPayableTypesArray, setSalaryPayableTypes] = useState<SalaryPayableTypesModel[]>([]);
    const [salaryComponentsArray, setSalaryComponents] = useState<SalaryComponentsModel[]>([]);
    const [salaryValuesArray, setSalaryValues] = useState<SalaryFormComponent[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const { contextClientID, contaxtBranchID, contextAddFormEmpID, contextRoleID, contextAddFormCustID } = useGlobalContext();
    const [isLoading,setIsLoading]=useState(true);

        const [showAlert,setShowAlert]=useState(false);
        const [alertForSuccess,setAlertForSuccess]=useState(0);
        const [alertTitle,setAlertTitle]=useState('');
        const [alertStartContent,setAlertStartContent]=useState('');
        const [alertMidContent,setAlertMidContent]=useState('');
        const [alertEndContent,setAlertEndContent]=useState('');
        const [alertValue1,setAlertValue1]=useState('');
        const [alertvalue2,setAlertValue2]=useState('');

    useEffect(() => {
        if(contextAddFormEmpID.length==0 || contextAddFormCustID.length==0 ){
                router.push(pageURL_userList);
            }
        const fetchData = async () => {
            setIsLoading(true);
            const designations = await getDesignations(contextClientID);
            setDesignations(designations);
            const department = await getDepartments(contextClientID);
            setDepartment(department);
            const branch = await getBranches(contextClientID);
            setBranchArray(branch);
            const manager = await getManagers(contextClientID);
            setManagerArray(manager);
            const employmentsType = await getEmploymentType();
            setEmployementTypeArray(employmentsType);
            const salaryPayable = await getSalaryPayableTypes();
            setSalaryPayableTypes(salaryPayable);
            setIsLoading(false);


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
    }, []);

    const [employmentForm, setFormValues] = useState<EmploymentForm>({
        branchID: "",
        designationID: "",
        departmentID: "",
        managerID: "",
        employmentType: "",
        dateOfJoining: "",
        workLocation: "",
        probationPeriod: "",
        payrollTypeID: "",
        salEffectiveDate: "",
        gross_salary: "",
        total_deduction: "",
        net_pay: "",
    });

    const [errors, setErrors] = useState<Partial<EmploymentForm>>({});

    const validate = () => {
        const newErrors: Partial<EmploymentForm> = {};
        if (!employmentForm.branchID) newErrors.branchID = "Branch Name is required";
        if (!employmentForm.designationID) newErrors.designationID = "Designation is required";
        if (!employmentForm.departmentID) newErrors.departmentID = "Department is required";
        if (!employmentForm.managerID) newErrors.managerID = "Manager name is required";
        if (!employmentForm.employmentType) newErrors.employmentType = "Employement Type is required";
        if (!employmentForm.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";
        if (!employmentForm.workLocation) newErrors.workLocation = "Work Location is required";
        if (!employmentForm.probationPeriod) newErrors.probationPeriod = "Probation period is required";
        if (!employmentForm.payrollTypeID) newErrors.payrollTypeID = "Payroll type is required";
        if (!employmentForm.salEffectiveDate) newErrors.salEffectiveDate = "Salary effective date is required";
        if (!employmentForm.gross_salary) newErrors.gross_salary = "Gross salary is not calculated";
        if (!employmentForm.total_deduction) newErrors.total_deduction = "Total deduction is not calculated";
        if (!employmentForm.net_pay) newErrors.net_pay = "Net pay amount is not calculated";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        console.log("Form values updated:", employmentForm);
        if (type === "file") {
            setFormValues((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
        if (name == 'designationID') {
            const userRole = await getDesignationSetUserRole(value);
            console.log(userRole);
        }
        if (name == "branchID") {
            const salaryComponents = await getSalaryComponents(contextClientID, value);
            setSalaryComponents(salaryComponents);
        }
    };
    const handleSalaryValuesChange = (e: any, id: any) => {
        const { value } = e.target;

        setSalaryValues((prev) => {
            const existingComponentIndex = prev.findIndex((item) => item.salary_component_id === id);

            if (existingComponentIndex > -1) {
                // Update the value for the existing component
                const updatedArray = [...prev];
                updatedArray[existingComponentIndex].salary_component_amount = value;
                return updatedArray;
            } else {
                // Add a new component with its value
                return [...prev, { salary_component_id: id, salary_component_amount: value }];
            }
        });

        console.log("this is the salary values ------=------", salaryValuesArray);


    };
    function calculateGrossAndNet() {
        let totalGross = 0, totalDeduction = 0;
        for (let i = 0; i < salaryComponentsArray.length; i++) {
            for (let j = 0; j < salaryValuesArray.length; j++) {
                if (salaryValuesArray[j].salary_component_id == salaryComponentsArray[i].leap_salary_components.id) {
                    if (salaryComponentsArray[i].leap_salary_components.salary_add) {
                        totalGross = totalGross + parseFloat(salaryValuesArray[i].salary_component_amount.length > 0 ? salaryValuesArray[i].salary_component_amount : "0")
                    } else {
                        totalDeduction = totalDeduction + parseFloat(salaryValuesArray[i].salary_component_amount.length > 0 ? salaryValuesArray[i].salary_component_amount : "0")
                    }
                }
            }
        }
        setFormValues((prev) => ({ ...prev, ["gross_salary"]: totalGross+'' }));
        setFormValues((prev) => ({ ...prev, ["total_deduction"]: totalDeduction+'' }));
        setFormValues((prev) => ({ ...prev, ["net_pay"]: totalGross-totalDeduction+"" }));
    }


    const handleSubmit = async (e: React.FormEvent) => {

        // if (validate()) {
        //     alert("Form submitted successfully");
        // }

        e.preventDefault();
        if (!validate()) return;
        console.log("handle submit called");
        setIsLoading(true);
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("customer_id", contextAddFormCustID);
        formData.append("designation_id", employmentForm.designationID);
        formData.append("department_id", employmentForm.departmentID);
        formData.append("manager_id", employmentForm.managerID);
        formData.append("employment_type_id", employmentForm.employmentType);
        formData.append("work_location", employmentForm.workLocation);
        formData.append("date_of_joining", employmentForm.dateOfJoining);
        formData.append("probation_period", employmentForm.probationPeriod);
        formData.append("official_onboard_date", employmentForm.dateOfJoining);
        formData.append("employee_status", "true");
        formData.append("pay_accural_id", employmentForm.payrollTypeID);
        formData.append("salaryAmountsArray", JSON.stringify(salaryValuesArray));
        formData.append("total_gross_salary", employmentForm.gross_salary);
        formData.append("total_deduction", employmentForm.total_deduction);
        formData.append("net_payable_salary", employmentForm.net_pay);

        console.log(formData);


        try {
            const response = await fetch("/api/clientAdmin/addEmployee/addEmploymentDetails", {
                method: "POST",
                body: formData,

            });
            console.log(response);

            if (response.ok) {
                setIsLoading(false);
                setShowAlert(true);
                setAlertTitle("Success");
                setAlertStartContent("Employement details added successfully.");
                setAlertForSuccess(1);
                
            } else {
                setIsLoading(false);
                e.preventDefault();
                setShowAlert(true);
                setAlertTitle("Error");
                setAlertStartContent("Failed to add employement details");
                setAlertForSuccess(2);
                
            }
        } catch (error) {
            setIsLoading(false);
            e.preventDefault();
            console.error("Error submitting form:", error);
            setShowAlert(true);
                setAlertTitle("Exception");
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2);
        }

    }
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={addEmpEmployementFormTitle} />
            </header>
            <LeftPannel menuIndex={leftMenuAddEmployeePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <form onSubmit={handleSubmit}>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length>0?alertMidContent: ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                           router.push(pageURL_addUserDocumentsForm);
                                            setShowAlert(false)
                                        } } onCloseClicked={function (): void {
                                            setShowAlert(false)
                                        } } showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="add_form_inner">
                                                <div className="row">
                                                    <div className="col-lg-12 mb-4">
                                                        <div className="heading25">Employment <span>Details</span></div>
                                                    </div>
                                                </div>
                                                <div className="row">

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Employee ID:</label>
                                                            {/* <div className="fontRed22">{employeeID}</div> */}
                                                            <input value={contextAddFormEmpID} name="empID" readOnly />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Branch:</label>
                                                            <select id="branchID" name="branchID" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {branchArray.map((branch, index) => (
                                                                    <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                                                ))}
                                                            </select>
                                                            {errors.branchID && <span className='error' style={{ color: "red" }}>{errors.branchID}</span>}
                                                        </div>
                                                    </div>


                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Designation:</label>
                                                            <select id="designationID" name="designationID" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {designationArray.map((designation, index) => (
                                                                    <option value={designation.designation_id} key={index}>{designation.designation_name}</option>
                                                                ))}

                                                            </select>
                                                            {errors.designationID && <span className='error' style={{ color: "red" }}>{errors.designationID}</span>}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Department: </label>
                                                            <select id="departmentID" name="departmentID" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {departmentArray.map((dep, index) => (
                                                                    <option value={dep.department_id} key={index}>{dep.department_name}</option>
                                                                ))}
                                                            </select>
                                                            {errors.departmentID && <span className='error' style={{ color: "red" }}>{errors.departmentID}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Reporting Manager/Team Lead: </label>
                                                            <select id="managerID" name="managerID" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {managerArray.map((manager, index) => (
                                                                    <option value={manager.customer_id} key={manager.customer_id}>{manager.name}</option>
                                                                ))}
                                                            </select>
                                                            {errors.managerID && <span className='error' style={{ color: "red" }}>{errors.managerID}</span>}
                                                        </div>
                                                    </div>


                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Employment Type: </label>
                                                            <select id="employmentType" name="employmentType" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {EmploymentTypeArray.map((employement, index) => (
                                                                    <option value={employement.employment_type_id} key={employement.employment_type_id}>{employement.employeement_type}</option>
                                                                ))}
                                                            </select>
                                                            {errors.employmentType && <span className='error' style={{ color: "red" }}>{errors.employmentType}</span>}
                                                        </div>
                                                    </div>


                                                </div>


                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Date of Joining: </label>
                                                            <input type="date" id="dateOfJoining" name="dateOfJoining" value={employmentForm.dateOfJoining} onChange={handleInputChange} />
                                                            {errors.dateOfJoining && <span className='error' style={{ color: "red" }}>{errors.dateOfJoining}</span>}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Work Location:</label>
                                                            <input type="text" className="form-control" id="workLocation" name="workLocation" value={employmentForm.workLocation} onChange={handleInputChange} placeholder="Enter Location" />
                                                            {errors.workLocation && <span className='error' style={{ color: "red" }}>{errors.workLocation}</span>}
                                                        </div>
                                                    </div>


                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Probation Period:</label>
                                                            <input type="text" className="form-control" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} id="probationPeriod" placeholder="Enter Days" name="probationPeriod" value={employmentForm.probationPeriod} onChange={handleInputChange} />

                                                            {errors.probationPeriod && <span className='error' style={{ color: "red" }}>{errors.probationPeriod}</span>}
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* <div className="row">
                                                    <div className="col-lg-12" style={{ textAlign: "right" }}><input type="submit" value="Next" className="red_button" /></div>

                                                </div> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12 mb-5">
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="add_form_inner">
                                                <div className="row">
                                                    <div className="col-lg-12 mb-4">
                                                        <div className="heading25">Salary <span>Details</span></div>
                                                    </div>
                                                </div>

                                                <div className="row">

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Payroll Type: </label>
                                                            <select id="payrollTypeID" name="payrollTypeID" onChange={handleInputChange}>
                                                                <option value="">Select</option>
                                                                {salaryPayableTypesArray.map((sal, index) => (
                                                                    <option value={sal.id} key={sal.id}>{sal.payable_time}</option>
                                                                ))}
                                                            </select>
                                                            {errors.payrollTypeID && <span className='error' style={{ color: "red" }}>{errors.payrollTypeID}</span>}

                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Salary Effective Date: </label>
                                                            <input type="date" id="salEffectiveDate" name="salEffectiveDate" value={employmentForm.salEffectiveDate} onChange={handleInputChange} />
                                                            {errors.salEffectiveDate && <span className='error' style={{ color: "red" }}>{errors.salEffectiveDate}</span>}

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    {salaryComponentsArray.map((salComponent, index) => (


                                                        <div className="col-md-4" key={salComponent.id}>
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="formFile" className="form-label">{salComponent.leap_salary_components.salary_component_name}:</label>
                                                                <input type="text" className="form-control" id="exampleFormControlInput1" name={salComponent.leap_salary_components.id.toString()} onChange={(e) => (handleSalaryValuesChange(e, salComponent.leap_salary_components.id))} />
                                                            </div>
                                                        </div>
                                                    ))}


                                                </div>
                                                <div className="row">


                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Gross Salary:</label>
                                                            <input type="text" className="form-control" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} id="gross_salary" name="gross_salary"  value={employmentForm.gross_salary} onChange={handleInputChange} placeholder="Enter gross salary" />
                                                            {errors.gross_salary && <span className='error' style={{ color: "red" }}>{errors.gross_salary}</span>}

                                                        </div>

                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Total Deduction:</label>
                                                            <input type="text" className="form-control" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} id="total_deduction" placeholder="Enter total deduction" name="total_deduction" value={employmentForm.total_deduction} onChange={handleInputChange} />
                                                            {errors.total_deduction && <span className='error' style={{ color: "red" }}>{errors.total_deduction}</span>}

                                                        </div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Net Pay:</label>
                                                            <input type="text" className="form-control" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} id="net_pay" placeholder="Enter net payable salary" name="net_pay" value={employmentForm.net_pay} onChange={handleInputChange} />
                                                            {errors.net_pay && <span className='error' style={{ color: "red" }}>{errors.net_pay}</span>}

                                                        </div>
                                                    </div>
                                                </div>



                                                <div className="row">
                                                    <div className="col-lg-12" style={{ textAlign: "right" }}>
                                                        <a className="red_button" onClick={() => calculateGrossAndNet()}>Calculate</a>&nbsp;

                                                        <input type="submit" value="Next" className="red_button" />
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            } />
            <Footer />
        </div>
    )
}

export default AddEmployeeEmployementDetails

async function getDesignations(client_id:any) {

    let query = supabase
        .from('leap_client_designations')
        .select('*').eq("client_id",client_id);

    const { data, error } = await query;
    if (error) {


        return [];
    } else {


        return data;
    }
}

async function getDepartments(client_id:any) {

    let query = supabase
        .from('leap_client_departments')
        .select('*').eq("client_id",client_id);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}

async function getBranches(client_id: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select('*')
        .eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getManagers(client_id: any) {
    let query = supabase
        .from('leap_customer')
        .select("customer_id,emp_id,name,client_id,branch_id")
        .eq("client_id", client_id).or("user_role.eq.4,user_role.eq.9");

    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }

}

async function getEmploymentType() {

    let query = supabase
        .from('leap_employement_type')
        .select();

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getSalaryPayableTypes() {

    let query = supabase
        .from('leap_salary_payable_days')
        .select();

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
async function getSalaryComponents(client_id: any, branch_id: any) {

    let query = supabase
        .from('leap_client_salary_components')
        .select("*,leap_salary_components(*)")
        .eq("client_id", client_id)
        .eq("branch_id", branch_id)
        .eq("is_active", true).eq("is_deleted", false);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getDesignationSetUserRole(designation_id: any) {
    let userRole = { role: 5, isMAnager: false, isTeamlead: false, isemployee: true }
    const { data: Designation, error: desigError } = await supabase.from('leap_client_designations').select('*').eq('designation_id', designation_id);
    console.log("this isthe designation got------", Designation);
    if (Designation![0].designation_name.toLowerCase().includes('manager')) {
        userRole = { role: 4, isMAnager: true, isTeamlead: false, isemployee: false }
    } else if (Designation![0].designation_name.toLowerCase().includes('team lead') || Designation![0].designation_name.toLowerCase().includes('lead')) {
        userRole = { role: 9, isMAnager: false, isTeamlead: true, isemployee: false }
    }

    return userRole;
}