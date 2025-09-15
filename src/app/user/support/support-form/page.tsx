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
    <div className='mainbox user_mainbox_new_design'>
      <header>
        <LeapHeader title={raiseSupportTitle} />
      </header>
      <LeftPannel menuIndex={27} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
        <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
          {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
            setShowAlert(false)
            if (alertForSuccess == 1) {
              router.push(pageURL_userSupport);
            }
          }} onCloseClicked={function (): void {
            setShowAlert(false)
          }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
          <form onSubmit={handleSubmit}>
            <div className='container'>
              <div className="row">
                <div className="col-lg-12">
                  <div className="new_support_mainbox">
                    <div className="new_support_leftbox">
                      <div className="new_support_form_heading">
                        Raise <span>Support</span>
                      </div>
                      {/* <form onSubmit={handleSubmit}> */}
                      <div className="form_group_support">
                        <select id="type_id" name="type_id" onChange={handleInputChange} className="form-select">
                          <option value="">Request Type *</option>
                          {masterArray.map((type, index) => (
                            <option value={type.id} key={index}>{type.type_name}</option>
                          ))}
                        </select>
                        {errors.type_id && <span className="error" style={{ color: "red" }}>{errors.type_id}</span>}
                      </div>
                      <div className="form_group_support">
                        <select id="priority_level" name="priority_level" onChange={handleInputChange} className="form-select">
                          <option value="">Priority *</option>
                          {priorityArray.map((type, index) => (
                            <option value={type.id} key={index}>{type.priority_name}</option>
                          ))}
                        </select>
                        {errors.priority_level && <span className="error" style={{ color: "red" }}>{errors.priority_level}</span>}
                      </div>
                      <div className="form_group_support">
                        <textarea className="form-control" rows={2} id="description" name="description" value={formValues.description} onChange={handleInputChange} placeholder='Description' />
                        {errors.description && <span className="error" style={{ color: "red" }}>{errors.description}</span>}
                      </div>
                      {/* <div className="form_group_support_upload">
                        <input type="file" name="file" id="file" className='new_upload_btn_input' />
                        <label htmlFor="file" className='new_upload_btn'><span><img src="/images/user/upload.gif" alt="Upload Icon" className="img-fluid" /></span>Upload File</label>
                      </div> */}
                      <div className="new_leave_formgoup_btn new_leave_formgoup_back_btn">
                        <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
                        <BackButton isCancelText={true} />
                      </div>
                      {/* </form> */}
                    </div>
                    <div className="new_support_rightbox">
                      <img src={staticIconsBaseURL + "/images/user/support-image.webp"} alt="Support image" className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      }
      />
      <div>
        <Footer />
      </div>
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