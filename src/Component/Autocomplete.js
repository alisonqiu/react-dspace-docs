import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const header = { "Authorization": process.env.REACT_APP_AUTHTOKEN }
const base_url = process.env.REACT_APP_BASEURL;
//change base_url to connect to the advertisement app
//const base_url = process.env.AD_APP_BASEURL;
const key = "title"

export default function Auto(props) {

    const {filter_obj:filter_obj, set_filter_obj:set_filter_obj} = props.state;

    const [value, setValue] = React.useState([]);
    const [textInput, setTextInput] = React.useState("");
    const [autocompleteOptions, setautocompleteOptions] = React.useState([]);


    React.useEffect(() => {
        const fetchData = async (textInput) => {           // not sure how to put in key (originally labels)
            var formdata = new FormData();
            formdata.append(key, textInput);


            var requestOptions = {
                method: 'POST',
                headers: header,
                body: formdata,
                redirect: 'follow'
            };


            fetch(base_url + 'autocomplete', requestOptions)
                .then(response => response.json())
                .then(result => {
                    var newOptions = result['results'][0]
                    setautocompleteOptions(newOptions)
                })
        }

        fetchData(textInput).catch(console.error)
    }, [textInput])


    return (
        <Autocomplete
            disablePortal
            autoHighlight
            multiple
            options={autocompleteOptions}
            sx= {{       
                width :"30%"}}
            value={filter_obj[key] ? filter_obj[key] : autocompleteOptions[0]}
            onChange={(event, newValue) => {
                set_filter_obj(filter_obj => ({                     
                    ...filter_obj,
                    [key]: newValue
                }))
            }}

            renderInput={(params) => {

                setTextInput(params.inputProps.value)
                return <TextField {...params} label="field" />

            }}
        />
    );
}