

//design changes shared by swapnil on 08 th May 2025


'use client'
import React from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { useEffect, useState } from 'react'
import LoadingDialog from '@/app/components/PageLoader';
import { UserProfile } from '@/app/components/userProfileCard';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import BulkUploadForm from '@/app/components/bulkUpload';
import { bulkUploadTypeEmployee } from '@/app/pro_utils/stringConstants';
import { leftMenuEmployeeListPageNumbers } from '@/app/pro_utils/stringRoutes';
import ShowAlertMessage from '@/app/components/alert';
import PageErrorCenterContent from '@/app/components/pageError';

interface filterApply {
    branchID: any,
    DesignationID: any,
    departmentID: any,
    sortBy: any
}

const UserListProfile = () => {
    const [userData, setUserData] = useState([]);
    const [filters, setFilters] = useState<filterApply>({ branchID: "", departmentID: "", DesignationID: "", sortBy: "" })
    const [designationArray, setDesignations] = useState<DesignationTableModel[]>([]);
    const [departmentArray, setDepartment] = useState<DepartmentTableModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const { contextClientID } = useGlobalContext();

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

        const fetchData = async () => {
            setLoading(true);
            const designations = await getDesignations(contextClientID);
            
            const department = await getDepartments(contextClientID);
            
            const branch = await getBranches(contextClientID);
            

            const emplyee = await getEmployeesData(contextClientID);
            
            if(designations.length>0 && department.length>0 && branch.length>0 && emplyee.length>0){
                setLoading(false);
                setDepartment(department);
                setBranchArray(branch);
                setDesignations(designations);
                setUserData(emplyee);
            }else{
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get some data");
                setAlertForSuccess(2)
            }

        }
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

    const fetchUsers = async (filterID: any, value: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            if (filterID == 1 ) formData.append("branch_id", filters.branchID.length > 0 && filters.branchID == value ? filters.branchID : value);
            if (filters.branchID.length > 0) formData.append("branch_id", filters.branchID);
            if (filterID == 2 || filters.departmentID.length > 0) formData.append("department_id", filters.departmentID.length > 0 && filters.departmentID == value ? filters.departmentID : value);
            if (filterID == 3 || filters.DesignationID.length > 0) formData.append("designation_id", filters.DesignationID.length > 0 && filters.DesignationID == value ? filters.departmentID : value);
            if (filterID == 4 || filters.sortBy.length > 0) formData.append("sortOrder", filters.sortBy.length > 0 && filters.sortBy == value ? filters.sortBy : value);
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await fetch("/api/clientAdmin/getAllEmployee", {
                method: "POST",
                body: formData,
            });
           
                const data = await response.json();
                if(data.status==1){
                    setLoading(false);
                    setUserData(data.data);
                }else{
                    setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get data");
                setAlertForSuccess(2)
                }
                
            
            
        } catch (e) {
            console.log(e);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Error")
            setAlertStartContent("Failed to delete data");
            setAlertForSuccess(2)
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
            <main className="flex-grow">
            <LeftPannel menuIndex={leftMenuEmployeeListPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                
               
                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container employee_mainbox'>




                        <div className='inner_heading_sticky'>
                            <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
                                <div className="col-lg-7">
                                    Employee <span>List</span>
                                </div>
                                <div className="col-lg-5 mb-1" style={{ textAlign: "right" }}>
                                    <div className="filtermenu red_button" onClick={filter_whitebox}>Filter</div>&nbsp;
                                    <a href="/clientadmin/addEmployeeForm" className="red_button">Add New User</a>&nbsp;
                                    <a className="red_button" onClick={(e) => setShowUploadDialog(true)}>Bulk Upload</a>

                                </div>
                            </div>
                            
                            {/* <div className="row">
                                <div className="col-lg-12">
                                    {showUploadDialog && <BulkUploadForm uploadType={bulkUploadTypeEmployee} onClose={() => setShowUploadDialog(false)} />}
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="filter_whitebox" id="filter_whitebox">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="form_box mb-1">
                                                    <select id="branchID" name="branchID" onChange={handleFilterChange}>
                                                        <option value="">Branch:</option>
                                                        {branchArray.map((branch, index) => (
                                                            <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form_box mb-1">
                                                    <select id="departmentID" name="departmentID" onChange={handleFilterChange}>
                                                        <option value="">Department:</option>
                                                        {departmentArray.map((dep, index) => (
                                                            <option value={dep.department_id} key={dep.department_id}>{dep.department_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form_box mb-1">
                                                    <select id="DesignationID" name="DesignationID" onChange={handleFilterChange}>
                                                        <option value="">Designation:</option>
                                                        {designationArray.map((designation, index) => (
                                                            <option value={designation.designation_id} key={designation.designation_id}>{designation.designation_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form_box mb-1">
                                                    <select
                                                        name="sortBy" onChange={handleFilterChange}>
                                                        <option value="">Sort By:</option>
                                                        <option value="1"> A-Z</option>
                                                        <option value="2">Z-A</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                

                        </div>
                        <div className={showUploadDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showUploadDialog && <BulkUploadForm uploadType={bulkUploadTypeEmployee} onClose={() => setShowUploadDialog(false)} />}
                        </div>

                        {
                userData! && userData.length > 0 && designationArray!
                && designationArray.length > 0 && departmentArray! && departmentArray.length > 0 && branchArray! && branchArray.length > 0 ?

                        <div className="row mt-4" id="top">
                            {userData.map((card, index) => (
                                <div className="col-lg-3 mb-5" key={index}>
                                    <div className="userlist">
                                        <UserProfile card={card} />
                                    </div>
                                </div>
                            ))}
                        </div>: <PageErrorCenterContent content={isLoading?"":userData.length == 0?"No employee Added":"Something went wrong"} />}
                    </div>
                </div>
                
            } />
            {/* </div> */}
            </main>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default UserListProfile


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

async function getEmployeesData(client_id: any) {
    try {
        const formData = new FormData();
        formData.append("client_id", client_id);

        const response = await fetch("/api/clientAdmin/getAllEmployee", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();


        return data.data;
    } catch (e) {
        console.log(e);

    }
}