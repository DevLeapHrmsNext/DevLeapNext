// On boarding a new customer by client, 1st form with basic details

'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import React, { useEffect, useState } from 'react'
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import LoadingDialog from '@/app/components/PageLoader'
import { Client } from '@/app/models/companyModel'
import { ALERTMSG_exceptionString, ALERTMSG_FormExceptionString, clientAdminDashboard, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { pageURL_customerListPage } from '@/app/pro_utils/stringRoutes';
import ShowAlertMessage from '@/app/components/alert';

interface AddCustomerFormInputValues {
    companyName: any,
    companyEmail: any,
    contactDetails: any,
    city: any,
    companyWebsite: any,
    loginEmail: any,
    password: any,
    emp_id_initials: any,
}

const CustomerOnboarding = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [editcustId, setcustId] = useState('0');
    const { contextClientID, contaxtBranchID, contextSelectedCustId, contextRoleID } = useGlobalContext();
    const [sectorArray, setsector] = useState<SectorModel[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSector, setSelectedSector] = useState("");
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(true);


    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const sectorType = await getSector();
            setsector(sectorType);
        };
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

    const [formValues, setFormValues] = useState<AddCustomerFormInputValues>({
        companyName: '',
        companyEmail: '',
        contactDetails: '',
        city: '',
        companyWebsite: '',
        loginEmail: '',
        password: '',
        emp_id_initials: '',
    });


    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }
    const formData = new FormData();

    const [errors, setErrors] = useState<Partial<AddCustomerFormInputValues>>({});

    const validate = () => {
        const newErrors: Partial<AddCustomerFormInputValues> = {};
        if (!formValues.companyName) newErrors.companyName = "required";
        if (!formValues.city) newErrors.city = "required";
        if (!formValues.contactDetails) newErrors.contactDetails = "required";
        if (!formValues.companyEmail) newErrors.companyEmail = "required";
        if (!formValues.companyWebsite) newErrors.companyWebsite = "required";
        if (!formValues.loginEmail) newErrors.loginEmail = "required";
        if (!formValues.password) newErrors.password = "required";
        // if (!formValues.sector_type) newErrors.sector_type = "required";
        if (!formValues.password || formValues.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
        if (!passwordRegex.test(formValues.password)) {
            newErrors.password = "Password must be combination of numbers and characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        formData.append("parent_id", contextClientID);
        formData.append("company_name", formValues.companyName);
        formData.append("company_location", formValues.city);
        formData.append("company_number", formValues.contactDetails);
        formData.append("company_email", formValues.companyEmail);
        formData.append("company_website_url", formValues.companyWebsite);
        formData.append("email_id", formValues.companyWebsite);
        formData.append("password", formValues.companyWebsite);
        formData.append("emp_id", formValues.companyWebsite);
        //formData.append("sector_type", formValues.sector_type);

        try {
            const response = await fetch("/api/client/addClient", {
                method: "POST",
                body: formData,
            });

            console.log(response);
            const res = await response.json()
            if (response.ok && res.status == 1) {
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent("Customer added Successfully");
                setAlertForSuccess(1)
            } else {
                e.preventDefault()
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to add customer.");
                setAlertForSuccess(2)
            }
        } catch (error) {
            e.preventDefault()
            console.log("Error submitting form:", error);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_FormExceptionString);
            setAlertForSuccess(2)
        }
    }
    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={clientAdminDashboard} />
            </header>
            <LeftPannel menuIndex={1} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                <form onSubmit={handleSubmit}>
                    <div className="container">
                        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                            if (alertForSuccess == 1) {
                                router.push(pageURL_customerListPage);
                            }
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}

                        <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                            <div className="row heading25 pt-2" style={{ alignItems: "center" }}>
                                <div className="col-lg-6">
                                    Add <span>Customer</span>
                                </div>
                            </div>&nbsp;
                        </div>
                        <div className="row">
                            <div className="col-lg-12 mb-5">
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="add_form_inner">

                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Company Name<span className='req_text'>*</span> :  </label>
                                                            <input type="text" className="form-control" value={formValues.companyName} name="companyName" onChange={handleInputChange} id="companyName" placeholder="Enter company name" />
                                                            {errors.companyName && <span className="error" style={{ color: "red" }}>{errors.companyName}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Email Address<span className='req_text'>*</span> :</label>
                                                            <input type="text" className="form-control" id="companyEmail" placeholder="Enter email address" value={formValues.companyEmail} name="companyEmail" onChange={handleInputChange} />
                                                            {errors.companyEmail && <span className="error" style={{ color: "red" }}>{errors.companyEmail}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Details<span className='req_text'>*</span> :</label>
                                                            <input type="text" className="form-control" id="contactDetails" placeholder="Enter contact details" value={formValues.contactDetails} name="contactDetails" onChange={handleInputChange} />
                                                            {errors.contactDetails && <span className="error" style={{ color: "red" }}>{errors.contactDetails}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >City<span className='req_text'>*</span> :  </label>
                                                            <input type="text" className="form-control" value={formValues.city} name="city" onChange={handleInputChange} id="city" placeholder="Enter city" />
                                                            {errors.city && <span className="error" style={{ color: "red" }}>{errors.city}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Company Website<span className='req_text'>*</span> :</label>
                                                            <input type="text" className="form-control" id="companyWebsite" placeholder="Enter website url" value={formValues.companyWebsite} name="companyWebsite" onChange={handleInputChange} />
                                                            {errors.companyWebsite && <span className="error" style={{ color: "red" }}>{errors.companyWebsite}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Start Employee ID<span className='req_text'>*</span> :</label>
                                                            <input type="text" className="form-control" id="emp_id_initials" placeholder="LE123" value={formValues.emp_id_initials} name="emp_id_initials" onChange={handleInputChange} />
                                                            {errors.emp_id_initials && <span className="error" style={{ color: "red" }}>{errors.emp_id_initials}</span>}
                                                        </div>


                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Login Email<span className='req_text'>*</span> :</label>
                                                            <input type="text" className="form-control" id="loginEmail" placeholder="le@gmail.com" value={formValues.loginEmail} name="loginEmail" onChange={handleInputChange} />
                                                            {errors.loginEmail && <span className="error" style={{ color: "red" }}>{errors.loginEmail}</span>}
                                                        </div>


                                                    </div>

                                                    <div className="col-lg-4">
                                                        <div className="Form-fields">
                                                            <label htmlFor="password" className="Control-label Control-label--password">Set Password<span className='req_text'>*</span>:</label>
                                                            <a className="info_icon" href="#">
                                                                <img src={staticIconsBaseURL + "/images/info.png"} alt="Information Icon" width={16} height={16} />
                                                                <div className="tooltiptext tooltip-top " >
                                                                    Password must contain combination of character, numbers and symbols.
                                                                </div>
                                                            </a>
                                                            <input
                                                                type="checkbox"
                                                                id="show-password"
                                                                className="show-password"
                                                                checked={isChecked}
                                                                onChange={() => setIsChecked(!isChecked)}

                                                            />
                                                            <label htmlFor="show-password" className="Control-label Control-label--showPassword">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 48 48"
                                                                    width="32"
                                                                    height="32"
                                                                    className="svg-toggle-password"
                                                                    aria-labelledby="toggle-password-title"
                                                                >
                                                                    <title id="toggle-password-title">Hide/Show Password</title>
                                                                    <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
                                                                    <rect x="20.133" y="2.117" height="44" transform="translate(23.536 -8.587) rotate(45)" className="closed-eye" />
                                                                    <rect x="22" y="3.984" width="4" height="44" transform="translate(25.403 -9.36) rotate(45)" style={{ fill: "#fff" }} className="closed-eye" />
                                                                </svg>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="password"
                                                                placeholder=""
                                                                autoComplete="off"
                                                                autoCapitalize="off"
                                                                autoCorrect="off"
                                                                pattern=".{6,}"
                                                                className="ControlInput ControlInput--password"
                                                                value={formValues.password} name="password" onChange={handleInputChange}
                                                            />
                                                            {errors.password && <span className='error' style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}

                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>&nbsp;
                                <div className="row">
                                    <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Submit" className="red_button" onClick={handleSubmit} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            }
            />
            <div>
                <Footer />
            </div>
        </div>
    )
}
export default CustomerOnboarding

async function getSector() {
    let query = supabase
        .from('leap_sector_type')
        .select();
    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}