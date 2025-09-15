// 'use client'
// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { deleteDataTypeAsset, deleteDataTypeDepartment, deleteDataTypeProject, deleteDataTypeSalaryComponent, deleteDataTypeSubProject, staticIconsBaseURL } from '../pro_utils/stringConstants';

// const DeleteConfirmation = ({ onClose, id,deletionType,deleteDetail }: { onClose: () => void, id: any,deletionType:string,deleteDetail:string }) => {     

//     const [ showResponseMessage,setResponseMessage ] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log("handle submit called");
//         const formData = new FormData();

//         formData.append("id", id); 

//         try {
//             let response
//             if(deletionType==deleteDataTypeAsset){
//            response = await fetch("/api/client/asset/deleteAssetType", {
//               method: "DELETE",
//               body: formData,
//           });
//         }else if(deletionType==deleteDataTypeSalaryComponent){
//             response = await fetch("/api/clientAdmin/payroll/delete_payroll_component", {
//                 method: "DELETE",
//                 body: formData,
//             });
//         }else if(deletionType==deleteDataTypeSubProject ||deletionType==deleteDataTypeProject){
//             formData.append("is_sub_project", deletionType==deleteDataTypeSubProject?"True":"False"); 
//             response = await fetch("/api/clientAdmin/project/delete_project_sub_project", {
//                 method: "DELETE",
//                 body: formData,
//             });
//         }else{
//             formData.append("is_Department", deletionType==deleteDataTypeDepartment?"True":"False"); 
//             response = await fetch("/api/clientAdmin/delete/delete_designation_department", {
//                 method: "DELETE",
//                 body: formData,
//             });
//         }
//           if (response.ok) {
//               onClose();
//           } else {
//               alert("Failed to delete data");
//           }
//       } catch (error) {
//           console.log("Error submitting form:", error);
//           alert("An error occurred while submitting the form.");
//       }
//     }

//     return (
//         <div className="loader-overlay">
//             <div className="loader-dialog">
//                 <div className="row">
//                 <div className="col-lg-12" style={{textAlign: "right"}}>
//                     <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                      onClick={onClose}/>
//                 </div>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div style={{minWidth:"300px"}}>
//                         <div className="row mt-3" style={{alignItems: "center", alignSelf:"center"}}>
//                             <div className="col-md-8">
//                             <label htmlFor="exampleFormControlInput1" className="form-label" >Are you sure you want to delete {deletionType} : {deleteDetail}  </label>
//                             </div>
//                             <div className="col-lg-4" style={{ textAlign: "right" }}>
//                                 <input type='submit' value="Delete" className="red_button"  />
//                             </div>
//                         </div>
                        
//                     </div>
//                 </form>
//                 {showResponseMessage &&  <div className="row md-5"><label>Data Deleted Successfully</label></div>}
//             </div>
//         </div>
//     )
// }

// export default DeleteConfirmation



'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { ALERTMSG_exceptionString, deleteDataTypeAnnouncement, deleteDataTypeAsset, deleteDataTypeDepartment, deleteDataTypeHolidayYear, deleteDataTypeProject, deleteDataTypeSalaryComponent, deleteDataTypeSubProject, staticIconsBaseURL } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';
import LoadingDialog from './PageLoader';

const DeleteConfirmation = ({ onClose, id,deletionType,deleteDetail }: { onClose: () => void, id: any,deletionType:string,deleteDetail:string }) => {     

    const [ showResponseMessage,setResponseMessage ] = useState(false);
    
    const [isLoading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
        const [alertForSuccess, setAlertForSuccess] = useState(0);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertStartContent, setAlertStartContent] = useState('');
        const [alertMidContent, setAlertMidContent] = useState('');
        const [alertEndContent, setAlertEndContent] = useState('');
        const [alertValue1, setAlertValue1] = useState('');
        const [alertvalue2, setAlertValue2] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        console.log("handle submit called");
        const formData = new FormData();

        formData.append("id", id); 

        try {
            let response
            if(deletionType==deleteDataTypeAsset){
           response = await fetch("/api/client/asset/deleteAssetType", {
              method: "DELETE",
              body: formData,
          });
          setAlertStartContent("Asset type deleted successfully");

        }else if(deletionType==deleteDataTypeSalaryComponent){
            response = await fetch("/api/clientAdmin/payroll/delete_payroll_component", {
                method: "DELETE",
                body: formData,
            });
            setAlertStartContent("Payroll component deleted successfully");

        }
        else if(deletionType==deleteDataTypeAnnouncement ||deletionType==deleteDataTypeAnnouncement){
            alert("delete api announvcement")
            formData.append("announcement_id", id); 
            response = await fetch("/api/clientAdmin/delete_announcement", {
                method: "DELETE",
                body: formData,
            });
        setAlertStartContent("Announcement deleted successfully");

        }
        else if(deletionType==deleteDataTypeHolidayYear ){
            formData.append("isDelete", "True"); 
            response = await fetch("/api/commonapi/delete-holiday-year", {
                method: "DELETE",
                body: formData,
            });
            setAlertStartContent("Holiday year deleted successfully");

        }
        else if(deletionType==deleteDataTypeSubProject ||deletionType==deleteDataTypeProject){
            formData.append("is_sub_project", deletionType==deleteDataTypeSubProject?"True":"False"); 
            response = await fetch("/api/clientAdmin/project/delete_project_sub_project", {
                method: "DELETE",
                body: formData,
            });
                        setAlertStartContent("Sub project deleted successfully");

        }else{
            formData.append("is_Department", deletionType==deleteDataTypeDepartment?"True":"False"); 
            response = await fetch("/api/clientAdmin/delete/delete_designation_department", {
                method: "DELETE",
                body: formData,
            });
            setAlertStartContent("Designation deleted successfully");
        }
        const resJson=await response.json();
          if (response.ok && resJson.status==1) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Success")
                
                setAlertForSuccess(1)
              
          } else {
            setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(resJson.message);
                setAlertForSuccess(2)
          }
      } catch (error) {
          console.log("Error submitting form:", error);
          setLoading(false);
          setShowAlert(true);
          setAlertTitle("Exception")
          setAlertStartContent(ALERTMSG_exceptionString);
          setAlertForSuccess(2)
      }
    }

    return (
        <div className="loader-overlay">
            <div className="loader-dialog">
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                        onClose()
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                <div className="row">
                <div className="col-lg-12" style={{textAlign: "right"}}>
                        <img src={staticIconsBaseURL + "/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right", position: "absolute", margin:"-10px 0 0 -4px", cursor:"pointer" }}
                     onClick={()=>onClose()}/>
                </div>
                </div>
                {/* <form onSubmit={handleSubmit}> */}
                    <div style={{minWidth:"300px"}}>
                        <div className="row mt-3 text-center">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Are you sure you want to delete {deletionType} : {deleteDetail}  </label>
                            </div>
                            <div className="col-lg-12">
                                <input type='submit' value="Delete" className="red_button"  onClick={handleSubmit} />
                            </div>
                        </div>
                        
                    </div>
                {/* </form> */}
                {showResponseMessage &&  <div className="row md-5"><label>Data Deleted Successfully</label></div>}
            </div>
        </div>
    )
}

export default DeleteConfirmation