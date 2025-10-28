// support form for employees to raise support

'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { ALERTMSG_FormExceptionString, whatsapp_number } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { pageURL_whatsappSuccessPage } from '@/app/pro_utils/stringRoutes';
import { CustomerLeavePendingCount, EmpLeave } from '@/app/models/leaveModel'
import moment from 'moment'

const LeaveList: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [loadingCursor, setLoadingCursor] = useState(false);

    const [selectedPage, setSelectedPage] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const [leavearray, setLeave] = useState<EmpLeave[]>([]);
    const [balancearray, setBalanceLeave] = useState<CustomerLeavePendingCount[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const searchParams = useSearchParams();
    const contactNumber = searchParams.get("contact_number");
    const [userData, setuserData] = useState<whatsappCustomerInfoModel[]>([]);

    const router = useRouter()
    useEffect(() => {
        setLoadingCursor(true);

        const fetchData = async () => {
            const custData = await getCustomerClientIds(contactNumber!);
            setuserData(custData);
            console.log("customer data:", userData);
            console.log("customer data:", userData);
            setLoadingCursor(false);
        };

        fetchData();
        getList();
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


    const getList = async () => {
        setLoadingCursor(true);
        try {
            let formData = {
                "client_id": "3",// userData[0].client_id,
                "branch_id": "3",//userData[0].branch_id,
                "customer_id": "76"//userData[0].customer_id
            }
            const res = await fetch(`/api/users/getAppliedLeaves`, {
                method: "POST",
                body: JSON.stringify(
                    formData
                ),
            });
            const response = await res.json();
            const leaveListData = response.leavedata;

            if (response.status == 1 ) {
                setLoading(false);
                // const leaveBalanceData = response.emp_leave_Balances.customerLeavePendingCount;
                setLeave(leaveListData);
                // setBalanceLeave(leaveBalanceData);
            } else  {
                setLoading(false);
                setLeave([]);
                // setHasMoreData(false);
            }
        } catch (error) {
            setLoadingCursor(false);
            console.log("Error submitting form:", error);
        }
    }

    return (
        <div className='apply-task-container'>
            <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
                <h2>Leave details</h2>
                {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                    setShowAlert(false)
                    if (alertForSuccess == 1) {
                        router.push(pageURL_whatsappSuccessPage);
                    }
                }} onCloseClicked={function (): void {
                    setShowAlert(false)
                }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}

                {leavearray.length > 0 ? (
                    <>{leavearray.map((leaveItem, index) => (
                        <div key={index} >
                            <div style={{
                                padding: "0 20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                                margin: "20px 0 0 0",
                                overflowY: "auto"
                            }}>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Leave Type</div>
                                    <div className="nw_user_offcanvas_listing_content">{leaveItem?.leap_client_leave.leave_name}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Applied on</div>
                                    <div className="nw_user_offcanvas_listing_content">{moment(leaveItem?.created_at).format('DD-MM-YYYY')}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Leave Date</div>
                                    <div className="nw_user_offcanvas_listing_content">
                                        {leaveItem?.from_date === leaveItem?.to_date ?
                                            <div className="ne_user_offcanvas_from_date_mainbox">
                                                <div className="ne_user_offcanvas_single_box">{moment(leaveItem?.from_date).format('DD-MM-YYYY')}</div> </div> :
                                            <div className="ne_user_offcanvas_from_date_mainbox"><div className="ne_user_offcanvas_from_to_box"><span className='from_color_code'>From :</span><span>{moment(leaveItem?.from_date).format('DD-MM-YYYY')}</span></div>
                                                <div className="ne_user_offcanvas_to_box"><div className="ne_user_offcanvas_from_to_box"><span className='from_color_code'>To :</span><span>{moment(leaveItem?.to_date).format('DD-MM-YYYY')}</span></div></div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Total days</div>
                                    <div className="nw_user_offcanvas_listing_content">{leaveItem?.total_days}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Leave Period</div>
                                    <div className="nw_user_offcanvas_listing_content">{/^[0-9]+$/.test(leaveItem?.duration || "") ? "--" : leaveItem?.duration}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Leave reason</div>
                                    <div className="nw_user_offcanvas_listing_content">{leaveItem?.leave_reason}</div>
                                </div>
                                <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Status</div>
                                    <div className="nw_user_offcanvas_listing_content">
                                        {leaveItem?.leave_status === 1 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#FF6600" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox"> {leaveItem?.leap_approval_status.approval_type}</div>
                                            </div>
                                            </>
                                        ) : leaveItem?.leave_status === 2 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#008000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox"> {leaveItem?.leap_approval_status.approval_type}</div>
                                            </div>
                                            </>
                                        ) : leaveItem?.leave_status === 3 ? (
                                            <><div className="nw_priority_mainbox">
                                                <div className="nw_priority_iconbox">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                        <path fill="#FF0000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                    </svg>
                                                </div>
                                                <div className="nw_priority_namebox"> {leaveItem?.leap_approval_status.approval_type}</div>
                                            </div>
                                            </>
                                        ) : < div />
                                        }
                                    </div>
                                </div>
                                {leaveItem?.approve_disapprove_remark && <div className="nw_user_offcanvas_listing">
                                    <div className="nw_user_offcanvas_listing_lable">Remark</div>
                                    <div className="nw_user_offcanvas_listing_content">{leaveItem?.approve_disapprove_remark}</div>
                                </div>}
                            </div>
                            <hr />
                        </div>
                    ))}
                    </>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default LeaveList

async function getCustomerClientIds(contact_number: string) {
    const { data, error } = await supabase
        .from('leap_customer')
        .select('customer_id, client_id, branch_id')
        .eq('contact_number', contact_number);

    if (error) throw error;
    return data;
}
