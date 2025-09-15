import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { allClientsData, allEmployeeListData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
import { funloggedInAnotherDevice, funSendApiException } from "@/app/pro_utils/constant";
import { funGetAnnouncements, funGetClientCustomerList, funGetClientEmployeeAttendance, funGetClientEmployeeAttendanceforManager, funGetClientEmployeeLeaveRequest, funGetClientEmployeeList, funGetClientEmployeeListForManager, funGetClientEmployeeSummary, funGetClientHolidayList, funGetClientList, funGetClientUpCommingHolidayList, funGetCompanyWorkingHour, funGetCustomer, funGetEmpBirthdayList, funGetEmployeeLeaveRequest, funGetEmployeeLeaveRequestforManager, funGetMidShortCutsList, funGetMyLeaveBalance, funGetShortCutsOneList, funGetThisMonthHoliday, funGetUserAssignedTask, funGetUserDailyTask, funGetUserFirstName, getAllActivitiesOfUsers, getDashboardAllActivitiesOfUsers, getMyAttendance, getMyDocumentsList, getMyPresentTeam, getUserDashboardAllActivitiesOfUsers, getUserRoles, isAuthTokenValid, userDashboardGreeting } from "@/app/pro_utils/constantFunGetData";
import { platform } from "os";

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
    const { client_id, customer_id, branch_id, role_id, platform, auth_token, version } = await request.json();
    // const fdata = {
    //   clientId: formData.get('client_id'),
    //   customerId: formData.get('customer_id'),
    //   branchId: formData.get('branch_id'),
    //   roleId: formData.get('role_id') as string,
    //   platform:formData.get('platform'),
    //   authToken:formData.get('auth_token'),
    //   version:formData.get('version')
    // }
    if (platform && customer_id && auth_token) {
      if (!await isAuthTokenValid(platform, customer_id, auth_token)) {
        return funloggedInAnotherDevice()
      }
    }
    const getCustomerInfo = await funGetCustomer(customer_id)
    if (getCustomerInfo == null) {
      return funSendApiException("Customer fetch failed")
    }
    // return funGetEmployeeLeaveRequestforManager(client_id, null, new Date(), null,customer_id, false  );
    // const getRoles=await getUserRoles()
    // if(getRoles==null){
    //  return funSendApiException("Roles fetch went wrong")
    // }
    if (role_id! && role_id == "1") {
      return NextResponse.json({
        message: allEmployeeListData,
        clientList: await funGetClientList(),
        customerList:
          await funGetClientCustomerList(client_id),
        employeeSummary: null,
        employees: await funGetClientEmployeeList(client_id, 0, parseInt(role_id), true),
        leaveRequest: null,
        employeeAttendance: null,
        holidayList: await funGetClientHolidayList(client_id, null, platform),
        upcommingHolidays: await funGetClientUpCommingHolidayList(client_id, null, platform),
        myattendance: null,
      },
        { status: apiStatusSuccessCode });
    }
    else if (role_id! && role_id == "2") {
      return NextResponse.json({
        message: allEmployeeListData,
        clientList: null,
        // customerList: await funGetClientCustomerList(client_id),
        midShortcutsList: await funGetMidShortCutsList(client_id),
        shortCutOne: await funGetShortCutsOneList(client_id),
        employeeSummary: await funGetClientEmployeeSummary(client_id),
        employees: await funGetClientEmployeeList(client_id, 5, parseInt(role_id), true),
        // leaveRequest: await funGetClientEmployeeLeaveRequest(client_id, null, new Date(), null, false),
        employeeAttendance: await funGetClientEmployeeAttendance(client_id, new Date()),
        instantNotify: await getDashboardAllActivitiesOfUsers(client_id, null),
        // holidayList: await funGetClientHolidayList(client_id, null),
        // upcommingHolidays: await funGetClientUpCommingHolidayList(client_id,null),
        // myattendance: await getMyAttendance(customer_id, client_id, new Date()),
      },
        { status: apiStatusSuccessCode });
    }
    else if (role_id! && role_id == "3") {
      return NextResponse.json({
        message: allEmployeeListData,
        clientList: null,
        customerList: null,
        employeeSummary: null,
        employees: await funGetClientEmployeeList(client_id, 0, parseInt(role_id), true),

        leaveRequest:
          await funGetClientEmployeeLeaveRequest(client_id, null, new Date(), null, false),

        employeeAttendance:
          await funGetClientEmployeeAttendance(client_id, new Date()),

        holidayList: await funGetClientHolidayList(client_id, null, platform),
        upcommingHolidays: await funGetClientUpCommingHolidayList(client_id, null, platform),
        myattendance: await getMyAttendance(customer_id, client_id, new Date()),
      },
        { status: apiStatusSuccessCode });
    } else if (role_id! && (role_id == "4" || role_id == "9")) {
      return NextResponse.json({
        message: allEmployeeListData,
        status: 1,
        appBgImg: platform && platform != "web" ? "https://v2.leaphrms.com/images/user/app_bg_img.png": "",
        greeting:  await userDashboardGreeting(customer_id) ,
        workingHour: await funGetCompanyWorkingHour(client_id, branch_id),
        employees: funGetClientEmployeeListForManager(client_id, customer_id),
        leaveRequest:
          await funGetEmployeeLeaveRequestforManager(client_id, null, new Date(), null, customer_id, false),

        upcommingHolidays: await funGetThisMonthHoliday(client_id, branch_id),
        myattendance: await getMyAttendance(customer_id, client_id, new Date()),
        // my_documents: await getMyDocumentsList(customer_id),
        my_leave_requests: await funGetEmployeeLeaveRequest(customer_id, 0),
        myLeaveBalances: await funGetMyLeaveBalance(client_id, branch_id, customer_id, 0),
        announcements: await funGetAnnouncements(client_id, customer_id, role_id),
        my_tasks: await funGetUserDailyTask(customer_id, new Date()),
        // assigned_tasks: await funGetUserAssignedTask(customer_id, new Date()),
        my_name: await funGetUserFirstName(customer_id),
        birthdays: await funGetEmpBirthdayList(client_id),
        notification:platform && platform=="web"? await getUserDashboardAllActivitiesOfUsers(client_id, customer_id, true):""
        // mypresentTeam:await getMyPresentTeam(client_id,customer_id),
      },
        { status: apiStatusSuccessCode });
    }
    else if (role_id! && role_id == "5") {

      return NextResponse.json({
        message: allEmployeeListData,
        status: 1,
        leaveRequest: null,
        employeeAttendance: null,
        appBgImg: platform && platform != "web" ? "https://v2.leaphrms.com/images/user/app_bg_img.png": "",
        greeting:  await userDashboardGreeting(customer_id) ,
        workingHour: await funGetCompanyWorkingHour(client_id, branch_id),
        upcommingHolidays: await funGetThisMonthHoliday(client_id, branch_id),
        myattendance: await getMyAttendance(customer_id, client_id, new Date()),
        // my_documents: await getMyDocumentsList(customer_id),
        my_leave_requests: await funGetEmployeeLeaveRequest(customer_id, 0),
        myLeaveBalances: await funGetMyLeaveBalance(client_id, branch_id, customer_id, 0),
        my_tasks: await funGetUserDailyTask(customer_id, new Date()),
        // assigned_tasks: await funGetUserAssignedTask(customer_id, new Date() ),
        my_name: await funGetUserFirstName(customer_id),
        announcements:await funGetAnnouncements(client_id,customer_id,role_id),
        birthdays: await funGetEmpBirthdayList(client_id),
        notification:platform && platform=="web"? await getUserDashboardAllActivitiesOfUsers(client_id, customer_id, false):""
        // mypresentTeam:null,
      },
        { status: apiStatusSuccessCode });
    }
  } catch (error) {
    return funSendApiException(error);
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import supabase from "../../supabaseConfig/supabase";
// import { allClientsData, allEmployeeListData, apiStatusFailureCode, apiStatusSuccessCode, apiwentWrong } from "@/app/pro_utils/stringConstants";
// import { funloggedInAnotherDevice, funSendApiException } from "@/app/pro_utils/constant";
// import { funGetAnnouncements, funGetClientCustomerList, funGetClientEmployeeAttendance, funGetClientEmployeeAttendanceforManager, funGetClientEmployeeLeaveRequest, funGetClientEmployeeList, funGetClientEmployeeListForManager, funGetClientEmployeeSummary, funGetClientHolidayList, funGetClientList, funGetClientUpCommingHolidayList, funGetCustomer, funGetEmpBirthdayList, funGetEmployeeLeaveRequest, funGetEmployeeLeaveRequestforManager, funGetMidShortCutsList, funGetMyLeaveBalance, funGetShortCutsOneList, getAllActivitiesOfUsers, getDashboardAllActivitiesOfUsers, getMyAttendance, getMyDocumentsList, getMyPresentTeam, getUserRoles, isAuthTokenValid } from "@/app/pro_utils/constantFunGetData";
// import { platform } from "os";

// export async function POST(request: NextRequest) {

//   try {
//     // const { data: user, error: userError } = await supabase.auth.getUser();


//     // // Handle case where the user is not authenticated
//     // if (userError || !user) {
//     //   return NextResponse.json(
//     //     { error: 'User not authenticated' },
//     //     { status: 401 }
//     //   );
//     // }
//     const {client_id, customer_id, branch_id, role_id, platform, auth_token, version } = await request.json();
//     // const fdata = {
//     //   clientId: formData.get('client_id'),
//     //   customerId: formData.get('customer_id'),
//     //   branchId: formData.get('branch_id'),
//     //   roleId: formData.get('role_id') as string,
//     //   platform:formData.get('platform'),
//     //   authToken:formData.get('auth_token'),
//     //   version:formData.get('version')
//     // }
//     if(platform && customer_id && auth_token){
//     if(!await isAuthTokenValid(platform,customer_id,auth_token)){
//       return funloggedInAnotherDevice()
//     }
//     }
//     const getCustomerInfo = await funGetCustomer(customer_id)
//     if (getCustomerInfo == null) {
//       return funSendApiException("Customer fetch failed")
//     }
//     // return funGetEmployeeLeaveRequestforManager(client_id, null, new Date(), null,customer_id, false  );
//     // const getRoles=await getUserRoles()
//     // if(getRoles==null){
//     //  return funSendApiException("Roles fetch went wrong")
//     // }
//     if(role_id! && role_id == "1"){
//       return NextResponse.json({
//         message: allEmployeeListData,
//         clientList: await funGetClientList(),
//         customerList: 
//                       await funGetClientCustomerList(client_id) ,
//         employeeSummary:  null,    
//         employees: await funGetClientEmployeeList(client_id,0,parseInt(role_id),true),
//         leaveRequest:  null,
//         employeeAttendance: null,
//         holidayList: await funGetClientHolidayList(client_id, null,platform),
//         upcommingHolidays: await funGetClientUpCommingHolidayList(client_id,null,platform),
//         myattendance: null,
//       },
//         { status: apiStatusSuccessCode });
//     }
//     else if(role_id! && role_id == "2"){
//       return NextResponse.json({
//         message: allEmployeeListData,
//         clientList: null,
//         // customerList: await funGetClientCustomerList(client_id),
//         midShortcutsList:await funGetMidShortCutsList(client_id),
//         shortCutOne:await funGetShortCutsOneList(client_id),
//         employeeSummary:   await funGetClientEmployeeSummary(client_id),    
//         employees: await funGetClientEmployeeList(client_id,5,parseInt(role_id),true),
//         // leaveRequest: await funGetClientEmployeeLeaveRequest(client_id, null, new Date(), null, false),
//         employeeAttendance: await funGetClientEmployeeAttendance(client_id, new Date()) ,
//         instantNotify: await getDashboardAllActivitiesOfUsers(client_id,null),
//         // holidayList: await funGetClientHolidayList(client_id, null),
//         // upcommingHolidays: await funGetClientUpCommingHolidayList(client_id,null),
//         // myattendance: await getMyAttendance(customer_id, client_id, new Date()),
//       },
//         { status: apiStatusSuccessCode });
//     }
//     else if(role_id! && role_id == "3"){
//       return NextResponse.json({
//         message: allEmployeeListData,
//         clientList: null,
//         customerList: null,
//         employeeSummary: null,    
//         employees: await funGetClientEmployeeList(client_id,0,parseInt(role_id),true),
                    
//         leaveRequest:
//           await funGetClientEmployeeLeaveRequest(client_id, null, new Date(), null, false),
          
//         employeeAttendance: 
//         await funGetClientEmployeeAttendance(client_id, new Date()),
        
//         holidayList: await funGetClientHolidayList(client_id, null,platform),
//         upcommingHolidays: await funGetClientUpCommingHolidayList(client_id,null,platform),
//         myattendance: await getMyAttendance(customer_id, client_id, new Date()),
//       },
//         { status: apiStatusSuccessCode });
//     }else if(role_id! && (role_id == "4"|| role_id == "9")){
//       return NextResponse.json({
//         message: allEmployeeListData,
           
//         employees: funGetClientEmployeeListForManager(client_id,customer_id),
//         leaveRequest: 
//             await funGetEmployeeLeaveRequestforManager(client_id, null, new Date(), null,  customer_id,false),
        
//         upcommingHolidays: await funGetClientUpCommingHolidayList(client_id,null,platform),
//         myattendance: await getMyAttendance(customer_id, client_id, new Date()),
//         my_documents: await getMyDocumentsList(customer_id),
//         my_leave_requests:await funGetEmployeeLeaveRequest(customer_id,0),
//         myLeaveBalances:await funGetMyLeaveBalance(client_id,customer_id,0),
//         announcements:await funGetAnnouncements(client_id,customer_id,role_id),
//         birthdays:await funGetEmpBirthdayList(client_id,customer_id,false),
//         mypresentTeam:await getMyPresentTeam(client_id,customer_id),


//       },
//         { status: apiStatusSuccessCode });
//     }
//     else if(role_id! && role_id == "5"){

//     return NextResponse.json({
//       message: allEmployeeListData,
      
//       leaveRequest: null,
//       employeeAttendance: null,
//       upcommingHolidays: await funGetClientUpCommingHolidayList(client_id,branch_id,platform),
//       myattendance: await getMyAttendance(customer_id, client_id, new Date()),
//       my_documents: await getMyDocumentsList(customer_id),
//       my_leave_requests:await funGetEmployeeLeaveRequest(customer_id,0),
//       myLeaveBalances:await funGetMyLeaveBalance(client_id,customer_id,0),
//       announcements:await funGetAnnouncements(client_id,customer_id,role_id),
//       birthdays:await funGetEmpBirthdayList(client_id,customer_id,false),

//       mypresentTeam:null,

//     },
//       { status: apiStatusSuccessCode });
//   }
//   } catch (error) {
//     return funSendApiException(error);
//   }
// }

