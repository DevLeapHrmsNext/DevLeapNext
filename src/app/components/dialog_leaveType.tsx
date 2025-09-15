// Leave type update dialog called from company leave type list

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';


interface leave_name {
    leave_id: string,
    client_id: string,
    branch_id: string,
    leave_name: string,
    leave_category: string,
    leave_count: string,
    leave_accrual: string,
    gender: string,
    user_role_applicable: string,
    leave_discription: string,
    if_unused: string,
    validPeriod: string
}
const LeaveTypeUpdate = ({ onClose, id }: { onClose: () => void, id: any }) => {
    const [showResponseMessage, setResponseMessage] = useState(false);
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [formValues, setFormValues] = useState<leave_name>({
        client_id: "",
        leave_id: "",
        branch_id: "",
        leave_name: "",
        leave_category: "",
        leave_count: "",
        leave_accrual: "",
        gender: "",
        user_role_applicable: "",
        leave_discription: "",
        if_unused: "",
        validPeriod: ""
    });

    const [isLoading, setLoading] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        const fetchData = async () => {

            try {
                const formData = new FormData();
                formData.append("client_id", contextClientID);
                formData.append("branch_id", contaxtBranchID);
                formData.append("leave_id", id);

                const res = await fetch("/api/users/showLeaveType", {
                    method: "POST",
                    body: formData,
                });
                console.log(res);

                const response = await res.json();
                console.log(response);

                if (response.status == 1) {
                    const user = response.data[0];
                    setFormValues(user);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setShowAlert(true);
                    setAlertTitle("Error")
                    setAlertStartContent("Failed to get leave type");
                    setAlertForSuccess(2)
                }
            } catch (error) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2)
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();

    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("Form values updated:", formValues);
        setResponseMessage(true);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };
    const [errors, setErrors] = useState<Partial<leave_name>>({});

    const validate = () => {
        const newErrors: Partial<leave_name> = {};
        if (!formValues.leave_name) newErrors.leave_name = "required";
        if (!formValues.leave_category) newErrors.leave_category = "required";
        if (!formValues.leave_count) newErrors.leave_count = "required";
        if (!formValues.leave_accrual) newErrors.leave_accrual = "required";
        if (!formValues.gender) newErrors.gender = "required";
        if (!formValues.user_role_applicable) newErrors.user_role_applicable = "required";
        if (!formValues.leave_discription) newErrors.leave_discription = "required";
        if (!formValues.if_unused) newErrors.if_unused = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("handle submit called");
        const formData = new FormData();
        formData.append("leave_id", id);

        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("leave_name", formValues.leave_name);
        formData.append("category", formValues.leave_category);
        formData.append("count", formValues.leave_count);
        formData.append("accrual", formValues.leave_accrual);
        formData.append("gender", formValues.gender);
        formData.append("applicable", formValues.user_role_applicable);
        formData.append("leave_discription", formValues.leave_discription);
        formData.append("if_unused", formValues.if_unused);
        formData.append("valid_period", formValues.validPeriod);

        try {
            const response = await fetch("/api/clientAdmin/leave/updateLeaveType", {
                method: "POST",
                body: formData,

            });
            console.log(response);

            if (response.ok) {
                onClose();
            } else {
                alert("Failed to submit form.");
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    }

    return (


        <div>
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={""} value2={""} onOkClicked={function (): void {
                setShowAlert(false)
                if (alertForSuccess == 1) {
                    onClose();
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            <div className="row">
                <div className="col-lg-12 mb-3 inner_heading25">
                    Add Holiday Financial year
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="row">
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Type Name:  </label>
                            <input type="text" className="form-control" value={formValues.leave_name} name="leave_name" onChange={(e) => setFormValues((prev) => ({ ...prev, ['leave_name']: e.target.value }))} id="leave_name" placeholder="Enter leave type name" />
                            {/* {errors.leave_name && <span className="error" style={{color: "red"}}>{errors.leave_name}</span>} */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Category:  </label>
                            <select id="leave_category" name="leave_category" value={formValues.leave_category} onChange={(e) => setFormValues((prev) => ({ ...prev, ['leave_category']: e.target.value }))}>
                                <option value="">--</option>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>
                            {/* {errors.leave_category && <span className="error" style={{color: "red"}}>{errors.leave_category}</span>} */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Count:  </label>
                            <input type="text" className="form-control" value={formValues.leave_count} name="leave_count" onChange={(e) => setFormValues((prev) => ({ ...prev, ['leave_count']: e.target.value }))} id="leave_count" placeholder="Monthly count" />
                            {/* {errors.leave_count && <span className="error" style={{color: "red"}}>{errors.leave_count}</span>} */}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Accrual:  </label>
                            <select id="leave_accrual" name="leave_accrual" value={formValues.leave_accrual} onChange={(e) => setFormValues((prev) => ({ ...prev, ['leave_accrual']: e.target.value }))}>
                                <option value="">NA</option>
                                <option value="Monthly">Monthy</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                            {/* {errors.leave_accrual && <span className="error" style={{color: "red"}}>{errors.leave_accrual}</span>} */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Gender: (Applicable for) </label>
                            <select id="gender" name="gender" value={formValues.gender} onChange={(e) => setFormValues((prev) => ({ ...prev, ['gender']: e.target.value }))}>
                                <option value="">--</option>
                                <option value="All">All</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                            {/* {errors.gender && <span className="error" style={{color: "red"}}>{errors.gender}</span>} */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Applicable for:  </label>
                            <select id="user_role_applicable" name="user_role_applicable" value={formValues.user_role_applicable} onChange={(e) => setFormValues((prev) => ({ ...prev, ['user_role_applicable']: e.target.value }))}>
                                <option value="">--</option>
                                <option value="All">All</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                            </select>
                            {/* {errors.user_role_applicable && <span className="error" style={{color: "red"}}>{errors.user_role_applicable}</span>} */}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >if unused:  </label>
                            <select id="if_unused" name="if_unused" value={formValues.if_unused} onChange={(e) => setFormValues((prev) => ({ ...prev, ['if_unused']: e.target.value }))}>
                                <option value="">--</option>
                                <option value="Carry Forward">Carry Forward</option>
                                <option value="Lapse">Lapse</option>
                                {/* <option value="Paid">Paid</option> */}
                            </select>
                            {/* {errors.if_unused && <span className="error" style={{color: "red"}}>{errors.if_unused}</span>} */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Description:  </label>
                            <input type="text" className="form-control" value={formValues.leave_discription} name="leave_discription" onChange={(e) => setFormValues((prev) => ({ ...prev, ['leave_discription']: e.target.value }))} id="leave_discription" placeholder="Rules & Regulations about this leave" />
                            {/* {errors.leave_discription && <span className="error" style={{color: "red"}}>{errors.leave_discription}</span>} */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >validPeriod:  </label>
                            <input type="text" className="form-control" value={formValues.validPeriod || "NA"} name="validPeriod" onChange={(e) => setFormValues((prev) => ({ ...prev, ['validPeriod']: e.target.value }))} id="validPeriod" placeholder="validPeriod period" />
                            {/* {errors.leave_discription && <span className="error" style={{color: "red"}}>{errors.leave_discription}</span>} */}
                        </div>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-lg-12">
                        <input type='submit' value="Update" className="red_button" />
                    </div>

                </div>
            </form>
        </div>


    )
}

export default LeaveTypeUpdate

