'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import Papa from 'papaparse';
import { error } from 'console';
import LoadingDialog from './PageLoader';
import ExcelJS, { CellRichTextValue } from "exceljs";
import { getImageApiURL, staticIconsBaseURL } from '../pro_utils/stringConstants';
import { ALERTMSG_exceptionString, bulkUploadTypeEmployee, bulkUploadTypeHolidays } from '../pro_utils/stringConstants';
import ShowAlertMessage from './alert';

interface formHoliday{
    branchId:any,
    holidayYear:any
}

const BulkUploadForm = ({ uploadType, onClose }: { uploadType: string, onClose: () => void }) => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [holidayYearArray, setholidayYear] = useState<HolidayListYear[]>([]);
    
    const [selectedBranches, setSelectedBranch] = useState<string[]>([]);
    const [selectedYearID, setSelectedYearID] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [responseMessage, setResMessage] = useState("")
    const { contextClientID } = useGlobalContext();
    const [showResponseMessage, setResponseMessage] = useState(false);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [csvFileURL, setCsvFileURL] = useState("");
    const [xlsxFileURL, setXlsxFileURL] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    const [errors, setErrors] = useState<Partial<formHoliday>>({});

    useEffect(() => {
        const fetchData = async () => {
            if (uploadType === bulkUploadTypeHolidays) {
                const branch = await getBranches(contextClientID);
                setBranchArray(branch);
                const holidayYear = await getHolidayYear(contextClientID);
                setholidayYear(holidayYear);
            }
        }
        if (uploadType === bulkUploadTypeEmployee) {
            setCsvFileURL(getImageApiURL + "/sampleFiles/emp_sample.csv");
            setXlsxFileURL(getImageApiURL + "/sampleFiles/employees.xlsx");
        } else if (uploadType === bulkUploadTypeHolidays) {

            setCsvFileURL(getImageApiURL + "/sampleFiles/holidaysBulk.csv");
            setXlsxFileURL(getImageApiURL + "/sampleFiles/holidaysBulk.xlsx");
        }
        fetchData();
    }, [])

    const validate = () => {
        const newErrors: Partial<formHoliday> = {};
        if (!selectedBranches || selectedBranches.length==0) newErrors.branchId = "required";
        if (!selectedYearID) newErrors.holidayYear = "required";
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const uploadData = async (e: React.FormEvent) => {

        setLoading(true);
        if (!(uploadFile instanceof File)) {

            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Error")
            setAlertStartContent("Please select a file to upload");
            setAlertForSuccess(2)

            return;
        }
        

        if (uploadType === bulkUploadTypeEmployee) {
            const { data: lastCustomerEmpID, error: custError } = await supabase.from('leap_customer')
                .select('emp_id')
                .eq('client_id', contextClientID)
                .order('emp_id', { ascending: false }).limit(1);

            if (custError) {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get last emp id");
                setAlertForSuccess(2)

            }
            try {
                if (uploadFile.type === "text/csv") {

                    const result = await uploadThroughCSVFile(uploadFile, contextClientID, lastCustomerEmpID![0].emp_id)
                    if (result) {
                        setLoading(false);

                        setShowAlert(true);
                        setAlertTitle("Employee Add");
                        setAlertStartContent(result);
                        setAlertForSuccess(3);
                    }
                }
                else if (
                    uploadFile.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                    uploadFile.type === "application/vnd.ms-excel"
                ) {
                    // console.log("Upload thorugh xlsx coniditon is invoked");
                    const result = await uploadThroghXLSX(uploadFile, contextClientID, lastCustomerEmpID![0].emp_id)
                    if (result) {
                        setLoading(false);

                        setShowAlert(true);
                        setAlertTitle("Employee Add");
                        setAlertStartContent(ALERTMSG_exceptionString);
                        setAlertForSuccess(3);
                    }

                }
            }
            catch (e) {
                setLoading(false);

                setShowAlert(true);
                setAlertTitle("Exception");
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2);
                console.error("Error:", e);
            }
        } else if (uploadType === bulkUploadTypeHolidays) {
            if(!validate()) {setLoading(false);return};
            const { data: yearIds, error: custError } = await supabase.from('leap_holiday_year')
                .select('id')
                .eq('client_id', contextClientID).eq("is_deleted", false);
            try {
                if (uploadFile.type === "text/csv") {

                    console.log("yearIds-=-=-=-=-=-=-=-=-=-==-====-=-=-=-=-=", yearIds);

                    if (yearIds && yearIds.length > 0) {
                        const res = await uploadHolidaysCSVFile(uploadFile, contextClientID, selectedYearID!,selectedBranches)
                        if (res) {
                            setLoading(false);

                            setShowAlert(true);
                            setAlertTitle("Result");
                            setAlertStartContent(res);
                            setAlertForSuccess(3);
                        }
                    } else {
                        setLoading(false);
                        setShowAlert(true);
                        setAlertTitle("Error");
                        setAlertStartContent("No holiday year found. Please create a holiday year first.");
                        setAlertForSuccess(2);
                    }
                }
                else if (
                    uploadFile.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                    uploadFile.type === "application/vnd.ms-excel"
                ) {
                    // console.log("Upload thorugh xlsx coniditon is invoked");

                    console.log("Upload data is called", uploadType);
                    const uploadResult = await uploadHolidaysThroghXLSX(uploadFile, contextClientID,selectedBranches,selectedYearID)
                    setLoading(false);

                    setShowAlert(true);
                    setAlertTitle("Result");
                    setAlertStartContent(uploadResult);
                    setAlertForSuccess(2);

                }
            } catch (e) {
                setLoading(false);

                setShowAlert(true);
                setAlertTitle("Exception");
                setAlertStartContent(ALERTMSG_exceptionString);
                setAlertForSuccess(2);
                console.log(e);

            }

        }

    };

    async function downloadFile(fileType: any) {
        setLoadingCursor(true);
        const formData = new FormData();
        formData.append('file_type', fileType);
        formData.append('data_type', uploadType);

        try {
            const response = await fetch('/api/commonapi/downloadFile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Convert the response to a blob
            const blob = await response.blob();

            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileType === 'csv' ? 'emp_sample.csv' : 'employees.xlsx';
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setLoadingCursor(false);
        } catch (error) {
            setLoadingCursor(false);
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    return (

        <div className='text-center'>
            {/* <form ></form> */}
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent.length > 0 ? alertEndContent : " "} value1={""} value2={""} onOkClicked={function (): void {
                setShowAlert(false)

            }} onCloseClicked={function (): void {
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className='rightpoup_close' onClick={onClose}>
                <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
            </div>

            <div className="row">
                <div className="col-lg-12 mb-3 inner_heading25">Select a CSV nnjn File.</div>
            </div>
            <div className="row mb-4">
                <div className="col-lg-12">
                    <div className="grey_box text-center">
                        <div className="row">
                            <div className="col-lg-6 mb-3">
                                <a className='red_button filter_submit_btn ' style={{ cursor: "pointer", padding: "10px 12px", fontSize: "16px" }} href={csvFileURL} download>
                                    Sample csv
                                </a>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <a className='red_button filter_submit_btn ' style={{ cursor: "pointer", padding: "10px 12px", fontSize: "16px" }} href={xlsxFileURL} download>Sample xlsx</a>
                            </div>
                            {uploadType === bulkUploadTypeHolidays && <div className="col-lg-12">
                                <div className="form_box mb-3">
                                    <label htmlFor="formFile" className="form-label" style={{textAlign:"left",marginBottom: "10px",marginTop: "10px"}}>Branch<span className='req_text'>*</span>:<label style={{fontSize:"10px" }}>(multiple)</label></label>
                                    <select id="branchID" name="branchID" multiple size={5} onChange={(e) => {
                                        let selectedOptions = Array.from(
                                            (e.target as HTMLSelectElement).selectedOptions
                                        ).map((option) => option.value);

                                        if (selectedOptions.includes("0")) {
                                            // Select all branches
                                            selectedOptions = branchArray.map((b) => String(b.id));
                                        }

                                        setSelectedBranch(selectedOptions);
                                        console.log("selected branch", selectedBranches);
                                        
                                    }}>
                                        {/* <option value="">Select</option> */}
                                        <option value="0">All</option>
                                        {branchArray.map((branch, index) => (
                                            <option value={branch.id} key={branch.id}>{branch.branch_number}</option>
                                        ))}
                                    </select>
                                    {errors.branchId && <span className='error' style={{ color: "red" }}>required</span>}
                                </div>
                            </div>}
                            {uploadType === bulkUploadTypeHolidays && <div className="col-lg-12">
                                    <div className="form_box mb-3">
                                        <label htmlFor="formFile" className="form-label" style={{textAlign:"left",marginBottom: "10px",marginTop: "10px"}}>Holdiay Year<span className='req_text'>*</span>:</label>

                                        <select id="yearID" name="yearID" onChange={(e) => {
                                            setSelectedYearID(e.target.value);
                                        }}>
                                            <option value="">Select Holiday Year:</option>
                                            {holidayYearArray.map((id, index) => (
                                                <option value={id.id} key={id.id} >{id.list_name}</option >

                                            ))}
                                        </select>
                                    {errors.holidayYear && <span className='error' style={{ color: "red" }}>required</span>}

                                    </div>
                                </div>}
                            <div className="col-lg-12">
                                <div className="form_box mt-3">

                                    <input
                                        type="file"
                                        accept=".csv, .xlsx"
                                        id="uploadFile"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setUploadFile(e.target.files[0]); // ✅ Now TypeScript understands the type
                                            }
                                        }} style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "10px" }}

                                    />
                                    {/* <label
                                htmlFor="uploadFile"
                                style={{
                                    backgroundColor: "#FF0000",
                                    color: "#FFF",
                                    padding: "6px 20px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    margin: "-18px 0px 0px 0",
                                    position: "relative",
                                    fontSize: "15px"
                                }}
                            >Choose a File </label> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div className="row mb-5 ">
                <div className="col-lg-12 ">

                    <a className="red_button " onClick={uploadData} style={{ cursor: "pointer", }}>Upload</a>&nbsp;&nbsp;
                    <a className="red_button" onClick={onClose} style={{ cursor: "pointer", }}>Close</a>

                </div>
            </div>
            {showResponseMessage && <div className="row md-5"><label>Data Added Successfully</label></div>}
        </div>

    )
}

export default BulkUploadForm;


function incrementNumbersInStringByValue(inputString: any, incrementBy: any) {
    // Use a regular expression to match all numbers in the string
    return inputString.replace(/\d+/g, (match: any) => {
        // Convert the matched number to an integer, increment it, and return the new value
        return parseInt(match, 10) + incrementBy;
    });
};

async function uploadThroughCSVFile(uploadFile: File, contextClientID: any, lastEmpID: any) {
    let authUUID: any = [];
    const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (!event.target?.result) {
                alert("Error reading file");
                return false;
            }
            let result = event.target.result as string;
            // Remove BOM if present
            if (result.charCodeAt(0) === 0xFEFF) {
                result = result.slice(1);
            }
            resolve(result);
        };

        reader.onerror = () => reject("File reading failed");
        reader.readAsText(uploadFile, "UTF-8");
    });


    // Specify the delimiter as a tab character
    const csvData = Papa.parse<EmployeeUploadAuth & EmployeeUploadDetails>(text, {
        header: true,
        // Use tab as the delimiter
    });

    if (!csvData.data.length) {
        // alert("CSV file is empty or formatted incorrectly.");
        return "CSV file is empty or formatted incorrectly.";
    }
    let i = 1;
    csvData.data.map(async (row) => {

        const emailPassword = {
            email: row["email_id"],
            password: row["password"],
        }
        const { data: signUpData, error } = await supabase.auth.signUp(emailPassword);

        if (error) {
            // alert("Failed to add user auth.")
            return "Failed to add user auth.";
        }
        authUUID.push(signUpData.user!.id);

        const { error: basicDataError } = await supabase
            .from("leap_customer")
            .insert(
                {
                    client_id: contextClientID,
                    name: row["name"],
                    dob: row["dob"],
                    gender: row["gender"],
                    marital_status: row["marital_status"],
                    nationality: row["nationality"],
                    blood_group: row["blood_group"],
                    contact_number: row["contact_number"],
                    email_id: row["email_id"],
                    personalEmail: row["personalEmail"],
                    user_role_id: row["user_role_id"],
                    authUuid: authUUID[i - 1],
                    emp_id: incrementNumbersInStringByValue(lastEmpID, i),
                    created_at: new Date()
                });

        if (basicDataError) {
            alert("Data not added");
            console.error(basicDataError);
            return "Data not added";
        }
        else {
            return "Employee Added added";
        }

    });

}




// this s the code for uploading through xlsx file data parsing and insert in supabase

async function uploadThroghXLSX(uploadFile: File, contextClientID: any, emp_id: any) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(uploadFile)
    reader.onload = async (e) => {
        if (!e.target?.result) {
            alert("Error reading file")
            return false;
        }
        const arrayBuffer = e.target.result;


        const workbook = new ExcelJS.Workbook();

        // Read first sheet
        if (typeof arrayBuffer === "string") {
            console.error("Unexpected string result from FileReader");
            alert("Error while reading file from file reader")
            return;
        }

        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0]; // Read first sheet


        let i = 1;

        // const promises: any[] = [];
        worksheet.eachRow(async (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip headers
            const cellValue = row.getCell(8).value;
            const email = typeof cellValue === "object" && cellValue !== null && "text" in cellValue
                ? (cellValue as any).text
                : cellValue;
            if (!isValidEmail(email)) {
                console.error(`Skipping invalid email: ${row.getCell(8).value}`);
                alert("Few email id are invalid please check")
                return false;
            }



            const emailPassword = {
                email: email,
                password: row.getCell(11).value + '',
            }
            console.log(emailPassword);
            // promises.push((async () => {
            const { data: signUpData, error } = await supabase.auth.signUp(emailPassword);

            if (error) {
                console.log("signup error", error);
                alert("Failed to add user auth.")
                return false;
            }
            const dobCell = row.getCell(2);
            let dob: string | Date = dobCell.value + ''; // This will be a Date object if the cell is formatted as a date in Excel

            // If the cell value is a number (Excel serial number), convert it to a Date object
            if (typeof dob === 'number') {
                dob = new Date((dob - 25569) * 86400 * 1000); // Convert Excel serial number to JavaScript Date
            }

            // Format the date as "DD/MM/YYYY"
            const formattedDob = dob instanceof Date ?
                `${String(dob.getDate()).padStart(2, '0')}/${String(dob.getMonth() + 1).padStart(2, '0')}/${dob.getFullYear()}` :
                dob;
            const personalEmailCell = row.getCell(9).value;
            const personalEmail = typeof personalEmailCell === "object" && personalEmailCell !== null && "text" in personalEmailCell
                ? (personalEmailCell as any).text
                : personalEmailCell;
            const details = {
                client_id: contextClientID,
                name: row.getCell(1).value,
                dob: formattedDob,
                gender: row.getCell(3).value,
                marital_status: row.getCell(4).value,
                nationality: row.getCell(5).value,
                blood_group: row.getCell(6).value,
                contact_number: row.getCell(7).value,
                email_id: email,
                personalEmail: personalEmail,
                user_role_id: row.getCell(10).value,
                authUuid: signUpData.user!.id,
                emp_id: incrementNumbersInStringByValue(emp_id, i++),
                created_at: new Date(),
            };
            const { error: basicDataError } = await supabase
                .from("leap_customer")
                .insert(details);

            if (basicDataError) {
                alert("Data not added");
                return false;
                console.error(basicDataError);
            }

            // })());
        });

        // await Promise.all(promises); 
        // alert("Data Added Successfully");
        return "Data Added Successfully";

    }
    return "";

}


const isValidEmail = (email: any) => {
    console.log("is valid emai lfunction email value", email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

async function uploadHolidaysCSVFile(uploadFile: File, contextClientID: any, yearIds: any , selectedBranches: string[]) {


    console.log("yearIds-=-=-=-=-=-=-=-=-=-==-====-=-=-=-=-=");


    const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (!event.target?.result) {
                // reject("Error reading file");
                alert("Error reading file")
                return "Error reading file";
            }
            let result = event.target.result as string;
            // Remove BOM if present
            if (result.charCodeAt(0) === 0xFEFF) {
                result = result.slice(1);
            }
            resolve(result);
        };

        reader.onerror = () => reject("File reading failed");
        reader.readAsText(uploadFile, "UTF-8");
    });

    console.log("Upload holidays csv method");
    // Specify the delimiter as a tab character
    const csvData = Papa.parse<HolidayBulkUpload>(text, {
        header: true,
        // Use tab as the delimiter
    });

    if (!csvData.data.length) {
        // alert("CSV file is empty or formatted incorrectly.");
        return "CSV file is empty or formatted incorrectly.";
    }
    let uploadData: any[] = [];
    csvData.data.map((row) => {

        let formattedDate = "";
        if (row["Date"]!) {
            formattedDate = row["Date"].split("/").reverse().join("-");
            
                for (let j = 0; j < selectedBranches.length; j++) {
                uploadData.push({
                    client_id: contextClientID,
                    branch_id: selectedBranches[j],
                    holiday_name: row["Name"],
                    holiday_year: yearIds,
                    date: formattedDate,
                });
                }
            
        }


    });

    const { error: basicDataError } = await supabase.from("leap_holiday_list")
        .insert(uploadData);

    if (basicDataError) {
        // alert("Data not added");
        return "Data not added";
        console.error(basicDataError);
    } else {
        // alert("Data added successfully")
        return "Data added successfully";
    }

}

async function uploadHolidaysThroghXLSX(uploadFile: File, contextClientID: any,branchArray:any[],yearid:any) {
    console.log("uploadHolidaysThroghXLSX is called");
    const { data: yearIds, error: custError } = await supabase.from('leap_holiday_year')
        .select('id')
        .eq('client_id', contextClientID).eq("is_deleted", false);

    console.log("yearIds-=-=-=-=-=-=-=-=-=-==-====-=-=-=-=-=", yearIds);
    const reader = new FileReader();
    reader.readAsArrayBuffer(uploadFile)
    reader.onload = async (e) => {
        if (!e.target?.result) {
            // alert("Error reading file")
            return "Error reading file";
        }
        const arrayBuffer = e.target.result;


        const workbook = new ExcelJS.Workbook();

        // Read first sheet
        if (typeof arrayBuffer === "string") {
            console.error("Unexpected string result from FileReader");
            // alert("Unexpected error occured from file reader")
            return "Unexpected error occured from file reader";
        }

        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0]; // Read first sheet

        let uploadData: any[] = [];
        // const promises: any[] = [];
        worksheet.eachRow(async (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip headers

            const holidayDate = row.getCell(3).value;
            let holiday: string | Date; // This will be a Date object if the cell is formatted as a date in Excel

            // If the cell value is a number (Excel serial number), convert it to a Date object
            if (typeof holidayDate === "number") {
                console.log("Excel Serial Number:", holidayDate);
                holiday = new Date((holidayDate - 25569) * 86400 * 1000); // Convert Excel serial number to Date
            } else if (typeof holidayDate === "string") {
                console.log("String Date:", holidayDate);
                holiday = new Date(holidayDate); // Convert valid string date
            } else {
                console.log("Unexpected Format:", holidayDate);
                holiday = holidayDate ? holidayDate + "" : ""; // Keep the original value
            }

            // Format the date as "DD/MM/YYYY"
            const formattedDob = holiday instanceof Date ?
                `${String(holiday.getDate()).padStart(2, '0')}/${String(holiday.getMonth() + 1).padStart(2, '0')}/${holiday.getFullYear()}` :
                holiday;

            for (let i = 0; i < branchArray!.length; i++) {
                uploadData.push({
                    client_id: contextClientID,
                    branch_id: branchArray[i],
                    holiday_name: row.getCell(2).value,
                    holiday_year: yearid,
                    date: formattedDob,
                });
            }
            // uploadData.push({
            //     client_id: contextClientID,
            //     branch_id: row.getCell(1).value,
            //     holiday_name: row.getCell(2).value,
            //     date: formattedDob,
            // });

            // })());
        });

        // await Promise.all(promises); 
        const { error: basicDataError } = await supabase.from("leap_holiday_list")
            .insert(uploadData);


        if (basicDataError) {
            // alert("Data not added");
            return "Data not added";
            console.error(basicDataError);
        } else {
            // alert("Data Added Successfully");
            return "Data Added Successfully";
        }
    }
    return "";

}


async function getBranches(client_id: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select('*')
        .eq("client_id", client_id);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}

async function getHolidayYear(clientID: any) {

    let query = supabase
        .from('leap_holiday_year')
        .select()
        .eq("client_id", clientID);
    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}
