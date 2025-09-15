// 'use client'
// import React from 'react'
// import LeapHeader from '@/app/components/header'
// import LeftPannel from '@/app/components/leftPannel' 
// import Footer from '@/app/components/footer'
// import LoadingDialog from '@/app/components/PageLoader'
// import  { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import { AssetList } from '@/app/models/AssetModel'
// import AssetUpdate from '@/app/components/dialog_updateAsset'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import BackButton from '@/app/components/BackButton'
// import { pageURL_addAsset, pageURL_assetTypeList, pageURL_assignAsset } from '@/app/pro_utils/stringRoutes'
// import DialogAssignAsset from '@/app/components/dialog_assign_asset'

// interface AssetType {
//     assetType: string
// }

// const Asset = () => {
//     const { contextClientID } = useGlobalContext();

//     const [asset, setAsset] = useState<AssetList[]>([]);
//     const [typeArray, setType] = useState<AssetTypeList[]>([]);
//     const [filterID, setFilterID]=useState(0);
//     const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
//     const [toggleClass, setToggleClass] = useState("middle_box");
//     const [showDialog, setShowDialog] = useState(false);
//     const [isLoading, setLoading] = useState(true);
//     const [showAssignAssetDialog, setShowAssignAssetDialog] = useState(false);
//     const [selectedAssetID, setSelectedAssetID] = useState(-1);
//     const [editAssetTypeId, setEditAssetTypeId] = useState(0);

//     const [formValues, setFormValues] = useState<AssetType>({
//         assetType: "",
//     });
//     const [scrollPosition, setScrollPosition] = useState(0);

//     useEffect(() => {
//         fetchData(0);
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

//     const fetchData = async (filterID: any) => {
//         setLoading(true);
//         const type = await getType(contextClientID );
//         setType(type);

//         try{
//             const formData = new FormData();
//             formData.append("client_id", contextClientID );
//             formData.append("asset_type", filterID );

//             setFilterID(filterID);

//             const res = await fetch("/api/client/asset/getAsset", {
//             method: "POST",
//             body: formData,
//         });
//         const response = await res.json();
//         console.log(response);

//         const assetListData = response.assetList;

//         // if(assetListData! && assetListData.length > 0 ) {
//         //     setAsset(assetListData)
//         // } else {
//         //     alert("No such asset exist");
//         // }

//         if (response.status === 1) {
//             setAsset(response.assetList || []); 
//             setLoading(false);
//         } else {
//             setAsset([]);
//             setLoading(false);
//         }
//         } catch (error) {
//             setLoading(false);
//             alert("Error fetching Asset Data");
//             console.error("Error fetching user data:", error);
//         }
//     }


//     const handleMenuClick = (index:any) => {
//         setSelectedLeftMenuItemIndex(index); // Update the state correctly
//       };

//     return (
//         <div className='mainbox'>
//         <header>
//         <LeapHeader title="Welcome!" />
//         </header>
//             <LeftPannel menuIndex={2} subMenuIndex={0} showLeftPanel={true} rightBoxUI= { 
//                 // typeArray! && typeArray.length > 0 && asset! && asset.length > 0 ?

//                 <div>
//                     <LoadingDialog isLoading={isLoading} />
//                     <div className='container'>
//                     <div className="row heading25 mb-3 pb-3"> 
//                         <div className="col-lg-6">
//                             Asset <span>List</span>
//                         </div>
//                         <div className="col-lg-6" style={{textAlign: "right"}}>


//                                     <a href={pageURL_assetTypeList} className="red_button red_button2">Asset Type</a>&nbsp;
//                                     <a href={pageURL_addAsset} className="red_button red_button2">Add New Asset</a>&nbsp;
//                                     <a href={pageURL_assignAsset} className="red_button red_button2">Assign Asset</a>



//                         </div>
//                     </div>

//                     <div className="row mb-5">
//                         <div className="col-lg-2">
//                             <div className={selectedLeftMenuItemIndex==0?"list_view_box_selected":"list_view_box"} style={{ width: "100%", margin: "0", }}>
//                                 <a onClick={(e) => {fetchData(0), handleMenuClick(0) }}>
//                                     <div className={selectedLeftMenuItemIndex==0?"selected text-center":"list_view_heading text-center"}  >All</div>
//                                 </a>
//                             </div>
//                         </div>
//                         <div className="col-lg-10">
//                             <div className="horizontal_scrolling pb-2" >
//                             {typeArray.map((id) => (
//                                 <div className={selectedLeftMenuItemIndex==id.id?"announcement_branch_box_selected":"announcement_branch_box"} key={id.id} >

//                                     <a  onClick={(e) => {fetchData(id.id), handleMenuClick(id.id)}}>
//                                         <div className={"list_view_heading text-center"}> {id.asset_type} </div>
//                                     </a>
//                                 </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                         <div className="row">                       
//                             <div className="col-lg-12">
//                                     <div className="row mb-5">
//                                         <div className="col-lg-12">
//                                             <div className="grey_box" style={{ backgroundColor: "#fff" }} >
//                                                 <div className="row list_label mb-4">
//                                                     <div className="col-lg-2 text-center"><div className="label">Asset Name</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Type</div></div>
//                                                     <div className="col-lg-1 text-center"><div className="label">Device Code</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Status</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Allotted to</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Allotment date</div></div>   
//                                                 </div>
//                                                 {asset.length > 0 ? (
//                                                 asset.map((assetList) => (
//                                                     <div className="row list_listbox" key={assetList.asset_id}>
//                                                     <div className="col-lg-2 text-center">{assetList.asset_name}</div>
//                                                     <div className="col-lg-2 text-center">{assetList?.leap_asset_type?.asset_type}</div>
//                                                     <div className="col-lg-1 text-center">{assetList.device_code}</div>
//                                                     <div className="col-lg-2 text-center">{assetList?.leap_asset_status?.status}</div>

//                                                      {assetList?.leap_asset_status?.status === "Assigned" ? (
//                                                             <>
//                                                                 <div className="col-lg-2 text-center">{assetList?.leap_customer_asset[0]?.leap_customer?.name || "--"}</div>
//                                                                 <div className="col-lg-2 text-center">{assetList?.leap_customer_asset[0]?.date_given || "--"}</div>
//                                                             </>
//                                                             ) : (
//                                                             <>
//                                                                 <div className="col-lg-2 text-center font14_Medium blinking_text_red" onClick={(e)=>{setSelectedAssetID(assetList.asset_id);setShowAssignAssetDialog(true)}} >Allot</div>
//                                                                 <div className="col-lg-2 text-center">--</div>
//                                                             </>
//                                                             )}
//                                                     <div className="col-lg-1 text-center">
//                                                             <img src="/images/edit.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
//                                                                 onClick={() => {
//                                                                     setEditAssetTypeId(assetList?.asset_id);
//                                                                      setShowDialog(true)
//                                                                     }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 ))
//                                                 ) : (
//                                                     <div className="text-center">None Available</div>
//                                                 )}
//                                                {showDialog &&  <AssetUpdate id={editAssetTypeId}  onClose={()=>{setShowDialog(false), fetchData(0)}}/>}
//                                                {showAssignAssetDialog &&  <DialogAssignAsset asset_id={selectedAssetID}  onClose={()=>{setShowAssignAssetDialog(false), fetchData(filterID)}}/>}

//                                             </div>
//                                         </div>
//                                     </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>


//             //  : <LoadingDialog isLoading={true} />
//              }/>
//         {/* </div> */}

//     <div>
//       <Footer />
//     </div>
//         </div>
//     )
// }

// export default Asset;

// async function getType(value: any) {

//     let query = supabase
//         .from('leap_asset_type')
//         .select()
//         .eq('client_id', value)
//         .eq('is_deleted', "FALSE");

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
//   }

/////design changes shared by swapnil on 11 th april 2025


// 'use client'
// import React from 'react'
// import LeapHeader from '@/app/components/header'
// import LeftPannel from '@/app/components/leftPannel' 
// import Footer from '@/app/components/footer'
// import LoadingDialog from '@/app/components/PageLoader'
// import  { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase'
// import { AssetList } from '@/app/models/AssetModel'
// import AssetUpdate from '@/app/components/dialog_updateAsset'
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
// import BackButton from '@/app/components/BackButton'
// import { pageURL_addAsset, pageURL_assetTypeList, pageURL_assignAsset } from '@/app/pro_utils/stringRoutes'
// import DialogAssignAsset from '@/app/components/dialog_assign_asset'

// interface AssetType {
//     assetType: string
// }

// const Asset = () => {
//     const { contextClientID } = useGlobalContext();

//     const [asset, setAsset] = useState<AssetList[]>([]);
//     const [typeArray, setType] = useState<AssetTypeList[]>([]);
//     const [filterID, setFilterID]=useState(0);
//     const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
//     const [toggleClass, setToggleClass] = useState("middle_box");
//     const [showDialog, setShowDialog] = useState(false);
//     const [isLoading, setLoading] = useState(true);
//     const [showAssignAssetDialog, setShowAssignAssetDialog] = useState(false);
//     const [selectedAssetID, setSelectedAssetID] = useState(-1);
//     const [editAssetTypeId, setEditAssetTypeId] = useState(0);

//     const [formValues, setFormValues] = useState<AssetType>({
//         assetType: "",
//     });
//     const [scrollPosition, setScrollPosition] = useState(0);

//     useEffect(() => {
//         fetchData(0);
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

//     const fetchData = async (filterID: any) => {
//         setLoading(true);
//         const type = await getType(contextClientID );
//         setType(type);

//         try{
//             const formData = new FormData();
//             formData.append("client_id", contextClientID );
//             formData.append("asset_type", filterID );

//             setFilterID(filterID);

//             const res = await fetch("/api/client/asset/getAsset", {
//             method: "POST",
//             body: formData,
//         });
//         const response = await res.json();
//         console.log(response);

//         const assetListData = response.assetList;

//         // if(assetListData! && assetListData.length > 0 ) {
//         //     setAsset(assetListData)
//         // } else {
//         //     alert("No such asset exist");
//         // }

//         if (response.status === 1) {
//             setAsset(response.assetList || []); 
//             setLoading(false);
//         } else {
//             setAsset([]);
//             setLoading(false);
//         }
//         } catch (error) {
//             setLoading(false);
//             alert("Error fetching Asset Data");
//             console.error("Error fetching user data:", error);
//         }
//     }


//     const handleMenuClick = (index:any) => {
//         setSelectedLeftMenuItemIndex(index); // Update the state correctly
//       };

//     return (
//         <div className='mainbox'>
//         <header>
//         <LeapHeader title="Welcome!" />
//         </header>
//             <LeftPannel menuIndex={2} subMenuIndex={0} showLeftPanel={true} rightBoxUI= { 
//                 // typeArray! && typeArray.length > 0 && asset! && asset.length > 0 ?

//                 <div>
//                     <LoadingDialog isLoading={isLoading} />
//                     <div className='container'>
//                     <div className="row heading25 mb-3 pb-3"> 
//                         <div className="col-lg-6">
//                             Asset <span>List</span>
//                         </div>
//                         <div className="col-lg-6" style={{textAlign: "right"}}>


//                                     <a href={pageURL_assetTypeList} className="red_button red_button2">Asset Type</a>&nbsp;
//                                     <a href={pageURL_addAsset} className="red_button red_button2">Add New Asset</a>&nbsp;
//                                     <a href={pageURL_assignAsset} className="red_button red_button2">Assign Asset</a>



//                         </div>
//                     </div>

//                     <div className="row mb-5">
//                         <div className="col-lg-2">
//                             <div className={selectedLeftMenuItemIndex==0?"list_view_box_selected":"list_view_box"} style={{ width: "100%", margin: "0", }}>
//                                 <a onClick={(e) => {fetchData(0), handleMenuClick(0) }}>
//                                     <div className={selectedLeftMenuItemIndex==0?"selected text-center":"list_view_heading text-center"}  >All</div>
//                                 </a>
//                             </div>
//                         </div>
//                         <div className="col-lg-10">
//                             <div className="horizontal_scrolling pb-2" >
//                             {typeArray.map((id) => (
//                                 <div className={selectedLeftMenuItemIndex==id.id?"announcement_branch_box_selected":"announcement_branch_box"} key={id.id} >

//                                     <a  onClick={(e) => {fetchData(id.id), handleMenuClick(id.id)}}>
//                                         <div className={"list_view_heading text-center"}> {id.asset_type} </div>
//                                     </a>
//                                 </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                         <div className="row">                       
//                             <div className="col-lg-12">
//                                     <div className="row mb-5">
//                                         <div className="col-lg-12">
//                                             <div className="grey_box" style={{ backgroundColor: "#fff" }} >
//                                                 <div className="row list_label mb-4">
//                                                     <div className="col-lg-2 text-center"><div className="label">Asset Name</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Type</div></div>
//                                                     <div className="col-lg-1 text-center"><div className="label">Code</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Status</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Allotted to</div></div>
//                                                     <div className="col-lg-2 text-center"><div className="label">Allotment date</div></div>   
//                                                 </div>
//                                                 {asset.length > 0 ? (
//                                                 asset.map((assetList) => (
//                                                     <div className="row list_listbox" key={assetList.asset_id}>
//                                                     <div className="col-lg-2 text-center">{assetList.asset_name}</div>
//                                                     <div className="col-lg-2 text-center">{assetList?.leap_asset_type?.asset_type}</div>
//                                                     <div className="col-lg-1 text-center">{assetList.device_code}</div>
//                                                     <div className="col-lg-2 text-center">{assetList?.leap_asset_status?.status}</div>

//                                                      {assetList?.leap_asset_status?.status === "Assigned" ? (
//                                                             <>
//                                                                 <div className="col-lg-2 text-center">{assetList?.leap_customer_asset[0]?.leap_customer?.name || "--"}</div>
//                                                                 <div className="col-lg-2 text-center">{assetList?.leap_customer_asset[0]?.date_given || "--"}</div>
//                                                             </>
//                                                             ) : (
//                                                             <>
//                                                                 <div className="col-lg-2 text-center font14_Medium blinking_text_red" onClick={(e)=>{setSelectedAssetID(assetList.asset_id);setShowAssignAssetDialog(true)}} >Allot</div>
//                                                                 <div className="col-lg-2 text-center">--</div>
//                                                             </>
//                                                             )}
//                                                     <div className="col-lg-1 text-center">
//                                                             <img src="/images/edit.png" className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
//                                                                 onClick={() => {
//                                                                     setEditAssetTypeId(assetList?.asset_id);
//                                                                      setShowDialog(true)
//                                                                     }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 ))
//                                                 ) : (
//                                                     <div className="text-center">None Available</div>
//                                                 )}
//                                                {showDialog &&  <AssetUpdate id={editAssetTypeId}  onClose={()=>{setShowDialog(false), fetchData(0)}}/>}
//                                                {showAssignAssetDialog &&  <DialogAssignAsset asset_id={selectedAssetID}  onClose={()=>{setShowAssignAssetDialog(false), fetchData(filterID)}}/>}

//                                             </div>
//                                         </div>
//                                     </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>


//             //  : <LoadingDialog isLoading={true} />
//              }/>
//         {/* </div> */}

//     <div>
//       <Footer />
//     </div>
//         </div>
//     )
// }

// export default Asset;

// async function getType(value: any) {

//     let query = supabase
//         .from('leap_asset_type')
//         .select()
//         .eq('client_id', value)
//         .eq('is_deleted', "FALSE");

//     const { data, error } = await query;
//     if (error) {
//         // console.log(error);
//         return [];
//     } else {
//         // console.log(data);
//         return data;
//     }
//   }


//////swapnil design code changes 16 april 2025


'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { AssetList } from '@/app/models/AssetModel'
import AssetUpdate from '@/app/components/dialog_updateAsset'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import BackButton from '@/app/components/BackButton'
import { pageURL_addAsset, pageURL_assetTypeList, pageURL_assignAsset } from '@/app/pro_utils/stringRoutes'
import DialogAssignAsset from '@/app/components/dialog_assign_asset'
import { ALERTMSG_addAssetSuccess, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'

interface AssetType {
    assetType: string
}

const Asset = () => {
    const { contextClientID } = useGlobalContext();

    const [asset, setAsset] = useState<AssetList[]>([]);
    const [typeArray, setType] = useState<AssetTypeList[]>([]);
    const [filterID, setFilterID] = useState(0);
    const [selectedLeftMenuItemIndex, setSelectedLeftMenuItemIndex] = useState(0);
    const [toggleClass, setToggleClass] = useState("middle_box");
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [showAssignAssetDialog, setShowAssignAssetDialog] = useState(false);
    const [selectedAssetID, setSelectedAssetID] = useState(-1);
    const [editAssetTypeId, setEditAssetTypeId] = useState(0);

    const [formValues, setFormValues] = useState<AssetType>({
        assetType: "",
    });
    const [scrollPosition, setScrollPosition] = useState(0);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        fetchData(0);
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

    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        // console.log("Form values updated:", formValues);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }

    const formData = new FormData();

    const fetchData = async (filterID: any) => {
        setLoading(true);
        const type = await getType(contextClientID);
        setType(type);

        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("asset_type", filterID);

            setFilterID(filterID);

            const res = await fetch("/api/client/asset/getAsset", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);


            // if(assetListData! && assetListData.length > 0 ) {
            //     setAsset(assetListData)
            // } else {
            //     alert("No such asset exist");
            // }

            if (response.status === 1) {
                setAsset(response.assetList || []);
                setLoading(false);
            

            } else {
                setAsset([]);

                setLoading(false);
                setShowAlert(true);

                setAlertTitle("Error")
                setAlertStartContent("Failed to recive assets or no data avaialable.");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            alert("Error fetching Asset Data");
            console.error("Error fetching user data:", error);

            setShowAlert(true);

            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_addAssetSuccess);
            setAlertForSuccess(2)
        }
    }


    const handleMenuClick = (index: any) => {
        setSelectedLeftMenuItemIndex(index); // Update the state correctly
    };

    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={2} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                // typeArray! && typeArray.length > 0 && asset! && asset.length > 0 ?

                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>

                        <div className='inner_heading_sticky'>
                            <div className="row heading25 mb-3 pb-3 pt-2">
                                <div className="col-lg-6">
                                    Asset <span>List</span>
                                </div>
                                <div className="col-lg-6" style={{ textAlign: "right" }}>


                                    <a href={pageURL_assetTypeList} className="red_button red_button2">Asset Type</a>&nbsp;
                                    <a href={pageURL_addAsset} className="red_button red_button2">Add New Asset</a>&nbsp;
                                    <a href={pageURL_assignAsset} className="red_button red_button2">Assign Asset</a>



                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-lg-12">
                                    <div className="filter_mainbox">
                                        <div onClick={(e) => { fetchData(0), handleMenuClick(0) }} className={selectedLeftMenuItemIndex == 0 ? "filter_menu filter_menu_selected mb-2" : "filter_menu filter_all mb-2"}>
                                            All
                                        </div>
                                        <div className="horizontal_scrolling pb-2" >
                                            {typeArray.map((id) => (
                                                <div onClick={(e) => { fetchData(id.id), handleMenuClick(id.id) }} className={selectedLeftMenuItemIndex == id.id ? "filter_menu filter_menu_selected" : "filter_menu"} key={id.id} >
                                                    {id.asset_type}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row mb-5">
                                    <div className="col-lg-12">
                                        <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                            <div className="row list_label mb-4">
                                                <div className="col-lg-2 text-center"><div className="label">Asset Name</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Type</div></div>
                                                <div className="col-lg-1 text-center"><div className="label">Code</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Allotted to</div></div>
                                                <div className="col-lg-2 text-center"><div className="label">Allotment date</div></div>
                                                <div className="col-lg-1 text-center"><div className="label">Action</div></div>
                                            </div>
                                            {asset.length > 0 ? (
                                                asset.map((assetList) => (
                                                    <div className="row list_listbox" style={{ alignItems: "center" }} key={assetList.asset_id}>
                                                        <div className="col-lg-2 text-center">{assetList.asset_name}</div>
                                                        <div className="col-lg-2 text-center">{assetList?.leap_asset_type?.asset_type}</div>
                                                        <div className="col-lg-1 text-center">{assetList.device_code}</div>
                                                        <div className="col-lg-2 text-center">{assetList?.leap_asset_status?.status}</div>

                                                        {assetList?.leap_asset_status?.status === "Assigned" ? (
                                                            <>
                                                                <div className="col-lg-2 text-center">{assetList?.leap_customer_asset[0]?.leap_customer?.name || "--"}</div>
                                                                <div className="col-lg-2 text-center">{assetList?.leap_customer_asset[0]?.date_given || "--"}</div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="col-lg-2 text-center font14_Medium" onClick={(e) => { setSelectedAssetID(assetList.asset_id); setShowAssignAssetDialog(true) }} >
                                                                    <div className='allot_text'>Allot</div>
                                                                </div>
                                                                <div className="col-lg-2 text-center">--</div>
                                                            </>
                                                        )}
                                                        <div className="col-lg-1 text-center">
                                                            <img src={staticIconsBaseURL + "/images/view_icon.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    setEditAssetTypeId(assetList?.asset_id);
                                                                    setShowDialog(true)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center">No Assets Available</div>
                                            )}
                                            <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                                                {showDialog && <AssetUpdate id={editAssetTypeId} onClose={() => { setShowDialog(false), fetchData(0) }} />}
                                            </div>

                                            <div className={showAssignAssetDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                                                {showAssignAssetDialog && <DialogAssignAsset asset_id={selectedAssetID} onClose={() => { setShowAssignAssetDialog(false), fetchData(filterID) }} />}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                //  : <LoadingDialog isLoading={true} />
            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default Asset;

async function getType(value: any) {

    let query = supabase
        .from('leap_asset_type')
        .select()
        .eq('client_id', value)
        .eq('is_deleted', "FALSE");

    const { data, error } = await query;
    if (error) {
        // console.log(error);
        return [];
    } else {
        // console.log(data);
        return data;
    }
}