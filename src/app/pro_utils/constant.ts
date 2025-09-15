import { NextRequest, NextResponse } from "next/server";
import multiparty from "multiparty";
import { Readable } from "stream";
import path from "path";
import { apifailedWithException, apiMessageUnAuthenticated, apiStatusFailureCode, apiStatusInvalidDataCode, apiStatusSuccessCode, apiStatusUnAuthenticated, apiwentWrong } from "./stringConstants";
import moment from "moment";
export const runtime = "nodejs";
import Papa from "papaparse";
import { start } from "repl";
import CryptoJS from "crypto-js";
import { createWorker } from "tesseract.js";
import { addErrorExceptionLog } from "./constantFunAddData";



export function setUploadFileName(fileName: String) {
  console.log("setUploadFileName called with fileName:", fileName);
  const name = fileName.replaceAll(" ", "_");
  const subSt = name.substring(0, name.lastIndexOf("."));
  return subSt + new Date().toLocaleDateString().replaceAll("/", "") + new Date().toLocaleTimeString().substring(0, 4).replaceAll(":", "") + name.substring(name.lastIndexOf("."));

}


export function toIncomingMessage(req: NextRequest): any {
  const readable = new Readable();
  readable._read = () => { }; // No-op (_read is required for Readable streams)

  const reader = req.body?.getReader();
  function pushChunk() {
    reader
      ?.read()
      .then(({ value, done }) => {
        if (done) {
          readable.push(null); // Signal EOF
        } else {
          readable.push(Buffer.from(value)); // Push chunk into stream
          pushChunk(); // Continue reading
        }
      })
      .catch(() => readable.push(null));
  }

  pushChunk(); // Start reading

  // Mimic IncomingMessage structure
  return Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
  });
}

// Parse form data
export const parseForm = async (req: NextRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    const incomingReq = toIncomingMessage(req);

    form.parse(incomingReq, async (err: any, fields: any, files: any) => {
      if (err) {
        console.log("parse form error",err);
        const log=await addErrorExceptionLog(fields.client_id[0],fields.customer_id[0],"Parse form error",JSON.stringify({err}))
        reject(err);
      } else {
        console.log("parse form function proper execution"+files.file);
        resolve({ fields, files });
      }
    });
  });
};

export function funCalculateTimeDifference(startDate: Date, endDate: Date) {
 
if(formatDateDDMMYYYY(startDate.toISOString(),false)==formatDateDDMMYYYY(endDate.toISOString(),false)){
  const milliDiff: number = 
     endDate.getTime()-startDate.getTime();

  // Converting time into hh:mm:ss format

  // Total number of seconds in the difference
  const totalSeconds = Math.floor(milliDiff / 1000);

  // Total number of minutes in the difference
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Total number of hours in the difference
  const totalHours = Math.floor(totalMinutes / 60);

  // Getting the number of seconds left in one minute
  const remSeconds = totalSeconds % 60;

  // Getting the number of minutes left in one hour
  const remMinutes = totalMinutes % 60;

  return `${totalHours}.${remMinutes}`;
}else{
  console.log("this is the else part"+startDate+'          '+endDate);
  
  let milliDiff: number = 
  
     startDate.getTime()-endDate.getTime();

  // Converting time into hh:mm:ss format

  // Total number of seconds in the difference
  const totalSeconds = Math.floor(milliDiff / 1000);

  // Total number of minutes in the difference
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Total number of hours in the difference
  const totalHours = Math.floor(totalMinutes / 60);

  // Getting the number of seconds left in one minute
  const remSeconds = totalSeconds % 60;

  // Getting the number of minutes left in one hour
  const remMinutes = totalMinutes % 60;

  return `${totalHours}.${remMinutes}`;
}
}

export const calculateNumDays=(startDate:Date,endDate:Date)=>{
  const firstDateInMs = startDate.getTime()
const secondDateInMs = endDate.getTime()

const differenceBtwDates = secondDateInMs - firstDateInMs

const aDayInMs = 24 * 60 * 60 * 1000

const daysDiff = Math.round(differenceBtwDates / aDayInMs)
return daysDiff+1;
}

export const calculateNumMonths=(startDate:Date,endDate:Date)=>{

// Get the year and month values
const startYear = startDate.getFullYear();
const startMonth = startDate.getMonth(); // Note: Months ar e zero-indexed (0 = January)

const endYear = endDate.getFullYear();
const endMonth = endDate.getMonth(); // Note: Months are zero-indexed (0 = January)

// Calculate the difference in months
const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
return monthsDiff;
}


export const formatDateDDMMYYYY = (date: any, isTime = false) => {
  if (!date) return '';
  const parsedDate = moment(date);

  if (isTime) return parsedDate.format('HH:mm A');

  return parsedDate.format('DD/MM/YYYY');
};
export const formatDateYYYYMMDD = (date: any, isTime = false) => {
  if (!date) return '';
  const parsedDate = moment(date);

  if (isTime) return parsedDate.format('HH:mm A');

  return parsedDate.format('YYYY/MM/DD');
};
export const dashedDateYYYYMMDD = (date: any, isTime = false) => {
  if (!date) return '';
  const parsedDate = moment(date);

  if (isTime) return parsedDate.format('HH:mm A');

  return parsedDate.format('YYYY-MM-DD');
};

export function funSendApiException(error: any) {
  return NextResponse.json({
    message: apifailedWithException,
    error: error.toString(),
    status:3
  }, { status: apiStatusFailureCode })
}

export function funSendUserNotAuthenticated(error: any) {
  return NextResponse.json(
        { error: apiMessageUnAuthenticated,status: 2 },
        { status: apiStatusUnAuthenticated }
      );
}

export function funSendApiErrorMessage(error: any,message:any) {
  return NextResponse.json({
    message: message,
    status:0,
    error: error,

  }, { status: apiStatusSuccessCode })
}
export function funloggedInAnotherDevice() {
  return NextResponse.json({
    message: "You have already logged in another device",
    error:"",
    status:2
  }, { status: apiStatusSuccessCode })
}  

export function funDataAddedSuccessMessage(message: any) {
  return NextResponse.json({
    message: message,
    status: 1,

  }, { status: apiStatusSuccessCode })
}
export function funDataMissingError(dataKey: any) {
  return NextResponse.json({
    message: "Data Missing for Keys :- "+dataKey,
    status: 0,

  }, { status: apiStatusInvalidDataCode })
}

export function funISDataKeyPresent(dataKey: any) {
  if(dataKey != null && dataKey.toString().trim().length!=0){
    return true;
  }else{
    return false;
  }
}


export const formatDateToISO = (now:Date) => {
  

  // Get the ISO string in UTC (e.g., "2024-11-21T13:00:00.000Z")
  const isoString = new Date(now).toISOString();

  // Replace the trailing "Z" with "+00:00" to match your format
  const formattedDate = isoString.replace(/\.\d{3}Z$/, "+00:00");

  return formattedDate;
};


export function fileAsCSV(file:File){
  let csvFile;
  if (file) {
    Papa.parse(file, {
      header: true, // Parse the first row as header
      complete: (results) => {
       csvFile= results.data; // Store the parsed data
      },
      skipEmptyLines: true,
    });
  }
  return csvFile;
}

export function getFirstDateOfYear(){
  const currentYear = new Date().getFullYear();
  const theFirst = new Date(currentYear, 0, 1);
  return theFirst;
}

export function getFirstDateOfYearbyDate(date:Date){
  const currentYear = date.getFullYear();
  const theFirst = new Date(currentYear, 0, 1);
  return theFirst;
}

export function getLastDateOfYear(){
  const currentYear = new Date().getFullYear();
  const theLast = new Date(currentYear, 11, 31);  
  return theLast;
}

export function addDays (date:any, days:any) {
  
  const result =new Date(date);

  result.setDate(result.getDate() + days);
  return result;
};

export function addMonthsToDate(date:any, months:any) {
  let newDate = new Date(date); // Create a copy of the original date
  newDate.setMonth(newDate.getMonth() + months); // Add months
  return newDate;
}


export function incrementNumbersInString(inputString: string): string {
  return inputString.replace(/\d+/g, (match) => {
    const num = parseInt(match, 10) + 1;       // increment number
    const padded = num.toString().padStart(match.length, "0"); // keep same length
    return padded;
  });
}

export function incrementNumbersInStringByValue(inputString:any, incrementBy:any) {
  // Use a regular expression to match all numbers in the string
  return inputString.replace(/\d+/g, (match:any) => {
    // Convert the matched number to an integer, increment it, and return the new value
    return parseInt(match, 10) + incrementBy;
  });
};

export function findLastAlphabet(inputString: any){
  // Iterate through the string in reverse
  for (let i = inputString.length - 1; i >= 0; i--) {
    const char = inputString[i];
    if (/[a-zA-Z]/.test(char)) {
      return i; // Return the last alphabet
    }
  }
  return 0; // Return null if no alphabet is found
};

export function encodeData (data:any){
  return CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_ENCRIPTION_SECRET_KEY).toString();
};


export function decodeData (encryptedData:any) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.NEXT_PUBLIC_ENCRIPTION_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};


export async function initializeOCRWorker(){
  try {
    const worker = createWorker({
      logger: (m: any) => console.log(m), // Logs progress updates
    });

    await (await worker).load(); // Load worker
    await (await worker).loadLanguage('eng'); // Load English language
    await (await worker).initialize('eng'); // Initialize worker with English language

    console.log('Worker initialized successfully');
    return worker;
  } catch (error) {
    console.error('Error initializing worker:', error);
    throw error;
  }
}


