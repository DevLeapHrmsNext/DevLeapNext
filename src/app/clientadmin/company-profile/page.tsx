'use client'
import Footer from '@/app/components/footer';
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import React, { useEffect, useState } from 'react'
import { CustomerProfile, LeapRelations } from '@/app/models/employeeDetailsModel';
import LoadingDialog from '@/app/components/PageLoader';
import { clientAdminDashboard, employeeProfileDetails } from '@/app/pro_utils/stringConstants';
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext';
import CompanyProfileDetails from '@/app/components/companyDetails';
import AddBranchDetails from '@/app/components/dialog_addClientBranch';
import BranchDetails from '@/app/components/branchDetails';
import { leftMenuProfilePageNumbers } from '@/app/pro_utils/stringRoutes';




const CompanyProfile = () => {
    const [userData, setUserData] = useState<CustomerProfile>();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const {contextClientID,contaxtBranchID,contextCustomerID,contextRoleID,contextSelectedCustId,
         setGlobalState}=useGlobalContext();
    const [viewIndex,setViewIndex]=useState(0);

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
    }, []);

    


    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title={employeeProfileDetails} />
            </header>

            <LeftPannel menuIndex={leftMenuProfilePageNumbers} subMenuIndex={0} showLeftPanel={true} rightBoxUI={

            <section className='company_profile_mainbox'>   
                    <div className="container">
                        <div className='inner_heading_sticky'>
                            <div className="row mb-4">
                                <div className="col-lg-12">
                                    <div className="row heading25 pt-2 pb-3" style={{ alignItems: "center" }}>
                                        <div className="col-lg-9">
                                            Company <span>Management</span>
                                        </div>
                                        <div className="col-lg-3" style={{ textAlign: "right" }}>
                                            <a className="red_button" onClick={(e) => {setShowDialog(true)}}>Add New Branch</a>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={showDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                            {showDialog && <AddBranchDetails onClose={() => { setShowDialog(false) }} />}
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                        <BranchDetails/>
                            </div>
                            <div className="col-lg-4">
                                <div>
                                    <div className="row">
                                        <CompanyProfileDetails />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

            </section>
            } />
            < Footer />
        </div>
    )
}

export default CompanyProfile