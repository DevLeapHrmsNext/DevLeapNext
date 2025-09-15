'use client'
import React, { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase';
import { deleteDataTypeAsset, deleteDataTypeProject, deleteDataTypeSalaryComponent, deleteDataTypeSubProject, staticIconsBaseURL } from '../pro_utils/stringConstants';

const RemoveAddEmpFormContactOrBankData = ({ onCancel, onOK, deleteType }: { onCancel: () => void, onOK: () => void, deleteType: any }) => {



    return (
        <div className="loader-overlay">
            <div className="loader-dialog">
                

                <div className="row" style={{ alignItems: "center" }}>
                    
                        <div className="col-lg-11 mb-4 inner_heading25 text-center">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >Delete {deleteType} </label>
                        </div>
                        <div className="col-lg-1" style={{ textAlign: "right" }}>
                            <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "25px",paddingBottom: "25px", alignItems: "right" }}
                                onClick={() => onCancel()} />
                        </div>
                    
                </div>
                <div className="row" style={{ alignItems: "center" }}>
                    <div className="col-md-12">
                        <div className="form_box mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label" >If You Delete this the data entered would be lost! Please Confirm!</label>
                        </div>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-lg-12" style={{ textAlign: "center" }}>
                        <input type='submit' value="Cancel" className="red_button" onClick={() => onCancel()} />&nbsp;
                        <input type='submit' value="Delete" className="red_button" onClick={() => onOK()} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RemoveAddEmpFormContactOrBankData