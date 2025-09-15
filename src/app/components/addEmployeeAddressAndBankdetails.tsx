'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import { addEmpEmployementFormTitle } from '@/app/pro_utils/stringConstants';
import { Form } from 'multiparty';
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { error } from 'console';
import validator from 'validator';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { useRouter } from 'next/navigation';
import { pageURL_addUserEmploymentForm, pageURL_dashboard, leftMenuAddEmployeePageNumbers, pageURL_userEmpDashboard, pageURL_userList } from '@/app/pro_utils/stringRoutes';


interface address {
    current: addressFormValues,
    permanent: addressFormValues
}
interface addressFormValues {
    currentAddressLineOne: string,
    currentAddressLineTwo: string,
    currentCity: string,
    currentState: string,
    currentPostalCode: string,
    currentCountry: string,
    latlng: string,
}

interface bankFormValues {
    bankAccountNumber: string,
    bankName: string,
    branchName: string,
    ifscCode: string,
    panNumber: string,
    tinNumber: string,
    uAN: string,
    esicNumber: string,
    socialSecurityNumber: string,

}
interface EmergencyContactData {
    emergencyContactName: string,
    emergencyContactNumber: string,
    emergencyContactRelationID: string,
}

const Component_AddEmpAddressBankDetails = ({ isSubmitClicked }: { isSubmitClicked: () => void }) => {
    const [emergencyContactRelation, setEmergencyRelation] = useState<LeapRelationComponents[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isMoreLoading, setIsMoreLoading] = useState(true);
    const { contextClientID, contaxtBranchID, contextAddFormEmpID, contextRoleID, contextAddFormCustID } = useGlobalContext();
    const router = useRouter()
    useEffect(() => {
        // if(contextAddFormEmpID.length==0 || contextAddFormCustID.length==0 ){
        //         router.push(pageURL_userList);
        //     }
        // const state = window.history.state;
        // console.log(state?.addEmpCustidEmpId.customer_id);
        const fetchData = async () => {
            const relations = await getRelations();
            setEmergencyRelation(relations);


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
        // console.log(designations);
    }, []);
    const [addressFormValues, setFormData] = useState<address>({
        current: {
            currentAddressLineOne: "",
            currentAddressLineTwo: "",
            currentCity: "",
            currentState: "",
            currentPostalCode: "",
            currentCountry: "",
            latlng: "",
        },
        permanent: {
            currentAddressLineOne: "",
            currentAddressLineTwo: "",
            currentCity: "",
            currentState: "",
            currentPostalCode: "",
            currentCountry: "",
            latlng: "",
        },
    });
    const [bankFormValues, setBankValues] = useState<bankFormValues[]>([{
        bankAccountNumber: "",
        bankName: "",
        branchName: "",
        ifscCode: "",
        panNumber: "",
        tinNumber: "",
        uAN: "",
        esicNumber: "",
        socialSecurityNumber: "",

    }]);

    const [emergencyContactData, setEmergencyContactData] = useState<EmergencyContactData[]>([{
        emergencyContactName: "",
        emergencyContactNumber: "",
        emergencyContactRelationID: "",
    }])

    const [addressErrors, setAddressErrors] = useState<Partial<addressFormValues>>({});
    const [bankErrors, setBankErrors] = useState<Partial<bankFormValues>>({});
    const [emergencyContactError, setEmergencyContactError] = useState<Partial<EmergencyContactData>>({});


    const validateAddress = () => {
        const addressDetailsErrors: Partial<addressFormValues> = {};

        if (!addressFormValues.current.currentAddressLineOne) addressDetailsErrors.currentAddressLineOne = "Address Line 1 is required";
        if (!addressFormValues.current.currentAddressLineTwo) addressDetailsErrors.currentAddressLineTwo = "Address Line 2 is required";
        if (!addressFormValues.current.currentCity) addressDetailsErrors.currentCity = "City is required";
        if (!addressFormValues.current.currentState) addressDetailsErrors.currentState = "State is required";
        if (!addressFormValues.current.currentPostalCode) addressDetailsErrors.currentPostalCode = "Postal Code is required";
        if (!addressFormValues.current.currentCountry) addressDetailsErrors.currentCountry = "Country is required";

        if (!addressFormValues.permanent.currentAddressLineOne) addressDetailsErrors.currentAddressLineOne = "Address Line 1 is required";
        if (!addressFormValues.permanent.currentAddressLineTwo) addressDetailsErrors.currentAddressLineTwo = "Address Line 2 is required";
        if (!addressFormValues.permanent.currentCity) addressDetailsErrors.currentCity = "City is required";
        if (!addressFormValues.permanent.currentState) addressDetailsErrors.currentState = "State is required";
        if (!addressFormValues.permanent.currentPostalCode) addressDetailsErrors.currentPostalCode = "Postal Code is required";
        if (!addressFormValues.permanent.currentCountry) addressDetailsErrors.currentCountry = "Country is required";


        setAddressErrors(addressDetailsErrors);

        return Object.keys(addressDetailsErrors).length === 0;
    };
    const validateBankDetails = () => {
        const bankdetailsErrors: Partial<bankFormValues> = {};
        const emergencydetailsErrors: Partial<EmergencyContactData> = {};

        if (!bankFormValues[0].bankAccountNumber) bankdetailsErrors.bankAccountNumber = "Bank Account Number is required";
        if (!bankFormValues[0].bankName) bankdetailsErrors.bankName = "Bank Name is required";
        if (!bankFormValues[0].branchName) bankdetailsErrors.branchName = "Branch Name is required";
        if (!bankFormValues[0].ifscCode) bankdetailsErrors.ifscCode = "IFSC Code is required";
        if (!bankFormValues[0].panNumber) bankdetailsErrors.panNumber = "PAN number is required";
        if (!bankFormValues[0].tinNumber) bankdetailsErrors.tinNumber = "Tax Insurance Number is required";
        if (!bankFormValues[0].uAN) bankdetailsErrors.uAN = "UAN Number is required";
        if (!bankFormValues[0].esicNumber) bankdetailsErrors.esicNumber = "ESIC Number is required";
        if (!bankFormValues[0].socialSecurityNumber) bankdetailsErrors.socialSecurityNumber = "Social Security Number is required";

        if (!emergencyContactData[0].emergencyContactName) emergencydetailsErrors.emergencyContactName = "Emergency contact name is required";
        if (!emergencyContactData[0].emergencyContactNumber) emergencydetailsErrors.emergencyContactNumber = "Emergency contact number is required";
        if (!emergencyContactData[0].emergencyContactRelationID) emergencydetailsErrors.emergencyContactRelationID = "Emergency contact relation is required";

        if (!validator.isMobilePhone(emergencyContactData[0].emergencyContactNumber)) {
            emergencydetailsErrors.emergencyContactNumber = "Enter a valid phone number";
        }

        setBankErrors(bankdetailsErrors);
        setEmergencyContactError(emergencydetailsErrors);
        return Object.keys(bankdetailsErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof address
    ) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section], // Assert section type
                [name as keyof addressFormValues]: value, // Assert name type
            },
        }));
    };
    const handleBankDataChange = (e: any) => {
        const { name, value, type, } = e.target;

        setBankValues((prev) => ({ ...prev, [name]: value }));

    };
    const formData = new FormData();
    const handleSubmit = async (e: React.FormEvent) => {
        isSubmitClicked()
        e.preventDefault();
        if (validateAddress()) {
            return;
        }

        if (!validateBankDetails()) return;

        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("customer_id", contextAddFormCustID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("bank_name", bankFormValues[0].bankName);
        formData.append("account_number", bankFormValues[0].bankAccountNumber);
        formData.append("PAN_number", bankFormValues[0].panNumber);
        formData.append("IFSC_code", bankFormValues[0].ifscCode);
        formData.append("UAN_number", bankFormValues[0].uAN);
        formData.append("ESIC_number", bankFormValues[0].esicNumber);
        formData.append("TIN_number", bankFormValues[0].tinNumber);
        formData.append("address", JSON.stringify(addressFormValues));
        formData.append("emergency_contact_name", emergencyContactData[0].emergencyContactName);
        formData.append("emergency_contact_number", emergencyContactData[0].emergencyContactNumber);
        formData.append("emergency_contact_relation_id", emergencyContactData[0].emergencyContactRelationID);


        try {
            const response = await fetch("/api/clientAdmin/addEmployee/addEmpAddressAndBankDetails", {
                method: "POST",
                body: formData,

            });
            console.log(response);


            if (response.ok) {
                const res = await response.json();
                console.log(res);

                alert("Form submitted successfully!");
                if (contextRoleID == "2") {
                    router.push(pageURL_addUserEmploymentForm);
                } else {
                    router.push(pageURL_userEmpDashboard);
                }
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form.");
        }
    }
    const addEmergencyContactUI = () => {
        const currentDataArray: EmergencyContactData[] = emergencyContactData;
        currentDataArray.push({
            emergencyContactName: '',
            emergencyContactNumber: '',
            emergencyContactRelationID: ''
        })
        setEmergencyContactData(currentDataArray);
        setIsMoreLoading(false)
    }
    
    const addBankDetailsContactUI = () => {

        const bankDataArray: bankFormValues[] = bankFormValues;
        bankDataArray.push({
            bankAccountNumber: "",
            bankName: "",
            branchName: "",
            ifscCode: "",
            panNumber: "",
            tinNumber: "",
            uAN: "",
            esicNumber: "",
            socialSecurityNumber: "",
        })
        setBankValues(bankDataArray);
        console.log("===========================",bankFormValues.length);
        setIsMoreLoading(false);
        
    }
    const removeBankDetailsUI = (index:any) => {

        const bankDataArray: bankFormValues[] = bankFormValues;
        bankDataArray.push({
            bankAccountNumber: "",
            bankName: "",
            branchName: "",
            ifscCode: "",
            panNumber: "",
            tinNumber: "",
            uAN: "",
            esicNumber: "",
            socialSecurityNumber: "",
        })
        setBankValues(bankDataArray);
        console.log("===========================",bankFormValues.length);
        setIsMoreLoading(false)
        
    }

    const sameAddress = () => {
        console.log("same address called");

        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["currentAddressLineOne"]: addressFormValues.current.currentAddressLineOne
            }
        }));
        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["currentAddressLineTwo"]: addressFormValues.current.currentAddressLineTwo
            }
        }));
        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["currentCity"]: addressFormValues.current.currentCity
            }
        }));
        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["currentState"]: addressFormValues.current.currentState
            }
        }));
        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["currentPostalCode"]: addressFormValues.current.currentPostalCode
            }
        }));
        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["currentCountry"]: addressFormValues.current.currentCountry
            }
        }));
        setFormData((prevData) => ({
            ...prevData,
            ["permanent"]: {
                ...prevData["permanent"], ["latlng"]: addressFormValues.current.latlng
            }
        }));
    }

    return (
        <div className='mainbox'>
            <form onSubmit={handleSubmit}>
                <div className='container'>
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="heading25">Address <span>Details</span></div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-6 mb-3'>
                            <div className='grey_box'>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='add-form-inner'>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-4">
                                                            <div className="inner_heading25">Current Address</div>
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 1: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.current.currentAddressLineOne} name="currentAddressLineOne" onChange={(e) => handleInputChange(e, "current")} id="currentAddressLineOne" placeholder="Flat, House no., Building, Apartment" />
                                                                {addressErrors.currentAddressLineOne && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineOne}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 2:  </label>
                                                                <input type="text" className="form-control" value={addressFormValues.current.currentAddressLineTwo} name="currentAddressLineTwo" onChange={(e) => handleInputChange(e, "current")} id="currentAddressLineTwo" placeholder="Area, Sector, Street, Village" />
                                                                {addressErrors.currentAddressLineTwo && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineTwo}</span>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >City: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.current.currentCity} name="currentCity" onChange={(e) => handleInputChange(e, "current")} id="currentCity" placeholder="City" />
                                                                {addressErrors.currentCity && <span className='error' style={{ color: "red" }}>{addressErrors.currentCity}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >State:  </label>
                                                                <input type="text" className="form-control" value={addressFormValues.current.currentState} name="currentState" onChange={(e) => handleInputChange(e, "current")} id="currentState" placeholder="State" />
                                                                {addressErrors.currentState && <span className='error' style={{ color: "red" }}>{addressErrors.currentState}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Postal Code:</label>
                                                                <input type="text" className="form-control" value={addressFormValues.current.currentPostalCode} name="currentPostalCode" onChange={(e) => handleInputChange(e, "current")} id="currentPostalCode" placeholder="Pincode" />
                                                                {addressErrors.currentPostalCode && <span className='error' style={{ color: "red" }}>{addressErrors.currentPostalCode}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Country: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.current.currentCountry} name="currentCountry" onChange={(e) => handleInputChange(e, "current")} id="currentCountry" placeholder="Country" />
                                                                {addressErrors.currentCountry && <span className='error' style={{ color: "red" }}>{addressErrors.currentCountry}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-6 mb-4'>
                            <div className='grey_box'>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='add-form-inner'>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-4">
                                                            <div className="new_permenet_add_mainbox">
                                                                <div className="inner_heading25">Permanant Address</div>
                                                                {/* <div className="new_permenent_buttonbox">
                                                                        <button className='red_btn' onClick={sameAddress}>Same Address</button>
                                                                    </div> */}
                                                                <div className='sameadd_box'>
                                                                    <input type="checkbox" id='sameadd' name='sameadd' />
                                                                    <label htmlFor='sameadd' onClick={sameAddress}>Copy Current Address</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-md-6">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 1: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.permanent.currentAddressLineOne} name="currentAddressLineOne" onChange={(e) => handleInputChange(e, "permanent")} id="currentAddressLineOne" placeholder="Flat, House no., Building, Apartment" />
                                                                {addressErrors.currentAddressLineOne && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineOne}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 2: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.permanent.currentAddressLineTwo} name="currentAddressLineTwo" onChange={(e) => handleInputChange(e, "permanent")} id="currentAddressLineTwo" placeholder="Area, Sector, Street, Village" />
                                                                {addressErrors.currentAddressLineTwo && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineTwo}</span>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >City: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.permanent.currentCity} name="currentCity" onChange={(e) => handleInputChange(e, "permanent")} id="currentCity" placeholder="City" />
                                                                {addressErrors.currentCity && <span className='error' style={{ color: "red" }}>{addressErrors.currentCity}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >State: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.permanent.currentState} name="currentState" onChange={(e) => handleInputChange(e, "permanent")} id="currentState" placeholder="State" />
                                                                {addressErrors.currentState && <span className='error' style={{ color: "red" }}>{addressErrors.currentState}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Postal Code: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.permanent.currentPostalCode} name="currentPostalCode" onChange={(e) => handleInputChange(e, "permanent")} id="currentPostalCode" placeholder="Pincode" />
                                                                {addressErrors.currentPostalCode && <span className='error' style={{ color: "red" }}>{addressErrors.currentPostalCode}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form_box mb-3">
                                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Country: </label>
                                                                <input type="text" className="form-control" value={addressFormValues.permanent.currentCountry} name="currentCountry" onChange={(e) => handleInputChange(e, "permanent")} id="currentCountry" placeholder="Country" />
                                                                {addressErrors.currentCountry && <span className='error' style={{ color: "red" }}>{addressErrors.currentCountry}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency contact Details */}
                    <div className="row formTitlebottomBorder mb-3">
                        <div className="col-lg-11 ">
                            <div className="Font25noBorder">Emergency Contact <span>Details</span></div>


                        </div>
                        <div className="col-lg-1" ><div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => {setIsMoreLoading(true);addEmergencyContactUI()}}><span>Add More</span></div></div>
                    </div>
                    {emergencyContactData.map((ContactData, index) =>
                        <div className='row' key={index}>
                            
                            <div className='col-lg-12 mb-4'>
                                <div className='grey_box'>
                                {index>0 && <div className='row mb-2'>
                                        <div className='col-lg-12'>
                                        <div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => {setIsMoreLoading(true);emergencyContactData.pop()}}><span>Remove</span></div>

                                        </div></div>}
                                    <div className='row'>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Name: </label>
                                                <input type="text" className="form-control" value={ContactData.emergencyContactName} name="emergencyContactName" onChange={handleBankDataChange} id="emergencyContactName" placeholder="Name" />
                                                {emergencyContactError.emergencyContactName && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactName}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Number: </label>
                                                <input type="text" className="form-control" onKeyDown={(e) => {
                                                    if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                        e.preventDefault();
                                                    }
                                                }} value={ContactData.emergencyContactNumber} name="emergencyContactNumber" onChange={handleBankDataChange} id="emergencyContactNumber" placeholder="Mobile Number" />
                                                {emergencyContactError.emergencyContactNumber && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactNumber}</span>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form_box mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label" >Relation: </label>
                                                <select id="emergencyContactRelationID" name="emergencyContactRelationID" value={ContactData.emergencyContactRelationID} onChange={handleBankDataChange}>
                                                    <option value="">--</option>
                                                    {emergencyContactRelation.map((sal, index) => (
                                                        <option value={sal.id} key={sal.id}>{sal.relation_type}</option>
                                                    ))}
                                                </select>
                                                {emergencyContactError.emergencyContactRelationID && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactRelationID}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    { }
                                </div>
                            </div>
                        </div>

                    )}
                    {/* Bank Details */}
                    <div className="row formTitlebottomBorder mb-3">
                        <div className="col-lg-11">
                            <div className="Font25noBorder">Bank Account <span>Details</span></div>
                        </div>
                        <div className="col-lg-1" ><div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => {setIsMoreLoading(true);addBankDetailsContactUI()}}><span>Add More</span></div></div>

                    </div>
                    {bankFormValues.map((bankForm, index) =>
                        <div className='row' key={index}>
                            <div className='col-lg-12 mb-3'>
                                <div className='grey_box'>
                                    {index > 0 && <div className='row mb-2'>
                                        <div className='col-lg-12 text-right'>
                                        <div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => {setIsMoreLoading(true);bankFormValues.pop()}}><span>Remove</span></div>

                                        </div></div>}
                                    <div className='row'>
                                        <div className='col-lg-12'>
                                            <div className='add-form-inner'>

                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Bank Account Number: </label>
                                                            <input type="text" className="form-control" value={bankForm.bankAccountNumber} name="bankAccountNumber" onChange={handleBankDataChange} id="bankAccountNumber" placeholder="Account Number" />
                                                            {bankErrors.bankAccountNumber && <span className='error' style={{ color: "red" }}>{bankErrors.bankAccountNumber}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Bank Name: </label>
                                                            <input type="text" className="form-control" value={bankForm.bankName} name="bankName" onChange={handleBankDataChange} id="bankName" placeholder="Bank Name" />
                                                            {bankErrors.bankName && <span className='error' style={{ color: "red" }}>{bankErrors.bankName}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Branch Name: </label>
                                                            <input type="text" className="form-control" value={bankForm.branchName} name="branchName" onChange={handleBankDataChange} id="branchName" placeholder="Branch Name" />
                                                            {bankErrors.branchName && <span className='error' style={{ color: "red" }}>{bankErrors.branchName}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >IFSC code: </label>
                                                            <input type="text" className="form-control" value={bankForm.ifscCode} name="ifscCode" onChange={handleBankDataChange} id="ifscCode" placeholder="IFSC Code" />
                                                            {bankErrors.ifscCode && <span className='error' style={{ color: "red" }}>{bankErrors.ifscCode}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >PAN number: </label>
                                                            <input type="text" className="form-control" value={bankForm.panNumber} name="panNumber" onChange={handleBankDataChange} id="panNumber" placeholder="PAN number" />
                                                            {bankErrors.panNumber && <span className='error' style={{ color: "red" }}>{bankErrors.panNumber}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >TAX Insurance Number:</label>
                                                            <input type="text" pattern="[0-9]*" className="form-control" value={bankForm.tinNumber} name="tinNumber" onChange={handleBankDataChange} id="tinNumber" placeholder="TAX number" />
                                                            {bankErrors.tinNumber && <span className='error' style={{ color: "red" }}>{bankErrors.tinNumber}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >UAN number: </label>
                                                            <input type="text" pattern="[0-9]*" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} className="form-control" value={bankForm.uAN} name="uAN" onChange={handleBankDataChange} id="uAN" placeholder="UAN number" />
                                                            {bankErrors.uAN && <span className='error' style={{ color: "red" }}>{bankErrors.uAN}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >ESIC number: </label>
                                                            <input type="text" pattern="[0-9]*" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} className="form-control" value={bankForm.esicNumber} name="esicNumber" onChange={handleBankDataChange} id="esicNumber" placeholder="ESIC number" />
                                                            {bankErrors.esicNumber && <span className='error' style={{ color: "red" }}>{bankErrors.esicNumber}</span>}

                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Social Security Number: </label>
                                                            <input type="text" className="form-control" value={bankForm.socialSecurityNumber} name="socialSecurityNumber" onChange={handleBankDataChange} id="socialSecurityNumber" placeholder="Social Security number" />
                                                            {bankErrors.socialSecurityNumber && <span className='error' style={{ color: "red" }}>{bankErrors.socialSecurityNumber}</span>}
                                                        </div>
                                                    </div>
                                                </div>



                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}


                </div>
                
                <div className="row">
                    <div className="col-lg-12" style={{ textAlign: "right" }}><input type="submit" value="Next" className="red_button" /></div>

                </div>
            </form>


        </div>
    )
}
export default Component_AddEmpAddressBankDetails


async function getRelations() {

    let query = supabase
        .from('leap_relations')
        .select();

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {


        return data;
    }
}