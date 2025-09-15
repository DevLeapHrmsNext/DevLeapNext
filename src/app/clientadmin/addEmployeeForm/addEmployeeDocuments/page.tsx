'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import { useDropzone } from "react-dropzone";

import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter } from 'next/navigation';
import { ALERTMSG_exceptionString, clientAdminDashboard, getImageApiURL, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import { leftMenuAddEmployeePageNumbers, pageURL_userList } from '@/app/pro_utils/stringRoutes';
import { type } from 'os';
import LoadingDialog from '@/app/components/PageLoader';
import ShowAlertMessage from '@/app/components/alert';


interface FileAndType {
    fileTypeName: string,
    uploadFile: File | null
}

interface FormValues {

    panCard: File | null;
    passport: File | null;
    visa: File | null;
    hsc: File | null;
    ssc: File | null;
    experienceLetter: File | null;
    salarySlip: File | null;
    profileImage: File | null;
    profileTempURL: any

}

const AddEmployeeDocuments = () => {
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLoading,setSHowLoading]=useState(false);
    const { contextClientID, contaxtBranchID, contextCustomerID, contextAddFormEmpID, contextAddFormCustID } = useGlobalContext()
    const [fileUploadArray, setFileUploadArray] = useState<FileAndType[]>([])
    const [formValues, setFormValues] = useState<FormValues>({

        panCard: null,
        passport: null,
        visa: null,
        hsc: null,
        ssc: null,
        experienceLetter: null,
        salarySlip: null,
        profileImage: null,
        profileTempURL: null

    });

    const [showAlert,setShowAlert]=useState(false);
        const [alertForSuccess,setAlertForSuccess]=useState(0);
        const [alertTitle,setAlertTitle]=useState('');
        const [alertStartContent,setAlertStartContent]=useState('');
        const [alertMidContent,setAlertMidContent]=useState('');
        const [alertEndContent,setAlertEndContent]=useState('');
        const [alertValue1,setAlertValue1]=useState('');
        const [alertvalue2,setAlertValue2]=useState('');


useEffect(() => {
    if(contextAddFormEmpID.length==0 || contextAddFormCustID.length==0 ){
        router.push(pageURL_userList);
    }
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
    const handleInputChange = (e: any) => {
        const { name, value, type, files } = e.target;

        setFormValues((prev) => ({ ...prev, [name]: files[0] }));
        let setName = "";
        if (name == "panCard") {
            setName = "PAN Card";
        } else if (name == "passport") {
            setName = "Passport";
        } else if (name == "visa") {
            setName = "Work Visa/Permit";
        } else if (name == "hsc") {
            setName = "HSC Board";
        } else if (name == "ssc") {
            setName = "SSC Board";
        } else if (name == "experienceLetter") {
            setName = "Experience Letter";
        } else if (name == "salarySlip") {
            setName = "3 months salary slip";
        }

        setFileUploadArray((prev) => {
            // Check if the file type already exists
            const existingIndex = prev.findIndex((item) => item.fileTypeName === name);

            if (existingIndex !== -1) {
                // Replace existing file type entry
                const updatedArray = [...prev];
                updatedArray[existingIndex] = { fileTypeName: setName, uploadFile: files[0] };
                return updatedArray;
            } else {
                // Add a new file type entry
                return [...prev, { fileTypeName: setName, uploadFile: files[0] }];
            }
        });

        

        // console.log("Form values updated:", formValues);s

    };
    const handleProfileImageChange = async (e: any) => {
        const { name, value, type, files } = e.target;
        const maxSize = 2 * 1024 * 1024; 

        if (files[0].size > maxSize) {
            alert("File size exceeds 2MB. Please upload a smaller image.");
            return;
        }
        const img = new Image();
        img.src = URL.createObjectURL(files[0]);
        img.onload = () => {
            if (img.width > 500 || img.height > 500) { // Example: Max 500x500px
                alert("Image dimensions should not exceed 500x500 pixels.");
                return;
            }else{
                setFormValues((prev) => ({
                    ...prev, profileImage: files[0], profileTempURL: URL.createObjectURL(files[0]),
                }));
        
                onDrop(files)
            }
            // Continue processing       
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("---------this is the file upload array---------", fileUploadArray);
        if(fileUploadArray.length==0){
            
            router.replace(pageURL_userList);
        }else{
            setSHowLoading(true);
            fileUpload()
        }
        

    }
    // upload document

    const fileUpload = async () => { //(name: any) => {

        console.log("this is the value opassed as doc name", name);
        console.log("this is the value opassed as doc name", formValues);

        let file: any;
        let docTypeID = "";

        // if (name == "PAN Card") {
        //     file = formValues.panCard;
        // } else if (name == "Passport") {
        //     file = formValues.passport;
        // } else if (name == "Work Visa/Permit") {
        //     file = formValues.visa;
        // }else if (name == "HSC Board") {
        //     file = formValues.hsc;
        // }else if (name == "SSC Board") {
        //     file = formValues.ssc;
        // }else if (name == "Experience Letter") {
        //     file = formValues.experienceLetter;
        // }else if (name == "3 months salary slip") {
        //     file = formValues.salarySlip;
        // }

        console.log(file);
        for (let i = 0; i < fileUploadArray.length; i++) {
            if (fileUploadArray[i].uploadFile == null) {
                fileUploadArray.splice(i, 1)
            }
        }

        try {
            for (let i = 0; i < fileUploadArray.length; i++) {


                const formData = new FormData();
                formData.append("client_id", contextClientID);
                formData.append("customer_id", contextAddFormCustID||  "41");
                formData.append("docType","employee");
                formData.append("docName",fileUploadArray[i].fileTypeName);
                formData.append("file", fileUploadArray[i].uploadFile!);

                const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments", {
                    method: "POST",
                    // headers:{"Content-Type":"multipart/form-data"},
                    body: formData,
                });

                const fileUploadResponse = await fileUploadURL.json();
                console.log(fileUploadResponse);

                const { data: docType, error: docError } = await supabase.from('leap_document_type').select('*');
                if (docError) {
                    alert("failed to get doc types")
                }
                console.log("this is the doc type array", docType);      
                console.log("---------this is the file upload array---------", fileUploadArray);

                for (let j = 0; j < docType!.length; j++) {
                    
                    if (docType![j].document_name == fileUploadArray[i].fileTypeName!) {
                        docTypeID = docType![j].id;
                    }
                }

                const { data, error } = await supabase.from('leap_customer_documents').insert([
                    {
                        client_id: contextClientID,
                        customer_id:contextAddFormCustID|| "41",
                        bucket_url: fileUploadResponse.data,
                        isEnabled: true,
                        doc_type_id: docTypeID,
                        created_at: new Date(),

                    }
                ]);
                if (error) {
                    setShowAlert(true);
                setAlertTitle("Error");
                setAlertStartContent("Error ocurred while uploading document.");
                setAlertForSuccess(2);
                    setSHowLoading(false);
                }
                else {
                    setSHowLoading(false);
                    setShowAlert(true);
                setAlertTitle("Success");
                setAlertStartContent("Documents added successfully");
                setAlertForSuccess(1);
                    

                }

            }
            

        }
        catch (error) {
            setSHowLoading(false);
                setShowAlert(true);
                setAlertTitle("Exception");
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2);
            console.log(error);
        }
    }
    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFormValues((prev) => ({
            ...prev, profileImage: file, profileTempURL: URL.createObjectURL(file),
        }));
        setSHowLoading(true);
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("customer_id", contextAddFormCustID || "41");
        formData.append("docType","employeeProfile" );
        formData.append("docName","profile_image");
        formData.append("file", file);

        const fileUploadURL = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments",
            {
                method: "POST",
                body: formData,
            }
        );

        const fileUploadResponse = await fileUploadURL.json();
        console.log(fileUploadResponse);

        const { data, error } = await supabase
            .from("leap_customer")
            .update({
                profile_pic: fileUploadResponse.data,
            })
            .eq("customer_id", contextAddFormCustID);

        if (error) {
            setSHowLoading(false);
            setShowAlert(true);
            setAlertTitle("error");
            setAlertStartContent("Failed to update profile image");
            setAlertForSuccess(2);
        } else {
            setSHowLoading(false);
            setShowAlert(true);
            setAlertTitle("Success");
            setAlertStartContent("Profile Image updated successfully");
            setAlertForSuccess(1);
            
        }
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
    });


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={clientAdminDashboard} />
            </header>
            <LeftPannel menuIndex={leftMenuAddEmployeePageNumbers}  subMenuIndex={0} showLeftPanel={true} rightBoxUI={
                
                <form onSubmit={handleSubmit}>
                    <LoadingDialog isLoading={showLoading}/>
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length>0?alertMidContent: ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                                                               router.push(pageURL_userList);
                                                                setShowAlert(false)
                                                            } } onCloseClicked={function (): void {
                                                                setShowAlert(false)
                                                            } } showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}

                    <div className="container" >
                        <div className="row">
                            <div className="col-lg-8 mb-5">
                                <div className="col-lg-12">
                                    <div className="grey_box">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="add_form_inner">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-2">
                                                            <div className="heading25">Personal <span>Documents</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-4" style={{ color: '#565656', fontSize: '13px' }}>Upload Your Official Document here</div>
                                                    </div>
                                                      <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12s mb-1">PAN Card:</div>
                                                                </div>
                                                                <div className="row ">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="panCard" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("PAN Card")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12s mb-1">Passport:</div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="passport" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("Passport")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12s mb-1">Work Visa/Permit: </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="visa" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("Work Visa/Permit")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>&nbsp;
                                    <div className="grey_box">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="add_form_inner">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-2">
                                                            <div className="heading25">Educational <span>Documents</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-lg-6'>
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12s mb-1">HSC Board:</div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="hsc" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("HSC Board")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-6'>
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12s mb-1">SSC Board: </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="ssc" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("SSC Board")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>

                                            </div>
                                        </div>
                                    </div>&nbsp;
                                    <div className="grey_box">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="add_form_inner">
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-2">
                                                            <div className="heading25">Previous <span>Documents</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-12 mb-4" style={{ color: '#565656', fontSize: '13px' }}>Upload Your Previous Employee Document here</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-lg-6'>
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-1">Experience Letter: </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="experienceLetter" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("Experience Letter")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-6'>
                                                            <div className="upload_list">
                                                                <div className="row">
                                                                    <div className="col-lg-12s mb-1">Previous salary slip: </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-lg-12 mb-2">
                                                                        <input type="file" className="upload_document" name="salarySlip" id="formFileSm" onChange={handleInputChange} />
                                                                    </div>
                                                                    {/* <div className="col-lg-3">
                                                                        <input type="button" value="Upload" className="upload_btn" onClick={(e) => fileUpload("3 months salary slip")} />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>&nbsp;
                                    <div className="row">
                                        <div className="col-lg-12"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Submit" className="red_button" /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="grey_box text-center" style={{ backgroundColor: "#d2e3f1", padding: "20px", borderRadius: "10px", height: "400px", width: "350px", boxShadow: "0 0 10px .1px #e6e6e6" }}>
                                    <div className="profile-picture-container" style={{ marginBottom: "20px", alignContent: "center", height: "200px" }}>
                                        <div
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                borderRadius: "50%",
                                                // backgroundImage: "url(/images/user.png)",
                                                backgroundColor: "#FFFFFF",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                margin: "0 auto",
                                                position: "relative",
                                            }}>



                                            <img
                                                src={formValues.profileTempURL ? getImageApiURL+"/uploads/"+ formValues.profileTempURL : staticIconsBaseURL+"/images/user.png"} className="img-fluid"
                                                style={{
                                                    // backgroundImage: "url(/images/user.png)",
                                                    width: "140px",
                                                    height: "140px",
                                                    borderRadius: "50%",

                                                }} />
                                            {/* <p>Drag & Drop or Click to Upload</p> */}
                                        </div>
                                    </div>
                                    <input {...getInputProps()} />

                                    <div className="upload-section"  {...getRootProps()}>

                                        {isDragActive ? (
                                            <p>Drop the image here...</p>
                                        ) : formValues.profileTempURL ? (
                                            <i className="bi bi-cloud-arrow-up"
                                                style={{ fontSize: "24px", color: "#007BFF" }}></i>

                                        ) : (
                                            <>
                                                <div
                                                    style={{
                                                        width: "200px",
                                                        height: "100px",
                                                        backgroundImage: formValues.profileImage ? `url(${formValues.profileImage})` : "url(images/user.png)",
                                                        border: "thin dotted",
                                                        backgroundColor: "#E6F0FA",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "end",
                                                        margin: "0 auto",
                                                        position: "relative",
                                                        borderRadius: "10px"
                                                    }}><p style={{ marginTop: "10px", fontSize: "13px", color: "#777" }}>
                                                        Drag & Drop!
                                                    </p></div></>
                                        )}

                                    </div>

                                    <input
                                        type="file"
                                        accept="image"
                                        id="profilePictureUpload"
                                        onChange={handleProfileImageChange}

                                        style={{ display: "none" }}
                                    />
                                    <label> {formValues.profileImage ? formValues.profileImage.name : ""}</label>

                                    <label
                                        htmlFor="profilePictureUpload"
                                        style={{
                                            backgroundColor: "#FF0000",
                                            color: "#FFF",
                                            padding: "6px 20px",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            margin: "-10px 0px 0px 0",
                                            position: "relative"
                                        }}
                                    >Choose a File </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                
            } />
            < Footer />
        </div>
    )
}

export default AddEmployeeDocuments