'use client';
import React, { useEffect, useState } from 'react'
import LoginForm from './LoginForm';
import { useParams } from 'next/navigation';
import { useLogo } from '@/app/contextProviders/clientLogo';
import supabase from '@/app/api/supabaseConfig/supabase';
import { getImageApiURL, sessionCompanyName, sessionLogoURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';


const Login = () => {
 const { companyName } = useParams();
   const [clientBasicInfo, setclientBasicInfo] = useState<ClientBasicInfoModel | null>(null);
   const { setGlobalState } = useGlobalContext();
 
  useEffect(() => {
      
      const fetchActivities = async () => {
      const clientInfo = await getCompanyLogo(companyName)
      setGlobalState({
        contextUserName: '',
        contextClientID: '',
        contaxtBranchID:'',
        contextCustomerID: '',
        contextRoleID: '',
        contextProfileImage:'',
        contextEmployeeID: '',
        contextCompanyName: clientInfo.company_name,
        contextLogoURL: clientInfo.company_logo,
        contextSelectedCustId: '',
            contextAddFormEmpID: '',
            contextAnnouncementID:'',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: '',
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            isAdmin: '',
            contextPARAM8: '',
      })
      setclientBasicInfo(clientInfo);
      // (await cookies()).set('company_name', clientInfo.company_name, { path: '/' });

      }
      if(companyName!='default'){
      fetchActivities();
      }
    
      
      
    }, []);
  
  return (
    <div>
      <div className="login_leftbox">
      {clientBasicInfo && clientBasicInfo.company_logo ? (
        <div className="login_logo">
            <img
              src={getImageApiURL+"/uploads/" + clientBasicInfo.company_logo}
              className="img-fluid"
            />
            </div>
          ) : (
            <div className="login_logo"><img src={staticIconsBaseURL+"/images/logo.png"} className="img-fluid" /></div>

          )}        
      </div>
      <LoginForm />
    </div>
  )
}

export default Login


async function getCompanyLogo(companyName: string | string[] | undefined) {
  try {

    let qwery = supabase.from("leap_client_basic_info")
        .select(`*`).or(`company_name.eq.${companyName},company_short_name.eq.${companyName}`).limit(1);

    const { data: clientBasic, error } = await qwery;
    if (error) {
        return [];
    }

    
    return clientBasic?.[0] || null;

} catch (error) {
    console.log(error);
    return null;

}
}