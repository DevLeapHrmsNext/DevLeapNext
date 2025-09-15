'use client'

import supabase from '@/app/api/supabaseConfig/supabase';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { ALERTMSG_exceptionString } from '@/app/pro_utils/stringConstants';
import {  leftMenuOrgHierarchy } from '@/app/pro_utils/stringRoutes';
import { EmployeeORGHierarchyDataModel } from '@/app/models/OrgHierarchyDataModel';
import ShowAlertMessage from '@/app/components/alert';
import PageErrorCenterContent from '@/app/components/pageError';
import OrganizationTree from '@/app/components/OrganizationTree';
import { useEffect, useState } from 'react';

interface filterApply {
    branchID: any,
    DesignationID: any,
    departmentID: any,
    sortBy: any
}

const OrganizationHierarchy = () => {
    const [userData, setUserData] = useState<EmployeeORGHierarchyDataModel[]>([]);
    const [filters, setFilters] = useState<filterApply>({ branchID: "", departmentID: "", DesignationID: "", sortBy: "" })
    const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
    const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const { contextClientID } = useGlobalContext()

    const [isLoading, setLoading] = useState(true);
        const [showAlert, setShowAlert] = useState(false);
        const [alertForSuccess, setAlertForSuccess] = useState(0);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertStartContent, setAlertStartContent] = useState('');
        const [alertMidContent, setAlertMidContent] = useState('');
        const [alertEndContent, setAlertEndContent] = useState('');
        const [alertValue1, setAlertValue1] = useState('');
        const [alertvalue2, setAlertValue2] = useState('');

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
    }, []);
    const fetchData = async () => {
        setLoading(true);
        
        // const designations = await getDesignations(contextClientID);
        
        // const department = await getDepartments(contextClientID);
        
        // const branch = await getBranches(contextClientID);
        // setLoading(false);
        // if(designations.length==0 || department.length==0 || branch.length==0){
        //         setShowAlert(true);
        //         setAlertTitle("Error")
        //         setAlertStartContent("Failed to get some details");
        //         setAlertForSuccess(2)
        // }else{
        //     setBranchArray(branch);
        //     setDepartment(department);
        //     setDesignations(designations);
        // }
        fetchUsers("", "")
        
        
        


    }
    const fetchUsers = async (filterID: any, value: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            // if (filterID == 1) formData.append("branch_id", filters.branchID.length > 0 && filters.branchID == value ? filters.branchID : value);
            // if (filterID == 2) formData.append("department_id", filters.departmentID.length > 0 && filters.departmentID == value ? filters.departmentID : value);
            // if (filterID == 3) formData.append("designation_id", filters.DesignationID.length > 0 && filters.DesignationID == value ? filters.departmentID : value);
            // if (filterID == 4) formData.append("sortOrder", filters.sortBy.length > 0 && filters.sortBy == value ? filters.sortBy : value);
            

            const response = await fetch("/api/clientAdmin/getAllEmployeeHierarchy", {
                method: "POST",
                body: formData,
            });
            
            if (!response.ok ) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get data");
                setAlertForSuccess(2)
                
            }else{
                const data = await response.json();
                if(data.status==1){
                    setLoading(false);
                    setUserData(data.data)
                }else{
                    setLoading(false);
                    setShowAlert(true);
                    setAlertTitle("Error")
                    setAlertStartContent("Failed to get data");
                    setAlertForSuccess(2)
                }
            }
        } catch (e) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
            console.log(e);

        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log("this is the name ", name);
        console.log("this is the value", value);

        // const updatedFilters = { ...filters, [name]: value };
        if (name == "branchID") {
            setFilters((prev) => ({ ...prev, ['branchID']: value }));
            fetchUsers(1, value);
        }
        if (name == "departmentID") {
            setFilters((prev) => ({ ...prev, ['departmentID']: value }));
            fetchUsers(2, value);
        }
        if (name == "DesignationID") {
            setFilters((prev) => ({ ...prev, ['DesignationID']: value }));
            fetchUsers(3, value);
        }
        if (name == "sortBy") {
            setFilters((prev) => ({ ...prev, ['sortBy']: value }));
            fetchUsers(4, value);
        }
        // setFilters((prev) => ({ ...prev, [name]: value }));
        // console.log(filters);


    };
    function filter_whitebox() {
        const x = document.getElementById("filter_whitebox");
        if (x!.className === "filter_whitebox") {
            x!.className += " filter_whitebox_open";
        } else {
            x!.className = "filter_whitebox";
        }
    }

    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuOrgHierarchy} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                <div>
                    <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                    setShowAlert(false)
                                }} onCloseClicked={function (): void {
                                    setShowAlert(false)
                                }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    {
                userData! && userData.length > 0 ?


                <div>
                    {/* <div className ="right_mainbox"> */}
                    <div className='container'>
                        <div style={{ position: "sticky", top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                            <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
                                <div className="col-lg-7">
                                    Organization <span>Hierarchy</span>
                                </div>
                                {/* <div className="col-lg-5 mb-1" style={{ textAlign: "right" }}>
                                    <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div>&nbsp;
                                </div>
                                {showUploadDialog && <BulkUploadForm uploadType={bulkUploadTypeEmployee} onClose={() => setShowUploadDialog(false)} />} */}

                            </div>
                            
                        </div>


                        
                    </div>
                    <OrganizationTree employeeHerarichy={userData} />
                </div>
                : <PageErrorCenterContent content={isLoading?"":"No Data Available"} />} 
                </div>
            } />
            

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default OrganizationHierarchy


async function getDesignations(client_id: any) {

    let query = supabase
        .from('leap_client_designations')
        .select().eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {


        return data;
    }
}

async function getDepartments(client_id: any) {

    let query = supabase
        .from('leap_client_departments')
        .select().eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getBranches(client_id: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
