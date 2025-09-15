import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../api/supabaseConfig/supabase';
import { log } from 'console';


const LogoContext = createContext('light');

const ClientLogo = ({ companyName }:{companyName:any}) => {
    const [logoUrl, setLogoUrl] = useState<ClientBasicInfoModel>();

    // Fetch the logo URL from Supabase
    useEffect(() => {
      const fetchLogo = async () => {
        let qwery = supabase.from("leap_client_basic_info")
        .select(`*`).or(`company_name.eq.${companyName},company_short_name.eq.${companyName}`).limit(1);
        

    

    const { data: clientBasic, error } = await qwery;
    if (error) {
        return [];
    }
    
    console.log(clientBasic);
    const activities: ClientBasicInfoModel = clientBasic[0];
    setLogoUrl(activities)
      };
  
      fetchLogo();
    }, []);
  
    return (
        <LogoContext.Provider value={logoUrl?.company_logo!}>
        {companyName}
      </LogoContext.Provider>
    );
}

export const useLogo = () => {
    return useContext(LogoContext);
  };