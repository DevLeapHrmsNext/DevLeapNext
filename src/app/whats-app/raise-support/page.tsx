// support form for employees to raise support

'use client'
import React, { useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import Footer from '@/app/components/footer'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { pageURL_userSupport } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { LeapRequestMaster, SupportForm } from '@/app/models/supportModel'
import { ALERTMSG_FormExceptionString, raiseSupportTitle } from '@/app/pro_utils/stringConstants'
import LeftPannel from '@/app/components/leftPannel'
import BackButton from '@/app/components/BackButton'
import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

const SupportRequestForm: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { contextClientID, contaxtBranchID, contextCustomerID } = useGlobalContext();
  const [priorityArray, setPriority] = useState<SupportPriority[]>([]);
  const [masterArray, setMaster] = useState<LeapRequestMaster[]>([]);
  const [loadingCursor, setLoadingCursor] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertForSuccess, setAlertForSuccess] = useState(0);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertStartContent, setAlertStartContent] = useState('');
  const [alertMidContent, setAlertMidContent] = useState('');
  const [alertEndContent, setAlertEndContent] = useState('');
  const [alertValue1, setAlertValue1] = useState('');
  const [alertvalue2, setAlertValue2] = useState('');
  const router = useRouter()
  useEffect(() => {
    setLoadingCursor(true);
    const fetchData = async () => {
      const priority = await getPriority();
      setPriority(priority);
      const master = await getMaster();
      setMaster(master);
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

  const [formValues, setFormValues] = useState<SupportForm>({
    id: 0,
    created_at: "",
    client_id: "",
    branch_id: "",
    customer_id: "",
    type_id: "",
    description: "",
    priority_level: "",
    active_status: "",
    updated_at: "",
  });

  const handleInputChange = async (e: any) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
  const formData = new FormData();
  const [errors, setErrors] = useState<Partial<SupportForm>>({});

  const validate = () => {
    const newErrors: Partial<SupportForm> = {};
    if (!formValues.type_id) newErrors.type_id = "required";
    if (!formValues.description) newErrors.description = "required";
    if (!formValues.priority_level) newErrors.priority_level = "required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoadingCursor(true);
    try {
      const response = await fetch("/api/users/support/raiseSupport", {
        method: "POST",
        body: JSON.stringify({
          "client_id": contextClientID,
          "customer_id": contextCustomerID,
          "branch_id": contaxtBranchID,
          "type_id": formValues.type_id,
          "description": formValues.description,
          "priority_level": formValues.priority_level
        }),
      });
      if (response.ok) {
        setLoadingCursor(false);
        setShowAlert(true);
        setAlertTitle("Success")
        setAlertStartContent("Help raised successfully");
        setAlertForSuccess(1)
      } else {
        setLoadingCursor(false);
        e.preventDefault()
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed to raise help.");
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

  return (
    <div className='apply-task-container'>
            <h2>Raise Support</h2>



            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Request Type  <span className='req_text'>*</span></label>
                    <select name="type_id" value={formValues.type_id} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {masterArray.map((type, index) => (
                            <option value={type.id} key={index}>{type.type_name}</option>
                          ))}
                    </select>
                    {errors.type_id && <span className="error">{errors.type_id}</span>}
                </div>

                <div className="form-group">
                    <label>Priority <span className='req_text'>*</span></label>
                    <select name="priority_level" value={formValues.priority_level} onChange={handleInputChange}>
                        <option value="">Select</option>
                        {priorityArray.map((type, index) => (
                            <option value={type.id} key={index}>{type.priority_name}</option>
                          ))}
                    </select>
                    {errors.priority_level && <span className="error">{errors.priority_level}</span>}
                </div>

                <div className="form-group">
                    <label>Description <span className='req_text'>*</span></label>
                    <textarea name="description" rows={2} value={formValues.description} onChange={handleInputChange} />
                    {errors.description && <span className="error">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        </div>
  )
}

export default SupportRequestForm


async function getPriority() {

  let query = supabase
    .from('leap_request_priority')
    .select()
    .neq('is_deleted', true);

  const { data, error } = await query;
  if (error) {
    // console.log(error);

    return [];
  } else {
    // console.log(data);
    return data;
  }

}

async function getStatus() {

  let query = supabase
    .from('leap_request_status')
    .select();

  const { data, error } = await query;
  if (error) {
    // console.log(error);

    return [];
  } else {
    // console.log(data);
    return data;
  }

}
async function getMaster() {

  let query = supabase
    .from('leap_request_master')
    .select();

  const { data, error } = await query;
  if (error) {
    // console.log(error);

    return [];
  } else {
    // console.log(data);
    return data;
  }

}