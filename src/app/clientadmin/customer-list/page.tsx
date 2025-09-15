// Customer List with onboard new customer btn

'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { Client } from '@/app/models/companyModel'
import { ALERTMSG_exceptionString, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import ShowAlertMessage from '@/app/components/alert'
import { leftMenuCustomerListPageNumbers, pageURL_AddCustomer, pageURL_CustomerProfile } from '@/app/pro_utils/stringRoutes'
import { useRouter } from 'next/navigation'


const CustomerList = () => {
    const [custarray, setcustArray] = useState<Client[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [editcustId, setcustId] = useState('0');
    const [showDialog, setShowDialog] = useState(false);
    const { contaxtBranchID, contextClientID, contextRoleID,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName, dashboard_notify_activity_related_id, dashboard_notify_cust_id, setGlobalState } = useGlobalContext();
    
    const [isLoading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const router = useRouter();

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
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("client_id", "4");
            formData.append("parent_id", contextClientID || "3");

            const res = await fetch("/api/client/getCustomerProfile", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);
            if (response.status == 1) {

                const customerData = response.clients;
                setcustArray(customerData);
                setLoading(false);
            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get customer profile");
                setAlertForSuccess(2)

            }

        } catch (error) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)
            console.error("Error fetching user data:", error);
        }
    }


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)
            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <LoadingDialog isLoading={isLoading} />
            <LeftPannel menuIndex={leftMenuCustomerListPageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                custarray! && custarray.length > 0 ?

                    <div>

                        <div className='container'>
                            <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                                <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
                                    <div className="col-lg-6">
                                        Customer <span>List</span>
                                    </div>
                                    <div className="col-lg-6 mb-1" style={{ textAlign: "right" }}>
                                        <a href={pageURL_AddCustomer} className="red_button">On-board new Customer</a>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-lg-12">
                                    <div className="row mb-5">
                                        <div className="col-lg-12">
                                            <div className="grey_box" style={{ backgroundColor: "#fff" }} >
                                                <div className="row list_label mb-4">
                                                    <div className="col-lg-2 text-center"><div className="label">Company name</div></div>
                                                    <div className="col-lg-3 text-center"><div className="label">E-mail Id</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Contact details</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Location</div></div>
                                                    <div className="col-lg-2 text-center"><div className="label">Website</div></div>
                                                    <div className="col-lg-1 text-center"><div className="label">Action</div></div>
                                                </div>
                                                {custarray.map((data) => (
                                                    <div className="row list_listbox" key={data.client_id}>
                                                        <div className="col-lg-2 text-center">{data.company_name}</div>
                                                        <div className="col-lg-3 text-center">{data.company_email}</div>
                                                        <div className="col-lg-2 text-center">{data.company_number}</div>
                                                        <div className="col-lg-2 text-center">{data.company_location}</div>
                                                        <div className="col-lg-2 text-center">{data.company_website_url}</div>
                                                        <div className="col-lg-1 text-center">
                                                            <img src={staticIconsBaseURL + "/images/view_icon.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center", cursor:"pointer" }}
                                                                onClick={() => {
                                                                    setcustId(data.client_id + "");
                                                                    setGlobalState({
                                                                        contextUserName: contextUserName,
                                                                        contextClientID: contextClientID,
                                                                        contaxtBranchID: contaxtBranchID,
                                                                        contextCustomerID: contextCustomerID,
                                                                        contextRoleID: contextRoleID,
                                                                        contextProfileImage: contextProfileImage,
                                                                        contextEmployeeID: contextEmployeeID,
                                                                        contextCompanyName: contextCompanyName,
                                                                        contextLogoURL: contextLogoURL,
                                                                        contextSelectedCustId: '',
                                                                        contextAddFormEmpID: '',
                                                                        contextAnnouncementID: '',
                                                                        contextAddFormCustID: '',
                                                                        dashboard_notify_cust_id: '',
                                                                        dashboard_notify_activity_related_id: '',
                                                                        selectedClientCustomerID: data.client_id + '',
                                                                        isAdmin: '',
                                                                        contextPARAM8: '',
                                                                    });
                                                                    router.push(pageURL_CustomerProfile)
                                                                }}
                                                            />

                                                        </div>
                                                    </div>
                                                ))}
                                                {/* {showDialog && <LeaveTypeUpdate id={editLeaveTypeId} onClose={() => { setShowDialog(false), fetchData() }} />} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                        {<h4 className="text-muted">No Customers Added</h4>}
                    </div>
            } />
            {/* </div> */}
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default CustomerList;