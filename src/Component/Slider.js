import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import axios from 'axios';

import { Slider } from '@mui/material';


const base_url = process.env.REACT_APP_BASEURL;
const url = 'https://voyages3-api.crc.rice.edu/docs/aggregations';
const adurl = "127.0.0.1:8000/advertisement/aggregations"
const key = "pub_year"


const Input = styled(MuiInput)`
  width: 80px;
`;

export default function GetSlider(props) {


    const {filter_obj:filter_obj, set_filter_obj:set_filter_obj} = props.state;

    // const [range, setRange] = React.useState([0, 1873])
    // const [value, setValue] = React.useState([range[0] / 2, range[1] / 2])

    const [range, setRange] = React.useState([0, 1873])
    const [value, setValue] = React.useState(filter_obj[key] ? filter_obj[key] : [0, range[1]])


    var d = new FormData();
    d.append('aggregate_fields', 'pub_year');
    const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;


    const config = {
        method: 'post',
        baseURL: url,
        headers: { 'Authorization': AUTH_TOKEN },
        data: d
    }

    React.useEffect(() => {
        axios(config).then(res => {
            console.log("🚀 ~ file: slider.js ~ line 42 ~ axios ~ value", value)

        

                if(filter_obj[key][0] === 0){
                    setRange([Object.values(res.data)[0]['min'], Object.values(res.data)[0]['max']]);
                    setValue([Object.values(res.data)[0]['min'], Object.values(res.data)[0]['max']]);
                }

            
        
        }).then(console.log("HTTP resquest from Slider", config))
    }, [])


  


    const handleInputChange = (event) => {
        const startVal = value[0]
        const endVal = value[1]
        var res = [0, 0]
        if (event.target.name === "end") {
            res = [startVal, Number(event.target.value)]
            //setValue([startVal, Number(event.target.value)])
        } else if (event.target.name === "start") {
            res = [Number(event.target.value), endVal]
            //setValue([Number(event.target.value), endVal])
        }
        setValue(res)
    };


    const handleBlur = (event => {
        const curStart = value[0]
        const curEnd = value[1]

        if (event.target.name === "end") {
            if (event.target.value > range[1]) setValue([curStart, range[1]]);
            if (event.target.value < curStart) setValue([curStart, curStart + 1 < range[1] ? curStart + 1 : range[1]]);
        } else if (event.target.name === "start") {
            if (event.target.value > curEnd) setValue([curEnd - 1 < range[0] ? range[0] : curEnd - 1, curEnd]);
            if (event.target.value < range[0]) setValue([range[0], curEnd]);
        } else {
            //console.log("range selection legit", value)
        }

        set_filter_obj({                     // <---------- UPDATE FILTER OBJECT
            ...filter_obj,
            [key]: [value[0], value[1]]
        });
            console.log("🚀 ~ file: slider.js ~ line 83 ~ handleBlur ~ filter_obj", filter_obj)
    });

    function handleCommittedChange(event, newValue) {
        // setPage(0)
        set_filter_obj({
            ...filter_obj,
            [key]: [value[0], value[1]]
        });
        setValue(newValue);
    }



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };




    return (
        <>
            <div className="sliderInputs" 
      
             >
                <Input
                    color="secondary"
                    name="start"
                    value={value[0]}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {

                            var temp = Number(event.target.value);

                            if (event.target.value < range[0]) {
                                setValue([range[0], value[1]]);
                                temp = range[0]
                            }
                            else if (event.target.value > range[1]) {
                                setValue([value[1] - 1 < range[0] ? range[0] : value[1] - 1, value[1]]);
                                temp = value[1] - 1 < range[0] ? range[0] : value[1] - 1
                            }
                            set_filter_obj({
                                ...filter_obj,
                                [key]: [temp, value[1]]
                            })
                        }
                    }}
                    inputProps={{
                        step: range[1] - range[0] > 20 ? 10 : 1,
                        min: range[0],
                        max: range[1],
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        "position": "left"
                    }}
                />
                <Input
                    name="end"
                    value={value[1]}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {

                            var temp = Number(event.target.value);

                            if (event.target.value > range[1]) {
                                temp = range[1]
                                setValue([value[0], range[1]]);
                            }
                            else if (event.target.value < value[0]) {
                                temp = value[0] + 1 < range[1] ? value[0] + 1 : range[1]
                                setValue([value[0], value[0] + 1 < range[1] ? value[0] + 1 : range[1]]);
                            }
                            set_filter_obj({
                                ...filter_obj,
                                [key]: [value[0], temp]
                            })
                        }
                    }}
                    inputProps={{
                        step: range[1] - range[0] > 20 ? 10 : 1,
                        min: range[0],
                        max: range[1],
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        "position": "left"
                    }}
                />
            </div>

            <Slider
                size="small"
                min={range[0]}
                max={range[1]}
                value={value}
                sx= {{       
                width :"30%"}}
               
                onChange={handleChange}
                onChangeCommitted={handleCommittedChange}
            />

        </>
    )

}
