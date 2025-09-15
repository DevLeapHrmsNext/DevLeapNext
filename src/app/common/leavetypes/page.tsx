// Company leave List type

'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { LeaveType } from '@/app/models/leaveModel'
import {leftMenuLeavePageNumbers, pageURL_createLeaveTypeForm } from '@/app/pro_utils/stringRoutes'
import AddHolidayForm from '@/app/components/addHolidayForm'
import LeaveTypeUpdate from '@/app/components/dialog_leaveType'
import BackButton from '@/app/components/BackButton'
import { staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'


const LeaveTypeList = () => {
    const [leavearray, setLeave] = useState<LeaveType[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [editLeaveTypeId, setEditLeaveTypeId] = useState('0');
    const [showDialog, setShowDialog] = useState(false);
    const { contextClientID,contaxtBranchID} = useGlobalContext();
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

    }, [])
    const fetchData = async () => {

        try {
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", contaxtBranchID);

            const res = await fetch("/api/users/showLeaveType", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            const leaveListData = response.data;
            setLeave(leaveListData);

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    const formData = new FormData();

    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuLeavePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                

                    <div>
                        <div className='container'>
                            <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                                <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
                                    <div className="col-lg-6">
                                        Company Leave <span>Type</span>
                                    </div>
                                    <div className="col-lg-6 mb-1" style={{ textAlign: "right" }}>
                                        <a href={pageURL_createLeaveTypeForm} className="red_button">Create New Leave Type</a>
                                    </div>
                                </div>&nbsp;
                            </div>
                            {leavearray! && leavearray.length > 0 ?
                            <div className="row mt-4">
                                <div className="col-lg-12">
                                    <div className="row mb-5">
                                        <div className="col-lg-12">
                                            <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                                <div className="row list_label mb-4">
                                                    <div className="col-lg-2 text-center"><div className="label">Leave Type</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Category</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Days per month</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Applicable for</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">if unused</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Validity</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Description</div></div>

                                                </div>
                                                {leavearray.map((leaveType) => (
                                                    <div className="row list_listbox" key={leaveType.leave_id}>
                                                        <div className="col-lg-2 text-center">{leaveType.leave_name}</div>
                                                        <div className="col-lg-1 text-center">{leaveType.leave_category}</div>
                                                        <div className="col-lg-2 text-center">{leaveType.leave_count}</div>
                                                        <div className="col-lg-1 text-center">{leaveType.gender}</div>
                                                        <div className="col-lg-2 text-center">{leaveType.if_unused}</div>
                                                        <div className="col-lg-1 text-center">{leaveType.validPeriod != "null" ? leaveType.validPeriod : "NA"}</div>
                                                        <div className="col-lg-2 text-center">{leaveType.leave_discription}</div>
                                                        <div className="col-lg-1 text-center">
                                                            <img src={staticIconsBaseURL+"/images/edit.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
                                                                onClick={() => {
                                                                    setEditLeaveTypeId(leaveType.leave_id);
                                                                    setShowDialog(true)
                                                                }}
                                                            />

                                                        </div>
                                                    </div>
                                                ))}
                                                <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>                                  

                                                    {showDialog && <LeaveTypeUpdate id={editLeaveTypeId} onClose={() => { setShowDialog(false), fetchData() }} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> : <LoadingDialog isLoading={true} />}
                            <div className="row">
                                <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton isCancelText={false}/></div>
                            </div>
                        </div>
                    </div>
                   
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default LeaveTypeList;

