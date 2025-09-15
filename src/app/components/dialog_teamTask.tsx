
import React, { useEffect, useState } from 'react'
import supabase from '../api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import LoadingDialog from './PageLoader';
import moment from 'moment';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';
import { AssignedTask, Task } from '../models/TaskModel';

interface TaskUpdateModel {
    id: string,
    approval_status: string

}
const TeamTaskData = ({ id, num, isToBeEddited, onClose }: { id: any, num: any, isToBeEddited: boolean, onClose: () => void }) => {
    const [isLoading, setLoading] = useState(false);
    const [teamTaskarray, setTeamTask] = useState<Task[]>([]);
    const [projectTaskarray, setProjectTask] = useState<Task[]>([]);
    const [assignedTaskarray, setAssignedTask] = useState<AssignedTask[]>([]);
    const [viewIndex, setViewIndex] = useState(0);
    // const [taskData, setTaskData] = useState<Task>();
    const [statusArray, setStatus] = useState<StatusModel[]>([]);
    const { contextClientID, contextRoleID, contextCustomerID, contaxtBranchID } = useGlobalContext();
    const [formValues, setFormValues] = useState<TaskUpdateModel>({
        id: "",
        approval_status: ""
    });

    useEffect(() => {
        setViewIndex(num);
        fetchAssignedTasks();
        fetchTeamTasks();
        fetchProjectTasks();
        const fetchData = async () => {
            const taskStatus = await getApproval();
            setStatus(taskStatus);
        }
        fetchData();
    }, []);

    const fetchAssignedTasks = async () => {
        try {
            const res = await fetch(`/api/users/getAssignedTask`, {
                method: "POST",
                body: JSON.stringify({
                    "id": id,
                    "assigned_to": contextCustomerID
                }),
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.data[0];
            if (response.status == 1) {
                setAssignedTask(taskData);
            } else {
                setAssignedTask([]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const fetchTeamTasks = async () => {
        try {

            const res = await fetch(`/api/users/getTeamTasks`, {
                method: "POST",
                body: JSON.stringify({
                    "id": id,
                    "manager_id": contextCustomerID
                }),
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.taskdata;
            if (response.status == 1 || []) {
                setTeamTask(taskData);
            } else {
                setTeamTask([]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchProjectTasks = async () => {
        try {

            const res = await fetch(`/api/users/getProjectTasks`, {
                method: "POST",
                body: JSON.stringify({
                    "id": id,
                   "project_manager_id": contextCustomerID
                }),
            });
            const response = await res.json();
            console.log(response);

            const taskData = response.taskdata;
            if (response.status == 1 || []) {
                setProjectTask(taskData);
            } else {
                setProjectTask([]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const handleApproval = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handle submit called");

        try {
            const response = await fetch("/api/users/approveTask", {
                method: "POST",
                body: JSON.stringify({
                    "id": id,
                   "approval_status": formValues.approval_status
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
                {viewIndex == 1 ?
                    //  Assigned 
                    <>
                        <div className="nw_user_offcanvas_listing_mainbox">
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Date</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].task_date}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Priority</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].leap_task_priority_level.priority_type}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Deadline</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].deadline}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Assigned by</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].leap_customer.name}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].leap_client_sub_projects.sub_project_name}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].leap_project_task_types.task_type_name}</div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Details</div>
                                <div className="nw_user_offcanvas_listing_content">{assignedTaskarray[0].task_details}
                                </div>
                            </div>
                            <div className="nw_user_offcanvas_listing">
                                <div className="nw_user_offcanvas_listing_lable">Status</div>
                                <div className="nw_user_offcanvas_listing_content">

                                    {assignedTaskarray[0].task_status === 1 ? (
                                        <><div className="nw_priority_mainbox">
                                            <div className="nw_priority_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                    <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                </svg>
                                            </div>
                                            <div className="nw_priority_namebox">{assignedTaskarray[0].leap_task_status?.status}</div>
                                        </div>
                                        </>
                                    ) : assignedTaskarray[0].task_status === 2 ? (
                                        <><div className="nw_priority_mainbox">
                                            <div className="nw_priority_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                    <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                </svg>
                                            </div>
                                            <div className="nw_priority_namebox">{assignedTaskarray[0].leap_task_status?.status}</div>
                                        </div>
                                        </>
                                    ) : assignedTaskarray[0].task_status === 3 ? (
                                        <><div className="nw_priority_mainbox">
                                            <div className="nw_priority_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                    <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                </svg>
                                            </div>
                                            <div className="nw_priority_namebox">{assignedTaskarray[0].leap_task_status?.status}</div>
                                        </div>
                                        </>
                                    ) : assignedTaskarray[0].task_status === 4 ? (
                                        <><div className="nw_priority_mainbox">
                                            <div className="nw_priority_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                    <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                </svg>
                                            </div>
                                            <div className="nw_priority_namebox">{assignedTaskarray[0].leap_task_status?.status}</div>
                                        </div>
                                        </>
                                    ) : assignedTaskarray[0].task_status === 5 ? (
                                        <><div className="nw_priority_mainbox">
                                            <div className="nw_priority_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                    <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                </svg>
                                            </div>
                                            <div className="nw_priority_namebox">{assignedTaskarray[0].leap_task_status?.status}</div>
                                        </div>
                                        </>
                                    ) : assignedTaskarray[0].task_status === 6 ? (
                                        <><div className="nw_priority_mainbox">
                                            <div className="nw_priority_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                    <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                </svg>
                                            </div>
                                            <div className="nw_priority_namebox">{assignedTaskarray[0].leap_task_status?.status}</div>
                                        </div>
                                        </>
                                    ) : < div />
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                    : viewIndex == 2 ?
                        // Team 
                        <>
                            <div className="nw_user_offcanvas_listing_mainbox">
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Name</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].leap_customer.name}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Date</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].task_date}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].leap_client_sub_projects.sub_project_name}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].leap_project_task_types.task_type_name}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Details</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].task_details}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Status</div>
                                    {/* <div className='nw_user_offcanvas_listing_content'>{taskData?.leap_project_task_types.task_type_name}</div> */}
                                    <div className="nw_user_offcanvas_listing_content">
                                        {teamTaskarray[0].task_status === 1 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox">{teamTaskarray[0].leap_task_status.status}</div>
                                            </div>
                                            </>
                                        ) : teamTaskarray[0].task_status === 2 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox">{teamTaskarray[0].leap_task_status.status}</div>
                                            </div>
                                            </>
                                        ) : teamTaskarray[0].task_status === 3 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox">{teamTaskarray[0].leap_task_status.status}</div>
                                            </div>
                                            </>
                                        ) : teamTaskarray[0].task_status === 4 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox">{teamTaskarray[0].leap_task_status.status}</div>
                                            </div>
                                            </>
                                        ) : teamTaskarray[0].task_status === 5 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox">{teamTaskarray[0].leap_task_status.status}</div>
                                            </div>
                                            </>
                                        ) : teamTaskarray[0].task_status === 6 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox">{teamTaskarray[0].leap_task_status.status}</div>
                                            </div>
                                            </>
                                        ) : < div />
                                        }
                                    </div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Hours</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].total_hours ? teamTaskarray[0].total_hours : "--"}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Minutes</div>
                                    <div className="nw_user_offcanvas_listing_content">{teamTaskarray[0].total_minutes ? teamTaskarray[0].total_minutes : "--"}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Approval Status</div>
                                    <div className="nw_user_offcanvas_listing_content">
                                        <div className="form_box">
                                            {isToBeEddited ? <select id="status" name="status" value={formValues.approval_status} onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_status']: e.target.value }))}>
                                                {statusArray.map((type, index) => (
                                                    <option value={type.id} key={type.id}>{type.approval_type}</option>
                                                ))}
                                            </select> :
                                                <div className="nw_user_offcanvas_listing_content">
                                                    {teamTaskarray[0].approval_status === 1 ? (
                                                        <><div className="nw_priority_mainbox">
                                                            <div className="nw_priority_iconbox">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                                    <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                </svg>
                                                            </div>
                                                            <div className="nw_priority_namebox">{teamTaskarray[0].leap_approval_status.approval_type}</div>
                                                        </div>
                                                        </>
                                                    ) : teamTaskarray[0].approval_status === 2 ? (
                                                        <><div className="nw_priority_mainbox">
                                                            <div className="nw_priority_iconbox">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                                    <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                </svg>
                                                            </div>
                                                            <div className="nw_priority_namebox">{teamTaskarray[0].leap_approval_status.approval_type}</div>
                                                        </div>
                                                        </>
                                                    ) : teamTaskarray[0].approval_status === 3 ? (
                                                        <><div className="nw_priority_mainbox">
                                                            <div className="nw_priority_iconbox">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                                    <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                </svg>
                                                            </div>
                                                            <div className="nw_priority_namebox">{teamTaskarray[0].leap_approval_status.approval_type}</div>
                                                        </div>
                                                        </>
                                                    ) : < div />
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {isToBeEddited ? <div className="row mb-5">
                                    <div className="col-lg-12" style={{ textAlign: "right" }}>
                                        <input type='submit' onClick={handleApproval} value="Update" className="red_button" />
                                    </div>
                                </div> : <></>}
                            </div>
                        </>
                        : viewIndex == 3 ?
                            //  Project 
                            <>
                                <div className="nw_user_offcanvas_listing_mainbox">
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Name</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].leap_customer.name}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Date</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].task_date}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Project Name</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].leap_client_sub_projects.sub_project_name}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Task Type</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].leap_project_task_types.task_type_name}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Details</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].task_details}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Status</div>
                                        {/* <div className='nw_user_offcanvas_listing_content'>{taskData?.leap_project_task_types.task_type_name}</div> */}
                                        <div className="nw_user_offcanvas_listing_content">
                                            {projectTaskarray[0].task_status === 1 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#9e9e9e" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{projectTaskarray[0].leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : projectTaskarray[0].task_status === 2 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#FFFF00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{projectTaskarray[0].leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : projectTaskarray[0].task_status === 3 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{projectTaskarray[0].leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : projectTaskarray[0].task_status === 4 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{projectTaskarray[0].leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : projectTaskarray[0].task_status === 5 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{projectTaskarray[0].leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : projectTaskarray[0].task_status === 6 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{projectTaskarray[0].leap_task_status.status}</div>
                                                </div>
                                                </>
                                            ) : < div />
                                            }
                                        </div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Hours</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].total_hours ? projectTaskarray[0].total_hours : "--"}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Minutes</div>
                                        <div className="nw_user_offcanvas_listing_content">{projectTaskarray[0].total_minutes ? projectTaskarray[0].total_minutes : "--"}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Approval Status</div>
                                        <div className="nw_user_offcanvas_listing_content">
                                            <div className="form_box">
                                                {isToBeEddited ? <select id="status" name="status" value={formValues.approval_status} onChange={(e) => setFormValues((prev) => ({ ...prev, ['task_status']: e.target.value }))}>
                                                    {statusArray.map((type, index) => (
                                                        <option value={type.id} key={type.id}>{type.approval_type}</option>
                                                    ))}
                                                </select> :
                                                    <div className="nw_user_offcanvas_listing_content">
                                                        {projectTaskarray[0].approval_status === 1 ? (
                                                            <><div className="nw_priority_mainbox">
                                                                <div className="nw_priority_iconbox">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                                        <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                    </svg>
                                                                </div>
                                                                <div className="nw_priority_namebox">{projectTaskarray[0].leap_approval_status.approval_type}</div>
                                                            </div>
                                                            </>
                                                        ) : projectTaskarray[0].approval_status === 2 ? (
                                                            <><div className="nw_priority_mainbox">
                                                                <div className="nw_priority_iconbox">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                                        <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                    </svg>
                                                                </div>
                                                                <div className="nw_priority_namebox">{projectTaskarray[0].leap_approval_status.approval_type}</div>
                                                            </div>
                                                            </>
                                                        ) : projectTaskarray[0].approval_status === 3 ? (
                                                            <><div className="nw_priority_mainbox">
                                                                <div className="nw_priority_iconbox">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                                        <path fill="#d32f2f" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                                    </svg>
                                                                </div>
                                                                <div className="nw_priority_namebox">{projectTaskarray[0].leap_approval_status.approval_type}</div>
                                                            </div>
                                                            </>
                                                        ) : < div />
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {isToBeEddited ? <div className="row mb-5">
                                        <div className="col-lg-12" style={{ textAlign: "right" }}>
                                            <input type='submit' onClick={handleApproval} value="Update" className="red_button" />
                                        </div>
                                    </div> : <></>}
                                </div>
                            </>
                            : < div />}
            </div>
            {/* -------------- */}
        </div >
    )
}

export default TeamTaskData

async function getApproval() {
    let query = supabase
        .from('leap_approval_status')
        .select()
        .neq("id", 1)
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