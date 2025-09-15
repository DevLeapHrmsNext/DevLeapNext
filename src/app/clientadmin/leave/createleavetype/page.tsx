'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { ALERTMSG_exceptionString, createLeaveTitle, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { pageURL_leaveTypeListing, leftMenuLeavePageNumbers, pageURL_clientAdminSettingsPage, leftMenuAdminSettingsPageNumbers } from '@/app/pro_utils/stringRoutes'
import { AssetList } from '@/app/models/AssetModel'
import BackButton from '@/app/components/BackButton'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import LoadingDialog from '@/app/components/PageLoader'
import ShowAlertMessage from '@/app/components/alert'
import { LeaveTypeIconAndColor } from '@/app/models/leaveModel'

interface LeaveType {
  client_id: string,
  branchID: string,
  leaveType: string,
  categoryID: string,
  dayCount: string,
  leaveAccrual: string,
  gender: string,
  applicableRole: string,
  leaveDesc: string,
  ifUnused: string,
  icon:string,

}

const CreateLeave: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedIconID, setSelectedIconID] = useState(-1);
  const router = useRouter()
  const { contextClientID,contaxtBranchID } = useGlobalContext()
  const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
  const [iconUrlArray, setIconUrls] = useState<LeaveTypeIconAndColor[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertForSuccess, setAlertForSuccess] = useState(0);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertStartContent, setAlertStartContent] = useState('');
  const [alertMidContent, setAlertMidContent] = useState('');
  const [alertEndContent, setAlertEndContent] = useState('');
  const [alertValue1, setAlertValue1] = useState('');
  const [alertvalue2, setAlertValue2] = useState('');

  useEffect(() => {
        const fetchData = async () => {

          const branches = await getBranches(contextClientID);
          const icon = await getLeaveTypeIcons();
          if(branches.length==0 || icon.length==0){
            setLoading(false);
              setShowAlert(true);
                  setAlertTitle("Error")
                  setAlertStartContent("Failed to get some data");
                  setAlertForSuccess(2)
          }else{
            setLoading(false);
            setBranchArray(branches);
            setIconUrls(icon);
          }

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

  const [formValues, setFormValues] = useState<LeaveType>({
    client_id: contextClientID,
    branchID: "",
    leaveType: "",
    categoryID: "",
    dayCount: "",
    leaveAccrual: "",
    gender: "",
    applicableRole: "",
    leaveDesc: "",
    ifUnused: "",
    icon:''

  });

  const handleInputChange = async (e: any) => {
    const { name, value, type, files } = e.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));

  }

  const formData = new FormData();
  const [errors, setErrors] = useState<Partial<LeaveType>>({});

  const validate = () => {
    const newErrors: Partial<LeaveType> = {};
    if (!formValues.branchID) newErrors.branchID = "required";
    if (!formValues.leaveType) newErrors.leaveType = "required";
    if (!formValues.categoryID) newErrors.categoryID = "required";
    if (!formValues.dayCount) newErrors.dayCount = "required";
    if (!formValues.leaveAccrual) newErrors.leaveAccrual = "required";
    if (!formValues.gender) newErrors.gender = "required";
    if (!formValues.applicableRole) newErrors.applicableRole = "required";
    if (!formValues.leaveDesc) newErrors.leaveDesc = "required";
    if (!formValues.ifUnused) newErrors.ifUnused = "required";
    if (selectedIconID<0) newErrors.icon = "required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("handle submit called");
    setLoading(true);
    formData.append("client_id", contextClientID);
    formData.append("branch_id",formValues.branchID);
    formData.append("leave_name", formValues.leaveType);
    formData.append("category", formValues.categoryID);
    formData.append("count", formValues.dayCount);
    formData.append("accrual", formValues.leaveAccrual);
    formData.append("gender", formValues.gender);
    formData.append("applicable", formValues.applicableRole);
    formData.append("leave_discription", formValues.leaveDesc);
    formData.append("if_unused", formValues.ifUnused);
    formData.append("icon_url_id", selectedIconID+'');


    try {
      const response = await fetch("/api/clientAdmin/leave/createLeaveType", {
        method: "POST",
        body: formData,

      });
      // console.log(response);
      const resData = await response.json();
      if (response.ok && resData.status == 1) {
        setLoading(false)
        router.push(pageURL_clientAdminSettingsPage);
      } else {
        setLoading(false);
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("Failed to create leave type");
        setAlertForSuccess(2)

      }
    } catch (error) {
      setLoading(false);
      setShowAlert(true);
      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2)
      console.log("Error submitting form:", error);

    }
  }



  return (
    <div className='mainbox'>
      <header>
        <LeapHeader title={createLeaveTitle} />
      </header>
      <LeftPannel menuIndex={leftMenuAdminSettingsPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

        <form onSubmit={handleSubmit}>
          <LoadingDialog isLoading={isLoading} />
          {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
            setShowAlert(false)
          }} onCloseClicked={function (): void {
            setShowAlert(false)
          }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
          <div className="container">
            <div className="row">
              <div className="col-lg-12 mb-5">
                <div className="grey_box">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="add_form_inner">
                        <div className="row">
                          <div className="col-lg-12 mb-4 inner_heading25">
                            Create new Leave Type
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                                  <label htmlFor="exampleFormControlInput1" className="form-label" >Branch<span className='req_text'>*</span> :</label>
                                  <select id="branchID" name="branchID" onChange={handleInputChange}>
                                  <option value="">Select</option>
                                  {branchArray.map((branch, index) => (
                                      <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                  ))}
                              </select>
                              {errors.branchID && <span className="error" style={{color: "red"}}>{errors.branchID}</span>}

                              </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Type Name<span className='req_text'>*</span> :  </label>
                              <input type="text" className="form-control" value={formValues.leaveType} name="leaveType" onChange={handleInputChange} id="leaveType" placeholder="Enter leave type name" />
                              {errors.leaveType && <span className="error" style={{ color: "red" }}>{errors.leaveType}</span>}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Category:  </label>
                              <select id="categoryID" name="categoryID" value={formValues.categoryID} onChange={handleInputChange}>
                                <option value="">--</option>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                              </select>
                              {errors.categoryID && <span className="error" style={{ color: "red" }}>{errors.categoryID}</span>}
                            </div>
                          </div>                         
                        
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Day Count<span className='req_text'>*</span> :  </label>
                              <input type="text" className="form-control" value={formValues.dayCount} name="dayCount" onChange={handleInputChange} id="dayCount" placeholder="Monthly count" />
                              {errors.dayCount && <span className="error" style={{ color: "red" }}>{errors.dayCount}</span>}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Accrual<span className='req_text'>*</span> :  </label>
                              <select id="leaveAccrual" name="leaveAccrual" value={formValues.leaveAccrual} onChange={handleInputChange}>
                                <option value="">--</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                              </select>
                              {errors.leaveAccrual && <span className="error" style={{ color: "red" }}>{errors.leaveAccrual}</span>}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Gender<span className='req_text'>*</span> : (Applicable for) </label>
                              <select id="gender" name="gender" value={formValues.gender} onChange={handleInputChange}>
                                <option value="">--</option>
                                <option value="All">All</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                              </select>
                              {errors.gender && <span className="error" style={{ color: "red" }}>{errors.gender}</span>}
                            </div>
                          </div>                          
                        
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Applicable for<span className='req_text'>*</span> :  </label>
                              <select id="applicableRole" name="applicableRole" value={formValues.applicableRole} onChange={handleInputChange}>
                                <option value="">--</option>
                                <option value="All">All</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                              </select>
                              {errors.applicableRole && <span className="error" style={{ color: "red" }}>{errors.applicableRole}</span>}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >if unused<span className='req_text'>*</span> :  </label>
                              <select id="ifUnused" name="ifUnused" value={formValues.ifUnused} onChange={handleInputChange}>
                                <option value="">--</option>
                                <option value="Carry Forward">Carry Forward</option>
                                <option value="Lapse">Lapse</option>
                                <option value="Paid">Paid</option>
                              </select>
                              {errors.ifUnused && <span className="error" style={{ color: "red" }}>{errors.ifUnused}</span>}
                            </div>
                          </div>
                          
                        </div>
                        <div className="col-md-12">
                            <div className="form_box mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label" >Leave Description<span className='req_text'>*</span> :  </label>
                              <input type="text" className="form-control" value={formValues.leaveDesc} name="leaveDesc" onChange={handleInputChange} id="leaveDesc" placeholder="Rules & Regulations about this leave" />
                              {errors.leaveDesc && <span className="error" style={{ color: "red" }}>{errors.leaveDesc}</span>}
                            </div>
                        </div>

                        <div className="col-md-12">
                        <div className="form_box mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label mb-3" >Leave Type Icon<span className='req_text'>*</span> :  </label>
                                {iconUrlArray.map((icon)=>
                                    <div className="leave_type_icon" key={icon.leave_type_icon_id} onClick={()=>setSelectedIconID(icon.leave_type_icon_id)}><img src={staticIconsBaseURL+icon.icon_url} className={selectedIconID==icon.leave_type_icon_id?"leave_type_icon_selected img-fluid":"img-fluid" }/></div>
                                )}
                                <div className="row">
                                  {errors.icon && <span className="error" style={{ color: "red" }}>{errors.icon}</span>}
                                </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 mt-4"><input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />&nbsp;&nbsp;<BackButton isCancelText={true} /></div>
                </div>
              </div>
            </div>
          </div>
        </form>

      }
      />

      <div>
        <Footer />
      </div>
    </div>
  )
}

export default CreateLeave


async function getBranches(clientID: any) {

  let query = supabase
      .from('leap_client_branch_details')
      .select()
      .eq("client_id", clientID);

  const { data, error } = await query;
  if (error) {
      console.log(error);

      return [];
  } else {
      return data;
  }

}

async function getLeaveTypeIcons() {

  let query = supabase
      .from('leap_leave_type_icon_and_color')
      .select('leave_type_icon_id,icon_url,bg_color');
      

  const { data, error } = await query;
  if (error) {
      console.log(error);

      return [];
  } else {
      return data;
  }

}