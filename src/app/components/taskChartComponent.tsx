"use client"

import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: number
  name: string
  hours: number
  color: string
}


export default function TaskDistributionChart({ taskData,totalWorkingHours }: { taskData: TaskListArray[],totalWorkingHours:any }) {
  const colorCodesArray:any[]=["#F6BA52","#7C5CFC","#72E06A","#FF6B6B"]
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Task 1", hours: 2, color: "#F6BA52" }, // Orange
    { id: 2, name: "Task 2", hours: 3.5, color: "#7C5CFC" }, // Purple
    { id: 3, name: "Design ui changes and bug fixes on dashboard document upload and announcement", hours: 1.5, color: "#72E06A" }, // Green
    { id: 4, name: "Task 4", hours: 1, color: "#FF6B6B" }, // Red
  ])
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null)

  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0)

  // Calculate the circumference of the circle
  const radius = 80
  const circumference = 2 * Math.PI * radius

  // Calculate segments with gaps
  const gapAngle = 0.05 // Gap size in radians (adjust as needed)
  let startAngle = 0

  const segments = tasks.map((task) => {
    // const percentage = (task.total_hours* 60)+task.total_minutes / totalWorkingHours
    const percentage = task.hours / totalHours
    // Subtract the gap from the segment angle
    const segmentAngle = 2 * Math.PI * percentage - gapAngle

    // Calculate SVG arc parameters
    const x1 = 100 + radius * Math.cos(startAngle)
    const y1 = 100 + radius * Math.sin(startAngle)
    const x2 = 100 + radius * Math.cos(startAngle + segmentAngle)
    const y2 = 100 + radius * Math.sin(startAngle + segmentAngle)

    // Create the segment path
    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0
    const path = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    // Store the center angle for tooltip positioning
    const centerAngle = startAngle + segmentAngle / 2
    const tooltipX = 100 + radius * 0.7 * Math.cos(centerAngle)
    const tooltipY = 100 + radius * 0.7 * Math.sin(centerAngle)

    // Update the start angle for the next segment (including the gap)
    startAngle += segmentAngle + gapAngle

    return {
      ...task,
      path,
      percentage: percentage * 100,
      tooltipX,
      tooltipY,
    }
  })

  const handleMouseEnter = (task: Task) => {
    setHoveredTask(task)
  }

  const handleMouseLeave = () => {
    setHoveredTask(null)
  }

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
  //     <div className="w-full max-w-md">
  //       <div>
  //         <div>{taskData[0]..emp_id+"  "} {taskData[0].leap_customer.name}</div>
  //         <div>{taskData[0].leap_customer.leap_client_departments.department_name}</div>
  //         <div>{taskData[0].leap_customer.leap_client_designations.designation_name}</div>
  //         <div>{taskData.length}</div>
  //       </div>
  //       <div className="flex flex-col items-center">
  //         <div className="relative w-44 h-44 flex items-center justify-center">
  //           <svg className="w-full h-full" viewBox="0 0 200 200">
  //             {segments.map((segment,index) => {
  //               const randomIndex = Math.floor(Math.random() * colorCodesArray.length);
  //               return (
                
  //               <path
  //                 key={segment.id}
  //                 d={segment.path}
  //                 fill={colorCodesArray[index]}
  //                 onMouseEnter={() => handleMouseEnter(segment)}
  //                 onMouseLeave={handleMouseLeave}
  //                 className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
  //               />
  //             )
  //             })}
  //             <circle cx="100" cy="100" r="45" fill="white" className="drop-shadow-sm" />
  //           </svg>

  //           {/* Tooltip that appears on hover */}
  //           {hoveredTask && (
  //             <div
  //               className="absolute pointer-events-none bg-white px-3 py-2 rounded-md shadow-md text-sm z-10 transition-opacity duration-200"
  //               style={{
  //                 left: `${((segments.find((s) => s.id === hoveredTask.id)?.tooltipX || 100) / 200) * 100}%`,
  //                 top: `${((segments.find((s) => s.id === hoveredTask.id)?.tooltipY || 100) / 200) * 100}%`,
  //                 transform: "translate(-50%, -50%)",
  //               }}
  //             >
  //               {/* <p className="font-medium">{hoveredTask.task_details}</p>
  //               <p className="text-gray-500">
  //                 {hoveredTask.total_hours+"."+hoveredTask.total_minutes} hrs ({((hoveredTask.total_hours+hoveredTask.total_minutes / totalWorkingHours) * 100).toFixed(1)}%)
  //               </p> */}
  //               <p className="font-medium">{hoveredTask.name}</p>
  //               <p className="text-gray-500">
  //                 {hoveredTask.hours} hrs ({((hoveredTask.hours / totalWorkingHours) * 100).toFixed(1)}%)
  //               </p>
  //             </div>
  //           )}

  //           <div className="absolute flex flex-col items-center justify-center bg-white rounded-full w-36 h-36">
  //             <span className="text-gray-500 text-sm font-medium">Total</span>
  //             <span className="text-3xl font-bold">{totalWorkingHours}</span>
  //             <span className="text-gray-500 text-sm">hours</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}

