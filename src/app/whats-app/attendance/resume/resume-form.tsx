// support form for employees to raise support

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { ALERTMSG_FormExceptionString, whatsapp_number } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { pageURL_whatsappSuccessPage } from '@/app/pro_utils/stringRoutes';

interface attendanceModel {
  working_type_id: string;
}
const AttendanceResumeForm: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [workArray, setWork] = useState<whatsappWorkingType[]>([]);
  const [loadingCursor, setLoadingCursor] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCursor(true);
    try {
      const response = await fetch("/api/markattendance", {
        method: "POST",
        body: JSON.stringify({
          "contact_number": contactNumber,
          "attendance_type": 4, // resume attendance
          "attendance_id": id, // id of the attendance record to resume
          "punch_date_time": new Date(),
          "lat": latitude,
          "lng": longitude
        }),
      });
      if (response.ok) {
        setLoadingCursor(false);
        alert("Attendance resumed successfully. You will be redirected to WhatsApp to chat with us.");
        router.push(`https://wa.me/` + whatsapp_number);
      } else {
        setLoadingCursor(false);
        e.preventDefault()
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed to resume attendance.");
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
          {latitude && longitude && (
            <div>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
              <input type="hidden" name="latitude" value={latitude} />
              <input type="hidden" name="longitude" value={longitude} />
            </div>
          )}

          <div className="form-group">
            <button type="submit" className="submit-btn">Resume Attendance</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendanceResumeForm

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
