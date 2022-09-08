import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Box, Button, Card, CardContent, Typography,Grid, Popover, CircularProgress} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {  useWindowSize } from '@react-hook/window-size'
import _ from 'lodash';
import Story from "../../PAST/RelationGraph/Story";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization: Story Card",
  date: "July 26, 2022",
  description:
    "The Story Card shows life stories of the enslaved people. For example, this two cards show specific lifetime records of Corbit, Isam and Lambert, Joe. Click through to study more lifetime stories of the other enslaved people.",
};

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function StoryHome() {
  const [width, height] = useWindowSize();
  const [data, setData] = useState();

  const [queryData, setQueryData] = useState({
    slaves: [540102, 540103],
    type: "slaves",
    enslavers:[]
  });

  const getEndpoint = (typeForTable) => {
    switch (typeForTable) {
      case "slaves": return "past/enslaved/"
      case "enslavers": return "past/enslavers/"
    }
  }

  useEffect(() => {
    const endpoint = (getEndpoint(queryData.type))
    const targets = (() => {
      switch (queryData.type) {
        case "slaves": return queryData.slaves
        case "enslavers": return queryData.enslavers
      }
    })()
    const fetchData = async ()=> {
      const promises = targets.map(target => {
        let queryData = new FormData();
        queryData.append("id", target.toString());
        queryData.append("id", target.toString());
        return fetch(base_url + endpoint, {
          method: "POST",
          body: queryData,
          headers: {'Authorization': auth_token}
        }).then(res => res.json()).then(res => {return res[0];})
      })
      const response = await Promise.all(promises)
      setData(response)
    }
    fetchData().catch(console.error);
  }, [])

  //useEffect(()=>{console.log("aaabbbcc", data);}, [data])

  return (
    <div>
      <Card sx={{display: "flex"}} style={{background: 'transparent', boxShadow: 'none'}}>
        <Grid container>
          {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
          <Grid item sx={{maxWidth: width>800 ? "40%": width*0.9}}>
            <Box sx={{height:height*0.8,boxShadow: 4, margin: 2, padding:2, borderRadius: '10px', overflow: "hidden",
                  overflowY: "scroll"}} style={{backgroundColor: "#f1f1f1"}}>
              <CardContent sx={{flex: "1 0 auto"}}>
                <Button
                  variant="text"
                  style={{fontSize: "24px"}}
                  component={Link}
                  to="past"
                >
                Data Visualization - Story Cards
                </Button>
                <div>
                  <CardContent>
                    <Typography variant="subtitle1" color="textSecondary">
                      {featuredPosts.date}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                      {featuredPosts.description}
                    </Typography>
                    {/* <Button variant="text" type="button" onClick={GotoVoyagePage}>
                      Continue reading...
                    </Button> */}
                  </CardContent>
                </div>
              </CardContent>
            </Box>
          </Grid>
          <Grid item sx={{width:width>800 ?"60%":width*0.9}}>
          {/* <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}> */}
            <CardContent sx={{flex: "1 0 auto"}}>
              <Grid container >
                {data && data.map((item, key) => {
                return <Grid key={'grid-' + key} item xs={6} sx={{overflowY: "auto"}}><Story target={item} dynamic={false}/></Grid>
                })}
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
