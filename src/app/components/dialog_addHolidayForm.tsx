'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { Holiday, LeapHolidayTypes } from '../models/HolidayModel';
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';
import LoadingDialog from './PageLoader';

// interface FormValues {

//     branch_id: any,
//     holiday_name: any,
//     // holiday_type:any,
//     date: any,
//     holiday_type: any
// }

const AddHolidayForm = ({ onClose }: { onClose: () => void }) => {
    const [formHolidayValues, setHolidayValues] = useState<Holiday>({
        id: 0,
        holiday_name: '',
        holiday_type_id: '',
        date: '',
        client_id: '',
        branch_id: '',
        created_at: '',
        updated_at: '',
        holiday_year: '',
        leap_holiday_types: {
            id: '',
            created_at: '',
            updated_at: '',
            holiday_type: '',
        },
        leap_client_branch_details: {
            branch_id: '',
            branch_number: ''
        },
        leap_holiday_year: {
            id: 0,
            to_date: '',
            client_id: '',
            from_date: '',
            list_name: '',
            created_at: '',
            description: '',
        }
    });
    const [holidayListArray, setHolidayList] = useState<HolidayListYear[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [holidayTypeArray, setholidayTypeArray] = useState<LeapHolidayTypes[]>([]);

    const { contextClientID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [errors, setErrors] = useState<Partial<Holiday>>({});
    const [minDateYear,setMinDateYear] =useState('');
    const [maxDateYear,setMaxDateYear] =useState('');
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
            setLoading(true);
            const branch = await getBranches(contextClientID);

            const holidayTypes = await getHolidayType();

            const holidayYear = await getHolidayYear(contextClientID);

            if (branch.length > 0 && holidayTypes.length > 0 && holidayYear.length) {

                setBranchArray(branch);
                setholidayTypeArray(holidayTypes);
                setHolidayList(holidayYear);
                setLoading(false)
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to fetch some data");
                setAlertForSuccess(2)
            }
        };
        fetchData();
    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("Form values updated:", formHolidayValues);
        if(name==="holiday_year"){
            for(let i=0;i<holidayListArray.length;i++){
                if(holidayListArray[i].id==value){
                    setMinDateYear(holidayListArray[i].from_date);
                    setMaxDateYear(holidayListArray[i].to_date);
                }
            }
        }

        setHolidayValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors: Partial<Holiday> = {};
        if (!formHolidayValues.holiday_year) newErrors.holiday_year = "required";
        if (!formHolidayValues.branch_id) newErrors.branch_id = "required";
        if (!formHolidayValues.holiday_name) newErrors.holiday_name = "required";
        if (!formHolidayValues.date) newErrors.date = "required";
        if (!formHolidayValues.holiday_type_id) newErrors.holiday_type_id = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const formData = new FormData();
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        formData.append("client_id", contextClientID);
        formData.append("branch_id", formHolidayValues.branch_id);
        formData.append("holiday_name", formHolidayValues.holiday_name);
        formData.append("date", formHolidayValues.date);
        formData.append("holiday_type_id", formHolidayValues.holiday_type_id);
        formData.append("holiday_year", formHolidayValues.holiday_year);

        try {
            const response = await fetch("/api/allAdminApi/addHolidays", {
                method: "POST",
                body: formData,
            });
            const res = await response.json();
            console.log(response);

            if (response.ok && res.status==1) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Holiday added successfully.");
                setAlertForSuccess(1)
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to submit data.");
                setAlertForSuccess(2)
            }

        } catch (e) {
            console.log(e);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
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
                    Add Holiday
                </div>
            </div>
            <form onSubmit={handleSubmit}>

                <div className="row" style={{ alignItems: "center" }}>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Holiday year list<span className='req_text'>*</span>: </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <select id="holiday_year" name="holiday_year" onChange={handleInputChange}>
                                <option value="">Select</option>
                                {holidayListArray.map((id, index) => (
                                    <option value={id.id} key={id.id}>{id.list_name}</option>
                                ))}
                            </select>
                            {errors.holiday_year && <span className="error" style={{ color: "red" }}>{errors.holiday_year}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Branch<span className='req_text'>*</span>: </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <select id="branch_id" name="branch_id" onChange={handleInputChange}>
                                <option value="">Select</option>
                                {branchArray.map((branch, index) => (
                                    <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                ))}
                            </select>
                            {errors.branch_id && <span className="error" style={{ color: "red" }}>{errors.branch_id}</span>}

                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Holiday Type<span className='req_text'>*</span>: </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <select id="holiday_type_id" name="holiday_type_id" onChange={handleInputChange}>
                                <option value="">Select</option>
                                {holidayTypeArray.map((type) => (
                                    <option value={type.id} key={type.id}>{type.holiday_type}</option>
                                ))}
                            </select>
                            {errors.holiday_type_id && <span className="error" style={{ color: "red" }}>{errors.holiday_type_id}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Holiday name<span className='req_text'>*</span>: </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-3">
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Holiday name" value={formHolidayValues.holiday_name} name="holiday_name" onChange={handleInputChange} />
                            {errors.holiday_name && <span className="error" style={{ color: "red" }}>{errors.holiday_name}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Date<span className='req_text'>*</span>: </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form_box mb-4">
                            <input type="date" className="form-control" min={minDateYear} max={maxDateYear} id="exampleFormControlInput1" placeholder="" value={formHolidayValues.date} name="date" onChange={handleInputChange} />
                            {errors.date && <span className="error" style={{ color: "red" }}>{errors.date}</span>}
                        </div>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-lg-12 " style={{ textAlign: "left" }}>
                        <input type='submit' value="Submit" className="red_button" />
                    </div>
                </div>
            </form>
        </div>

    )
}

export default AddHolidayForm

async function getBranches(clientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq("client_id", clientID);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }
}
async function getHolidayType() {

    let query = supabase
        .from('leap_holiday_types')
        .select();


    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }
}
async function getHolidayYear(clientID: any) {

    let query = supabase
        .from('leap_holiday_year')
        .select()
        .eq("client_id", clientID);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }
}