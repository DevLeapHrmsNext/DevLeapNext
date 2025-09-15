import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
  try {
    const { customer_id } = await request.json();

    if (!customer_id) {
      return NextResponse.json({ status: 0, message: "Customer ID is required" }, { status: apiStatusFailureCode });
    }

    //current users to get manager_id
    const { data: userData, error: userError } = await supabase
      .from("leap_customer")
      .select("manager_id")
      .eq("customer_id", customer_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ status: 0, message: "User not found", error: userError }, { status: apiStatusFailureCode });
    }

    const { manager_id } = userData;

    //manager details
    let managerDetails = null;
    if (manager_id) {
      const { data: managerData, error: managerError } = await supabase
        .from("leap_customer")
        .select("customer_id, emp_id, name, contact_number, email_id, profile_pic, designation_id, leap_client_designations(designation_name), branch_id")
        .eq("customer_id", manager_id)
        .single();

      if (!managerError && managerData) {
        managerDetails = managerData;
      }
    }

    //team members employees under the same manager, excluding current user
    const { data: teamMembers, error: teamError } = await supabase
      .from("leap_customer")
      .select("customer_id, emp_id,  name, contact_number, email_id, profile_pic, designation_id, leap_client_designations(designation_name), branch_id")
      .eq("manager_id", manager_id)
      .neq("customer_id", customer_id);

    if (teamError) {
      return NextResponse.json({ status: 0, message: "No manager assigned" }, { status: apiStatusFailureCode });
    }

    //if this user is also a manager to anyone
    const { data: subordinates, error: subError } = await supabase
      .from("leap_customer")
      .select("customer_id, emp_id, name, contact_number, email_id, profile_pic, designation_id, leap_client_designations(designation_name), branch_id")
      .eq("manager_id", customer_id);
    if (subError) {
      return NextResponse.json({ status: 0, message: "Error fetching subordinates", error: subError }, { status: apiStatusFailureCode });
    }
    const todayDate = new Date().toISOString().split("T")[0];

    const subordinateIds = subordinates.map((s) => s.customer_id);

    let attendanceMap = new Map<number, boolean>();

    if (subordinateIds.length > 0) {
      const { data: attendanceRecords, error: attendanceError } = await supabase
        .from("leap_customer_attendance")
        .select("customer_id")
        .in("customer_id", subordinateIds)
        .eq("date", todayDate);

      if (attendanceError) {
        return NextResponse.json({ status: 0, message: "Error fetching attendance", error: attendanceError }, { status: apiStatusFailureCode });
      }

      // Mark which customer_ids are present
      attendanceRecords?.forEach((record) => {
        attendanceMap.set(record.customer_id, true);
      });
    }

    // Append "attendanceStatus" to each subordinate
    const updatedSubordinates = subordinates.map((sub) => ({
      ...sub,
      attendanceStatus: attendanceMap.has(sub.customer_id) ? "Present" : "Absent",
    }));
    return NextResponse.json({
      status: 1, message: "Team hierarchy fetched successfully",
      data: {
        manager: managerDetails,
        teamMembers: teamMembers || [],
        subordinates:updatedSubordinates || []
      }
    }, { status: apiStatusSuccessCode });

  } catch (error) {
    return funSendApiException(error);
  }
}