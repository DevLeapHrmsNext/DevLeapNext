
import React, { useEffect, useState } from 'react'
import supabase from '../api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import { fetchData } from 'pdfjs-dist/types/src/display/node_utils';
import LoadingDialog from './PageLoader';
import moment from 'moment';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import { Task } from '../models/TaskModel';

interface TaskUpdateModel {
    id: string,
    task_details: string,
    task_status: string,
    leap_task_status: {
        id: number
        status: string
        created_at: string
    }
}
const EmployeeTaskData = ({ id, isToBeEddited, onClose }: { id: any, isToBeEddited: boolean, onClose: () => void }) => {

    const { contextClientID } = useGlobalContext();
    const [isLoading, setLoading] = useState(false);
    const [statusArray, setStatus] = useState<TaskStatus[]>([]);
    const [formValues, setFormValues] = useState<TaskUpdateModel>({
        id: "",
        task_details: "",
        task_status: "",
        leap_task_status: {
            id: 0,
            status: "",
            created_at: ""
        }
    });
    const [taskData, setTaskData] = useState<Task>();

    useEffect(() => {

        const fetchData = async () => {
            const taskStatus = await getStatus();
            setStatus(taskStatus);
            try {
                // const formData = new FormData();
                // formData.append("id", id);

                const res = await fetch("/api/users/getTasks", {
                    method: "POST",
                    body: JSON.stringify({
                        "id": id
                    }),
                });
                const response = await res.json();
                const user = response.data[0];
                setTaskData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);
  const [errors, setErrors] = useState<Partial<TaskUpdateModel>>({});

  const validate = () => {
    const newErrors: Partial<TaskUpdateModel> = {};
    if (!formValues.task_details) newErrors.task_details = "required";
    if (!formValues.task_status) newErrors.task_status = "required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        // console.log("handle submit called");
        try {
            const response = await fetch("/api/users/updateTask", {
                method: "POST",
                body: JSON.stringify({
                    "id": id,
                    "task_details": formValues.task_details,
                    "task_status": formValues.task_status
                }),
            });
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
        <div >
            <div className='rightpoup_close'>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' onClick={onClose} />
            </div>
            {/* -------------- */}
            <div className="nw_user_offcanvas_mainbox">
                <LoadingDialog isLoading={isLoading} />
                <div className="nw_user_offcanvas_heading">
                    Task <span>Details</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="nw_user_offcanvas_listing_mainbox">
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Date</div>
                            <div className="nw_user_offcanvas_listing_content">{taskData?.task_date}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                            <div className="nw_user_offcanvas_listing_content">{taskData?.leap_client_sub_projects.sub_project_name}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                            <div className="nw_user_offcanvas_listing_content">{taskData?.leap_project_task_types.task_type_name}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Details</div>
                            <div className="nw_user_offcanvas_listing_content">
                                {isToBeEddited ?
                                    <textarea style={{ fontSize: "13px", minHeight: "100px" }} className="form-control" value={formValues?.task_details} name="task_details" onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_details']: e.target.value }))} id="task_details" placeholder="Details"></textarea>
                                    : <div className="col-lg-8 mb-3">{taskData?.task_details || "--"}</div>}
                                    {errors.task_details && <span className="error" style={{ color: "red" }}>{errors.task_details}</span>}
                            </div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Status</div>
                            <div className='nw_user_offcanvas_listing_content'>
                                
                                <div className="form_box">
                                    {isToBeEddited ? <select id="status" name="status" value={formValues.task_status} onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_status']: e.target.value }))}>
                                        {statusArray.map((type, index) => (
                                            <option value={type.id} key={index}>{type.status}</option>
                                        ))}
                                        
                                    </select>
                                     :
                                        <div className="nw_user_offcanvas_listing_content">
                                            {taskData?.task_status === 1 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : taskData?.task_status === 2 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : taskData?.task_status === 3 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : taskData?.task_status === 4 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : taskData?.task_status === 5 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : taskData?.task_status === 6 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{taskData?.leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : < div />
                                            }
                                        </div>
                                    }{errors.task_status && <span className="error" style={{ color: "red" }}>{errors.task_status}</span>}
                                </div>
                            </div>

                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Approval Status</div>
                            <div className="nw_user_offcanvas_listing_content">

                                {taskData?.approval_status === 1 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                    </div>
                                    </>
                                ) : taskData?.approval_status === 2 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                    </div>
                                    </>
                                ) : taskData?.approval_status === 3 ? (
                                    <><div className="nw_priority_mainbox">
                                        <div className="nw_priority_iconbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                            </svg>
                                        </div>
                                        <div className="nw_priority_namebox">{taskData?.leap_approval_status.approval_type}</div>
                                    </div>
                                    </>
                                ) : < div />
                                }
                            </div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Hours</div>
                            <div className="nw_user_offcanvas_listing_content">{taskData?.total_hours ? taskData?.total_hours : "--"}</div>
                        </div>
                        <div className="nw_user_offcanvas_listing">
                            <div className="nw_user_offcanvas_listing_lable">Minutes</div>
                            <div className="nw_user_offcanvas_listing_content">{taskData?.total_minutes ? taskData?.total_minutes : "--"}</div>
                        </div>
                        {isToBeEddited ? <div className="row mb-5">
                            <div className="col-lg-12" style={{ textAlign: "right" }}>
                                <input type='submit' disabled={taskData?.task_status == 3} value="Update" className="red_button" />
                            </div>
                        </div> : <></>}
                    </div>

                </form>

            </div>
            {/* -------------- */}
        </div>
    )
}

export default EmployeeTaskData

async function getStatus() {
    let query = supabase
        .from('leap_task_status')
        .select()
        .neq("id", 5)
        .neq("id", 6)
        .eq("is_deleted", false);

    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}