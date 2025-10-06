
////////////// ritika code merge 
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Address, AddressModel, CustomerAddress, EmergencyContact, LeapRelations } from '../models/userEmployeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

export const UserAddress = () => {
    // const [userData, setUserData] = useState<Address>();
    const router = useRouter();
    const { contextClientID, contextRoleID, contextCustomerID } = useGlobalContext();
    const [isLoading, setLoading] = useState(false)
    const [currentAdd, setcurrent] = useState<CustomerAddress>();
    const [permenantAdd, setpermenant] = useState<CustomerAddress>();
    const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>()

    useEffect(() => {
        const fetchData = async () => {

            try {

                const res = await fetch("/api/users/getProfile/getEmployeeAddress", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID
                    }),
                });

                const response = await res.json();

                const user = response.data;
                for (let i = 0; i < user.customerAddress.length; i++) {
                    console.log("Inside for loop", user.customerAddress[i].address_type);

                    if (response.data.customerAddress[i].address_type == "current") {
                        console.log("Inside if condition ", user.customerAddress[i]);

                        setcurrent(response.data.customerAddress[i]);
                    } else {
                        console.log("Inside else condition ", user.customerAddress[i]);
                        setpermenant(response.data.customerAddress[i]);
                    }
                }
                // setUserData(user);
                setEmergencyContact(user.emergencyContact[0])
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);



    return (
        <>
            <div className="container" id='address_id'>
                <div className="row">
                    <div className="col-lg-12">
                        {/* Current Address Details start  */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Current Address Details</div>
                            <div className="d_user_profile_details_listing_box">
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 1</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.address_line1 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 2</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.address_line2 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">City</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.city || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">State</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.state || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Postal code</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.postal_code || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Country</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.country || "--"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Current Address Details ends */}
                        {/* Permanent Address Details start */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Permanent Address Details</div>
                            <div className="d_user_profile_details_listing_box">
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 1</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.address_line1 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 2</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.address_line2 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">City</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.city || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">State</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.state || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Postal code</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.postal_code || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Country</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.country || "--"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Permanent Address Details ends */}
                        {/* Emergency Contact details start */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Emergency Contact details</div>
                            <div className="d_user_profile_details_listing_box">
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Emergency contact</div>
                                    <div className="d_user_profile_details_content">{emergencyContact?.emergency_contact || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Contact person name</div>
                                    <div className="d_user_profile_details_content">{emergencyContact?.contact_name || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Relation</div>
                                    <div className="d_user_profile_details_content">{emergencyContact?.relation?.relation_type || "--"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Emergency Contact details ends */}
                    </div>
                </div>
            </div>


        </>
    )
}