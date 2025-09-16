'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
import useSession from '@/app/pro_utils/sessionmgmt';

import supabase from '@/app/api/supabaseConfig/supabase';
import { useLogo } from '@/app/contextProviders/clientLogo';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { createClient } from '../../../../utils/supabase/client';
import { pageURL_dashboard, pageURL_ForgotPassword, pageURL_userEmpDashboard } from '@/app/pro_utils/stringRoutes';
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { requestPushNotification } from '../../../../utils/pushNotification';
import ShowAlertMessage from '@/app/components/alert';
import LoadingDialog from '@/app/components/PageLoader';


export let dynamicCompanyName: any;

const LoginForm = () => {


  // const { session, login, logout } = useSession();
  const { contextLogoURL,isAdmin, contextCompanyName, contextClientID, setGlobalState } = useGlobalContext();


  const [formEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginResponseModel>();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [selectedAuthLogin, setAuthLogin] = useState("email");
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alertForSuccess, setAlertForSuccess] = useState(0);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertStartContent, setAlertStartContent] = useState('');
  const [alertMidContent, setAlertMidContent] = useState('');
  const [alertEndContent, setAlertEndContent] = useState('');
  const [alertValue1, setAlertValue1] = useState('');
  const [alertvalue2, setAlertValue2] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  const supabase = createClient();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {


    e.preventDefault(); // Prevent default form submission
    setError("");
    setLoading(true);

    try {
      let emailVar, passwordVar = "";
      if (selectedAuthLogin == 'email') {
        emailVar = formEmail;
        passwordVar = password;

      } else if (selectedAuthLogin == "empID") {
        // email based on loginType
        const { data: userData, error: userError } = await supabase
          .from("leap_customer")
          .select("email_id")
          .eq('emp_id', formEmail)
          .limit(1);
        console.log("login api called ---------------------------------2");


        if (userError || !userData) {
          setLoading(false);
          setShowAlert(true);
          setAlertTitle("Error")
          setAlertStartContent(userError?.message || "Invalid input or user not found.");
          setAlertForSuccess(2)

          return;
        }
        emailVar = userData[0].email_id;
        passwordVar = password;

      }
      console.log("login api called ---------------------------------3");
      const email = emailVar;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setLoading(false);

        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent(error.message);
        setAlertForSuccess(2)
        return;
      }
      // await supabase.auth.setSession(data.session);

      // console.log("this is the session in the api------------------    ",await supabase.auth.getSession());
      // return Response.json({"data":data});
      const authID = data.user.id;

      const { data: userData, error: userError } = await supabase
        .from("leap_customer")
        .select("*,leap_client(*)")
        .eq("authUuid", authID).eq("employment_status", true);

      if (userError) {
        setLoading(false);
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent(userError.message);
        setAlertForSuccess(2)
        return;
      }
      if (!userData || userData.length === 0) {
        setLoading(false);
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent("No user found or user is not active.Please contact admin.");
        setAlertForSuccess(2)
        return;
      }
      const webFcmToken = await requestPushNotification();
      console.log("this is the web fcm token in the login page", webFcmToken);
      
      const { error: fcmUpdateError } = await supabase
        .from("leap_customer_fcm_tokens")
        .upsert({ customer_id: userData[0].customer_id, web_fcm_tokens: webFcmToken }, { onConflict: "customer_id" });
      if (error) {
        console.error("Supabase error:", error);

      }

      setLoginData(userData[0])
      setGlobalState({
        contextUserName: userData[0].name,
        contextClientID: userData[0].client_id,
        contaxtBranchID: userData[0].branch_id,
        contextCustomerID: userData[0].customer_id,
        contextRoleID: userData[0].user_role,
        contextProfileImage: userData[0].profile_pic,
        contextEmployeeID: userData[0].emp_id,
        contextCompanyName: contextCompanyName,
        contextLogoURL: contextLogoURL,
        contextSelectedCustId: '',
        contextAddFormEmpID: '',
        contextAnnouncementID: '',
        contextAddFormCustID: '',
        dashboard_notify_cust_id: '',
        dashboard_notify_activity_related_id: '',
        selectedClientCustomerID: '',
        isAdmin: userData[0].user_role == 2 ? "1" : "0",
        contextPARAM8: '',
      });

      { userData[0].user_role != 2 ? router.push(pageURL_userEmpDashboard) : router.push(pageURL_dashboard) }

    } catch (e) {
      setLoading(false);
      setShowAlert(true);
      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2)

    }

  };


  useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (event === "SIGNED_IN") {
        const userEmail = session.user?.email || null;

        console.log("this is the login page useeffect onAuthStateChange----------   ", supabase.auth.getSession());

        if (loginData) {
          goToDashboard();
        }
      }
    });



    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [router, loginData]);

  const handleAuthLogin = (event: any) => {
    setAuthLogin(event.target.value);
  };

  const goToDashboard = async () => {
    setGlobalState({
      contextUserName: loginData!.name,
      contextClientID: loginData!.client_id + "",
      contaxtBranchID: loginData!.branch_id + "",
      contextCustomerID: loginData!.customer_id + "",
      contextRoleID: loginData!.user_role + "",
      contextProfileImage: loginData!.profile_pic,
      contextEmployeeID: loginData!.emp_id,
      contextCompanyName: contextCompanyName,
      contextLogoURL: contextLogoURL,
      contextSelectedCustId: '',
      contextAddFormEmpID: '',
      contextAnnouncementID: '',
      contextAddFormCustID: '',
      dashboard_notify_cust_id: '',
      dashboard_notify_activity_related_id: '',
      selectedClientCustomerID: '',
      isAdmin: loginData!.user_role==2 ? "1" : "0",
      contextPARAM8: '',
    })
    { loginData!.user_role != 2 ? router.push(pageURL_userEmpDashboard) : router.push(pageURL_dashboard) }

  }
  // google sign up btn
  async function handleGoogleSignup() {
    try {
      // Step 1: Google sign-in with OAuth
      const { data: supabaseAuth, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error; // Handle error during Google sign-in

      // Step 2: Get authUUID from session
      const { data: sessionData } = await supabase.auth.getSession();
      const authUUID = sessionData?.session?.user.id;

      if (!authUUID) {
        console.error("authUUID not found in session");
        setLoading(false);
      setShowAlert(true);
      setAlertTitle("Error")
      setAlertStartContent("Something went wrong with authuuid");
      setAlertForSuccess(2)
        return;
      }

      console.log("Logged in user's UUID:", authUUID);

      // Step 3: Fetch user details using the authUUID
      const { data: userData, error: userError } = await supabase
        .from("leap_customer")
        .select("*,leap_client(*)")
        .eq("authUuid", authUUID).eq("employment_status", true);

      if (userError) {
        console.error("Error fetching user details:", userError.message);
        setLoading(false);
      setShowAlert(true);
      setAlertTitle("Error")
      setAlertStartContent(userError.message);
      setAlertForSuccess(2)
        return;
      }

      // Step 4: Log the user's email
      if (userData?.length > 0) {
        setLoginData(userData[0]);
        setGlobalState({
          contextUserName: userData[0].name,
          contextClientID: userData[0].client_id,
          contaxtBranchID: userData[0].branch_id,
          contextCustomerID: userData[0].customer_id,
          contextRoleID: userData[0].user_role,
          contextProfileImage: userData[0].profile_pic,
          contextEmployeeID: userData[0].emp_id,
          contextCompanyName: contextCompanyName,
          contextLogoURL: contextLogoURL,
          contextSelectedCustId: '',
          contextAddFormEmpID: '',
          contextAnnouncementID: '',
          contextAddFormCustID: '',
          dashboard_notify_cust_id: '',
          dashboard_notify_activity_related_id: '',
          selectedClientCustomerID: '',
          isAdmin: userData[0].user_role==2 ? "1" : "0",
          contextPARAM8: '',
        });
        { userData[0].user_role != 2 ? router.push(pageURL_userEmpDashboard) : router.push(pageURL_dashboard) }
      }
      else {
        alert("No User Found");
        setLoading(false);
      setShowAlert(true);
      setAlertTitle("Error")
      setAlertStartContent("No user found or user is not active.Please contact admin.");
      setAlertForSuccess(2)
        console.log("No user found with the provided authUUID.");
      }
    } catch (error) {
      setLoading(false);
      setShowAlert(true);
      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2)
      console.error("Unexpected error during Google Signup:", error);
    }
  }

  // linkedin auth login

  async function signInWithLinkedIn() {
    try {
      const { data: supabaseAuth, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
      })
      if (error) throw error; // Handle error during Google sign-in

      // Step 2: Get authUUID from session
      const { data: sessionData } = await supabase.auth.getSession();
      const authUUID = sessionData?.session?.user.id;

      if (!authUUID) {
        console.error("authUUID not found in session");
        setLoading(false);
      setShowAlert(true);
      setAlertTitle("Error")
      setAlertStartContent("Something went wrong with authuuid");
      setAlertForSuccess(2)
        return;
      }

      console.log("Logged in user's UUID:", authUUID);

      // Step 3: Fetch user details using the authUUID
      const { data: userData, error: userError } = await supabase
        .from("leap_customer")
        .select("*,leap_client(*)")
        .eq("authUuid", authUUID).eq("employment_status", true);

      if (userError) {
        setLoading(false);
      setShowAlert(true);
      setAlertTitle("Error")
      setAlertStartContent(userError.message);
      setAlertForSuccess(2)
        console.error("Error fetching user details:", userError.message);
        return;
      }

      // Step 4: Log the user's email
      if (userData?.length > 0) {
        setLoginData(userData[0]);
        setGlobalState({
          contextUserName: userData[0].name,
          contextClientID: userData[0].client_id,
          contaxtBranchID: userData[0].branch_id,
          contextCustomerID: userData[0].customer_id,
          contextRoleID: userData[0].user_role,
          contextProfileImage: userData[0].profile_pic,
          contextEmployeeID: userData[0].emp_id,
          contextCompanyName: contextCompanyName,
          contextLogoURL: contextLogoURL,
          contextSelectedCustId: '',
          contextAddFormEmpID: '',
          contextAnnouncementID: '',
          contextAddFormCustID: '',
          dashboard_notify_cust_id: '',
          dashboard_notify_activity_related_id: '',
          selectedClientCustomerID: '',
          isAdmin: userData[0].user_role==2 ? "1" : "0",
          contextPARAM8: '',
        });
        { userData[0].user_role != 2 ? router.push(pageURL_userEmpDashboard) : router.push(pageURL_dashboard) }

      } else {
        setLoading(false);
      setShowAlert(true);
      setAlertTitle("Error")
      setAlertStartContent("No user found");
      setAlertForSuccess(2)
        alert("No User Found or user is not active.Please contact admin.");
        console.log("No user found with the provided authUUID.");
      }
    } catch (error) {
      setLoading(false);
      setShowAlert(true);
      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2)
      console.error("Unexpected error during LinkedIn Signup", error);
    }
  }



  return (
    <div className="login_rightbox">
      <div className="container">
        <LoadingDialog isLoading={loading}/>
      {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                            

                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* <div className="col-lg-12 hello_heading">{companyName}</div> */}
            <div className="col-lg-12 hello_heading">Hello</div>
          </div>
          <div className="row">
            <div className="col-lg-12 welcome_heading mb-2">Welcome! </div>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-4 loginwith_box">
              <input type="radio" name="emp" id="mobile" value="email" checked={selectedAuthLogin === "email"} onChange={handleAuthLogin} />
              <label htmlFor="mobile" style={{ borderRadius: "50px 50px 50px 50px" }}>Email ID</label>
              <input type="radio" name="emp" id="employee" value="empID" checked={selectedAuthLogin === "empID"} onChange={handleAuthLogin} />
              <label htmlFor="employee" style={{ borderRadius: "50px 50px 50px 50px", marginLeft: "10px" }}>Login with Employee ID</label>

            </div>

          </div>
          <div className="row">
            <div className="col-lg-12 login_heading mb-4">Login to your <span style={{ color: "#ed2024" }}>Account</span></div>
          </div>

          <div className="row">
            <div className="col-lg-6 mb-2">
              <input type="text" className="login_input" placeholder={selectedAuthLogin === "email" ? "Email" : "Employee ID"} value={formEmail} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* <div className="row">
            <div className="col-lg-6 mb-2">
              <input type="text" className="login_input" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state
                required />
            </div>
          </div> */}
          <div className="row ">
            <div className="col-lg-6 mb-2">
              <div className="Form-fields" >

                <label htmlFor="password1" className="Control-label Control-label--password">

                </label>

                <input
                  type="checkbox"
                  id="show-password1"
                  className="show-password"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                <label htmlFor="show-password1" className="Control-label Control-label--showPassword">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="32"
                    height="32"
                    className="svg-toggle-password"
                    aria-labelledby="toggle-password1-title"
                  >
                    <title id="toggle-password1-title">Hide/Show Password</title>
                    <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
                    <rect
                      x="20.133"
                      y="2.117"
                      height="44"
                      transform="translate(23.536 -8.587) rotate(45)"
                      className="closed-eye"
                    />
                    <rect
                      x="22"
                      y="3.984"
                      width="4"
                      height="44"
                      transform="translate(25.403 -9.36) rotate(45)"
                      style={{ fill: '#fff' }}
                      className="closed-eye"
                    />
                  </svg>
                </label>
                {/* Input for Password */}
                <input
                  type="text"
                  id="password1"
                  placeholder="Password"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"

                  pattern=".{6,}"
                  className="login_input ControlInput--password"
                  value={password} name="confirmPassword" onChange={(e) => setPassword(e.target.value)}
                />

              </div>


            </div>


          </div>
          <div className="row">
            <div className="col-lg-6 mb-3" style={{ textAlign: "right",cursor:"pointer" }} onClick={()=>router.push(pageURL_ForgotPassword)}>
              Forgot Password?
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-4">
              <input type="submit" className={`red_btn ${loading ? "loading" : ""}`} value="Login" style={{ float: "right" }} />
            </div>
          </div>

        </form>

        <div className="row">
          <div className="col-lg-6 text-center">
            <div className="register_continue_text"><span>Or Continue with</span></div>
          </div>
        </div>
        <div className="row">
          <div className="row">
            <div className="col-lg-6 mb-4 text-center social_icon_box">
              <a href="#"><img src={staticIconsBaseURL + "/images/google_icon.png"} className="img-fluid" onClick={handleGoogleSignup}></img></a>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="#"><img src={staticIconsBaseURL + "/images/linkedin.png"} className="img-fluid" onClick={signInWithLinkedIn} /></a>&nbsp;&nbsp;&nbsp;&nbsp;
              {/* <a href="#"><img src="images/microsoft_icon.png" className="img-fluid"/></a> */}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginForm


