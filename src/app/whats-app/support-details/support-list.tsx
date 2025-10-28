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
import { SingleSupportRequest, SupportList } from '@/app/models/supportModel'

const SupportListPage: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [loadingCursor, setLoadingCursor] = useState(false);

    const [supportArray, setSupport] = useState<SingleSupportRequest[]>([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [isLoading, setLoading] = useState(false);
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
                "customer_id": "76"//userData[0].customer_id
            }
            const res = await fetch(`/api/users/support/supportList`, {
                method: "POST",
                body: JSON.stringify(
                    formData
                ),
            });
            const response = await res.json();
            const supportData = response.data;

            if (response.status == 1) {
                setLoading(false);
                setSupport(supportData);
            } else  {
                setLoading(false);
            } 
        } catch (error) {
            setLoadingCursor(false);
            console.log("Error submitting form:", error);
        }
    }

    return (
        <div className='apply-task-container'>
            <div className={`${loadingCursor ? "cursorLoading" : ""}`}>
                <h2>Support list</h2>
                {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                    setShowAlert(false)
                    if (alertForSuccess == 1) {
                        router.push(pageURL_whatsappSuccessPage);
                    }
                }} onCloseClicked={function (): void {
                    setShowAlert(false)
                }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}

                {supportArray.length > 0 ? (
                    <>{supportArray.map((list, index) => (
                        <div key={index} >
                            <div className="nw_user_offcanvas_mainbox">
                                <div className="nw_user_offcanvas_heading">
                                    Ticket <span style={{ fontSize: "large" }}>{list?.ticket_id || "--"}</span>
                                </div>
                                <div style={{
                                    padding: "0 20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "15px",
                                    margin: "20px 0 0 0",
                                    overflowY: "auto"
                                }}>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Request Category</div>
                                        <div className="nw_user_offcanvas_listing_content">{list?.leap_request_master?.category}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Request Type</div>
                                        <div className="nw_user_offcanvas_listing_content">{list?.leap_request_master?.type_name}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Raised on</div>
                                        <div className="nw_user_offcanvas_listing_content">{moment(list?.raised_on).format('DD-MM-YYYY')}</div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Priority</div>
                                        <div className="nw_user_offcanvas_listing_content">

                                            {list?.priority_level === 1 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#FF0000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_priority?.priority_name}</div>
                                                </div>
                                                </>
                                            ) : list?.priority_level === 2 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#FF6600" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_priority?.priority_name}</div>
                                                </div>
                                                </>
                                            ) : list?.priority_level === 3 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#008000" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_priority?.priority_name}</div>
                                                </div>
                                                </>
                                            ) : < div />
                                            }
                                        </div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing nw_user_offcanvas_listing_status">
                                        <div className="nw_user_offcanvas_listing_lable">Status</div>
                                        <div className="nw_user_offcanvas_listing_content">
                                            {list?.active_status === 1 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#FF6600" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_status?.status}</div>
                                                </div>
                                                </>
                                            ) : list?.active_status === 2 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#1976d2" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_status?.status}</div>
                                                </div>
                                                </>
                                            ) : list?.active_status === 3 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#388e3c" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_status?.status}</div>
                                                </div>
                                                </>
                                            ) : list?.active_status === 4 ? (
                                                <><div className="nw_priority_mainbox">
                                                    <div className="nw_priority_iconbox">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 341.333 341.333">
                                                            <path fill="#f57c00" d="M170.667 0C76.41 0 0 76.41 0 170.667s76.41 170.667 170.667 170.667 170.667-76.41 170.667-170.667S264.923 0 170.667 0zm0 298.667c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.308 128-128 128z" data-original="#000000" />
                                                        </svg>
                                                    </div>
                                                    <div className="nw_priority_namebox">{list?.leap_request_status?.status}</div>
                                                </div>
                                                </>
                                            ) : < div />
                                            }
                                        </div>
                                    </div>
                                    <div className="nw_user_offcanvas_listing">
                                        <div className="nw_user_offcanvas_listing_lable">Description</div>
                                        <div className="nw_user_offcanvas_listing_content">
                                            {list?.description}
                                        </div>
                                    </div>
                                    {/* <div className="nw_user_offcanvas_listing_previous_box">
                                        <div className="nw_user_offcanvas_listing_lable">Previous updates</div>
                                        <div className="nw_user_offcanvas_listing_content_textarea">
                                            {list?.leap_client_employee_requests_updates && list?.leap_client_employee_requests_updates.length > 0 ?

                                                <div className="col-lg-12">
                                                    <div className="row list_label mb-4">
                                                        <div className="col-lg-3 text-center"><div className="label">Updated By</div></div>
                                                        <div className="col-lg-2 text-center"><div className="label">Status</div></div>
                                                        <div className="col-lg-4 text-center"><div className="label">Comment</div></div>
                                                        <div className="col-lg-3 text-center"><div className="label">Updated On</div></div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className='horizontal_scrolling' style={{ display: "inherit", width: "100%", maxWidth: "100%", maxHeight: "120px", overflowX: "hidden" }}>
                                                                {list?.leap_client_employee_requests_updates && list?.leap_client_employee_requests_updates.length > 0 && (
                                                                    list?.leap_client_employee_requests_updates.map((updatedData, index) => (
                                                                        <div className="row list_listbox" key={index}>
                                                                            <div className="col-lg-3 text-center">{updatedData.leap_customer.name}</div>
                                                                            {updatedData.status === 1 ? (
                                                                                <><div className="col-lg-2 text-center" style={{ color: "orange" }}>{updatedData.leap_request_status.status}</div></>
                                                                            ) : updatedData.status === 2 ? (
                                                                                <><div className="col-lg-2 text-center" style={{ color: "#1976d2" }}>{updatedData.leap_request_status.status}</div></>
                                                                            ) : updatedData.status === 3 ? (
                                                                                <><div className="col-lg-2 text-center" style={{ color: "green" }}>{updatedData.leap_request_status.status}</div></>
                                                                            ) :
                                                                                <><div className="col-lg-2 text-center" style={{ color: "red" }}>{updatedData.leap_request_status.status}</div></>
                                                                            }
                                                                            <div className="col-lg-4 text-center">{updatedData.comments}</div>
                                                                            <div className="col-lg-3 text-center">{moment(updatedData.created_at).format('DD-MM-YYYY')}</div>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                : (
                                                    <div className="text-center">No previous updates</div>
                                                )}
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    ))}
                    </>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default SupportListPage

async function getCustomerClientIds(contact_number: string) {
    const { data, error } = await supabase
        .from('leap_customer')
        .select('customer_id, client_id, branch_id')
        .eq('contact_number', contact_number);

    if (error) throw error;
    return data;
}
