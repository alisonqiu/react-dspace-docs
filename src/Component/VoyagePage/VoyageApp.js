import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import Voyage from "./Voyage";
import { columnOptions } from './Result/Table/tableVars';
import * as options_flat from '../util/options.json'

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const VoyageContext = React.createContext({});

export default function VoyageApp(props) {
  const endpoint = "voyage/"
  const [dataSet, setDataSet] = useState("0")

  // const menu_label = {
  //   "voyage_id": "ID",
  //   "voyage_itinerary": "Itinerary",
  //   "voyage_dates": "Dates",
  //   "voyage_crew": "Crew",
  //   "voyage_ship": "Ship",
  //   "voyage_captainconnection": "Captain",
  //   "voyage_shipownerconnection": "Ship Owner",
  //   "voyage_outcome": "Outcome",
  //   "voyage_sourceconnection": "Source"
  // }

  // const {isLoading: isLoading_tree, error: error_tree, data: options_tree} = useQuery('voyage_option_tree',
  //   () => fetch(base_url + "voyage/", {
  //     method: "OPTIONS",
  //     headers: {'Authorization': auth_token}
  //   }).then(res => res.json()), {refetchOnMount: "always"}
  // )
  // const {isLoading: isLoading_flat, error: error_flat, data: options_flat} = useQuery('voyage_options_flat',
  //   () => fetch(base_url + "voyage/?hierarchical=false", {
  //     method: "OPTIONS",
  //     headers: {'Authorization': auth_token}
  //   }).then(res => res.json()), {refetchOnMount: "always"}
  // )

  const [search_object, set_search_object] = useState({
    'dataset': ["0", "0"]
  })

  const [output, setOutput] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Handle Drawer Open and Close
  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(!drawerOpen);
  };

  // if (error_flat) return 'An error has occurred on option flat: ' + error_flat.message
  // if (error_tree) return 'An error has occurred on option tree: ' + error_tree.message
  // if (isLoading_flat || isLoading_tree) return <CircularProgress/>
  // Pagination

  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortingReq, setSortingReq] = useState(false);
  const [field, setField] = useState([]);
  const [direction, setDirection] = useState("asc");
  
  return (
    <VoyageContext.Provider value={{
      options_flat,
      search_object, set_search_object,
      drawerOpen, setDrawerOpen, handleDrawerOpen, handleDrawerClose,
      endpoint, nested_tree: columnOptions,
      dataSet, setDataSet, labels, setLabels, pageType: "voyage",
      sortingReq, setSortingReq,
      field, setField,
      direction, setDirection,
      totalResultsCount, setTotalResultsCount,
      page, setPage,
      rowsPerPage, setRowsPerPage
    }}>
      <Voyage />
    </VoyageContext.Provider>
  );
}
