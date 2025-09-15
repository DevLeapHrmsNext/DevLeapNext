// supabase/functions/check-working-hours/index.ts
// @ts-nocheck

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (_req: any) => {
  const supabase = createClient(
    Deno.env.get('URL_SUPABASE')!,
    Deno.env.get('SERVICE_ROLE_KEY_SUPABASE')!
  )

  const now = new Date()

  const { data: attendances, error } = await supabase
    .from('leap_customer_attendance')
    .select('attendance_id, customer_id, in_time, leap_customer!leap_customer_attendance_employee_id_fkey(branch_id)')
    .eq('date', now.toISOString().split('T')[0]) as unknown as { data: AttendanceWithBranch[]; error: any }

  if (error) return new Response('Error fetching attendance', { status: 500 })

  for (const attendance of attendances) {
    const startTime = new Date(attendance.in_time)
    const diffMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000)

    const { data: workingPolicy } = await supabase
      .from('leap_client_working_hour_policy')
      .select('full_day')
      .eq('branch_id', attendance.leap_customer.branch_id)
      .single()

    if (workingPolicy && diffMinutes > workingPolicy.full_day) {
      const formData = new FormData()
      formData.append("customer_id", String(attendance.customer_id))
      formData.append("title", "Attendance Alert")
      formData.append("message", "Your working hours are completed. Please stop your attendance.")

      await fetch(`${Deno.env.get("LOCALHOST_SERVER_BASE_URL")}/api/sendPushNotification`, {
        method: "POST",
        body: formData,
      })
    }
  }

  return new Response("Working hours check completed.", { status: 200 })
})

interface AttendanceWithBranch {
  attendance_id: number
  customer_id: number
  in_time: string
  leap_customer: {
    branch_id: number
  }
}
