'use client'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import { createLeaveTitle, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { LeaveType } from '@/app/models/leaveModel'
import { pageURL_userLeave } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import LeftPannel from '@/app/components/leftPannel'
import BackButton from '@/app/components/BackButton'
import moment from 'moment'
import { DateRange, RangeKeyDict } from 'react-date-range';
import { format } from 'date-fns'
import { Range } from 'react-date-range';
import { ALERTMSG_FormExceptionString } from '@/app/pro_utils/stringConstants'
import { useSearchParams } from "next/navigation";

interface AssignEmpLeave {
    client_id: string,
    branch_id: string,
    customer_id: string,
    leave_type: string,
    from_date: string,
    to_date: string,
    leave_reason: string,
    duration: string,
}

const AssignLeave: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [leaveArray, setLeave] = useState<LeaveType[]>([]);
    const [isHalfDayDisabled, setIsHalfDayDisabled] = useState(false);
    const [loadingCursor, setLoadingCursor] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const searchParams = useSearchParams();
    const contactNumber = searchParams.get("contact_number");
    const [userData, setuserData] = useState<whatsappCustomerInfoModel[]>([]);


    const router = useRouter()
    useEffect(() => {
        setLoadingCursor(true);
        const fetchData = async () => {
            const custData = await getCustomerClientIds(contactNumber!);
            setuserData(custData);
            const leavetype = await getLeave(userData[0].customer_id, userData[0].client_id, userData[0].branch_id);
            setLeave(leavetype);
            setLoadingCursor(false);

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
        branch_id: "",
        customer_id: "",
        leave_type: "",
        from_date: "",
        to_date: "",
        leave_reason: "",
        duration: "",
    });

    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }
    const formData = new FormData();
    const [errors, setErrors] = useState<Partial<AssignEmpLeave>>({});

    const validate = () => {
        const newErrors: Partial<AssignEmpLeave> = {};
        if (!formValues.leave_type) newErrors.leave_type = "required";
        if (!formValues.from_date) newErrors.from_date = "required";
        if (!formValues.to_date) newErrors.to_date = "required";
        if (!formValues.leave_reason) newErrors.leave_reason = "required";
        if (!formValues.duration && !isHalfDayDisabled) newErrors.duration = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoadingCursor(true);
        // console.log("handle submit called");

        formData.append("client_id", userData[0].client_id);
        formData.append("branch_id", userData[0].branch_id);
        formData.append("customer_id", userData[0].customer_id);
        formData.append("leave_type", formValues.leave_type);
        formData.append("from_date", formatDateYYYYMMDD(formValues.from_date));
        formData.append("to_date", formatDateYYYYMMDD(formValues.to_date));
        formData.append("leave_reason", formValues.leave_reason);
        formData.append("duration", formValues.duration);

        try {
            const response = await fetch("/api/users/applyLeave", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                setLoadingCursor(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Leave applied Successfully");
                setAlertForSuccess(1)
            } else {
                setLoadingCursor(false);
                e.preventDefault()
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed!");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoadingCursor(false);
            e.preventDefault()
            console.log("Error submitting form:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_FormExceptionString);
            setAlertForSuccess(2)
        }
    }
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    const [showCalendar, setShowCalendar] = useState(false);
    const ref = useRef(null);
    const [state, setState] = useState<Range[]>([
        {
            startDate: new Date() || null,
            endDate: new Date() || null,
            key: 'selection'
        }
    ]);

    const handleChange = (ranges: RangeKeyDict) => {
        setState([ranges.selection]);
        setShowCalendar(false)
        if (ranges.selection.startDate == ranges.selection.endDate) {
            setFormValues((prev) => ({ ...prev, ['from_date']: ranges.selection.startDate + "" }));
            setFormValues((prev) => ({ ...prev, ['to_date']: ranges.selection.startDate + "" }));
            setIsHalfDayDisabled(false);
        } else {
            setFormValues((prev) => ({ ...prev, ['from_date']: ranges.selection.startDate + "" }));
            setFormValues((prev) => ({ ...prev, ['to_date']: ranges.selection.endDate + "" }));
            setIsHalfDayDisabled(true);
        }
    };
    const formattedRange = state[0].startDate! == state[0].endDate! ? format(state[0].startDate!, 'yyyy-MM-dd') : `${format(state[0].startDate!, 'yyyy-MM-dd')} to ${format(state[0].endDate!, 'yyyy-MM-dd')}`;

    return (
        <div className='apply-task-container'>
            <h2>Apply for Leave</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Leave Type <span className='req_text'>*</span></label>
                    <select name="leave_type" value={formValues.leave_type} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {leaveArray.map((type, index) => (
                            <option value={index} key={type.leave_id}>{type.leave_name}</option>
                        ))}
                    </select>
                    {errors.leave_type && <span className="error">{errors.leave_type}</span>}
                </div>

                <div className="form-group">
                    <label>Date <span className='req_text'>*</span></label>
                    <input
                        placeholder='Date'
                        type="text"
                        className="form-control"
                        value={formattedRange}
                        readOnly
                        onClick={() => setShowCalendar(!showCalendar)}
                    />
                    {showCalendar && (
                        <div style={{ position: 'absolute', zIndex: 1000 }}>
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleChange}
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                            />
                        </div>
                    )}
                    {errors.from_date && <span className="error">{errors.from_date}</span>}
                </div>

                <div className="form-group">
                    <label>Leave reason <span className='req_text'>*</span></label>
                    <textarea name="leave_reason" rows={2} value={formValues.leave_reason} onChange={handleInputChange} />
                    {errors.leave_reason && <span className="error">{errors.leave_reason}</span>}
                </div>

                <div className="form-group">
                    <div className="new_leave_btn_radio">
                        <label htmlFor="fullday">Full day</label>
                        <input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="Full day" onChange={handleInputChange} />
                        {/* </div>
                    <div className="new_leave_btn_radio"> */}
                        <label htmlFor="fhalf">1st half</label>
                        <input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="1st half day" onChange={handleInputChange} />
                        {/* </div>
                    <div className="new_leave_btn_radio"> */}
                        <label htmlFor="shalf">2nd half</label>
                        <input type="radio" id="duration" disabled={isHalfDayDisabled} name="duration" value="2nd half day" onChange={handleInputChange} />
                    </div>
                    {errors.duration && <span className="error" style={{ color: "red" }}>{errors.duration}</span>}
                </div>

                <div className="form-group">
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AssignLeave

async function getCustomerClientIds(contact_number: string) {
    const { data, error } = await supabase
        .from('leap_customer')
        .select('customer_id, client_id, branch_id')
        .eq('contact_number', contact_number);

    if (error) throw error;
    return data;
}

async function getGender(customer_id: any) {
    const { data, error } = await supabase
        .from('leap_customer')
        .select('gender')
        .eq("customer_id", customer_id)
        .single();

    if (error || !data) {
        console.error("Error fetching gender:", error);
        return null;
    }
    return data.gender;
}

async function getLeave(customer_id: any, clientID: any, branchID: any) {
    const gender = await getGender(customer_id);

    if (!gender) {
        console.error("No gender found for customer");
        return [];
    }

    const { data, error } = await supabase
        .from('leap_client_leave')
        .select()
        .eq("client_id", clientID)
        .eq("branch_id", branchID)
        .in('gender', ['All', gender]);

    if (error) {
        console.error("Error fetching leave types:", error);
        return [];
    }

    return data;
}
