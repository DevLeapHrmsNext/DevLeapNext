import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funDataAddedSuccessMessage, funDataMissingError, funISDataKeyPresent, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import { funGetAdminID, funGetSingleColumnValueCustomer, funGetSubProjectType, getAllActivitiesOfUsers } from "@/app/pro_utils/constantFunGetData";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { addErrorExceptionLog, addUserActivities } from "@/app/pro_utils/constantFunAddData";
import { error, log } from "console";

export async function POST(request: NextRequest) {

  try {
    const { client_id, customer_id, task_status, branch_id, sub_project_id, task_type_id, total_hours, total_minutes, task_details, task_date, contact_number } = await request.json();

    const { data: TaskData, error: taskError } = await supabase.from('leap_customer_project_task')
      .insert({
        client_id: client_id,
        branch_id: branch_id,
        customer_id: customer_id,
        // project_id: project_id,
        sub_project_id: sub_project_id,
        task_type_id: task_type_id,
        task_status: task_status,
        total_hours: total_hours || 0,
        total_minutes: total_minutes || 0,
        task_details: task_details,
        task_date: task_date,
        created_at: new Date().toISOString()
      }).select();
    if (taskError) {
      return funSendApiErrorMessage(taskError, "Failed to add task");
    }


      (async () => {
        try {
          if (contact_number) {
            const payload = { //process.env.AISENSY_API_KEY ||
              apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTNmZmZkZjJlYjNmMGMxZmY1YjYxZSIsIm5hbWUiOiJFdm9uaXggVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NzUzZmZmZGYyZWIzZjBjMWZmNWI2MTYiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTczMzU1ODI2OX0.MQFrljNxs3lhKqFK0d3-S2EW160fYbshifoDCO4ma_4",
              campaignName: "raise_ticket_id",
              destination: contact_number,
              userName: "Evonix Technologies Private Limited",
              templateParams: [sub_project_id],
              source: "new-landing-page form",
              media: {},
              buttons: [],
              carouselCards: [],
              location: {},
              attributes: {},
              paramsFallbackValue: { FirstName: "user" }
            };

            await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
          }
        } catch (err: any) {
          console.log("AiSensy WhatsApp error:", err);
          await addErrorExceptionLog(client_id, customer_id, "AiSensy WhatsApp error", { exception: err.toString(), sub_project_id, contact_number });
        }
      })();


    (async () => {
      let projectType = "";
      try {
        projectType = await funGetSubProjectType(sub_project_id);
        const addActivity = await addUserActivities(client_id, customer_id, "", "Work task", "Task added for " + projectType, TaskData[0].id, false);
        // console.log("throww error: ", addActivity);
        throw addActivity;
      } catch (err) {

        if (err === "1") {
          // console.log(err);
          const dataPassed = { client_id: client_id, customer_id: customer_id, branch_id: "", activity_type: "Work task", activity_details: projectType, activity_related_id: TaskData[0].id, user_notify: false };
          await addErrorExceptionLog(client_id, customer_id, "Add task activity log error", `failed to add task activity log with data :${dataPassed}`);
        }
        else if (err) { await addErrorExceptionLog(client_id, customer_id, "Add task activity log error", { exception: err.toString() }); }
      }
      if (customer_id) {
        const custName = await funGetSingleColumnValueCustomer(customer_id, "name");
        const manager_id = await funGetSingleColumnValueCustomer(customer_id, "manager_id");
        const admin_id = await await funGetAdminID(client_id);
        try {
          const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 6);
          if (shouldNotify && shouldNotify.length === 0) {
            if (manager_id) {
              const managerFormData = new FormData();
              managerFormData.append("customer_id", String(manager_id));
              managerFormData.append("title", "Task Added");
              managerFormData.append("notify_type", "6");// its 4 for leave in leap_push_notification_types table
              managerFormData.append("message", custName + " has added a new task " + ".");
              const managerRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                method: "POST",
                body: managerFormData
              });
            }
            if (admin_id) {
              const adminFormData = new FormData();
              adminFormData.append("customer_id", String(manager_id));
              adminFormData.append("title", "Task Added");
              adminFormData.append("notify_type", "6");// its 4 for leave in leap_push_notification_types table
              adminFormData.append("message", custName + " has added a new task " + ".");
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
    return funDataAddedSuccessMessage("Task Added Successfully");
  } catch (error) {
    return funSendApiException(error);
  }
}