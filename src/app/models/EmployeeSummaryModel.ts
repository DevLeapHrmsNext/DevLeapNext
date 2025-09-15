interface EmployeeSummary{
    totalCount:number
    totalActive:number
    totalInactive:number
    branch:Branches[]
}

interface Branches{
    branchId:number
    branchNumber:any
    branchTotalEmp:number
    branchTotalActiveEmp:number
    
    branchTotalOnLeaveEmp:number    
}