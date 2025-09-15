'use client';
// export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLogo } from '@/app/contextProviders/clientLogo';
import { getImageApiURL, sessionCompanyName, sessionLogoURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import LoadingDialog from '@/app/components/PageLoader';
import ShowAlertMessage from '@/app/components/alert';
import { pageURL_defaultLogin } from '../pro_utils/stringRoutes';
import { createClient } from '../../../utils/supabase/client';

// interface FormPasswords{
//   password:any
//   confirmPassword:any,
// }
// interface CompanyData{
//   company_name:any
//   company_logo:any,
// }
// const supabase = createClient();

// const ResetPassword = () => {
//   const { companyName } = useParams();
//   const [clientBasicInfo, setclientBasicInfo] = useState<ClientBasicInfoModel | null>(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [clientName, setClientName] = useState<CompanyData>({
//     company_name:'',
//     company_logo:'',
//   });

//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertForSuccess, setAlertForSuccess] = useState(0);
//   const [alertTitle, setAlertTitle] = useState('');
//   const [alertStartContent, setAlertStartContent] = useState('');
//   const [alertMidContent, setAlertMidContent] = useState('');
//   const [alertEndContent, setAlertEndContent] = useState('');
//   const [alertValue1, setAlertValue1] = useState('');
//   const [alertvalue2, setAlertValue2] = useState('');
//   const [isChecked, setIsChecked] = useState(true);
//   const [confirmPassChecked, setConfirmPassChecked] = useState(true);
//     const [errors, setErrors] = useState<Partial<FormPasswords>>({});
//   const searchParams = useSearchParams();
//   const router = useRouter();

//     useEffect(() => {
//       async function init() {
//         const { data } = await supabase.auth.getUser();
//         console.log(data);
        
//         if (!data.user) {
//           const code = searchParams.get("code");
//           if (!code) {
//             setLoading(false);
//             setShowAlert(true);
//             setAlertTitle("Error")
//             setAlertStartContent("Token is invalid or expired.");
//             setAlertForSuccess(2)
//             return;
//           }
//           console.log(code);
          
//           const { data: newSession, error: newSessionError } =
//             await supabase.auth.exchangeCodeForSession(code);
  
//           if (newSessionError) {
//             setLoading(false);
//             setShowAlert(true);
//             setAlertTitle("Error")
//             setAlertStartContent("Failed to validate reset token.");
//             setAlertForSuccess(2)
//           }
//         }else{
//           console.log("this is the user id in main else condition",data.user.id);
          
//           const {data:customer,error:custError}=await supabase.from("leap_customer")
//                       .select('client_id').eq("authUuid",data.user.id);
//           if(custError){
//             setLoading(false);
//             setShowAlert(true);
//             setAlertTitle("Error")
//             setAlertStartContent("Failed to user details");
//             setAlertForSuccess(2)
//           } else{
//             console.log("this is the client id inner when customeris success else condition",customer[0].client_id);

//             const{data:clientInfo,error:clientInfoError}=await supabase.from("leap_client_basic_info")
//             .select(`company_name,company_logo`).eq("client_id",customer[0].client_id).limit(1);
//             if(clientInfoError){
//               setLoading(false);
//             setShowAlert(true);
//             setAlertTitle("Error")
//             setAlertStartContent("Failed to user details");
//             setAlertForSuccess(2)
//             }else{
//               console.log("this is the client info data",clientInfo);
              
//               setLoading(false);
//               setClientName(clientInfo[0])
//             }
//           }           
//         }
//       }
  
//       init();
//     }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//     const { error } = await supabase.auth.updateUser({
//       password: password,
//     });
//     if (error) {
//       setLoading(false);
//       setShowAlert(true);
//       setAlertTitle("Error")
//       setAlertStartContent(error.message);
//       setAlertForSuccess(2)
      
//     } else {
//             setLoading(false);
//             setShowAlert(true);
//             setAlertTitle("Success")
//             setAlertStartContent("Your password has been updated successfully.");
//             setAlertForSuccess(1)
//     }
//   }

//   return (
//     <div>
//       <LoadingDialog isLoading={loading} />
//       {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
//         if(alertForSuccess==1){
//             router.push(pageURL_defaultLogin);
//         }
//         setShowAlert(false)
//       }} onCloseClicked={function (): void {
//         setShowAlert(false)
//       }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
//       <div className="login_leftbox">
//         {clientName.company_logo && clientName.company_logo.length > 0 ? (
//           <div className="login_logo">
//             <img
//               src={getImageApiURL + clientName.company_logo}
//               className="img-fluid"
//             />
//           </div>
//         ) : (
//           <div className="login_logo"><img src={staticIconsBaseURL + "/images/logo.png"} className="img-fluid" /></div>
//         )}
//       </div>

//       <div className="login_rightbox">
//         <div className="container">
//           <form onSubmit={handleSubmit}>
//             <div className="row mt-5 pt-5">
//               {/* <div className="col-lg-12 hello_heading">{companyName}</div> */}
//               <div className="col-lg-12 hello_heading">New password</div>
//             </div>

//             {/* <div className="row">
//             <div className="col-lg-12 login_heading mb-4">Enter your <span style={{ color: "#ed2024" }}>email</span> to get link.</div>
//           </div> */}

//             <div className="row ">
//               <div className="col-lg-6 mb-4">
//                 <div className="Form-fields" >

//                   <label htmlFor="password1" className="Control-label Control-label--password">

//                   </label>

//                   <input
//                     type="checkbox"
//                     id="show-password1"
//                     className="show-password"
//                     checked={isChecked}
//                     onChange={() => setIsChecked(!isChecked)}
//                   />
//                   <label htmlFor="show-password1" className="Control-label Control-label--showPassword">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 48 48"
//                       width="32"
//                       height="32"
//                       className="svg-toggle-password"
//                       aria-labelledby="toggle-password1-title"
//                     >
//                       <title id="toggle-password1-title">Hide/Show Password</title>
//                       <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
//                       <rect
//                         x="20.133"
//                         y="2.117"
//                         height="44"
//                         transform="translate(23.536 -8.587) rotate(45)"
//                         className="closed-eye"
//                       />
//                       <rect
//                         x="22"
//                         y="3.984"
//                         width="4"
//                         height="44"
//                         transform="translate(25.403 -9.36) rotate(45)"
//                         style={{ fill: '#fff' }}
//                         className="closed-eye"
//                       />
//                     </svg>
//                   </label>
//                   {/* Input for Password */}
//                   <input
//                     type="text"
//                     id="password1"
//                     placeholder="Password"
//                     autoComplete="off"
//                     autoCapitalize="off"
//                     autoCorrect="off"

//                     pattern=".{6,}"
//                     className="login_input ControlInput--password"
//                     value={password} name="password" onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 {errors.password && <span className="error" style={{ color: "red" }}>{errors.password}</span>}

//               </div>
//             </div>
//             <div className="row ">
//               <div className="col-lg-6 mb-4">
//                 <div className="Form-fields" >
//                 <label htmlFor="show-password2" className="Control-label Control-label--password">

//                 </label>
//                   <input
//                     type="checkbox"
//                     id="show-password2"
//                     className="show-password"
//                     checked={confirmPassChecked}
//                     onChange={() => setConfirmPassChecked(!confirmPassChecked)}
//                   />
//                   <label htmlFor="show-password2" className="Control-label Control-label--showPassword">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 48 48"
//                       width="32"
//                       height="32"
//                       className="svg-toggle-password"
//                       aria-labelledby="toggle-password1-title"
//                     >
//                       <title id="toggle-password1-title">Hide/Show Password</title>
//                       <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
//                       <rect
//                         x="20.133"
//                         y="2.117"
//                         height="44"
//                         transform="translate(23.536 -8.587) rotate(45)"
//                         className="closed-eye"
//                       />
//                       <rect
//                         x="22"
//                         y="3.984"
//                         width="4"
//                         height="44"
//                         transform="translate(25.403 -9.36) rotate(45)"
//                         style={{ fill: '#fff' }}
//                         className="closed-eye"
//                       />
//                     </svg>
//                   </label>
//                   {/* Input for Password */}
//                   <input
//                     type="text"
//                     id="show-password2"
//                     placeholder="Confirm password"
//                     autoComplete="off"
//                     autoCapitalize="off"
//                     autoCorrect="off"

//                     pattern=".{6,}"
//                     className="login_input ControlInput--password"
//                     value={confirmPassword} name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                 </div>
//                 {errors.password && <span className="error" style={{ color: "red" }}>{errors.password}</span>}

//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-6 mb-4">
//                 <input type="submit" className={`red_btn ${loading ? "loading" : ""}`} value="Update" style={{ float: "right" }} />
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }
const ResetPassword = () => {
  return <></>
}
export default ResetPassword

