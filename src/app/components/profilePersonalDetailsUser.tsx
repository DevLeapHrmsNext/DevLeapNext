/////////////// Ritika code change 

'use client'

import React, { useEffect, useState } from 'react'
import { CustomerProfile, ProfileModel } from '../models/userEmployeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import moment from 'moment';
import { staticIconsBaseURL } from '../pro_utils/stringConstants';

export const UserPersonalDetails = () => {
    const [userData, setUserData] = useState<CustomerProfile>();
    const { contextClientID, contextCustomerID } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/users/getProfile", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID
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
    }, []);

    return (
        <>
            <div className=''></div>
            <div className="user_my_profile_photobox">
                <div className="user_my_profile_employee_id">
                    {userData?.emp_id}
                </div>
                <div className="user_my_profile_img">
                    <img src={staticIconsBaseURL +"/images/user/profile-image.jpg"} className="img-fluid" />
                </div>
            </div>
            <div className="user_my_profile_namebox">
                <div className="user_my_profile_name">
                    {userData?.name}
                </div>
                <div className="user_my_profile_designation">
                    {userData?.designation_id.designation_name || ""}
                </div>
            </div>
            <div className="user_my_profile_detilbox">
                <div className="user_my_profile_detilbox_listing">
                    <div className="user_my_profile_detailbox_iconbox">
                        <img src={staticIconsBaseURL +"/images/user/personal-email.svg"} alt="Personal email icon" className="img-fluid" />
                    </div>
                    {/* <div className="user_my_profile_detail_lable">Personal Email</div> */}
                    <div className="user_my_profile_detail_content">{userData?.personalEmail || ""}</div>
                </div>
                <div className="user_my_profile_detilbox_listing">
                    <div className="user_my_profile_detailbox_iconbox my_profile_blue">
                        <img src={staticIconsBaseURL +"/images/user/contact-number.svg"} alt="Contact number icon" className="img-fluid" />
                    </div>
                    {/* <div className="user_my_profile_detail_lable">Contact Number</div> */}
                    <div className="user_my_profile_detail_content">{userData?.contact_number || ""}</div>
                </div>
                <div className="user_my_profile_detilbox_listing">
                    <div className="user_my_profile_detailbox_iconbox my_profile_yellow">
                        <img src={staticIconsBaseURL +"/images/user/date-of-birth.svg"} alt="Date icon" className="img-fluid" />
                    </div>
                    {/* <div className="user_my_profile_detail_lable">Date of Birth</div> */}
                    <div className="user_my_profile_detail_content">{moment(userData?.dob).format('DD-MM-YYYY') || ""}</div>
                </div>
                <div className="user_my_profile_detilbox_listing">
                    <div className="user_my_profile_detailbox_iconbox my_profile_blue">
                        <img src={staticIconsBaseURL +"/images/user/nationality.svg"} alt="Nationality icon" className="img-fluid" />
                    </div>
                    <div className="user_my_profile_detail_content">{userData?.nationality || ""}</div>
                </div>
                <div className="user_my_profile_detilbox_listing">
                    <div className="user_my_profile_detailbox_iconbox">
                        <img src={staticIconsBaseURL +"/images/user/blood-group.svg"} alt="Blood group icon" className="img-fluid" />
                    </div>
                    <div className="user_my_profile_detail_content">{userData?.blood_group || ""}</div>
                </div>
            </div>
        </>
    )
}