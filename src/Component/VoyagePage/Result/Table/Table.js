import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Tables from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { CircularProgress, Grid } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Table(props) {
  const [width, height] = useWindowSize();
  const [isLoading, setLoading] = useState(false);

  // handle table data response
  const [value, setValue] = useState([]);

  // Menu
  const {
    cols,
    checkbox,
    setOpen,
    setId,
    modal,
    options_flat,
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
    setUrl,
    setUVOpen,
  } = useContext(props.context);

  // Force Re-render
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    setLoading(true);
    //setValue([]);
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("results_page", page + 1);
    data.append("results_per_page", rowsPerPage);

    if (sortingReq) {
      var modified_field = direction === "asc" ? field : "-" + field;
      data.append("order_by", modified_field);
    }

    for (var property in search_object) {
      // eslint-disable-next-line no-loop-func
      search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }
    const endpoint = (() => {
      switch (typeForTable) {
        case "slaves":
          return "past/enslaved/";
        case "enslavers":
          return "past/enslavers/";
        default:
          return "voyage/";
      }
    })();
    axios
      .post("/" + endpoint, data)
      .then(function (response) {
        setValue(Object.values(response.data));
        //console.log(response.headers.total_results_count);
        setTotalResultsCount(Number(response.headers.total_results_count));
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [
    page,
    rowsPerPage,
    sortingReq,
    field,
    direction,
    typeForTable,
    search_object,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeForTable != null && typeForTable !== "voyage") {
      setChipData({});
      setQueryData({
        ...queryData,
        slaves: [],
        enslavers: [],
      });
    }
  }, [typeForTable]); // eslint-disable-line react-hooks/exhaustive-deps

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&:hover": {
      backgroundColor: "#85d4cb",
    },
  }));

  const ButtonLink = styled(Button)(({ theme }) => ({
    textAlign: "left",
    flexWrap: "wrap",
  }));

  const handleChangePage = (event, newPage) => {
    //console.log("newpage", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log("newRowsperpage", event.target.value);
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleChangePagePagination = (event, newPage) => {
    //console.log("newPagePagi", newPage);
    setPage(newPage - 1);
  };

  const handleSorting = (event, field) => {
    setField(field);
    setSortingReq(true);
    setDirection(direction === "asc" ? "desc" : "asc");
  };

  // handle voyage modal & handle past chip
  const handleOpen = (event, info) => {
    if (modal) {
      // voyage table
      setOpen(true);
      setId(info.id);
    } else if (info.number_enslaved > 0) {
      // enslavers table
      const selectedIndex = queryData[typeForTable].indexOf(info.id);
      if (selectedIndex === -1) {
        if (!checkedMax(info.id)) {
          chipData[info.id] = info.principal_alias;
        }
      } else {
        delete chipData[info.id];
      }
      setQueryData({
        ...queryData,
        enslavers: Object.keys(chipData).map(Number),
        type: "enslavers",
      });
    } else if (info.transactions.length !== 0) {
      // enslaved table
      const selectedIndex = queryData[typeForTable].indexOf(info.id);
      if (selectedIndex === -1) {
        if (!checkedMax(info.id)) {
          chipData[info.id] = info.documented_name;
        }
      } else {
        delete chipData[info.id];
      }
      setQueryData({
        ...queryData,
        slaves: Object.keys(chipData).map(Number),
        type: "slaves",
      });
    }
  };

  // open voyage modal in enslaved table
  const handleCellOpen = (event, info) => {
    setOpen(true);
    setId(info.transactions__transaction__voyage__id[0]);
  };

  // check if the checkbox is selected
  const isSelected = (name) => {
    if (checkbox) {
      return queryData[typeForTable].indexOf(name) !== -1;
    }
    return false;
  };

  // check if the string is numeric
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // set a maximum on the number of the checkboxes selected
  const checkedMax = (value) => {
    const maxAllowed = 10;
    const checked = queryData[typeForTable];
    return checked.length >= maxAllowed && checked.indexOf(value) === -1;
  };

  // create popover for enslaver alias in enslaved table
  const createPopover = (row) => {
    const people = row[
      "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
    ]
      ? row[
          "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
        ].flat(Infinity)
      : [];
    const roles = row["transactions__transaction__enslavers__role__role"]
      ? row["transactions__transaction__enslavers__role__role"].flat(Infinity)
      : [];
    const ids = row[
      "transactions__transaction__enslavers__enslaver_alias__identity__id"
    ]
      ? row[
          "transactions__transaction__enslavers__enslaver_alias__identity__id"
        ].flat(Infinity)
      : [];
    const output = {};
    for (let i = 0; i < people.length; i++) {
      if (!(people[i] in output)) {
        output[people[i]] = { roles: [], id: 0 };
      }
      output[people[i]]["roles"].push(roles[i]);
      output[people[i]]["id"] = ids[i];
    }
    return output;
  };

  // popover event & open sankey modal in past table
  const handleSankeyOpen = (e, id, variety) => {
    setQueryData({
      ...queryData,
      [variety]: id,
      type: variety,
    });
    props.handleClickOpen("body")();
    e.stopPropagation();
  };

  // set the element which is dragging
  const dragStart = (e, v) => {
    e.dataTransfer.setData("col_id", v);
  };

  // exchange the columns when finish the drag
  const dragDrop = (e, v) => {
    e.preventDefault();
    var data = e.dataTransfer.getData("col_id");
    var dragOut = cols.indexOf(data);
    var dragIn = cols.indexOf(v);
    [cols[dragOut], cols[dragIn]] = [cols[dragIn], cols[dragOut]];
    forceUpdate();
  };

  // handle UV modal
  const handleUV = (e, url) => {
    setUrl(url);
    setUVOpen(true);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{ width: width > 800 ? width * 0.9 : width * 0.7 }}>
            <Box sx={{ minWidth: 120, my: 2 }}>
              <FormControl fullWidth>
                <TablePagination
                  component="div"
                  count={totalResultsCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[10, 15, 20, 25]}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <TableContainer component={Paper}>
                  <Tables sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        {checkbox && <TableCell padding="checkbox"></TableCell>}
                        {cols.map((v, key) => (
                          <TableCell
                            style={{ color: "#389c90" }}
                            onClick={(event) => handleSorting(event, v)}
                            draggable
                            onDragStart={(e) => dragStart(e, v)}
                            onDrop={(e) => dragDrop(e, v)}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            key={"title-" + key}
                          >
                            <div>{options_flat[v].flatlabel}</div>
                            <div style={{ float: "right" }}>
                              {/* position: 'flex', bottom:0 */}
                              <TableSortLabel
                                style={{ opacity: field === v ? 1 : 0.4 }}
                                active={true}
                                direction={field === v ? direction : "asc"}
                              ></TableSortLabel>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {value.map((row) => {
                        const isItemSelected = isSelected(row.id);
                        return (
                          // <TableRow>
                          <StyledTableRow
                            key={row.id}
                            onClick={(event) => handleOpen(event, row)}
                          >
                            {checkbox &&
                              ((row.transactions != null &&
                                row.transactions.length !== 0) ||
                                (row.number_enslaved != null &&
                                  row.number_enslaved > 0)) && (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    disabled={checkedMax(row.id)}
                                  />
                                </TableCell>
                              )}
                            {checkbox &&
                              !(
                                (row.transactions != null &&
                                  row.transactions.length !== 0) ||
                                (row.number_enslaved != null &&
                                  row.number_enslaved > 0)
                              ) && <TableCell padding="checkbox"></TableCell>}
                            {cols.map((k, key) => {
                              if (k === "gender" && isNumeric(row[k])) {
                                return (
                                  <TableCell key={"content-" + key}>
                                    {row[k] === 1 ? "Male" : "Female"}
                                  </TableCell>
                                );
                              } else if (k === "number_enslaved") {
                                if (isNumeric(row[k]) && Number(row[k]) <= 30) {
                                  return (
                                    <TableCell key={"content-" + key}>
                                      <div
                                        style={{ color: "blue" }}
                                        onClick={(e) =>
                                          handleSankeyOpen(
                                            e,
                                            [
                                              ...new Set(
                                                row[
                                                  "alias__transactions__transaction__enslaved_person__enslaved__id"
                                                ].flat(Infinity)
                                              ),
                                            ],
                                            "slaves"
                                          )
                                        }
                                      >
                                        <u>{row[k]}</u>
                                      </div>
                                    </TableCell>
                                  );
                                } else {
                                  return (
                                    <TableCell key={"content-" + key}>
                                      {row[k]}
                                    </TableCell>
                                  );
                                }
                              } else if (
                                k ===
                                "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
                              ) {
                                const popover = createPopover(row);
                                return (
                                  <TableCell key={"content-" + key}>
                                    <Stack direction="row" spacing={1}>
                                      {Object.keys(popover).map((name, key) => (
                                        <Tooltip
                                          key={"tooltip-" + key}
                                          arrow
                                          title={popover[name]["roles"].join(
                                            ", "
                                          )}
                                          placement="top"
                                        >
                                          <Chip
                                            label={name}
                                            onClick={(e) =>
                                              handleSankeyOpen(
                                                e,
                                                [popover[name]["id"]],
                                                "enslavers"
                                              )
                                            }
                                          />
                                        </Tooltip>
                                      ))}
                                    </Stack>
                                  </TableCell>
                                );
                              } else if (
                                k === "transactions__transaction__voyage__id"
                              ) {
                                return (
                                  <TableCell key={"content-" + key}>
                                    <Link
                                      component="button"
                                      variant="body2"
                                      onClick={(e) => {
                                        handleCellOpen(e, row);
                                        e.stopPropagation();
                                      }}
                                    >
                                      {[...new Set(row[k])]
                                        .filter((n) => n != null)
                                        .join(", ")}
                                    </Link>
                                  </TableCell>
                                );
                              } else if (
                                k === "voyage_sourceconnection__text_ref"
                              ) {
                                return (
                                  <TableCell
                                    key={"content-" + key}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    {Object.values(
                                      row["voyage_sourceconnection"]
                                    ).map((element, ref_key) => {
                                      if (element["doc"] != null) {
                                        return (
                                          <Link
                                            color="inherit"
                                            component={ButtonLink}
                                            key={"text_ref-" + ref_key}
                                            style={{
                                              color: "#f21b42",
                                              textDecorationColor: "#f21b42",
                                            }}
                                            onClick={(e) =>
                                              handleUV(e, element["doc"]["url"])
                                            }
                                          >
                                            {element["text_ref"]}
                                          </Link>
                                        );
                                      } else {
                                        return (
                                          <Link
                                            color="inherit"
                                            component={ButtonLink}
                                            key={"text_ref-" + ref_key}
                                            style={{ textDecoration: "none" }}
                                          >
                                            {element["text_ref"]}
                                          </Link>
                                        );
                                      }
                                    })}
                                  </TableCell>
                                );
                              } else if (typeof row[k] === "object") {
                                return (
                                  <TableCell key={"content-" + key}>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: [
                                          ...new Set(
                                            [].concat.apply([], row[k])
                                          ),
                                        ]
                                          .join("<br>")
                                          .replaceAll("</p>,<p>", "</p><p>"),
                                      }}
                                    />
                                  </TableCell>
                                );
                              } else {
                                return (
                                  <TableCell key={"content-" + key}>
                                    {row[k]}
                                  </TableCell>
                                );
                              }
                            })}
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Tables>
                </TableContainer>
                <Stack
                  spacing={2}
                  margin={2}
                  direction="row"
                  justifyContent="flex-end"
                >
                  <Pagination
                    count={Math.ceil(totalResultsCount / rowsPerPage)}
                    page={page + 1}
                    onChange={handleChangePagePagination}
                  />
                </Stack>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Table;
