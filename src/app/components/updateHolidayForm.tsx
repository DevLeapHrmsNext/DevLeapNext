'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { Holiday, LeapHolidayTypes } from '../models/HolidayModel';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';



const UpdateHolidayForm = ({ onClose, id, }: { onClose: () => void, id: any, }) => {
    const [formHolidayValues, setHolidayValues] = useState<Holiday>({
        id: 0,
        holiday_name: '',
        holiday_type_id: '',
        date: '',
        client_id: '',
        branch_id: '',
        created_at: '',
        updated_at: '',
        holiday_year:'',
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

    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const { contextClientID } = useGlobalContext();
    const [holidays, setHolidays] = useState<any[]>([]);
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [errors, setErrors] = useState<Partial<Holiday>>({});
    const [holidayTypeArray, setholidayTypeArray] = useState<LeapHolidayTypes[]>([]);
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

        const fetchData = async () => {
            const branch = await getBranches(contextClientID);
            setBranchArray(branch);
            const holidayTypes = await getHolidayType();
            setholidayTypeArray(holidayTypes);

            try {
                const formData = new FormData();
                formData.append("client_id", contextClientID);
                formData.append("id", id);


                const res = await fetch("/api/commonapi/getHolidayList", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "id": id,
                        
                    }),
                });
                const response = await res.json();
                const holidayData = response.data.holidays[0];
                setHolidayValues(holidayData);

            } catch (error) {
                console.error("Error fetching holidays:", error);
                setHolidays([]);
            }
        };
        fetchData();
    }, []);

    const validate = () => {
        const newErrors: Partial<Holiday> = {};
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

        formData.append("client_id", contextClientID);
        formData.append("id", id);
        formData.append("holiday_name", formHolidayValues.holiday_name);
        formData.append("date", formHolidayValues.date);
        formData.append("holiday_type_id", formHolidayValues.holiday_type_id);

        try {
            const response = await fetch("/api/commonapi/updateHolidays", {
                method: "POST",
                body: formData,
            });

            console.log(response);

            if (response.ok) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Holiday updated successfully");
                setAlertForSuccess(1)
                
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Failed")
                setAlertStartContent("Failed to update holiday");
                setAlertForSuccess(2)
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent("Failed to update holiday");
                setAlertForSuccess(3)
        }

    }

    return (
        <div>
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)
                if(alertForSuccess==1){
                    onClose();
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div>
                <div className='rightpoup_close' onClick={onClose}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">
                        Update Holiday
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row">

                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Day:</label>
                                <input type="text" className="form-control" id="holiday_name" placeholder="Holiday name" value={formHolidayValues.holiday_name} name="holiday_name" onChange={(e) => setHolidayValues((prev) => ({ ...prev, ['holiday_name']: e.target.value }))} />
                                {errors.holiday_name && <span className="error" style={{ color: "red" }}>{errors.holiday_name}</span>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Date:</label>
                                <input type="date" className="form-control" id="date" placeholder="" value={formHolidayValues.date} name="date" onChange={(e) => setHolidayValues((prev) => ({ ...prev, ['date']: e.target.value }))} />
                                {errors.date && <span className="error" style={{ color: "red" }}>{errors.date}</span>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="formFile" className="form-label">Holiday Type:</label>
                                <select id="holiday_type_id" name="holiday_type_id" 
                                value={formHolidayValues.holiday_type_id || ""}
                                onChange={(e) => setHolidayValues((prev) => ({ ...prev, ['holiday_type_id']: e.target.value }))}>
                                    {!formHolidayValues.holiday_type_id  && <option value="">Select Holiday Type</option>}
                                    {holidayTypeArray.map((type) => (
                                        <option value={type.id} key={type.id}>{type.holiday_type}</option>
                                    ))}
                                </select>
                                {errors.holiday_type_id && <span className="error" style={{ color: "red" }}>{errors.holiday_type_id}</span>}

                            </div>
                        </div>
                    </div>

                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <input type='submit' value="Update" className="red_button" />
                        </div>
                    </div>
                </form>
                {showResponseMessage && <div className="row md-5"><label>Holiday Added Successfully</label></div>}
            </div>
        </div>
    )
}

export default UpdateHolidayForm


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