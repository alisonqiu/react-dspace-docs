import {Grid, Button, IconButton, AppBar, Toolbar, Drawer, Divider} from "@mui/material";
import {useContext} from "react";
// import {VoyageContext} from "../VoyageApp";

import * as React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';

import ComponentFac from './ComponentFac';
import Cascading from './Cascading'
import { InsertEmoticonOutlined } from "@mui/icons-material";

// import {autocomplete_text_fields, obj_autocomplete_text_fields, menu_label} from './var'
// import { VoyageContext } from "../VoyageApp";

export const AppContext = React.createContext();

// const header = { "Authorization": process.env.REACT_APP_AUTHTOKEN }

export default function Filter(props) {
    const {options_flat, search_object, set_search_object, drawerOpen, handleDrawerClose, nested_tree, dataSet, typeForTable, labels, setLabels, pageType,  page, setPage} = useContext(props.context);
    const [menuPosition, setMenuPosition] = React.useState(null);
    const [fullScreen, setFullScreen] = React.useState(false);
    const [rightScreen, setRightScreen] = React.useState(false);

    // Handle Full Screen
    const handleFullScreen = () =>{
        setFullScreen(!fullScreen);
        // setWidth(width === 12 ? 5:12);
        // setMargin(margin === "10px" ? "5px":"10px");
    };

    // Handle Screen LR switch
    const handleSwitchScreen = () =>{
        setRightScreen(!rightScreen);
    };

    // Handle Filter Reset Action
    const handleFilterReset = () =>{
        set_search_object(dataSet==="0" ? {'dataset': ["0", "0"]}: {'dataset': ["1", "1"]});
        setLabels([])
    };

    // Handle delete by removing the specified key
    const handleDelete = (item) => { 
        // var raw = item.split("***")
        // var varName = raw[0]
        var varName = item.option
        let newObject = {...search_object};
        if(varName=="voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name"){
            delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude"];
            delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude"];
        }
        else if(varName=="voyage_itinerary__imp_principal_port_slave_dis__geo_location__name"){
            delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude"];
            delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude"];
        }
        else{
            delete newObject[varName];
        }
        set_search_object(newObject); 
        setLabels((labels) => labels.filter((e) => e.option !== varName));
    };

  const color = (() =>{
    if(pageType === "voyage") {
      if(dataSet==="0") {
        return "voyageTrans"
      }else{
        return "voyageIntra"
      }
    }

    if(typeForTable === "enslavers"){
      return "success"
    }

    if(dataSet==="0") {
      return "primary"
    }else{
      return "secondary"
    }
  })()

  const OpenBoundingBoxFilter = (event)=>{
    if(!labels.some(e=>e.option == "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name")){
        setLabels([...labels, {option:"voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name", type:"<class 'rest_framework.fields.Map'>", label:""}])
    }
  }

//   console.log("Search Object: ", search_object)
  
    return (
    <AppContext.Provider
        value={{
          options_flat,
          menuPosition,
          setMenuPosition,
          labels,
          setLabels,
          nested_tree
      }}
    >
    {drawerOpen ?
        <AppBar position="fixed" color={color} elevation={0} style={{zIndex:3, marginTop:"64px"}}>
            <Toolbar>
                    <Grid container direction="row" spacing={1}>
                        {
                        Object.keys(nested_tree).map((key) => {
                            return(
                            <Cascading key={'cascading-' + key} menuName={key} button={nested_tree[key]} context={props.context}/>
                            )
                        })
                        }
                    </Grid>
                {/* } */}
            </Toolbar>
        </AppBar>: 
        null}
    <Drawer
        className={"Selected Fields Drawer"}
        variant="persistent"
        anchor={rightScreen?"right":"left"}
        open={drawerOpen}
        PaperProps={{ sx: { width: fullScreen?"100%":"25%", background:"#EAECEE" }}}
        // PaperProps={{ sx: { width: fullScreen?"100%":"25%", height: "80%", marginTop: "128px", background:"#EAECEE" }}}
        style={{ position:'relative', zIndex:2 }}
    >
        <Toolbar />
        <Toolbar />
        <Divider />
        <Grid container justifyContent="center" sx={{mb:"10px"}}> 
                <Grid container item justifyContent={rightScreen?"flex-start":"flex-end"}>
                    <IconButton onClick={handleFilterReset}>
                        <RestartAltIcon />
                    </IconButton>
                    <IconButton onClick={handleSwitchScreen}>
                        {rightScreen ? <SwitchLeftIcon /> : <SwitchRightIcon />}
                    </IconButton>
                    <IconButton onClick={handleFullScreen}>
                        {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon/>}
                    </IconButton>
                </Grid>
                {
                    pageType=='voyage' ? 
                    <Button variant="contained" color={color} onClick={OpenBoundingBoxFilter}>
                        <Typography color="white">Add Visual Filter</Typography>
                    </Button> : null
                }
        </Grid>
        <Divider />
        <Grid 
            container 
            item
            rowSpacing={2} columnSpacing={0.5}
            direction="row"
            justifyContent="center"
            sx={{mt:"10px", mb:"10px", ml:"10px"}}
        >
                {labels.length === 0 ? 
                    <Grid container item justifyContent="center" sx={{mb:"15px", mr:"10px"}}>
                        <Typography color="#808B96">No Filter</Typography>
                    </Grid>
                :
                    labels.map((item, index) => {
                    return(
                      <Grid container key={'container'+item.option} xs={fullScreen?5:12} sx={{mb:"5px",  mr:"10px"}}>
                          <Grid item xs={10}>
                                {/* <Typography key={'typo'+item.option} >{options_flat[item.option].flatlabel}</Typography>
                                <ComponentFac key={'compFac'+item.option} params={item} index={index} context={props.context}/> */}
                              <Accordion key={'accord'+item.option}>
                                  <AccordionSummary key={'accordSum'+item.option}>
                                      <Typography key={'typo'+item.option}>{options_flat[item.option].flatlabel}</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails key={'accordDetail'+item.option}>
                                      <ComponentFac key={'compFac'+item.option} params={item} index={index} context={props.context}/>
                                  </AccordionDetails>
                              </Accordion>
                          </Grid>
                          <Grid key={'item'+item.option} item xs={2}>
                              <IconButton key={'icon'+item.option} onClick={()=>{handleDelete(item)}}>
                                  <RemoveCircleOutlineIcon />
                              </IconButton>
                          </Grid>
                      </Grid>
                    )})
                }
        </Grid>
        <Divider />
        <Grid container item justifyContent={rightScreen?"flex-start":"flex-end"}>
                <IconButton onClick={handleDrawerClose}>
                    {rightScreen?<ChevronRightIcon />:<ChevronLeftIcon />}
                </IconButton>
        </Grid>
    </Drawer>
    </AppContext.Provider>
  );
}
