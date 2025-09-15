import React, { useEffect, useState } from 'react'
import Select from "react-select";
import supabase from '../api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { fetchData } from 'pdfjs-dist/types/src/display/node_utils';
import LoadingDialog from './PageLoader';
import moment from 'moment';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';


interface FilterValues {
    subProjectID: any,
    customerID: any,
    startDate: any,
    endDate: any,
}
const DialogEmployeeTaskData = ({ passedData, startDate, endDate, onClose }: { passedData: TaskListResponseModel, startDate: any, endDate: any, onClose: () => void }) => {


    const { contextClientID } = useGlobalContext();
    const [totalTaskHours, setTotalTaskHours] = useState(0);
    const [subProjectName, setSubProjectName] = useState([{ value: '', label: '' }]);
    const [isLoading, setLoading] = useState(false);
    const [filterValues, setFilterValues] = useState<FilterValues>({

        subProjectID: '',
        customerID: '',
        startDate: '',
        endDate: '',

    });
    const [taskData, setTaskData] = useState<TaskListResponseModel>();

    useEffect(() => {
        fetchFilterTables()

    }, [])

    const fetchFilterTables = async () => {
        setTaskData(passedData);
        const subProjects = await getSubProjects(contextClientID, null);
        let subPro: any[] = []
        for (let i = 0; i < subProjects.length; i++) {
            subPro.push({
                value: subProjects[i].subproject_id,
                label: subProjects[i].sub_project_name,
            })
        }
        setSubProjectName(subPro);
        setFilterValues({
            subProjectID: '',
            customerID: passedData.customer_id,
            startDate: startDate,
            endDate: endDate,
        })

        if (taskData) {
            for (let i = 0; i < taskData?.leap_customer_project_task.length; i++) {
                const hoursTominutes = taskData?.leap_customer_project_task[i].total_hours * 60;

                setTotalTaskHours(totalTaskHours + hoursTominutes + taskData?.leap_customer_project_task[i].total_minutes)
            }
        } else {
            for (let i = 0; i < passedData.leap_customer_project_task.length; i++) {
                const hoursTominutes = passedData?.leap_customer_project_task[i].total_hours * 60;

                setTotalTaskHours(totalTaskHours + hoursTominutes + passedData?.leap_customer_project_task[i].total_minutes)
            }
        }
    }

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        setFilterValues((prev) => ({ ...prev, [name]: value }));

        if (name == "startDate") {
            fetchData(2, value)
        } else {
            fetchData(3, value);
        }
    }

    const handleProjectSelectChange = async (values: any) => {
        setFilterValues((prev) => ({ ...prev, ["subProjectID"]: values.value }));
        fetchData(1, values.value);
    };
    const formatDateYYYYMMDD = (date: any, isTime = false) => {
        if (!date) return '';
        const parsedDate = moment(date);

        if (isTime) return parsedDate.format('HH:mm A');

        return parsedDate.format('YYYY-MM-DD');
    };
    const fetchData = async (dataType: number, changedData: any) => {

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", filterValues.customerID);

            if (dataType == 1) {
                formData.append("sub_project_id", changedData);
            } else {
                formData.append("customer_id", filterValues.subProjectID);
            }
            if (dataType == 2) {
                formData.append("start_date", changedData)
            } else {
                formData.append("start_date", filterValues.startDate)
            }
            if (dataType == 3) {
                formData.append("end_date", changedData)
            } else {
                formData.append("end_date", filterValues.endDate)
            }




            const res = await fetch(`/api/commonapi/getEmployeeTask`, {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);


            if (response.status == 1) {
                setLoading(false);

                setTaskData(response.data[0]);

            } else if (response.status == 0) {
                setLoading(false);

            }

        } catch (error) {
            setLoading(false);
            alert("Exception occured while fetching task data")
            console.error("Error fetching user data:", error);
        }

    }
    return (
        <div className="">
            <div className="">
                <LoadingDialog isLoading={isLoading} />

                <div className='rightpoup_close' onClick={onClose}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-3 inner_heading25">
                    Employee Task Details
                    </div>
                </div>
                
                <div className="row">

                    <div className="col-lg-12 mb-3">
                        <div className="row mb-2">
                            <div className="col-lg-3">
                                <label>Name:</label>
                            </div>
                            <div className="col-lg-8">
                                <label>{taskData?.name}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-lg-3">
                                <label>Emp ID:</label>
                            </div>
                            <div className="col-lg-8">
                                <label>{taskData?.emp_id}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-lg-3">
                                <label>Designation:</label>
                            </div>
                            <div className="col-lg-8">
                                <label>{taskData?.leap_client_designations?.designation_name ? taskData?.leap_client_designations?.designation_name : "--"}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-lg-3">
                                <label>Department:</label>
                            </div>
                            <div className="col-lg-8">
                                <label>{taskData?.leap_client_departments?.department_name ? taskData?.leap_client_departments?.department_name : "--"}</label>
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-12 mb-3 pt-3" style={{ borderTop: "2px solid #e6eff6" }}>
                        <div className="row">
                            <div className="col-lg-6 mb-2">
                                <label>Total Tasks:</label>&nbsp;&nbsp;
                                <label style={{ fontFamily: "Outfit-ExtraBold" }}>{taskData?.leap_customer_project_task ? taskData?.leap_customer_project_task.length : 0}</label>
                            </div>
                            <div className="col-lg-6 mb-2">
                                <label>Total Task Hours:</label>&nbsp;&nbsp;
                                <label style={{ fontFamily: "Outfit-ExtraBold" }}>{totalTaskHours}</label>
                            </div>
                            <div className="col-lg-6 mb-2">
                                <label>Full Day Working(hrs):</label>&nbsp;&nbsp;
                                <label style={{ fontFamily: "Outfit-ExtraBold" }}>{taskData?.leap_client_branch_details.leap_client_working_hour_policy && taskData?.leap_client_branch_details.leap_client_working_hour_policy.full_day ? taskData?.leap_client_branch_details.leap_client_working_hour_policy.full_day : "--"}</label>
                            </div>
                            <div className="col-lg-6 mb-2">
                                <label>Half Day Working(hrs):</label>&nbsp;&nbsp;
                                <label style={{ fontFamily: "Outfit-ExtraBold" }}>{taskData?.leap_client_branch_details.leap_client_working_hour_policy && taskData?.leap_client_branch_details.leap_client_working_hour_policy.half_day ? taskData?.leap_client_branch_details.leap_client_working_hour_policy.half_day : "--"}</label>
                            </div>
                        </div>
                    </div>

                </div>
                {/* =====================================Filter Section==================================================== */}
                <div className="row mb-4 pt-3" style={{ borderTop: "2px solid #e6eff6" }}>

                    <div className="col-lg-4">

                        <div className="form_box mb-2">

                            <label htmlFor="formFile" className="form-label">Sub Project Name:</label>

                            <div className="form_box mb-3">
                                <div className="row d-flex align-items-center">

                                    <div className="col-lg-12 search_select_element">
                                        <Select
                                            className="custom-select"
                                            classNamePrefix="custom"
                                            options={subProjectName}
                                            onChange={(selectedOption) =>
                                                handleProjectSelectChange(selectedOption)
                                            }
                                            placeholder="Sub Project"
                                            isSearchable
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form_box mb-2">
                            <label htmlFor="formFile" className="form-label">Start Date:</label>
                            <input type="date" name="startDate" value={filterValues.startDate} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="form_box mb-2">
                            <label htmlFor="formFile" className="form-label">End Date: </label>
                            <input type="date" id="date" name="endDate" value={filterValues.endDate} onChange={handleInputChange} />
                        </div>
                    </div>


                </div>
                {/* ======================================Task List section===========================================================                 */}
                {taskData && taskData.leap_customer_project_task.length > 0 && <div className="row list_label mb-4">
                    <div className="col-lg-12">
                        <div className="row text-center">
                            <div className="col-lg-2">
                                <div className="label">Sr. No.</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Details</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Project</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Client</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Total Hours</div>
                            </div>
                            <div className="col-lg-2">
                                <div className="label">Total Minutes</div>
                            </div>
                        </div>
                    </div>

                </div>}

                <div className="row">
                    <div className="col-lg-12">
                        <div style={{ scrollbarColor: "rgb(212, 170, 112) rgb(228, 228, 228)", scrollbarWidth: "thin", maxHeight: "180px", overflowY: "scroll", overflowX: "clip" }}>
                            {taskData && taskData.leap_customer_project_task.length > 0 ? taskData?.leap_customer_project_task.map((task, index) => {

                                return (
                                    <div className="list_listbox" key={index}>
                                        <div className="row text-center">
                                            <div className="col-lg-2">{index + 1}</div>
                                            <div className="col-lg-2">{task.task_details}</div>
                                            <div className="col-lg-2">{task.leap_client_sub_projects && task.leap_client_sub_projects.sub_project_name?task.leap_client_sub_projects.sub_project_name : "--"}</div>
                                            <div className="col-lg-2">{task.leap_client_project && task.leap_client_project.project_client?task.leap_client_project.project_client : "--"}</div>
                                            <div className="col-lg-2">{task.total_hours}</div>
                                            <div className="col-lg-2">{task.total_minutes}</div>
                                        </div>
                                    </div>

                                )
                            }) : <div className="d-flex justify-content-center align-items-center" style={{ height: "50px" }}>
                                {<h4 className="text-muted">{!isLoading ? "No Task Added" : ""}</h4>}
                            </div>}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default DialogEmployeeTaskData


async function getSubProjects(clientID: any, branchID: any) {

    let query = supabase
        .from('leap_client_sub_projects')
        .select()
        .eq("client_id", clientID);
    if (branchID) {
        query = query.eq("branch_id", branchID)
    }

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}