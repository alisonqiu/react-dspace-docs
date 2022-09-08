import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "./Filter";
import {VoyageContext} from "../VoyageApp";
import {ComponentContext} from "./ComponentFac"
const header={ "Authorization": process.env.REACT_APP_AUTHTOKEN}
const base_url = process.env.REACT_APP_BASEURL;

export default function Auto(props) {

 const {labels} = React.useContext(AppContext)
  const {search_object, set_search_object, typeForTable,setPage} = React.useContext(props.context)
  const { index } = React.useContext(ComponentContext)

  const searchLabel = labels[index];
  
  const [value, setValue] = React.useState([]);
  const [textInput, setTestInput] = React.useState("");
  const [autocompleteOptions, setautocompleteOptions] = React.useState([]);
  
  const endpoint =(()=> {
    switch (typeForTable) {
      case "slaves":
        return "past/enslaved/"
      case "enslavers":
        return "past/enslavers/"
      default:
        return "voyage/"
    }
  })()

    React.useEffect(()=>{
      const fetchData = async (labels,textInput) => {
        var formdata = new FormData();
        formdata.append(labels.option, textInput);


        var requestOptions = {
            method: 'POST',
            headers: header,
            body: formdata,
            redirect: 'follow'
        };
        

        fetch(base_url+endpoint+"autocomplete", requestOptions)
        .then(response => response.json())
        .then(result => {
            var newOptions = result[labels.option]
            setautocompleteOptions(newOptions) })
            // console.log(autocompleteOptions)s
      }

      fetchData(searchLabel,textInput).catch(console.error)
    },[search_object, textInput])

    // React.useEffect(()=>{
    //   if(value != ''){
    //     // value.map((m) => {
    //       set_search_object(search_object=>({                     // <---------- UPDATE SEARCH OBJECT
    //         ...search_object,
    //         [searchLabel.option]: value
    //       }));
    //     // })
    //   }

    // },[value])

//   const parsehtml = (inputarr) => {let arr =[]; inputarr.map(input => {arr.push(input.replace(/(<([^>]+)>)/gi, ""));})
// return arr}

  // const parsehtml = (input) => {return input.replace(/(<([^>]+)>)/gi, "")}


  return (
    <Autocomplete
      disablePortal
      autoHighlight
      multiple
      options={autocompleteOptions}
      // getOptionLabel={(option) => parsehtml(option)}
      value={search_object[searchLabel.option] ? search_object[searchLabel.option] : autocompleteOptions[0]}
      // value={autocompleteOptions[0]}
      onChange={(event, newValue) => {
        // setValue(oldArray => [newValue][0]);
        
        set_search_object(search_object=>({                     // <---------- UPDATE SEARCH OBJECT
          ...search_object,
          [searchLabel.option]: newValue
        }))
        setPage(0)
      }}
      // sx={{ width: 300 }}
      // renderOption = {
      //   autocompleteOptions.forEach((option) => {return <div dangerouslySetInnerHTML={{__html: option}} />;})
      // }

      

      renderInput={(params) => {

        setTestInput(params.inputProps.value)
        // console.log("TestInput: ", params.inputProps.value)
        return <TextField {...params} label="field" />
         
    }}
    />
  );
}
