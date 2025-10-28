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
  selectedFile: File | null
}
const AttendanceStartForm: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [workArray, setWork] = useState<whatsappWorkingType[]>([]);
  const [loadingCursor, setLoadingCursor] = useState(false);
  const [image, setImage] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

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
  const [error, setError] = useState("");
  const [userData, setuserData] = useState<whatsappCustomerInfoModel[]>([]);
  const router = useRouter();
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

  useEffect(() => {

    const expiryTimer = setTimeout(() => {
      alert("This session has expired. Please request a new link.");
      router.push("/expired-link");
    }, 5 * 60 * 1000); // 5 min

    return () => clearTimeout(expiryTimer);
  }, []);

  const [formValues, setFormValues] = useState<attendanceModel>({
    working_type_id: '',
    selectedFile: null,
  });

  const handleInputChange = async (e: any) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
  const [errors, setErrors] = useState<Partial<attendanceModel>>({});


  const handleCapture = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // You can now process the image file here, e.g., send it to your server
      console.log('Captured file:', file);
    }
  };

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
    if (!formValues.working_type_id) newErrors.working_type_id = "required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (!validate()) return;
    setLoadingCursor(true);
    
    formData.append("contact_number", contactNumber!);
    formData.append("attendanceId", "1");
    formData.append("client_id", userData[0].client_id!);
    formData.append("customer_id", userData[0].customer_id!);
    formData.append("punch_date_time", new Date().toISOString());
    formData.append("working_type_id", formValues.working_type_id);
    formData.append("lat", latitude.toString());
    formData.append("lng", longitude.toString());
    formData.append("files", image);
    
    try {
      const response = await fetch("/api/markattendance", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setLoadingCursor(false);
        alert("Attendance started successfully. You will be redirected to WhatsApp to chat with us.");
        router.push(`https://wa.me/` + whatsapp_number);
      } else {
        setLoadingCursor(false);
        // e.preventDefault()
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed to start attendance.");
        setAlertForSuccess(2)
      }
    } catch (error) {
      setLoadingCursor(false);
      // e.preventDefault()
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
            <select name="working_type_id" value={formValues.working_type_id} onChange={handleInputChange}>
              <option value="">Select</option>
              {workArray.map((type, index) => (
                <option value={type.id} key={index}>{type.type}</option>
              ))}
            </select>
            {errors.working_type_id && <span className="error">{errors.working_type_id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="selfie-capture">Capture Selfie:</label>
            <input
              type="file"
              id="selfie-capture"
              accept="image/*"
              capture="user"
              onChange={handleCapture}
            />
          </div>

          {image && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Preview: {image}</h4>
              <img
                src={image}
                alt="Selfie preview"
                style={{ maxWidth: '50%', height: 'auto', borderRadius: '4px' }}
              />
            </div>
          )}

          {latitude && longitude && (
            <div>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
              <input type="hidden" name="latitude" value={latitude} />
              <input type="hidden" name="longitude" value={longitude} />
            </div>
          )}

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
