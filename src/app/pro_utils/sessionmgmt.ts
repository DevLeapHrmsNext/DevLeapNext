import { useState, useEffect } from "react";
import { sessionBranchID, sessionClientID, sessionCustomerID, sessionEmployeeID, sessionEmployeeName, sessionRoleID } from "./stringConstants";
import { useRouter } from "next/navigation";
import supabase from "../api/supabaseConfig/supabase";
import { useGlobalContext } from "../contextProviders/loggedInGlobalContext";

interface SessionState {
  sessionClientID: string | null;
  sessionBranchID: string | null;
  sessionCustomerID: string | null;
  sessionEmployeeID: string | null;
  sessionEmployeeName: string | null;
  sessionRoleID: string | null;
}

const useSession = () => {
   const { contextCompanyName, setGlobalState } = useGlobalContext();
  
  const router=useRouter();  
  const [session, setSession] = useState<SessionState>({
    sessionClientID: null,
    sessionBranchID: null,
    sessionCustomerID: null,
    sessionEmployeeID: null,
    sessionEmployeeName: null,
    sessionRoleID: null,
  });

  useEffect(() => {
    const storedSession = {
      sessionClientID: sessionStorage.getItem(sessionClientID),
      sessionBranchID: sessionStorage.getItem(sessionBranchID),
      sessionCustomerID: sessionStorage.getItem(sessionCustomerID),
      sessionEmployeeID: sessionStorage.getItem(sessionEmployeeID),
      sessionEmployeeName: sessionStorage.getItem(sessionEmployeeName),
      sessionRoleID: sessionStorage.getItem(sessionRoleID),
    };
    setSession(storedSession);

    // Update session state if sessionStorage changes
    const handleStorageChange = () => {
      setSession({
        sessionClientID: sessionStorage.getItem(sessionClientID),
        sessionBranchID: sessionStorage.getItem(sessionBranchID),
        sessionCustomerID: sessionStorage.getItem(sessionCustomerID),
        sessionEmployeeID: sessionStorage.getItem(sessionEmployeeID),
        sessionEmployeeName: sessionStorage.getItem(sessionEmployeeName),
        sessionRoleID: sessionStorage.getItem(sessionRoleID),
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (clientID: any, branchID:any,customerID:any,empID:any,empName:any,roleID:any) => {

    sessionStorage.setItem(sessionClientID, clientID);
    sessionStorage.setItem(sessionBranchID, branchID);
    sessionStorage.setItem(sessionCustomerID, customerID);
    sessionStorage.setItem(sessionEmployeeID, empID);
    sessionStorage.setItem(sessionEmployeeName, empName);
    sessionStorage.setItem(sessionRoleID, roleID);

    
    setSession({ sessionClientID, sessionBranchID,sessionCustomerID,sessionEmployeeID,sessionEmployeeName,sessionRoleID });
  };

  const logout = async (companyName:any) => {
    // sessionStorage.removeItem(sessionClientID);
    // sessionStorage.removeItem(sessionBranchID);
    // sessionStorage.removeItem(sessionCustomerID);
    // sessionStorage.removeItem(sessionEmployeeID);
    // sessionStorage.removeItem(sessionEmployeeName);
    // sessionStorage.removeItem(sessionRoleID);
    const { error } = await supabase.auth.signOut();
    const baseURL=process.env.NEXT_PUBLIC_BASE_URL;
    // setSession({ sessionClientID:null, sessionBranchID,sessionCustomerID,sessionEmployeeID,sessionEmployeeName,sessionRoleID });
    if(contextCompanyName!){
    router.replace(`${baseURL}/${contextCompanyName}/login`)
    }else{
      router.replace(`${baseURL}/${companyName}/login`)

    }
  };

  return { session, login, logout };
};

export default useSession;
