
'use client'
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { addAssetTitle, ALERTMSG_addAssetError, ALERTMSG_addAssetSuccess, ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { AssetList, AssetType } from '@/app/models/AssetModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { pageURL_assetListing, leftMenuAssetsPageNumbers } from '@/app/pro_utils/stringRoutes'
import BackButton from '@/app/components/BackButton'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LoadingDialog from '@/app/components/PageLoader'
import ShowAlertMessage from '@/app/components/alert'

const AddAsset: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter()

  const [statusArray, setStatus] = useState<AssetStatus[]>([]);
  const [typeArray, setType] = useState<AssetType[]>([]);
  const [selectedImageThumbnails, setImageThubnails] = useState<string[]>([]);
  const [conditionArray, setCondition] = useState<AssetCondition[]>([]);
  const { contaxtBranchID, contextClientID, contextCustomerID } = useGlobalContext();
  const [loadingCursor, setLoadingCursor] = useState(false);
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertForSuccess, setAlertForSuccess] = useState(0);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertStartContent, setAlertStartContent] = useState('');
  const [alertMidContent, setAlertMidContent] = useState('');
  const [alertEndContent, setAlertEndContent] = useState('');
  const [alertValue1, setAlertValue1] = useState('');
  const [alertvalue2, setAlertValue2] = useState('');

  useEffect(() => {
    setLoadingCursor(true);
    const fetchData = async () => {
      const status = await getStatus();
      setStatus(status);
      const type = await getType();
      setType(type);
      const assCondition = await getCondition();
      setCondition(assCondition);
      setLoadingCursor(false);
    };
    fetchData();
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
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

  const [formValues, setFormValues] = useState<AssetList>({
    asset_id: 0,
    purchased_at: '',
    asset_name: '',
    asset_pic: [],
    asset_status: '',
    device_code: '',
    created_at: '',
    updated_at: '',
    client_id: '',
    branch_id: '',
    asset_type: '',
    condition: '',
    remark: '',
    is_deleted: false,
    warranty_date: '',
    configuration: '',
    vendor_bill: null,
    leap_asset_type: {
      asset_type: '',
      id: 0,
      client_id: 0,
      created_at: '',
      is_deleted: false
    },
    leap_asset_condition: {
      id: '',
      condition: '',
    },
    leap_asset_status: {
      id: '',
      status: '',
      created_at: '',
    },
    leap_customer_asset: [{
      date_given: '',
      customer_id: '',
      leap_customer: {
        name: ''
      }
    }]
  });

  const handleInputChange = async (e: any) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormValues((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }

  }

  const formData = new FormData();

  const [errors, setErrors] = useState<Partial<AssetList>>({});

  const validate = () => {
    const newErrors: Partial<AssetList> = {};
    if (!formValues.asset_name) newErrors.asset_name = "required";
    if (!formValues.asset_type) newErrors.asset_type = "required";
    if (!formValues.device_code) newErrors.device_code = "required";
    if (!formValues.purchased_at) newErrors.purchased_at = "required";
    if (!formValues.warranty_date) newErrors.warranty_date = "required";
    // if (!formValues.configuration) newErrors.configuration = "required";
    if (!formValues.condition) newErrors.condition = "required";
    // if (!formValues.billUrl) newErrors.billUrl = "required";
    if (!formValues.remark) newErrors.remark = "required";
    // if (!formValues.pictureUrl) newErrors.pictureUrl = "required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setLoadingCursor(true);
    let assetPicUrl = [];
    let billUrl = "";

    if (formValues.asset_pic.length > 0) {
      for (let i = 0; i < formValues.asset_pic.length; i++) {
        assetPicUrl.push(await fileUpload(formValues.asset_pic[i], "asset_pictures"));
      }

    }

    if (formValues.vendor_bill != null) {
      billUrl = await fileUpload(formValues.vendor_bill, "vendor_bill");
    }

    formData.append("client_id", contextClientID);
    formData.append("branch_id", contaxtBranchID);
    formData.append("asset_name", formValues.asset_name);
    formData.append("asset_type", formValues.asset_type);
    formData.append("device_code", formValues.device_code);
    formData.append("purchased_at", formValues.purchased_at);
    formData.append("warranty_date", formValues.warranty_date);
    formData.append("configuration", formValues.configuration);
    formData.append("condition", formValues.condition);
    formData.append("remark", formValues.remark);
    formData.append("vendor_bill", billUrl);
    formData.append("asset_pic", JSON.stringify(assetPicUrl));

    try {
      const response = await fetch("/api/client/asset/addAsset", {
        method: "POST",
        body: formData,

      });

      if (response.ok) {
        setLoadingCursor(false);

        setShowAlert(true);

        setAlertTitle("Success")
        setAlertStartContent(ALERTMSG_addAssetSuccess);
        setAlertForSuccess(1)
      } else {
        setLoadingCursor(false);
        setShowAlert(true);

        setAlertTitle("Error")
        setAlertStartContent(ALERTMSG_addAssetError);
        setAlertForSuccess(2)
      }
    } catch (error) {
      setLoadingCursor(false);
      console.log("Error submitting form:", error);
      setShowAlert(true);

      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2)
    }

  }




  return (
    <div className='mainbox'>
      <header>
        <LeapHeader title={addAssetTitle} />
      </header>
      <LeftPannel menuIndex={leftMenuAssetsPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
        <div >
          <LoadingDialog isLoading={loadingCursor} />
          {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
            router.push(pageURL_assetListing);
            setShowAlert(false)
          }} onCloseClicked={function (): void {
            setShowAlert(false)
          }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
          <form onSubmit={handleSubmit}>
            <div className="container">
              <div className="col-lg-12 heading25">
                Add <span>Asset</span>
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
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Name<span className='req_text'>*</span>:  </label>
                                <input type="text" className="form-control" value={formValues.asset_name} name="asset_name" onChange={handleInputChange} id="asset_name" placeholder="Enter Asset Name" />
                                {errors.asset_name && <span className="error" style={{ color: "red" }}>{errors.asset_name}</span>}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type<span className='req_text'>*</span>:</label>
                                <select id="asset_type" name="asset_type" onChange={handleInputChange}>
                                  <option value="">Select</option>
                                  {typeArray.map((type, index) => (
                                    <option value={type.id} key={type.id}>{type.asset_type}</option>
                                  ))}
                                </select>
                                {errors.asset_type && <span className="error" style={{ color: "red" }}>{errors.asset_type}</span>}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Device Code<span className='req_text'>*</span>:</label>
                                <input type="text" className="form-control" id="device_code" placeholder="Enter serial number" value={formValues.device_code} name="device_code" onChange={handleInputChange} />
                                {errors.device_code && <span className="error" style={{ color: "red" }}>{errors.device_code}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="row">

                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="formFile" className="form-label">Purchase Date<span className='req_text'>*</span>: </label>
                                <input type="date" id="purchased_at" name="purchased_at" value={formValues.purchased_at} onChange={handleInputChange} />
                                {errors.purchased_at && <span className='error' style={{ color: "red" }}>{errors.purchased_at}</span>}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="formFile" className="form-label">Warranty Date<span className='req_text'>*</span>: </label>
                                <input type="date" id="warranty_date" name="warranty_date" value={formValues.warranty_date} min={formValues.purchased_at} onChange={handleInputChange} />
                                {errors.warranty_date && <span className='error' style={{ color: "red" }}>{errors.warranty_date}</span>}
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Condition<span className='req_text'>*</span>:  </label>
                                <select id="condition" name="condition" onChange={handleInputChange}>
                                  <option value="">Select</option>
                                  {conditionArray.map((condi, index) => (
                                    <option value={condi.id} key={condi.id}>{condi.condition}</option>
                                  ))}
                                </select>
                                {/* float: "left", */}
                                <div style={{  margin: "5px 0 0 0", fontSize: "13px" }}>(at the time of purchase)</div>
                                {errors.condition && <span className="error" style={{ color: "red" }}>{errors.condition}</span>}
                              </div>
                            </div>

                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Configuration:  </label>
                                <textarea className="form-control" value={formValues.configuration} name="configuration" onChange={handleInputChange} id="configuration" placeholder="Enter device configuration" ></textarea>
                                {/* {errors.config && <span className="error" style={{color: "red"}}>{errors.config}</span>} */}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Remark<span className='req_text'>*</span>:  </label>
                                <textarea className="form-control" value={formValues.remark} name="remark" onChange={handleInputChange} id="remark" placeholder="If any" ></textarea>
                                {errors.remark && <span className="error" style={{ color: "red" }}>{errors.remark}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="row">
                                <div className="col-lg-12 mb-1">Upload Vendor Bill: </div>
                              </div>
                              <div className="upload_list">

                                <div className="row">
                                  <div className="col-lg-12">
                                    <input type="file" className="upload_document" name="vendor_bill" id="vendor_bill" onChange={(e) => setFormValues((prev) => ({ ...prev, ['vendor_bill']: e.target.files![0] }))} />
                                  </div>
                                  {/* <div className="col-lg-3">
                                    <input type="button" value="Upload" className="upload_btn" onClick={(e)=>fileUpload("Vendor Bill")}/>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="row">
                                <div className="col-lg-12 mb-1">Upload Asset Picture: </div>
                              </div>
                              <div className="upload_list">

                                <div className="row">
                                  <div className="col-lg-12">
                                    {/* <input type="file" className="upload_document" name="asset_pic" id="asset_pic" onChange={(e) => setFormValues((prev) => ({ ...prev, ['asset_pic']: e.target.files![0] }))} /> */}
                                    <input type="file" accept="image/*" className="upload_document" multiple name="asset_pic" id="asset_pic" onChange={(e) => {
                                      for (let i = 0; i < e.target.files!.length; i++) {
                                        setImageThubnails(prev => [...prev, URL.createObjectURL(e.target.files![i])]);
                                        setFormValues((prev) => ({ ...prev, asset_pic: [e.target.files![i]], }));
                                      }

                                    }} />
                                  </div>
                                  {/* <div className="col-lg-3">
                                    <input type="button" value="Upload" className="upload_btn" onClick={(e)=>fileUpload("Asset Picture")}/>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>&nbsp;
                  {/* <div className="row">
                            {selectedImageThumbnails.map((image,index)=>
                            <div className="col-lg-3 text-center">
                              <img src={image} className="img-fluid" />
                            </div>
                        )
                              
                            }        
                  </div> */}

                  <div className="row">
                    <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton isCancelText={true} /><input type='submit' value="Submit" className="red_button" onClick={handleSubmit} /></div>
                  </div>
                </div>
                <div className='col-lg-4 p-0'>

                  {selectedImageThumbnails.length == 0 ? <img src={staticIconsBaseURL + "/images/add_asset_img.png"} className="img-fluid" /> :
                    <div className='mt-4'>
                      <div className="swiper-wrapper-with-nav" style={{ position: 'relative' }}>
                        <div className="swiper-button-prev-custom swiper_btn" style={{ visibility: isBeginning ? 'hidden' : 'visible', }}>{"<"}</div>
                        <div>

                          <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            navigation={{
                              nextEl: '.swiper-button-next-custom',
                              prevEl: '.swiper-button-prev-custom',
                            }}
                            modules={[Navigation]}
                            onSwiper={(swiper) => {
                              console.log(swiper);

                              swiperRef.current = swiper;
                              setIsBeginning(swiper.isBeginning);
                              setIsEnd(swiper.isEnd);
                            }}
                            onSlideChange={(swiper) => {
                              console.log(swiper);
                              setIsBeginning(swiper.isBeginning);
                              setIsEnd(swiper.isEnd);
                            }}
                          >
                            {selectedImageThumbnails.length > 0 ? selectedImageThumbnails.map((img, index) => (
                              <SwiperSlide key={index}>
                                <div className='asset_upload_img'>
                                  <img src={img} className="img-fluid" />
                                </div>
                              </SwiperSlide>
                            )) : <></>}
                          </Swiper>

                        </div>
                        <div className="swiper-button-next-custom swiper_btn" style={{ visibility: isEnd ? 'hidden' : 'visible', }}>{">"}</div>
                      </div>
                    </div>
                  }

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

export default AddAsset

async function getStatus() {

  let query = supabase
    .from('leap_asset_status')
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
async function getType() {

  let query = supabase
    .from('leap_asset_type')
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
async function getCondition() {

  let query = supabase
    .from('leap_asset_condition')
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
async function fileUpload(file: File, docName: string) {
  try {

    const formData = new FormData();
    formData.append("client_id", "3");
    formData.append("customer_id", "3");
    formData.append("docType", "assets");
    formData.append("docName", docName);
    formData.append("file", file);

    const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments", {
      method: "POST",
      // headers:{"Content-Type":"multipart/form-data"},
      body: formData,
    });

    const fileUploadResponse = await fileUploadURL.json();
    console.log(fileUploadResponse);

    return fileUploadResponse.data;

  } catch (error) {
    console.log(error);
    return ""
  }
}