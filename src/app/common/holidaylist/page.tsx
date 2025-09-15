'use client'
import React, { useRef, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import moment from "moment";
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import AddHolidayForm from '@/app/components/dialog_addHolidayForm'
import BulkUploadForm from '@/app/components/bulkUpload'
import { ALERTMSG_exceptionString, bulkUploadTypeHolidays, exportTypeAsset, exportTypeHoliday, exportTypeLeave, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { LeapClientBranchDetail } from '@/app/models/companyModel'
import UpdateHolidayForm from '@/app/components/updateHolidayForm'
import AddHolidayYear from '@/app/components/dialog_addHolidayYear'
import { leftMenuDashboardPageNumbers } from '@/app/pro_utils/stringRoutes'
import ShowAlertMessage from '@/app/components/alert'

interface filterApply {
    yearID: any,
    branchID?: any,
}

const HolidayList = () => {

    const [filters, setFilters] = useState<filterApply>({ yearID: "" })
    const [brancheIDFilter, setBrancheIDFilter] = useState<number | null>(null);
    const [branchArray, setBranchArray] = useState<LeapClientBranchDetail[]>([]);
    const [holidayYearArray, setholidayYear] = useState<HolidayListYear[]>([]);
    const [holidays, setHolidays] = useState<any[]>([]);
    const { contextClientID, contaxtBranchID, contextCustomerID, contextRoleID, contextSelectedCustId,
        setGlobalState } = useGlobalContext();
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showHolidayDialog, setShowHolidayDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [holidayId, setHolidayId] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);

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
        const fetchBranches = async () => {
            setLoading(true);
            const branches = await getBranch(contextClientID);
            setBranchArray(branches);
            if (branches) {

            }
            const holidayYear = await getHolidayYear(contextClientID);
            setholidayYear(holidayYear);

            if (branches.length > 0) {
                setLoading(false);
                setBrancheIDFilter(branches[0].id);
                fetchData(0, branches[0].id);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to fetch some data");
                setAlertForSuccess(2)
            }
        };
        fetchBranches();
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

    const fetchData = async (yearID: any, branchId: number) => {
        try {
            setBrancheIDFilter(branchId);
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", branchId.toString());
            formData.append("holiday_year", yearID.toString());

            const res = await fetch("/api/commonapi/getHolidayList", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": contextClientID,
                    "branch_id": branchId.toString(),
                    "holiday_year": yearID.toString()
                }),
            });
            const response = await res.json();

            if (response.status === 1) {
                setHolidays(response.data.holidays || []);
            } else {
                setHolidays([]);
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to fetch holidays data");
                setAlertForSuccess(2)
            }
        } catch (error) {
            console.error("Error fetching holidays:", error);
            setHolidays([]);
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
        }
    };
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "yearID") {
            setFilters((prev) => ({ ...prev, yearID: value }));

            // Fetch holidays based on the selected year and currently selected branch
            fetchData(value, brancheIDFilter || branchArray[0]?.id);
        }
    };
    const downloadCSV = async () => {
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("export_type", exportTypeHoliday);
        formData.append("yearID", filters.yearID || "");
        formData.append("branch_id", brancheIDFilter ? brancheIDFilter.toString() : "");
        const response = await fetch("/api/clientAdmin/export-data", {
            method: "POST",
            body: formData,
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel
                menuIndex={leftMenuDashboardPageNumbers}
                subMenuIndex={0}
                showLeftPanel={true}
                rightBoxUI={
                    <div>
                        <LoadingDialog isLoading={isLoading} />
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)

                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                        <div className='container'>
                            <div className="row heading25 mb-3">
                                <div className="col-lg-6">
                                    Holiday <span>List</span>
                                </div>
                                <div className="col-lg-6 mb-2" style={{ textAlign: "right" }}>
                                    {holidayYearArray && holidayYearArray.length>0 && <button className="red_button red_button2" style={{ marginRight: "6px" }} onClick={() => setShowUploadDialog(true)}>Import</button>}
                                    {holidayYearArray && holidayYearArray.length>0 && <button className="red_button red_button2 " style={{ marginRight: "6px" }} onClick={() => setShowAddDialog(true)}>Add Holiday</button>}
                                    <button className="red_button red_button2" onClick={() => setShowHolidayDialog(true)}>Add Holiday Year</button>&nbsp;
                                    {holidays && holidays.length>0 && <button className="red_button red_button2" onClick={() => downloadCSV()}>Export</button>}

                                </div>
                                <div className={showAddDialog ? "rightpoup rightpoupopen" : "rightpoup"}> 
                                {showAddDialog && <AddHolidayForm onClose={() => setShowAddDialog(false)} />}
                                </div>
                                 <div className={showHolidayDialog ? "rightpoup rightpoupopen" : "rightpoup"}>    
                                {showHolidayDialog && <AddHolidayYear onClose={() => setShowHolidayDialog(false)} isedit={false} editid={0}  />}
                                </div>
                                <div className={showUploadDialog ? "rightpoup rightpoupopen" : "rightpoup"}> 

                                    {showUploadDialog && <BulkUploadForm uploadType={bulkUploadTypeHolidays} onClose={() => setShowUploadDialog(false)} />}
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-lg-2">
                                    <div className="form_box mb-3">
                                        <select id="yearID" name="yearID" onChange={handleFilterChange}>
                                            <option value="">Select Holiday Year:</option>
                                            {holidayYearArray.map((id, index) => (
                                                <option value={id.id} key={id.id} >{id.list_name}</option >

                                            ))}
                                        </select>

                                    </div>
                                </div>
                                <div className="col-lg-10">
                                    {branchArray.map((branch) => (
                                        <div className={brancheIDFilter === branch.id ? "list_view_box_selected" : "list_view_box"}
                                            key={branch.id} style={{ width: "15%", margin: "0 10px 10px 0", opacity: filters.yearID ? 1 : 0.5 }}>
                                            <a onClick={() => { setFilters((prev) => ({ ...prev, branchID: branch.id }));if (filters.yearID){ fetchData(filters.yearID, branch.id);} }}
                                                style={{ pointerEvents: filters.yearID ? "auto" : "none", cursor: filters.yearID ? "pointer" : "not-allowed" }}>
                                                <div className={brancheIDFilter === branch.id ? "selected text-center" : "list_view_heading text-center"}>
                                                    {branch.branch_number}
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="grey_box" style={{ backgroundColor: "#fff" }}>
                                        <div className="row list_label mb-4">
                                            <div className="col-lg-3 text-center"><div className="label">Holiday Name</div></div>
                                            <div className="col-lg-3 text-center"><div className="label">Holiday Type</div></div>
                                            <div className="col-lg-2 text-center"><div className="label">Day</div></div>
                                            <div className="col-lg-2 text-center"><div className="label">Date</div></div>
                                            <div className="col-lg-2 text-center"><div className="label">Action</div></div>
                                        </div>

                                        {holidays.length > 0 ? (
                                            holidays.map((holiday) => (
                                                <div className="row list_listbox" key={holiday.id}>
                                                    <div className="col-lg-3 text-center"><b>{holiday.holiday_name}</b></div>
                                                    <div className="col-lg-3 text-center">{holiday.holiday_type_id?.holiday_type || "--"}</div>
                                                    <div className="col-lg-2 text-center">{moment(holiday.date).format("dddd")}</div>
                                                    <div className="col-lg-2 text-center">{moment(holiday.date).format("YYYY-MM-DD")}</div>
                                                    <div className="col-lg-2 text-center">
                                                        <img src={staticIconsBaseURL + "/images/edit.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", cursor: "pointer" }}
                                                            onClick={() => {
                                                                setHolidayId(holiday.id);
                                                                setShowUpdateDialog(true);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center">No holidays available</div>
                                        )}

                                    <div className={showUpdateDialog ? "rightpoup rightpoupopen" : "rightpoup"}>                                  
                                        {showUpdateDialog && <UpdateHolidayForm id={holidayId} onClose={() => { setShowUpdateDialog(false),fetchData(filters.yearID,filters.branchID) }} />}
                                    </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
            <Footer />
        </div>
    );
};

export default HolidayList;

async function getBranch(clientID: any) {
    let query = supabase
        .from('leap_client_branch_details')
        .select()
        .eq('client_id', clientID);
    const { data, error } = await query;
    return error ? [] : data;
}

async function getHolidayYear(clientID: any) {

    let query = supabase
        .from('leap_holiday_year')
        .select()
        .eq("client_id", clientID);
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}