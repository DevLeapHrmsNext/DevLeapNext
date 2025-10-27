// support form for employees to raise support

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { ALERTMSG_FormExceptionString, whatsapp_number } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { pageURL_whatsappSuccessPage } from '@/app/pro_utils/stringRoutes';

interface attendanceModel {
  pauseReason: string;
}
const AttendancePauseForm: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
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
  const id = searchParams.get("id"); // attendance record id to stop
  const [userData, setuserData] = useState<whatsappCustomerInfoModel[]>([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [error, setError] = useState("");
  const router = useRouter()
  useEffect(() => {
    setLoadingCursor(true);

    const fetchData = async () => {
      const custData = await getCustomerClientIds(contactNumber!);
      setuserData(custData);
      setLoadingCursor(false);
    };

    fetchData();
    getLocation();
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

  const [formValues, setFormValues] = useState<attendanceModel>({
    pauseReason: ''
  });

  const handleInputChange = async (e: any) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
  const [errors, setErrors] = useState<Partial<attendanceModel>>({});
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError("");
        },
        (err) => {
          setError(err.message);
          console.error('Error getting user location:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };
  const validate = () => {
    const newErrors: Partial<attendanceModel> = {};
    if (!formValues.pauseReason) newErrors.pauseReason = "required";
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
          "attendance_type": 3, // pause attendance
          "attendance_id": id, // id of the attendance record to pause
          "punch_date_time": new Date(),
          "pause_reason": formValues.pauseReason,
          "lng": longitude,
          "lat": latitude
        }),
      });
      if (response.ok) {
        setLoadingCursor(false);
        alert("Attendance paused successfully. You will be redirected to WhatsApp to chat with us.");
        router.push(`https://wa.me/` + whatsapp_number);
      } else {
        setLoadingCursor(false);
        e.preventDefault()
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed to pause attendance.");
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
            <label>Pause reason: <span className='req_text'>*</span></label>
            <textarea name="pauseReason" rows={3} value={formValues.pauseReason} onChange={handleInputChange} />
            {errors.pauseReason && <span className="error">{errors.pauseReason}</span>}
          </div>
{latitude && longitude && (
            <div>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
              <input type="hidden" name="latitude" value={latitude} />
              <input type="hidden" name="longitude" value={longitude} />
            </div>
          )}
          <div className="form-group">
            <button type="submit" className="submit-btn">Pause Attendance</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendancePauseForm

async function getCustomerClientIds(contact_number: string) {
  const { data, error } = await supabase
    .from('leap_customer')
    .select('customer_id, client_id, branch_id')
    .eq('contact_number', contact_number);

  if (error) throw error;
  return data;
}
