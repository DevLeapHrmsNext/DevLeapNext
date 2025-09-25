

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { SubProject } from '@/app/models/TaskModel'
import { ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants'

interface AddTaskForm {
    sub_project_id: string,
    task_type_id: string,
    task_details: string,
    task_date: string,
    task_status: string,
}

const ApplyTaskApp: React.FC = () => {
    const [taskArray, setTask] = useState<TaskType[]>([]);
    const [statusArray, setStatus] = useState<TaskStatus[]>([]);
    const { contextClientID } = useGlobalContext();
    const [subProjectarray, setSubProject] = useState<SubProject[]>([]);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');

    const router = useRouter()

    const [formValues, setFormValues] = useState<AddTaskForm>({
        sub_project_id: "",
        task_type_id: "",
        task_details: "",
        task_date: "",
        task_status: "",
    });

    const [errors, setErrors] = useState<Partial<AddTaskForm>>({});

    useEffect(() => {
        setLoadingCursor(true);
        const fetchData = async () => {
            const project = await getSubProject(contextClientID);
            setSubProject(project);
            const task = await getTaskTypes();
            setTask(task);
            const taskStatus = await getStatus();
            setStatus(taskStatus);
            setLoadingCursor(false);
        };
        fetchData();
    }, [contextClientID])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }

    const validate = () => {
        const newErrors: Partial<AddTaskForm> = {};
        if (!formValues.sub_project_id) newErrors.sub_project_id = "required";
        if (!formValues.task_type_id) newErrors.task_type_id = "required";
        if (!formValues.task_details) newErrors.task_details = "required";
        if (!formValues.task_date) newErrors.task_date = "required";
        if (!formValues.task_status) newErrors.task_status = "required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoadingCursor(true);
        try {
            const response = await fetch("/api/users/addTask", {
                method: "POST",
                body: JSON.stringify({
                    sub_project_id: formValues.sub_project_id,
                    task_type_id: formValues.task_type_id,
                    task_details: formValues.task_details,
                    task_date: formValues.task_date,
                    task_status: formValues.task_status
                }),
            });
            setLoadingCursor(false);
            if (response.ok) {
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Task added Successfully");
                setAlertForSuccess(1)
            } else {
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to create task");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoadingCursor(false);
            setShowAlert(true);
            console.log("Error adding type:", error);
            setAlertTitle("Exception");
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
        }
    }

    return (
        <div className='apply-task-container'>
            <h2>Add Task</h2>



            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Project Name <span className='req_text'>*</span></label>
                    <select name="sub_project_id" value={formValues.sub_project_id} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {subProjectarray.length > 0 ? (
                            subProjectarray.map((type, index) => (
                                <option key={index} value={type.subproject_id}>{type.sub_project_name}</option>
                            ))
                        ) : (
                            <option value="" disabled>No Project under this client</option>
                        )}
                    </select>
                    {errors.sub_project_id && <span className="error">{errors.sub_project_id}</span>}
                </div>

                <div className="form-group">
                    <label>Task Type <span className='req_text'>*</span></label>
                    <select name="task_type_id" value={formValues.task_type_id} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {taskArray.map((type, index) => (
                            <option key={index} value={type.task_type_id}>{type.task_type_name}</option>
                        ))}
                    </select>
                    {errors.task_type_id && <span className="error">{errors.task_type_id}</span>}
                </div>

                <div className="form-group">
                    <label>Date <span className='req_text'>*</span></label>
                    <input type="date" name="task_date" value={formValues.task_date} onChange={handleInputChange} />
                    {errors.task_date && <span className="error">{errors.task_date}</span>}
                </div>

                <div className="form-group">
                    <label>Status <span className='req_text'>*</span></label>
                    <select name="task_status" value={formValues.task_status} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {statusArray.map((type, index) => (
                            <option key={index} value={type.id}>{type.status}</option>
                        ))}
                    </select>
                    {errors.task_status && <span className="error">{errors.task_status}</span>}
                </div>

                <div className="form-group">
                    <label>Details <span className='req_text'>*</span></label>
                    <textarea name="task_details" rows={3} value={formValues.task_details} onChange={handleInputChange} />
                    {errors.task_details && <span className="error">{errors.task_details}</span>}
                </div>

                <div className="form-group">
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        </div>

    )
}

export default ApplyTaskApp

// ----------------- Supabase Fetch Functions -----------------
async function getSubProject(client: any) {
    const { data, error } = await supabase.from('leap_client_sub_projects').select().eq("client_id", client);
    if (error) return [];
    return data;
}

async function getTaskTypes() {
    const { data, error } = await supabase.from('leap_project_task_types').select();
    if (error) return [];
    return data;
}

async function getStatus() {
    const { data, error } = await supabase.from('leap_task_status').select().neq("id", 5).neq("id", 6).neq("id", 4);
    if (error) return [];
    return data;
}