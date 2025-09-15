'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { Holiday, LeapHolidayTypes } from '../models/HolidayModel';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';

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
              holiday_type: ''
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
              description: ''
          }
    });
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [holidayTypeArray, setholidayTypeArray] = useState<LeapHolidayTypes[]>([]);

    const { contextClientID } = useGlobalContext();
    const [ showResponseMessage,setResponseMessage ] = useState(false);
    const [errors, setErrors] = useState<Partial<Holiday>>({});


    useEffect(() => {
        const fetchData = async () => {

            const branch = await getBranches(contextClientID);
            setBranchArray(branch);
            const holidayTypes = await getHolidayType();
            setholidayTypeArray(holidayTypes);
            
        };
        fetchData();
    }, []);

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        console.log("Form values updated:", formHolidayValues);
        
        setHolidayValues((prev) => ({ ...prev, [name]: value }));
    };

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
            formData.append("branch_id", formHolidayValues.branch_id);
            formData.append("holiday_name", formHolidayValues.holiday_name);
            formData.append("date", formHolidayValues.date);
            formData.append("holiday_type_id", formHolidayValues.holiday_type_id);

            try{
            const response = await fetch("/api/commonapi/addHoliday", {
                method: "POST",
                body: formData,
            });
            // const response = await res.json();
            console.log(response);

            if (response.ok) {
                onClose();
            } else {
                alert("Failed to submit form.");
            }
           
        }catch(e){
            console.log(e);
            alert("Somthing went wrong! Please try again.")
            
        }
            
    }

    return (
        <div className="loader-overlay">
            <div className="loader-dialog">
            <div className="row">
                    <div className="col-lg-12" style={{textAlign: "right"}}>
                        <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
                        onClick={onClose}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">
                    Add Holiday

                    </div>
                </div>
                <form onSubmit={handleSubmit}>

                <div className="row" style={{alignContent:"center"}}>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="formFile" className="form-label">Branch:</label>
                                <select id="branch_id" name="branch_id" onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    {branchArray.map((branch, index) => (
                                        <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                    ))}
                                </select>
                                {errors.branch_id && <span className="error" style={{color: "red"}}>{errors.branch_id}</span>}

                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="formFile" className="form-label">Holiday Type:</label>
                                <select id="holiday_type_id" name="holiday_type_id" onChange={handleInputChange}>
                                    <option value="">Select</option>
                                    {holidayTypeArray.map((type) => (
                                        <option value={type.id} key={type.id}>{type.holiday_type}</option>
                                    ))}
                                </select>
                                {errors.holiday_type_id && <span className="error" style={{color: "red"}}>{errors.holiday_type_id}</span>}

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Holiday name:</label>
                                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Holiday name" value={formHolidayValues.holiday_name} name="holiday_name" onChange={handleInputChange} />
                                {errors.holiday_name && <span className="error" style={{color: "red"}}>{errors.holiday_name}</span>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Date:</label>
                                <input type="date" className="form-control" id="exampleFormControlInput1" placeholder="" value={formHolidayValues.date} name="date" onChange={handleInputChange} />
                                {errors.date && <span className="error" style={{color: "red"}}>{errors.date}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-lg-6 " style={{ textAlign: "right" }}>
                    <input type='submit' value="Submit" className="red_button"  />

                    </div>
                </div>
                </form>
                {showResponseMessage &&  <div className="row md-5"><label>Holiday Added Successfully</label></div>}
            </div>
        </div>
    )
}

export default AddHolidayForm


async function getBranches(clientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq("client_id", clientID || "3");

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