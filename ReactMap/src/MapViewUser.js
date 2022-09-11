import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import { getMapData, getMapDataByFilter, getMinMaxDatesMap } from "./Api/map";
import './../src/css/map.css'; 
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

import TextField from '@mui/material/TextField';
import {DateRangePicker} from '@mui/lab';
import Box from '@mui/material/Box';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from "moment";
import { Modal, Switch, Typography } from "@mui/material";
import icon1 from './assets/images/icon1.png'
import MapModal from "./MapModal";

Geocode.setApiKey("ApiKey");
// import cx from 'classnames';
Geocode.setLanguage("en");
Geocode.setRegion("es");
Geocode.enableDebug();
// import Image from 'next/image';
// import './index.css';



const MapViewUser = () =>{

    const [latitude, setLatitude] = useState(parseFloat("37.9794871"));
    const [longitude, setLongitude] = useState(parseFloat("23.8485586"));
    const [mapDetails, setMapDetails] = useState([]);
    const [mapDetailsObject, setMapDetailsObject] = useState({});
    
    const [selectedType, setSelectedType] = React.useState(1);
    const [minDateApi, setMinDateApi] = React.useState('');
    const [maxDateApi, setMaxDateApi] = React.useState('');
    const [value, setValue] = React.useState([null, null]);

    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);
    const containerStyle = {
        width: '100%',
        height: '100vh',
        // borderRadius: '16px',
      };

      const center = {
        lat: latitude,
        lng: longitude
      };
      
      const mapStyles = {
          width: "100%",
          height: "100%",
        };

      function handlePermission() {
        navigator.permissions.query({name:'geolocation'}).then(function(result) {
          if (result.state == 'granted') {
            report(result.state);
           
          } else if (result.state == 'prompt') {
            report(result.state);
           
          } else if (result.state == 'denied') {
            report(result.state);
          }
          result.onchange = function() {
            report(result.state);
          }
        });
      }

      function report(state) {
        console.log('Permission ' + state);
      }

    

    useEffect(async () => {
       getMinMaxDatesMap().then( res => {
            if(res != null){
                console.log("res", res);
                let minDate = moment(res.min_date).format('YYYY-MM-DD');
                let maxDate = moment(res.max_date).format('YYYY-MM-DD');
                setMinDateApi(res.min_date);
                setMaxDateApi(res.max_date);
                console.log("minDate: " + res.min_date, "maxDate: " + res.max_date);
                getMapData(res.min_date, res.max_date, 1).then(res => {
                    if(res != null){
                        let mapDetails = res.data;
                        console.log("mapDetails", mapDetails);
                        setMapDetails(mapDetails);
                        setMapDetailsObject(res);
                    }else{
                        console.log("error: ");
                        setMapDetails([])
                    }
                }).catch(error => {
                    console.log("error: ", error);
                    setMapDetails([])
                })
            }else {
                console.log("error: ");
            }
        }).catch(error => {
            console.log("error: ", error);
        })

    }, [])
    

    const onChangeDateSelect = (dateArray) => {
        console.log("dateArray: ", dateArray);
       
        if(dateArray[1] === 'Invalid date' && dateArray[0] !== 'Invalid date'){
            console.log("dateArray1: ", dateArray);
        }else{
            console.log("dateArray2: ", dateArray);
            getMapDataByFilter(dateArray[0], dateArray[1]).then(res => {
                if(res != null){
                    let mapDetails = res.data;
                    if(Array.isArray(mapDetails)){
                        setMapDetails(mapDetails)
                        setMapDetailsObject(res)
                    }else{
                        setMapDetails([])
                        setMapDetailsObject({})
                    }
                }else{
                    console.log("error: ");
                    setMapDetails([]);
                    setMapDetailsObject({})
                }
            }).catch(error => {
                console.log("error: ", error);
                setMapDetails([])
                setMapDetailsObject({})
            })
        }
        console.log("dateArray[1] is null", dateArray[1] !== 'Invalid date');
    }

    const handleSwitch = (checked) => {
        if(checked == true){
            setSelectedType(2)
            getDataCall(2)
        }else{
            setSelectedType(1);
            getDataCall(1)
        }
    }

    const getDataCall = (type) => {
        try {
            getMapData(minDateApi, maxDateApi, type).then(res => {
                if(res != null){
                    let mapDetails = res.data;
                    if(Array.isArray(mapDetails)){
                        setMapDetails(mapDetails)
                    }else{
                        setMapDetails([])
                    }
                }else{
                    console.log("error: ");
                    setMapDetails([])
                }
            }).catch(error => {
                console.log("error: ", error);
                setMapDetails([])
            })
        }catch(error){
            console.log("error: ", error);
        }
    }

    

    return(
        <div className="container">
            <div className="main-container">
                <div className="filter-container">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <h1 style={{marginRight: '10px'}}>Filter</h1>
                        <DateRangePicker
                            startText="start date"
                            endText="end date"
                            value={value}
                            onChange={(newValue) => {
                            setValue([moment(newValue[0]).format('YYYY-MM-DD hh:mm:ss'), moment(newValue[1]).format('YYYY-MM-DD hh:mm:ss')]);
                            onChangeDateSelect([moment(newValue[0]).format('YYYY-MM-DD'), moment(newValue[1]).format('YYYY-MM-DD')])
                            setMinDateApi(moment(newValue[0]).format('YYYY-MM-DD'));
                            setMaxDateApi(moment(newValue[1]).format('YYYY-MM-DD'));
                            
                            console.log("data: ", moment(newValue[0]).format('YYYY-MM-DD hh:mm:ss'), moment(newValue[1]).format('YYYY-MM-DD hh:mm:ss'))
                            }}
                            renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                            )}
                        />
                    </div>
                    </LocalizationProvider>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <h1>{`Type`}</h1>
                        <Switch
                        onChange={(event) => {
                            console.log("event: ", event.target.checked);
                            handleSwitch(event.target.checked)
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <h4 style={{marginLeft: '5px'}}>
                            {selectedType == 2 ? "Predicted" : "Actual"}
                        </h4>
                        <p style={{textAlign: 'right', width: '100%'}}>
                            <img src='/legend.png' style={{height: '15px', width: '15px', cursor: 'pointer'}} onClick={() => setOpen(true)}></img>
                        </p>
                    </div>
                </div>
                <div className="map-container">
                    <div className="mb-20" style={{position : "relative"}}>
                    <LoadScript
                        googleMapsApiKey="ApiKey"
                    >
                    <GoogleMap
                        mapContainerStyle = {containerStyle}
                        center = {center}
                        zoom = {10}
                        options = {{
                        fullscreenControl: false,
                        disableDefaultUI :  true,
                        styles: mapStyles
                        }}>

                            {mapDetails.map((obj) => {
                                return(
                                    <Marker
                                        key = {obj.id}
                                        position = {{lat : parseFloat(obj.latitude), lng : parseFloat(obj.longitude)}}
                                        icon={{
                                            url: (obj.grade === null || obj.grade === 0) ? '/icon6.png': `/icon${obj.grade}.png`,
                                        }}
                                    />
                                )
                            })}

                    </GoogleMap>
                    </LoadScript>
                    </div>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <MapModal data={mapDetailsObject}></MapModal>
                    </Modal>
            </div>
        </div>
    )
}

export default MapViewUser;