'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js';
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { error } from 'console';
import { CustomerProfile, LeapRelations } from '@/app/models/employeeDetailsModel';
import LoadingDialog from '@/app/components/PageLoader';
import { UserEmployement } from '@/app/components/profileEmployementUser';
import { UserAddress } from '@/app/components/profileAddressUser';
import { UserBankDetails } from '@/app/components/profileBankDetailsUser';
import { UserPersonalDetails } from '@/app/components/profilePersonalDetailsUser';
import { employeeProfileDetails} from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { UserProfileLeaveDetails } from '@/app/components/profileLeaveDetailsUser';


const EmployeeProfile = () => {
    const [userData, setUserData] = useState<CustomerProfile>();
    const [scrollPosition, setScrollPosition] = useState(0);
    const { contextClientID, contextCustomerID, 
        setGlobalState } = useGlobalContext();
    const [viewIndex, setViewIndex] = useState(0);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const res = await fetch("/api/users/getProfile", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID,
                    }),
                });

                const response = await res.json();
                const user = response.customer_profile[0];
                setUserData(user);
            } catch (error) {
                console.error("Error fetching user data:", error);
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
    return (
        <div className='mainbox user_mainbox_new_design'>
            <header>
                <LeapHeader title={employeeProfileDetails} />
            </header>

            <LeftPannel menuIndex={0} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                userData! ?
                    <div className='container'>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="user_my_profile_mainbox">
                                    <div className="user_my_profile_leftbox">
                                        <div className="user_my_profile_leftbox_sticky">
                                            < UserPersonalDetails />
                                        </div>
                                    </div>
                                    <div className="user_my_profile_rightbox">
                                        <div className="user_employeement_other_detail_tabing user_profile_new_tabbing">
                                            <ul>
                                                <li>
                                                    <a href="#employement_id">
                                                        <div className='' onClick={(e) => { setViewIndex(0) }}>
                                                            <div className={viewIndex == 0 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                                <span>
                                                                    <svg width="18" height="18" x="0" y="0" viewBox="0 0 512 512">
                                                                        <g>
                                                                            <path d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                        </g>
                                                                    </svg>
                                                                </span>
                                                                <span> Employment Details</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#address_id">
                                                        <div className='' onClick={(e) => { setViewIndex(1) }}>
                                                            <div className={viewIndex == 1 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                                <span>
                                                                    <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24">
                                                                        <g>
                                                                            <path fill="#ffffff" fill-rule="evenodd" d="M12 .25A8.75 8.75 0 0 0 3.25 9c0 1.052.379 2.275.915 3.5.544 1.243 1.284 2.563 2.076 3.833 1.585 2.54 3.417 4.937 4.42 6.202a1.704 1.704 0 0 0 2.679 0c1.002-1.265 2.834-3.662 4.419-6.203.792-1.27 1.532-2.59 2.076-3.832.536-1.225.915-2.448.915-3.5A8.75 8.75 0 0 0 12 .25zm0 4a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5z" clip-rule="evenodd" opacity="1" data-original="#000000"></path>
                                                                        </g>
                                                                    </svg>
                                                                </span>
                                                                <span> Address</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#bank_id">
                                                        <div className='' onClick={(e) => { setViewIndex(2) }}>
                                                            <div className={viewIndex == 2 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                                <span>
                                                                    <svg width="20" height="20" x="0" y="0" viewBox="0 0 24 24" >
                                                                        <g>
                                                                            <clipPath id="a">
                                                                                <path d="M0 0h24v24H0z" fill="#ffffff" opacity="1" data-original="#000000"></path></clipPath><g clip-path="url(#a)">
                                                                                <path fill="#ffffff" d="M4 11.5v4c0 .83.67 1.5 1.5 1.5S7 16.33 7 15.5v-4c0-.83-.67-1.5-1.5-1.5S4 10.67 4 11.5zm6 0v4c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5zM3.5 22h16c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-16c-.83 0-1.5.67-1.5 1.5S2.67 22 3.5 22zM16 11.5v4c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5zM10.57 1.49l-7.9 4.16c-.41.21-.67.64-.67 1.1C2 7.44 2.56 8 3.25 8h16.51C20.44 8 21 7.44 21 6.75c0-.46-.26-.89-.67-1.1l-7.9-4.16c-.58-.31-1.28-.31-1.86 0z" opacity="1" data-original="#000000"></path></g>
                                                                        </g>
                                                                    </svg>
                                                                </span>
                                                                <span> Bank Details</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#leave_id">
                                                        <div className='' onClick={(e) => { setViewIndex(3) }}>
                                                            <div className={viewIndex == 3 ? "profile_selected_tab" : "profile_unselected_tab"}>
                                                                <span>
                                                                    <svg width="20" height="20" x="0" y="0" viewBox="0 0 48 48">
                                                                        <g>
                                                                            <rect width="4" height="6" x="11" y="3" rx="2" fill="#ffffff" opacity="1" data-original="#000000"></rect><rect width="4" height="6" x="33" y="3" rx="2" fill="#ffffff" opacity="1" data-original="#000000"></rect><path d="M4 18v23a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V18zm12 20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm11 11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm11 11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zm0-11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2zM44 16v-6a4 4 0 0 0-4-4h-1v1c0 2.206-1.794 4-4 4s-4-1.794-4-4V6H17v1c0 2.206-1.794 4-4 4S9 9.206 9 7V6H8a4 4 0 0 0-4 4v6z" fill="#ffffff" opacity="1" data-original="#000000"></path>
                                                                        </g>
                                                                    </svg>
                                                                </span>
                                                                <span> Leave Details</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="user_employeement_other_detail_tabing_content">
                                            <div className="user_my_employement_details_box">
                                                < UserEmployement />
                                            </div>
                                            <div className="user_my_address_details_box">
                                                < UserAddress />
                                            </div>
                                            <div className="user_my_bank_details_box">
                                                < UserBankDetails />
                                            </div>
                                            <div className="user_my_leave_details_box">
                                                < UserProfileLeaveDetails />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    : <LoadingDialog isLoading={true} />
            } />
            < Footer />
        </div>
    )
}
export default EmployeeProfile
