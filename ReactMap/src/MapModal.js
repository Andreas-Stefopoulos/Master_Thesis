import { Box } from "@mui/material";
import React from "react";

const MapModal = (props) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        borderRadius: 12,
        p: 4,
      };
    
      const gradeIcon = ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6'];

    return (
             <Box sx={style}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginBlockEnd: '20px', gridColumnGap: '20px'}}>
                    <span>From: <span>{props?.data.meta.from}</span></span>
                    <span>To: <span>{props?.data.meta.to}</span></span>
                    <span>Number of records in this result: <span>{props?.data.meta.numberOfRecords}</span></span>    
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '20px'}}>
                    <span style={{marginRight: '10px'}}>Unique Users in this result: <span>{props?.data.meta.numberofUniqeUserRecords}</span></span>
                    <span>Total Records in database: <span>{props?.data.meta.totalRecords}</span></span>
                    <span>Total Unique Users in database: <span>{props?.data.meta.totalUniqueUsers}</span></span>
                </div>
                <div style={{display: 'flex', marginBlockStart: '20px', justifyContent: 'space-evenly', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '10px'}}>
                        <img style={{height: '15px', width: '15px'}} src="/icon1.png" alt="grade1"></img>
                        <span>Grade 1</span>
                    </div>
                   
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '10px'}}>
                        <img style={{height: '15px', width: '15px'}} src="/icon2.png" alt="grade1"></img>
                        <span>Grade 2</span>
                    </div>
                   
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '10px'}}>
                        <img style={{height: '15px', width: '15px'}} src="/icon3.png" alt="grade1"></img>
                        <span>Grade 3</span>
                    </div>
                   
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '10px'}}>
                        <img style={{height: '15px', width: '15px'}} src="/icon4.png" alt="grade1"></img>
                        <span>Grade 4</span>
                    </div>
                   
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '10px'}}>
                        <img style={{height: '15px', width: '15px'}} src="/icon5.png" alt="grade1"></img>
                        <span>Grade 5</span>
                    </div>
                    
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '10px'}}>
                        <img style={{height: '15px', width: '15px'}} src="/icon6.png" alt="grade1"></img>
                        <span>0/No Grade</span>
                    </div>
                   
                </div>
            </Box> 
    )
}

export default MapModal;