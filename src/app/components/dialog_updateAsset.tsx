// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import { AssetList, AssetType } from '../models/AssetModel';


// const AssetUpdate = ({ onClose, id }: { onClose: () => void, id: any }) => {     
//     const [ showResponseMessage,setResponseMessage ] = useState(false);
//     const {contextClientID,contaxtBranchID,contextSelectedCustId,contextRoleID}=useGlobalContext();
//     const [statusArray, setStatus] = useState<AssetStatus[]>([]);
//     const [typeArray, setType] = useState<AssetType[]>([]);
//     const [conditionArray, setCondition] = useState<AssetCondition[]>([]);

//   const [formValues, setFormValues] = useState<AssetList>({
//     asset_id: 0,
//     purchased_at: '',
//     asset_name: '',
//     asset_pic: null,
//     asset_status: '',
//     device_code: '',
//     created_at: '',
//     updated_at: '',
//     client_id: '',
//     branch_id: '',
//     asset_type: '',
//     condition: '',
//     remark: '',
//     is_deleted: false,
//     warranty_date: '',
//     configuration: '',
//     vendor_bill: null,
//     leap_asset_type: {
//       asset_type: ''
//     },
//     leap_asset_condition: {
//         id: '',
//         condition: '',
//     },
//     leap_asset_status: {
//       id: '',
//       status: '',
//       created_at: '',
//     },
//     leap_customer_asset: [{
//       date_given: '',
//       customer_id: '',
//       leap_customer:  {
//         name: ''
//       }
//     }]
//   });
//     useEffect(() => {
//         const fetchData = async () => {
//             const status = await getStatus();
//             setStatus(status);
//             const type = await getType();
//             setType(type);
//             const assCondition = await getCondition();
//             setCondition(assCondition);

//                 try{
//                     const formData = new FormData();
//                     formData.append("client_id", contextClientID );
//                     // formData.append("branch_id", contaxtBranchID || "3" );
//                     formData.append("asset_id", id );

//                 const res = await fetch("/api/client/asset/getAsset", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 console.log(res);

//                 const response = await res.json();
//                 console.log(response);

//                 const user = response.assetList[0];
//                 setFormValues(user);
//                 } catch (error) {
//                     console.error("Error fetching user data:", error);
//                 }
//             }
//             fetchData();

//     }, []);

//     const [errors, setErrors] = useState<Partial<AssetList>>({});

//     const validate = () => {
//         const newErrors: Partial<AssetList> = {};
//         if (!formValues.asset_name) newErrors.asset_name = "required";
//         if (!formValues.asset_type) newErrors.asset_type = "required";
//         if (!formValues.device_code) newErrors.device_code = "required";
//         if (!formValues.purchased_at) newErrors.purchased_at = "required";
//         if (!formValues.warranty_date) newErrors.warranty_date = "required";
//         if (!formValues.asset_status) newErrors.asset_status = "required";
//         if (!formValues.remark) newErrors.remark = "required";

//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//   };
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validate()) return;
//         console.log("handle submit called");

//         const formData = new FormData();
//         formData.append("asset_id", id );
//         formData.append("client_id",contextClientID);
//         formData.append("branch_id",contaxtBranchID);
//         formData.append("asset_name", formValues.asset_name);
//         formData.append("asset_type", formValues.asset_type);
//         formData.append("device_code", formValues.device_code);
//         formData.append("purchased_at", formValues.purchased_at);
//         formData.append("warranty_date", formValues.warranty_date);
//         formData.append("configuration", formValues.configuration);
//         formData.append("asset_status", formValues.asset_status);
//         formData.append("remark", formValues.remark);


//         try {
//           const response = await fetch("/api/client/asset/updateAsset", {
//               method: "POST",
//               body: formData,

//           });
//           console.log(response);

//           if (response.ok) {
//             onClose();
//           } else {
//               alert("Failed to submit form.");
//           }
//       } catch (error) {
//           console.log("Error submitting form:", error);
//           alert("An error occurred while submitting the form.");
//       }
//       }


//     return (
//         <div className="loader-overlay">
//             <div className="loader-dialog">
//                 <div className="row">
//                     <div className="col-lg-12" style={{textAlign: "right"}}>
//                         <img src="/images/close.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                         onClick={onClose}/>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12 mb-4 inner_heading25 text-center">
//                     Update Asset
//                     </div>
//                 </div>
//                 <form onSubmit={handleSubmit}>

//                     <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Name:  </label>
//                                         <input type="text" className="form-control" value={formValues.asset_name} name="asset_name" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['asset_name']: e.target.value }))} id="asset_name" placeholder="Enter Asset Name" />
//                                         {errors.asset_name && <span className="error" style={{color: "red"}}>{errors.asset_name}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type:</label>
//                                             <select id="asset_type" name="asset_type" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['asset_type']: e.target.value }))}>
//                                                 <option value={formValues.asset_type}>{formValues.leap_asset_type.asset_type}</option>
//                                                 {typeArray.map((type, index) => (
//                                                     <option value={type.id} key={type.id}>{type.asset_type}</option>
//                                                 ))}
//                                             </select>        
//                                             {errors.asset_type && <span className="error" style={{color: "red"}}>{errors.asset_type}</span>}                            
//                                       </div>
//                                     </div>

//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Device code:</label>
//                                         <input type="text" className="form-control" id="device_code" placeholder="Enter serial number" value={formValues.device_code} name="device_code" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['device_code']: e.target.value }))}/>
//                                         {errors.device_code && <span className="error" style={{color: "red"}}>{errors.device_code}</span>}                            
//                                     </div>
//                                 </div>
//                             </div> 

//                             <div className="row">

//                                 <div className="col-md-6">
//                                               <div className="form_box mb-3">
//                                                   <label htmlFor="formFile" className="form-label">Purchase date: </label>
//                                                   <input type="date" id="purchased_at" name="purchased_at" value={formValues.purchased_at} onChange={(e)=>setFormValues((prev) => ({ ...prev, ['purchased_at']: e.target.value }))} />
//                                                   {errors.purchased_at && <span className='error' style={{color: "red"}}>{errors.purchased_at}</span>}
//                                               </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                               <div className="form_box mb-3">
//                                                   <label htmlFor="formFile" className="form-label">Warranty Date: </label>
//                                                   <input type="date" id="warranty_date" name="warranty_date" value={formValues.warranty_date} onChange={(e)=>setFormValues((prev) => ({ ...prev, ['warranty_date']: e.target.value }))} />
//                                                   {errors.warranty_date && <span className='error' style={{color: "red"}}>{errors.warranty_date}</span>}
//                                               </div>
//                                 </div>

//                             </div>
//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Configuration:  </label>
//                                         <input type="text" className="form-control" value={formValues.configuration} name="configuration" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['configuration']: e.target.value }))} id="configuration" placeholder="Enter device configuration" />
//                                         {/* {errors.configuration && <span className="error" style={{color: "red"}}>{errors.configuration}</span>} */}
//                                     </div>
//                                 </div>

//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Status:  </label>
//                                         <select id="asset_status" name="asset_status" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['asset_status']: e.target.value }))}>
//                                                 <option value={formValues.asset_status || ""}>{formValues.leap_asset_status.status}</option>
//                                                 {statusArray.map((stat, index) => (
//                                                     <option value={stat.id} key={stat.id}>{stat.status}</option>
//                                                 ))}
//                                             </select>                                        
//                                             {errors.asset_status && <span className="error" style={{color: "red"}}>{errors.asset_status}</span>}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <div className="form_box mb-3">
//                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Remark:  </label>
//                                         <input type="text" className="form-control" value={formValues.remark} name="remark" onChange={(e)=>setFormValues((prev) => ({ ...prev, ['remark']: e.target.value }))} id="remark" placeholder="" />
//                                         {errors.remark && <span className="error" style={{color: "red"}}>{errors.remark}</span>}
//                                     </div>
//                                 </div>
//                             </div>


//                 <div className="row mb-5">
//                     <div className="col-lg-12 " style={{ textAlign: "center" }}>
//                     <input type='submit' value="Update" className="red_button"  />

//                     </div>


//                 </div>
//                  </form>
//                 {showResponseMessage &&  <div className="row md-5"><label>Leave Type Updated Successfully</label></div>}
//             </div>
//         </div>
//     )
// }

// export default AssetUpdate


//   async function getStatus() {

//     let query = supabase
//         .from('leap_asset_status')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

//   }
//   async function getType() {

//     let query = supabase
//         .from('leap_asset_type')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

//   }
//   async function getCondition() {

//     let query = supabase
//         .from('leap_asset_condition')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);

//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }

//   }


///////swapnil design code shared on 16th april 2025


'use client'
import React, { useEffect, useRef, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { AssetList, AssetType } from '../models/AssetModel';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ALERTMSG_addAssetError, getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';

const AssetUpdate = ({ onClose, id }: { onClose: () => void, id: any }) => {
    const [showResponseMessage, setResponseMessage] = useState(false);
    const { contextClientID, contaxtBranchID, contextSelectedCustId, contextRoleID } = useGlobalContext();
    const [statusArray, setStatus] = useState<AssetStatus[]>([]);
    const [typeArray, setType] = useState<AssetType[]>([]);
    const [conditionArray, setCondition] = useState<AssetCondition[]>([]);
    const swiperRef = useRef<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [isLoading, setLoading] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

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
    useEffect(() => {
        const fetchData = async () => {
            const status = await getStatus();
            setStatus(status);
            const type = await getType();
            setType(type);
            const assCondition = await getCondition();
            setCondition(assCondition);

            try {
                const formData = new FormData();
                formData.append("client_id", contextClientID);
                // formData.append("branch_id", contaxtBranchID || "3" );
                formData.append("asset_id", id);

                const res = await fetch("/api/client/asset/getAsset", {
                    method: "POST",
                    body: formData,
                });
                console.log(res);

                const response = await res.json();
                console.log(response);
                setLoading(false);
                const user = response.assetList[0];
                setFormValues(user);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();

    }, []);

    const [errors, setErrors] = useState<Partial<AssetList>>({});

    const validate = () => {
        const newErrors: Partial<AssetList> = {};
        if (!formValues.asset_name) newErrors.asset_name = "required";
        if (!formValues.asset_type) newErrors.asset_type = "required";
        if (!formValues.device_code) newErrors.device_code = "required";
        if (!formValues.purchased_at) newErrors.purchased_at = "required";
        if (!formValues.warranty_date) newErrors.warranty_date = "required";
        if (!formValues.asset_status) newErrors.asset_status = "required";
        if (!formValues.remark) newErrors.remark = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("handle submit called");
        setLoading(true);
        const formData = new FormData();
        formData.append("asset_id", id);
        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("asset_name", formValues.asset_name);
        formData.append("asset_type", formValues.asset_type);
        formData.append("device_code", formValues.device_code);
        formData.append("purchased_at", formValues.purchased_at);
        formData.append("warranty_date", formValues.warranty_date);
        formData.append("configuration", formValues.configuration);
        formData.append("asset_status", formValues.asset_status);
        formData.append("remark", formValues.remark);


        try {
            const response = await fetch("/api/client/asset/updateAsset", {
                method: "POST",
                body: formData,

            });
            console.log(response);

            if (response.ok) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Asset updated successfully");
                setAlertForSuccess(1)

            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to update asset");
                setAlertForSuccess(2)
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("Failed with exception to update asset");
            setAlertForSuccess(2)
        }
    }


    return (

        <div>
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={""} value2={""} onOkClicked={function (): void {
                setShowAlert(false)
                if (alertForSuccess == 1) {
                    onClose();
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>
            <div className="row">
                <div className="col-lg-12 mb-3 inner_heading25">
                    Update Asset
                </div>
            </div>
            <form onSubmit={handleSubmit}>

                <div className="row">
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Name<span className='req_text'>*</span>:  </label>
                            <input type="text" className="form-control" value={formValues.asset_name} name="asset_name" onChange={(e) => setFormValues((prev) => ({ ...prev, ['asset_name']: e.target.value }))} id="asset_name" placeholder="Enter Asset Name" />
                            {errors.asset_name && <span className="error" style={{ color: "red" }}>{errors.asset_name}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type<span className='req_text'>*</span>:</label>
                            <select id="asset_type" name="asset_type" onChange={(e) => setFormValues((prev) => ({ ...prev, ['asset_type']: e.target.value }))}>
                                <option value={formValues.asset_type}>{formValues.leap_asset_type.asset_type}</option>
                                {typeArray.map((type, index) => (
                                    <option value={type.id} key={type.id}>{type.asset_type}</option>
                                ))}
                            </select>
                            {errors.asset_type && <span className="error" style={{ color: "red" }}>{errors.asset_type}</span>}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Device code<span className='req_text'>*</span>:</label>
                            <input type="text" className="form-control" id="device_code" placeholder="Enter serial number" value={formValues.device_code} name="device_code" onChange={(e) => setFormValues((prev) => ({ ...prev, ['device_code']: e.target.value }))} />
                            {errors.device_code && <span className="error" style={{ color: "red" }}>{errors.device_code}</span>}
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="formFile" className="form-label">Purchase date<span className='req_text'>*</span>: </label>
                            <input type="date" id="purchased_at" name="purchased_at" value={formValues.purchased_at} onChange={(e) => setFormValues((prev) => ({ ...prev, ['purchased_at']: e.target.value }))} />
                            {errors.purchased_at && <span className='error' style={{ color: "red" }}>{errors.purchased_at}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-3">
                            <label htmlFor="formFile" className="form-label">Warranty Date<span className='req_text'>*</span>: </label>
                            <input type="date" id="warranty_date" name="warranty_date" value={formValues.warranty_date} min={formValues.purchased_at} onChange={(e) => setFormValues((prev) => ({ ...prev, ['warranty_date']: e.target.value }))} />
                            {errors.warranty_date && <span className='error' style={{ color: "red" }}>{errors.warranty_date}</span>}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form_box mb-4">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Status<span className='req_text'>*</span>:  </label>
                            <select id="asset_status" name="asset_status" value={formValues.asset_status} onChange={(e) => setFormValues((prev) => ({ ...prev, ['asset_status']: e.target.value }))}>
                                {/* <option value={formValues.asset_status || ""}>{formValues.leap_asset_status.status}</option> */}
                                {statusArray.map((stat, index) => (
                                    <option value={stat.id} key={stat.id}>{stat.status}</option>
                                ))}
                            </select>
                            {errors.asset_status && <span className="error" style={{ color: "red" }}>{errors.asset_status}</span>}
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Configuration:  </label>
                            <textarea className="form-control" style={{ maxHeight: "50px" }} value={formValues.configuration} name="configuration" onChange={(e) => setFormValues((prev) => ({ ...prev, ['configuration']: e.target.value }))} id="configuration" placeholder="Enter device configuration"></textarea>
                            {/* {errors.configuration && <span className="error" style={{color: "red"}}>{errors.configuration}</span>} */}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Remark<span className='req_text'>*</span>:  </label>
                            <textarea className="form-control" style={{ maxHeight: "50px" }} value={formValues.remark} name="remark" onChange={(e) => setFormValues((prev) => ({ ...prev, ['remark']: e.target.value }))} id="remark" placeholder=""></textarea>
                            {errors.remark && <span className="error" style={{ color: "red" }}>{errors.remark}</span>}
                        </div>
                    </div>
                </div>
                {formValues.asset_pic && formValues.asset_pic.length > 0 && <div className="row">
                    <div className="col-lg-12 pt-2 pb-2" style={{ borderTop: "1px solid #ccc" }}>Asset Images</div>
                </div>}
                {/* <div className="row mb-2">
                                        {formValues.asset_pic?.map((pictures,index)=>
                                        <div className="col-lg-3">
                                        <img src={process.env.NEXT_PUBLIC_BASE_URL+"/"+pictures} style={{maxHeight: "50px"}}
                                        className="img-fluid mr-3" />
                                        </div>
                                        )} */}

                {formValues.asset_pic && formValues.asset_pic.length > 0 && <div className="row mb-1 ml-2 mr-2" >
                    <div className="col-lg-12">
                        <div className="div">
                            <div className="swiper-wrapper-with-nav" style={{ position: 'relative' }}>
                                <div className="swiper-button-prev-custom swiper_btn" style={{ visibility: isBeginning ? 'hidden' : isBeginning ? 'hidden' : 'visible', }}>{"<"}</div>
                                <div className="col-lg-12">

                                    <Swiper
                                        spaceBetween={20}
                                        slidesPerView={3}
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
                                        {formValues.asset_pic.length > 0 ? formValues.asset_pic.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className='asset_thumb_img'>
                                                    <img src={getImageApiURL+"/uploads/" + img} className="img-fluid" />
                                                </div>
                                            </SwiperSlide>
                                        )) : <></>}
                                    </Swiper>

                                </div>
                                <div className="swiper-button-next-custom swiper_btn" style={{ visibility: isBeginning ? 'visible' : isEnd ? 'hidden' : 'visible', }}>{">"}</div>
                            </div>

                        </div>
                    </div>
                </div>}
                {formValues.vendor_bill && <div className="row">
                    <div className="col-lg-12 pt-2 pb-2 mt-3" style={{ borderTop: "1px solid #ccc" }}>Vendor bill</div>
                </div>}

                {formValues.vendor_bill && (
                    <div className="col-lg-3">
                        <div className="asset_thumb_img">
                            {(() => {
                                const fileUrl = getImageApiURL+"/uploads/" + formValues.vendor_bill;
                                const fileExtension = formValues.vendor_bill.toString().split('.').pop()?.toLowerCase() || "";

                                if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
                                    // Image preview
                                    return <img src={fileUrl} className="img-fluid mr-3" />;
                                } else if (fileExtension === "pdf") {
                                    // PDF preview or icon
                                    return (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <img src="/images/icon-pdf.png" alt="PDF File" className="img-fluid mr-3" />
                                            {/* <p>View PDF</p> */}
                                        </a>
                                    );
                                } else if (["doc", "docx"].includes(fileExtension)) {
                                    return (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={staticIconsBaseURL + "/images/icon-word.png"} alt="DOCX File" className="img-fluid mr-3" />
                                            {/* <p>View Word Document</p> */}
                                        </a>
                                    );
                                } else if (["xls", "xlsx"].includes(fileExtension)) {
                                    return (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={staticIconsBaseURL + "/images/icon-excel.png"} alt="Excel File" className="img-fluid mr-3" />
                                            {/* <p>View Excel File</p> */}
                                        </a>
                                    );
                                } else {
                                    // Fallback for unknown files
                                    return (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={staticIconsBaseURL + "/icons/icon-any-file.png"} alt="File" className="img-fluid mr-3" />
                                            {/* <p>Download File</p> */}
                                        </a>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                )
                }



                <div className="row mb-5 mt-3">
                    <div className="col-lg-12">
                        <input type='submit' value="Update" className="red_button" />

                    </div>


                </div>
            </form>
            {showResponseMessage && <div className="row md-5"><label>Leave Type Updated Successfully</label></div>}
        </div>

    )
}

export default AssetUpdate


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