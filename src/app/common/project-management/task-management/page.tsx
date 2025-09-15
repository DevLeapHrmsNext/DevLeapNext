'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import { pageURL_assignLeaveForm, pageURL_leaveTypeListing, leftMenuLeavePageNumbers, leftMenuProjectMGMTPageNumbers, leftMenuProjectsSub1PageNumbers } from '@/app/pro_utils/stringRoutes'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'

import EmployeeTaskListComponent from '@/app/components/EmployeeTaskListComponent'
import ProjectTaskListComponent from '@/app/components/ProjectTaskListComponent'


interface FilterValues {
    branchID: any,
    projectID: any,
    subProjectID: any,
    customerID: any,
    startDate: any,
    endDate: any,
    taskStatus: any,
}


const EmployeeTaskList = () => {

    const [isLoading, setLoading] = useState(true);
    const [showApproveTaskDialog, setshowApproveTaskDialog] = useState(false);
    const [loadingCursor, setLoadingCursor] = useState(false);
    const [projectID, setProjectID] = useState(0);
    const [isSubProjectAdd, setIsSubProjectAdd] = useState(false);
    const { contextClientID } = useGlobalContext();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);
    const [projectStatusArray, setProjectStatusArray] = useState<ProjectStatusDataModel[]>([]);
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel[]>([]);
    const [taskData, setTaskData] = useState<TaskListResponseModel[]>([]);

    const [projectName, setProjectName] = useState([{ value: '', label: '' }]);
    const [subProjectName, setSubProjectName] = useState([{ value: '', label: '' }]);
    const [employeeName, setEmployeeName] = useState([{ value: '', label: '' }]);

    const [filterValues, setFilterValues] = useState<FilterValues>({
        branchID: '',
        projectID: '',
        subProjectID: '',
        customerID: '',
        startDate: '',
        endDate: '',
        taskStatus: '',
    });

    useEffect(() => {
        
        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [])
    





    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuProjectMGMTPageNumbers} subMenuIndex={leftMenuProjectsSub1PageNumbers} showLeftPanel={true} rightBoxUI={


                <div className='container'>
                    
                    <div style={{ top: "0", zIndex: "50", backgroundColor: "#ebeff2", padding: "0 0 10px 0" }}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div onClick={(e => setTabSelectedIndex(0))} className={tabSelectedIndex == 0 ? "task_btn task_btn_selected" : "task_btn"}>Employee Tasks</div>
                                <div onClick={(e => setTabSelectedIndex(1))} className={tabSelectedIndex == 1 ? "task_btn task_btn_selected" : "task_btn"}>Project Tasks</div>
                            </div>                            
                        </div>
                    </div>
                    {tabSelectedIndex==0?<EmployeeTaskListComponent/>:<ProjectTaskListComponent />  }


                </div>






            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default EmployeeTaskList;



