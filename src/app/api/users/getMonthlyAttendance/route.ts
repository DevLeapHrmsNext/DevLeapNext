import { formatDateYYYYMMDD, funloggedInAnotherDevice, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";

export async function POST(request: NextRequest) {
  try {
    const { customer_id, client_id, branch_id, platform, auth_token, month, year } = await request.json();


    if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
      return funloggedInAnotherDevice();
    }
    const today = new Date();

    // Safely convert month and year to numbers
    const selectedMonth = Number(month ?? today.getMonth() + 1); // 1-based
    const selectedYear = Number(year ?? today.getFullYear());

    // Validation
    if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
      return NextResponse.json({ status: 0, message: "Invalid month" }, { status: 400 });
    }
    if (isNaN(selectedYear) || selectedYear < 1900 || selectedYear > 2100) {
      return NextResponse.json({ status: 0, message: "Invalid year" }, { status: 400 });
    }
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;


    const { data: attendanceData, error: attendanceError } = await supabase
      .from("leap_customer_attendance")
      .select("date,in_time")
      .eq("customer_id", customer_id)
      .gte("date", startDate)
      .lte("date", endDate);
    // console.log("data: ", attendanceData)
    if (attendanceError) {
      return funSendApiErrorMessage(attendanceError, "Unable to fetch attendance data");
    }

    const { data: leaveData, error: leaveError } = await supabase
      .from("leap_customer_apply_leave")
      .select("from_date,to_date")
      .eq("customer_id", customer_id)
      .eq("leave_status", 2)
      .or(`to_date.gte.${startDate},from_date.lte.${endDate}`);

    if (leaveError) {
      return funSendApiErrorMessage(leaveError, "Unable to fetch leave data");
    }

    const { data: holidayData, error: holidayError } = await supabase
      .from("leap_holiday_list")
      .select("date")
      .eq("client_id", client_id)
      .eq("branch_id", branch_id)
      .gte("date", startDate)
      .lte("date", endDate);

    if (holidayError) {
      return funSendApiErrorMessage(holidayError, "Unable to fetch holiday data");
    }

    const attendanceMap = new Map<string, boolean>();
    attendanceData?.forEach(entry => {
      const normalizedDate = formatDateYYYYMMDD(new Date(entry.date));
      if (entry.in_time) {
        attendanceMap.set(normalizedDate, true);
      }
    });

    const holidaySet = new Set<string>(
      (holidayData ?? []).map(h => formatDateYYYYMMDD(new Date(h.date)))
    );

    const leaveSet = new Set<string>();
    leaveData?.forEach(l => {
      const from = new Date(l.from_date);
      const to = new Date(l.to_date);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        leaveSet.add(formatDateYYYYMMDD(new Date(d)));
      }
    });

    const calendar: { date: string, status: string }[] = [];
   for (let day = 1; day <= daysInMonth; day++) {
  const dateObj = new Date(selectedYear, selectedMonth - 1, day);


 const isFuture = dateObj > today;


  const dateStr = formatDateYYYYMMDD(dateObj);
  const dayOfWeek = dateObj.getDay();

  let status = "";
  if (!isFuture) {
  if (attendanceMap.has(dateStr)) {
    status = "Present";
  } else if (dayOfWeek === 0 || dayOfWeek === 6) {
    status = "Weekend";
  } else if (holidaySet.has(dateStr)) {
    status = "Holiday";
  } else if (leaveSet.has(dateStr)) {
    status = "On Leave";
  } else {
    status = "Absent";
  }
}

  calendar.push({ date: dateStr, status });
}

    return NextResponse.json({
      status: 1,
      message: "Attendance Calendar",
      data: calendar
    }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}
