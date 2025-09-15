
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
import { messaging } from '../../../../../utils/firebaseClientConfig';

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

    const formData = await request.formData();
        const fdata = {
            
            customer_id: formData.get('customer_id'),
            working_type: formData.get('working_type'),
            in_time: formData.get('in_time') ,
            in_date: formData.get('in_date') ,
            out_date: formData.get('out_date') ,
            out_time: formData.get('out_time') ,
        };
    if (fdata.customer_id) {
      const isAttendancePresent=await getTodayAttendance(fdata.customer_id,fdata.in_date);
      if(isAttendancePresent==1){
        return NextResponse.json({status:2,message:"Attendance is already marked for the selected date"})
      }else{

        return startAttendance(fdata.customer_id,fdata.in_date,fdata.out_date,fdata.working_type,fdata.in_time,fdata.out_time);
      }
    }else{
      return funSendApiErrorMessage("Customer ID required","Customer id not passed in request");
    }
    
  } catch (err) {
    return funSendApiException(err);
  }
}


async function startAttendance(customer_id:any,in_date:any,out_date:any,working_type:any,in_time:any,out_time:any) {
  // if (!files || !files.file) {
  //   return NextResponse.json({ error: "No files received." }, { status: 400 });
  // }
  const currentDateTime = new Date();
  let fileUploadResponse;

  const {data:client_id,error:clienterror} =await supabase.from("leap_customer").select("client_id").eq("customer_id",customer_id);

  if(clienterror){
    return funSendApiErrorMessage(clienterror,"Failed to get employee details")
  }

  console.log(client_id);
  

  const { data, error } = await supabase
    .from("leap_customer_attendance")
    .insert([
      {
        approval_status: null,
        approved_by: null,
        client_id: client_id[0].client_id,
        customer_id: customer_id,
        date: new Date(in_date),
        in_time: `${in_date}T${in_time}:00`,
        attendanceStatus: 1,
        out_time: `${out_date}T${out_time}:00`,
        pause_end_time: null,
        pause_start_time: null,
        paused_duration: null,
        remark: null,
        total_hours: null,
        working_type_id: working_type,
        created_at: new Date(),
      },
    ]);
  if (error) {
    return NextResponse.json({ message: "Start Attendance error :- ", error: error.message }, { status: 401 });
  }else{
      return NextResponse.json({ message: "Attendance added successfully", status: 1 });

  }



  // const { data: latLngData, error: latLngError } = await supabase
  //   .from("leap_customer_attendance_geolocation")
  //   .insert([
  //     {
  //       attendance_id: data[0].attendance_id,
  //       start_location: [`SRID=4326;POINT(${fields.lng[0]} ${fields.lat[0]})`],// [(fields.lat[0],fields.lng[0])],
  //       created_at: new Date(),
  //     },
  //   ]).select();


  // if (latLngError) {
  //   return NextResponse.json({ error: "latlng Error :- " + latLngError.message }, { status: 401 });
  // } else {
  //   // return Response.json({"data":data});
  //   const addActivity = await addUserActivities(client_id, customer_id, "", "Attendance", new Date(in_time), data[0].attendance_id,false);
  //   if (addActivity == "1") {
  //     return NextResponse.json({ message: "Attendance started successfully but no Activity Added", status: 1, data: data, latLngData });

  //   }
  //   }
  }



async function getTodayAttendance(customer_id: any,in_date:any) {


  const { data, error } = await supabase
    .from('leap_customer_attendance')
    .select()
    .eq('customer_id', customer_id)
    .eq('date',in_date);

  console.log(data);
  
  if (error) {
    return 0;
  } else if(data && data.length>0){
    return 1;
  }else{
    return 0;
  }
}





