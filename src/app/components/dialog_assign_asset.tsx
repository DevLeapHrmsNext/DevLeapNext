

/////// swapnil design code changes on 16th april 2025


'use client'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import { employeeResponse } from '@/app/models/clientAdminEmployee'
import { addAssetTitle, staticIconsBaseURL } from '@/app/pro_utils/stringConstants'
import supabase from '@/app/api/supabaseConfig/supabase'
import { useParams, useRouter } from 'next/navigation';
import { CustomerProfile } from '@/app/models/employeeDetailsModel'
import { AssetList, AssetType } from '@/app/models/AssetModel'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import { leftMenuAssetsPageNumbers } from '@/app/pro_utils/stringRoutes'
import BackButton from '@/app/components/BackButton'
import LoadingDialog from './PageLoader'
import Select from "react-select";
import ShowAlertMessage from './alert'
import { set } from 'date-fns'



interface AssetForm {
    client_id: string,
    branchID: string,
    givenDate: string,
    customerID: string,
    assetID: string,
    remark: string,
    picture: File | null,
    pictureUrl: string,
}

const DialogAssignAsset = ({ asset_id, onClose }: { asset_id: any, onClose: () => void }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const router = useRouter()

    const [assetArray, setAsset] = useState<AssetList[]>([]);
    const [assetTypeArray, setAssetType] = useState<AssetType[]>([]);

    const [deptArray, setDept] = useState<DepartmentTableModel[]>([]);
    const { contaxtBranchID, contextClientID, contextCustomerID } = useGlobalContext();
    const [selectedAssetType, setSelectedAssetType] = useState<string>("");
    const [employeeName, setEmployeeNames] = useState([{ value: '', label: '' }]);

    const handleAssetTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedAssetType(value);
        const getAssets = await getAsset(value);
        setAsset(getAssets);
    };

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


            const assetType = await getAssetType();
            setAssetType(assetType);
            const empData = await getEmployee(contextClientID);
            let name: any[] = []
            for (let i = 0; i < empData.length; i++) {

                name.push({
                    value: empData[i].customer_id,
                    label: empData[i].emp_id + "  " + empData[i].name,
                })
            }
            setEmployeeNames(name);
            const dept = await getDepartment();
            setDept(dept);
            const getAssets = await getAsset(asset_id);
            setAsset(getAssets);
            setSelectedAssetType(getAssets[0].asset_type)
            setFormValues((prev) => ({ ...prev, ["assetID"]: getAssets[0].asset_id }));
            setLoading(false);

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

    const [formValues, setFormValues] = useState<AssetForm>({
        client_id: "",
        branchID: "",
        givenDate: "",
        customerID: "",
        assetID: "",
        remark: "",
        picture: null,
        pictureUrl: "",
    });

    const handleInputChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        // console.log("Form values updated:", formValues);
        if (type === "file") {
            setFormValues((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
        console.log(formValues);


    }

    const formData = new FormData();
    const [errors, setErrors] = useState<Partial<AssetForm>>({});

    const validate = () => {
        const newErrors: Partial<AssetForm> = {};
        if (!formValues.givenDate) newErrors.givenDate = "required";
        if (!formValues.customerID) newErrors.customerID = "required";
        if (!formValues.assetID) newErrors.assetID = "required";
        if (!formValues.remark) newErrors.remark = "required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleEmpSelectChange = async (values: any) => {

        setFormValues((prev) => ({ ...prev, ["customerID"]: values.value }));

    };

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        console.log("handle submit called");
        let pictureURL = "";
        if (formValues.picture) {
            pictureURL == await fileUpload();
        }

        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("asset_id", formValues.assetID);
        formData.append("customer_id", formValues.customerID);
        formData.append("date_given", formValues.givenDate);
        formData.append("remark", formValues.remark);
        formData.append("asset_pic", pictureURL);

        try {
            const response = await fetch("/api/client/asset/assignAsset", {
                method: "POST",
                body: formData,

            });
            // console.log(response);
            const responseData = await response.json();
            if (response.ok) {
                setLoading(false);
                onClose()
            } else {
                setLoading(false);
                // alert("Failed to submit form.");
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(responseData.message);
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            console.log("Error submitting form:", error);
            // alert("An error occurred while submitting the form.");
            setShowAlert(true);
                setAlertTitle("Exception")
                setAlertStartContent("An error occurred while submitting the form.");
                setAlertForSuccess(3)
        }

    }

    const fileUpload = async () => {

        let file: any;


        file = formValues.picture;


        try {

            // file url name            
            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", contextCustomerID);
            formData.append("docType", "assets");
            formData.append("docName", "asset_pictures");
            formData.append("file", file);

            const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments", {
                method: "POST",
                // headers:{"Content-Type":"multipart/form-data"},
                body: formData,
            });

            const fileUploadResponse = await fileUploadURL.json();
            console.log(fileUploadResponse);
            setFormValues((prev) => ({ ...prev, ["pictureUrl"]: fileUploadResponse.data }));

            return fileUploadResponse.data;

        } catch (error) {
            console.log(error);
            return "";
        }
    }

    return (
        <div>
            <div>
                <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : ""} value1={""} value2={""} onOkClicked={function (): void {
                setShowAlert(false)
                if (alertForSuccess == 1) {
                    onClose();
                }

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <div className='rightpoup_close' onClick={onClose}>
                                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                            </div>
                            <div className="row">
                                <div className="col-lg-12 mb-3 inner_heading25">
                                    Assign Asset
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="add_form_inner">

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Employee<span className='req_text'>*</span> :</label>
                                                    <Select
                                                        className="custom-select"
                                                        classNamePrefix="custom"
                                                        options={employeeName}
                                                        onChange={(selectedOption) =>
                                                            handleEmpSelectChange(selectedOption)
                                                        }
                                                        placeholder="Search Employee"
                                                        isSearchable
                                                    />
                                                    {errors.customerID && <span className="error" style={{ color: "red" }}>{errors.customerID}</span>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Asset Type<span className='req_text'>*</span> :</label>
                                                    <select id="assetTypeID" name="assetTypeID" value={selectedAssetType} onChange={handleAssetTypeChange}>
                                                        <option value="">Select</option>
                                                        {assetTypeArray.map((type, index) => (
                                                            <option value={type.id} key={type.id}>{type.asset_type}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Asset<span className='req_text'>*</span> :</label>
                                                    <select id="assetID" name="assetID" value={formValues.assetID} onChange={handleInputChange}>
                                                        <option value="">Select</option>
                                                        {assetArray.length > 0 ? (
                                                            assetArray.map((type) => (
                                                                <option value={type.asset_id} key={type.asset_id}>{type.asset_name}</option>
                                                            ))
                                                        ) : (
                                                            <option value="" disabled>No Asset Available</option>
                                                        )}
                                                    </select>
                                                    {errors.assetID && <span className="error" style={{ color: "red" }}>{errors.assetID}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form_box mb-3">
                                                    <label htmlFor="exampleFormControlInput1" className="form-label" >Remark<span className='req_text'>*</span> :  </label>
                                                    <textarea className="form-control" value={formValues.remark} name="remark" onChange={handleInputChange} id="remark"></textarea>
                                                    {errors.remark && <span className="error" style={{ color: "red" }}>{errors.remark}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5">
                                                <div className="row">
                                                    <div className="col-lg-12 mb-1">Date of Allotment<span className='req_text' style={{color:""}}>*</span> : </div>
                                                </div>
                                                <div className="form_box mb-3">
                                                    <input type="date" id="givenDate" name="givenDate" value={formValues.givenDate} onChange={handleInputChange} />
                                                    {errors.givenDate && <span className='error' style={{ color: "red" }}>{errors.givenDate}</span>}
                                                </div>
                                            </div>
                                            <div className="col-lg-7">
                                                <div className="row">
                                                    <div className="col-lg-12 mb-1">Upload asset picture: </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 mb-1"><input type="file" className="upload_document" accept="image/*" name="picture" id="picture" onChange={handleInputChange} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>&nbsp;
                        <div className="row">
                            <div className="col-lg-12" style={{ textAlign: "right" }}>
                                <input type='submit' value="Cancel" className="red_button" onClick={() => onClose()} />&nbsp;
                                <input type='submit' value="Submit" className="red_button" onClick={handleSubmit} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DialogAssignAsset

async function getAssetType() {

    let query = supabase
        .from('leap_asset_type')
        .select()

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}


async function getEmployee(client_id: any) {

    let query = supabase
        .from('leap_customer')
        .select(`customer_id,name,emp_id,branch_id`).eq("client_id", client_id);;

    const { data, error } = await query;
    if (error) {
        // console.log(error);

        return [];
    } else {
        // console.log(data);
        return data;
    }

}
async function getDepartment() {

    let query = supabase
        .from('leap_client_departments')
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
async function getAsset(asset_id: string) {
    let query = supabase
        .from('leap_asset')
        .select()
        .eq("asset_id", asset_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);
        return [];
    } else {
        return data;
    }
}