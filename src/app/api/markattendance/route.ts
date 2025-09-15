
import { NextRequest, NextResponse } from 'next/server';
//import supabase from '../supabaseConfig/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required!");
}

const supabase = await createClient(supabaseUrl, supabaseAnonKey);

import { parseForm, funSendApiErrorMessage, funSendApiException, funCalculateTimeDifference, formatDateToISO, setUploadFileName } from '@/app/pro_utils/constant';
import fs from "fs/promises";
import { apiStatusFailureCode, apiwentWrong, } from '@/app/pro_utils/stringConstants';
import { log } from 'console';
import { addErrorExceptionLog, addUserActivities, apiUploadDocs } from '@/app/pro_utils/constantFunAddData';
import path from 'path';

export const runtime = "nodejs";


export async function POST(request: NextRequest) {

  try {

    // const { data: user, error: userError } = await supabase.auth.getUser();


    // // Handle case where the user is not authenticated
    // if (userError || !user) {
    //   return NextResponse.json(
    //     { error: 'User not authenticated' },
    //     { status: 401 }
    //   );
    // }
    // return NextResponse.json({ message: "User logged in Data", status: 1,data:user });
    const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms));

    const { fields, files } = await Promise.race([
      parseForm(request),
      timeout(5000) // 5 seconds
    ]) as { fields: any; files: any };
    // const { fields, files } = await parseForm(request);
    if (fields.attendance_type == 1) {
      return startAttendance(fields, files)
    }
    else if (fields.attendance_type == 2) {
      return stopAttendance(fields);
    }
    else if (fields.attendance_type == 3) {
      return pauseAttendance(fields);
    }
    else if (fields.attendance_type == 4) {
      return resumeAttendance(fields);
    } else {
      return funSendApiErrorMessage("Invalid Attendance Type", apiwentWrong);
    }
  } catch (err) {
    return funSendApiException(err);
  }
}


async function startAttendance(fields: any, files: { file: any; }) {
  // if (!files || !files.file) {
  //   return NextResponse.json({ error: "No files received." }, { status: 400 });
  // }
  const currentDateTime = new Date();
  let fileUploadResponse;

  if (files) {

    fileUploadResponse = await apiUploadDocs(files.file[0], fields.customer_id[0], fields.client_id, "attendance")
    console.log(fileUploadResponse);

  }

  //   if(files){

  //   const uploadedFile = files.file[0];
  //           const fileBuffer = await fs.readFile(uploadedFile.path);
  //           const fileBlob = new Blob([new Uint8Array(fileBuffer)], {
  //               type: uploadedFile.headers["content-type"]
  //             });

  //   const formData = new FormData();
  //   formData.append("client_id", fields.client_id[0]);
  //   formData.append("customer_id", fields.customer_id[0]);
  //   formData.append("docType","emp_attendance" );
  //   formData.append("file", uploadedFile);



  //   const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles", {
  //     method: "POST",
  //     // headers:{"Content-Type":"multipart/form-data"},
  //     body: formData,
  //   });
  //   const fileUploadURL = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/UploadFiles", {
  //     method: "POST",
  //     // headers:{"Content-Type":"multipart/form-data"},
  //     body: formData,
  //   });

  //   fileUploadResponse = await fileUploadURL.json();
  //   if (fileUploadResponse.error) {
  //     return NextResponse.json({ message: "File upload api call error" ,error:fileUploadResponse.error }, { status: 500 });
  //   }
  // }
  //   fileUploadResponse = await fileUploadURL.json();
  //   if (fileUploadResponse.error) {
  //     return NextResponse.json({ message: "File upload api call error" ,error:fileUploadResponse.error }, { status: 500 });
  //   }
  // }

  const { data, error } = await supabase
    .from("leap_customer_attendance")
    .insert([
      {
        approval_status: null,
        approved_by: null,
        client_id: fields.client_id[0],
        customer_id: fields.customer_id[0],
        date: currentDateTime,
        if_paused: false,
        img_attachment: fileUploadResponse ? fileUploadResponse : "",
        in_time: new Date(fields.punch_date_time[0]),
        attendanceStatus: 1,
        out_time: null,
        pause_end_time: null,
        pause_start_time: null,
        paused_duration: null,
        remark: null,
        total_hours: null,
        working_type_id: fields.working_type_id[0],
        created_at: new Date(),
      },
    ]).select();
  if (error) {
    return NextResponse.json({ message: "Start Attendance error :- ", error: error.message }, { status: 401 });
  }


  const { data: latLngData, error: latLngError } = await supabase
    .from("leap_customer_attendance_geolocation")
    .insert([
      {
        attendance_id: data[0].attendance_id,
        start_location: [`SRID=4326;POINT(${fields.lng[0]} ${fields.lat[0]})`],// [(fields.lat[0],fields.lng[0])],
        created_at: new Date(),
      },
    ]).select();


  if (latLngError) {
    return NextResponse.json({ error: "latlng Error :- " + latLngError.message }, { status: 401 });
  } else {
    // return Response.json({"data":data});
    const addActivity = await addUserActivities(fields.client_id[0], fields.customer_id[0], "", "Attendance", new Date(fields.punch_date_time[0]), data[0].attendance_id,false);
    if (addActivity == "1") {
      return NextResponse.json({ message: "Attendance started successfully but no Activity Added", status: 1, data: data, latLngData });

    }
    }
    return NextResponse.json({ message: "Attendance started successfully", status: 1, data: data, latLngData });
  }



async function stopAttendance(fields: any) {
  try {
    const currentDateTime = new Date();
    // return NextResponse.json({ error: currentDateTime }, { status: 401 });
    if (!fields.attendance_id) {
      return funSendApiErrorMessage("Attendance id is required", apiwentWrong)
    }
    const todayAttendance: any = await getTodayAttendance(fields.attendance_id);

    // for(let i=0;i<todayAttendance[0].)
    let totalHours = await funCalculateTimeDifference(new Date(todayAttendance[0].in_time), new Date(fields.punch_date_time[0]));
    if (todayAttendance[0].paused_duration > 0) {
      totalHours = (Number(totalHours) - todayAttendance[0].paused_duration) + ""
    }
    console.log("Calculated total hours:", totalHours);
    const { data, error } = await supabase
      .from("leap_customer_attendance")
      .update({ out_time: fields.punch_date_time[0], total_hours: totalHours, attendanceStatus: 2, })
      .eq('attendance_id', fields.attendance_id[0])
      .select();

    if (error) {
      return NextResponse.json({ message: "Stop Attendance Error :-", error: error.message }, { status: 401 });
    }

    const { data: latLngData, error: latLngError } = await supabase
      .from("leap_customer_attendance_geolocation")
      .update([
        {
          stop_location: `SRID=4326;POINT(${fields.lng[0]} ${fields.lat[0]})`,
          total_working_hours: totalHours
        },
      ]).eq('attendance_id', fields.attendance_id[0]).select();

    if (latLngError) {
      return NextResponse.json({ error: "latlng Stop error :- " + latLngError.message }, { status: 401 });
    } else {
      const addActivity = await addUserActivities(fields.client_id[0], fields.customer_id[0], "", "Attendance", "Attendance stoped:-" + new Date(fields.punch_date_time[0]), fields.attendance_id[0],false);
      if (addActivity == "1") {
        return NextResponse.json({ message: "Attendance Stoped Successfully but no Activity Added", status: 1, data: data, latLngData });

      }
      }
      return NextResponse.json({ message: "Attendance Stop Successfull", status: 1, data: data, latLngData });
    }
   catch (err) {
    return funSendApiException(err);
  }
}

async function pauseAttendance(fields: any) {
  try {

    // return NextResponse.json({ error: currentDateTime }, { status: 401 });
    if (!fields.attendance_id) {
      return funSendApiErrorMessage("Attendance id is required", apiwentWrong)
    }
    const todayAttendance: any = await getTodayAttendance(fields.attendance_id);
    if (todayAttendance[0].if_paused) {
      return NextResponse.json({ error: "Attendance is already paused" }, { status: 200 });
    }
    const todayLocations: any = await getAttendanceGeoLocation(fields.attendance_id);
    // return NextResponse.json({ message: "Atte  ndance Stop Successfull", status: 1,data:todayAttendance });

    if (!todayLocations) {
      return NextResponse.json({ error: "Error fetching locations Data" }, { status: 200 });
    }
    // const totalHours = await funCalculateTimeDifference(new Date(todayAttendance[0].in_time), new Date(fields.punch_date_time[0]));
    const pausedTimeArray: any[] = Array.isArray(todayAttendance) && todayAttendance[0]?.pause_start_time
      ? todayAttendance[0].pause_start_time
      : [];
    pausedTimeArray.push(await formatDateToISO(new Date(fields.punch_date_time[0])));
    //create and push pause lat lng to array

    const pausedLatlngArray: [any] = (todayLocations?.[0]?.pause_location) || [];
    console.log(pausedLatlngArray);
    console.log(`SRID=4326;POINT(${fields.lng[0]} ${fields.lat[0]})`);

    pausedLatlngArray.push(`SRID=4326;POINT(${fields.lng[0]} ${fields.lat[0]})`);
    const pauseReason: any[] = todayAttendance[0]?.paused_reasons ? todayAttendance[0].paused_reasons
      : [];
    pauseReason.push(fields.pause_reason[0])

    console.log("Type of Paused Time Array:", typeof pausedTimeArray);

    const { data, error } = await supabase
      .from("leap_customer_attendance")
      .update({ pause_start_time: pausedTimeArray, if_paused: true, attendanceStatus: 3, paused_reasons: pauseReason })
      .eq('attendance_id', fields.attendance_id[0])
      .select();

    if (error) {
      return NextResponse.json({ message: "Stop Attendance Error :-", error: error.message }, { status: 401 });
    }

    const { data: latLngData, error: latLngError } = await supabase
      .from("leap_customer_attendance_geolocation")
      .update([
        {
          is_paused: true,

          pause_location: pausedLatlngArray,
        },
      ]).eq('attendance_id', fields.attendance_id[0]).select();

    if (latLngError) {
      return NextResponse.json({ error: "latlng Stop error :- " + latLngError.message }, { status: 401 });
    } else {
      const addActivity = await addUserActivities(fields.client_id[0], fields.customer_id[0], "", "Attendance", "Attendance paused:-" + new Date(fields.punch_date_time[0]), fields.attendance_id[0],false);
      if (addActivity == "1") {
        return NextResponse.json({ message: "Attendance Paused Successfully but no Activity Added", status: 1, data: data, latLngData });

      }
      return NextResponse.json({ message: "Attendance Paused Successfull", status: 1, data: data, latLngData });
    }




  } catch (err) {
    console.log(err);

    return funSendApiException(err);
  }
}

async function resumeAttendance(fields: any) {
  try {

    // return NextResponse.json({ error: currentDateTime }, { status: 401 });
    if (!fields.attendance_id) {
      return funSendApiErrorMessage("Attendance id is required", apiwentWrong)
    }
    const todayAttendance: any = await getTodayAttendance(fields.attendance_id);
    // if (todayAttendance[0].if_paused) {
    //   return NextResponse.json({ error: "Attendance is already paused" }, { status: 200 });
    // }
    const todayLocations: any = await getAttendanceGeoLocation(fields.attendance_id);
    if (!todayLocations) {
      return NextResponse.json({ error: "Error fetching locations Data" }, { status: 200 });
    }
    const pausedTimeEndArray: [any] = (todayAttendance?.[0]?.pause_end_time) || [];
    pausedTimeEndArray.push(await formatDateToISO(new Date(fields.punch_date_time[0])));

    const resumeLatlngArray: [any] = (todayLocations?.[0]?.resume_location) || [];
    resumeLatlngArray.push(`SRID=4326;POINT(${fields.lng[0]} ${fields.lat[0]})`);

    let totalPausedTime = 0
    for (let i = 0; i < await pausedTimeEndArray.length; i++) {
      const totalHours = await funCalculateTimeDifference(new Date(pausedTimeEndArray[i]), new Date(todayAttendance[0].pause_start_time[i]));

      totalPausedTime = totalPausedTime + parseFloat(totalHours);
    }
    // console.log(parseFloat((totalPausedTime*100)/60+"").toFixed(2));

    let totalHours = await funCalculateTimeDifference(new Date(todayAttendance[0].in_time), new Date(fields.punch_date_time[0]));
    const { data, error } = await supabase
      .from("leap_customer_attendance")
      .update({ pause_end_time: pausedTimeEndArray, if_paused: false, paused_duration: parseFloat((totalPausedTime * 100) / 60 + "").toFixed(2), attendanceStatus: 4, })
      .eq('attendance_id', fields.attendance_id[0])

      .select();


    if (error) {
      return NextResponse.json({ message: "Stop Attendance Error :-", error: error.message }, { status: 401 });
    }

    const { data: latLngData, error: latLngError } = await supabase
      .from("leap_customer_attendance_geolocation")
      .update([
        {
          is_paused: false,
          resume_location: resumeLatlngArray,

        },
      ]).eq('attendance_id', fields.attendance_id[0]).select();

    if (latLngError) {
      return NextResponse.json({ error: "latlng Stop error :- " + latLngError.message }, { status: 401 });
    } else {
      const addActivity = await addUserActivities(fields.client_id[0], fields.customer_id[0], "", "Attendance", "Attendance resumed:-" + new Date(fields.punch_date_time[0]), fields.attendance_id[0],false);
      if (addActivity == "1") {
        return NextResponse.json({ message: "Attendance Resumed Successfully but no Activity Added", status: 1 });

      }
      return NextResponse.json({ message: "Attendance Resumed Successfull", status: 1, data: data, latLngData });
    }

  } catch (err) {
    console.log(err);

    return funSendApiException(err);
  }
}

async function getTodayAttendance(attendanceID: number) {


  const { data, error } = await supabase
    .from('leap_customer_attendance')
    .select()
    .eq('attendance_id', attendanceID);


  if (error) {
    return funSendApiException(error);
  } else {
    return data;
  }
}

async function getAttendanceGeoLocation(attendanceID: number) {


  const { data, error } = await supabase
    .from('leap_customer_attendance_geolocation')
    .select()
    .eq('attendance_id', attendanceID);


  if (error) {
    return funSendApiException(error);
  } else {
    return data;
  }
}



