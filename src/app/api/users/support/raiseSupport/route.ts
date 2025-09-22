// this API is used to insert support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { addErrorExceptionLog, addUserActivities } from "@/app/pro_utils/constantFunAddData";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetAdminID, funGetSingleColumnValueCustomer, funGetSupportType } from "@/app/pro_utils/constantFunGetData";
export const runtime = "nodejs";

function formatToYYMMDD(date: Date) {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

const currentDate = new Date();
const formattedDate = formatToYYMMDD(currentDate);

function generateTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '#' + formattedDate + '-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { client_id, customer_id, branch_id, type_id, description, priority_level } = await request.json();
    // const fdata = {
    //   client_id: formData.get('client_id'),
    //   customer_id: formData.get('customer_id'),
    //   branch_id: formData.get('branch_id'),
    //   type_id: formData.get('type_id'),
    //   description: formData.get('description'),
    //   priority_level: formData.get('priority_level'),
    // }

    const ticketId = generateTicketId();

    const { data: supportData, error: supportError } = await supabase.from('leap_client_employee_requests')
      .insert({
        client_id: client_id,
        customer_id: customer_id,
        branch_id: branch_id,
        type_id: type_id,
        description: description,
        priority_level: priority_level,
        active_status: "1",
        ticket_id: ticketId,
        created_at: new Date().toISOString(),
        raised_on: new Date()
      }).select();
    if (supportError) {
      return funSendApiErrorMessage(supportError, "Failed to raise support ticket");
    }
    // const s/upportType = await funGetSupportType(type_id);
    // const addActivity = await addUserActivities(fields.client_id[0], fields.customer_id[0], fields.branch_id[0], "Leave", fields.leave_type[0], data[0].id, false);

    // const addActivity = await addUserActivities(client_id, customer_id, branch_id, "Support", supportType + "-" + ticketId, supportData[0].id, false);
    (async () => {
      let supportType = "";
      try {
        const supportType = await funGetSupportType(type_id);
        const addActivity = await addUserActivities(client_id, customer_id, branch_id, "Support", supportType + "-" + ticketId, supportData[0].id, false);
        // console.log("throww error: ", addActivity);
        throw addActivity;
      } catch (err) {

        if (err === "1") {
          // console.log(err);
          const dataPassed = { client_id: client_id, customer_id: customer_id, branch_id: branch_id, activity_type: "Support", activity_details: supportType + "-" + ticketId, activity_related_id: supportData[0].id, user_notify: false };
          await addErrorExceptionLog(client_id, customer_id, "Raise support activity log error", `failed to raise support activity log with data :${dataPassed}`);
        }
        else if (err) { await addErrorExceptionLog(client_id, customer_id, "Raise support activity log error", { exception: err.toString() }); }
      }
      if (customer_id) {
        const custName = await funGetSingleColumnValueCustomer(customer_id, "name");
        // const manager_id = await funGetSingleColumnValueCustomer(customer_id, "manager_id");
        const admin_id = await await funGetAdminID(client_id);
        try {
          const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 5);
          if (shouldNotify && shouldNotify.length === 0) {

            if (admin_id) {
              const adminFormData = new FormData();
              adminFormData.append("customer_id", String(admin_id));
              adminFormData.append("title", "Support Raised");
              adminFormData.append("notify_type", "5");// its 5 for support in leap_push_notification_types table
              adminFormData.append("message", custName + " has raised a support ticket: " + ticketId + ".");
              const adminRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                method: "POST",
                body: adminFormData
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    })();
    // if (addActivity == "1") {
    //   return funSendApiErrorMessage(addActivity, "Customer Support Activity Insert Issue");
    // } else {
    return funDataAddedSuccessMessage("Support ticket raised successfully");
    // }
  } catch (error) {
    return funSendApiException(error);
  }
}