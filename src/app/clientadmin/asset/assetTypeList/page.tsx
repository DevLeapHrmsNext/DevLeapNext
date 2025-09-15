// 'use client'
// import React from 'react'
// import LeapHeader from '@/app/components/header'
// import LeftPannel from '@/app/components/leftPannel' 
// import Footer from '@/app/components/footer'
// import LoadingDialog from '@/app/components/PageLoader'
// import  { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import AssetUpdate from '@/app/components/dialog_updateAsset'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import { AssetType } from '@/app/models/AssetModel'
// import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation'
// import BackButton from '@/app/components/BackButton'
// import { deleteDataTypeAsset } from '@/app/pro_utils/stringConstants'

// interface AddAssetType {
//     assetType: string,
//     clientID: string
// }

// const AssetTypeList = () => {
//     const { contextClientID } = useGlobalContext();
//     const [asset, setAsset] = useState<AssetType[]>([]);
//     const [typeArray, setType] = useState<AssetTypeList[]>([]);
//     const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
//     const [showDialog, setShowDialog] = useState(false);
//     const [editAssetTypeId, setEditAssetTypeId] = useState(0);

//     const [formValues, setFormValues] = useState<AddAssetType>({
//         assetType: "",
//         clientID: ""
//     });
//     const [scrollPosition, setScrollPosition] = useState(0);
//     useEffect(() => {
//         fetchData();
//     const handleScroll = () => {
//         setScrollPosition(window.scrollY); // Update scroll position
//         const element = document.querySelector('.mainbox');
//     if (window.pageYOffset > 0) {
//         element?.classList.add('sticky');
//     } else {
//         element?.classList.remove('sticky');
//     }
//       };
//     window.addEventListener('scroll', handleScroll);
//     return () => {
       
//         window.removeEventListener('scroll', handleScroll);
//       };
//     },[])

//     const handleInputChange = async (e: any) => {
//         const { name, value, type, files } = e.target;
//         // console.log("Form values updated:", formValues);
//             setFormValues((prev) => ({ ...prev, [name]: value }));
//         }

//     const formData = new FormData();

//     const fetchData = async () => {
//         try{
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
            
//             const res = await fetch("/api/client/asset/getAssetType", {
//             method: "POST",
//             body: formData,
//         });
//         const response = await res.json();
//         console.log(response);

//         const assetListData = response.assetList;

//         if(assetListData! && assetListData.length > 0 ) {
//             setAsset(assetListData)
//         } else {
//             alert("No such asset exist");
//         }
//         } catch (error) {
//         console.error("Error fetching user data:", error);
//         }
//     }

//     const AddAssetType = async(e: React.FormEvent) => {
//         e.preventDefault();
//         formData.append("asset_type", formValues.assetType);
//         formData.append("client_id", contextClientID );

//         try {
//             const response = await fetch("/api/client/asset/addAssetType", {
//                 method: "POST",
//                 body: formData,
//             });
//             if (response.ok) {
//                 fetchData();
//                 console.log("Asset type added: ", formValues.assetType)
//             } else {
//                 alert("Failed to Add Asset Type");
//             }
//         } catch (error) {
//             console.log("Error adding type:", error);
//             alert("An error occurred while adding asset type");
//         }
//     }


//     return (
//         <div className='mainbox'>
//         <header>
//         <LeapHeader title="Welcome!" />
//         </header>
//             <LeftPannel menuIndex={2} subMenuIndex={0} showLeftPanel={true} rightBoxUI= { 
             
//                 <div>
//                     <div className='container'>
//                         <div className="row"> 

//                             <div className="col-lg-8 mb-4">
//                                 <div className="col-lg-12 mb-4">
//                                     <div className="heading25">Asset <span>Type</span></div>
//                                 </div>
//                                 <div className="grey_box" style={{ backgroundColor: "#fff" }} >
//                                         <div className="row list_label mb-4">
//                                             <div className="col-lg-9 text-center"><div className="label">Type</div></div>                                            
//                                             <div className="col-lg-3 text-center"><div className="label">Action</div></div>                                            
//                                         </div>
//                                         {asset.map((assetList) => (
//                                             <div className="row list_listbox" key={assetList.id} style={{alignItems: "center"}}>
                                            
//                                             <div className="col-lg-9 text-center">{assetList?.asset_type}</div>
                                            
                                    
//                                             <div className="col-lg-3 text-center">
//                                                     <img src="/images/delete.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center", cursor:"pointer" }}
//                                                         onClick={() => {
//                                                             setEditAssetTypeId(assetList?.id);
//                                                             setShowDialog(true);
//                                                             }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {showDialog &&  <DeleteConfirmation id={editAssetTypeId} deletionType={deleteDataTypeAsset} onClose={() => { setShowDialog(false), fetchData() } } deleteDetail={''} />}
//                                     </div>
//                             </div>

//                             <div className="col-lg-4 mb-5">
//                                 <form onSubmit={AddAssetType}>
//                                     <div className="row">
//                                         <div className="col-lg-12 mb-4">
//                                             <div className="heading25">Add New <span>Asset Type</span></div>
//                                         </div>
//                                     </div>
//                                     <div className="row">
//                                         <div className="col-lg-12">
//                                             <div className="grey_box p-3">
//                                                 <div className="row">
//                                                     <div className="col-lg-12">
//                                                         <div className="add_form_inner">
                                                            
//                                                             {/* <div className="row">
//                                                                 <div className="col-md-8">
//                                                                     <div className="form_box mb-3">
//                                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type Name:  </label>
//                                                                         <input type="text" className="form-control" value={formValues.assetType} name="assetType" onChange={handleInputChange}  id="assetType" placeholder="Type name" />
//                                                                     </div>
//                                                                 </div>
//                                                             </div> 
//                                                             <div className="row mb-5">
//                                                                 <div className="col-lg-12" style={{ textAlign: "center" }}>
//                                                                 <input type='submit' value="Add" className="red_button"  />
//                                                                 </div>
//                                                             </div> */}

//                                                             <div className="row">
//                                                                 <div className="row">
//                                                                     <div className="col-lg-12 mb-2">Asset Type Name:</div>
//                                                                 </div>
//                                                                 <div className="row">
//                                                                     <div className="col-lg-9">
//                                                                         <input type="text" className="form-control" value={formValues.assetType} name="assetType" onChange={handleInputChange}  id="assetType" placeholder="Type name" />
//                                                                     </div>
//                                                                     <div className="col-lg-3">
//                                                                         <input type='submit' value="Add" className="red_button"  />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>

//                             </div>
//                         </div> 
//                         <div className="row">
//                                 <div className="col-lg-12"><BackButton isCancelText={false}/></div>
//                         </div>    
//                     </div>
//                 </div>
//             }/>
//         {/* </div> */}

//     <div>
//       <Footer />
//     </div>
//         </div>
//     )
// }

// export default AssetTypeList;


////// swapnil code of design on 16th april 2025



'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel' 
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import  { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import AssetUpdate from '@/app/components/dialog_updateAsset'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { AssetType } from '@/app/models/AssetModel'
import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation'
import BackButton from '@/app/components/BackButton'
import { ALERTMSG_addAssetTypeError, deleteDataTypeAsset, ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

interface AddAssetType {
    assetType: string,
    clientID: string
}

const AssetTypeList = () => {
    const { contextClientID } = useGlobalContext();
    const [asset, setAsset] = useState<AssetType[]>([]);
    const [typeArray, setType] = useState<AssetTypeList[]>([]);
    const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [editAssetTypeId, setEditAssetTypeId] = useState(0);
    const [isLoading,setLoading]=useState(false);
    const [addTypeError,setAddTypeError] = useState("")
    const [showAlert,setShowAlert]=useState(false);
    const [alertForSuccess,setAlertForSuccess]=useState(0);
    const [alertTitle,setAlertTitle]=useState('');
    const [alertStartContent,setAlertStartContent]=useState('');
    const [alertMidContent,setAlertMidContent]=useState('');
    const [alertEndContent,setAlertEndContent]=useState('');
    const [alertValue1,setAlertValue1]=useState('');
    const [alertvalue2,setAlertValue2]=useState('');

    
    const [formValues, setFormValues] = useState<AddAssetType>({
        assetType: "",
        clientID: ""
    });
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
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

    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        // console.log("Form values updated:", formValues);
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }

    const formData = new FormData();

    const fetchData = async () => {
        setLoading(true);
        try{
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            
            const res = await fetch("/api/client/asset/getAssetType", {
            method: "POST",
            body: formData,
        });
        const response = await res.json();
        console.log(response);

        const assetListData = response.assetList;
        if(response && response.status==1) {
            setLoading(false);
            if(assetListData! && assetListData.length > 0 ) {
                
                setAsset(assetListData)
            }else{
                setAsset([]);
            } 
        }
        else {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Error")
            setAlertStartContent("Failed to get asset types");
            setAlertForSuccess(2)
        }
        } catch (error) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception Occured")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
            console.error("Error fetching user data:", error);
        }
    }

    const AddAssetType = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!formValues.assetType || !formValues.assetType.trim()) {
            setAddTypeError("required")
            return ;
        }
        
        formData.append("asset_type", formValues.assetType);
        formData.append("client_id", contextClientID );
        setLoading(true);
        try {
            const response = await fetch("/api/client/asset/addAssetType", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                setFormValues({assetType:"",clientID:contextClientID})
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success");
                setAlertStartContent("Asset type added successfully-");
                setAlertValue1(formValues.assetType)
                setAlertForSuccess(1);
            } else {
                setLoading(false);
                console.log("Asset type added: ", response.json());
                setShowAlert(true);
                setAlertTitle("Error");
                setAlertStartContent(ALERTMSG_addAssetTypeError);
                setAlertForSuccess(2);
            }
        } catch (error) {
            setLoading(false);
            setShowAlert(true);
            console.log("Error adding type:", error);
            setAlertTitle("Exception");
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
        }
    }


    return (
        <div className='mainbox'>
        <header>
        <LeapHeader title="Welcome!" />
        </header>
            <LeftPannel menuIndex={2} subMenuIndex={0} showLeftPanel={true} rightBoxUI= { 
             
                <div>
                <LoadingDialog isLoading={isLoading} /> 
                {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length>0?alertMidContent: ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        if(alertForSuccess==1){
                        fetchData()
                        }
                        setShowAlert(false)
                    } } onCloseClicked={function (): void {
                        setShowAlert(false)
                    } } showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>
                        <div className="row"> 

                            <div className="col-lg-8 mb-4">
                                <div className="col-lg-12 mb-4">
                                    <div className="heading25">Asset <span>Type</span></div>
                                </div>
                                <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                        <div className="row list_label mb-4">
                                            <div className="col-lg-9 text-center"><div className="label">Type</div></div>                                            
                                            <div className="col-lg-3 text-center"><div className="label">Action</div></div>                                            
                                        </div>
                                        {asset&& asset.length>0? asset.map((assetList) => (
                                            <div className="row list_listbox" key={assetList.id} style={{alignItems: "center"}}>
                                            
                                            <div className="col-lg-9 text-center">{assetList?.asset_type}</div>
                                            
                                    
                                            <div className="col-lg-3 text-center">
                                                    <img src={staticIconsBaseURL+"/images/delete.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center", cursor:"pointer" }}
                                                        onClick={() => {
                                                            setEditAssetTypeId(assetList?.id);
                                                            setShowDialog(true);
                                                            }}
                                                    />
                                                </div>
                                            </div>
                                        )):<div className="text-center">No Asset Type Available</div>}
                                        {showDialog &&  <DeleteConfirmation id={editAssetTypeId} deletionType={deleteDataTypeAsset} onClose={() => { setShowDialog(false), fetchData() } } deleteDetail={''}/>}
                                    </div>
                            </div>

                            <div className="col-lg-4 mb-5">
                                <form onSubmit={AddAssetType}>
                                    <div className="row">
                                        <div className="col-lg-12 mb-4">
                                            <div className="heading25">Add New <span>Asset Type</span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="grey_box p-3">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="add_form_inner">
                                                            
                                                            {/* <div className="row">
                                                                <div className="col-md-8">
                                                                    <div className="form_box mb-3">
                                                                        <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type Name:  </label>
                                                                        <input type="text" className="form-control" value={formValues.assetType} name="assetType" onChange={handleInputChange}  id="assetType" placeholder="Type name" />
                                                                    </div>
                                                                </div>
                                                            </div> 
                                                            <div className="row mb-5">
                                                                <div className="col-lg-12" style={{ textAlign: "center" }}>
                                                                <input type='submit' value="Add" className="red_button"  />
                                                                </div>
                                                            </div> */}

                                                            <div className="row">
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">Asset Type Name<span className='req_text'>*</span>:</div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-9">
                                                                        <input type="text" className="form-control" value={formValues.assetType} name="assetType" onChange={handleInputChange}  id="assetType" placeholder="Type name" />
                                                                        {addTypeError && <span className="error" style={{ color: "red" }}>{addTypeError}</span>}

                                                                    </div>
                                                                    <div className="col-lg-3">
                                                                        <input type='submit' value="Add" className="red_button"  />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div> 
                        <div className="row">
                                <div className="col-lg-12"><BackButton isCancelText={false}/></div>
                        </div>    
                    </div>
                </div>
            }/>
        {/* </div> */}

    <div>
      <Footer />
    </div>
        </div>
    )
}

export default AssetTypeList;


