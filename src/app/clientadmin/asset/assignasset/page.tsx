'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel' 
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { addAssetTitle, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { AssetList, AssetType } from '@/app/models/AssetModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { leftMenuAssetsPageNumbers } from '@/app/pro_utils/stringRoutes'
import BackButton from '@/app/components/BackButton'
import Select from "react-select";


interface AssetForm {
    client_id: string,
    branchID: string,
    givenDate: string,
    customerID:string,
    assetID: string,
    remark: string,
    picture: File | null,
    pictureUrl: string,
}

const AddAsset : React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter()

  const [assetArray, setAsset] = useState<AssetList[]>([]);
  const [assetTypeArray, setAssetType] = useState<AssetType[]>([]);

  const [empArray, setEmp] = useState<CustomerProfile[]>([]);
  const [deptArray, setDept] = useState<DepartmentTableModel[]>([]);
  const {contaxtBranchID,contextClientID,contextCustomerID}=useGlobalContext();
  const [selectedAssetType, setSelectedAssetType] = useState<string>("");
  const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);

  const handleAssetTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedAssetType(value);
      const getAssets = await getAsset(value);
      setAsset(getAssets);
  };
  

  
  useEffect(() => {
      const fetchData = async () => {
       

        const assetType = await getAssetType();
        setAssetType(assetType);
        const emp = await getEmployee();
        setEmp(emp);
        let name: any[] = []
            for (let i = 0; i < emp.length; i++) {

                name.push({
                    value: emp[i].customer_id,
                    label: emp[i].name,
                })
            }
            console.log(name);

            setEmployeeNames(name);
        const dept = await getDepartment();
        setDept(dept);

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

  },[])
 
  const [formValues, setFormValues] = useState<AssetForm>({
    client_id: "",
    branchID: "",
    givenDate: "",
    customerID: "",
    assetID: "",
    remark: "",
    picture: null,
    pictureUrl: "",
  });

  const handleInputChange = async (e: any) => {
    const { name, value, type, files } = e.target;
    // console.log("Form values updated:", formValues);
    if (type === "file") {
        setFormValues((prev) => ({ ...prev, [name]: files[0] }));
    } else {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }
        
  }
const handleEmpSelectChange = async (values: any) => {
        setFormValues((prev) => ({ ...prev, ["customerID"]: values.value }));
        

    };
    const formData = new FormData();
    const [errors, setErrors] = useState<Partial<AssetForm>>({});
 
    const validate = () => {
      const newErrors: Partial<AssetForm> = {};
      if (!formValues.givenDate) newErrors.givenDate = "required";
      if (!formValues.customerID) newErrors.customerID = "required";
      if (!formValues.assetID) newErrors.assetID = "required";
      if (!formValues.remark) newErrors.remark = "required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("handle submit called");

    formData.append("client_id", contextClientID || "3");
    formData.append("branch_id", contaxtBranchID || "3");
    formData.append("asset_id", formValues.assetID);
    formData.append("customer_id", formValues.customerID);
    formData.append("date_given", formValues.givenDate);
    formData.append("remark", formValues.remark);
    formData.append("asset_pic", formValues.pictureUrl);

    try {
      const response = await fetch("/api/client/asset/assignAsset", {
          method: "POST",
          body: formData,

      });
      // console.log(response);

      if (response.ok) {
          
          router.push("/clientadmin/asset");
      } else {
          alert("Failed to submit form.");
      }
  } catch (error) {
      console.log("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
  }

  }

  const fileUpload = async (name: any) => {

    let file: any;

    if (name == "Asset Picture") {
        file = formValues.picture;
    }
   
    try {

        // file url name            

        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("customer_id", contextCustomerID);
        formData.append("docType","assets" );
        formData.append("docName","asset_pictures");
        formData.append("file", file);

        const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments", {
            method: "POST",
            // headers:{"Content-Type":"multipart/form-data"},
            body: formData,
        });

        const fileUploadResponse = await fileUploadURL.json();
        console.log(fileUploadResponse);
        if (name == "Asset Picture") {
        setFormValues((prev) => ({ ...prev, ["pictureUrl"]: fileUploadResponse.data }));
        }

  }catch (error) {
    console.log(error);
}
}
  
    return (
      <div className='mainbox'>
      <header>
      <LeapHeader title={addAssetTitle} />
      </header>
      <LeftPannel menuIndex={leftMenuAssetsPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
        
              <form onSubmit={handleSubmit}>
              <div className="container">
                <div className="col-lg-12 heading25">
                    Assign <span>Asset</span>
                </div>
                <div className="row"> 
                  <div className="col-lg-8 mb-5 mt-4">
                    <div className="grey_box">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="add_form_inner">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form_box mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Employee<span className='req_text'>*</span>:</label>
                                            <Select
                                                            className="custom-select"
                                                            classNamePrefix="custom"
                                                            options={employeeName}
                                                            onChange={(selectedOption) =>
                                                                handleEmpSelectChange(selectedOption)
                                                            }
                                                            placeholder="Search Employee"
                                                            isSearchable
                                                        />
                                            {errors.customerID && <span className="error" style={{color: "red"}}>{errors.customerID}</span>}                                   
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form_box mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type<span className='req_text'>*</span>:</label>
                                            <select id="assetTypeID" name="assetTypeID" onChange={handleAssetTypeChange}>
                                                <option value="">Select</option>
                                                {assetTypeArray.map((type, index) => (
                                                    <option value={type.id} key={type.id}>{type.asset_type}</option>
                                                ))}
                                            </select> 
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form_box mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Asset<span className='req_text'>*</span>:</label>
                                        <select id="assetID" name="assetID" onChange={handleInputChange}>
                                            <option value="">Select</option>
                                                {assetArray.length > 0 ? (
                                                    assetArray.map((type) => (
                                                        <option value={type.asset_id} key={type.asset_id}>{type.asset_name}</option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>None Available</option>
                                                )}
                                            </select> 
                                            {errors.assetID && <span className="error" style={{color: "red"}}>{errors.assetID}</span>}   
                                            
                                
                                    </div>
                                </div>
                                
                            </div> 

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form_box mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Remark<span className='req_text'>*</span>:  </label>
                                        <input type="text" className="form-control" value={formValues.remark} name="remark" onChange={handleInputChange} id="remark" placeholder="" />
                                        {errors.remark && <span className="error" style={{color: "red"}}>{errors.remark}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{alignItems: 'center'}}>
                            <div className="col-md-4">
                                    <div className="form_box mb-3">
                                        <label htmlFor="formFile" className="form-label">Date of Allotment<span className='req_text'>*</span>: </label>
                                        <input type="date" id="givenDate" name="givenDate" value={formValues.givenDate} onChange={handleInputChange} />
                                        {errors.givenDate && <span className='error' style={{color: "red"}}>{errors.givenDate}</span>}
                                    </div>
                                </div>
                              <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-lg-12 mb-1">Upload Asset Picture: </div>
                                </div>
                                <div className="upload_list">
                                    <div className="row">
                                        <div className="col-lg-9">
                                            <input type="file" className="upload_document" accept="image/*" name="picture" id="picture" onChange={handleInputChange}/>
                                        </div>
                                        <div className="col-lg-3">
                                            <input type="button" value="Upload" className="upload_btn" onClick={(e)=>fileUpload("Asset Picture")}/>
                                        </div>
                                    </div>
                                </div>
                              </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>&nbsp;
                    <div className="row">
                            <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton isCancelText={true}/><input type='submit' value="Submit" className="red_button" onClick={handleSubmit} /></div>
                    </div>
                  </div>
                  <div className='col-lg-4'><img src={staticIconsBaseURL+"/images/add_asset_img.png"} className="img-fluid" /></div>
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

export default AddAsset

async function getAssetType() {

    let query = supabase
        .from('leap_asset_type')
        .select()
  
    const { data, error } = await query;
    if (error) {
        // console.log(error);
  
        return [];
    } else {
        // console.log(data);
        return data;
    }
  
  }


  async function getEmployee() {

    let query = supabase
        .from('leap_customer')
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
  async function getDepartment() {

    let query = supabase
        .from('leap_client_departments')
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
  async function getAsset(assetTypeID: string) {
    let query = supabase
        .from('leap_asset')
        .select()
        .eq("asset_status", 1)
        .eq("asset_type", assetTypeID);

    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}