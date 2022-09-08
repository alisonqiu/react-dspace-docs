import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
//import {VoyageContext} from "../VoyageApp";


export default function RadioButton(props) {
  const {search_object, set_search_object} = React.useContext(props.context);

  React.useEffect(()=>{
    set_search_object({...search_object, 'dataset':[0, 0]});
  }, []);

  const handleChange = (event) => {
    if(event.target.value=="Trans-Atlantic"){
      set_search_object({...search_object, 'dataset':[0, 0]});
    }
    else{
      set_search_object({...search_object, 'dataset':[1, 1]});
    }
  };

  return (
    <FormControl>
      {/* <FormLabel id="radio-button">Radio button</FormLabel> */}
      <RadioGroup
        defaultValue="Trans-Atlantic"
        onChange={handleChange}
      >
        <FormControlLabel value="Trans-Atlantic" control={<Radio />} label="Trans-Atlantic" />
        <FormControlLabel value="Intra-American" control={<Radio />} label="Intra-American" />
      </RadioGroup>
    </FormControl>
  );
}
