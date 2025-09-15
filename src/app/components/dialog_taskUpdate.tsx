//Component for task update dialog called directly from the 

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';

interface TaskUpdate {
    id: string,
    task_details: string,
    task_status: string,
    leap_task_status: {
        id: number
        status: string
        created_at: string
    }
}

const TaskUpdate = ({ onClose, id }: { onClose: () => void, id: any }) => {     

    const [ showResponseMessage,setResponseMessage ] = useState(false);
    const [statusArray, setStatus] = useState<TaskStatus[]>([]);
    const {contextClientID,contaxtBranchID, contextSelectedCustId,contextRoleID}=useGlobalContext();
    const [isVisible, setIsVisible] = useState(true)

    const [formValues, setFormValues] = useState<TaskUpdate>({
        id: "",
        task_details: "",
        task_status: "",
        leap_task_status: {
            id: 0,
            status: "",
            created_at: ""
        }
      });
    
    useEffect(() => {
        
        const fetchData = async () => {
            const taskStatus = await getStatus();
            setStatus(taskStatus); 
                try{
                    const formData = new FormData();
                    formData.append("id", id );
    
                const res = await fetch("/api/users/getTasks", {
                    method: "POST",
                    body: formData,
                });
                console.log(res);
                
                const response = await res.json();
                console.log(response);
                
                const user = response.data[0];
                setFormValues(user);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            fetchData();
        
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handle submit called");
        const formData = new FormData();

        formData.append("id", id); 
        formData.append("task_details", formValues.task_details); 
        formData.append("task_status", formValues.task_status); 

        try {
          const response = await fetch("/api/users/updateTask", {
              method: "POST",
              body: formData,
    
          });
          // console.log(response);
    
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
        <div className="loader-overlay">
            <div className="loader-dialog">
                <div className="row">
                <div className="col-lg-12" style={{textAlign: "right"}}>
                    <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
                     onClick={onClose}/>
                </div>
                </div>
                <div className="row" style={{ textAlign: "center" }}>
                    <div className="col-lg-12 mb-4 inner_heading25" >
                    Update Task
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row" style={{ alignItems: "center" }}>
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Task Description:  </label>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="form_box mb-3">
                            <input type="text" className="form-control" value={formValues.task_details} name="task_details" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['status_remark']: e.target.value }))}  id="task_details" placeholder="Task description" />
                            </div>
                        </div>
                    </div> 
                    <div className="row" style={{ alignItems: "center" }}>
                        <div className="col-md-4">
                            <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Status:  </label>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="form_box mb-3">
                            <select id="task_status" name="task_status" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['task_status']: e.target.value }))}>
                                        <option value={formValues.leap_task_status.id}>{formValues.leap_task_status.status}</option>
                                        {statusArray.map((type, index) => (
                                              
                                            <option value={type.id} key={type.id} disabled={type.id!=3}>{type.status}</option>
                                        ))}
                                </select>                            
                            </div>
                        </div>
                    </div> 
                    <div className="row mb-5">
                        <div className="col-lg-12" style={{ textAlign: "center" }}>
                        <input type='submit' value="Update" className="red_button"  />
                        </div>
                    </div>
                </form>
                {showResponseMessage &&  <div className="row md-5"><label>Task Updated Successfully</label></div>}
            </div>
        </div>
    )
}

export default TaskUpdate

async function getStatus () {
    let query = supabase
        .from('leap_task_status')
        .select()
        .neq("id",5);
  
    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
  }