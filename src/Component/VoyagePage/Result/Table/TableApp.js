//import ColSelector from "./ColSelector";
import ColSelector11 from "./ColSelector11";
import Table from "./Table";
import Modal from "./TableModal";
import React, { useState, useContext } from "react";
import { columnOptions, voyage_default_list } from "./tableVars";
import * as labels from "../../../util/options.json";
import { VoyageContext } from "../../VoyageApp";
import UVModal from "../../../Documents/UVModal";

export const ColContext = React.createContext({});

function TableApp(props) {
  const [cols, setCols] = React.useState(voyage_default_list);
  const {
    endpoint,
    // handle pagination
    totalResultsCount,
    setTotalResultsCount,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    // handle sorting
    sortingReq,
    setSortingReq,
    field,
    setField,
    direction,
    setDirection,
  } = React.useContext(props.context);

  // handle filter
  const { search_object } = useContext(VoyageContext);

  // handle voyage modal
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [info, setInfo] = useState([]);

  // handle UV modal
  const [uvOpen, setUVOpen] = useState(false);
  const [text_ref, setText_ref] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div>
      <ColContext.Provider
        value={{
          cols,
          setCols,
          endpoint,
          columnOptions,
          options_flat: labels,
          search_object,
          checkbox: false,
          modal: true,
          // handle voyage modal
          id,
          setId,
          open,
          setOpen,
          info,
          setInfo,
          // handle pagination
          totalResultsCount,
          setTotalResultsCount,
          page,
          setPage,
          rowsPerPage,
          setRowsPerPage,
          // handle sorting
          sortingReq,
          setSortingReq,
          field,
          setField,
          direction,
          setDirection,
          // handle UV modal
          text_ref,
          setText_ref,
          url,
          setUrl,
          uvOpen,
          setUVOpen,
        }}
      >
        <ColSelector11 context={ColContext} />
        <Table context={ColContext} />
        <Modal context={ColContext} endpoint="voyage/" />
        <UVModal context={ColContext} />
      </ColContext.Provider>
    </div>
  );
}
export default TableApp;
