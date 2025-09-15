import React from 'react'
import TaskDistributionChart from './taskChartComponent'

const EmployeeTaskCard = ({ taskData }: { taskData: TaskListResponseModel }) => {
  return (
    <div className="container">
        <div className="row">
            {/* <TaskDistributionChart taskData={taskData.leap_customer_project_task} totalWorkingHours={taskData.leap_client_branch_details.leap_client_working_hour_policy.full_day} /> */}
        </div>
    
    
    </div>
  )
}

export default EmployeeTaskCard