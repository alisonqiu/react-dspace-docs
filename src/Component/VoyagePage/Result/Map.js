import React, { useState, useEffect } from 'react'
import {MapContainer, TileLayer, LayersControl, ZoomControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import L from 'leaflet'



import Control from 'react-leaflet-custom-control';
import { Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import axios from 'axios';
import { ReadFeature } from "../mapping/Spatial.js"

const { BaseLayer } = LayersControl;
//+ '?hierarchical=false'
const location_url = '/voyage/aggroutes' 

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;


export default function MapBoundingBox(props){

    // const [radioOptions, onChangeRadioOption] = React.useState("embarkation");
   
    
    // const [longitude1, onChangelongitude1] = React.useState(-360);
    // const [longitude2, onChangelongitude2] = React.useState(359.99);
    // const [latitude1, onChangelatitude1] = React.useState(-90);
    // const [latitude2, onChangelatitude2] = React.useState(90);

    const [latlong, setlatlong] = useState([[0, 0], [0, 0]]);

    
    const {set_search_object, search_object, labels, setLabels} = React.useContext(props.context);

    const [selectMode, SetselectMode] = useState(false);
    
    const handle = useFullScreenHandle();

    // useEffect(() => {
    //     if(radioOptions=="embarkation"){
            
    //         let newObject = { ...search_object };

    //         delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude"];
    //         delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude"];
    //         //set_search_object(newObject);
    //         set_search_object({
    //             ...newObject,
    //             "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
    //             "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
    //         });
    //     }
    //     else{
    //         let newObject = { ...search_object };

    //         delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude"];
    //         delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude"];

    //         console.log("New OBject: ", newObject)
    //         //set_search_object(newObject);
    //         set_search_object({
    //             ...newObject,
    //             "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
    //             "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
    //         });
    //     }
        
    // }, [longitude1, longitude2, latitude1, latitude2, radioOptions]);
  
    const position = [0, -20];
    
    const normal = `https://api.mapbox.com/styles/v1/jcm10/cl2gmkgjt000014rstx5nmcj6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`

    const noBorder = `https://api.mapbox.com/styles/v1/jcm10/cl2glcidk000k14nxnr44tu0o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`

    const mapping_specialists = "https://api.mapbox.com/styles/v1/jcm10/cl5v6xvhf001b14o4tdjxm8vh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw"
    
    const normal_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

    const noBorder_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
    

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <FullScreen handle={handle}>
            
            <MapContainer center={position} zoom={2.5} minZoom={2.2} style={{ height: "100vh", zIndex: 0}}>
                <LayersControl position="bottomleft">
                    {/* <BaseLayer name="modern country border (old map)">
                        <TileLayer
                            url={normal_old}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        /> 
                    </BaseLayer>
                    <BaseLayer checked name="no country border (old map)">
                        <TileLayer
                            url={noBorder_old}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        />
                    </BaseLayer>
                    <BaseLayer name="modern country border">
                        <TileLayer
                            noWrap={true}
                            url={normal}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        /> 
                    </BaseLayer>
                    <BaseLayer checked name="no country border">
                        <TileLayer
                            url={noBorder}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        />
                    </BaseLayer> */}
                    <BaseLayer checked name="mapping specialists">
                        <TileLayer
                            url={mapping_specialists}
                            attribution="mapping_specialists"
                        />
                    </BaseLayer>
                </LayersControl>
                <ReadFeature search_object={search_object}  filter={false} latlong={latlong}/>
                


                {/* <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2} selectMode={selectMode} SetselectMode={SetselectMode} latlong={latlong} setlatlong={setlatlong}/> */}
                {
                    handle.active?
                        <Control prepend position='topleft' >
                            <Button style={{background:"white", width: "100%"}} onClick={handle.exit}> 
                            <FullscreenExitIcon style={{width:"100%"}} />
                            </Button>
                        </Control>
                        :
                        <Control prepend position='topleft' >
                            <Button style={{background:"white", width: "100%"}} onClick={handle.enter}> 
                            <FullscreenIcon style={{width:"100%"}} />
                            </Button>
                        </Control>
                }

            </MapContainer>
            </FullScreen>

        </div>
      
    );

}

{/* 
                <Control prepend position='topright' >
                    <Button style={{background:"white", width: "100%"}} onClick={reset}> 
                    Reset
                    </Button>
                </Control>
                <Control prepend position='topright' >
                    <Button style={{background:"white", width: "100%"}} value='embarkation' onClick={SwitchBoundingBoxSelection}> 
                    Select Embarkation
                    </Button>
                </Control>
                <Control prepend position='topright' >
                    <Button style={{background:"white", width: "100%"}} value='disembarkation' onClick={SwitchBoundingBoxSelection}> 
                    Select Disembarkation
                    </Button>
                </Control> */}


                {/* <Control prepend position='topright' >
                    <Button style={{background:"white", width: "100%"}} onClick={(e, entry)=>{e.stopPropagation();
        e.preventDefault();SetselectMode(true);}}> 
                    Select Bounding Box
                    </Button>
                </Control> */}


{/* <FormControl>
<FormLabel id="boundingBoxFilter">Bounding box select options</FormLabel>
<RadioGroup
    row
    aria-labelledby="boundingBoxFilter"
    defaultValue="embarkation"
    name="radio-buttons-group"
    onChange={getRadioValue}
>
    <FormControlLabel value="embarkation" control={<Radio />} label="embarkation" />
    <FormControlLabel value="disembarkation" control={<Radio />} label="disembarkation" />
</RadioGroup>
</FormControl> */}


// const SwitchBoundingBoxSelection = (event) => {
//     console.log("Event target: ", event.target.value)
//     onChangeRadioOption(event.target.value)

//     SetselectMode(true);
// }

// const reset = (e) => {
//     SetselectMode(true);
//     onChangeRadioOption("embarkation");
//     onChangelongitude1(-360);
//     onChangelongitude2(359.9);
//     onChangelatitude1(-90);
//     onChangelatitude2(90);

// }