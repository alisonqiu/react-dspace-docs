import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from '@mui/material/MenuItem';
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Icon from '@mui/material/Icon';
import logo from "../images/sv-logo.png";
import {Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {switchTheme} from "../Theme";
import {ThemeProvider} from "@mui/material/styles";
import FilterAlt from '@mui/icons-material/FilterAlt';
import {useContext, useCallback, useState} from "react";
import Drawer from '@mui/material/Drawer';
import _ from 'lodash';
import Auto from "./Autocomplete"
import Slider from "./Slider"
import { AiOutlineSearch } from 'react-icons/ai';

export default function ResponsiveAppBar(props) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const {filter_obj, set_filter_obj} = props.state;
  const state_filter = {
    filter_obj: filter_obj,
    set_filter_obj: set_filter_obj}
  console.log("---docapp,",filter_obj)

  const handleOpen = useCallback(() => setDrawerOpen(true), []);

  const handleClose = useCallback(() => setDrawerOpen(false), []);
  // })()

  return (
    //TODO: https://codesandbox.io/s/uorfhb?file=/demo.js
    <div>
    <AppBar position="sticky"  elevation={0} style={{zIndex:4}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Icon>
            <img src={logo} height={30} width={60} />
          </Icon>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            Voyages
          </Typography>
          <IconButton
              aria-label="open drawer"
              onClick={() => handleOpen()}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <AiOutlineSearch color= {"white" }/>

              <Typography sx={{ color: "white" }}>search</Typography>
          </IconButton>
          

           <Drawer
          anchor={"top"}
          open={drawerOpen}
          onClose={handleClose}
          //
        >
           <Grid
                    container
                    item
                    alignItems="center"
                    direction="column"
                    height="fit content" 
                    //sx={{ ml:"40px"}}
                >
          <Typography sx={{ m:"10px" ,justifyContent:"center" }}>search by author</Typography>
        
          <Auto 
          state={state_filter}
          sx={{
            width : '200vw'
            
          }}/>
          <Typography sx={{ m:"10px" }}>search by year</Typography>
          <Slider 
          
          state={state_filter}
          />
          </Grid>
        </Drawer>

        </Toolbar>
      </Container>
    </AppBar>

      </div>
  );
};
