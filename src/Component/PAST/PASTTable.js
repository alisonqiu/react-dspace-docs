import React, { useState, useEffect, useContext } from "react";
//import ColSelector from "../VoyagePage/Result/Table/ColSelector";
import Table from "../VoyagePage/Result/Table/Table";
import Modal from "../VoyagePage/Result/Table/TableModal";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import HubIcon from "@mui/icons-material/Hub";
//import { Typography } from "@mui/material";
//import { styled } from "@mui/material/styles";
import * as enslaved_labels from "../util/enslaved_options.json";
import * as enslaver_labels from "../util/enslaver_options.json";
import ColSelector11 from "../VoyagePage/Result/Table/ColSelector11";
import {
  enslaved_default_list,
  enslaved_var_list,
  enslaver_default_list,
  enslaver_var_list,
} from "./vars";
import { useWindowSize } from "@react-hook/window-size";

export const ColContext = React.createContext({});
export default function PASTTable(props) {
  const [width, height] = useWindowSize();
  const [cols, setCols] = React.useState(enslaved_default_list);
  const [labels, setLabels] = React.useState(enslaved_labels);
  const [all_options, setAll_options] = React.useState(enslaved_var_list);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [enslaver, setEnslaver] = React.useState(true);

  // const [totalResultsCount, setTotalResultsCount] = useState(0);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [sortingReq, setSortingReq] = useState(false);
  // const [field, setField] = useState([]);
  // const [direction, setDirection] = useState("asc");

  const getEndpoint = (typeForTable) => {
    switch (typeForTable) {
      case "slaves":
        return "past/enslaved/";
      case "enslavers":
        return "past/enslavers/";
    }
  };
  const {
    queryData,
    setQueryData,
    search_object,
    data,
    chipData,
    setChipData,
    typeForTable,

    totalResultsCount,
    setTotalResultsCount,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,

    sortingReq,
    setSortingReq,
    field,
    setField,
    direction,
    setDirection,
  } = React.useContext(props.context);
  // const [chipData, setChipData] = React.useState({});
  // console.log(endpoint)
  useEffect(() => {
    if (typeForTable === "slaves") {
      setCols(enslaved_default_list);
      setLabels(enslaved_labels);
      setAll_options(enslaved_var_list);
      setEnslaver(false);
    } else if (typeForTable === "enslavers") {
      setCols(enslaver_default_list);
      setLabels(enslaver_labels);
      setAll_options(enslaver_var_list);
      setEnslaver(true);
    }
    // setTotalResultsCount(0);
    // setPage(0);
    // setRowsPerPage(10);

    // setSortingReq(false);
    // setField([]);
    // setDirection("asc");
  }, [typeForTable]);

  const handleDelete = (chipToDelete) => () => {
    delete chipData[chipToDelete];
    if (typeForTable === "slaves") {
      setQueryData({ ...queryData, slaves: Object.keys(chipData).map(Number) });
    } else if (typeForTable === "enslavers") {
      setQueryData({
        ...queryData,
        enslavers: Object.keys(chipData).map(Number),
      });
    }
  };

  const handleSankeyOpen = () => {
    // console.log(typeForTable);
    setQueryData({
      ...queryData,
      type: typeForTable,
    });
    //console.log(queryData);
    props.handleClickOpen("body")();
  };

  return (
    <div>
      <ColContext.Provider
        value={{
          cols,
          setCols,
          setAll_options,
          setLabels,
          setEnslaver,
          // endpoint,
          id,
          setId,
          open,
          setOpen,
          enslaver,
          checkbox: true,
          modal: false,
          columnOptions: all_options,
          options_flat: labels,
          queryData,
          setQueryData,
          search_object,
          chipData,
          setChipData,
          typeForTable,
          totalResultsCount,
          setTotalResultsCount,
          page,
          setPage,
          rowsPerPage,
          setRowsPerPage,
          sortingReq,
          setSortingReq,
          field,
          setField,
          direction,
          setDirection,
        }}
      >
        <ColSelector11 context={ColContext} />
        {((typeForTable === "slaves" && queryData.slaves.length !== 0) ||
          (typeForTable === "enslavers" &&
            queryData.enslavers.length !== 0)) && (
            <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
          <Grid item sx={{ width: width > 800 ? width * 0.9 : width * 0.7 }}>
          <Card
            sx={{
              width: width > 700 ? width * 0.5 : width,
              mt: 3
            }}
          >
            <CardHeader
              titleTypographyProps={{
                fontSize: 18,
                height: 5,
              }}
              title="Selected People (MAX = 10)"
              action={
                <Button
                  variant="contained"
                  startIcon={<HubIcon />}
                  size="large"
                  color="grey"
                  disabled={
                    (typeForTable === "slaves" &&
                      queryData.slaves.length === 0) ||
                    (typeForTable === "enslavers" &&
                      queryData.enslavers.length === 0)
                  }
                  onClick={handleSankeyOpen}
                >
                  View Connections
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={1}>
                {Object.keys(chipData).map((data) => {
                  return (
                    <Grid item key={data}>
                      <Chip
                        label={chipData[data] + " (" + data + ")"}
                        onDelete={handleDelete(data)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
          </Grid>
          </Grid>
        )}
        <Table context={ColContext} handleClickOpen={props.handleClickOpen} />
        <Modal context={ColContext} endpoint="voyage/" />
      </ColContext.Provider>
    </div>
  );
}
