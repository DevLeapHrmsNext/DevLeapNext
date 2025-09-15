'use client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { useLogo } from '@/app/contextProviders/clientLogo';
import { ALERTMSG_exceptionString, getImageApiURL, sessionCompanyName, sessionLogoURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import LoadingDialog from '@/app/components/PageLoader';
import ShowAlertMessage from '@/app/components/alert';
import { createClient } from '../../../../utils/supabase/client';
import supabase from '@/app/api/supabaseConfig/supabase';


const ForgotPassword = () => {

  const { contextLogoURL } = useGlobalContext();
  const [formEmail, setEmail] = useState("");
  const [errors, setErrors] = useState('');

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertForSuccess, setAlertForSuccess] = useState(0);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertStartContent, setAlertStartContent] = useState('');
  const [alertMidContent, setAlertMidContent] = useState('');
  const [alertEndContent, setAlertEndContent] = useState('');
  const [alertValue1, setAlertValue1] = useState('');
  const [alertvalue2, setAlertValue2] = useState('');


  const validate = () => {
    let newErrors: string = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail || !emailRegex.test(formEmail)) {
      newErrors = "Valid email is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      console.log("Handle submit is called");
      // below is the url generated when rest pasword is done and email is sent below is the link

      // http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IlRWNFYyZU0rYUVmcXdGbDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2JiaWFtb3R2bXhrb25kd25xZ2tvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwYWZlZmNkNy05MWVhLTQ5NTUtOTZlYy1kYjBiYTI1YTlmZTgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3ODExNTAwLCJpYXQiOjE3NDc4MDc5MDAsImVtYWlsIjoibmlraGlsLnRla2F3YWRlQGV2b25peC5jbyIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJuaWtoaWwudGVrYXdhZGVAZXZvbml4LmNvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiMGFmZWZjZDctOTFlYS00OTU1LTk2ZWMtZGIwYmEyNWE5ZmU4In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQ3ODA3OTAwfV0sInNlc3Npb25faWQiOiJhZmVmODAwZS1mY2EzLTQzNTItYjg5YS05YWJmYTZjNzcwMmEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.GD4211DHKdWAMQlTCBMzJ0Yizr8-NEPXGqBaY6I-91k&expires_at=1747811500&expires_in=3600&refresh_token=pstvibnk6tme&token_type=bearer&type=recovery
      //http://localhost:3000//reset-pass/verify-token?token_hash=aad0fa8abeae208a31734cf47d36ec8ffe39b896ad3d8b6e2411b985&type=recovery&next=/reset-password
      
      const { error } = await supabase.auth.resetPasswordForEmail(formEmail)
      

      if (error) {
        setLoading(false);
        setShowAlert(true);
        setAlertTitle("Error")
        setAlertStartContent(error?.message || "Invalid input or user not found.");
        setAlertForSuccess(2)
      } else {
        setLoading(false);
        setShowAlert(true);
        setAlertTitle("Success")
        setAlertStartContent("A password reset link has been sent to your email.");
        setAlertForSuccess(1)
      }
    } catch (e) {
      setLoading(false);
      setShowAlert(true);
      setAlertTitle("Exception")
      setAlertStartContent(ALERTMSG_exceptionString);
      setAlertForSuccess(2)
    }
  }

  return (
    <div>
      <LoadingDialog isLoading={loading} />
      {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
        setShowAlert(false)
      }} onCloseClicked={function (): void {
        setShowAlert(false)
      }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
      <div className="login_leftbox">
        {contextLogoURL && contextLogoURL.length > 0 ? (
          <div className="login_logo">
            <img
              src={getImageApiURL+"/uploads/" + contextLogoURL}
              className="img-fluid"
            />
          </div>
        ) : (
          <div className="login_logo"><img src={staticIconsBaseURL + "/images/logo.png"} className="img-fluid" /></div>

        )}
      </div>

      <div className="login_rightbox">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row mb-5 mt-5 pt-5">
              {/* <div className="col-lg-12 hello_heading">{companyName}</div> */}
              <div className="col-lg-12 hello_heading">Reset Your Password</div>
            </div>

            <div className="row">
              <div className="col-lg-12 login_heading mb-4">Enter your <span style={{ color: "#ed2024" }}>email</span> to get link.</div>
            </div>

            <div className="row">
              <div className="col-lg-8 mb-4">
                <input type="text" className="login_input" placeholder={"Email"} value={formEmail} onChange={(e) => setEmail(e.target.value)} />
                {errors && <span className="error" style={{ color: "red" }}>{errors}</span>}

              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 mb-4">
                <input type="submit" className="red_btn" value="Send Link" style={{ float: "right" }} />
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default ForgotPassword

