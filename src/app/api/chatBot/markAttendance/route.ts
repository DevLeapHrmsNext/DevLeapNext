

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { funSendApiErrorMessage, funSendApiException, funCalculateTimeDifference, formatDateToISO, formatDateYYYYMMDD } from '@/app/pro_utils/constant';
import { apiwentWrong } from '@/app/pro_utils/stringConstants';
import { addUserActivities } from '@/app/pro_utils/constantFunAddData';
import supabase from '../../supabaseConfig/supabase';


export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        switch (body.attendance_type) {
            case "1":
                return startAttendance(body);
            case "2":
                return stopAttendance(body);
            case "3":
                return pauseAttendance(body);
            case "4":
                return resumeAttendance(body);
            default:
                return funSendApiErrorMessage("Invalid Attendance Type", apiwentWrong);
        }
    } catch (err) {
        return funSendApiException(err);
    }
}

async function startAttendance(body: any) {
    const now = new Date();
    const custID = await getCustomerClientIds(body.whatsapp_number);
    const { data, error } = await supabase
        .from("leap_customer_attendance")
        .insert([{
            approval_status: null,
            approved_by: null,
            client_id: custID[0].client_id,
            customer_id: custID[0].customer_id,
            date: now,
            if_paused: false,
            img_attachment: "",
            in_time: new Date(),
            attendanceStatus: 1,
            out_time: null,
            pause_end_time: null,
            pause_start_time: null,
            paused_duration: null,
            remark: null,
            total_hours: null,
            working_type_id: body.working_type_id,
            created_at: now,
        }])
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    
    return NextResponse.json({
        message: "Attendance started successfully",
        status: 1,
        data
        // latLngData
    });
}

async function stopAttendance(body: any) {
    const now = new Date();
    const custID = await getCustomerClientIds(body.whatsapp_number);
    const attendanceID = await getAttendanceId(custID[0].customer_id);
    if (!attendanceID[0].attendance_id) {
        return funSendApiErrorMessage("Attendance ID is required", apiwentWrong);
    }

    const todayAttendance = await getTodayAttendance(attendanceID[0].attendance_id);
    let totalHours = await funCalculateTimeDifference(new Date(todayAttendance[0].in_time), now);

    if (todayAttendance[0].paused_duration > 0) {
    totalHours = (Number(totalHours) - todayAttendance[0].paused_duration).toString();
    }

    const { data, error } = await supabase
        .from("leap_customer_attendance")
        .update({
            out_time: new Date(),
            // total_hours: totalHours,
            attendanceStatus: 2,
        })
        .eq('attendance_id', attendanceID[0].attendance_id)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    return NextResponse.json({
        message: "Attendance stopped successfully",
        status: 1,
        data
        // latLngData
    });
}

async function pauseAttendance(body: any) {
    const custID = await getCustomerClientIds(body.whatsapp_number);
    const attendanceID = await getAttendanceId(custID[0].customer_id);
    if (!attendanceID[0].attendance_id) {
        return funSendApiErrorMessage("Attendance ID is required", apiwentWrong);
    }

    const now = new Date();
    const todayAttendance = await getTodayAttendance(attendanceID[0].attendance_id);
    //   const todayLocations = await getAttendanceGeoLocation(body.attendance_id);

    if (todayAttendance[0].if_paused) {
        return NextResponse.json({ error: "Attendance is already paused" }, { status: 200 });
    }

    const pause_start_time = [...(todayAttendance[0].pause_start_time ?? []), await formatDateToISO(now)];
    //   const pause_location = [...(todayLocations[0]?.pause_location ?? []), `SRID=4326;POINT(${body.lng} ${body.lat})`];
    const paused_reasons = [...(todayAttendance[0]?.paused_reasons ?? []), body.pause_reason];

    const { data, error } = await supabase
        .from("leap_customer_attendance")
        .update({
            pause_start_time,
            if_paused: true,
            attendanceStatus: 3,
            paused_reasons,
        })
        .eq('attendance_id', attendanceID[0].attendance_id)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 401 });


    return NextResponse.json({
        message: "Attendance paused successfully",
        status: 1,
        data
        // latLngData
    });
}


async function resumeAttendance(body: any) {
    const custID = await getCustomerClientIds(body.whatsapp_number);
    const attendanceID = await getAttendanceId(custID[0].customer_id);
    if (!attendanceID[0].attendance_id) {
        return funSendApiErrorMessage("Attendance ID is required", apiwentWrong);
    }

    const now = new Date();
    const todayAttendance = await getTodayAttendance(attendanceID[0].attendance_id);
    //   const todayLocations = await getAttendanceGeoLocation(body.attendance_id);

    const pause_end_time = [...(todayAttendance[0]?.pause_end_time ?? []), await formatDateToISO(now)];
    //   const resume_location = [...(todayLocations[0]?.resume_location ?? []), `SRID=4326;POINT(${body.lng} ${body.lat})`];

    let totalPaused = 0;
    for (let i = 0; i < pause_end_time.length; i++) {
        totalPaused += parseFloat(await funCalculateTimeDifference(
            new Date(pause_end_time[i]),
            new Date(todayAttendance[0].pause_start_time[i])
        ));
    }

    const paused_duration = parseFloat(((totalPaused * 100) / 60).toFixed(2));

    const { data, error } = await supabase
        .from("leap_customer_attendance")
        .update({
            pause_end_time,
            if_paused: false,
            paused_duration,
            attendanceStatus: 4,
        })
        .eq('attendance_id', attendanceID[0].attendance_id)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    return NextResponse.json({
        message: "Attendance resumed successfully",
        status: 1,
        data
        // latLngData
    });
}


async function getTodayAttendance(attendanceID: number) {
    const { data, error } = await supabase
        .from('leap_customer_attendance')
        .select()
        .eq('attendance_id', attendanceID);

    if (error) throw error;
    return data;
}

async function getCustomerClientIds(contact_number: number) {
    const { data, error } = await supabase
        .from('leap_customer')
        .select('customer_id, client_id')
        .eq('contact_number', contact_number);

    if (error) throw error;
    return data;
}

async function getAttendanceId(customer_id: number) {
    const { data, error } = await supabase
        .from('leap_customer_attendance')
        .select('attendance_id')
        .eq('customer_id', customer_id)
        .eq('date', formatDateYYYYMMDD(new Date()));

    if (error) throw error;
    return data;
}