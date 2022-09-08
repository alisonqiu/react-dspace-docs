import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import {Box, Button, Card, CardContent, Typography,Grid, Popover, CircularProgress} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {
  useWindowSize,
} from '@react-hook/window-size'
import Story from "../../PAST/RelationGraph/Story";
import {PASTContext} from "../../PAST/PASTApp";
import _ from 'lodash';
import EastIcon from '@mui/icons-material/East';
import {sankey, sankeyLeft, sankeyLinkHorizontal} from "d3-sankey";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization: Sankey Diagrams",
  date: "July 7, 2022",
  description:
    "The Sankey Diagrams shows relationships between several enslaved people. For example, this sankey shows connections between Henry, Patrick and Brown, Cesar, who are on the same voyage from Alexandria to New Orleans. Click through to study more relationships among enslavers (shipper, consigner), enslaved people, and information about their voyages.",
};

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

function Sankey(props) {
  const [width, height] = useWindowSize();
  const {setOpen, setInfo, setId, modal} = useContext(PASTContext);
  const [graph, setGraph] = useState(null);
  const [CANVAS_WIDTH, setCANVAS_WIDTH] = useState(700);
  const [CANVAS_HEIGHT, setCANVAS_HEIGHT] = useState(450);
  const [NODE_WIDTH, setNODE_WIDTH] = useState(140);
  const MIN_NODE_HEIGHT = 80;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [queryData, setQueryData] = React.useState({
    slaves: [500002, 500004],
    type: "slaves",
    enslavers:[]
  })

  const getEndpoint = (typeForTable) => {
    switch (typeForTable) {
      case "slaves": return "past/enslaved/"
      case "enslavers": return "past/enslavers/"
    }
  }
  // const [open, setOpen] = React.useState(false);
  const handleOpen = (event, info, modal) => {
    if (modal) {
      // console.log("voyage id",info)
      //setOpen(true);
      //setId(info);
      // setId(info.id);
    }
  };
  // const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popOpen, setPopOpen] = React.useState(null);
  const handlePopoverOpen = (event, node) => {
    setAnchorEl(event.currentTarget);
    setPopOpen(node.id);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopOpen(null);
  };

  const [anchorElclick, setAnchorElclick] = React.useState(null);
  const [popOpenclick, setPopOpenclick] = React.useState(null);
  const handleClick = (event, node) => {
    setAnchorElclick(event.currentTarget);
    setPopOpenclick(node.id)
  };
  const handleClose = () => {
    setAnchorElclick(null);
    setPopOpenclick(null)
  };

  useEffect(() => {
    setIsLoading(true)
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
        }).then(res => res.json()).then(
          res => res[0])
      })
      const response = await Promise.all(promises)
      setData(response)
      setIsLoading(false)
    }
    fetchData().catch(console.error);
  }, [queryData])

  useEffect(() => {
    let new_CANVAS_WIDTH = width>800 ? width*0.50:width*0.8;
    let new_CANVAS_HEIGHT = CANVAS_HEIGHT;
    let NODE_WIDTH = Math.max(120, Math.round(new_CANVAS_WIDTH / 3 - 80));
    let transLength = 0;
    let enslaverLength = 0;
    let nodes = [];
    let links = [];
    if(isLoading) return;

    for (var i = 0; i < data.length; i++) {
      nodes.push({
        id: data[i].id,
        name: data[i].documented_name,
        age: data[i].age,
        height: data[i].height,
        type: "enslaved"
      });
      transLength = transLength + data[i].transactions.length;
      for (var j = 0; j < data[i].transactions.length; j++) {
        var transaction_id;
        var voyage_id;
        switch (data[i].transactions[j].transaction.voyage) {
          case null:
            transaction_id = data[i].transactions[j].transaction.id;
            // place_name = data[i].transactions[j].transaction.place.geo_location.name;
            voyage_id = null;

            break;
          default:
            transaction_id = data[i].transactions[j].transaction.voyage.id;
            voyage_id = transaction_id;

            break;
        }
        if (nodes.findIndex(x =>
          x.id === transaction_id &&
          x.name === data[i].transactions[j].transaction.relation_type.relation_type &&
          x.amount === data[i].transactions[j].transaction.amount &&
          x.voyage_id === voyage_id
        ) === -1) {
          nodes.push({
            id: transaction_id,
            voyage_id: voyage_id,
            name: _.get(data[i].transactions[j], ["transaction", "relation_type", "relation_type"], null),
            amount: _.get(data[i].transactions[j], ["transaction", "amount"], null),
            place: _.get(data[i].transactions[j], ["transaction", "place", "geo_location", "name"], null),
            full_ref: _.get(data[i].transactions[j], ["transaction", "source", "full_ref"], null),
            place_purchase: _.get(data[i].transactions[j], ["transaction", "voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "name"], null),
            place_dis: _.get(data[i].transactions[j], ["transaction", "voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], null),
            date: _.get(data[i].transactions[j], ["transaction", "date"], null),
            year: _.get(data[i].transactions[j], ["transaction", "voyage", "voyage_dates", "imp_arrival_at_port_of_dis_yyyy"], null),
            type: "transaction",
          });
        }
        if (links.findIndex(x =>
          x.source === nodes.findIndex(x => x.id === data[i].id) &&
          x.target === nodes.findIndex(x => x.id === transaction_id &&
            x.name === data[i].transactions[j].transaction.relation_type.relation_type
          )) === -1) {
          links.push({
            source: nodes.findIndex(x => x.id === data[i].id),
            target: nodes.findIndex(x => x.id === transaction_id &&
              x.name === data[i].transactions[j].transaction.relation_type.relation_type),
            color: "#1e3162",
            info: "",
            value: 5
          })
        }
        enslaverLength = enslaverLength + data[i].transactions[j].transaction.enslavers.length;
        for (var z = 0; z < data[i].transactions[j].transaction.enslavers.length; z++) {
          if (nodes.findIndex(x =>
            x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id
          ) === -1) {
            nodes.push({
              id: data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id,
              name: data[i].transactions[j].transaction.enslavers[z].enslaver_alias.alias,
              type: "enslaver"
            });
          }
          if (links.findIndex(x =>
            x.source === nodes.findIndex(x => x.id === transaction_id &&
              x.name === data[i].transactions[j].transaction.relation_type.relation_type) &&
            x.target === nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id) &&
            x.info === data[i].transactions[j].transaction.enslavers[z].role.role
          ) === -1) {
            var link_color;
            switch (data[i].transactions[j].transaction.enslavers[z].role.id) {
              case 1:
                link_color = "#53d4b6";
                break;
              case 2:
                link_color = "#e89a4d";
                break;
              case 3:
                link_color = "#7a8fa1";
                break;
              case 4:
                link_color = "#d188c2";
                break;
              case 5:
                link_color = "#a2e66e";
                break;
              case 6:
                link_color = "#1aa6d9";
                break;
              case 7:
                link_color = "#fcda14";
                break;
              default:
                link_color = "#1e3162";
                break;
            }
            links.push({
              source: nodes.findIndex(x => x.id === transaction_id &&
                x.name === data[i].transactions[j].transaction.relation_type.relation_type),
              target: nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id),
              color: link_color,
              info: data[i].transactions[j].transaction.enslavers[z].role.role,
              value: 5
            })
          }
        }
      }
    }

    nodes.forEach((node) => {
      const result = [];
      var voyagemodal = true;
      if (node.type === "enslaved" && queryData.type === "slaves") {
        result.push(
          <table>
          <tbody>
          <tr>
            <th>Age:</th>
            <td>{node.age}</td>
          </tr>
          <tr>
            <th>Height:</th>
            <td>{node.height}</td>
          </tr>
          </tbody>
          </table>)
      }
      if (node.type === "transaction") {
        if (node.voyage_id === null) {
          voyagemodal = false;
          result.push(
            <table>
            <tbody>
            <tr>
              <th>Type:</th>
              <td>{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</td>
            </tr>
            <tr>
              <th>Amount:</th>
              <td>{node.amount}</td>
            </tr>
            <tr>
              <th>Source:</th>
              <td>{node.full_ref}</td>
            </tr>
            <tr>
              <th>Place:</th>
              <td>{node.place}</td>
            </tr>
            <tr>
              <th>Date:</th>
              <td>{node.date}</td>
            </tr>
            </tbody>
            </table>
          );
        } else {
          // console.log(node.voyage_id)
          node.voyagebutton = <Button size="small" onClick={(event) => handleOpen(event, node.voyage_id, voyagemodal)}>Voyage
            id:{node.voyage_id}</Button>
          // console.log(node.voyage_id)
          if (queryData.type === "slaves") {
            result.push(
              <table>
              <tbody>
              <tr>
                <th>Type:</th>
                <td>{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</td>
              </tr>
              <tr>
                <th>Place:</th>
                <td><Grid container direction="row" alignItems="center">{node.place_purchase}<EastIcon
                  fontSize="small"/>{node.place_dis}</Grid></td>
              </tr>
              <tr>
                <th>Year:</th>
                <td>{node.year}</td>
              </tr>
              </tbody>
              </table>
            );
          }  
        }
      }


      node.information = result;
      // console.log(node.id,node.information)
    })

    new_CANVAS_HEIGHT = Math.max(data.length, transLength, enslaverLength) * MIN_NODE_HEIGHT;

    setCANVAS_HEIGHT(new_CANVAS_HEIGHT);
    setCANVAS_WIDTH(new_CANVAS_WIDTH);
    //setCANVAS_WIDTH(new_CANVAS_WIDTH);
    const tmpGraph = sankey()
      .nodeAlign(sankeyLeft)
      .nodeWidth(NODE_WIDTH)
      // .nodeheight(40)
      .extent([
        [15, 15],
        [new_CANVAS_WIDTH+15, new_CANVAS_HEIGHT+15]
      ])({nodes, links});
    setGraph(tmpGraph)
  }, [data, width]);

  function renderStory(node) {
    // if(node.type === "enslaved")
    // console.log("hover node", data.find((slave)=> slave.id === node.id))
    // console.log("renderStory")
    switch (node.type) {
      case "enslaved":
        return <Card sx={{flexGrow: 1, width: 400}}><Story target={data.find((slave) => slave.id === node.id)}/></Card>
      case "transaction":
        return "TRANSACTION"
      case "enslaver":
        return "ENSLAVER"
      default:
        return ""
    }

  }

  var enslaved = []
  data.forEach((each) => {
    if(queryData.type === "enslavers"){
      enslaved.push(each.principal_alias+" ")
    }
    else{
      enslaved.push(each.documented_name + " ")
    }
  })
  return (
    <div>
      <h1>Connections for {enslaved}</h1>
      {/* <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <Button onClick={()=>console.log("nodes:", graph.nodes)}>print nodes</Button>
      <Button onClick={()=>console.log("links:", graph.links)}>print links</Button>
      <Button onClick={()=>console.log("graph:", graph)}>print graph</Button> */}
      <br/>
      {!graph ?
        <CircularProgress/> :

        // graph === "enslavers" ? "this is enslavers" :

          <svg
            className="canvas"
            width={CANVAS_WIDTH + 30}
            height={CANVAS_HEIGHT + 30}
          >
            {graph.nodes.map((node) => {
              return (
                <>
                  <rect
                    key={`sankey-node-${node.index}`}
                    x={node.x0}
                    y={node.y0}
                    width={node.x1 - node.x0}
                    height={node.y1 - node.y0}
                    fill="white"/>
                  <foreignObject
                    key={`sankey-node-text-${node.index}`}
                    className="node"
                    x={node.x0}
                    y={node.y0}
                    width={node.x1 - node.x0}
                    height={node.y1 - node.y0}
                  >
                    <div className="node-name">
                      <Box
                        onClick={(e) => {
                          handleClick(e, node)
                        }}
                        // onMouseEnter={()=>{console.log("hover enter", node)}}
                        onMouseEnter={(e) => {
                          handlePopoverOpen(e, node)
                        }}
                        onMouseLeave={handlePopoverClose}
                      >
                        <Typography align="center">{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</Typography>
                        <Typography align="center">{node.voyagebutton}</Typography>
                      </Box>
                      <Popover
                        // id={`sankey-node-text-${node.index}`}
                        open={popOpenclick === node.id && node.type === "enslaved"}
                        anchorEl={anchorElclick}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left"
                        }}
                        onClose={handleClose}
                      >
                        {renderStory(node)}
                      </Popover>
                      
                      <Popover
                        id={`sankey-node-text-${node.index}`}
                        sx={{
                          pointerEvents: 'none',
                        }}
                        open={popOpen === node.id && node.type != "enslaver" && 
                              (queryData.type === "enslavers" ? node.type != "enslaved" && node.name != "transportation":true)}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                      >
                        {node.information}
                      </Popover>
                    </div>
                  </foreignObject>
                </>
              )
            })}
            {graph.links.map((link) => {
              return (
                <g key={`sankey-node-${link.index}`}>
                  <path
                    id={`sankey-link-${link.index}`}
                    key={`sankey-link-${link.index}`}
                    className="link"
                    d={sankeyLinkHorizontal()(link)}
                    fill="none"
                    stroke={link.color}
                    opacity="0.5"
                    strokeWidth="5"
                  />
                  <text fontSize="15" fill={link.color} fontWeight="bold" fontFamily="arial">
                    <textPath href={`#sankey-link-${link.index}`}
                              startOffset="50%"
                              textAnchor="middle">
                      {link.info}
                    </textPath>
                  </text>
                </g>
              )
            })}
          </svg>
      }
    </div>
  )
}





function SankeyHome() {
  const [width, height] = useWindowSize()

  return (
    <div>
      <Card sx={{display: "flex"}} style={{background: 'transparent', boxShadow: 'none'}}>
        <Grid container>
          {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}> */}
          <Grid item sx={{width:"60%"}}>
          {/* <Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}> */}
            <CardContent sx={{flex: "1 0 auto"}}>
              <Sankey />
            </CardContent>
          </Grid>
          <Grid item sx={{maxWidth: width>800 ? "40%": "100%"}}>
            <Box sx={{height:height*0.8,boxShadow: 4, margin: 2, padding:2, borderRadius: '10px', overflow: "hidden", overflowY: "scroll"}} style={{backgroundColor: "#f1f1f1"}}>
              <CardContent sx={{flex: "1 0 auto"}}>
                <Button
                  variant="text"
                  style={{fontSize: "24px"}}
                  component={Link}
                  to="past"
                >
                Data Visualization - Sankey Diagrams
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
        </Grid>
      </Card>
    </div>
  );
}

export default SankeyHome;