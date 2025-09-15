'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { Holiday, LeapHolidayTypes } from '../models/HolidayModel';
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';
import LoadingDialog from './PageLoader';
import { LeapWorkingType } from '../models/employeeDetailsModel';

interface AssignAttendanceFormValues {

    in_date: any,
    out_date: any,
    workingTypeID: any,

    in_time: any
    out_time: any
    total_working_hours: any
}

const AssignEmployeeAttendance = ({ customer_id,date, onClose }: { customer_id: any,date:any, onClose: () => void }) => {

    const [isLoading, setLoading] = useState(false);
    const [attendanceFormData, setAttendenceFormData] = useState<AssignAttendanceFormValues>({
        in_date: "",
        out_date: "",
        in_time: "",
        workingTypeID: 0,
        out_time: "",
        total_working_hours: ""
    });
    const [workingTypeArray, setWorkingTypeArray] = useState<LeapWorkingType[]>([])
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
            console.log("useeffect is getting called");
            setAttendenceFormData((prev) => ({ ...prev, ['in_date']: date }))
            setAttendenceFormData((prev) => ({ ...prev, ['out_date']: date }))
            const workingTypes = await getWorkingType();
            setWorkingTypeArray(workingTypes);
        };
        fetchData();
    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("handle input change------------", name);
        console.log("handle input change------------", attendanceFormData);

        if (name == 'in_date' && attendanceFormData.out_time) {
            setAttendenceFormData((prev) => ({ ...prev, ['in_time']: '' }))
            setAttendenceFormData((prev) => ({ ...prev, ['out_time']: '' }))
            setAttendenceFormData((prev) => ({ ...prev, ['out_date']: '' }))
        } else if (name == 'out_date' && attendanceFormData.out_time) {
            setAttendenceFormData((prev) => ({ ...prev, ['in_time']: '' }))
            setAttendenceFormData((prev) => ({ ...prev, ['out_time']: '' }))
        }

        setAttendenceFormData((prev) => ({ ...prev, [name]: value }))



    };
    function calculateTimeDuration(log: AssignAttendanceFormValues): string {
        // Build ISO date-time strings
        const startDateTime = new Date(`${log.in_date}T${log.in_time}:00`);
        const endDateTime = new Date(`${log.out_date}T${log.out_time}:00`);

        // Calculate difference
        const diffMs = endDateTime.getTime() - startDateTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        // Return formatted
        return `${hours}h ${minutes}m`;
    }

    const [errors, setErrors] = useState<Partial<AssignAttendanceFormValues>>({});


    const validate = () => {
        const newErrors: Partial<AssignAttendanceFormValues> = {};
        if (attendanceFormData.workingTypeID == 0) newErrors.workingTypeID = "required";
        if (!attendanceFormData.in_date) newErrors.in_date = "required";
        if (!attendanceFormData.out_date) newErrors.out_date = "required";
        if (!attendanceFormData.in_time) newErrors.in_time = "required";
        if (!attendanceFormData.out_time) newErrors.out_time = "required";
        if (
            attendanceFormData.in_date &&
            attendanceFormData.in_time &&
            attendanceFormData.out_date &&
            attendanceFormData.out_time
        ) {
            const start = new Date(`${attendanceFormData.in_date}T${attendanceFormData.in_time}:00`);
            const end = new Date(`${attendanceFormData.out_date}T${attendanceFormData.out_time}:00`);
            if (end.getTime() < start.getTime()) {
                newErrors.total_working_hours = "Total working hours cannot be negative";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("handle submit called");
        setLoading(true);
        const formData = new FormData();
        formData.append("customer_id", customer_id);
        formData.append("in_date", attendanceFormData.in_date);
        formData.append("out_date", attendanceFormData.out_date);
        formData.append("in_time", attendanceFormData.in_time);
        formData.append("out_time", attendanceFormData.out_time);
        formData.append("working_type", attendanceFormData.workingTypeID);


        try {
            const response = await fetch("/api/clientAdmin/mark_emp_attendance", {
                method: "POST",
                body: formData,

            });
            console.log(response);
            const res = await response.json();

            if (response.ok && res.status == 1) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent(res.message);
                setAlertForSuccess(1)

            } else if (response.ok && res.status == 2) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Warning")
                setAlertStartContent(res.message);
                setAlertForSuccess(2)
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(res.message);
                setAlertForSuccess(2)
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("An exception occured while adding attendance");
            setAlertForSuccess(3)
        }

    }

    return (

        <div >
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
                <div className="col-lg-12 mb-4 inner_heading25">
                    Assign Attendance
                </div>
            </div>
            <form onSubmit={handleSubmit}>

                <div className="row " style={{ alignItems: "center", marginLeft: "10px" }}>

                    <div className="col-md-12">
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Working Mode:  </label>

                                <select className='form-select' id="workingTypeID" name="workingTypeID"
                                    onChange={handleInputChange}>
                                    <option value="" >Select Working Mode</option>
                                    {workingTypeArray.map((workingType, index) => (
                                        <option value={workingType.id} key={workingType.id} >{workingType.type}</option>
                                    ))}
                                </select>

                                {errors.workingTypeID && <span className="error" style={{ color: "red" }}>{errors.workingTypeID}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 ">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >In Date:  </label>

                            <input
                                type="date"
                                className="form-control"
                                id="in_date"
                                placeholder=""
                                name="in_date"
                                value={attendanceFormData.in_date}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={handleInputChange}
                            />
                            {errors.in_date && <span className="error" style={{ color: "red" }}>{errors.in_date}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >In Time:  </label>

                            <input type="time" className="form-control" value={attendanceFormData.in_time} id="in_time" placeholder="" name="in_time" onChange={handleInputChange} />
                            {errors.in_time && <span className="error" style={{ color: "red" }}>{errors.in_time}</span>}
                        </div>
                    </div>
                    <div className="col-md-6 ">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Out Date:  </label>

                            <input
                                type="date"
                                className="form-control"
                                id="out_date"
                                placeholder=""
                                name="out_date"
                                value={attendanceFormData.out_date || ""}
                                max={attendanceFormData.in_date?new Date(new Date(attendanceFormData.in_date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]:new Date().toISOString().split('T')[0]} // only tomorrow allowed
                                min={attendanceFormData.in_date}
                                onChange={handleInputChange}
                            />
                            {errors.out_date && <span className="error" style={{ color: "red" }}>{errors.out_date}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Out Time:  </label>

                            <input type="time" className="form-control" id="out_time" min={
                                attendanceFormData.in_date &&
                                    attendanceFormData.out_date &&
                                    attendanceFormData.in_date === attendanceFormData.out_date
                                    ? attendanceFormData.in_time // restricts to after in_time if same day
                                    : ""
                            } value={attendanceFormData.out_time} placeholder="" name="out_time" onChange={handleInputChange} />
                            {errors.out_time && <span className="error" style={{ color: "red" }}>{errors.out_time}</span>}
                        </div>
                    </div>
                    {attendanceFormData.in_time && attendanceFormData.out_time && <div className="col-md-6">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Total Hours:  </label>
                            <label htmlFor="exampleFormControlInput1" className="form-label" >{attendanceFormData.in_time && attendanceFormData.out_time && attendanceFormData.in_date && attendanceFormData.out_date ? calculateTimeDuration(attendanceFormData) : ""} </label>
                            {/* {errors.total_working_hours && <span className="error" style={{ color: "red" }}>{errors.total_working_hours}</span>} */}
                        </div>
                    </div>}
                </div>

                <div className="row mb-5">

                    <div className="col-lg-12 " style={{ textAlign: "left", marginLeft: "20px" }}>
                        <input type='submit' value="Submit" className="red_button" />
                    </div>
                </div>
            </form>
        </div>

    )
}

export default AssignEmployeeAttendance


async function getWorkingType() {

    let query = supabase
        .from('leap_working_type')
        .select()


    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }
}