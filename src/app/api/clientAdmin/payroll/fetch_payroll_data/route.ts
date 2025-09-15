
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException, clientAssetSuccess, apiStatusFailureCode, apiwentWrong, clientSalaryComponentSuccess, clientSalaryUpdateComponentSuccess, payrollFetched, } from "@/app/pro_utils/stringConstants";
import { calculateNumDays, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { getCountOfHoliadyinMonth } from "@/app/pro_utils/constantFunGetData";
import { getMonthName, getNumberOfDaysInMonth, getWeeksBetweenDates } from "@/app/pro_utils/helpers";


export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default: 1
    const pageSize = parseInt(searchParams.get("limit") || "50", 10); // Default: 50 per page

  
    let empPayrollResponse: PayrollResponseSendModel[] = []
    let totalPayroll: TotalPaySendModel = {
        totalEmployees: 0,
        totalExpensePay: 0,
        totalDeductions: 0
    };
    let empBasicPayAmount = 0
    let calc_employeeGross = 0;
    let calc_employeeDeductions = 0;

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    try {
        const formData = await request.formData();

        const fdata = {
            client_id: formData.get('client_id'),
            branch_id: formData.get('branch_id'),
            start_month: formData.get('start_month') as string,
            end_month: formData.get('end_month') as string,
            emp_name: formData.get('emp_name'),
        }

        const [start_year, start_month] = fdata.start_month!.split("-").map(Number);
        const [end_year, end_month] = fdata.end_month!.split("-").map(Number);

        const firstDay = new Date(start_year, start_month - 1, 1);
        const lastDay = new Date(end_year, end_month, 0);

        let employeesQuery = supabase.from("leap_customer").select("emp_id,name,customer_id,branch_id")
            .eq("client_id", fdata.client_id).eq("employment_status", true);

        if (fdata.branch_id) {
            employeesQuery = employeesQuery.eq("branch_id", fdata.branch_id);
        }
        // if (fdata.emp_name) {
        //     employeesQuery = employeesQuery.like("name", "%"+fdata.emp_name+"%");
        // }
        

        const { data: emploeeRecords, error: getEmpError } = await employeesQuery;
        if (getEmpError) {
            return funSendApiErrorMessage(getEmpError, "Failed to fetch employee data");
        }
        // ------------------------------- some static values called
        const holdayCountofMonth = await getCountOfHoliadyinMonth(fdata.client_id, emploeeRecords[0].branch_id, formatDate(firstDay), formatDate(lastDay))
        const numberOfWeeksInMonth = getWeeksBetweenDates(fdata.start_month, fdata.end_month);
// ------------------------------------------------------------------------------------------------
        for (let i = 0; i < emploeeRecords.length; i++) {
            empBasicPayAmount = 0
            calc_employeeGross = 0;
            calc_employeeDeductions = 0;
// ---------------------- here get the attendance record to calculate total working hours of month
            let attendanceQuery = supabase.from("leap_customer_attendance")
                .select("total_hours")
                .eq("customer_id", emploeeRecords[i].customer_id)
                .gte("date", formatDate(firstDay))
                .lte("date", formatDate(lastDay));
            const { data: attendanceRecords, error: attendanceError } = await attendanceQuery;

            if (attendanceError) {
                console.log(attendanceError);
                return funSendApiErrorMessage(getEmpError, "Failed to fetch attendance data");
            }
            // console.log("this is the attendance query response" ,attendanceRecords);

            const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0);
            console.log("Total hours:", totalHours);
// ---------------------- here get the leave record to calculate toatl leaves of month for employee

            const { data: leaveRecords, error: leaveError } = await supabase.from("leap_customer_apply_leave")
                .select("from_date,to_date,total_days,leave_status,leap_client_leave(*)")
                .eq("customer_id", emploeeRecords[i].customer_id)
                .gte("from_date", formatDate(firstDay))
                .lte("from_date", formatDate(lastDay)) as unknown as { data: ParsingLeaveRecords[]; error: any };


            if (leaveError) {
                console.log(leaveError);
                return funSendApiErrorMessage(leaveError, "Failed to fetch attendance data");
            }

            let totalPaidLeave = 0;
            let totalUnpaidLeave = 0;
            leaveRecords?.forEach((leave) => {
                let leaveStart = new Date(leave.from_date);
                let leaveEnd = new Date(leave.to_date);

                // ✅ Ensure only days within the current month are counted
                if (leaveStart < firstDay) leaveStart = new Date(firstDay);
                if (leaveEnd > lastDay) leaveEnd = new Date(lastDay);

                // ✅ Calculate leave days strictly within the month
                const leaveDaysInMonth = Math.floor((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                if (leave.leave_status == 2) {
                    if (leave.leap_client_leave.leave_category.toLocaleLowerCase() == "paid") {
                        totalPaidLeave += leaveDaysInMonth;
                    } else {
                        totalUnpaidLeave += leaveDaysInMonth;
                    }
                } else {
                    totalUnpaidLeave += leaveDaysInMonth; // Not approved leave is unpaid
                }
            });
// ---------------------- here get the emp salary according to components

            
            const { data: empSalary, error: empSalaryError } = await supabase.from("leap_client_employee_salary")
                .select('*,leap_client_salary_components(*,leap_salary_components(*))')
                .eq("client_id", fdata.client_id)
                .eq("customer_id", emploeeRecords[i].customer_id);
            if (empSalaryError) {
                console.log(empSalaryError);
                return funSendApiErrorMessage(empSalaryError, "Failed to fetch attendance data");
            }


// ---------------------- calculation of gross pay i.e adding of other amounts except basic pay and add all the deduction amounts

            for (let i = 0; i < empSalary.length; i++) {
                console.log("component name",empSalary[i].leap_client_salary_components.leap_salary_components.salary_component_name);
                console.log("is add component",empSalary[i].leap_client_salary_components.leap_salary_components.salary_add);
                
                if (empSalary[i].leap_client_salary_components.leap_salary_components.salary_component_name === "Basic Salary") {
                    empBasicPayAmount = empSalary[i].amount
                }
                else if (empSalary[i].leap_client_salary_components.leap_salary_components.salary_add) {
                    calc_employeeGross = calc_employeeGross + empSalary[i].amount;
                }
                else if (!empSalary[i].leap_client_salary_components.leap_salary_components.salary_add) {
                    console.log("is add component",empSalary[i].leap_client_salary_components.leap_salary_components.salary_add);

                    calc_employeeDeductions = calc_employeeDeductions + empSalary[i].amount;
                }
            }
// -------------------------------------- get the actual employee gorss salary for fetching the pay type           
            const { data: empGrossSalary, error: empGrossSalaryError } = await supabase.from("leap_employee_total_salary")
                .select('*,leap_salary_payable_days(payable_time)').eq("customer_id", emploeeRecords[i].customer_id);
            if (empGrossSalaryError) {
                console.log(empGrossSalaryError);
                return funSendApiErrorMessage(empGrossSalaryError, "Failed to fetch attendance data");
            }
            let empBasicSalary = 0;

            console.log("this is the emp gross salary",empGrossSalary);
            
            if (empGrossSalary.length > 0) {
                // console.log("thsi si the lenght of employee gross salary====",empGrossSalary[0].pay_acural_days);

                if (empGrossSalary[0].pay_acural_days == 1) {//--hourly paid employee

                    empBasicSalary = totalHours * empBasicPayAmount;

                } else if (empGrossSalary[0].pay_acural_days == 2) {//--Daily paid depending upon the attendance marked

                    empBasicSalary = attendanceRecords.length * empBasicPayAmount;

                }
                else if (empGrossSalary[0].pay_acural_days == 3) {
// Weekly paid employee depending upon the attendance get the number of week and calculate salary
                    const numWeeks = attendanceRecords.length / 7;
                    empBasicSalary = numWeeks * empBasicPayAmount;
                } else if (empGrossSalary[0].pay_acural_days == 4) {
// Monthly paid employee depending upon the attendance get the number get days paid leaves and also the holidays
                    
                    const numWeekEndDays = numberOfWeeksInMonth * 2;
                    const totalDays = attendanceRecords.length > 0 ? attendanceRecords.length + numWeekEndDays + holdayCountofMonth + totalPaidLeave : 0;
                    const totalDaysInMonth=getNumberOfDaysInMonth(start_year,start_month);
                    const empPerDaySalBreakOut = empBasicPayAmount / totalDaysInMonth;
                    empBasicSalary = empPerDaySalBreakOut * totalDays;
                }

            }




            empPayrollResponse.push({
                emp_id: emploeeRecords[i].emp_id,
                customer_id: emploeeRecords[i].customer_id,
                emp_name: emploeeRecords[i].name,
                actual_gross: empGrossSalary.length > 0 ? empGrossSalary[0].gross_salary : 0,
                actual_net: empGrossSalary.length > 0 ? empGrossSalary[0]!.net_pay : 0,
                actual_deductions: empGrossSalary.length > 0 ? empGrossSalary[0]!.total_deduction : 0,
                basic_pay: empBasicSalary,
                gross_salary: empBasicSalary + calc_employeeGross,
                net_salary: empBasicSalary + calc_employeeGross + calc_employeeDeductions,
                total_deduction: calc_employeeDeductions,
                pay_accural_type: empGrossSalary.length > 0?empGrossSalary[0].leap_salary_payable_days.payable_time:"",
                total_working_hours: totalHours,
                total_applied_leave: totalPaidLeave + totalUnpaidLeave,
                month: getMonthName(start_year,start_month),
                total_working_days: attendanceRecords.length,
                num_of_weeks: numberOfWeeksInMonth,
                total_holidays: holdayCountofMonth,
                total_paid_leaves_days: totalPaidLeave,
                total_unpaid_leaves_days: totalUnpaidLeave
            });
        }

        for (let i = 0; i < empPayrollResponse.length; i++) {
            totalPayroll = {
                totalEmployees: emploeeRecords.length,
                totalExpensePay: totalPayroll.totalExpensePay + empPayrollResponse[i].net_salary,
                totalDeductions: totalPayroll.totalDeductions + empPayrollResponse[i].total_deduction
            }
        }
        let sortedList:PayrollResponseSendModel[]=[];
        if(fdata.emp_name){
            for(let i=0;i<empPayrollResponse.length;i++){
                if(empPayrollResponse[i].customer_id==fdata.emp_name){
                    sortedList.push(empPayrollResponse[i])
                }
            }
        }

        return NextResponse.json({ status: 1, message: payrollFetched, empPayrolls:fdata.emp_name?sortedList:empPayrollResponse, total: totalPayroll }, { status: apiStatusSuccessCode });

    } catch (error) {
        console.log(error);
        return funSendApiException(error);
    }
}



const formatDate = (date: any) => {
    if (!(date instanceof Date)) {
        date = new Date(date);  // Convert to Date object if it's not already
    }

    return (
        date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0")
    );
};


