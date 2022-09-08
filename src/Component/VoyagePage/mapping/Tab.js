import React, { useState, useEffect, useContext } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Pivot from "../Result/Pivot/Pivot";
import { Grid } from "@mui/material";

// const diskey = "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id" 
// const embkey = "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id" 

var groupby_fields_region = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_region_slave_dis__geo_location__id",
];

var groupby_fields_port = [
  "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id",
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



export default function IntraTabs(props) {
  const { complete_object, set_complete_object , disembark, setDisembark,layer} = useContext(props.context);
  const TabContext = React.createContext({});
  const TabContext2 = React.createContext({});

  const complete_object2=JSON.parse(JSON.stringify(complete_object));
  delete complete_object2[groupby_fields_region[0]];
  delete complete_object2[groupby_fields_region[1]];
  delete complete_object2[groupby_fields_port[0]];
  delete complete_object2[groupby_fields_port[1]];
  if(props.isRegion){
    complete_object2[groupby_fields_region[1]]=complete_object[groupby_fields_region[0]];
  }
  else{
    complete_object2[groupby_fields_port[1]]=complete_object[groupby_fields_port[0]];
  }
  delete complete_object2["value_field_tuple"];
  complete_object2["value_field_tuple"]=["voyage_slaves_numbers__imp_total_num_slaves_disembarked", "sum"];
  
  const lat=layer._latlng.lat;
  const lng=layer._latlng.lng;
  console.log("afafdafd", lat, lng);
  const embarkDisable=props.dataset==0?(lng<=-26||lat>=-5.51?true:false):false;
  const disembarkDisable=props.dataset==0?(lng>=-26&&lat<=-5.51?true:false):false;
  const [value, setValue] = React.useState(embarkDisable?'disembark':'purchase');


  const handleChange = (event,newValue) => {
    event.stopPropagation()
    event.preventDefault()
    console.log("Change tab to: ", newValue, event)
    setValue(newValue);
    if(props.isRegion){
      setDisembark(newValue=="purchase"?groupby_fields_region[0]:groupby_fields_region[1]);
    }
    else{
      setDisembark(newValue=="purchase"?groupby_fields_port[0]:groupby_fields_port[1]);
    }
    

  };

  return (
    
    <Grid>
      {props.title}
      <div style={{ fontSize: "24px", color: "black" }}>
        <div>
          <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange}>
            {embarkDisable?null:<Tab value="purchase" label={props.isRegion?"Region of embarkation":"Port of embarkation"}/>}

            {disembarkDisable?null:<Tab value="disembark" label={props.isRegion?"Region of disembarkation":"Port of disembarkation"} disabled={disembarkDisable}/>}
            </Tabs>
            {embarkDisable?null:
              <TabContext.Provider value={{ complete_object, set_complete_object , disembark, setDisembark,layer}}>
                <TabPanel context={TabContext} value={value} index={"purchase"}>
                  <Pivot context={TabContext} dispatch={props.dispatch}/> 
                </TabPanel>
              </TabContext.Provider>
            }
            {disembarkDisable?null:
              <TabContext2.Provider value={{ complete_object: complete_object2, disembark, setDisembark,layer}}>
                <TabPanel context={TabContext2} value={value} index={"disembark"}>
                  <Pivot context={TabContext2} dispatch={props.dispatch} /> 
                </TabPanel>
              </TabContext2.Provider>
            }
          </Box>
        </div>
      </div>
    </Grid>
  );
}


