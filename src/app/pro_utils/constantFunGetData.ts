import { NextResponse } from "next/server";
import supabase from "../api/supabaseConfig/supabase";
import { calculateNumMonths, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException, getFirstDateOfYear, getFirstDateOfYearbyDate, getLastDateOfYear } from "./constant";
import { allEmployeeListData, apiStatusSuccessCode, apiwentWrong, dashedString } from "./stringConstants";
import { is } from "date-fns/locale";

export async function getSupportComments(id: number) {

  const { data, error } = await supabase
    .from('leap_client_employee_requests_updates')
    .select('*, leap_customer(name), leap_request_status(status)')
    .eq('request_id', id);

  if (error) {
    console.log(error);

    return funSendApiException(error);
  } else {
    return data;
  }
}

export async function funGetClientEmployeeList(client_id: any, limit: number, userRole: number, getAttendance: boolean) {
  let qwery = supabase.from("leap_customer")
    .select(`
      *,
      leap_user_role(*),  
      leap_client_designations(*),leap_client_departments(*),
      leap_relations(*) ,leap_customer_attendance!leap_customer_attendance_employee_id_fkey(*)
    `)
    .eq('client_id', client_id).eq('employment_status', true).order("name", { ascending: true });
  if (limit > 0) {
    qwery = qwery.limit(limit)
  }
  if (userRole > 2) {
    qwery = qwery.filter('user_role', 'in', '(4,5,6)')
  } else if (userRole == 2) {
    qwery = qwery.filter('user_role', 'in', '(3,4,5,6)')
  }
  if (getAttendance) {
    qwery = qwery.eq('leap_customer_attendance.date', formatDateYYYYMMDD(new Date()))
  }
  const { data: employeeData, error } = await qwery;
  if (error) {
    return error;
  }
  else {
    return { employeeCount: employeeData.length, employees: employeeData };
  }
}

export async function funGetClientEmployeeSummary(clientId: any) {
  let empSummary: EmployeeSummary = {
    totalCount: 0,
    totalActive: 0,
    totalInactive: 0,
    branch: []
  };
  let employeeAllSummary = []
  const { data: branchData, error: branchError } = await supabase.from("leap_client_branch_details")
    .select('*').eq('client_id', clientId);
  if (branchError) {
    console.log("this is the branch error", branchError);
    return branchError;
  }
  for (let i = 0; i < branchData.length; i++) {
    empSummary.branch.push({
      branchId: branchData[i].id, branchNumber: branchData[i].branch_number, branchTotalEmp: 0, branchTotalActiveEmp: 0, branchTotalOnLeaveEmp: 0
    })
  }


  for (let i = 0; i < empSummary.branch.length; i++) {
    const { data: employeeData, error } = await supabase.from("leap_customer")
      .select(`
    *,
    leap_customer_attendance!leap_customer_attendance_employee_id_fkey(
      customer_id,
      date  
    )
  `)
      .eq('client_id', clientId).eq('branch_id', empSummary.branch[i].branchId).eq('employment_status', true)
      .filter('leap_customer_attendance.date', 'eq', formatDateYYYYMMDD(new Date()))

    if (error) {

      console.log(error);

      return error;
    } else {
      // employeeAllSummary.push(employeeData);
      empSummary.branch[i].branchTotalEmp = empSummary.branch[i].branchTotalEmp + employeeData.length;
      for (let j = 0; j < employeeData.length; j++) {
        empSummary.branch[i].branchTotalActiveEmp = empSummary.branch[i].branchTotalActiveEmp + employeeData[j].leap_customer_attendance.length;

      }


      empSummary.totalCount = empSummary.totalCount + empSummary.branch[i].branchTotalEmp;
      empSummary.totalActive = empSummary.totalActive + empSummary.branch[i].branchTotalActiveEmp;
      empSummary.totalInactive = empSummary.totalInactive + (empSummary.branch[i].branchTotalEmp - empSummary.branch[i].branchTotalActiveEmp);
      empSummary.branch[i].branchTotalOnLeaveEmp = 0;
    }

    const { data: leaveData, error: leaveError } = await supabase.from("leap_customer_apply_leave")
      .select('*').eq('client_id', clientId).eq('branch_id', empSummary.branch[i].branchId)
      .gte('to_date', formatDateYYYYMMDD(new Date())) // `to_date` must be >= `fromDate`
      .lte('from_date', formatDateYYYYMMDD(new Date()));


    if (leaveError) {
      console.log("leave error issue", leaveError);

      return leaveError;
    } else {
      empSummary.branch[i].branchTotalOnLeaveEmp = leaveData.length;
    }

  }


  return empSummary;

}

export async function funGetClientEmployeeListForManager(client_id: any, managerId: any) {
  const { data: employeeData, error } = await supabase.from("leap_customer")
    .select(`
      *,
      leap_user_role(*),  
      leap_client_designations(*),
      leap_relations(*) 
    `)
    .eq('client_id', client_id).eq("leap_customer.manager_id", managerId);


  if (error) {
    return error;
  }
  else {
    return { employeeCount: employeeData.length, employees: employeeData };
  }
}

export async function funGetClientCustomerList(client_id: any) {
  const { data: customerData, error } = await supabase.from("leap_customer")
    .select(`
      *,
    `).eq('client_id', client_id).eq('role_id', 4);

  if (error) {
    return null;
  }
  else {
    return { employeeCount: customerData.length, employees: customerData };
  }
}

export async function funGetClientList() {
  const { data: employeeData, error } = await supabase.from("leap_client")
    .select(`
      *,
      leap_client_branch_details(*)
    `);

  if (error) {
    return error;
  }
  else {
    return { employeeCount: employeeData.length, employees: employeeData };
  }
}

export async function funGetClientEmployeeLeaveRequest(client_id: any, leave_status: any, fromDate: any, toDate: any, isfilter: boolean) {


  console.log("This is funGetClientEmployeeLeaveRequest called");

  let query = supabase.from("leap_customer_apply_leave")
    .select('*').eq('client_id', client_id);

  if (leave_status) {
    query = query.eq('leave_status', leave_status);
  }
  if (fromDate) {
    query = query.eq('from_date', formatDateYYYYMMDD(fromDate));
  }
  if (toDate) {
    query = query.eq('to_date', formatDateYYYYMMDD(toDate));
  }
  if (isfilter) {
    // Check if `fromDate` falls between `from_date` and `to_date` in the database
    query = query.gte('to_date', formatDateYYYYMMDD(fromDate)) // `to_date` must be >= `fromDate`
      .lte('from_date', formatDateYYYYMMDD(fromDate)); // `from_date` must be <= `fromDate`
  }



  const { data: leaveRequests, error } = await query;
  if (error) {
    return error;
  }
  else {
    return { totalRequest: leaveRequests.length, employees: leaveRequests };
  }
}

export async function funGetEmployeeLeaveRequestforManager(client_id: any, leave_status: any, fromDate: any, toDate: any, managerId: any, isfilter: boolean) {

  let query = supabase
    .from("leap_customer_apply_leave")
    .select(`
    *,
    leap_customer!leap_customer_leave_customer_id_fkey(customer_id)
  `) // Explicitly specify the relationship using the foreign key alias
    .eq("client_id", client_id) // Filter by client_id
    .eq("leap_customer.manager_id", managerId);

  if (leave_status) {
    query = query.eq("leave_status", leave_status);
  }
  if (fromDate) {
    query = query.eq("from_date", formatDateYYYYMMDD(fromDate));
  }
  if (toDate) {
    query = query.eq("to_date", formatDateYYYYMMDD(toDate));
  }
  if (isfilter) {
    query = query
      .gte("to_date", formatDateYYYYMMDD(fromDate)) // to_date >= fromDate
      .lte("from_date", formatDateYYYYMMDD(fromDate)); // from_date <= fromDate
  }

  // query = query.eq("leap_customer.manager_id", managerId);

  const { data: leaveRequests, error } = await query;

  if (error) {
    console.error("Error:", error);
    return error;
  } else {
    return { totalRequest: leaveRequests.length, employees: leaveRequests };
  }

}


export async function funGetClientEmployeeAttendance(client_id: any, date: any) {
  let query = supabase.from("leap_customer_attendance")
    .select('*,leap_customer!leap_customer_attendance_employee_id_fkey(name)')
    .eq('client_id', client_id);
  const { data: totalemployeeData, error: error } = await query;
  if (error) {
    console.log(error);

    return 'Without Date Error:- ' + error;
  }
  if (date) {
    query = query.eq('date', formatDateYYYYMMDD(date));
  }

  const { data: employeeData, error: withDate } = await query;
  if (withDate) {
    return withDate;
  }
  else {
    return { totalActiveEmployees: totalemployeeData.length, presentCount: employeeData.length, employees: employeeData };
  }
}

export async function funGetClientEmployeeAttendanceforManager(client_id: any, date: any, managerId: any) {
  let query = supabase.from("leap_customer_attendance")
    .select(`*,leap_customer_apply_leave(customer_id)`)
    .eq('client_id', client_id).eq("leap_customer.manager_id", managerId);
  const { data: totalemployeeData, error: error } = await query;
  if (error) {
    console.log("funGetClientEmployeeAttendanceforManager", error);

    return 'Without Date Error:- ' + error;
  }
  if (date) {
    query = query.eq('date', formatDateYYYYMMDD(date));
  }

  const { data: employeeData, error: withDate } = await query;
  if (withDate) {
    return withDate;
  }
  else {
    return { totalActiveEmployees: totalemployeeData.length, presentCount: employeeData.length, employees: employeeData };
  }
}

export async function funGetClientAnnouncement(client_id: any, date: any) {
  let query = supabase.from("leap_customer_attendance")
    .select(`*`)
    .eq('client_id', client_id);
  if (date) {
    query = query.eq('to_date', formatDateYYYYMMDD(date));
  }

  const { data: employeeData, error } = await query;
  if (error) {
    return error;
  }
  else {
    return { employeeCount: employeeData.length, employees: employeeData };
  }
}


export async function funGetClientHolidayList(client_id: any, branch_id: any, platform: any) {

  let query = supabase.from("leap_holiday_list")
    .select(`*`)
    .eq('client_id', client_id);
  if (branch_id) {
    query = query.eq('branch_id', branch_id);
  }
  query = query.gte('date', formatDateYYYYMMDD(getFirstDateOfYear())) // `to_date` must be >= `fromDate`
    .lte('date', formatDateYYYYMMDD(getLastDateOfYear()));


  const { data: holidayData, error } = await query;
  if (error) {
    return error;
  }
  else {
    const holidaysByMonth = holidayData.reduce((acc, holiday) => {
      const monthName = new Date(holiday.date).toLocaleString("en-US", { month: "long" }); // Convert date to month name
      if (!acc[monthName]) {
        acc[monthName] = [];
      }
      acc[monthName].push(holiday);
      return acc;
    }, {});
    return { totalHolidays: holidayData.length, holidays: platform && (platform.toLowerCase() == "android" || platform == "ios") ? holidaysByMonth : holidayData };
  }
}

export async function funGetClientUpCommingHolidayList(client_id: any, branch_id: any, platform: any) {

  let query = supabase.from("leap_holiday_list")
    .select(`*`)
    .eq('client_id', client_id);
  if (branch_id) {
    query = query.eq('branch_id', branch_id);
  }
  query = query.gte('date', formatDateYYYYMMDD(new Date())).order("date", { ascending: true }); // `to_date` must be >= `fromDate`


  const { data: holidayData, error } = await query;
  if (error) {
    return error;
  }
  else {
    const holidaysByMonth = holidayData.reduce((acc, holiday) => {
      const monthName = new Date(holiday.date).toLocaleString("en-US", { month: "long" }); // Get month name
      if (!acc[monthName]) {
        acc[monthName] = [];
      }
      acc[monthName].push(holiday);
      return acc;
    }, {});

    // **Convert grouped object into an array of objects**
    const formattedHolidays = Object.keys(holidaysByMonth).map((month) => ({
      month: month,
      holidays: holidaysByMonth[month],
    }));
    return { totalHolidays: holidayData.length, holidays: platform && (platform.toLowerCase() == "android" || platform == "ios") ? formattedHolidays : holidayData };
  }
}


export async function getMyAttendance(customerId: any, clientId: any, date: any) {

  const { data, error } = await supabase
    .from('leap_customer_attendance')
    .select('*,leap_working_type(type)')
    .eq('customer_id', customerId).eq('client_id', clientId).eq('date', formatDateYYYYMMDD(date));

  if (error) {
    console.log(error);

    return funSendApiException(error);
  } else {
    return data;
  }
}

export async function getMyDocumentsList(customerId: any) {

  const { data, error } = await supabase
    .from('leap_customer_documents')
    .select('*,leap_document_type(document_name)')
    .eq('customer_id', customerId);

  if (error) {
    console.log(error);

    return funSendApiException(error);
  } else {
    return data;
  }
}

export async function getClientLeaveDays(customerId: any, clientId: any, date: any) {

  const { data, error } = await supabase
    .from('leap_customer_attendance')
    .select()
    .eq('customer_id', customerId).eq('client_id', clientId).eq('date', formatDateYYYYMMDD(date));

  if (error) {
    console.log(error);

    return funSendApiException(error);
  } else {
    return data;
  }
}


export async function getcustomerWorkingWeekDays(customerId: any, clientId: any, branchId: any) {

  const { data, error } = await supabase
    .from('leap_customer_working_days')
    .select()
    .eq('customer_id', customerId).eq('client_id', clientId).eq('branch_id', branchId);

  if (error) {
    console.log(error);

    return funSendApiErrorMessage(error, "Customer Working Days fetch issue");
  } else {
    return data;
  }
}

export async function getcustomerByDesignation(customerId: any, clientId: any, branchId: any, designationID: any) {

  let query = supabase
    .from('leap_customer_working_days')
    .select()
    .eq('client_id', clientId);
  if (branchId!) {
    query = query.eq('branch_id', branchId)
  }
  if (designationID!) {
    query = query.eq('designation_id', designationID)
  }

  const { data, error } = await query;
  if (error) {
    console.log(error);

    return funSendApiErrorMessage(error, "leap Working days fetch issue");
  } else {

    return data;
  }
}


export async function getUserRoles() {
  console.log("================" + "getUserRoles" + "=================");

  const { data, error } = await supabase
    .from('leap_user_role')
    .select();

  if (error) {
    return null;
  } else {
    return data;
  }
}


export async function funGetCustomer(customerID: any) {
  // console.log("================" + "funGetCustomer" + "=================");

  const { data: customer, error } = await supabase.from("leap_customer")
    .select(`*`).eq('customer_id', customerID);

  if (error) {
    return null;
  }
  else {
    return { employeeCount: customer.length, employees: customer };
  }
}

export async function getAllActivitiesOfUsers(clientId: any, branchId: any,) {
  // console.log("================" + "getAllActivitiesOfUsers" + "=================");

  try {
    let qwery = supabase.from("leap_client_useractivites")
      .select(`*`).eq('client_id', clientId);

    qwery = qwery.order('id', { ascending: true })
    const { data: userActivities, error } = await qwery;

    if (error) {

      return funSendApiErrorMessage(error, "Failed to get user Activities")

    }

    return NextResponse.json({ status: 1, message: 'User Activities', data: userActivities }, { status: apiStatusSuccessCode })



  } catch (error) {
    console.log(error);
    return funSendApiException(error);

  }
}
export async function getDashboardAllActivitiesOfUsers(clientId: any, branchId: any) {
  // console.log("================" + "getDashboardAllActivitiesOfUsers" + "=================");


  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    let qwery = supabase.from("leap_client_useractivites")
      .select(`*,leap_user_activity_type(*)`).eq('client_id', clientId)
      // .eq("user_notify",false)
      .gte("created_at", startOfDay)
      .lt("created_at", endOfDay);


    qwery = qwery.order('id', { ascending: false })
    const { data: userActivities, error } = await qwery;

    if (error) {
      console.log(error);

      return []

    }

    return userActivities;


  } catch (error) {
    console.log(error);
    return funSendApiException(error);

  }
}
export async function getUserDashboardAllActivitiesOfUsers(clientId: any, customer_id: any, isManager: boolean) {
  // console.log("================" + "getDashboardAllActivitiesOfUsers" + "=================");

  if (!isManager) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      let qwery = supabase.from("leap_client_useractivites")
        .select(`customer_id,activity_details,activity_type_id(activity_type )`)
        // .eq('client_id', clientId)
        .eq('customer_id', customer_id)
        .eq("user_notify", true)
        .gte("created_at", startOfDay)
        .lt("created_at", endOfDay);

      qwery = qwery.order('id', { ascending: false });
      const { data: userActivities, error } = await qwery;

      if (error) {
        console.log(error);
        return [];
      }
      const userNotiActivities = userActivities.map(a => ({ ...a, type: "user" }));
        return userNotiActivities;
      } catch (error) {
        console.log(error);
        return funSendApiException(error);
      }
    } else {
      try {
        const { data: subordinates, error: subError } = await supabase
        .from("leap_customer")
        .select("name, customer_id")
        .eq("manager_id", customer_id);
      if (subError) {
        console.log(subError);
          return [];
        }
     const subordinateIds = subordinates.map((s) => s.customer_id);
     const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const { data: teamActivities, error: error1 } = await supabase
        .from("leap_client_useractivites")
        .select(`*, leap_user_activity_type(*)`)
        .in("customer_id", subordinateIds)
        .gte("created_at", startOfDay)
        .lt("created_at", endOfDay)
        .order("id", { ascending: false });

      if (error1) {
        console.log(error1);
        return [];
      }
      const { data: userActivities, error } = await supabase
        .from("leap_client_useractivites")
        .select(`customer_id, activity_details, activity_type_id(activity_type), created_at`)
        .eq("customer_id", customer_id)
        .eq("user_notify", true)
        .gte("created_at", startOfDay)
        .lt("created_at", endOfDay)
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
        return [];
      }
      const userNotiActivities = userActivities.map(a => ({ ...a, type: "user" }));
      const teamNotiActivities = teamActivities.map(a => ({ ...a, type: "team" }));

      
      const mergedActivities = [...userNotiActivities, ...teamNotiActivities]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return mergedActivities;
      // return {userActivities, teamActivities};
    } catch (error) {
      console.log(error);
      return funSendApiException(error);
    }
  }
}
export async function funGetClientDocumentStatus(clientId: any, branchId: any) {
  // console.log("================" + "funGetClientDocumentStatus" + "=================");

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const { data: documents, error } = await supabase.from("leap_client_documents")
    .select(`*`)
    .eq('client_id', clientId)
    .eq('branch_id', branchId)
    .gte('till_date', oneMonthAgo.toISOString().split('T')[0])

  if (error) {
    return null;
  }
  else {
    return { employeeCount: documents.length, data: documents };
  }
}


export async function funGetActivityTypeId(typeText: any) {
  // console.log("================" + "funGetActivityTypeId" + "=================");

  const { data: activityID, error } = await supabase.from("leap_user_activity_type")
    .select(`id`)
    .eq('activity_type', typeText)
  if (error) {
    return null;
  } else {
    return activityID;
  }

}

export async function funGetMidShortCutsList(client_id: any) {
  // console.log("================" + "funGetMidShortCutsList" + "=================");

  const { data: shortCutList, error } = await supabase.from("leap_client_admin_mid_shortcuts")
    .select(`*,leap_dashboard_mid_shortcut(*)`).eq('client_id', client_id).eq('show_on_dashboard', true).limit(3);

  if (error) {

    return null;
  }
  else {
    const shorcutDataList: any = [];

    for (let i = 0; i < shortCutList.length; i++) {
      if (shortCutList[i].leap_dashboard_mid_shortcut.shortcut_name === "Projects") {
        const { data: projects, error: projectsError } = await supabase.from("leap_client_project").
          select('project_id,project_name,leap_project_status!inner(project_status_name)')
          .limit(2) as unknown as { data: Project[]; error: any };
        if (projectsError) {
          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: [{
              id: "",
              name: "",
              date: "",
              status: "",
            }]
          })
        } else {
          let relatedData1 = [];
          for (let i = 0; i < projects.length; i++) {

            relatedData1.push({
              id: projects[i].project_id,
              name: projects[i].project_name,
              date: projects[i].leap_project_status?.project_status_name,
              status: "",
            })
          }

          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: relatedData1,
          })
        }
      } else if (shortCutList[i].leap_dashboard_mid_shortcut.shortcut_name === "Announcements") {
        const { data: announcement, error: announcementError } = await supabase.from("leap_client_announcements").
          select('announcement_id,announcement_title,announcement_date')
          .gte("announcement_date", dashedDateYYYYMMDD(new Date())).limit(2);
        if (announcementError) {

          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: [{
              id: "",
              name: "",
              date: "",
              status: "",
            }]
          })
        } else {
          let relatedData1 = [];
          for (let i = 0; i < announcement.length; i++) {

            relatedData1.push({
              id: announcement[i].announcement_id,
              name: announcement[i].announcement_title,
              date: announcement[i].announcement_date,
              status: "",
            })
          }

          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: relatedData1
          })
        }
      }
      else if (shortCutList[i].leap_dashboard_mid_shortcut.shortcut_name === "Leave") {
        const today = dashedDateYYYYMMDD(new Date());

        const { data: leaves, error: leaveError } = await supabase.from("leap_customer_apply_leave").
          select('id,from_date,leap_approval_status!inner(approval_type),leap_customer!inner(name)')
          .or(
            `and(from_date.lte.${today},to_date.gte.${today}),from_date.eq.${today}`
          )
          .order("from_date", { ascending: false }).limit(2) as unknown as { data: leave[]; error: any }
        if (leaveError) {
          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: [{
              id: "",
              name: "",
              date: "",
              status: "",
            }]
          })
        } else {
          let relatedData1 = [];

          for (let i = 0; i < leaves.length; i++) {

            relatedData1.push({
              id: leaves[i].id,
              name: leaves[i].leap_customer?.name,
              date: leaves[i].from_date,
              status: leaves[i].leap_approval_status?.approval_type,
            })
          }

          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: relatedData1
          })
        }
      }
      else if (shortCutList[i].leap_dashboard_mid_shortcut.shortcut_name === "Documents") {
        const { data: docs, error: docsError } = await supabase.from("leap_customer_documents").
          select('id,leap_customer!inner(name),leap_document_type!inner(document_name)').lte("updated_at", new Date().toISOString())
          .order("updated_at", { ascending: false }).limit(2) as unknown as { data: docs[]; error: any };
        if (docsError) {

          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: [{
              id: "",
              name: "",
              date: "",
              status: "",
            }]
          })
        } else {

          let relatedData1 = [];
          for (let i = 0; i < docs.length; i++) {

            relatedData1.push({
              id: docs[i].id,
              name: docs[i].leap_customer?.name,
              date: "",
              status: docs[i].leap_document_type?.document_name,
            })
          }

          shorcutDataList.push({
            shortcut: shortCutList[i],
            related_data: relatedData1
          })
        }
      }
    }



    return shorcutDataList;
  }
}
export async function funGetShortCutsOneList(client_id: any) {
  console.log("================" + "funGetShortCutsOneList" + "=================");

  const { data: shortCutList, error } = await supabase.from("leap_client_dashboard_shortcuts_one")
    .select(`*,leap_dashboard_shortcuts(*)`).eq('client_id', client_id).eq("is_active", true);

  if (error) {
    console.log("this is the short cut method error-------------", error);

    return null;
  }
  else {
    return shortCutList;
  }
}

export async function getDesignationSetUserRole(designation_id: any) {
  console.log("================" + "getDesignationSetUserRole" + "=================");

  let userRole = { role: 5, isMAnager: false, isTeamlead: false, isemployee: true }
  const { data: Designation, error: desigError } = await supabase.from('leap_client_designations').select('*').eq('id', designation_id);
  console.log("this isthe designation got------", Designation);
  if (Designation && Designation.length > 0) {
    if (Designation[0].designation_name.toLowerCase().includes('manager')) {
      userRole = { role: 4, isMAnager: true, isTeamlead: false, isemployee: false }
    } else if (Designation[0].designation_name.toLowerCase().includes('team lead')) {
      userRole = { role: 9, isMAnager: false, isTeamlead: true, isemployee: false }
    }
  }
  return userRole;
}

export async function funGetEmployeeLeaveRequest(customer_id: any, leave_status: number) {
  console.log("================" + "funGetEmployeeLeaveRequest" + "=================");


  let query = supabase
    .from("leap_customer_apply_leave")
    .select(`*`)
    .eq("customer_id", customer_id); // Filter by client_id

  if (leave_status > 0) {
    query = query.eq("leave_status", leave_status);
  }


  // query = query.eq("leap_customer.manager_id", managerId);

  const { data: leaveRequests, error } = await query;

  if (error) {
    console.error("Error:", error);
    return error;
  } else {
    return { totalRequest: leaveRequests.length, employees: leaveRequests };
  }

}
export async function funGetMyLeaveBalance(clientId: any, branchId: any, customer_id: any, dataLimit: number) {
  console.log("================" + "funGetMyLeaveBalance" + "=================");

  let leaveStatusApprovedCount = 0, leaveStatusRejectedCount = 0, leaveStatusPendingCount = 0;
  try {
    const { data: customerData, error: customerError } = await supabase
      .from("leap_customer")
      .select('*').eq('customer_id', customer_id);
    if (customerError) {

      return funSendApiErrorMessage("Customer fetch error", customerError);
    }


    //get client leave types which has leave policy i.e number of days WRT the leave type
    const { data: custleaveData, error: custleaveError } = await supabase
      .from("leap_client_leave")
      .select('*').eq('client_id', clientId).eq('branch_id', branchId);
    if (custleaveError) {

      return funSendApiErrorMessage("Unable to fetch customer leave", custleaveError);
    }

    //get client applied Leave Data with respect to customer
    let appliedLeaveQuery = supabase
      .from("leap_customer_apply_leave")
      .select(`*`).eq('client_id', clientId).eq('customer_id', customer_id);

    const { data: appliedLeavedata, error: appliedLeaveError } = await appliedLeaveQuery;
    if (appliedLeaveError) {

      return appliedLeaveError;
    }
    //calculate status wise count pending,approved, rejected/dissaproved
    for (let i = 0; i < appliedLeavedata.length; i++) {
      if (appliedLeavedata[i].leave_status == 1) {
        leaveStatusPendingCount = leaveStatusPendingCount + 1;
      }
      if (appliedLeavedata[i].leave_status == 2) {
        leaveStatusApprovedCount = leaveStatusApprovedCount + 1;
      }
      if (appliedLeavedata[i].leave_status == 3) {
        leaveStatusRejectedCount = leaveStatusRejectedCount + 1;

      }

    }



    let customerLeavePendingCount: LeaveTypeCount[] = [];
    const custJoiningDate = customerData[0].date_of_joining;
    const calcTotalWorkingSpan = calculateNumMonths(new Date(custJoiningDate), new Date());
    
    
    const calcCurrentYearSpan = calculateNumMonths(new Date(getFirstDateOfYearbyDate(new Date())), new Date());
// console.log("this is the customer joining date", custJoiningDate);
//     console.log("this is the calcTotalWorkingSpan", calcTotalWorkingSpan);
//     console.log("this is the calcCurrentYearSpan", calcCurrentYearSpan);
//     console.log("this is the custleaveData", custleaveData);

    for (let i = 0; i < custleaveData.length; i++) {
      // console.log(customerData[0].gender);
      // console.log("leave Data =======",custleaveData[0]);

      if ((customerData[0].gender.toLowerCase() == custleaveData[i].gender.toLowerCase() || custleaveData[i].gender == "All")) {
    
        // (custleaveData[i].if_unused == "Carry Forward") {

        //   customerLeavePendingCount.push({
        //     leaveTypeId: custleaveData[i].leave_id,
        //     leaveType: custleaveData[i].leave_name,
        //     leaveAllotedCount: calcTotalWorkingSpan * custleaveData[i].leave_count,
        //     totalAppliedLeaveDays: 0,
        //     leaveBalance: calcTotalWorkingSpan * custleaveData[i].leave_count,
        //     isPaid: custleaveData[i].is_paid,
        //     color_code: custleaveData[i].color_code
        //   })
        // } else
           
          customerLeavePendingCount.push({
            leaveTypeId: custleaveData[i].leave_id,
            leaveType: custleaveData[i].leave_name,
            leaveAllotedCount: calcTotalWorkingSpan!=0?calcTotalWorkingSpan * custleaveData[i].leave_count:custleaveData[i].leave_count,
            totalAppliedLeaveDays: 0,
            leaveBalance: calcTotalWorkingSpan!=0?calcTotalWorkingSpan * custleaveData[i].leave_count:custleaveData[i].leave_count,
            isPaid: custleaveData[i].is_paid,
            color_code: custleaveData[i].color_code
          })
        
      }
    }
    let totalLeaveAppliedDays = 0, totalLeaveBalance = 0;
    for (let i = 0; i < appliedLeavedata.length; i++) {
      for (let j = 0; j < customerLeavePendingCount.length; j++) {
        if (appliedLeavedata[i].leave_type === customerLeavePendingCount[j].leaveTypeId && appliedLeavedata[i].leave_status == 2) {
          customerLeavePendingCount[j].totalAppliedLeaveDays = customerLeavePendingCount[j].totalAppliedLeaveDays + appliedLeavedata[i].total_days;
          totalLeaveAppliedDays = totalLeaveAppliedDays + customerLeavePendingCount[j].totalAppliedLeaveDays;
          customerLeavePendingCount[j].leaveBalance = customerLeavePendingCount[j].leaveAllotedCount - customerLeavePendingCount[j].totalAppliedLeaveDays;
          totalLeaveBalance = totalLeaveBalance + customerLeavePendingCount[j].leaveBalance;
        }
      }
    }
    if (appliedLeaveError) {
      return appliedLeaveError;
    }
    else {
      return {
        customer_id: customerData[0].customer_id,
        joiningDate: customerData[0].date_of_joining,
        leaveStatusPendingCount: leaveStatusPendingCount,
        LeaveStatusAprovedCount: leaveStatusApprovedCount,
        LeaveStatusRejectedCount: leaveStatusRejectedCount,
        total_Leave_balance: totalLeaveBalance,
        total_applied_days: totalLeaveAppliedDays,
        customerLeavePendingCount,
      };
    }
  } catch (e) {
    return e
  }

}

export async function funGetAnnouncements(clientId: any, customer_id: any, role_id: any) {
  console.log("================" + "fun get announcements" + "=================");

  const { data: customerBranch, error: custBranchError } = await supabase.from('leap_customer')
    .select('branch_id')
    .eq('customer_id', customer_id);
  if (custBranchError) {
    return custBranchError;
  }
  let today = dashedDateYYYYMMDD(new Date());
  let query = supabase.from('leap_client_announcements')
    .select('*')
    .eq('client_id', clientId)
    .eq("send_to_all", true)
    .eq("isEnabled", false)
    .eq("isDeleted", false)
    .or(`send_on_date.lte.${today},validity_date.gte.${today}`)
    .order('announcement_date', { ascending: true });



  const { data: allAnouncements, error: taskError } = await query;
  if (taskError) {
    return taskError;
  }

  const { data: userAnnouncements, error: userAnnouncementError } = await supabase
    .from('leap_show_announcement_users')
    .select(`
        leap_client_announcements!inner(*)
    `)
    .eq('role_id', role_id)
    .or(`send_on_date.lte.${today},validity_date.gte.${today}`, { foreignTable: 'leap_client_announcements' })
    .order('announcement_date', { foreignTable: 'leap_client_announcements', ascending: true });


  if (userAnnouncementError) {

    return userAnnouncementError;
  }
  let all_announcements: any[] = [];

  all_announcements.push(...allAnouncements);


  for (let i = 0; i < userAnnouncements.length; i++) {
    if (userAnnouncements[i].leap_client_announcements != null) {
      all_announcements.push(userAnnouncements[i].leap_client_announcements);
    }
  }

  if (all_announcements.length > 0) {
    return [...new Map(all_announcements.map(item => [item["announcement_id"], item])).values()];
  } else {
    return [];
  }

}

export async function funGetEmpBirthdayList(client_id: any) {
  // console.log("======================funGetEmpBirthdayList=====================",customer_id);
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // "01" to "12"
  const currentDay = String(today.getDate()).padStart(2, "0");       // "01" to "31"

  let query = supabase
    .from("leap_all_birthdays")
    .select(`ocassion, ocassion_date, leap_customer(name)`)
    .eq('client_id', client_id)
    .eq("leap_customer.employment_status", true)
    .order("ocassion_date", { ascending: true });

  const { data: birthdayList, error } = await query;

  if (error) {
    return [];

  } else {
    const filteredList = birthdayList.filter((item: any) => {
      const occasionDate = item.ocassion_date; // e.g., "1995-07-30"
      const itemMonth = occasionDate.substring(5, 7); // "07"
      const itemDay = occasionDate.substring(8, 10);  // "30"

      return (
        itemMonth === currentMonth &&
        itemDay >= currentDay
      );
    });
    return filteredList;

  }
}
export async function getMyPresentTeam(client_id: any, customer_id: any) {
  let query = supabase.from("leap_customer")
    .select('*,leap_customer_attendance!leap_customer_attendance_employee_id_fkey(in_time,if_paused)')
    .eq("manager_id", customer_id)
    .eq("leap_customer_attendance.date", dashedDateYYYYMMDD(new Date()));
  console.log("Team members Query=================================", query);

  const { data: teamMembers, error } = await query;

  if (error) {
    console.log(error);

    return [];
  }
  else {
    let totalPresent = 0;
    for (let i = 0; i < teamMembers.length; i++) {
      if (teamMembers[i].leap_customer_attendance.length > 0) {
        totalPresent = totalPresent + 1;
      }
    }

    return { total_team_members: teamMembers.length, total_present: totalPresent, team_members: teamMembers };
  }
}

export async function isAuthTokenValid(platform: any, customer_id: any, auth_token: any) {
  if (platform == "ios" || platform == "android") {
    const { data: cust, error: custFetchError } = await supabase
      .from("leap_customer").select("auth_token").eq("customer_id", customer_id)
    if (custFetchError) {
      return funSendApiErrorMessage(custFetchError, "Unable to fetch customer");
    }
    if (cust[0].auth_token == auth_token) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }


}

export async function getCountOfHoliadyinMonth(client_id: any, branch_id: any, monthStartDate: any, monthEndDate: any) {

  const { data: holidays, error: custFetchError } = await supabase
    .from("leap_holiday_list").select("*")
    .eq("client_id", client_id)
    .eq("branch_id", branch_id)
    .lte("date", monthEndDate)
    .gte("date", monthStartDate)
  if (custFetchError) {
    return 0;
  }
  return holidays.length;

}

export async function funGetUserDailyTask(customer_id: any, date: any) {
  const { data: taskData } = await supabase.from("leap_customer_project_task")
    .select(
    'sub_project_id(sub_project_name),task_details,task_type_id(task_type_name),task_status(status, id)'
    ).eq('customer_id', customer_id).eq('task_date', formatDateYYYYMMDD(date));
 const { data: assignedTask } = await supabase.from("leap_customer_project_task_assignment")
    .select(
    'sub_project_id(sub_project_name),task_details,task_type_id(task_type_name),task_status(status, id)'
    ).eq('assigned_to', customer_id).eq('task_date', formatDateYYYYMMDD(date)); 
    const myTasks = (taskData || []).map(task => ({ ...task, type: "mytask" }));
  const assignedTasks = (assignedTask || []).map(task => ({ ...task, type: "assigned" }));

      const allTasks = [...myTasks, ...assignedTasks];
  return allTasks;
}
export async function funGetUserAssignedTask(customer_id: any, date: any) {
  const { data: assignedTask, error } = await supabase.from("leap_customer_project_task_assignment")
    .select(
      '*, leap_task_priority_level(*), leap_task_status(*), leap_client_sub_projects(sub_project_name,leap_client_project(project_name)),leap_project_task_types(task_type_name),  leap_customer!leap_task_assignment_assigned_by_fkey(name)'
    ).eq('assigned_to', customer_id).eq('task_date', formatDateYYYYMMDD(date));

  if (error) {
    return null;
  }
  else {
    return { taskData: assignedTask };
  }
}
export async function funGetThisMonthHoliday(client_id: any, branch_id: any) {
  const today = new Date();

  //first day of the current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  //last day of the current month
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convert to ISO strings
  const startDate = firstDay.toISOString().split('T')[0];
  const endDate = lastDay.toISOString().split('T')[0];

  const { data: holidayData, error } = await supabase
    .from("leap_holiday_list")
    .select("*")
    .eq('client_id', client_id)
    .eq('branch_id', branch_id)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    return error;
  } else {
    return { holidays: holidayData };
  }
}
export async function funGetUserFirstName(customer_id: any) {
  const { data: userName, error } = await supabase
    .from("leap_customer")
    .select('name')
    .eq('customer_id', customer_id)
    .single();

  if (error || !userName) {
    return null;
  }

  const fullName = userName.name || '';
  const firstName = fullName.split(' ')[0]; // split and take the first word

  return { firstName };
}
export async function funGetCompanyWorkingHour(clientID: any, branch_id: any ) {
  const { data: workData, error } = await supabase
         .from('leap_client_working_hour_policy')
        .select('full_day')
        .eq("client_id", clientID)
        .eq("branch_id", branch_id);
const full_work_hour = workData && workData.length > 0 ? workData[0].full_day : "";
  if (error ) {
    return error;
  }

  return  full_work_hour ;
}
export async function userDashboardGreeting(customer_id: any) {
  const { data: dobData, error: dobError } = await supabase
            .from('leap_customer')
            .select('dob')
            .eq('customer_id', customer_id)
            .single();

        if (dobError) {
            return funSendApiErrorMessage(dobError, "Failed to fetch DOB");
        }
        const now = new Date();
        const hourIST = (now.getUTCHours() + 5 + 30 / 60) % 24; // UTC + 5:30

        const today = now.toISOString().slice(5, 10);
        const userDob = dobData?.dob?.slice(5, 10);

        let greetingId = 1; //gm
        if (today === userDob) {
            greetingId = 4; // hbd
        } else {
            const hour = hourIST;

            if (hour >= 12 && hour < 16) {
                greetingId = 2; //gnoon
            } else if (hour >= 16) {
                greetingId = 3; //geve
            }
        }
        const { data: greetData, error: greetError } = await supabase
            .from('leap_dashboard_greetings')
            .select('greeting_topic')
            .eq('id', greetingId);
const greetName = greetData && greetData.length > 0 ? greetData[0].greeting_topic : "Hello";

  if (greetError ) {
    return greetError;
  }

  return greetName;
}


export async function funGetSingleColumnValueCustomer(customer_id:any,column_name:any){
  const { data, error } = await supabase
  .from('leap_customer')
  .select(column_name)
  .eq('customer_id', customer_id)
  .single();
  if(error){
    return null;
  }else{
    return data[column_name];
  }
}
export async function funGetAdminID(client_id:any){
  const { data, error } = await supabase
  .from('leap_customer')
  .select("customer_id")
  .eq('client_id', client_id)
  .eq('user_role', 2)
  .single();
  if(error){
    return null;
  }else{
    return data.customer_id;
  }
}

export async function funGetSupportType(type_num:any){
  const { data, error } = await supabase
  .from('leap_request_master')
  .select('type_name')
  .eq('id', type_num)
  .single();
  if(error){
    return null;
  }else{
    return data.type_name;
  }
}

export async function funGetLeaveType(type_num:any){
  const { data, error } = await supabase
  .from('leap_client_leave')
  .select('leave_name')
  // .eq('client_id', client_id)
  // .eq('branch_id', branch_id)
  .eq('leave_id', type_num)
  .single();
  if(error){
    return null;
  }else{
    return data.leave_name;
  }
}

export async function funGetSubProjectType(type_num:any){
  const { data, error } = await supabase
  .from('leap_client_sub_projects')
  .select('sub_project_name')
  .eq('subproject_id', type_num)
  .single();
  if(error){
    return null;
  }else{
    return data.sub_project_name;
  }
}