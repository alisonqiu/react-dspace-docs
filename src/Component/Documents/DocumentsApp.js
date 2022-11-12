import * as React from 'react';
import Documents from "./Documents";
//import Archive from "./ArcAd";
import Archive from "./Arcgive_prod"; 
import Slider from "../Slider"
import Auto from "../Autocomplete"
import ResponsiveAppBar from "../NavBar";
import Grid from "@mui/material";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;


export const DocContext = React.createContext({});

export default function DocApp(props) {
    //const [filter_obj, set_filter_obj] = React.useState({})
    const [filter_obj, set_filter_obj] = React.useState({
        // "pub_year":[1800, 2000],
        // "title":['Plan of the Slaver Vigilante']
    })

    console.log("---docapp,",filter_obj)
    const state_filter = {
        filter_obj: filter_obj,
        set_filter_obj: set_filter_obj}
    return (
        <div>
        <DocContext.Provider 
            value={{
                dataSet:"0", 
                pageType:"home",
                }}>
            <ResponsiveAppBar state={state_filter}/>
            
            <Archive state={state_filter}/>
        </DocContext.Provider>
        </div>
    )
};
