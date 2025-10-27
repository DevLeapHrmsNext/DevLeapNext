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

            if (response.status == 1 && leaveListData.length > 0) {
                setLoading(false);
                const leaveBalanceData = response.emp_leave_Balances.customerLeavePendingCount;
                setLeave(leaveListData);
                setBalanceLeave(leaveBalanceData);
                // if (leaveListData.length < 10) {
                //     setHasMoreData(false);
                // } else {
                //     setHasMoreData(true);
                // }
            } else if (response.status == 1 && leaveListData.length == 0) {
                setLoading(false);
                setLeave([]);
                // setHasMoreData(false);
            } else if (response.status == 0) {
                setLoading(false);
                setSelectedPage(response.page);
                // setHasMoreData(false);/
                // setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to load next page data");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoadingCursor(false);
            console.log("Error submitting form:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_FormExceptionString);
            setAlertForSuccess(2)
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
                            {/* <p><strong>Leave Type:</strong> {leaveItem.leap_client_leave.leave_name}</p>
                            <p><strong>Total Days:</strong> {leaveItem.total_days}</p>
                            <p><strong>Date:</strong> {leaveItem.from_date === leaveItem.to_date ?
                                (moment(leaveItem.from_date).format('DD-MM-YYYY')) :
                                <>{moment(leaveItem.from_date).format('DD-MM-YYYY')} <span className='from_color_code'>to</span> {moment(leaveItem.to_date).format('DD-MM-YYYY')}</>}</p>
                            <p><strong>Duration:</strong> {leaveItem.duration}</p>
                            <p><strong>Status:</strong> {leaveItem.leave_status === 1 ? (
                                <>
                                    <div className="col-lg-2 text-center">
                                        <div className="user_orange_chip">
                                            <div className="nw_chip_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                                                    <g fill="#FF6600">
                                                        <path fillRule="evenodd" d="M12 1.846a10.154 10.154 0 1 0 0 20.308 10.154 10.154 0 0 0 0-20.308zM0 12C0 5.372 5.372 0 12 0s12 5.372 12 12-5.372 12-12 12S0 18.628 0 12z" clipRule="evenodd" data-original="#000000" />
                                                        <path fillRule="evenodd" d="M12 6.77a.924.924 0 0 1 .924.923v4.923a.924.924 0 1 1-1.848 0V7.692A.924.924 0 0 1 12 6.769z" clipRule="evenodd" data-original="#000000" />
                                                        <path d="M13.231 16.308a1.231 1.231 0 1 1-2.462 0 1.231 1.231 0 0 1 2.462 0z" data-original="#000000" />
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="new_chip_contentbox">
                                                {leaveItem.leap_approval_status.approval_type}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : leaveItem.leave_status === 2 ? (
                                <>
                                    <div className="col-lg-2 text-center">
                                        <div className="user_green_chip">
                                            <div className="nw_chip_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="13" height="13" x="0" y="0" viewBox="0 0 682.667 682.667">
                                                    <g>
                                                        <defs>
                                                            <clipPath id="b" clipPathUnits="userSpaceOnUse">
                                                                <path d="M0 512h512V0H0Z" fill="#008000" opacity="1" data-original="#000000"></path>
                                                            </clipPath>
                                                        </defs>
                                                        <mask id="a">
                                                            <rect width="100%" height="100%" fill="#ffffff" opacity="1" data-original="#ffffff"></rect>
                                                        </mask>
                                                        <g mask="url(#a)">
                                                            <path d="m0 0-134.174-134.174-63.873 63.872" transform="matrix(1.33333 0 0 -1.33333 473.365 251.884)" fill="none" stroke="#008000" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" data-original="#000000" opacity="1"></path>
                                                            <g clip-path="url(#b)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                                                                <path d="M0 0c0-130.339-105.661-236-236-236S-472-130.339-472 0s105.661 236 236 236S0 130.339 0 0Z" transform="translate(492 256)" fill="none" stroke="#008000" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" data-original="#000000" opacity="1"></path>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="new_chip_contentbox">{leaveItem.leap_approval_status.approval_type}</div>
                                        </div>
                                    </div>
                                </>
                            ) : leaveItem.leave_status === 3 ? (
                                <>
                                    <div className="col-lg-2 text-center">
                                        <div className="user_red_chip">
                                            <div className="nw_chip_iconbox">
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="13" height="13" x="0" y="0" viewBox="0 0 32 32">
                                                    <g transform="matrix(1.1399999999999995,0,0,1.1399999999999995,-2.240141324996948,-2.240000267028801)">
                                                        <path d="M21 12.46 17.41 16 21 19.54A1 1 0 0 1 21 21a1 1 0 0 1-.71.29 1 1 0 0 1-.7-.29L16 17.41 12.46 21a1 1 0 0 1-.7.29 1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.41L14.59 16l-3.54-3.54a1 1 0 0 1 1.41-1.41L16 14.59l3.54-3.54A1 1 0 0 1 21 12.46zm4.9 13.44a14 14 0 1 1 0-19.8 14 14 0 0 1 0 19.8zM24.49 7.51a12 12 0 1 0 0 17 12 12 0 0 0 0-17z" data-name="Layer 22" fill="#ff0000" opacity="1" data-original="#000000"></path>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="new_chip_contentbox">{leaveItem.leap_approval_status.approval_type}</div>
                                        </div>
                                    </div>
                                </>
                            ) : < div />}
                            </p> */}
                            <div className="nw_user_offcanvas_listing_mainbox" style={{ height: "40vh" }}>
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
                                <div className="nw_user_offcanvas_listing_discription_box">
                                    <div className="nw_user_offcanvas_listing_lable">Remark</div>
                                    <div className="nw_user_offcanvas_listing_content_textarea">{leaveItem?.approve_disapprove_remark ? leaveItem?.approve_disapprove_remark : "--"}</div>
                                </div>
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
