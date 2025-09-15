'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';


// Define the shape of the context
const LoggedInGlobalContext = createContext({
 contextUserName: '', contextClientID: '',contaxtBranchID:'', contextCustomerID: ''
        , contextRoleID: '',contextProfileImage:'', contextEmployeeID: '', 
        contextCompanyName: '', contextLogoURL: '',contextSelectedCustId: '',
        contextAddFormEmpID: '',
        contextAnnouncementID: '',
        contextAddFormCustID: '',
        dashboard_notify_cust_id: '',
        dashboard_notify_activity_related_id: '',
        selectedClientCustomerID: '',
        isAdmin: '',
        contextPARAM8: '',
  setGlobalState: (state: {
    contextUserName: string;
    contextClientID: string,
    contaxtBranchID: string,
    contextCustomerID: string,
    contextRoleID: string,
    contextProfileImage:string,
    contextEmployeeID: string,
    contextCompanyName: string,
    contextLogoURL: string,
    contextSelectedCustId: string,
    contextAddFormEmpID: string,
    contextAnnouncementID: string,
    contextAddFormCustID: string,
    dashboard_notify_cust_id: string,
    dashboard_notify_activity_related_id: string,
    selectedClientCustomerID: string,
    isAdmin: string,
    contextPARAM8: string,
  }) => { },
});

// Create a provider component
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  

  const [globalState, setGlobalState] = useState(() => {
    // Load state from localStorage on initial render
    if (typeof window !== 'undefined') {

      const storedState = localStorage.getItem('globalState');
      return storedState ? JSON.parse(storedState) : {
        contextUserName: '', contextClientID: '',contaxtBranchID:'', contextCustomerID: ''
        , contextRoleID: '',contextProfileImage:'', contextEmployeeID: '', contextCompanyName: '', contextLogoURL: '',
        contextSelectedCustId: '',
        contextAddFormEmpID: '',
        contextAnnouncementID: '',
        contextAddFormCustID: '',
        dashboard_notify_cust_id: '',
        dashboard_notify_activity_related_id: '',
        selectedClientCustomerID: '',
        isAdmin: '',
        contextPARAM8: '',
      }
    } 
    return {
      contextUserName: '', contextClientID: '',contaxtBranchID:'', contextCustomerID: ''
        , contextRoleID: '',contextProfileImage:'', contextEmployeeID: '', contextCompanyName: '', contextLogoURL: '',
        contextSelectedCustId: '',
        contextAddFormEmpID: '',
        contextAnnouncementID: '',
        contextAddFormCustID: '',
        dashboard_notify_cust_id: '',
        dashboard_notify_activity_related_id: '',
        selectedClientCustomerID: '',
        isAdmin: '',
        contextPARAM8: '',
    }
  }
  );

  useEffect(() => {

    localStorage.setItem('globalState', JSON.stringify(globalState));
  }, [globalState]);

  return (
    <LoggedInGlobalContext.Provider value={{ ...globalState, setGlobalState }}>
      {children}
    </LoggedInGlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => {
  
  return useContext(LoggedInGlobalContext);
};
