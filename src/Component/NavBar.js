import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
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
import {useContext, useState} from "react";
import _ from 'lodash';

export default function ResponsiveAppBar(props) {
  const {typeForTable, setTypeForTable, search_object, set_search_object, drawerOpen, setDrawerOpen, handleDrawerOpen, handleDrawerClose, dataSet, setDataSet, pageType, labels, setLabels,
  
    totalResultsCount, setTotalResultsCount,
    page, setPage,
    rowsPerPage, setRowsPerPage,

    sortingReq, setSortingReq,
    field, setField,
    direction, setDirection,
  } = useContext(props.context)
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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

  return (
    <AppBar position="sticky" color={color} elevation={0} style={{zIndex:4}}>
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="whiteIcon"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem onClick={handleCloseNavMenu}>
                {pageType !== "home" ? 
                <IconButton
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start">
                      <FilterAlt/>
                      <Typography>Filter</Typography>
                </IconButton>:
                null}
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                   <Link to={"/voyage/Scatter"} style={{ textDecoration: "none" }}>
                    Voyages
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                <Link to={"/past"} style={{ textDecoration: "none" }}>
                    Past
                </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                <Link to={"/Documents"} style={{ textDecoration: "none" }}>
                    Documents
                </Link>
                </MenuItem>
                

                <ThemeProvider theme={switchTheme}>
              {search_object && typeForTable === "slaves" || pageType === "voyage" ?
                              <MenuItem>
                <ToggleButtonGroup
                  color="blackMode"
                  value={dataSet}
                  exclusive
                  onChange={(event) => {

                    set_search_object({
                      ...search_object,
                      dataset: [event.target.value, event.target.value]
                    })
                    setDataSet(event.target.value)

                    
                    setTotalResultsCount(0);
                        setPage(0);
                        setRowsPerPage(10);

                        setSortingReq(false);
                        setField([]);
                        setDirection("asc");
                  }}
                  sx={{background: dataSet === "0" ? "#42a5f5" : "#ab47bc"}}
                  size={"small"}

                >
                  <ToggleButton sx={{background: "#42a5f5"}} value={"0"} >Trans-Atlantic</ToggleButton>
                  <ToggleButton sx={{background: "#ab47bc"}} value={"1"} >Intra-American</ToggleButton>
                </ToggleButtonGroup>                
                </MenuItem>:null}
                

              {typeForTable?<MenuItem> 
                <ToggleButtonGroup
                  color="blackMode"
                  value={typeForTable}
                  exclusive
                  onChange={(event) => {
                    switch (event.target.value){
                      case "slaves":
                        set_search_object({
                          dataset: [dataSet, dataSet]
                        })
                        setLabels([])

                        setTotalResultsCount(0);
                        setPage(0);
                        setRowsPerPage(10);

                        setSortingReq(false);
                        setField([]);
                        setDirection("asc");
                        break;
                      case "enslavers":
                        set_search_object({});
                        setLabels([])

                        setTotalResultsCount(0);
                        setPage(0);
                        setRowsPerPage(10);

                        setSortingReq(false);
                        setField([]);
                        setDirection("asc");
                        break;
                    }
                    setTypeForTable(event.target.value)
                  }}
                  // sx={{background: dataSet === "0" ? "#42a5f5" : "#ab47bc"}}
                  size={"small"}
                >
                  <ToggleButton sx={{background: dataSet === "0"?"#42a5f5":"#ab47bc"}} value="slaves">Enslaved People</ToggleButton>
                  <ToggleButton sx={{background: "#388e3c"}} value="enslavers">Enslavers</ToggleButton>
                </ToggleButtonGroup>
                </MenuItem>:
                null}

          </ThemeProvider>

            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            Voyages
          </Typography>
          <ThemeProvider theme={switchTheme}>
            <Stack spacing={4} direction={"row"} justifyContent="flex-end"
                   alignItems="flex-end" sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>

              {pageType !== "home" ? 
                <IconButton
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start">
                      <FilterAlt sx={{ color: "white" }}/>
                      <Typography sx={{ color: "white" }}>Filter</Typography>
                </IconButton>:
                null}

              {search_object && typeForTable === "slaves" || pageType === "voyage" ?
                <ToggleButtonGroup
                  color="blackMode"
                  value={dataSet}
                  exclusive
                  onChange={(event) => {
                    set_search_object({
                      ...search_object,
                      dataset: [event.target.value, event.target.value]
                    })
                    setDataSet(event.target.value)

                    setTotalResultsCount(0);
                        setPage(0);
                        setRowsPerPage(10);

                        setSortingReq(false);
                        setField([]);
                        setDirection("asc");
                  }}
                  sx={{background: dataSet === "0" ? "#42a5f5" : "#ab47bc"}}
                  size={"small"}

                >
                  <ToggleButton sx={{background: "#42a5f5"}} value={"0"} >Trans-Atlantic</ToggleButton>
                  <ToggleButton sx={{background: "#ab47bc"}} value={"1"} >Intra-American</ToggleButton>
                </ToggleButtonGroup>:
                null}

              {typeForTable?
                <ToggleButtonGroup
                  color="blackMode"
                  value={typeForTable}
                  exclusive
                  onChange={(event) => {
                    switch (event.target.value){
                      case "slaves":
                        set_search_object({
                          dataset: [dataSet, dataSet]
                        })
                        setLabels([])

                        setTotalResultsCount(0);
                        setPage(0);
                        setRowsPerPage(10);

                        setSortingReq(false);
                        setField([]);
                        setDirection("asc");
                        break;
                      case "enslavers":
                        set_search_object({});
                        setLabels([])

                        setTotalResultsCount(0);
                        setPage(0);
                        setRowsPerPage(10);

                        setSortingReq(false);
                        setField([]);
                        setDirection("asc");
                        break;
                    }
                    setTypeForTable(event.target.value)
                  }}
                  // sx={{background: dataSet === "0" ? "#42a5f5" : "#ab47bc"}}
                  size={"small"}
                >
                  <ToggleButton sx={{background: dataSet === "0"?"#42a5f5":"#ab47bc"}} value="slaves">Enslaved People</ToggleButton>
                  <ToggleButton sx={{background: "#388e3c"}} value="enslavers">Enslavers</ToggleButton>
                </ToggleButtonGroup>:
                null}
            </Stack>
          </ThemeProvider>

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            <Link to={"/voyage/Scatter"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Voyages
              </Button>
            </Link>
            <Link to={"/past"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Past
              </Button>
            </Link>
            {/* <Link to={"/Blog"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Blog
              </Button>
            </Link> */}
            <Link to={"/Documents"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Documents
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
