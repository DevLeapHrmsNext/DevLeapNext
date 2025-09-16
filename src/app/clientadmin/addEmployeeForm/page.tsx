'use client'
export const dynamic = 'force-dynamic';
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'

import React, { useEffect, useState } from 'react'
import { createWorker } from 'tesseract.js';
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import supabase from '@/app/api/supabaseConfig/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { error } from 'console';

import { ALERTMSG_exceptionString, clientAdminDashboard, ocrComponent_AccountNumber, ocrComponent_Address, ocrComponent_BankBranch, ocrComponent_BankName, ocrComponent_DateOfBirth, ocrComponent_FirstName, ocrComponent_Gender, ocrComponent_IBAN, ocrComponent_IDNumber, ocrComponent_IFSCCode, ocrComponent_LastName, ocrComponent_MiddleName, ocrComponent_Nationality, staticIconsBaseURL } from '@/app/pro_utils/stringConstants';
import { pageURL_addUserAddressBankForm, leftMenuAddEmployeePageNumbers, pageURL_addUserEmploymentForm, pageURL_userEmpDashboard } from '@/app/pro_utils/stringRoutes';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import Tesseract from 'tesseract.js';
import BackButton from '@/app/components/BackButton';
import Component_AddEmpAddressBankDetails from '@/app/components/addEmployeeAddressAndBankdetails';
import validator from 'validator';
import RemoveAddEmpFormContactOrBankData from '@/app/components/dialog_RemoveEmpFormContactBank';
import DialogFetchedOCRData from '@/app/components/dialog_fetchOCRData';
import LoadingDialog from '@/app/components/PageLoader';
import ShowAlertMessage from '@/app/components/alert';




interface FormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    employeePhoto: File | null;
    dateOfBirth: string;
    bloodGroup: string;
    nationality: string;
    gender: string;
    maritalStatus: string;
    contactPrimary: string;
    contactAlternate: string;
    emailPersonal: string;
    emailOfficial: string;
    password: string;
    confirmPassword: string;

    nationalId: File | null;
    panCard: File | null;
    passport: File | null;
    workVisa: File | null;
    drivingLicense: File | null;
    cheque: File | null;
    bankbook: File | null;
    bankStatement: File | null;
}


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

interface bankFormComponents {
    id: number,
    component_name: string,
    data_type: number

}


interface bankForm {
    bank_data: number
    form_values: BankFormValues[]

}
interface BankFormValues {
    id: number,
    component_name: string,
    data_type: number
    value: string,
}
interface EmergencyContactData {
    emergencyContactName: string,
    emergencyContactNumber: string,
    emergencyContactRelationID: string,
}



const AddEmployeeBasicDetails = () => {
    // const searchParams = useSearchParams();
    // const roleId = searchParams.get('role_id');
    // const clientId = searchParams.get('client_id');
    const [selectedGender, setGender] = useState("Male");
    const [selectedMaritialStatus, setMaritialStatus] = useState("Single");
    const [isChecked, setIsChecked] = useState(true);
    const [isConfirmPassChecked, setConfirmPassChecked] = useState(true);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [ocrResult, setOcrResult] = useState<string>('');
    const [ocrStatus, setOcrStatus] = useState<string>('');
    const router = useRouter()
    const [dob18YearsPrior, setdob18YearsPrior] = useState('');

    const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
        contextLogoURL, contextRoleID,isAdmin, contextProfileImage, contextUserName,
        setGlobalState } = useGlobalContext();

    const [emergencyContactRelation, setEmergencyRelation] = useState<LeapRelationComponents[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isMoreLoading, setIsMoreLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isBothAddressSame, setBothAddressSame] = useState(false);
    const [deleteType, setDeleteType] = useState("");
    const [toBeDeletedIndex, setToBeDeletedIndex] = useState(-1);
    const emegencyDeleteType = "Emergency Contact", bankInfoDeleteType = "Bank Details";
    const [showOCRExtractDialog, setShowOCRExtractDialog] = useState(false);
    const [ocrExtractedArray, setOCRExtractedArray] = useState<OCRDataExtractedValues[]>([]);
    const [selectedOCRTextArray, setSelectedOCRTextArray] = useState<OCRDataExtractedValues[]>([]);
    const [ocrDocumentsDetails, setOCRDocumentsDetails] = useState<OCRUploadDataModel[]>([]);

    const [ocrImageType, setOcrImageType] = useState('');
    const [ocrSetParsingFile, setOCRSetParsingFile] = useState<File>();
    const [errors, setErrors] = useState<Partial<FormValues>>({});

    const [showAlert,setShowAlert]=useState(false);
    const [alertForSuccess,setAlertForSuccess]=useState(0);
    const [alertTitle,setAlertTitle]=useState('');
    const [alertStartContent,setAlertStartContent]=useState('');
    const [alertMidContent,setAlertMidContent]=useState('');
    const [alertEndContent,setAlertEndContent]=useState('');
    const [alertValue1,setAlertValue1]=useState('');
    const [alertvalue2,setAlertValue2]=useState('');


    useEffect(() => {
        const today = new Date();
        const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const maxDate = eighteenYearsAgo.toISOString().split("T")[0];
        setdob18YearsPrior(maxDate)
        const fetchData = async () => {
            const relations = await getRelations();
            setEmergencyRelation(relations);
            const bankFormComponents = await getBankFormComponents();
            const singleFormComoponent: bankFormComponents[] = []
            const singleFormComoponentValues: BankFormValues[] = []
            for (let i = 0; i < bankFormComponents.length; i++) {
                singleFormComoponent.push({
                    id: bankFormComponents[i].id,
                    component_name: bankFormComponents[i].component_name,
                    data_type: bankFormComponents[i].data_type
                })
                singleFormComoponentValues.push({
                    id: bankFormComponents[i].id,
                    component_name: bankFormComponents[i].component_name,
                    data_type: bankFormComponents[i].data_type,
                    value: ''
                })
            }
            setBankComponents(singleFormComoponent)
            const bankValues: bankForm[] = [{
                bank_data: 0,
                form_values: singleFormComoponentValues
            }]
            setBankValues(bankValues)
            setIsMoreLoading(false);
            // setEmergencyRelation(relations);


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

        // Call fetchActivities every 5 seconds


        window.addEventListener('scroll', handleScroll);
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };

        //   setActivities(activies);
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
    const [bankFormComponents, setBankComponents] = useState<bankFormComponents[]>([]);
    const [bankFormValues, setBankValues] = useState<bankForm[]>([{
        bank_data: 0,
        form_values: [{
            id: 0,
            component_name: '',
            data_type: 0,
            value: ''

        }]
    }]);

    const [emergencyContactData, setEmergencyContactData] = useState<EmergencyContactData[]>([{
        emergencyContactName: "",
        emergencyContactNumber: "",
        emergencyContactRelationID: "",
    }])

    const [addressErrors, setAddressErrors] = useState<Partial<addressFormValues>>({});
    const [bankErrors, setBankErrors] = useState<Partial<BankFormValues>>({});
    const [emergencyContactError, setEmergencyContactError] = useState<Partial<EmergencyContactData>>({});

    const handleAddressInputChange = (
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
        if(isBothAddressSame && section=="current"){
            setFormData((prevData) => ({
                ...prevData,
                ["permanent"]: {
                    ...prevData[section], // Assert section type
                    [name as keyof addressFormValues]: value, // Assert name type
                },
            }));
        }else if(isBothAddressSame && section=="permanent"){
            setFormData((prevData) => ({
                ...prevData,
                ["current"]: {
                    ...prevData[section], // Assert section type
                    [name as keyof addressFormValues]: value, // Assert name type
                },
            }));
        }
    };
    const handleEmergencyContactChange = (e: any, index: any) => {
        const { name, value, } = e.target;

        setEmergencyContactData(prev => {
            const updated = [...prev]; // clone array
            updated[index] = { ...updated[index], [name]: value }; // update specific item
            return updated;
        });

    };
    const checkIndexHasValue = (index: number) => {
        let hasValue = false;
        for (let i = 0; i < bankFormValues[index].form_values.length; i++) {

            if (bankFormValues[index].form_values[i].value.trim().length > 0) {

                hasValue = true;
            }
        }
        return hasValue;
    }
    const handleBankDataChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        outerIndex: number,
        formValueIndex?: number // optional
    ) => {
        const { name, value } = e.target;

        setBankValues(prev => {
            const updated = [...prev];

            // Update top-level fields (bankName, ifscCode, etc.)
            if (formValueIndex === undefined) {
                updated[outerIndex] = {
                    ...updated[outerIndex],
                    [name]: value
                };
            }
            // Update nested form_values
            else {
                const updatedFormValues = [...updated[outerIndex].form_values];
                updatedFormValues[formValueIndex] = {
                    ...updatedFormValues[formValueIndex],
                    value: value
                };
                updated[outerIndex] = {
                    ...updated[outerIndex],
                    form_values: updatedFormValues
                };
            }

            return updated;
        });
    };
    const removeAtIndex = () => {
        if (deleteType == emegencyDeleteType) {
            setEmergencyContactData(prevItems => prevItems.filter((_, i) => i !== toBeDeletedIndex));
        } else {
            setBankValues(prevItems => prevItems.filter((_, i) => i !== toBeDeletedIndex));
        }
    };

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
        console.log("-=-=-=-=-=-==-=-==-=-=addBankDetailsContactUI=-=-=-=-===-=-==-=-",bankFormComponents.length);
        
        const bankDataArray: BankFormValues[] = [];
        const newArray = bankFormValues;

        for (let i = 0; i < bankFormComponents.length; i++) {
            bankDataArray.push({
                id: bankFormComponents[i].id,
                component_name: bankFormComponents[i].component_name,
                data_type: bankFormComponents[i].data_type,
                value: ''
            })
        }
        newArray.push(
            {
                bank_data: bankFormValues.length + 1,
                form_values: bankDataArray,
            }
        )
        setBankValues(newArray)

        setIsMoreLoading(false);

    }


    const setOCRDataInForm = (selectedData:OCRDataExtractedValues[],isPermanent:boolean) => {

        let addOcrDetails=ocrDocumentsDetails;
        if(addOcrDetails && addOcrDetails.length>0){
            let idISExtracted='';
            for(let i=0;i<selectedData.length;i++){
                if(selectedData[i].component_name==ocrComponent_IDNumber){
                    idISExtracted=selectedData[i].value;
                }
            }
            for(let i=0;i<addOcrDetails.length;i++){
                if(addOcrDetails[i].document_name!=ocrImageType){
                     addOcrDetails.push({
                        document_extracted_id: idISExtracted,
                        document_name: ocrImageType,
                        document_url: '',
                        file:ocrSetParsingFile!
                    })
                    setOCRDocumentsDetails(addOcrDetails)
                }else{
                    setOCRDocumentsDetails((prev) =>
                        prev.map((item) =>
                          item.document_name === ocrImageType
                            ? { ...item, file: ocrSetParsingFile!,document_extracted_id:idISExtracted }
                            : item
                        )
                      );
                }
            }
        }else{
            addOcrDetails.push({
                document_extracted_id: "",
                document_name: ocrImageType,
                document_url: '',
                file:ocrSetParsingFile!,

            })
            setOCRDocumentsDetails(addOcrDetails)
        }
       
        for(let i=0;i<selectedData.length;i++){
            if(selectedData[i].component_name==ocrComponent_FirstName){
                setFormValues((prev) => ({ ...prev, ["firstName"]: selectedData[i].value }));
            }
            if(selectedData[i].component_name==ocrComponent_MiddleName){
                setFormValues((prev) => ({ ...prev, ["middleName"]: selectedData[i].value }));
            }
            if(selectedData[i].component_name==ocrComponent_LastName){
                setFormValues((prev) => ({ ...prev, ["lastName"]: selectedData[i].value }));
            }
            if(selectedData[i].component_name==ocrComponent_DateOfBirth){
                if (isAtLeast18YearsOld(selectedData[i].value)) {
                    const newErrors: Partial<FormValues> = {};
                    newErrors.dateOfBirth = "Selected date should be greater than 18 years";
                    setErrors(newErrors);
                }else{

                    setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: selectedData[i].value }));
                }
            }
            if(selectedData[i].component_name==ocrComponent_Gender){
                setFormValues((prev) => ({ ...prev, ["gender"]: selectedData[i].value }));
            }
            // if(selectedData[i].component_name==ocrComponent_IDNumber){
            //     setFormValues((prev) => ({ ...prev, ["firstName"]: selectedData[i].value }));
            // }
            if(selectedData[i].component_name==ocrComponent_Nationality){
                setFormValues((prev) => ({ ...prev, ["nationality"]: selectedData[i].value }));
            }
           
            if(selectedData[i].component_name==ocrComponent_Address){
                console.log("this is variable ocrSelectedIsPermenantAddress value",isPermanent);
                console.log("this is variable selectedData[i].value value",selectedData[i]);
                
                if(isPermanent){
                    setFormData((prevData) => ({
                        ...prevData,
                        ["permanent"]: {
                            ...prevData["current"], // Assert section type
                            ["currentAddressLineOne"]: selectedData[i]?.value! || "", // Assert name type
                        },
                    }))
                }else{
                    setFormData((prevData) => ({
                        ...prevData,
                        ["current"]: {
                            ...prevData["current"], // Assert section type
                            ["currentAddressLineOne"]: selectedData[i]!.value! || "", // Assert name type
                        },
                    }))
                }
                
            }
            // changing here after select ocr data
            if(bankFormValues.length==1){
                console.log("bankFormValues[0].form_values.length===============",bankFormValues[0].form_values.length);
                
            // for(let j=0;j<bankFormValues[0].form_values.length;i++){
                for(let j=0;j<bankFormValues[0].form_values.length;j++){
                console.log("selectedData[i].component_name==================",selectedData[i].component_name);
                
                setBankValues(prev => {
                    const updated = [...prev];
        
                
                    // Update nested form_values
                
                        const updatedFormValues = [...updated[0].form_values];
                        console.log("updatedFormValues==================",updatedFormValues);
                        console.log("updatedFormValues[j].component_name==================",updatedFormValues[j].component_name);

                        if(updatedFormValues[j].component_name==selectedData[i].component_name){
                        updatedFormValues[j] = {
                            ...updatedFormValues[j],
                            value: selectedData[i].value
                        };
                        updated[0] = {
                            ...updated[0],
                            form_values: updatedFormValues
                        };
                    }
                    
                    
                    return updated;
                        
                });
            }
            // }
        }


        }
        
    }
    const sameAddress = (setSame:boolean) => {
        
        if(setSame){
            
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
    }


    const extractText = async (file: File, imageType: any) => {
        setIsMoreLoading(true);
        setOcrImageType(imageType);
        setOCRSetParsingFile(file);
        

        console.log("ythsi is the extractText and length of ocrdocdetails===",ocrDocumentsDetails.length);
        

        // setOCRDocumentsDetails((prev) =>
        //     prev.map((item) =>
        //       item.document_name === ocrDocumentsDetails[i].document_name
        //         ? { ...item, document_url: fileUploadResponse.data }
        //         : item
        //     )
        //   );
        
        try {
            const { data } = await Tesseract.recognize(file, "eng");
            // setExtractedText(data.text);
            parseText(data.text, imageType);
        } catch (error) {
            console.error("OCR Extraction Error:", error);
        }
    };

    const parseText = (text: any, imageType: any) => {
        
        console.log("Extracted Text:", text);
        console.log("Image Type:", imageType);
        const extractedDataArray:OCRDataExtractedValues[]=[];
        let nameMatch = '';
        // Name detection (Assumes "Name:" or similar format)
        // Apply regex to extract details
        // Extract Name
        if (text.match(/Name[:\s]*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/)) {
            nameMatch = text.match(/Name[:\s]*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
        } else if (text.match(/N[ae]me:\s*([^\n]+)/i)) {
            nameMatch = text.match(/N[ae]me:\s*([^\n]+)/i);
        }
        else if (text.match(/n[ae]me\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})/i)) {
            nameMatch = text.match(/n[ae]me\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})/i);
        }
        else if (text.match(/\n([A-Z]+\s[A-Z\s]+)\n/)) {
            nameMatch = text.match(/\n([A-Z]+\s[A-Z\s]+)\n/);
        }
        else if (text.match(/\n([A-Z]+\s[A-Z]+)\n/)) {
            nameMatch = text.match(/\n([A-Z]+\s[A-Z]+)\n/);
        }
        else if (text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/)) {
            nameMatch = text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/);
        }
        else if (text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/)) {
            nameMatch = text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/);
        }
        else if (text.match(/\b(?:Name|Holder|Employee|Permit Holder)[:\s]+([A-Z][A-Za-z]+\s[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*)\b/)) {
            nameMatch = text.match(/\b(?:Name|Holder|Employee|Permit Holder)[:\s]+([A-Z][A-Za-z]+\s[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*)\b/);
        }else if(text.match(/[A-Z\s]{10,}/g)){
            nameMatch=text.match(/[A-Z\s]{10,}/g)
        }
        else if(text.match(/[A-Z][A-Z\s]{5,}/)){
            nameMatch=text.match(/[A-Z][A-Z\s]{5,}/)
        }
        else if(text.match(/\b(?:Mr|Mrs|Ms|Name)[:\s]*([A-Z\s]{5,})/i)){
            nameMatch=text.match(/[A-Z][A-Z\s]{5,}/)
        }
        else if(text.match(/\b[A-Z][A-Z\s]{4,}\b/)){
            nameMatch=text.match(/[A-Z][A-Z\s]{5,}/)
        }
        else if(text.match(/^([A-Z][a-z]+\s[A-Z][a-z]+)/m)){
            nameMatch=text.match(/^([A-Z][a-z]+\s[A-Z][a-z]+)/m)
        }
        else if(text.match(/[A-Z\s]{10,}/g)){
            nameMatch=text.match(/[A-Z\s]{10,}/g)
        }
        else {
            nameMatch = text.match(/\n([A-Za-z\s]+)\n/);
        }

        let extractedName 
        if(nameMatch && nameMatch.length>=2){
            extractedName = nameMatch[1];
        } else{
            extractedName=nameMatch
        }   
        

        let nameArray: any[] = []
        if (extractedName &&  extractedName.includes(" ") && !extractedName.includes("\n")) {
            nameArray = extractedName.split(" ");
        }
        
        console.log("Name From OCR --------------------------", extractedName);
        console.log("nameArray .length --------------------------", nameArray.length);

        if (nameArray.length == 4) {
            console.log("nameArray .length -------------------------- 4 is the condition",);

            extractedDataArray.push({
                component_name:ocrComponent_FirstName,
                value: nameArray[0]
            })
            extractedDataArray.push({
                component_name:ocrComponent_MiddleName,
                value: nameArray[1]
            })
            extractedDataArray.push({
                component_name:ocrComponent_LastName,
                value: nameArray[2]+" "+ nameArray[3]
            })
            // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));
            // setFormValues((prev) => ({ ...prev, ["middleName"]: nameArray[1] }));
            // setFormValues((prev) => ({ ...prev, ["lastName"]: nameArray[2] + nameArray[3] }));
        }
        else if (nameArray.length == 3) {
            console.log("nameArray .length -------------------------- 3 is the condition",);

            extractedDataArray.push({
                component_name:ocrComponent_FirstName,
                value: nameArray[0]
            })
            extractedDataArray.push({
                component_name:ocrComponent_MiddleName,
                value: nameArray[1]
            })
            extractedDataArray.push({
                component_name:ocrComponent_LastName,
                value: nameArray[2]
            })
            // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));
            // setFormValues((prev) => ({ ...prev, ["middleName"]: nameArray[1] }));
            // setFormValues((prev) => ({ ...prev, ["lastName"]: nameArray[2] }));
        } else if (nameArray.length == 2) {
            console.log("nameArray .length -------------------------- 2 is the condition",);

            extractedDataArray.push({
                component_name:ocrComponent_FirstName,
                value: nameArray[0]
            })
            extractedDataArray.push({
                component_name:ocrComponent_LastName,
                value: nameArray[1]
            })
            // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));
            // setFormValues((prev) => ({ ...prev, ["lastName"]: nameArray[1] }));

        } else if (nameArray.length == 1) {
            console.log("nameArray .length -------------------------- 1 is the condition",);

            extractedDataArray.push({
                component_name:ocrComponent_FirstName,
                value: extractedName
            })
            // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));

        } 

///---------------here is the Date of birth extraction

        let dobMatch1 = ''
        if (text.match(/DOB\s*:\s*(\d{2}\/\d{2}\/\d{4})/i)) {
            dobMatch1 = text.match(/DOB\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
            console.log("if condition OCR DOB==========", dobMatch1[0]);
            const dateStr = dobMatch1[0].split(" ").length == 3 ? dobMatch1[0].split(" ")[2] : dobMatch1[0].split(" ").length == 2 ? dobMatch1[0].split(" ")[1] : dobMatch1[0];
            const [day, month, year] = dateStr.split("/")
            extractedDataArray.push({
                component_name:ocrComponent_DateOfBirth,
                value: `${year}-${month}-${day}`
            })
            // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));
        } else if (text.includes("Date of Birth")) {

            dobMatch1 = text.match(/Date\s*of\s*Birth:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
            
            if(dobMatch1 && dobMatch1.length>0){
                console.log("if condition 1 OCR DOB==========", dobMatch1[0]);
            const split1 = dobMatch1[0].split(":");

            const [day, month, year] = split1[1].trim().split("/")
            extractedDataArray.push({
                component_name:ocrComponent_DateOfBirth,
                value: `${year}-${month}-${day}`
            })
        }
            else{
                const dobRegex = /\b(?:DOB|Date\s+of\s+Birth|My\s+Date\s+of\s+Birth)\s*[:\-]?\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i;
                const dob = text.match(dobRegex)?.[1];
                console.log("if condition 1 OCR DOB==========", dob);
                
    
                const [day, month, year] = dob.trim().split("/")
                extractedDataArray.push({
                    component_name:ocrComponent_DateOfBirth,
                    value: `${year}-${month}-${day}`
                })
            }
            // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));

        } else if (text.match(/(\d{2}\/\d{2}\/\d{4})/g)) {
            dobMatch1 = text.match(/(\d{2}\/\d{2}\/\d{4})/g)
            console.log("if condition 2 OCR DOB==========", dobMatch1[0]);

            const [day, month, year] = dobMatch1[0].trim().split("/")
            extractedDataArray.push({
                component_name:ocrComponent_DateOfBirth,
                value: `${year}-${month}-${day}`
            })
            // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));
        }
         else if (text.match(/\b(?:DOB|Date\s*of\s*Birth|Acc(?:ount)?\s*Open(?:ing)?\s*Date)[:\s]*([\d]{2}\/[\d]{2}\/[\d]{4})\b/i)) {
            dobMatch1 = text.match(/\b(?:DOB|Date\s*of\s*Birth|Acc(?:ount)?\s*Open(?:ing)?\s*Date)[:\s]*([\d]{2}\/[\d]{2}\/[\d]{4})\b/i)
            console.log("if condition 2 OCR DOB==========", dobMatch1[0]);

            const [day, month, year] = dobMatch1[0].trim().split("/")
            extractedDataArray.push({
                component_name:ocrComponent_DateOfBirth,
                value: `${year}-${month}-${day}`
            })
            // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));
        }

///---------------here is the gender extraction

        console.log(formValues.dateOfBirth);
        // Gender detection (Male / Female / M / F)
        const genderMatch = text.match(/\b(Male|Female|M|F|m|f|MALE|FEMALE)\b/i);
        const gender = genderMatch ? genderMatch[0] : "";
        console.log("Gender From OCR --------------------------", gender);
        if (gender.length > 0) {
            if(gender.trim() == "MALE"|| gender.trim() == "Male"  || gender.trim() == "male" || gender.trim()=="M" || gender.trim() == "m"){
                extractedDataArray.push({
                    component_name:ocrComponent_Gender,
                    value:"Male"
                });
            }else if(gender.trim() == "FEMALE" || gender.trim() == "Female"|| gender.trim() == "female" || gender.trim()=="F" || gender.trim() == "f"){
                extractedDataArray.push({
                    component_name:ocrComponent_Gender,
                    value:"Female"
                });
            }
            
            // setFormValues((prev) => ({ ...prev, ["gender"]: gender == "MALE" ? "Male" : gender == "FEMALE" ? "Female" : "" }));
        }
///---------------here is the idNumber extraction

        // Aadhar Number detection (12-digit format)
        let idNumberMatch = "";
        if (text.match(/\b\d{4}\s\d{4}\s\d{4}\b/)) {
            idNumberMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
        } else if (text.match(/(\d{3}-\d{4}-\d{7}-\d)/)) {
            idNumberMatch = text.match(/(\d{3}-\d{4}-\d{7}-\d)/)
        } else if (text.match(/\b\d{6,}\b/)) {
            idNumberMatch = text.match(/\b\d{6,}\b/)
        }
         else if (text.match(/\b(\d{4}\s\d{4}\s\d{4})\b/)?.[1]) {
            idNumberMatch = text.match(/\b(\d{4}\s\d{4}\s\d{4})\b/)?.[1]
        }
        console.log("this is the branch name extracted==========   idNumberMatch ====",idNumberMatch);

        const idNumber = idNumberMatch[0];
        extractedDataArray.push({
            component_name:ocrComponent_IDNumber,
            value:idNumberMatch[0]
        })
        console.log("this is the branch name extracted==========   nationality ====",idNumber);

        
///---------------here is the nationality extraction

        let nationality = "";
        if (text.match(/\bNationality\s+([A-Za-z\s]+)/i)) {
            nationality = text.match(/\bNationality\s+([A-Za-z\s]+)/i);
        }
        else if (text.match(/Nationality\s*:\s*([A-Za-z\s]+)/i)) {
            nationality = text.match(/Nationality\s*:\s*([A-Za-z\s]+)/i);
        }
        else if (text.match(/nality\s*:\s*([A-Za-z\s]+)/i)) {
            nationality = text.match(/nality\s*:\s*([A-Za-z\s]+)/i);
        }
        console.log("this is the branch name extracted==========   nationality ====",nationality);

        extractedDataArray.push({
            component_name:ocrComponent_Nationality,
            value:nationality
        })

///---------------here is the account number  extraction

        let accountNumberMatch = '' ;
        if(text.match(/Account\s+No.*?(\d{5,})/i)){
            accountNumberMatch=text.match(/Account\s+No.*?(\d{5,})/i)
        }else if(text.match(/(?:Account\s*No\.?|Account\s*N[o¢]\.?|A\/c\s*No\.?)\s*[:\-]?\s*([A-Za-z0-9\-]+)/i)?.[1]){
            accountNumberMatch=text.match(/(?:Account\s*No\.?|Account\s*N[o¢]\.?|A\/c\s*No\.?)\s*[:\-]?\s*([A-Za-z0-9\-]+)/i)?.[1];
        }
        else if(text.match(/Account\s*No[:\s]*([A-Za-z0-9\-]+)/)){
            accountNumberMatch=text.match(/Account\s*No[:\s]*([A-Za-z0-9\-]+)/);
        }
        else if(text.match(/\b\d{9,18}\b/)){
            accountNumberMatch=text.match(/\b\d{9,18}\b/);
        }
        else if(text.match(/(?:Account\s*No\.?|A\/C\s*No\.?|A\/C\s*Number)[^\d]*(\d{9,18})/i)){
            accountNumberMatch=text.match(/(?:Account\s*No\.?|A\/C\s*No\.?|A\/C\s*Number)[^\d]*(\d{9,18})/i);
        }
        else if(text.match(/(?:Account\s*No\.?|A\/C\s*No\.?|Acc(?:ount)?\s*Number)[:\s]*([0-9]{9,18})/i)){
            accountNumberMatch=text.match(/(?:Account\s*No\.?|A\/C\s*No\.?|Acc(?:ount)?\s*Number)[:\s]*([0-9]{9,18})/i);
        }
        else if(text.match(/\b(?:Account\s*(?:Number|No|#)?[:\s]*)([A-Z0-9\-]{6,30})\b/i)){
            accountNumberMatch=text.match(/\b(?:Account\s*(?:Number|No|#)?[:\s]*)([A-Z0-9\-]{6,30})\b/i);
        }
        else if(text.match(/ACCOUNT\s*No?\s*[:']?\s*(\d{6,})/i)){
            accountNumberMatch=text.match(/\b(?:Account\s*(?:Number|No|#)?[:\s]*)([A-Z0-9\-]{6,30})\b/i);
        }
        else if(text.match(/Account\s*No.*?(\d{5,})/i)){
            accountNumberMatch=text.match(/Account\s*No.*?(\d{5,})/i);
        }
        else if(text.match(/Account\s*No.*?([A-Z0-9\s\-]+)/i)){
            accountNumberMatch=text.match(/Account\s*No.*?([A-Z0-9\s\-]+)/i);
        }
        
        console.log("this is the branch name extracted==========   accountNumberMatch ====",accountNumberMatch);

        const accountNumber = accountNumberMatch?.[1];
        console.log("this is the branch name extracted==========   accountNumber ====",accountNumber);

        extractedDataArray.push({
            component_name:ocrComponent_AccountNumber,
            value:accountNumber
        })
///---------------here is the ifsc code extraction
        let ifscMatch='';
        if(text.match(/IFSC\s*Code\s*[:\-]?\s*([A-Z]{4}0[0-9A-Z]{6})/i)){
            ifscMatch=text.match(/IFSC\s*Code\s*[:\-]?\s*([A-Z]{4}0[0-9A-Z]{6})/i);
        }else if(text.match(/\b[A-Z]{4}0[A-Z0-9]{6}\b/)){
            ifscMatch=text.match(/\b[A-Z]{4}0[A-Z0-9]{6}\b/);
        }
        else if(text.match(/\b[A-Z]{4}0\d{6}\b/i)){
            ifscMatch=text.match(/\b[A-Z]{4}0\d{6}\b/i);
        }
        else if(text.match(/\bIFSC\s*Code\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})\b/i)){
            ifscMatch=text.match(/\bIFSC\s*Code\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})\b/i);
        }
        else if(text.match(/\bIFSC\s*Code[:\s]*([A-Z]{4}0[A-Z0-9]{6})\b/i)){
            ifscMatch=text.match(/\bIFSC\s*Code[:\s]*([A-Z]{4}0[A-Z0-9]{6})\b/i);
        }
        else if(text.match(/IFSC\s*Code\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i)){
            ifscMatch=text.match(/IFSC\s*Code\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})/i);
        }
        else if(text.match(/IFSC\s*Code\s*[:\-]?\s*([A-Z0-9]{8,15})/i)){
            ifscMatch=text.match(/IFSC\s*Code\s*[:\-]?\s*([A-Z0-9]{8,15})/i);
        }
        console.log("this is the branch name extracted==========   ifscMatch ====",ifscMatch);

        const ifscCode = ifscMatch?.[1];
        extractedDataArray.push({
            component_name:ocrComponent_IFSCCode,
            value: ifscCode
        })
        console.log("this is the branch name extracted=====ifscCode=====",ifscCode);

//-----------------here is the address Extraction 

        let addressMatch=''
        if(text.match(/Address[:\s\\]*(.*)/)){
            addressMatch= text.match(/Address[:\s\\]*(.*)/);
        }else if(text.match(/Address[:\-]?\s*([A-Za-z0-9,\s\-\/]+(?:\n|$))/i)){
            addressMatch=text.match(/Address[:\-]?\s*([A-Za-z0-9,\s\-\/]+(?:\n|$))/i);
        }
        else if(text.match(/Address\s*[:\-]?\s*([^\n]+)/i)){
            addressMatch=text.match(/Address\s*[:\-]?\s*([^\n]+)/i);
        }
        else if(text.match(/(\d{3,}\s.+\n.+,\s?[A-Z]{2},\s?\d{5})/)){
            addressMatch=text.match(/Address\s*[:\-]?\s*([^\n]+)/i);
        }
        else if(text.match(/Address[:;\-]?\s*([^\n]+)/i)){
            addressMatch=text.match(/Address[:;\-]?\s*([^\n]+)/i);
        }
        console.log("this is the branch name extracted==========",addressMatch);

        const address = addressMatch?.[1];
        if(address){
        extractedDataArray.push({
            component_name:ocrComponent_Address,
            value: address
        })
    }
    console.log("this is the branch name extracted=====address=====",address);

//-----------------her si the branch name Extraction 

        let branchName = '';
        if(text.match(/Branch(?:y)?\s*([\w\s-]+)/i)?.[1]){
            branchName=text.match(/Branch(?:y)?\s*([\w\s-]+)/i)?.[1]
        }
        else if(text.match(/\bBranch[:\s]*([A-Z\s\-]{4,})/i)){
            branchName=text.match(/\bBranch[:\s]*([A-Z\s\-]{4,})/i)
        }
        if(branchName){
        extractedDataArray.push({
            component_name:ocrComponent_BankBranch,
            value: branchName
        })
    }
        console.log("this is the branch name extracted==========",branchName);
//-----------------here is the IBAN Number Extraction 

        let IbanNumber='';
        if(text.match(/\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}\b/g)){
            IbanNumber=text.match(/\b[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}\b/g);
        }else if(text.match(/\b[A-Z]{2}[0-9A-Z]{14,30}\b/i)){
            IbanNumber=text.match(/\b[A-Z]{2}[0-9A-Z]{14,30}\b/i);
        }
        else if(text.match(/\bIBAN\s*[:\-]?\s*([A-Z]{2}[0-9A-Z]{13,32})\b/i)){
            IbanNumber=text.match(/\bIBAN\s*[:\-]?\s*([A-Z]{2}[0-9A-Z]{13,32})\b/i);
        }
        else if(text.match(/\bIBAN[:\s]*([A-Z]{2}\d{2}[A-Z0-9]{11,30})\b/i)){
            IbanNumber=text.match(/\bIBAN[:\s]*([A-Z]{2}\d{2}[A-Z0-9]{11,30})\b/i);
        }
        if(IbanNumber){
            extractedDataArray.push({
                component_name:ocrComponent_IBAN,
                value: IbanNumber
            })
        }
        console.log("this is the IbanNumber extracted data===========",IbanNumber);
        
        // setFormValues((prev) => ({ ...prev, ["nationality"]: nationality }));
        if(extractedDataArray.length>0){
            setIsMoreLoading(false);
            setShowOCRExtractDialog(true);
            setOCRExtractedArray(extractedDataArray);
        }else{

            alert("No data extracted");
            setIsMoreLoading(false);
        }
        
    };

    const [formValues, setFormValues] = useState<FormValues>({
        firstName: "",
        middleName: "",
        lastName: "",
        employeePhoto: null,
        dateOfBirth: "",
        bloodGroup: "",
        nationality: "",
        gender: "",
        maritalStatus: "",
        contactPrimary: "",
        contactAlternate: "",
        emailPersonal: "",
        emailOfficial: "",
        password: "",
        confirmPassword: "",
        nationalId: null,
        panCard: null,
        passport: null,
        workVisa: null,
        drivingLicense: null,
        bankbook: null,
        cheque: null,
        bankStatement: null,


    });

    function isAtLeast18YearsOld(dateStr: string): boolean {
        const birthDate = new Date(dateStr);
        const today = new Date();
        console.log("sent birthdate ==-=-===-===-==-=-=-=-",birthDate);
        console.log("today date =====-=-=-=-=-=-=-=-=-=-",today);
        birthDate.setHours(0, 0, 0, 0);

        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        eighteenYearsAgo.setHours(0, 0, 0, 0);
        console.log("birthDate", birthDate.toISOString());
        console.log("18 years ago", eighteenYearsAgo.toISOString());
        
        const is18OrOlder = birthDate > eighteenYearsAgo;
        console.log("is18OrOlder:", is18OrOlder);
        
        return is18OrOlder;
      }


    const validate = () => {
        const newErrors: Partial<FormValues> = {};

        if (!formValues.firstName) newErrors.firstName = "First Name is required";
        // if (!formValues.middleName) newErrors.middleName = "Middle Name is required";
        if (!formValues.lastName) newErrors.lastName = "Last Name is required";
        if (!formValues.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
        if (!formValues.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
        if (!formValues.gender) newErrors.gender = "Gender is required";
        if (!formValues.nationality) newErrors.nationality = "Nationality is required";
        if (!formValues.maritalStatus) newErrors.maritalStatus = "Marital status is required";
        if (!formValues.contactPrimary) newErrors.contactPrimary = "Primary Contact is required";
        if (!formValues.emailPersonal) newErrors.emailPersonal = "Personal Email is required";
        if (!formValues.emailOfficial) newErrors.emailOfficial = "Official Email is required";
        if (!formValues.password) newErrors.password = "Password is required";

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!formValues.contactPrimary || !phoneRegex.test(formValues.contactPrimary)) {
            newErrors.contactPrimary = "Valid primary contact number is required";
        }
        if (formValues.contactAlternate && !phoneRegex.test(formValues.contactAlternate)) {
            newErrors.contactAlternate = "Enter a valid alternate contact number";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formValues.emailPersonal || !emailRegex.test(formValues.emailPersonal)) {
            newErrors.emailPersonal = "Valid personal email is required";
        }
        if (formValues.emailOfficial && !emailRegex.test(formValues.emailOfficial)) {
            newErrors.emailOfficial = "Enter a valid official email address";
        }

        if (!formValues.password || formValues.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        const passwordRegex=/^(?=.*[A-Za-z])(?=.*\d).+$/
        if(!passwordRegex.test(formValues.password)){
            newErrors.password = "Password must be combination of numbers and characters";
        }
        if (formValues.password !== formValues.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
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


        
        // const bankdetailsErrors: Partial<BankFormValues> = {};
        const emergencydetailsErrors: Partial<EmergencyContactData> = {};
        // for (let i = 0; i < bankFormValues[0].form_values.length; i++) {
        //     if (!bankFormValues[0].form_values[i].value) bankdetailsErrors.value = "Required";
        // }
        // for (let i = 1; i < bankFormValues.length; i++) {
        //     for (let j = 1; i < bankFormValues[i].form_values.length; j++) {
        //         if (!bankFormValues[i].form_values[j].value){
                    
        //         }
        //     }
        // }
        if (!emergencyContactData[0].emergencyContactName) emergencydetailsErrors.emergencyContactName = "Emergency contact name is required";
        if (!emergencyContactData[0].emergencyContactNumber) emergencydetailsErrors.emergencyContactNumber = "Emergency contact number is required";
        if (!emergencyContactData[0].emergencyContactNumber || !phoneRegex.test(emergencyContactData[0].emergencyContactNumber)) {
            newErrors.contactPrimary = "Valid emergency contact number is required";
        }
        
        if (!emergencyContactData[0].emergencyContactRelationID) emergencydetailsErrors.emergencyContactRelationID = "Emergency contact relation is required";

        if (!validator.isMobilePhone(emergencyContactData[0].emergencyContactNumber)) {
            emergencydetailsErrors.emergencyContactNumber = "Enter a valid phone number";
        }

        for(let i=0;i<bankFormValues.length;i++){
            for(let j=0;j<bankFormValues[i].form_values.length;j++){
                if(!bankFormValues[i].form_values[j].value){
                    bankErrors.component_name="required"
                }
            }
        }
        setErrors(newErrors);
        // setBankErrors(bankdetailsErrors);
        setEmergencyContactError(emergencydetailsErrors);
        setAddressErrors(addressDetailsErrors);

        console.log("Object.keys(newErrors).length===============",Object.keys(newErrors).length);
        

        return Object.keys(newErrors).length === 0 || Object.keys(emergencydetailsErrors).length === 0 || Object.keys(addressDetailsErrors).length === 0;
    };

    const handleInputChange = (e: any) => {
        const { name, value, type, files } = e.target;
        // console.log("Form values updated:", formValues);
        console.log("Form values updated:", ocrDocumentsDetails);

        
        if (type === "file") {
            // setSelectedImage(files[0]);
            
            setFormValues((prev) => ({ ...prev, [name]: files[0] }));
            
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        console.log("handle submit is called");
        
        // readImageText();
        e.preventDefault();
        
        console.log("handle submit is called===============before validate log");


        if (!validate()) return;
        setIsMoreLoading(true);
        console.log("handle submit is called===============after validate log",ocrDocumentsDetails);
        const sendDocumentsArray=ocrDocumentsDetails;
        if(sendDocumentsArray.length>0){
        for(let i=0;i<sendDocumentsArray.length;i++){

        try {

            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("customer_id", '');
            formData.append("docType", "OCR_Docs");
            formData.append("docName",sendDocumentsArray[i].document_name);
            formData.append("file", sendDocumentsArray[i].file!);
        
            const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments", {
              method: "POST",
              // headers:{"Content-Type":"multipart/form-data"},
              body: formData,
            });
        
            const fileUploadResponse = await fileUploadURL.json();
            console.log(`file upload response======${i}====`,fileUploadResponse);
            sendDocumentsArray[i].document_url=fileUploadResponse.data;
            sendDocumentsArray[i].file=null;

            console.log(`file upload response===sendDocumentsArray===${i}====`,sendDocumentsArray);

          } catch (error) {
            console.log(error);
            // return ""
          }
        }
    }
        
        console.log("handle submit called after documents upload");

        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", contaxtBranchID);
        formData.append("name", formValues.firstName.trim() + " " + formValues.middleName.trim() + " " + formValues.lastName.trim());
        formData.append("dob", formValues.dateOfBirth);
        formData.append("gender", selectedGender);
        formData.append("marital_status", selectedMaritialStatus);
        formData.append("nationality", formValues.nationality);
        formData.append("blood_group", formValues.bloodGroup);
        formData.append("contact_number", formValues.contactPrimary);
        formData.append("email_id", formValues.emailOfficial);
        formData.append("p_email_id", formValues.emailPersonal);
        formData.append("password", formValues.password);

        formData.append("bank_details_array", JSON.stringify(bankFormValues));
        formData.append("emergency_contact_details_array", JSON.stringify(emergencyContactData));
        
        formData.append("address_details", JSON.stringify(addressFormValues));
        formData.append("ocr_details", JSON.stringify(sendDocumentsArray));
       
        
        for (const key in formValues) {
            const value = formValues[key as keyof FormValues];
            if (value instanceof File)
                formData.append("file", value);
        }
        console.log(formData);

        try {
            const response = await fetch("/api/clientAdmin/addEmployee", {
                method: "POST",
                body: formData,

            });

            const res = await response.json();
            console.log(res);
            if (response.ok && res.status === 1) {

                // window.history.pushState({ addEmpCustidEmpId: { customer_id: 'John', emp_id: 1 } }, '', addUserAddressBankForm);
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
                    contextAddFormEmpID: res.data[0].emp_id,
                    contextAnnouncementID: '',
                    contextAddFormCustID: res.data[0].customer_id,
                    dashboard_notify_cust_id: '',
                    dashboard_notify_activity_related_id: '',
                    selectedClientCustomerID: '',
                    isAdmin: isAdmin,
                    contextPARAM8: '',

                });

                setIsMoreLoading(false);
                setShowAlert(true);
                setAlertTitle("Success");
                setAlertStartContent(formValues.firstName+" basic details added successfully.");
                setAlertForSuccess(1);
            } else {
                
                setIsMoreLoading(false);
                setShowAlert(true);
                setAlertTitle("Error");
                setAlertStartContent("Failed to add Basic Details of the employee");
                setAlertForSuccess(2);
                e.preventDefault();
            }
        } catch (error) {
            e.preventDefault();
            setIsMoreLoading(false);
            console.error("Error submitting form:", error);
            setShowAlert(true);
            setAlertTitle("Exception");
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2);
        }
    }
    // upload document


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={clientAdminDashboard} />
            </header>
            <LeftPannel menuIndex={leftMenuAddEmployeePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

                <form onSubmit={handleSubmit}>

                    <LoadingDialog isLoading={isMoreLoading}/>
        {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length>0?alertMidContent: ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        if(alertForSuccess === 1){
                            router.push(pageURL_addUserEmploymentForm);
                        }
                       
                        setShowAlert(false)
                    } } onCloseClicked={function (): void {
                        setShowAlert(false)
                    } } showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    
                    <div className="container" >
                        <div className="row">
                            <div className="col-lg-12 mb-4">
                                <div className="heading25">Upload <span>Documents</span></div>
                            </div>
                            <div className="col-lg-12 mb-5">
                                <div className="grey_box pb-2" style={{ backgroundColor: "#EEE0E0"}}>
                                    <div className="row">
                                        <div className="col-lg-12 mb-2" style={{ color: '#565656', fontSize: '13px' }}>Upload Your Personal Document here</div>
                                        <div className="col-lg-12">
                                            <div className="row">                                               
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">National ID: </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="nationalId" id="formFileSm" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.nationalId) {
                                                                        extractText(formValues.nationalId, "NationalID");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
                                                                        setAlertTitle("Error");
                                                                        setAlertStartContent("Please choose a file!");
                                                                        setAlertForSuccess(2);
                                                                        e.preventDefault();
                                                                    }
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">PAN Card:</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="panCard" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                            <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.panCard) {
                                                                        extractText(formValues.panCard, "PanCard");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
setAlertTitle("Error");
setAlertStartContent("Please choose a file!");
                setAlertForSuccess(2);
                e.preventDefault();
                                                                    }
                                                                }} />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">Passport</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="passport" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                            <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.passport) {
                                                                        extractText(formValues.passport, "Passport");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
setAlertTitle("Error");
setAlertStartContent("Please choose a file!");
                setAlertForSuccess(2);
                e.preventDefault();
                                                                    }
                                                                }} />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">Work Visa/Permit:</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="workVisa" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                            <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.workVisa) {
                                                                        extractText(formValues.workVisa, "WorkVisa");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
setAlertTitle("Error");
setAlertStartContent("Please choose a file!");
                setAlertForSuccess(2);
                e.preventDefault();
                                                                    }
                                                                }} />
                                                                </div>
                                                            
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">Driving License:</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="drivingLicense" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                            <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.drivingLicense) {
                                                                        extractText(formValues.drivingLicense, "DrivingLicense");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
setAlertTitle("Error");
setAlertStartContent("Please choose a file!");
                setAlertForSuccess(2);
                e.preventDefault();
                                                                    }
                                                                }} />
                                                                </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="row">
                                                    <div className="col-lg-12"></div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={showOCRExtractDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                                                    {showOCRExtractDialog && <DialogFetchedOCRData  onClose={() => { setShowOCRExtractDialog(false); } } onFetch={function (selectedData: OCRDataExtractedValues[],ispermanent:boolean): void {
                                    setSelectedOCRTextArray(selectedData);
                                    setOCRDataInForm(selectedData,ispermanent);
                                    setShowOCRExtractDialog(false);
                                    
                                } } fetchDataArray={ocrExtractedArray}  />}
                            </div>


                            <div className="col-lg-12 mb-5">
                                <div className="col-lg-12 mb-4">
                                    <div className="heading25">Personal <span>Information</span></div>
                                </div>
                                <div className="grey_box">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="add_form_inner">
                                                <div className="row">

                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 mb-4 inner_heading25">
                                                        Personal Information
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >First Name<span className='req_text'>*</span>:  </label>
                                                            <input type="text" className="form-control" 
                                                            onKeyPress={(e) => {
                                                                    if (!/^[A-Za-z\s]$/.test(e.key)) {
                                                                    e.preventDefault();
                                                                    }
                                                                }}
                                                            value={formValues.firstName} name="firstName" onChange={handleInputChange} id="firstName" placeholder="Enter First Name" />
                                                            {errors.firstName && <span className="error" style={{ color: "red" }}>{errors.firstName}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Middle Name:</label>
                                                            <input type="text" className="form-control" 
                                                            onKeyPress={(e) => {
                                                                    if (!/^[A-Za-z\s]$/.test(e.key)) {
                                                                    e.preventDefault();
                                                                    }
                                                                }}
                                                            id="exampleFormControlInput1" placeholder="Enter Middle Name" value={formValues.middleName} name="middleName" onChange={handleInputChange} />
                                                            {/* {errors.firstName && <span className="error" style={{ color: "red" }}>{errors.middleName}</span>} */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Last Name<span className='req_text'>*</span>:</label>
                                                            <input type="text" className="form-control" 
                                                            onKeyPress={(e) => {
                                                                    if (!/^[A-Za-z\s]$/.test(e.key)) {
                                                                    e.preventDefault();
                                                                    }
                                                                }}
                                                            id="exampleFormControlInput1" placeholder="Enter Last Name" value={formValues.lastName} name="lastName" onChange={handleInputChange} />
                                                            {errors.lastName && <span className="error" style={{ color: "red" }}>{errors.lastName}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">

                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Gender<span className='req_text'>*</span>:</label>
                                                            <select id="gender" name="gender" value={formValues.gender} onChange={handleInputChange}>
                                                                <option value="">--</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                            {errors.gender && <span className="error" style={{ color: "red" }}>{errors.gender}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Date of Birth<span className='req_text'>*</span>: </label>
                                                            <input type="date" id="date" name="dateOfBirth" max={dob18YearsPrior} value={formValues.dateOfBirth} onChange={handleInputChange} />
                                                            {errors.dateOfBirth && <span className='error' style={{ color: "red" }}>{errors.dateOfBirth}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Blood Group<span className='req_text'>*</span>: </label>
                                                            <select id="blood-group" name="bloodGroup" value={formValues.bloodGroup} onChange={handleInputChange}>
                                                                <option value="">Select Blood Group</option>
                                                                <option value="a-positive">A+</option>
                                                                <option value="a-negative">A-</option>
                                                                <option value="b-positive">B+</option>
                                                                <option value="b-negative">B-</option>
                                                                <option value="ab-positive">AB+</option>
                                                                <option value="ab-negative">AB-</option>
                                                                <option value="o-positive">O+</option>
                                                                <option value="o-negative">O-</option>
                                                                <option value="rare">Rare Blood Types</option>
                                                            </select>
                                                            {errors.bloodGroup && <span className='error' style={{ color: "red" }}>{errors.bloodGroup}</span>}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row">


                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Nationality<span className='req_text'>*</span>:</label>
                                                            <input type="text" className="form-control" 
                                                            onKeyPress={(e) => {
                                                                    if (!/^[A-Za-z\s]$/.test(e.key)) {
                                                                    e.preventDefault();
                                                                    }
                                                                }}
                                                            id="exampleFormControlInput1" value={formValues.nationality} name="nationality" onChange={handleInputChange} placeholder="Enter Nationality" />
                                                            {errors.nationality && <span className='error' style={{ color: "red" }}>{errors.nationality}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Marital Status<span className='req_text'>*</span>:</label>
                                                            <select id="maritial-status" name="maritalStatus" value={formValues.maritalStatus} onChange={handleInputChange}>
                                                                <option value="">--</option>
                                                                <option value="Single">Single</option>
                                                                <option value="Married">Married</option>
                                                            </select>
                                                            {errors.maritalStatus && <span className='error' style={{ color: "red" }}>{errors.maritalStatus}</span>}

                                                        </div>
                                                    </div>


                                                </div>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Contact Number<span className='req_text'>*</span>:</label>
                                                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Primary Number" value={formValues.contactPrimary} name="contactPrimary" inputMode="numeric" maxLength={12} onChange={(e)=>{
                                                                const onlyNums = e.target.value.replace(/\D/g, ""); // Remove all non-digits
                                                                                handleInputChange({
                                                                                target: {
                                                                                    name: e.target.name,
                                                                                    value: onlyNums
                                                                                }
                                                                                });}} />
                                                            <span>(Primary)</span>
                                                            {errors.contactPrimary && <span className='error' style={{ color: "red" }}>{errors.contactPrimary}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">&nbsp;</label>
                                                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Alternate Number" value={formValues.contactAlternate} name="contactAlternate" inputMode="numeric" maxLength={12} onChange={(e)=>{
                                                                const onlyNums = e.target.value.replace(/\D/g, ""); // Remove all non-digits
                                                                                handleInputChange({
                                                                                target: {
                                                                                    name: e.target.name,
                                                                                    value: onlyNums
                                                                                }
                                                                                });}} />
                                                            <span>(Alternate)</span>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">Email Address<span className='req_text'>*</span>:</label>
                                                            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Personal Email" value={formValues.emailPersonal} name="emailPersonal" onChange={handleInputChange} />
                                                            <span>(Personal)</span>
                                                            {errors.emailPersonal && <span className='error' style={{ color: "red" }}>{errors.emailPersonal}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="formFile" className="form-label">&nbsp;</label>
                                                            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Official Email" value={formValues.emailOfficial} name="emailOfficial" onChange={handleInputChange} />
                                                            <span>(Official)</span>
                                                            {errors.emailOfficial && <span className='error' style={{ color: "red" }}>{errors.emailOfficial}</span>}
                                                        </div>
                                                    </div>
                                                </div>





                                                <div className="row">
                                                    <div className="col-lg-3">
                                                        <div className="Form-fields">
                                                            <label htmlFor="password" className="Control-label Control-label--password">Set Password<span className='req_text'>*</span>:</label>
                                                            <a className="info_icon" >
                                                                <img src={staticIconsBaseURL+"/images/info.png"} alt="Information Icon" width={16} height={16} />
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

                                                    <div className="col-lg-3">
                                                        <div className="Form-fields" >
                                                            {/* Label for Confirm Password */}
                                                            <label htmlFor="password1" className="Control-label Control-label--password">
                                                                Confirm Password<span className='req_text'>*</span>:
                                                            </label>
                                                            {/* Checkbox for Show/Hide Password */}
                                                            <input
                                                                type="checkbox"
                                                                id="show-password1"
                                                                className="show-password"
                                                                checked={isConfirmPassChecked}
                                                                onChange={() => setConfirmPassChecked(!isConfirmPassChecked)}
                                                            />
                                                            <label htmlFor="show-password1" className="Control-label Control-label--showPassword">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 48 48"
                                                                    width="32"
                                                                    height="32"
                                                                    className="svg-toggle-password"
                                                                    aria-labelledby="toggle-password1-title"
                                                                >
                                                                    <title id="toggle-password1-title">Hide/Show Password</title>
                                                                    <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
                                                                    <rect
                                                                        x="20.133"
                                                                        y="2.117"
                                                                        height="44"
                                                                        transform="translate(23.536 -8.587) rotate(45)"
                                                                        className="closed-eye"
                                                                    />
                                                                    <rect
                                                                        x="22"
                                                                        y="3.984"
                                                                        width="4"
                                                                        height="44"
                                                                        transform="translate(25.403 -9.36) rotate(45)"
                                                                        style={{ fill: '#fff' }}
                                                                        className="closed-eye"
                                                                    />
                                                                </svg>
                                                            </label>
                                                            {/* Input for Password */}
                                                            <input
                                                                type="text"
                                                                id="password1"
                                                                placeholder=""
                                                                autoComplete="off"
                                                                autoCapitalize="off"
                                                                autoCorrect="off"

                                                                pattern=".{6,}"
                                                                className="ControlInput ControlInput--password"
                                                                value={formValues.confirmPassword} name="confirmPassword" onChange={handleInputChange}
                                                            />
                                                            {errors.confirmPassword && <span className='error' style={{ color: "red" }}>{errors.confirmPassword}</span>}

                                                        </div>


                                                    </div>


                                                </div>


                                                {/* <div className="row">
                                                    <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton/><input type="submit" value="Next" className="red_button" /></div>

                                                </div> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
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
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 1<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.current.currentAddressLineOne} name="currentAddressLineOne" onChange={(e) => handleAddressInputChange(e, "current")} id="currentAddressLineOne" placeholder="Flat, House no., Building, Apartment" />
                                                                            {addressErrors.currentAddressLineOne && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineOne}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 2<span className='req_text'>*</span>:  </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.current.currentAddressLineTwo} name="currentAddressLineTwo" onChange={(e) => handleAddressInputChange(e, "current")} id="currentAddressLineTwo" placeholder="Area, Sector, Street, Village" />
                                                                            {addressErrors.currentAddressLineTwo && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineTwo}</span>}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className='row'>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >City<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.current.currentCity} name="currentCity" onChange={(e) => handleAddressInputChange(e, "current")} id="currentCity" placeholder="City" />
                                                                            {addressErrors.currentCity && <span className='error' style={{ color: "red" }}>{addressErrors.currentCity}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >State<span className='req_text'>*</span>:  </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.current.currentState} name="currentState" onChange={(e) => handleAddressInputChange(e, "current")} id="currentState" placeholder="State" />
                                                                            {addressErrors.currentState && <span className='error' style={{ color: "red" }}>{addressErrors.currentState}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Postal Code<span className='req_text'>*</span>:</label>
                                                                            <input type="text" className="form-control" value={addressFormValues.current.currentPostalCode} name="currentPostalCode" onChange={(e) => handleAddressInputChange(e, "current")} id="currentPostalCode" placeholder="Pincode" />
                                                                            {addressErrors.currentPostalCode && <span className='error' style={{ color: "red" }}>{addressErrors.currentPostalCode}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Country<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.current.currentCountry} name="currentCountry" onChange={(e) => handleAddressInputChange(e, "current")} id="currentCountry" placeholder="Country" />
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
                                                                                <label htmlFor='sameadd' onClick={(e)=>{
                                                                                    isBothAddressSame?setBothAddressSame(false):setBothAddressSame(true);
                                                                                    sameAddress(isBothAddressSame?false:true)
                                                                                    }}>Copy Current Address</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='row'>
                                                                    <div className="col-md-6">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 1<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.permanent.currentAddressLineOne} name="currentAddressLineOne" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentAddressLineOne" placeholder="Flat, House no., Building, Apartment" />
                                                                            {addressErrors.currentAddressLineOne && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineOne}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 2<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.permanent.currentAddressLineTwo} name="currentAddressLineTwo" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentAddressLineTwo" placeholder="Area, Sector, Street, Village" />
                                                                            {addressErrors.currentAddressLineTwo && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineTwo}</span>}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className='row'>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >City<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.permanent.currentCity} name="currentCity" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentCity" placeholder="City" />
                                                                            {addressErrors.currentCity && <span className='error' style={{ color: "red" }}>{addressErrors.currentCity}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >State<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.permanent.currentState} name="currentState" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentState" placeholder="State" />
                                                                            {addressErrors.currentState && <span className='error' style={{ color: "red" }}>{addressErrors.currentState}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Postal Code<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.permanent.currentPostalCode} name="currentPostalCode" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentPostalCode" placeholder="Pincode" />
                                                                            {addressErrors.currentPostalCode && <span className='error' style={{ color: "red" }}>{addressErrors.currentPostalCode}</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        <div className="form_box mb-3">
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Country<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" value={addressFormValues.permanent.currentCountry} name="currentCountry" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentCountry" placeholder="Country" />
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
                                    <div className="col-lg-1" ><div className="fontRed15" style={{ cursor: isMoreLoading ? "loading" : "pointer"}} onClick={() => { setIsMoreLoading(true); addEmergencyContactUI() }}><span>Add More</span></div></div>
                                </div>
                                {emergencyContactData.map((ContactData, index) =>
                                    <div className='row' key={index}>

                                        <div className='col-lg-12 mb-4'>
                                            <div className='grey_box'>
                                                {index > 0 && <div className='row mb-2'>
                                                    <div className='col-lg-12'>
                                                        <div className="fontRed15" style={{ cursor: isMoreLoading ? "loading" : "pointer", textAlign: "right" }} onClick={() => {
                                                            setIsMoreLoading(true);
                                                            if (ContactData.emergencyContactName || ContactData.emergencyContactNumber || ContactData.emergencyContactRelationID) {
                                                                setShowDeleteDialog(true);
                                                                setToBeDeletedIndex(index);
                                                                setDeleteType(emegencyDeleteType);

                                                            } else {
                                                                setEmergencyContactData((prev) =>
                                                                    prev.filter((_, i) => i !== index)
                                                                );
                                                            }
                                                            setIsMoreLoading(false)
                                                        }}>
                                                            <span>Remove</span></div>

                                                    </div></div>}
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Name{index==0 && <span className='req_text'>*</span>}: </label>
                                                            <input type="text" className="form-control" 
                                                            onKeyPress={(e) => {
                                                                    if (!/^[A-Za-z\s]$/.test(e.key)) {
                                                                    e.preventDefault();
                                                                    }
                                                                }}
                                                            value={ContactData.emergencyContactName} name="emergencyContactName" onChange={(e) => handleEmergencyContactChange(e, index)} id="emergencyContactName" placeholder="Name" />
                                                            {emergencyContactError.emergencyContactName && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactName}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Number{index==0 && <span className='req_text'>*</span>}: </label>
                                                            <input type="text" className="form-control" onKeyDown={(e) => {
                                                                if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
                                                                    e.preventDefault();
                                                                }
                                                            }} value={ContactData.emergencyContactNumber} name="emergencyContactNumber" onChange={(e) => handleEmergencyContactChange(e, index)} id="emergencyContactNumber" placeholder="Mobile Number" maxLength={12}/>
                                                            {emergencyContactError.emergencyContactNumber && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactNumber}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form_box mb-3">
                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >Relation{index==0 && <span className='req_text'>*</span>}: </label>
                                                            <select id="emergencyContactRelationID" name="emergencyContactRelationID" value={ContactData.emergencyContactRelationID} onChange={(e) => handleEmergencyContactChange(e, index)}>
                                                                <option value="">--</option>
                                                                {emergencyContactRelation.map((sal, index) => (
                                                                    <option value={sal.id} key={sal.id}>{sal.relation_type}</option>
                                                                ))}
                                                            </select>
                                                            {emergencyContactError.emergencyContactRelationID && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactRelationID}</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                )}
                                {/* Bank Details */}
                                <div className="col-lg-12 mb-5">
                                <div className="grey_box pb-2" style={{ backgroundColor: "#EEE0E0"}}>
                                    <div className="row">
                                        <div className="col-lg-12 mb-2" style={{ color: '#565656', fontSize: '13px' }}>Upload Your Personal Document here</div>
                                        <div className="col-lg-12">
                                            <div className="row">                                               
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">Bank book: </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="bankbook" id="formFileSm" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.bankbook) {
                                                                        extractText(formValues.bankbook, 'BankBook');
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
                                                                        setAlertTitle("Error");
                                                                        setAlertStartContent("Please choose a file!");
                                                                        setAlertForSuccess(2);
                                                                        e.preventDefault();
                                                                    }
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">Cheque:</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="cheque" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                            <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.cheque) {
                                                                        extractText(formValues.cheque, "Cheque");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
                                                                        setAlertTitle("Error");
                                                                        setAlertStartContent("Please choose a file!");
                                                                        setAlertForSuccess(2);
                                                                        e.preventDefault();
                                                                    }
                                                                }} />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="upload_list">
                                                        <div className="row">
                                                            <div className="col-lg-12 mb-1">Bank Statement:</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-9">
                                                                <input type="file" className="upload_document" name="bankStatement" onChange={handleInputChange} />
                                                            </div>
                                                            <div className="col-lg-3">
                                                            <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
                                                                    if (formValues.bankStatement) {
                                                                        extractText(formValues.bankStatement, "BankStatement");
                                                                        // readImageText(files[0])
                                                                    }else{
                                                                        setShowAlert(true);
                                                                        setAlertTitle("Error");
                                                                        setAlertStartContent("Please choose a file!");
                                                                        setAlertForSuccess(2);
                                                                        e.preventDefault();
                                                                    }
                                                                }} />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="row formTitlebottomBorder mb-3">
                                    <div className="col-lg-11">
                                        <div className="Font25noBorder">Bank Account <span>Details</span></div>
                                    </div>
                                    <div className="col-lg-1" ><div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => { setIsMoreLoading(true); addBankDetailsContactUI() }}><span>Add More</span></div></div>

                                </div>
                                {bankFormValues.map((bankForm, index) =>
                                    <div className='row' key={index}>
                                        <div className='col-lg-12 mb-3'>
                                            <div className='grey_box'>
                                                {index > 0 && <div className='row mb-2'>
                                                    <div className='col-lg-12 text-right'>
                                                        <div className="fontRed15" style={{ cursor: isMoreLoading ? "loading" : "pointer", textAlign: "right" }} onClick={() => {
                                                            setIsMoreLoading(true);
                                                            if (checkIndexHasValue(index)) {
                                                                setToBeDeletedIndex(index);
                                                                setShowDeleteDialog(true),
                                                                    setDeleteType(bankInfoDeleteType),
                                                                    setIsMoreLoading(false)
                                                            } else {
                                                                setBankValues((prev) =>
                                                                    prev.filter((_, i) => i !== index)
                                                                );
                                                            }
                                                            setIsMoreLoading(false);
                                                        }}>

                                                            <span>Remove</span></div>

                                                    </div></div>}
                                                <div className='row'>
                                                    <div className='col-lg-12'>
                                                        <div className='add-form-inner'>

                                                            <div className='row'>
                                                                {bankForm.form_values.map((form, formValueIndex) =>
                                                                    <div className="col-md-4" key={form.id}>
                                                                        <div className="form_box mb-3">
                                                                        {/* <label htmlFor="exampleFormControlInput1" className="form-label" >{form.component_name}{index==0 && <span className='req_text'>*</span>}: </label> */}
                                                                            <label htmlFor="exampleFormControlInput1" className="form-label" >{form.component_name}<span className='req_text'>*</span>: </label>
                                                                            <input type="text" className="form-control" onKeyPress={(e) => {
                                                                                if (form.data_type === 2 && !/[0-9]/.test(e.key)) {
                                                                                    e.preventDefault(); // block non-numeric input 
                                                                                }
                                                                            }} value={form.value} name={form.component_name} onChange={(e) => handleBankDataChange(e, index, formValueIndex)} id={form.component_name} />
                                                                            {bankErrors.component_name && <span className='error' style={{ color: "red" }}>{bankErrors.component_name}</span>}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                                {showDeleteDialog && <RemoveAddEmpFormContactOrBankData onCancel={() => { setShowDeleteDialog(false) }} onOK={() => { setShowDeleteDialog(false); removeAtIndex(); setToBeDeletedIndex(-1) }} deleteType={deleteType} />}

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12" style={{ textAlign: "right" }}><input type="submit" value="Next" className="red_button" /></div>
                        </div>
                    </div>
                    
                </form>
            } />
            < Footer />
        </div>
    )
}

export default AddEmployeeBasicDetails



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
async function getBankFormComponents() {

    let query = supabase
        .from('leap_client_bank_details_components')
        .select("id,component_name,data_type");

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {

        return data;
    }
}


////// nikhil code before swapnil design changes



// import Footer from '@/app/components/footer';
// import LeapHeader from '@/app/components/header'
// import LeftPannel from '@/app/components/leftPannel'

// import React, { useEffect, useState } from 'react'
// import { createWorker } from 'tesseract.js';
// import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { error } from 'console';

// import { clientAdminDashboard, ocrComponent_DateOfBirth, ocrComponent_FirstName, ocrComponent_Gender, ocrComponent_IDNumber, ocrComponent_LastName, ocrComponent_MiddleName, ocrComponent_Nationality } from '@/app/pro_utils/stringConstants';
// import { pageURL_addUserAddressBankForm, leftMenuAddEmployeePageNumbers, pageURL_addUserEmploymentForm, pageURL_userEmpDashboard } from '@/app/pro_utils/stringRoutes';
// import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
// import Tesseract from 'tesseract.js';
// import BackButton from '@/app/components/BackButton';
// import Component_AddEmpAddressBankDetails from '@/app/components/addEmployeeAddressAndBankdetails';
// import validator from 'validator';
// import RemoveAddEmpFormContactOrBankData from '@/app/components/dialog_RemoveEmpFormContactBank';
// import DialogFetchedOCRData from '@/app/components/dialog_fetchOCRData';




// interface FormValues {
//     firstName: string;
//     middleName: string;
//     lastName: string;
//     employeePhoto: File | null;
//     dateOfBirth: string;
//     bloodGroup: string;
//     nationality: string;
//     gender: string;
//     maritalStatus: string;
//     contactPrimary: string;
//     contactAlternate: string;
//     emailPersonal: string;
//     emailOfficial: string;
//     password: string;
//     confirmPassword: string;

//     nationalId: File | null;
//     panCard: File | null;
//     passport: File | null;
//     workVisa: File | null;
//     drivingLicense: File | null;
// }


// interface address {
//     current: addressFormValues,
//     permanent: addressFormValues
// }
// interface addressFormValues {
//     currentAddressLineOne: string,
//     currentAddressLineTwo: string,
//     currentCity: string,
//     currentState: string,
//     currentPostalCode: string,
//     currentCountry: string,
//     latlng: string,
// }

// interface bankFormComponents {
//     id: number,
//     component_name: string,
//     data_type: number

// }
// interface bankForm {
//     bank_data: number
//     form_values: BankFormValues[]

// }
// interface BankFormValues {
//     id: number,
//     component_name: string,
//     data_type: number
//     value: string,
// }
// interface EmergencyContactData {
//     emergencyContactName: string,
//     emergencyContactNumber: string,
//     emergencyContactRelationID: string,
// }



// const AddEmployeeBasicDetails = () => {
//     const searchParams = useSearchParams();
//     const roleId = searchParams.get('role_id');
//     const clientId = searchParams.get('client_id');
//     const [selectedGender, setGender] = useState("Male");
//     const [selectedMaritialStatus, setMaritialStatus] = useState("Single");
//     const [isChecked, setIsChecked] = useState(true);
//     const [isConfirmPassChecked, setConfirmPassChecked] = useState(true);

//     const [selectedImage, setSelectedImage] = useState<File | null>(null);
//     const [ocrResult, setOcrResult] = useState<string>('');
//     const [ocrStatus, setOcrStatus] = useState<string>('');
//     const router = useRouter()
//     const [dob18YearsPrior, setdob18YearsPrior] = useState('');

//     const { contextClientID, contaxtBranchID, contextCompanyName, contextCustomerID, contextEmployeeID,
//         contextLogoURL, contextRoleID, contextProfileImage, contextUserName,
//         setGlobalState } = useGlobalContext();

//     const [emergencyContactRelation, setEmergencyRelation] = useState<LeapRelationComponents[]>([]);
//     const [scrollPosition, setScrollPosition] = useState(0);
//     const [isMoreLoading, setIsMoreLoading] = useState(true);
//     const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//     const [isBothAddressSame, setBothAddressSame] = useState(false);
//     const [deleteType, setDeleteType] = useState("");
//     const [toBeDeletedIndex, setToBeDeletedIndex] = useState(-1);
//     const emegencyDeleteType = "Emergency Contact", bankInfoDeleteType = "Bank Details";
//     const [showOCRExtractDialog, setShowOCRExtractDialog] = useState(false);
//     const [ocrExtractedArray, setOCRExtractedArray] = useState<OCRDataExtractedValues[]>([]);
//     const [selectedOCRTextArray, setSelectedOCRTextArray] = useState<OCRDataExtractedValues[]>([]);


//     useEffect(() => {
//         const today = new Date();
//         const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
//         const maxDate = eighteenYearsAgo.toISOString().split("T")[0];
//         setdob18YearsPrior(maxDate)
//         const fetchData = async () => {
//             const relations = await getRelations();
//             setEmergencyRelation(relations);
//             const bankFormComponents = await getBankFormComponents();
//             const singleFormComoponent: bankFormComponents[] = []
//             const singleFormComoponentValues: BankFormValues[] = []
//             for (let i = 0; i < bankFormComponents.length; i++) {
//                 singleFormComoponent.push({
//                     id: bankFormComponents[i].id,
//                     component_name: bankFormComponents[i].component_name,
//                     data_type: bankFormComponents[i].data_type
//                 })
//                 singleFormComoponentValues.push({
//                     id: bankFormComponents[i].id,
//                     component_name: bankFormComponents[i].component_name,
//                     data_type: bankFormComponents[i].data_type,
//                     value: ''
//                 })
//             }
//             setBankComponents(singleFormComoponent)
//             const bankValues: bankForm[] = [{
//                 bank_data: 0,
//                 form_values: singleFormComoponentValues
//             }]
//             setBankValues(bankValues)
//             // setEmergencyRelation(relations);


//         };
//         fetchData();
//         const handleScroll = () => {
//             setScrollPosition(window.scrollY); // Update scroll position
//             const element = document.querySelector('.mainbox');
//             if (window.pageYOffset > 0) {
//                 element?.classList.add('sticky');
//             } else {
//                 element?.classList.remove('sticky');
//             }
//         };

//         // Call fetchActivities every 5 seconds


//         window.addEventListener('scroll', handleScroll);
//         return () => {

//             window.removeEventListener('scroll', handleScroll);
//         };

//         //   setActivities(activies);
//     }, []);


//     const [addressFormValues, setFormData] = useState<address>({
//         current: {
//             currentAddressLineOne: "",
//             currentAddressLineTwo: "",
//             currentCity: "",
//             currentState: "",
//             currentPostalCode: "",
//             currentCountry: "",
//             latlng: "",
//         },
//         permanent: {
//             currentAddressLineOne: "",
//             currentAddressLineTwo: "",
//             currentCity: "",
//             currentState: "",
//             currentPostalCode: "",
//             currentCountry: "",
//             latlng: "",
//         },
//     });
//     const [bankFormComponents, setBankComponents] = useState<bankFormComponents[]>([]);
//     const [bankFormValues, setBankValues] = useState<bankForm[]>([{
//         bank_data: 0,
//         form_values: [{
//             id: 0,
//             component_name: '',
//             data_type: 0,
//             value: ''

//         }]
//     }]);

//     const [emergencyContactData, setEmergencyContactData] = useState<EmergencyContactData[]>([{
//         emergencyContactName: "",
//         emergencyContactNumber: "",
//         emergencyContactRelationID: "",
//     }])

//     const [addressErrors, setAddressErrors] = useState<Partial<addressFormValues>>({});
//     const [bankErrors, setBankErrors] = useState<Partial<BankFormValues>>({});
//     const [emergencyContactError, setEmergencyContactError] = useState<Partial<EmergencyContactData>>({});

//     const handleAddressInputChange = (
//         e: React.ChangeEvent<HTMLInputElement>,
//         section: keyof address
//     ) => {
//         const { name, value } = e.target;

//         setFormData((prevData) => ({
//             ...prevData,
//             [section]: {
//                 ...prevData[section], // Assert section type
//                 [name as keyof addressFormValues]: value, // Assert name type
//             },
//         }));
//         if(isBothAddressSame && section=="current"){
//             setFormData((prevData) => ({
//                 ...prevData,
//                 ["permanent"]: {
//                     ...prevData[section], // Assert section type
//                     [name as keyof addressFormValues]: value, // Assert name type
//                 },
//             }));
//         }else if(isBothAddressSame && section=="permanent"){
//             setFormData((prevData) => ({
//                 ...prevData,
//                 ["current"]: {
//                     ...prevData[section], // Assert section type
//                     [name as keyof addressFormValues]: value, // Assert name type
//                 },
//             }));
//         }
//     };
//     const handleEmergencyContactChange = (e: any, index: any) => {
//         const { name, value, } = e.target;

//         setEmergencyContactData(prev => {
//             const updated = [...prev]; // clone array
//             updated[index] = { ...updated[index], [name]: value }; // update specific item
//             return updated;
//         });

//     };
//     const checkIndexHasValue = (index: number) => {
//         let hasValue = false;
//         for (let i = 0; i < bankFormValues[index].form_values.length; i++) {

//             if (bankFormValues[index].form_values[i].value.trim().length > 0) {

//                 hasValue = true;
//             }
//         }
//         return hasValue;
//     }
//     const handleBankDataChange = (
//         e: React.ChangeEvent<HTMLInputElement>,
//         outerIndex: number,
//         formValueIndex?: number // optional
//     ) => {
//         const { name, value } = e.target;

//         setBankValues(prev => {
//             const updated = [...prev];

//             // Update top-level fields (bankName, ifscCode, etc.)
//             if (formValueIndex === undefined) {
//                 updated[outerIndex] = {
//                     ...updated[outerIndex],
//                     [name]: value
//                 };
//             }
//             // Update nested form_values
//             else {
//                 const updatedFormValues = [...updated[outerIndex].form_values];
//                 updatedFormValues[formValueIndex] = {
//                     ...updatedFormValues[formValueIndex],
//                     value: value
//                 };
//                 updated[outerIndex] = {
//                     ...updated[outerIndex],
//                     form_values: updatedFormValues
//                 };
//             }

//             return updated;
//         });
//     };
//     const removeAtIndex = () => {
//         if (deleteType == emegencyDeleteType) {
//             setEmergencyContactData(prevItems => prevItems.filter((_, i) => i !== toBeDeletedIndex));
//         } else {
//             setBankValues(prevItems => prevItems.filter((_, i) => i !== toBeDeletedIndex));
//         }
//     };

//     const addEmergencyContactUI = () => {
//         const currentDataArray: EmergencyContactData[] = emergencyContactData;
//         currentDataArray.push({
//             emergencyContactName: '',
//             emergencyContactNumber: '',
//             emergencyContactRelationID: ''
//         })
//         setEmergencyContactData(currentDataArray);
//         setIsMoreLoading(false)
//     }

//     const addBankDetailsContactUI = () => {

//         const bankDataArray: BankFormValues[] = [];
//         const newArray = bankFormValues;

//         for (let i = 0; i < bankFormComponents.length; i++) {
//             bankDataArray.push({
//                 id: bankFormComponents[i].id,
//                 component_name: bankFormComponents[i].component_name,
//                 data_type: bankFormComponents[i].data_type,
//                 value: ''
//             })
//         }
//         newArray.push(
//             {
//                 bank_data: bankFormValues.length + 1,
//                 form_values: bankDataArray,
//             }
//         )
//         setBankValues(newArray)

//         setIsMoreLoading(false);

//     }


//     const setOCRDataInForm = (selectedData:OCRDataExtractedValues[]) => {
//         for(let i=0;i<selectedData.length;i++){
//             if(selectedData[i].component_name==ocrComponent_FirstName){
//                 setFormValues((prev) => ({ ...prev, ["firstName"]: selectedData[i].value }));
//             }
//             if(selectedData[i].component_name==ocrComponent_MiddleName){
//                 setFormValues((prev) => ({ ...prev, ["middleName"]: selectedData[i].value }));
//             }
//             if(selectedData[i].component_name==ocrComponent_LastName){
//                 setFormValues((prev) => ({ ...prev, ["lastName"]: selectedData[i].value }));
//             }
//             if(selectedData[i].component_name==ocrComponent_DateOfBirth){
//                 setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: selectedData[i].value }));
//             }
//             if(selectedData[i].component_name==ocrComponent_Gender){
//                 setFormValues((prev) => ({ ...prev, ["gender"]: selectedData[i].value }));
//             }
//             // if(selectedData[i].component_name==ocrComponent_IDNumber){
//             //     setFormValues((prev) => ({ ...prev, ["firstName"]: selectedData[i].value }));
//             // }
//             if(selectedData[i].component_name==ocrComponent_Nationality){
//                 setFormValues((prev) => ({ ...prev, ["nationality"]: selectedData[i].value }));
//             }
//         }
        
//     }
//     const sameAddress = () => {
//         if(isBothAddressSame){
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["currentAddressLineOne"]: addressFormValues.current.currentAddressLineOne
//             }
//         }));
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["currentAddressLineTwo"]: addressFormValues.current.currentAddressLineTwo
//             }
//         }));
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["currentCity"]: addressFormValues.current.currentCity
//             }
//         }));
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["currentState"]: addressFormValues.current.currentState
//             }
//         }));
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["currentPostalCode"]: addressFormValues.current.currentPostalCode
//             }
//         }));
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["currentCountry"]: addressFormValues.current.currentCountry
//             }
//         }));
//         setFormData((prevData) => ({
//             ...prevData,
//             ["permanent"]: {
//                 ...prevData["permanent"], ["latlng"]: addressFormValues.current.latlng
//             }
//         }));
//         }
//     }


//     const extractText = async (file: File, imageType: any) => {
//         try {
//             const { data } = await Tesseract.recognize(file, "eng");
//             // setExtractedText(data.text);
//             parseText(data.text, imageType);
//         } catch (error) {
//             console.error("OCR Extraction Error:", error);
//         }
//     };

//     const parseText = (text: any, imageType: any) => {
//         console.log("Extracted Text:", text);
//         console.log("Image Type:", imageType);
//         const extractedDataArray:OCRDataExtractedValues[]=[];
//         let nameMatch = '';
//         // Name detection (Assumes "Name:" or similar format)
//         // Apply regex to extract details
//         // Extract Name
//         if (text.match(/Name[:\s]*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/)) {
//             nameMatch = text.match(/Name[:\s]*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
//         } else if (text.match(/N[ae]me:\s*([^\n]+)/i)) {
//             nameMatch = text.match(/N[ae]me:\s*([^\n]+)/i);
//         }
//         else if (text.match(/n[ae]me\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})/i)) {
//             nameMatch = text.match(/n[ae]me\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})/i);
//         }
//         else if (text.match(/\n([A-Z]+\s[A-Z\s]+)\n/)) {
//             nameMatch = text.match(/\n([A-Z]+\s[A-Z\s]+)\n/);
//         }
//         else if (text.match(/\n([A-Z]+\s[A-Z]+)\n/)) {
//             nameMatch = text.match(/\n([A-Z]+\s[A-Z]+)\n/);
//         }
//         else if (text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/)) {
//             nameMatch = text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/);
//         }
//         else if (text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/)) {
//             nameMatch = text.match(/\b([A-Z]+(?:\s[A-Z]+)+)\s*\.\s*\n[A-Z]+\s[A-Z]+\b/);
//         }
//         else if (text.match(/\b(?:Name|Holder|Employee|Permit Holder)[:\s]+([A-Z][A-Za-z]+\s[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*)\b/)) {
//             nameMatch = text.match(/\b(?:Name|Holder|Employee|Permit Holder)[:\s]+([A-Z][A-Za-z]+\s[A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*)\b/);
//         }
//         else {
//             nameMatch = text.match(/\n([A-Za-z\s]+)\n/);
//         }

//         let extractedName = nameMatch[1];

//         let nameArray: any[] = []
//         if (extractedName.includes(" ") && !extractedName.includes("\n")) {
//             nameArray = extractedName.split(" ");
//         }
//         if (extractedName.includes(" ")) {
//             nameArray = extractedName.split(" ");
//         }
//         console.log("Name From OCR --------------------------", extractedName);

//         if (nameArray.length == 4) {
//             extractedDataArray.push({
//                 component_name:ocrComponent_FirstName,
//                 value: nameArray[0]
//             })
//             extractedDataArray.push({
//                 component_name:ocrComponent_MiddleName,
//                 value: nameArray[1]
//             })
//             extractedDataArray.push({
//                 component_name:ocrComponent_LastName,
//                 value: nameArray[2] + nameArray[3]
//             })
//             // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));
//             // setFormValues((prev) => ({ ...prev, ["middleName"]: nameArray[1] }));
//             // setFormValues((prev) => ({ ...prev, ["lastName"]: nameArray[2] + nameArray[3] }));
//         }
//         if (nameArray.length == 3) {
//             extractedDataArray.push({
//                 component_name:ocrComponent_FirstName,
//                 value: nameArray[0]
//             })
//             extractedDataArray.push({
//                 component_name:ocrComponent_MiddleName,
//                 value: nameArray[1]
//             })
//             extractedDataArray.push({
//                 component_name:ocrComponent_LastName,
//                 value: nameArray[2]
//             })
//             // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));
//             // setFormValues((prev) => ({ ...prev, ["middleName"]: nameArray[1] }));
//             // setFormValues((prev) => ({ ...prev, ["lastName"]: nameArray[2] }));
//         } else if (nameArray.length == 2) {
//             extractedDataArray.push({
//                 component_name:ocrComponent_FirstName,
//                 value: nameArray[0]
//             })
//             extractedDataArray.push({
//                 component_name:ocrComponent_LastName,
//                 value: nameArray[1]
//             })
//             // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));
//             // setFormValues((prev) => ({ ...prev, ["lastName"]: nameArray[1] }));

//         } else if (nameArray.length == 1) {
//             extractedDataArray.push({
//                 component_name:ocrComponent_FirstName,
//                 value: extractedName
//             })
//             // setFormValues((prev) => ({ ...prev, ["firstName"]: nameArray[0] }));

//         } else {
//             extractedDataArray.push({
//                 component_name:ocrComponent_FirstName,
//                 value: extractedName
//             })
//             // setFormValues((prev) => ({ ...prev, ["firstName"]: extractedName }));
//         }
//         let dobMatch1 = ''
//         if (text.match(/DOB\s*:\s*(\d{2}\/\d{2}\/\d{4})/i)) {
//             dobMatch1 = text.match(/DOB\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
//             console.log("if condition OCR DOB==========", dobMatch1[0]);
//             const dateStr = dobMatch1[0].split(" ").length == 3 ? dobMatch1[0].split(" ")[2] : dobMatch1[0].split(" ").length == 2 ? dobMatch1[0].split(" ")[1] : dobMatch1[0];
//             const [day, month, year] = dateStr.split("/")
//             extractedDataArray.push({
//                 component_name:ocrComponent_DateOfBirth,
//                 value: `${year}-${month}-${day}`
//             })
//             // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));
//         } else if (text.includes("Date of Birth")) {

//             dobMatch1 = text.match(/Date\s*of\s*Birth:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
//             console.log("if condition 1 OCR DOB==========", dobMatch1[0]);
//             const split1 = dobMatch1[0].split(":");

//             const [day, month, year] = split1[1].trim().split("/")
//             extractedDataArray.push({
//                 component_name:ocrComponent_DateOfBirth,
//                 value: `${year}-${month}-${day}`
//             })
//             // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));

//         } else if (text.match(/(\d{2}\/\d{2}\/\d{4})/g)) {
//             dobMatch1 = text.match(/(\d{2}\/\d{2}\/\d{4})/g)
//             console.log("if condition 2 OCR DOB==========", dobMatch1[0]);

//             const [day, month, year] = dobMatch1[0].trim().split("/")
//             extractedDataArray.push({
//                 component_name:ocrComponent_DateOfBirth,
//                 value: `${year}-${month}-${day}`
//             })
//             // setFormValues((prev) => ({ ...prev, ["dateOfBirth"]: `${year}-${month}-${day}` }));
//         }


//         console.log(formValues.dateOfBirth);
//         // Gender detection (Male / Female / M / F)
//         const genderMatch = text.match(/\b(Male|Female|M|F)\b/i);
//         const gender = genderMatch ? genderMatch[0] : "";
//         console.log("Gender From OCR --------------------------", gender);
//         if (gender.length > 0) {
//             extractedDataArray.push({
//                 component_name:ocrComponent_Gender,
//                 value: gender == "MALE" ? "Male" : gender == "FEMALE" ? "Female" : ""
//             })
//             // setFormValues((prev) => ({ ...prev, ["gender"]: gender == "MALE" ? "Male" : gender == "FEMALE" ? "Female" : "" }));
//         }
//         // Aadhar Number detection (12-digit format)
//         let idNumberMatch = "";
//         if (text.match(/\b\d{4}\s\d{4}\s\d{4}\b/)) {
//             idNumberMatch = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
//         } else if (text.match(/(\d{3}-\d{4}-\d{7}-\d)/)) {
//             idNumberMatch = text.match(/(\d{3}-\d{4}-\d{7}-\d)/)
//         } else if (text.match(/\b\d{6,}\b/)) {
//             idNumberMatch = text.match(/\b\d{6,}\b/)
//         }
//         const idNumber = idNumberMatch[0];
//         extractedDataArray.push({
//             component_name:ocrComponent_IDNumber,
//             value:idNumberMatch[0]
//         })
//         console.log("IDNUMBER From OCR --------------------------", idNumber);
//         let nationality = "";
//         if (text.match(/\bNationality\s+([A-Za-z\s]+)/i)) {
//             nationality = text.match(/\bNationality\s+([A-Za-z\s]+)/i);
//         }
//         else if (text.match(/Nationality\s*:\s*([A-Za-z\s]+)/i)) {
//             nationality = text.match(/Nationality\s*:\s*([A-Za-z\s]+)/i);
//         }
//         else if (text.match(/nality\s*:\s*([A-Za-z\s]+)/i)) {
//             nationality = text.match(/nality\s*:\s*([A-Za-z\s]+)/i);
//         }
//         extractedDataArray.push({
//             component_name:ocrComponent_Nationality,
//             value:nationality
//         })
//         // setFormValues((prev) => ({ ...prev, ["nationality"]: nationality }));
//         if(extractedDataArray.length>0){
//             setShowOCRExtractDialog(true);
//             setOCRExtractedArray(extractedDataArray);
//         }else{
//             alert("No data extracted")
//         }
        
//     };

//     const [formValues, setFormValues] = useState<FormValues>({
//         firstName: "",
//         middleName: "",
//         lastName: "",
//         employeePhoto: null,
//         dateOfBirth: "",
//         bloodGroup: "",
//         nationality: "",
//         gender: "",
//         maritalStatus: "",
//         contactPrimary: "",
//         contactAlternate: "",
//         emailPersonal: "",
//         emailOfficial: "",
//         password: "",
//         confirmPassword: "",
//         nationalId: null,
//         panCard: null,
//         passport: null,
//         workVisa: null,
//         drivingLicense: null,

//     });

//     const [errors, setErrors] = useState<Partial<FormValues>>({});

//     const validate = () => {
//         const newErrors: Partial<FormValues> = {};

//         if (!formValues.firstName) newErrors.firstName = "First Name is required";
//         if (!formValues.middleName) newErrors.middleName = "Middle Name is required";
//         if (!formValues.lastName) newErrors.lastName = "Last Name is required";
//         if (!formValues.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
//         if (!formValues.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
//         if (!formValues.gender) newErrors.gender = "Gender is required";
//         if (!formValues.nationality) newErrors.nationality = "Nationality is required";
//         if (!formValues.maritalStatus) newErrors.maritalStatus = "Marital status is required";
//         if (!formValues.contactPrimary) newErrors.contactPrimary = "Primary Contact is required";
//         if (!formValues.emailPersonal) newErrors.emailPersonal = "Personal Email is required";
//         if (!formValues.emailOfficial) newErrors.emailOfficial = "Official Email is required";
//         if (!formValues.password) newErrors.password = "Password is required";
//         if (formValues.password !== formValues.confirmPassword)
//             newErrors.confirmPassword = "Passwords do not match";

//         const phoneRegex = /^[6-9]\d{9}$/;
//         if (!formValues.contactPrimary || !phoneRegex.test(formValues.contactPrimary)) {
//             newErrors.contactPrimary = "Valid primary contact number is required";
//         }
//         if (formValues.contactAlternate && !phoneRegex.test(formValues.contactAlternate)) {
//             newErrors.contactAlternate = "Enter a valid alternate contact number";
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!formValues.emailPersonal || !emailRegex.test(formValues.emailPersonal)) {
//             newErrors.emailPersonal = "Valid personal email is required";
//         }
//         if (formValues.emailOfficial && !emailRegex.test(formValues.emailOfficial)) {
//             newErrors.emailOfficial = "Enter a valid official email address";
//         }

//         if (!formValues.password || formValues.password.length < 6) {
//             newErrors.password = "Password must be at least 6 characters long";
//         }
//         if (formValues.password !== formValues.confirmPassword) {
//             newErrors.confirmPassword = "Passwords do not match";
//         }
//         const addressDetailsErrors: Partial<addressFormValues> = {};

//         if (!addressFormValues.current.currentAddressLineOne) addressDetailsErrors.currentAddressLineOne = "Address Line 1 is required";
//         if (!addressFormValues.current.currentAddressLineTwo) addressDetailsErrors.currentAddressLineTwo = "Address Line 2 is required";
//         if (!addressFormValues.current.currentCity) addressDetailsErrors.currentCity = "City is required";
//         if (!addressFormValues.current.currentState) addressDetailsErrors.currentState = "State is required";
//         if (!addressFormValues.current.currentPostalCode) addressDetailsErrors.currentPostalCode = "Postal Code is required";
//         if (!addressFormValues.current.currentCountry) addressDetailsErrors.currentCountry = "Country is required";

//         if (!addressFormValues.permanent.currentAddressLineOne) addressDetailsErrors.currentAddressLineOne = "Address Line 1 is required";
//         if (!addressFormValues.permanent.currentAddressLineTwo) addressDetailsErrors.currentAddressLineTwo = "Address Line 2 is required";
//         if (!addressFormValues.permanent.currentCity) addressDetailsErrors.currentCity = "City is required";
//         if (!addressFormValues.permanent.currentState) addressDetailsErrors.currentState = "State is required";
//         if (!addressFormValues.permanent.currentPostalCode) addressDetailsErrors.currentPostalCode = "Postal Code is required";
//         if (!addressFormValues.permanent.currentCountry) addressDetailsErrors.currentCountry = "Country is required";


        
//         const bankdetailsErrors: Partial<BankFormValues> = {};
//         const emergencydetailsErrors: Partial<EmergencyContactData> = {};
//         for (let i = 0; i < bankFormValues[0].form_values.length; i++) {
//             if (!bankFormValues[0].form_values[i].value) bankdetailsErrors.value = "Required";
//         }
//         for (let i = 1; i < bankFormValues.length; i++) {
//             for (let j = 1; i < bankFormValues[i].form_values.length; j++) {
//                 if (!bankFormValues[i].form_values[j].value){
                    
//                 }
//             }
//         }
//         if (!emergencyContactData[0].emergencyContactName) emergencydetailsErrors.emergencyContactName = "Emergency contact name is required";
//         if (!emergencyContactData[0].emergencyContactNumber) emergencydetailsErrors.emergencyContactNumber = "Emergency contact number is required";
//         if (!emergencyContactData[0].emergencyContactNumber || !phoneRegex.test(emergencyContactData[0].emergencyContactNumber)) {
//             newErrors.contactPrimary = "Valid emergency contact number is required";
//         }
        
//         if (!emergencyContactData[0].emergencyContactRelationID) emergencydetailsErrors.emergencyContactRelationID = "Emergency contact relation is required";

//         if (!validator.isMobilePhone(emergencyContactData[0].emergencyContactNumber)) {
//             emergencydetailsErrors.emergencyContactNumber = "Enter a valid phone number";
//         }
//         setErrors(newErrors);
//         setBankErrors(bankdetailsErrors);
//         setEmergencyContactError(emergencydetailsErrors);
//         setAddressErrors(addressDetailsErrors);

        
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleInputChange = (e: any) => {
//         const { name, value, type, files } = e.target;
//         console.log("Form values updated:", formValues);

//         if (type === "file") {
//             // setSelectedImage(files[0]);
//             setFormValues((prev) => ({ ...prev, [name]: files[0] }));
            
//         } else {
//             setFormValues((prev) => ({ ...prev, [name]: value }));
//         }
//     };


//     const handleSubmit = async (e: React.FormEvent) => {

//         // readImageText();
//         e.preventDefault();


//         if (!validate()) return;
        
//         console.log("handle submit called");

//         const formData = new FormData();
//         formData.append("client_id", clientId?clientId:contextClientID);
//         formData.append("branch_id", contaxtBranchID);
//         formData.append("name", formValues.firstName.trim() + " " + formValues.middleName.trim() + " " + formValues.lastName.trim());
//         formData.append("dob", formValues.dateOfBirth);
//         formData.append("gender", selectedGender);
//         formData.append("marital_status", selectedMaritialStatus);
//         formData.append("nationality", formValues.nationality);
//         formData.append("blood_group", formValues.bloodGroup);
//         formData.append("contact_number", formValues.contactPrimary);
//         formData.append("email_id", formValues.emailOfficial);
//         formData.append("p_email_id", formValues.emailPersonal);
//         formData.append("password", formValues.password);

//         formData.append("bank_details_array", JSON.stringify(bankFormValues));
//         formData.append("emergency_contact_details_array", JSON.stringify(emergencyContactData));
        
//         formData.append("address_details", JSON.stringify(addressFormValues));
       
        
//         for (const key in formValues) {
//             const value = formValues[key as keyof FormValues];
//             if (value instanceof File)
//                 formData.append("file", value);
//         }
//         console.log(formData);

//         try {
//             const response = await fetch("/api/clientAdmin/addEmployee", {
//                 method: "POST",
//                 body: formData,

//             });

//             const res = await response.json();
//             console.log(res);
//             if (response.ok && res.status === 1) {

//                 // window.history.pushState({ addEmpCustidEmpId: { customer_id: 'John', emp_id: 1 } }, '', addUserAddressBankForm);
//                 setGlobalState({
//                     contextUserName: contextUserName,
//                     contextClientID: contextClientID,
//                     contaxtBranchID: contaxtBranchID,
//                     contextCustomerID: contextCustomerID,
//                     contextRoleID: contextRoleID,
//                     contextProfileImage: contextProfileImage,
//                     contextEmployeeID: contextEmployeeID,
//                     contextCompanyName: contextCompanyName,
//                     contextLogoURL: contextLogoURL,
//                     contextSelectedCustId: '',
//                     contextAddFormEmpID: res.data[0].emp_id,
//                     contextAnnouncementID: '',
//                     contextAddFormCustID: res.data[0].customer_id,
//                     dashboard_notify_cust_id: '',
//                     dashboard_notify_activity_related_id: '',
//                     selectedClientCustomerID: '',
//                     isAdmin: '',
//                     contextPARAM8: '',

//                 })
//                 if (roleId && roleId=="2") {
//                     router.push(pageURL_userEmpDashboard);                                   
//                 } else {
//                     router.push(pageURL_addUserEmploymentForm);
//                 }
//             } else {
//                 alert(res.error);
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             alert("An error occurred while submitting the form.");
//         }
//     }
//     // upload document



//     const fileUpload = async (name: any) => {

//         console.log("this is the value opassed as doc name", name);

//         let file: any;
//         let docTypeID = "";

//         if (name = ("National ID")) {

//             file = formValues.nationalId;
//         } else if (name = ("PAN card")) {
//             file = formValues.panCard;
//         } else if (name = ("Passport")) {
//             file = formValues.passport;
//         } else if (name = ("Work Visa/Permit")) {
//             file = formValues.workVisa;
//         } else if (name = ("Driving License")) {
//             file = formValues.drivingLicense;
//         }
//         console.log(file);

//         try {
//             // file url name            
//             const formData = new FormData();
//             formData.append("client_id", contextClientID);
//             formData.append("customer_id", contextCustomerID);
//             formData.append("docType", "employee");
//             formData.append("docName", name);
//             formData.append("file", file);

//             const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles/uploadDocuments", {
//                 method: "POST",
//                 // headers:{"Content-Type":"multipart/form-data"},
//                 body: formData,
//             });

//             const fileUploadResponse = await fileUploadURL.json();
//             console.log(fileUploadResponse);
//             const { data: docType, error: docError } = await supabase.from('leap_document_type').select('*');
//             if (docError) {
//                 alert("failed to get doc types")
//             }
//             console.log("this is the doc type array", docType);
//             for (let i = 0; i < docType!.length; i++) {
//                 if (docType![i].document_name == name) {
//                     docTypeID = docType![i].id;
//                 }

//             }


//             const { data, error } = await supabase.from('leap_customer_documents').insert([
//                 {
//                     client_id: contextClientID,
//                     customer_id: "14",
//                     bucket_url: fileUploadResponse.data,
//                     isEnabled: true,
//                     doc_type_id: docTypeID,
//                     created_at: new Date(),

//                 }
//             ])
//         }
//         catch (error) {
//             console.log(error);

//         }

//     }

//     return (
//         <div className='mainbox'>
//             <header>
//                 <LeapHeader title={clientAdminDashboard} />
//             </header>
//             <LeftPannel menuIndex={leftMenuAddEmployeePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

//                 <form onSubmit={handleSubmit}>
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-lg-8 mb-5">
//                                 <div className="col-lg-12 mb-4">
//                                     <div className="heading25">Personal <span>Information</span></div>
//                                 </div>
//                                 <div className="grey_box">
//                                     <div className="row">
//                                         <div className="col-lg-12">
//                                             <div className="add_form_inner">
//                                                 <div className="row">

//                                                 </div>
//                                                 <div className="row">
//                                                     <div className="col-lg-12 mb-4 inner_heading25">
//                                                         Personal Information
//                                                     </div>
//                                                 </div>
//                                                 <div className="row">
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >First Name<span className='req_text'>*</span>:  </label>
//                                                             <input type="text" className="form-control" value={formValues.firstName} name="firstName" onChange={handleInputChange} id="firstName" placeholder="Enter First Name" />
//                                                             {errors.firstName && <span className="error" style={{ color: "red" }}>{errors.firstName}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Middle Name<span className='req_text'>*</span>:</label>
//                                                             <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Middle Name" value={formValues.middleName} name="middleName" onChange={handleInputChange} />
//                                                             {errors.firstName && <span className="error" style={{ color: "red" }}>{errors.middleName}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Last Name<span className='req_text'>*</span>:</label>
//                                                             <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Last Name" value={formValues.lastName} name="lastName" onChange={handleInputChange} />
//                                                             {errors.lastName && <span className="error" style={{ color: "red" }}>{errors.lastName}</span>}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="row">

//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">Gender<span className='req_text'>*</span>:</label>
//                                                             <select id="gender" name="gender" value={formValues.gender} onChange={handleInputChange}>
//                                                                 <option value="">--</option>
//                                                                 <option value="Male">Male</option>
//                                                                 <option value="Female">Female</option>
//                                                             </select>
//                                                             {errors.gender && <span className="error" style={{ color: "red" }}>{errors.gender}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">Date of Birth<span className='req_text'>*</span>: </label>
//                                                             <input type="date" id="date" name="dateOfBirth" max={dob18YearsPrior} value={formValues.dateOfBirth} onChange={handleInputChange} />
//                                                             {errors.dateOfBirth && <span className='error' style={{ color: "red" }}>{errors.dateOfBirth}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">Blood Group<span className='req_text'>*</span>: </label>
//                                                             <select id="blood-group" name="bloodGroup" value={formValues.bloodGroup} onChange={handleInputChange}>
//                                                                 <option value="">Select Blood Group</option>
//                                                                 <option value="a-positive">A+</option>
//                                                                 <option value="a-negative">A-</option>
//                                                                 <option value="b-positive">B+</option>
//                                                                 <option value="b-negative">B-</option>
//                                                                 <option value="ab-positive">AB+</option>
//                                                                 <option value="ab-negative">AB-</option>
//                                                                 <option value="o-positive">O+</option>
//                                                                 <option value="o-negative">O-</option>
//                                                                 <option value="rare">Rare Blood Types</option>
//                                                             </select>
//                                                             {errors.bloodGroup && <span className='error' style={{ color: "red" }}>{errors.bloodGroup}</span>}
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                                 <div className="row">


//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Nationality<span className='req_text'>*</span>:</label>
//                                                             <input type="text" className="form-control" id="exampleFormControlInput1" value={formValues.nationality} name="nationality" onChange={handleInputChange} placeholder="Enter Nationality" />
//                                                             {errors.nationality && <span className='error' style={{ color: "red" }}>{errors.nationality}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">Marital Status<span className='req_text'>*</span>:</label>
//                                                             <select id="maritial-status" name="maritalStatus" value={formValues.maritalStatus} onChange={handleInputChange}>
//                                                                 <option value="">--</option>
//                                                                 <option value="Single">Single</option>
//                                                                 <option value="Married">Married</option>
//                                                             </select>
//                                                             {errors.maritalStatus && <span className='error' style={{ color: "red" }}>{errors.maritalStatus}</span>}

//                                                         </div>
//                                                     </div>


//                                                 </div>
//                                                 <div className="row">
//                                                     <div className="col-md-3">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">Contact Number<span className='req_text'>*</span>:</label>
//                                                             <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Primary Number" value={formValues.contactPrimary} name="contactPrimary" maxLength={12} onChange={handleInputChange} />
//                                                             <span>(Primary)</span>
//                                                             {errors.contactPrimary && <span className='error' style={{ color: "red" }}>{errors.contactPrimary}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-3">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">&nbsp;</label>
//                                                             <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Alternate Number" value={formValues.contactAlternate} name="contactAlternate" maxLength={12} onChange={handleInputChange} />
//                                                             <span>(Alternate)</span>

//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-3">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">Email Address<span className='req_text'>*</span>:</label>
//                                                             <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Personal Email" value={formValues.emailPersonal} name="emailPersonal" onChange={handleInputChange} />
//                                                             <span>(Personal)</span>
//                                                             {errors.emailPersonal && <span className='error' style={{ color: "red" }}>{errors.emailPersonal}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-3">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="formFile" className="form-label">&nbsp;</label>
//                                                             <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Official Email" value={formValues.emailOfficial} name="emailOfficial" onChange={handleInputChange} />
//                                                             <span>(Official)</span>
//                                                             {errors.emailOfficial && <span className='error' style={{ color: "red" }}>{errors.emailOfficial}</span>}
//                                                         </div>
//                                                     </div>
//                                                 </div>





//                                                 <div className="row">
//                                                     <div className="col-lg-3">
//                                                         <div className="Form-fields">
//                                                             <label htmlFor="password" className="Control-label Control-label--password">Set Password<span className='req_text'>*</span>:</label>
//                                                             <a className="info_icon" href="#">
//                                                                 <img src="../images/info.png" alt="Information Icon" width={16} height={16} />
//                                                                 <div className="tooltiptext tooltip-top " >
//                                                                     Password must contain combination of character, numbers and symbols.
//                                                                 </div>
//                                                             </a>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 id="show-password"
//                                                                 className="show-password"
//                                                                 checked={isChecked}
//                                                                 onChange={() => setIsChecked(!isChecked)}

//                                                             />
//                                                             <label htmlFor="show-password" className="Control-label Control-label--showPassword">
//                                                                 <svg
//                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                     viewBox="0 0 48 48"
//                                                                     width="32"
//                                                                     height="32"
//                                                                     className="svg-toggle-password"
//                                                                     aria-labelledby="toggle-password-title"
//                                                                 >
//                                                                     <title id="toggle-password-title">Hide/Show Password</title>
//                                                                     <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
//                                                                     <rect x="20.133" y="2.117" height="44" transform="translate(23.536 -8.587) rotate(45)" className="closed-eye" />
//                                                                     <rect x="22" y="3.984" width="4" height="44" transform="translate(25.403 -9.36) rotate(45)" style={{ fill: "#fff" }} className="closed-eye" />
//                                                                 </svg>
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 id="password"
//                                                                 placeholder=""
//                                                                 autoComplete="off"
//                                                                 autoCapitalize="off"
//                                                                 autoCorrect="off"

//                                                                 pattern=".{6,}"
//                                                                 className="ControlInput ControlInput--password"
//                                                                 value={formValues.password} name="password" onChange={handleInputChange}
//                                                             />
//                                                             {errors.password && <span className='error' style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}

//                                                         </div>


//                                                     </div>

//                                                     <div className="col-lg-3">
//                                                         <div className="Form-fields" >
//                                                             {/* Label for Confirm Password */}
//                                                             <label htmlFor="password1" className="Control-label Control-label--password">
//                                                                 Confirm Password<span className='req_text'>*</span>:
//                                                             </label>
//                                                             {/* Checkbox for Show/Hide Password */}
//                                                             <input
//                                                                 type="checkbox"
//                                                                 id="show-password1"
//                                                                 className="show-password"
//                                                                 checked={isConfirmPassChecked}
//                                                                 onChange={() => setConfirmPassChecked(!isConfirmPassChecked)}
//                                                             />
//                                                             <label htmlFor="show-password1" className="Control-label Control-label--showPassword">
//                                                                 <svg
//                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                     viewBox="0 0 48 48"
//                                                                     width="32"
//                                                                     height="32"
//                                                                     className="svg-toggle-password"
//                                                                     aria-labelledby="toggle-password1-title"
//                                                                 >
//                                                                     <title id="toggle-password1-title">Hide/Show Password</title>
//                                                                     <path d="M24,9A23.654,23.654,0,0,0,2,24a23.633,23.633,0,0,0,44,0A23.643,23.643,0,0,0,24,9Zm0,25A10,10,0,1,1,34,24,10,10,0,0,1,24,34Zm0-16a6,6,0,1,0,6,6A6,6,0,0,0,24,18Z" />
//                                                                     <rect
//                                                                         x="20.133"
//                                                                         y="2.117"
//                                                                         height="44"
//                                                                         transform="translate(23.536 -8.587) rotate(45)"
//                                                                         className="closed-eye"
//                                                                     />
//                                                                     <rect
//                                                                         x="22"
//                                                                         y="3.984"
//                                                                         width="4"
//                                                                         height="44"
//                                                                         transform="translate(25.403 -9.36) rotate(45)"
//                                                                         style={{ fill: '#fff' }}
//                                                                         className="closed-eye"
//                                                                     />
//                                                                 </svg>
//                                                             </label>
//                                                             {/* Input for Password */}
//                                                             <input
//                                                                 type="text"
//                                                                 id="password1"
//                                                                 placeholder=""
//                                                                 autoComplete="off"
//                                                                 autoCapitalize="off"
//                                                                 autoCorrect="off"

//                                                                 pattern=".{6,}"
//                                                                 className="ControlInput ControlInput--password"
//                                                                 value={formValues.confirmPassword} name="confirmPassword" onChange={handleInputChange}
//                                                             />
//                                                             {errors.confirmPassword && <span className='error' style={{ color: "red" }}>{errors.confirmPassword}</span>}

//                                                         </div>


//                                                     </div>


//                                                 </div>


//                                                 {/* <div className="row">
//                                                     <div className="col-lg-12" style={{ textAlign: "right" }}><BackButton/><input type="submit" value="Next" className="red_button" /></div>

//                                                 </div> */}

//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="col-lg-4">
//                                 <div className="grey_box">
//                                     <div className="row">
//                                         <div className="col-lg-12">
//                                             <div className="add_form_inner">
//                                                 <div className="row">
//                                                     <div className="col-lg-12 mb-2">
//                                                         <div className="heading25">Upload <span>Documents</span></div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="row">
//                                                     <div className="col-lg-12 mb-4" style={{ color: '#565656', fontSize: '13px' }}>Upload Your Personal Document here</div>
//                                                 </div>
//                                                 <div className="upload_list">
//                                                     <div className="row">
//                                                         <div className="col-lg-12 mb-1">National ID: </div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className="col-lg-9">
//                                                             <input type="file" className="upload_document" name="nationalId" id="formFileSm" onChange={handleInputChange} />
//                                                         </div>
//                                                         <div className="col-lg-3">
//                                                             <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
//                                                                 if (formValues.nationalId) {
//                                                                     extractText(formValues.nationalId, name);
//                                                                     // readImageText(files[0])
//                                                                 }
//                                                             }} />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="upload_list">
//                                                     <div className="row">
//                                                         <div className="col-lg-12 mb-1">PAN Card:</div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className="col-lg-9">
//                                                             <input type="file" className="upload_document" name="panCard" onChange={handleInputChange} />
//                                                         </div>
//                                                         <div className="col-lg-3">
//                                                         <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
//                                                                 if (formValues.panCard) {
//                                                                     extractText(formValues.panCard, name);
//                                                                     // readImageText(files[0])
//                                                                 }
//                                                             }} />
//                                                             </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="upload_list">
//                                                     <div className="row">
//                                                         <div className="col-lg-12 mb-1">Passport</div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className="col-lg-9">
//                                                             <input type="file" className="upload_document" name="passport" onChange={handleInputChange} />
//                                                         </div>
//                                                         <div className="col-lg-3">
//                                                         <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
//                                                                 if (formValues.passport) {
//                                                                     extractText(formValues.passport, name);
//                                                                     // readImageText(files[0])
//                                                                 }
//                                                             }} />
//                                                             </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="upload_list">
//                                                     <div className="row">
//                                                         <div className="col-lg-12 mb-1">Work Visa/Permit:</div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className="col-lg-9">
//                                                             <input type="file" className="upload_document" name="workVisa" onChange={handleInputChange} />
//                                                         </div>
//                                                         <div className="col-lg-3">
//                                                         <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
//                                                                 if (formValues.workVisa) {
//                                                                     extractText(formValues.workVisa, name);
//                                                                     // readImageText(files[0])
//                                                                 }
//                                                             }} />
//                                                             </div>
                                                        
//                                                     </div>
                                                    
//                                                 </div>
//                                                 <div className="upload_list">
//                                                     <div className="row">
//                                                         <div className="col-lg-12 mb-1">Driving License:</div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className="col-lg-9">
//                                                             <input type="file" className="upload_document" name="drivingLicense" onChange={handleInputChange} />
//                                                         </div>
//                                                         <div className="col-lg-3">
//                                                         <input type="button" value="Fetch" className="upload_btn" onClick={(e) => {
//                                                                 if (formValues.drivingLicense) {
//                                                                     extractText(formValues.drivingLicense, name);
//                                                                     // readImageText(files[0])
//                                                                 }
//                                                             }} />
//                                                             </div>
                                                        
//                                                     </div>
//                                                 </div>


//                                                 <div className="row">
//                                                     <div className="col-lg-12"></div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className={showOCRExtractDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
//                                                     {showOCRExtractDialog && <DialogFetchedOCRData  onClose={() => { setShowOCRExtractDialog(false); } } onFetch={function (selectedData: OCRDataExtractedValues[]): void {
//                                     setSelectedOCRTextArray(selectedData);
//                                     setOCRDataInForm(selectedData);
//                                     setShowOCRExtractDialog(false);
                                    
//                                 } } fetchDataArray={ocrExtractedArray}  />}
//                                                 </div>
//                             <div className='container'>
//                                 <div className="row">
//                                     <div className="col-lg-12 mb-3">
//                                         <div className="heading25">Address <span>Details</span></div>
//                                     </div>
//                                 </div>
//                                 <div className='row'>
//                                     <div className='col-lg-6 mb-3'>
//                                         <div className='grey_box'>
//                                             <div className='row'>
//                                                 <div className='col-lg-12'>
//                                                     <div className='add-form-inner'>
//                                                         <div className="row">
//                                                             <div className="col-lg-12">
//                                                                 <div className="row">
//                                                                     <div className="col-lg-12 mb-4">
//                                                                         <div className="inner_heading25">Current Address</div>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className='row'>
//                                                                     <div className="col-md-6">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 1<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.current.currentAddressLineOne} name="currentAddressLineOne" onChange={(e) => handleAddressInputChange(e, "current")} id="currentAddressLineOne" placeholder="Flat, House no., Building, Apartment" />
//                                                                             {addressErrors.currentAddressLineOne && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineOne}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-6">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 2<span className='req_text'>*</span>:  </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.current.currentAddressLineTwo} name="currentAddressLineTwo" onChange={(e) => handleAddressInputChange(e, "current")} id="currentAddressLineTwo" placeholder="Area, Sector, Street, Village" />
//                                                                             {addressErrors.currentAddressLineTwo && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineTwo}</span>}
//                                                                         </div>
//                                                                     </div>

//                                                                 </div>
//                                                                 <div className='row'>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >City<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.current.currentCity} name="currentCity" onChange={(e) => handleAddressInputChange(e, "current")} id="currentCity" placeholder="City" />
//                                                                             {addressErrors.currentCity && <span className='error' style={{ color: "red" }}>{addressErrors.currentCity}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >State<span className='req_text'>*</span>:  </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.current.currentState} name="currentState" onChange={(e) => handleAddressInputChange(e, "current")} id="currentState" placeholder="State" />
//                                                                             {addressErrors.currentState && <span className='error' style={{ color: "red" }}>{addressErrors.currentState}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Postal Code<span className='req_text'>*</span>:</label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.current.currentPostalCode} name="currentPostalCode" onChange={(e) => handleAddressInputChange(e, "current")} id="currentPostalCode" placeholder="Pincode" />
//                                                                             {addressErrors.currentPostalCode && <span className='error' style={{ color: "red" }}>{addressErrors.currentPostalCode}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Country<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.current.currentCountry} name="currentCountry" onChange={(e) => handleAddressInputChange(e, "current")} id="currentCountry" placeholder="Country" />
//                                                                             {addressErrors.currentCountry && <span className='error' style={{ color: "red" }}>{addressErrors.currentCountry}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='col-lg-6 mb-4'>
//                                         <div className='grey_box'>
//                                             <div className='row'>
//                                                 <div className='col-lg-12'>
//                                                     <div className='add-form-inner'>
//                                                         <div className="row">
//                                                             <div className="col-lg-12">
//                                                                 <div className="row">
//                                                                     <div className="col-lg-12 mb-4">
//                                                                         <div className="new_permenet_add_mainbox">
//                                                                             <div className="inner_heading25">Permanant Address</div>
//                                                                             {/* <div className="new_permenent_buttonbox">
//                                                                         <button className='red_btn' onClick={sameAddress}>Same Address</button>
//                                                                     </div> */}
//                                                                             <div className='sameadd_box'>
//                                                                                 <input type="checkbox" id='sameadd' name='sameadd' />
//                                                                                 <label htmlFor='sameadd' onClick={(e)=>{
//                                                                                     isBothAddressSame?setBothAddressSame(false):setBothAddressSame(true);
//                                                                                     sameAddress()
//                                                                                     }}>Copy Current Address</label>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className='row'>
//                                                                     <div className="col-md-6">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 1<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.permanent.currentAddressLineOne} name="currentAddressLineOne" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentAddressLineOne" placeholder="Flat, House no., Building, Apartment" />
//                                                                             {addressErrors.currentAddressLineOne && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineOne}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-6">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Address Line 2<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.permanent.currentAddressLineTwo} name="currentAddressLineTwo" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentAddressLineTwo" placeholder="Area, Sector, Street, Village" />
//                                                                             {addressErrors.currentAddressLineTwo && <span className='error' style={{ color: "red" }}>{addressErrors.currentAddressLineTwo}</span>}
//                                                                         </div>
//                                                                     </div>

//                                                                 </div>
//                                                                 <div className='row'>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >City<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.permanent.currentCity} name="currentCity" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentCity" placeholder="City" />
//                                                                             {addressErrors.currentCity && <span className='error' style={{ color: "red" }}>{addressErrors.currentCity}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >State<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.permanent.currentState} name="currentState" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentState" placeholder="State" />
//                                                                             {addressErrors.currentState && <span className='error' style={{ color: "red" }}>{addressErrors.currentState}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Postal Code<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.permanent.currentPostalCode} name="currentPostalCode" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentPostalCode" placeholder="Pincode" />
//                                                                             {addressErrors.currentPostalCode && <span className='error' style={{ color: "red" }}>{addressErrors.currentPostalCode}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Country<span className='req_text'>*</span>: </label>
//                                                                             <input type="text" className="form-control" value={addressFormValues.permanent.currentCountry} name="currentCountry" onChange={(e) => handleAddressInputChange(e, "permanent")} id="currentCountry" placeholder="Country" />
//                                                                             {addressErrors.currentCountry && <span className='error' style={{ color: "red" }}>{addressErrors.currentCountry}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>




//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Emergency contact Details */}
//                                 <div className="row formTitlebottomBorder mb-3">
//                                     <div className="col-lg-11 ">
//                                         <div className="Font25noBorder">Emergency Contact <span>Details</span></div>


//                                     </div>
//                                     <div className="col-lg-1" ><div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => { setIsMoreLoading(true); addEmergencyContactUI() }}><span>Add More</span></div></div>
//                                 </div>
//                                 {emergencyContactData.map((ContactData, index) =>
//                                     <div className='row' key={index}>

//                                         <div className='col-lg-12 mb-4'>
//                                             <div className='grey_box'>
//                                                 {index > 0 && <div className='row mb-2'>
//                                                     <div className='col-lg-12'>
//                                                         <div className="fontRed15" style={{ cursor: isMoreLoading ? "loading" : "pointer", textAlign: "right" }} onClick={() => {
//                                                             setIsMoreLoading(true);
//                                                             if (ContactData.emergencyContactName || ContactData.emergencyContactNumber || ContactData.emergencyContactRelationID) {
//                                                                 setShowDeleteDialog(true);
//                                                                 setToBeDeletedIndex(index);
//                                                                 setDeleteType(emegencyDeleteType);

//                                                             } else {
//                                                                 setEmergencyContactData((prev) =>
//                                                                     prev.filter((_, i) => i !== index)
//                                                                 );
//                                                             }
//                                                             setIsMoreLoading(false)
//                                                         }}>
//                                                             <span>Remove</span></div>

//                                                     </div></div>}
//                                                 <div className='row'>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Name{index==0 && <span className='req_text'>*</span>}: </label>
//                                                             <input type="text" className="form-control" value={ContactData.emergencyContactName} name="emergencyContactName" onChange={(e) => handleEmergencyContactChange(e, index)} id="emergencyContactName" placeholder="Name" />
//                                                             {emergencyContactError.emergencyContactName && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactName}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Contact Number{index==0 && <span className='req_text'>*</span>}: </label>
//                                                             <input type="text" className="form-control" onKeyDown={(e) => {
//                                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                                     e.preventDefault();
//                                                                 }
//                                                             }} value={ContactData.emergencyContactNumber} name="emergencyContactNumber" onChange={(e) => handleEmergencyContactChange(e, index)} id="emergencyContactNumber" placeholder="Mobile Number" maxLength={12}/>
//                                                             {emergencyContactError.emergencyContactNumber && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactNumber}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Relation{index==0 && <span className='req_text'>*</span>}: </label>
//                                                             <select id="emergencyContactRelationID" name="emergencyContactRelationID" value={ContactData.emergencyContactRelationID} onChange={(e) => handleEmergencyContactChange(e, index)}>
//                                                                 <option value="">--</option>
//                                                                 {emergencyContactRelation.map((sal, index) => (
//                                                                     <option value={sal.id} key={sal.id}>{sal.relation_type}</option>
//                                                                 ))}
//                                                             </select>
//                                                             {emergencyContactError.emergencyContactRelationID && <span className='error' style={{ color: "red" }}>{emergencyContactError.emergencyContactRelationID}</span>}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                     </div>

//                                 )}
//                                 {/* Bank Details */}
//                                 <div className="row formTitlebottomBorder mb-3">
//                                     <div className="col-lg-11">
//                                         <div className="Font25noBorder">Bank Account <span>Details</span></div>
//                                     </div>
//                                     <div className="col-lg-1" ><div className="fontRed15" style={{ cursor: "pointer" }} onClick={() => { setIsMoreLoading(true); addBankDetailsContactUI() }}><span>Add More</span></div></div>

//                                 </div>
//                                 {bankFormValues.map((bankForm, index) =>
//                                     <div className='row' key={index}>
//                                         <div className='col-lg-12 mb-3'>
//                                             <div className='grey_box'>
//                                                 {index > 0 && <div className='row mb-2'>
//                                                     <div className='col-lg-12 text-right'>
//                                                         <div className="fontRed15" style={{ cursor: isMoreLoading ? "loading" : "pointer", textAlign: "right" }} onClick={() => {
//                                                             setIsMoreLoading(true);
//                                                             if (checkIndexHasValue(index)) {
//                                                                 setToBeDeletedIndex(index);
//                                                                 setShowDeleteDialog(true),
//                                                                     setDeleteType(bankInfoDeleteType),
//                                                                     setIsMoreLoading(false)
//                                                             } else {
//                                                                 setBankValues((prev) =>
//                                                                     prev.filter((_, i) => i !== index)
//                                                                 );
//                                                             }

//                                                         }}>

//                                                             <span>Remove</span></div>

//                                                     </div></div>}
//                                                 <div className='row'>
//                                                     <div className='col-lg-12'>
//                                                         <div className='add-form-inner'>

//                                                             <div className='row'>
//                                                                 {bankForm.form_values.map((form, formValueIndex) =>
//                                                                     <div className="col-md-4" key={form.id}>
//                                                                         <div className="form_box mb-3">
//                                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >{form.component_name}{index==0 && <span className='req_text'>*</span>}: </label>
//                                                                             <input type="text" className="form-control" onKeyPress={(e) => {
//                                                                                 if (form.data_type === 2 && !/[0-9]/.test(e.key)) {
//                                                                                     e.preventDefault(); // block non-numeric input
//                                                                                 }
//                                                                             }} value={form.value} name="bankAccountNumber" onChange={(e) => handleBankDataChange(e, index, formValueIndex)} id="bankAccountNumber" />
//                                                                             {bankErrors.value && <span className='error' style={{ color: "red" }}>{bankErrors.value}</span>}
//                                                                         </div>
//                                                                     </div>
//                                                                 )}
//                                                                 {/* <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Bank Name: </label>
//                                                             <input type="text" className="form-control" value={bankForm.bankName} name="bankName" onChange={(e)=>handleBankDataChange(e,index)} id="bankName" placeholder="Bank Name" />
//                                                             {bankErrors.bankName && <span className='error' style={{ color: "red" }}>{bankErrors.bankName}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Branch Name: </label>
//                                                             <input type="text" className="form-control" value={bankForm.branchName} name="branchName" onChange={(e)=>handleBankDataChange(e,index)} id="branchName" placeholder="Branch Name" />
//                                                             {bankErrors.branchName && <span className='error' style={{ color: "red" }}>{bankErrors.branchName}</span>}
//                                                         </div>
//                                                     </div> */}
//                                                             </div>
//                                                             {/* <div className='row'>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >IFSC code: </label>
//                                                             <input type="text" className="form-control" value={bankForm.ifscCode} name="ifscCode" onChange={(e)=>handleBankDataChange(e,index)} id="ifscCode" placeholder="IFSC Code" />
//                                                             {bankErrors.ifscCode && <span className='error' style={{ color: "red" }}>{bankErrors.ifscCode}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >PAN number: </label>
//                                                             <input type="text" className="form-control" value={bankForm.panNumber} name="panNumber" onChange={(e)=>handleBankDataChange(e,index)} id="panNumber" placeholder="PAN number" />
//                                                             {bankErrors.panNumber && <span className='error' style={{ color: "red" }}>{bankErrors.panNumber}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >TAX Insurance Number:</label>
//                                                             <input type="text" pattern="[0-9]*" className="form-control" value={bankForm.tinNumber} name="tinNumber" onChange={(e)=>handleBankDataChange(e,index)} id="tinNumber" placeholder="TAX number" />
//                                                             {bankErrors.tinNumber && <span className='error' style={{ color: "red" }}>{bankErrors.tinNumber}</span>}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className='row'>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >UAN number: </label>
//                                                             <input type="text" pattern="[0-9]*" onKeyDown={(e) => {
//                                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                                     e.preventDefault();
//                                                                 }
//                                                             }} className="form-control" value={bankForm.uAN} name="uAN" onChange={(e)=>handleBankDataChange(e,index)} id="uAN" placeholder="UAN number" />
//                                                             {bankErrors.uAN && <span className='error' style={{ color: "red" }}>{bankErrors.uAN}</span>}
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >ESIC number: </label>
//                                                             <input type="text" pattern="[0-9]*" onKeyDown={(e) => {
//                                                                 if (e.key !== "Backspace" && e.key !== "Delete" && isNaN(Number(e.key))) {
//                                                                     e.preventDefault();
//                                                                 }
//                                                             }} className="form-control" value={bankForm.esicNumber} name="esicNumber" onChange={(e)=>handleBankDataChange(e,index)} id="esicNumber" placeholder="ESIC number" />
//                                                             {bankErrors.esicNumber && <span className='error' style={{ color: "red" }}>{bankErrors.esicNumber}</span>}

//                                                         </div>
//                                                     </div>
//                                                     <div className="col-md-4">
//                                                         <div className="form_box mb-3">
//                                                             <label htmlFor="exampleFormControlInput1" className="form-label" >Social Security Number: </label>
//                                                             <input type="text" className="form-control" value={bankForm.socialSecurityNumber} name="socialSecurityNumber" onChange={(e)=>handleBankDataChange(e,index)} id="socialSecurityNumber" placeholder="Social Security number" />
//                                                             {bankErrors.socialSecurityNumber && <span className='error' style={{ color: "red" }}>{bankErrors.socialSecurityNumber}</span>}
//                                                         </div>
//                                                     </div>
//                                                 </div> */}



//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                     </div>
//                                 )}
//                                 {showDeleteDialog && <RemoveAddEmpFormContactOrBankData onCancel={() => { setShowDeleteDialog(false) }} onOK={() => { setShowDeleteDialog(false); removeAtIndex(); setToBeDeletedIndex(-1) }} deleteType={deleteType} />}

//                             </div>
//                         </div>
//                         <div className="row">
//                             <div className="col-lg-12" style={{ textAlign: "right" }}><input type="submit" value="Next" className="red_button" /></div>
//                         </div>
//                     </div>
                    
//                 </form>
//             } />
//             < Footer />
//         </div>
//     )
// }

// export default AddEmployeeBasicDetails



// async function getRelations() {

//     let query = supabase
//         .from('leap_relations')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {


//         return data;
//     }
// }
// async function getBankFormComponents() {

//     let query = supabase
//         .from('leap_client_bank_details_components')
//         .select("id,component_name,data_type");

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {


//         return data;
//     }
// }

/////////////////////////////swapnil design
// 'use client'
