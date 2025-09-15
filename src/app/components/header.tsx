'use client';
import Head from 'next/head';
import React, { useRef, useState } from 'react'
import { createClient } from '../../../utils/supabase/client';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import useSession from '../pro_utils/sessionmgmt';
import { useRouter } from 'next/navigation';
import { pageURL_clientProfilePage, pageURL_dashboard, pageURL_defaultLogin, pageURL_userEmpDashboard, pageURL_userProfile } from '../pro_utils/stringRoutes';
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';
// import supabase from '../api/supabaseConfig/supabase';

const LeapHeader = ({ title }: any) => {
    const { session, login, logout } = useSession();
    const { contaxtBranchID, contextClientID, contextRoleID,isAdmin,
        contextUserName, contextCustomerID, contextEmployeeID, contextLogoURL, contextProfileImage,
        contextCompanyName, setGlobalState } = useGlobalContext();
    const router = useRouter();
    const [isSearchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchClick = () => {
        setSearchVisible(true);

        // Start the timeout to hide the search bar if no input is entered
        timerRef.current = setTimeout(() => {
            setSearchVisible(false);
        }, 5000); // 5 seconds
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);

        // Reset the timeout if the user starts typing
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (value.trim() === '') {
            timerRef.current = setTimeout(() => {
                setSearchVisible(false);
            }, 5000);
        }
    };
    // const getUserName = async ()
    const handleLogout = async () => {
        setGlobalState({
            contextUserName: '',
            contextClientID: '',
            contaxtBranchID: '',
            contextCustomerID: '',
            contextRoleID: '',
            contextProfileImage: '',
            contextEmployeeID: '',
            contextCompanyName: contextCompanyName,
            contextLogoURL: '',
            contextSelectedCustId: '',
            contextAddFormEmpID: '',
            contextAnnouncementID: '',
            contextAddFormCustID: '',
            dashboard_notify_cust_id: '',
            dashboard_notify_activity_related_id: '',
            selectedClientCustomerID: '',
            isAdmin: '',
            contextPARAM8: '',
        });


        const supabase = createClient();
        await supabase.auth.signOut()
        logout(contextCompanyName);


        console.log("User logged out");
    };

        const handleAdminEmpToggle = async () => {
            if(isAdmin=="1"){
                router.push(pageURL_userEmpDashboard)
            }else{
                router.push(pageURL_dashboard)
            }
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
                selectedClientCustomerID: '',
                isAdmin: isAdmin=="1"?"0":"1",
                contextPARAM8: '',

            });
            
            
        }
    let subTitle = "";
    if (title.toLowerCase() == "dashboard") {
        subTitle = "Welcome To "
    }

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {


        setDropdownVisible((prev) => !prev);
        console.log("drop down visble---------------------------", isDropdownVisible);
    };

    const hideDropdown = () => {
        setDropdownVisible(false);
    };
    function navigateToProfile(goToNumber: number) {
        if (goToNumber == 1) {
            router.push(pageURL_clientProfilePage);
        } else {
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
                selectedClientCustomerID: '',
                isAdmin: isAdmin,
                contextPARAM8: '',

            });
            router.push(pageURL_userProfile)
        }
    }
    function navigateToDashboard() {
        // console.log("navigate dashboard called");
        contextRoleID == "3" || contextRoleID == "2" ?
            router.push(pageURL_dashboard) :
            contextRoleID == "5" || contextRoleID == "9" || contextRoleID == "4" || isAdmin=="0"?
                router.push(pageURL_userEmpDashboard) : router.push(pageURL_defaultLogin)

    }

    return (

        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="grid grid-cols-1 p-0">
                        {/* "/images/dashboard-logo.png" */}
                        <div className="dash_logo"><img src={getImageApiURL + "/uploads/" + contextLogoURL} className="header-logo" style={{ cursor: "pointer" }} onClick={() => { navigateToDashboard() }} /></div>
                        {/* <div className="dash_logo"><img src="/images/dashboard-logo.png" className="img-fluid" /></div> */}
                        <div className="dash_topbox">
                            <div className="welcome_text">
                                {subTitle}<span>{title} {contextUserName}</span>
                                <div style={{ display: "none" }}>{contextLogoURL}</div>
                            </div>
                            {(contextRoleID == "3" || contextRoleID == "2") && isAdmin=="1" ?
                                <div className="dash_topotherbox">
                                    <div className="option">
                                        {!isSearchVisible && (
                                            <a onClick={handleSearchClick} style={{ cursor: 'pointer' }}>
                                                <img src={staticIconsBaseURL + "/images/search_icon.png"} className="img-fluid" alt="Search Icon" />
                                                <div className="option_label">Search</div>
                                            </a>
                                        )}
                                        {isSearchVisible && (
                                            <div className="search-bar-container">
                                                <div className="search-bar">
                                                    <img src={staticIconsBaseURL + "/images/search_icon.png"} className="search-icon" alt="Search Icon" />
                                                    <input
                                                        type="text"
                                                        value={searchText}
                                                        onChange={handleInputChange}
                                                        placeholder="Type to search..."
                                                        className="form-control search-input"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="option">
                                        <a href="#"><img src={staticIconsBaseURL + "/images/notification_icon.png"} className="img-fluid" /><div className="option_label">Notification</div></a>
                                    </div>
                                    <div className="headeroptions-container"
                                        style={{ position: "relative", display: "inline-block" }}
                                        onMouseEnter={() => setDropdownVisible(true)} // Show dropdown on hover
                                        onMouseLeave={() => setDropdownVisible(false)} // Hide dropdown when not hovering
                                    >
                                        <div className="option profile_box" onClick={toggleDropdown} style={{ cursor: "pointer" }}>
                                            <img src={getImageApiURL + "/uploads/" + contextProfileImage} className="img-fluid" style={{ maxHeight: "35px" }} />
                                            <div className="profile_dropdown">
                                                <div onClick={(e) => { navigateToProfile(1) }}>Profile</div>
                                                <div>Setting</div>
                                                <div onClick={handleLogout}>Logout</div>
                                                <div onClick={handleAdminEmpToggle}>{}Switch User</div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                contextRoleID == "5" || contextRoleID == "9" || contextRoleID == "4" || isAdmin=="0" ?
                                    <div className="dash_topotherbox">
                                        <div className="user_dash_top_other_box">
                                            <div className="user_dash_top_notification_box">
                                                {/* <svg width="28" height="28" x="0" y="0" viewBox="0 0 512 512">
                                                    <circle r="256" cx="256" cy="256" fill="#f2f2f2"></circle>
                                                    <g transform="matrix(0.6000000000000001,0,0,0.6000000000000001,102.40000610351558,102.39999999999998)"><path d="m455.7 351.22-29.75-30.31a22.352 22.352 0 0 1-6.45-15.76V213.5c0-73.98-49.39-136.63-116.93-156.73.61-3.04.93-6.15.93-9.27C303.5 21.31 282.19 0 256 0s-47.5 21.31-47.5 47.5c0 3.15.31 6.25.9 9.28C141.88 76.89 92.5 139.53 92.5 213.5v91.65c0 5.93-2.29 11.53-6.45 15.76L56.3 351.22C39.78 368.04 35.18 392 44.31 413.75 53.43 435.49 73.75 449 97.33 449h87.69c4.22 35.43 34.43 63 70.98 63s66.76-27.57 70.98-63h87.69c23.58 0 43.9-13.51 53.02-35.25 9.13-21.75 4.53-45.71-11.99-62.53zM243.5 47.5c0-6.89 5.61-12.5 12.5-12.5s12.5 5.61 12.5 12.5c0 1.08-.14 2.05-.36 2.95-4.01-.29-8.06-.45-12.14-.45s-8.13.16-12.14.45c-.22-.89-.36-1.87-.36-2.95zM256 477c-17.2 0-31.65-11.96-35.49-28h70.98c-3.84 16.04-18.29 28-35.49 28zm179.42-76.79c-1.36 3.24-6.87 13.79-20.75 13.79H97.33c-13.88 0-19.39-10.56-20.75-13.79-1.36-3.24-5.03-14.56 4.69-24.47l29.76-30.31c10.62-10.82 16.47-25.12 16.47-40.28V213.5C127.5 142.65 185.14 85 256 85s128.5 57.65 128.5 128.5v91.65c0 15.16 5.85 29.46 16.47 40.28l29.76 30.31c9.72 9.9 6.05 21.23 4.69 24.47z" fill="#000000" opacity="1" data-original="#000000"></path>
                                                    </g>
                                                </svg>
                                                <div className="notification_dot"></div> */}
                                            </div>
                                            <div className="user_dash_top_profile_box">
                                                <div className="user_dash_top_profile_name_imgbox">
                                                    <div className="user_dash_top_profile_name">
                                                        {contextUserName.split(' ')[0]}
                                                    </div>
                                                    <div className="user_dash_top_profile_img">
                                                        <img src="/images/userpic.png" alt="Profile picture" className="img-fluid" />
                                                    </div>
                                                </div>
                                                <div className="user_dash_top_profile_dropdown">
                                                    <div className="user_dash_top_profile_listing">
                                                        <div className="user_dash_top_profile_icon">
                                                            <svg width="16" height="16" x="0" y="0" viewBox="0 0 512 512">
                                                                <g transform="matrix(0.9600000000000001,0,0,0.9600000000000001,10.240001220703107,10.23999999999998)"><path d="M333.187 237.405c32.761-23.893 54.095-62.561 54.095-106.123C387.282 58.893 328.389 0 256 0S124.718 58.893 124.718 131.282c0 43.562 21.333 82.23 54.095 106.123-81.44 31.165-139.428 110.126-139.428 202.39 0 39.814 32.391 72.205 72.205 72.205h288.82c39.814 0 72.205-32.391 72.205-72.205 0-92.264-57.988-171.225-139.428-202.39zM164.103 131.282c0-50.672 41.225-91.897 91.897-91.897s91.897 41.225 91.897 91.897S306.672 223.18 256 223.18s-91.897-41.226-91.897-91.898zM400.41 472.615H111.59c-18.097 0-32.82-14.723-32.82-32.821 0-97.726 79.504-177.231 177.231-177.231s177.231 79.504 177.231 177.231c-.001 18.098-14.724 32.821-32.822 32.821z" fill="#707070" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="user_dash_top_profile_logout" onClick={(e) => { navigateToProfile(2) }}>
                                                            My Profile
                                                        </div>
                                                    </div>
                                                    <div className="user_dash_top_profile_listing">
                                                        <div className="user_dash_top_profile_icon">
                                                            <svg width="16" height="16" x="0" y="0" viewBox="0 0 24 24">
                                                                <g transform="matrix(1.17,0,0,1.17,-2.0397450995445237,-2.0399100208282466)">
                                                                    <path fill="#707070" fill-rule="evenodd" d="M12 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zM8.866 5.57A1 1 0 0 1 8.5 6.936a7 7 0 1 0 6.999 0 1 1 0 0 1 1-1.731 9 9 0 1 1-9.001 0 1 1 0 0 1 1.367.365z" clip-rule="evenodd" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="user_dash_top_profile_logout" onClick={handleLogout}>
                                                            Logout
                                                        </div>
                                                    </div>
                                                    {contextRoleID=="2" && isAdmin=="0" &&
                                                    <div className="user_dash_top_profile_listing">
                                                        <div className="user_dash_top_profile_icon">
                                                            <svg width="16" height="16" x="0" y="0" viewBox="0 0 24 24">
                                                                <g transform="matrix(1.17,0,0,1.17,-2.0397450995445237,-2.0399100208282466)">
                                                                    <path fill="#707070" fill-rule="evenodd" d="M12 2a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zM8.866 5.57A1 1 0 0 1 8.5 6.936a7 7 0 1 0 6.999 0 1 1 0 0 1 1-1.731 9 9 0 1 1-9.001 0 1 1 0 0 1 1.367.365z" clip-rule="evenodd" opacity="1" data-original="#000000"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className="user_dash_top_profile_logout" onClick={handleAdminEmpToggle}>
                                                            Switch Admin
                                                        </div>
                                                    </div>


                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div> : <>
                                        <div className="dash_topotherbox">
                                            <div className="user_dash_top_other_box">


                                            </div>
                                        </div>
                                    </>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LeapHeader