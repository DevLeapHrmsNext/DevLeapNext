

'use client'

import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';

import { CustomerProfile, CustomerProfileNew, LeapWorkingType } from '../models/employeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';
import { fetchData } from 'pdfjs-dist/types/src/display/node_utils';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import { error } from 'console';

interface NewPassword {
    password: any,
    confirmPassword: any,
}
export const UserEmployement = () => {
    const [userData, setUserData] = useState<CustomerProfileNew>({
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
        emergency_contact: '',
        contact_name: '',
        relation: '',

        authUuid: '',
        branch_id: 0,
        emp_id: '',
        updated_at: '',
        marital_status: '',
        nationality: '',
        blood_group: '',

        work_location: '',
        probation_period: '',
        official_onboard_date: '',
        alternateContact: '',
        personalEmail: '',
        auth_token: '',
        manager_id: {
            name: '',
            customer_id: 0
        },
        designation_id: {
            designation_id: 0,
            designation_name: ''
        },
        department_id: {
            department_id: 0,
            department_name: ''
        },
        employment_type: {
            employeement_type: '',
            employment_type_id: 0
        },
        work_mode: {
            id: 0,
            type: ''
        },
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
            time_zone_id: '',
            branch_number: '',
            branch_address: '',

            is_main_branch: false,
            contact_details: 0,
            total_employees: 0,
        },
        leap_client: {
            user_id: '',
            client_id: 0,
            parent_id: '',
            created_at: '',
            is_deleted: false,
            updated_at: '',
            is_a_parent: false,
            sector_type: '',
            timezone_id: '',
            company_name: '',
            company_email: '',
            company_number: '',
            company_location: '',
            number_of_branches: 0,
            total_weekend_days: 0,
            company_website_url: '',
            fullday_working_hours: 0,
            halfday_working_hours: 0
        }

    });
    const router = useRouter();
    const { contextClientID, contextRoleID, contextSelectedCustId } = useGlobalContext();


    const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
    const [branchesArray, setBranches] = useState<ClientBranchTableModel[]>([]);
    const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
    const [EmploymentTypeArray, setEmployementTypeArray] = useState<ClientEmployementType[]>([]);
    const [managerArray, setManagerArray] = useState<RoleManagerNameModel[]>([]);
    const [workingTypeArray, setWorkingType] = useState<LeapWorkingType[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [isChecked, setIsChecked] = useState(true);
    const [isConfirmPassChecked, setConfirmPassChecked] = useState(true);

    useEffect(() => {

        fetchData();
    }, []);
    const fetchData = async () => {
        const branches = await getBranches(contextClientID);
        setBranches(branches);
        const designationType = await getDesignations(contextClientID);
        setDesignations(designationType);
        const departmentType = await getDepartments(contextClientID);
        setDepartment(departmentType);
        const managerName = await getManagers();
        setManagerArray(managerName);
        const employmentsType = await getEmploymentType();
        setEmployementTypeArray(employmentsType);
        const workingType = await getWorkingType();
        setWorkingType(workingType);


        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", contextSelectedCustId);

            const res = await fetch("/api/users/getProfile", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "customer_id": contextSelectedCustId
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
    const [errors, setErrors] = useState<Partial<CustomerProfileNew>>({});

    const [passwordErrors, setPassErrors] = useState<Partial<NewPassword>>({});

    const [newPassword, setNewPass] = useState<Partial<NewPassword>>({});

    const handleBlur = (e: any) => {
        const { name } = e.target;
        validateField(name);
    };
    const validateField = (fieldName: string) => {
        const fieldErrors: Partial<CustomerProfileNew> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (fieldName === "email_id") {

            if (!userData.email_id) {
                fieldErrors.email_id = "required";
            } else if (!emailRegex.test(userData.email_id)) {
                fieldErrors.email_id = "Invalid email";
            } else {
                delete errors.email_id;
            }
        }


        // repeat for other fields if needed

        setErrors(prev => ({ ...prev, ...fieldErrors }));
    };
    const handlePasswordBlur = (e: any) => {
        const { name } = e.target;
        validatePasswordField(name);
    };
    const validatePasswordField = (fieldName: string) => {
        const fieldErrors: Partial<NewPassword> = {};
        console.log("validate password is called-----------------");

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/
        if (fieldName === "password") {
            if (newPassword.password && newPassword.password.length < 6) {
                fieldErrors.password = "Password must be at least 6 characters long";
            }
            else if (!passwordRegex.test(newPassword.password)) {
                fieldErrors.password = "Password must be combination of numbers and characters";
            } else {
                delete passwordErrors.password;
            }
        } else {
            if (!newPassword.confirmPassword) {
                fieldErrors.confirmPassword = "required";
            } else if (newPassword.password != newPassword.confirmPassword) {
                fieldErrors.confirmPassword = "Password does not match";
            } else {

                delete passwordErrors.confirmPassword;
            }
        }
        setPassErrors(prev => ({ ...prev, ...fieldErrors }));
    }
    const validate = () => {
        const newErrors: Partial<CustomerProfileNew> = {};
        if (!userData.designation_id) newErrors.designation_id = { designation_id: 0, designation_name: "" };
        if (!userData.department_id) newErrors.department_id = { department_id: 0, department_name: "" };
        if (!userData.manager_id) newErrors.manager_id = { name: "", customer_id: 0 };
        if (!userData.employment_type) newErrors.employment_type = { employeement_type: "", employment_type_id: 0 };
        if (!userData.branch_id) newErrors.branch_id = 0;
        if (!userData.work_mode) newErrors.work_mode = { id: 0, type: "" };
        if (!userData.work_location) newErrors.work_location = "required";
        if (!userData.date_of_joining) newErrors.date_of_joining = "required";

        setErrors(newErrors);

        const validationSuccess =
            Object.keys(newErrors).length === 0
        return validationSuccess;

    }

    const handleSubmit = async (e: React.FormEvent) => {
        {/* Address details 1 */ }
        console.log("userData in employment", userData);
        if (newPassword.password && !newPassword.confirmPassword) {
            const fieldErrors: Partial<NewPassword> = {};

            fieldErrors.confirmPassword = "required";
            setPassErrors(prev => ({ ...prev, ...fieldErrors }));
            return;
            

        }
        if(newPassword.password || newPassword.confirmPassword) return;

        e.preventDefault();
        if (!validate()) return;
        setLoading(true)
        const formData = new FormData();
        formData.append("client_id", userData?.client_id + "");
        formData.append("branch_id", userData.branch_id + '');
        formData.append("customer_id", userData.customer_id + '');
        formData.append("role_id", contextRoleID);
        formData.append("designation_id", userData?.designation_id && userData?.designation_id.designation_id > 0 ? userData?.designation_id.designation_id + "" : "");
        formData.append("department_id", userData?.department_id && userData?.department_id.department_id > 0 ? userData?.department_id.department_id + "" : "");
        formData.append("manager_id", userData?.manager_id && userData?.manager_id.customer_id > 0 ? userData?.manager_id.customer_id + "" : "");
        formData.append("employment_type", userData?.employment_type && userData?.employment_type.employment_type_id > 0 ? userData?.employment_type.employment_type_id + "" : "");
        formData.append("branch_id", userData?.branch_id && userData?.branch_id > 0 ? userData?.branch_id + "" : "");
        formData.append("work_mode", userData?.work_mode && userData?.work_mode.id > 0 ? userData?.work_mode.id + "" : "");
        formData.append("work_location", userData?.work_location + "");
        formData.append("date_of_joining", userData?.date_of_joining + "");
        formData.append("email_id", userData?.email_id + "");
        if (newPassword.password) {
            formData.append("new_password", newPassword.password + "");
        }
        formData.append("password", userData?.email_id + "");
        formData.append("authUuid", userData.authUuid);
        try {

            const res = await fetch("/api/users/updateEmployee/updateEmpEmployment", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            if (res.ok) {
                setLoading(false)
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Data updated successfully");
                setAlertForSuccess(1)

            } else {
                setLoading(false)
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
            }
        } catch (e) {
            setLoading(false)
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("Failed to update data with exception");
            setAlertForSuccess(2)
        }

    }

    function isReadonly() {
        if (contextRoleID == "2" || contextRoleID == "3") {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div>
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)
                if (alertForSuccess == 1) {
                    fetchData();
                }
            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className="row">
                <div className="col-lg-12 mb-5">
                    <div className="grey_box mb-3">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="add_form_inner">
                                    <div className="row">
                                        <div className="col-lg-12 mb-4 inner_heading25">
                                            Employement Details
                                        </div>
                                    </div>

                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Employee ID:  </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <input type="text" className="form-control" id="emp_id" value={userData?.emp_id || ""} name="emp_id" readOnly={isReadonly()} />
                                                {/* (e)=>setFormValues((prev) => ({ ...prev, ["emp_id"]: e.target.value }))} */}
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Designation<span className='req_text'>*</span> : </label>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <select className='form-select' id="designation_id" name="designation_id" value={userData?.designation_id?.designation_id || ""} onChange={(e) => setUserData((prev) => ({
                                                    ...prev,
                                                    designation_id: {
                                                        ...prev.designation_id,
                                                        designation_id: parseInt(e.target.value)
                                                    }
                                                }))}>
                                                    {!userData?.designation_id && <option value="" >Select Designation</option>}
                                                    {designationArray.map((designationType, index) => (
                                                        <option value={designationType.designation_id} key={designationType.designation_id} disabled={isReadonly()}>{designationType.designation_name}</option>
                                                    ))}
                                                </select>
                                                {errors.designation_id && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Department<span className='req_text'>*</span> :  </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_client_departments.department_name} name="middleName" onChange={handleInputChange} /> */}
                                                <select className='form-select' id="department_id" name="department_id" value={userData?.department_id?.department_id || ""} onChange={(e) => setUserData((prev) => ({
                                                    ...prev,
                                                    department_id: {
                                                        ...prev.department_id,
                                                        department_id: parseInt(e.target.value)
                                                    }
                                                }))}>
                                                    {!userData?.department_id && <option value="" >Select Department</option>}
                                                    {departmentArray.map((departmentType, index) => (
                                                        <option value={departmentType.department_id} key={departmentType.department_id} disabled={isReadonly()}>{departmentType.department_name}</option>
                                                    ))}
                                                </select>
                                                {errors.department_id && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Reporting Manager<span className='req_text'>*</span> :</label>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_customer[0]?.name} name="middleName" onChange={handleInputChange} /> */}
                                                <select className='form-select' id="manager_id" name="manager_id" value={userData?.manager_id?.customer_id || ""}
                                                    onChange={(e) =>
                                                        setUserData((prev) => ({
                                                            ...prev,
                                                            manager_id: {
                                                                ...prev.manager_id,
                                                                customer_id: parseInt(e.target.value)
                                                            }
                                                        }))
                                                    }
                                                >
                                                    {!userData?.manager_id && <option value="" >Select Manager</option>}
                                                    {managerArray.map((managerName, index) => (
                                                        <option value={managerName.customer_id} key={managerName.customer_id} disabled={isReadonly()}>{managerName.name}</option>
                                                    ))}
                                                </select>
                                                {errors.manager_id && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Employement Type<span className='req_text'>*</span> :  </label>

                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_employement_type.employeement_type} name="middleName" onChange={handleInputChange} /> */}
                                                <select className='form-select' id="employment_type" name="employment_type"
                                                    value={userData?.employment_type?.employeement_type || ""}
                                                    onChange={(e) =>
                                                        setUserData((prev) => ({
                                                            ...prev,
                                                            employment_type: {
                                                                ...prev.employment_type,
                                                                employment_type_id: parseInt(e.target.value)
                                                            }
                                                        }))
                                                    }>
                                                    {!userData?.employment_type && <option value="" >Select Employement Type</option>}
                                                    {EmploymentTypeArray.map((employmentsType, index) => (
                                                        <option value={employmentsType.employment_type_id} key={employmentsType.employment_type_id} disabled={isReadonly()}>{employmentsType.employeement_type}</option>
                                                    ))}
                                                </select>
                                                {errors.employment_type && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch<span className='req_text'>*</span> :</label>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                {/* <input type="text" className="form-control" id="" value={userData?.leap_client_branch_details.branch_number} name="work_location" onChange={(e)=>setUserData((prev) => ({ ...prev, ['designation_id']: parseInt(e.target.value) }))} /> */}
                                                <select className='form-select' id="branch_id" name="branch_id" onChange={(e) => setUserData((prev) => ({ ...prev, ['branch_id']: parseInt(e.target.value) }))}>
                                                    {!userData?.branch_id && <option value="" >Select Branch</option>}
                                                    {branchesArray.map((branch) => (
                                                        <option value={branch.id} key={branch.id} disabled={isReadonly()}>{branch.branch_number}</option>
                                                    ))}
                                                </select>
                                                {errors.branch_id && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>

                                        </div>
                                    </div>
                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Work Mode<span className='req_text'>*</span> : </label>

                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                {/* <input type="text" className="form-control" id="exampleFormControlInput1" value={userData[0]?.leap_employement_type.employeement_type} name="middleName" onChange={handleInputChange} /> */}
                                                <select className='form-select' id="employment_type" name="work_mode"
                                                    value={userData?.work_mode?.type || ""}
                                                    onChange={(e) =>
                                                        setUserData((prev) => ({
                                                            ...prev,
                                                            work_mode: {
                                                                ...prev.work_mode,
                                                                id: parseInt(e.target.value)
                                                            }
                                                        }))
                                                    }>
                                                    {!userData?.work_mode && <option value="" >Select Working Mode</option>}
                                                    {workingTypeArray.map((workingType, index) => (
                                                        <option value={workingType.id} key={workingType.id} disabled={isReadonly()}>{workingType.type}</option>
                                                    ))}
                                                </select>
                                                {errors.work_mode && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Work Location<span className='req_text'>*</span> :</label>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <input type="text" className="form-control" id="work_location" value={userData?.work_location || ""} readOnly={isReadonly()} name="work_location" onChange={(e) => setUserData((prev) => ({ ...prev, ['work_location']: e.target.value }))} />
                                                {errors.work_location && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{ alignItems: "center" }}>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Date of Joining<span className='req_text'>*</span> :  </label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <input type="date" className="form-control" id="date_of_joining" value={userData?.date_of_joining || ""} readOnly={isReadonly()} name="date_of_joining" onChange={(e) => setUserData((prev) => ({ ...prev, ['date_of_joining']: e.target.value }))} />
                                                {errors.date_of_joining && <span className='error' style={{ color: "red", fontSize: "12px" }}>required*</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Official email<span className='req_text'>*</span>:</label>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <input type="text" className="form-control" onBlur={handleBlur}
                                                    id="email_id" value={userData?.email_id || ""} readOnly={isReadonly()} name="email_id" onChange={(e) => setUserData((prev) => ({ ...prev, ['email_id']: e.target.value }))} />
                                                {errors.email_id && <span className='error' style={{ color: "red", fontSize: "12px" }}>{errors.email_id}</span>}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3" style={{ alignItems: "center" }} >
                                        <div className="col-md-2">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Password :  </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="Form-fields">
                                                {/* <a className="info_icon" >
                                                    <img src={staticIconsBaseURL + "/images/info.png"} alt="Information Icon" width={16} height={16} />
                                                    <div className="tooltiptext tooltip-top " >
                                                        Password must contain combination of character, numbers and symbols.
                                                    </div>
                                                </a> */}
                                                <input

                                                    type="checkbox"
                                                    id="show-password"
                                                    className="show-password"
                                                    checked={isChecked}
                                                    onChange={() => setIsChecked(!isChecked)}

                                                />
                                                <label htmlFor="show-password" className="Control-label Control-label-Update-showPassword">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                        width="32"
                                                        height="32"
                                                        className="svg-toggle-password"
                                                        aria-labelledby="toggle-password-title"
                                                    >
                                                        <title id="toggle-password-title">Hide/Show Password</title>
                                                        <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
                                                        <rect x="20.133" y="2.117" height="44" transform="translate(23.536 -8.587) rotate(45)" className="closed-eye" />
                                                        <rect x="22" y="3.984" width="4" height="44" transform="translate(25.403 -9.36) rotate(45)" style={{ fill: "#fff" }} className="closed-eye" />
                                                    </svg>
                                                </label>
                                                <input

                                                    type="text"
                                                    id="password"
                                                    placeholder=""
                                                    autoComplete="off"
                                                    autoCapitalize="off"
                                                    autoCorrect="off"
                                                    onBlur={handlePasswordBlur}
                                                    pattern=".{6,}"
                                                    className="ControlInput ControlInput--password"
                                                    value={newPassword.password} name="password" onChange={(e) => setNewPass((prev) => ({ ...prev, ['password']: e.target.value }))}
                                                />
                                                {passwordErrors.password && <span className='error' style={{ color: "red", fontSize: "12px" }}>{passwordErrors.password}</span>}

                                            </div>


                                        </div>

                                        <div className="col-md-2">
                                            <div className="form_box">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Confirm Password :  </label>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="Form-fields" >

                                                {/* Checkbox for Show/Hide Password */}
                                                <input
                                                    type="checkbox"
                                                    id="show-password1"
                                                    className="show-password"
                                                    checked={isConfirmPassChecked}
                                                    onChange={() => setConfirmPassChecked(!isConfirmPassChecked)}
                                                />
                                                <label htmlFor="show-password1" className="Control-label Control-label-Update-showPassword">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 48 48"
                                                        width="32"
                                                        height="32"
                                                        className="svg-toggle-password"
                                                        aria-labelledby="toggle-password1-title"
                                                    >
                                                        <title id="toggle-password1-title">Hide/Show Password</title>
                                                        <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
                                                        <rect
                                                            x="20.133"
                                                            y="2.117"
                                                            height="44"
                                                            transform="translate(23.536 -8.587) rotate(45)"
                                                            className="closed-eye"
                                                        />
                                                        <rect
                                                            x="22"
                                                            y="3.984"
                                                            width="4"
                                                            height="44"
                                                            transform="translate(25.403 -9.36) rotate(45)"
                                                            style={{ fill: '#fff' }}
                                                            className="closed-eye"
                                                        />
                                                    </svg>
                                                </label>
                                                {/* Input for Password */}
                                                <input
                                                    type="text"
                                                    id="password1"
                                                    placeholder=""
                                                    autoComplete="off"
                                                    autoCapitalize="off"
                                                    autoCorrect="off"
                                                    onBlur={handlePasswordBlur}
                                                    pattern=".{6,}"
                                                    className="ControlInput ControlInput--password"
                                                    value={newPassword.confirmPassword} name="confirmPassword" onChange={(e) => setNewPass((prev) => ({ ...prev, ['confirmPassword']: e.target.value }))}
                                                />
                                                {passwordErrors.confirmPassword && <span className='error' style={{ color: "red", fontSize: "12px" }}>{passwordErrors.confirmPassword}</span>}

                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {contextRoleID == "2" && <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" disabled={isReadonly()} className={`red_button ${isLoading}:"loading":""`} onClick={handleSubmit} /></div>}
                    </div>
                </div>
            </div>
        </div>
    )
}


async function getBranches(contextClientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select().eq("client_id", contextClientID);

    const { data, error } = await query;
    if (error) {
        return [];
    } else {
        return data;
    }
}

async function getDesignations(client_id: any) {

    let query = supabase
        .from('leap_client_designations')
        .select().eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {


        return [];
    } else {


        return data;
    }
}
async function getDepartments(client_id: any) {

    let query = supabase
        .from('leap_client_departments')
        .select().eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getWorkingType() {

    let query = supabase
        .from('leap_working_type')
        .select();

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
async function getManagers() {
    const clientID = 3;
    let query = supabase
        .from('leap_customer')
        .select("customer_id,emp_id,name,client_id,branch_id")
        .eq("client_id", 3);

    if (clientID == 3) {
        query = query.eq("user_role", 4);
    } else {
        query = query.eq("user_role", 6);
    }

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
    const { data: Designation, error: desigError } = await supabase.from('leap_client_designations').select('*').eq('id', designation_id);
    console.log("this isthe designation got------", Designation);
    if (Designation![0].designation_name.toLowerCase().includes('manager')) {
        userRole = { role: 4, isMAnager: true, isTeamlead: false, isemployee: false }
    } else if (Designation![0].designation_name.toLowerCase().includes('team lead')) {
        userRole = { role: 9, isMAnager: false, isTeamlead: true, isemployee: false }
    }

    return userRole;
}