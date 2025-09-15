
import { NextRequest, NextResponse } from 'next/server';
import supabase from '../supabaseConfig/supabase';

import { parseForm, funSendApiErrorMessage, funSendApiException, funCalculateTimeDifference, formatDateToISO } from '@/app/pro_utils/constant';
import fs from "fs/promises";
import { apiStatusFailureCode, } from '@/app/pro_utils/stringConstants';
import { log } from 'console';

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

    const { attendance_id, lat, lng, attendance_type } = await request.json();
    // const { fields, files } = await parseForm(request);
    
    if (attendance_type == 1) {
      return startAttendance( attendance_id, lat, lng );
    }
    else if (attendance_type == 2) {
      return pauseAttendance( attendance_id, lat, lng);
    }
    else if (attendance_type == 3) {
      return resumeAttendance( attendance_id, lat, lng);
    } else {
      return funSendApiErrorMessage("Invalid Attendance Type", "Invalid Attendance");
    }
  } catch (err) {

    return funSendApiException(err);
  }
}

async function startAttendance( id: any, lat: any, lng : any) {
  // console.log("Request Data", { id, lat, lng });
  const todayLocations: any = await getAttendanceGeoLocation(id);
  if (!todayLocations) {
    return NextResponse.json({ error: "Error fetching locations Data" }, { status: 200 });
  }
  const startLatlngArray: [any] = (todayLocations?.[0]?.start_location) || [];
  startLatlngArray.push(`SRID=4326;POINT(${lng} ${lat})`);
  // console.log("startLatlngArray", startLatlngArray);
  const { data: latLngData, error: latLngError } = await supabase
    .from("leap_customer_attendance_geolocation")
    .update([
      {
        attendance_id: id,
        start_location: startLatlngArray,// [(fields.lat[0],fields.lng[0])],

      },
    ]).eq('attendance_id', id).select();


  if (latLngError) {
    return NextResponse.json({ error: "latlng Error :- " + latLngError.message }, { status: 401 });
  } else {
    // return Response.json({"data":data});
    return NextResponse.json({ message: "Geo Location on start track successfull", status: 1, data: latLngData });
  }
}


async function pauseAttendance( id: any, lat: any, lng : any) {
  try {

    // return NextResponse.json({ error: currentDateTime }, { status: 401 });
    if (!id) {
      return funSendApiErrorMessage("Attendance id is required", "PauseAttendance function")
    }
    const todayLocations: any = await getAttendanceGeoLocation(id);

    const pausedLatlngArray: [any] = (todayLocations?.[0]?.pause_location) || [];

    pausedLatlngArray.push(`SRID=4326;POINT(${lng} ${lat})`);


    const { data: latLngData, error: latLngError } = await supabase
      .from("leap_customer_attendance_geolocation")
      .update([
        {
          is_paused: true,

          pause_location: pausedLatlngArray,
        },
      ]).eq('attendance_id', id).select();

    if (latLngError) {
      return NextResponse.json({ error: "latlng Stop error :- " + latLngError.message }, { status: 401 });
    } else {
      return NextResponse.json({ message: "Geo Location on pause track successfull", status: 1, data: latLngData });
    }
  } catch (err) {
    console.log(err);

    return funSendApiException(err);
  }
}

async function resumeAttendance(id: any, lat: any, lng : any) {
  try {

    // return NextResponse.json({ error: currentDateTime }, { status: 401 });
    if (!id) {
      return funSendApiErrorMessage("Attendance id is required", "Resume attendance function")
    }

    const todayLocations: any = await getAttendanceGeoLocation(id);
    const resumeLatlngArray: [any] = (todayLocations?.[0]?.resume_location) || [];
    resumeLatlngArray.push(`SRID=4326;POINT(${lng} ${lat})`);
    const { data: latLngData, error: latLngError } = await supabase
      .from("leap_customer_attendance_geolocation")
      .update([
        {
          is_paused: false,
          resume_location: resumeLatlngArray,

        },
      ]).eq('attendance_id', id).select();

    if (latLngError) {
      return NextResponse.json({ error: "latlng Stop error :- " + latLngError.message }, { status: 401 });
    } else {
      return NextResponse.json({ message: "Attendance Stop Successfull", status: 1, data: latLngData });
    }

  } catch (err) {
    return funSendApiException(err);
  }
}

async function getAttendanceGeoLocation(attendanceID: number) {

  const { data, error } = await supabase
    .from('leap_customer_attendance_geolocation')
    .select()
    .eq('attendance_id', attendanceID);

    // console.log("attendanceID, data, error", attendanceID, data, error);

  if (error) {
    return funSendApiException(error);
  } else {
    return data;
  }
}





