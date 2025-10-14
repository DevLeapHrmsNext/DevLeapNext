// support form for employees to raise support

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useRouter, useSearchParams } from 'next/navigation';
import { LeapRequestMaster, SupportForm } from '@/app/models/supportModel'
import { ALERTMSG_FormExceptionString, whatsapp_number } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { pageURL_whatsappSuccessPage } from '@/app/pro_utils/stringRoutes';

const AttendanceStartForm: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [workArray, setWork] = useState<whatsappWorkingType[]>([]);
  const [loadingCursor, setLoadingCursor] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertForSuccess, setAlertForSuccess] = useState(0);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertStartContent, setAlertStartContent] = useState('');
  const [alertMidContent, setAlertMidContent] = useState('');
  const [alertEndContent, setAlertEndContent] = useState('');
  const [alertValue1, setAlertValue1] = useState('');
  const [alertvalue2, setAlertValue2] = useState('');
  const searchParams = useSearchParams();
  const contactNumber = searchParams.get("contact_number");
  const [userData, setuserData] = useState<whatsappCustomerInfoModel[]>([]);
  const router = useRouter()
  useEffect(() => {
    setLoadingCursor(true);

    const fetchData = async () => {
      const custData = await getCustomerClientIds(contactNumber!);
      setuserData(custData);
      const workType = await getWorkType();
      setWork(workType);
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
  // start 5 min timer when page loads
  useEffect(() => {

    const expiryTimer = setTimeout(() => {
      alert("This session has expired. Please request a new link.");
      router.push("/expired-link");
    }, 5 * 60 * 1000); // 5 min

    return () => clearTimeout(expiryTimer);
  }, []);

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
      const response = await fetch("/api/markattendance", {
        method: "POST",
        body: JSON.stringify({
          "contact_number": contactNumber,
          "client_id": userData[0].client_id,
          "customer_id": userData[0].customer_id,
          "branch_id": userData[0].branch_id,
          "type_id": formValues.type_id,
          "description": formValues.description,
          "priority_level": formValues.priority_level
        }),
      });
      if (response.ok) {
        setLoadingCursor(false);
        // setShowAlert(true);
        // setAlertTitle("Success")
        // setAlertStartContent("Help raised successfully");
        // setAlertForSuccess(1)
        // router.push(pageURL_whatsappSuccessPage)
        alert("Form submitted successfully. You will be redirected to WhatsApp to chat with us.");
        router.push(`https://wa.me/` + whatsapp_number);
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
      <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
        <h2>Attendance</h2>
        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
          setShowAlert(false)
          if (alertForSuccess == 1) {
            router.push(pageURL_whatsappSuccessPage);
          }
        }} onCloseClicked={function (): void {
          setShowAlert(false)
        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
        <form onSubmit={handleSubmit}>
            
          <div className="form-group">
            <label>Working Type  <span className='req_text'>*</span></label>
            <select name="type_id" value={formValues.type_id} onChange={handleInputChange}>
              <option value="">Select</option>
              {workArray.map((type, index) => (
                <option value={type.id} key={index}>{type.type}</option>
              ))}
            </select>
            {errors.type_id && <span className="error">{errors.type_id}</span>}
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn">Start Attendance</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendanceStartForm

async function getCustomerClientIds(contact_number: string) {
  const { data, error } = await supabase
    .from('leap_customer')
    .select('customer_id, client_id, branch_id')
    .eq('contact_number', contact_number);

  if (error) throw error;
  return data;
}

async function getWorkType() {

  let query = supabase
    .from('leap_working_type')
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
