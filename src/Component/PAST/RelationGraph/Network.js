import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {PASTContext} from "../PASTApp";
import {CircularProgress} from "@mui/material";
import Graph from "react-graph-vis";
import _ from 'lodash';
import {useWindowSize} from "@react-hook/window-size";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;


export default function Network(props) {
  const {queryData, setOpen, setId} = useContext(PASTContext);
  const [graph, setGraph] = useState(null);
  const [myQueryData, setMyQueryData] = useState({...queryData});
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [width, height] = useWindowSize()
  useEffect(() => {
    // console.log("myQueryData", myQueryData)
    setIsLoading(true)
    const endpoint = (() => {
      switch (myQueryData.type) {
        case "slaves":
          return "past/enslaved/"
        case "enslavers":
          return "past/enslavers/"
      }
    })()
    const targets = (() => {
      switch (myQueryData.type) {
        case "slaves":
          return myQueryData.slaves
        case "enslavers":
          return myQueryData.enslavers
      }
    })()
    const fetchData = async () => {
      const promises = targets.map(target => {
        let selected = new FormData();
        selected.append("id", target.toString());
        selected.append("id", target.toString());
        return fetch(base_url + endpoint, {
          method: "POST",
          body: selected,
          headers: {'Authorization': auth_token}
        }).then(res => res.json()).then(res => res[0])
      })
      const data = await Promise.all(promises)
      setTitle(data.map((item, index) => index === data.length - 1 ?
        (myQueryData.type === "slaves"? item.documented_name : item.principal_alias) :
        (myQueryData.type === "slaves"? item.documented_name : item.principal_alias) + " & "))
      let tmp = {
        nodes: [],
        edges: [],
        addNode: (nodeId, label, type, color) => {
          let existNode = tmp.nodes.find(e => e.id === nodeId)
          if (existNode) {
            existNode.color = color
            existNode.label = label
            existNode.type = type
            return existNode
          } else {
            let newNode = {id: nodeId, label: label, color: color, type: type}
            tmp.nodes.push(newNode)
            return newNode
          }
        },
        link: (fromId, toId, label) => {
          let existLink = tmp.edges.find(edge => edge.id === fromId + "_" + toId || edge.id === toId+"_"+fromId)
          if (existLink) {
            return existLink
          } else {
            let newLink = {from: fromId, to: toId, label: label, id: fromId + "_" + toId}
            tmp.edges.push(newLink)
            return newLink
          }
        }
      };
      setIsLoading(true)
      //enslavers
      if (myQueryData.type === "enslavers") {
        // console.log("data", data)
        data.forEach((item, index) => {
          //self
          const self = tmp.addNode(item.id, item.principal_alias, "enslaver", "#1ee893")
          self.font = {size: height * 0.03}
          // slaves
          item.alias.forEach((alias) => {
            //transaction
            alias.transactions.slice(0, 30).forEach((transaction) => {
              const transactionData = transaction.transaction
              if (transactionData.relation_type.relation_type === "transportation") {
                tmp.addNode(transactionData.voyage, `Voyage: ${transactionData.voyage}`, "voyage", "#f2f7a6")
                tmp.link(transactionData.voyage, item.id, transaction.role.role)
                //enslaved
                transactionData.enslaved_person.forEach(slave => {
                  tmp.addNode(slave.enslaved.id, slave.enslaved.documented_name, "slave", "#ffaca3")
                  tmp.link(slave.enslaved.id, transactionData.voyage, "")
                })
              } else if (transactionData.relation_type.relation_type === "transaction") {
                tmp.addNode(transactionData.id, `transaction: ${transactionData.id}`, "transaction", "#f2f7a6")
                tmp.link(transactionData.id, item.id, transaction.role.role)
                //enslaved
                transactionData.enslaved_person.forEach(slave => {
                  tmp.addNode(slave.enslaved.id, slave.enslaved.documented_name, "slave", "#ffaca3")
                  tmp.link(slave.enslaved.id, transactionData.id, "")
                })
              }
            })
          })
        })
        setGraph(tmp)
        setIsLoading(false)
        // console.log("tmp", tmp)
        return;
      }
      //slave
      data.forEach((item, index) => {
        //self
        const self = tmp.addNode(item.id, item.documented_name, "slave", "#ffaca3")
        self.font = {size: height * 0.03}
        //transaction
        item.transactions.forEach((transaction) => {
          const transactionData = transaction.transaction
          if (transactionData.relation_type.relation_type === "transportation") {
            tmp.addNode(transactionData.voyage.id, `Voyage: ${transactionData.voyage.id}`, "voyage", "#f2f7a6")
            tmp.link(item.id, transactionData.voyage.id, `from ${_.get(transactionData, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "name"], "No Data")} 
        to ${_.get(transactionData, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "No Data")} 
        at ${_.get(transactionData, ["voyage", "voyage_dates", "imp_arrival_at_port_of_dis"], "No Data")}`)
            //enslaver
            const enslavers = _.get(transactionData, ["enslavers"])
            if (enslavers) {
              enslavers.forEach((enslaver) => {
                // console.log("enslaver", enslaver.enslaver_alias.id)
                tmp.addNode(enslaver.enslaver_alias.id, enslaver.enslaver_alias.alias, "enslaver", "#1ee893")
                tmp.link(transactionData.voyage.id, enslaver.enslaver_alias.id, enslaver.role.role)
              })
            }
          } else if (transactionData.relation_type.relation_type === "transaction") {
            tmp.addNode(transactionData.id, `transaction: ${transactionData.id}`, "transaction", "#f2f7a6")
            tmp.link(item.id, transactionData.id, `sold in ${_.get(transactionData, ["place", "geo_location", "name"], "No Data")} 
          for ${_.get(transactionData, ["amount"], "No Data")}
          on ${_.get(transactionData, ["date"], "No Data")}`)
            //enslaver
            const enslavers = _.get(transactionData, ["enslavers"])
            if (enslavers) {
              enslavers.forEach((enslaver) => {
                // console.log("enslaver", enslaver.enslaver_alias.id)
                tmp.addNode(enslaver.enslaver_alias.id, enslaver.enslaver_alias.alias, "enslaver", "#1ee893")
                tmp.link(transactionData.id, enslaver.enslaver_alias.id, enslaver.role.role)
              })
            }
          }
        })
      })
      const fetchData = async () => {
        const promises = data.map(item =>
          item.transactions.map((transaction) => {
            let formdata = new FormData();
            formdata.append("transactions__transaction__id", transaction.transaction.id);
            formdata.append("transactions__transaction__id", transaction.transaction.id);
            const endpoint = "past/enslaved/"
            return fetch(base_url + endpoint, {
              method: 'POST',
              headers: {'Authorization': auth_token},
              body: formdata,
            }).then(response => response.json())
          })
        )

        const slaveOnSameVoyage = await Promise.all(promises.map((promise) => Promise.all(promise)))
        // console.log("slaveOnSameVoyage", slaveOnSameVoyage)
        data.forEach((item, dataIndex) => {
          item.transactions.forEach((transaction, transactionIndex) => {
            slaveOnSameVoyage[dataIndex][transactionIndex].forEach((slave) => {
              // console.log("slave", slave.id)
              tmp.addNode(slave.id, slave.documented_name, "slave", "#ffaca3")
              if (item.id !== slave.id) {
                if (transaction.transaction.relation_type.relation_type === "transportation") {
                  tmp.link(transaction.transaction.voyage.id, slave.id, "peer")
                }else{
                  tmp.link(transaction.transaction.id, slave.id, "peer")
                }
              }
            })
          })
        })
        setGraph(tmp)
        setIsLoading(false)
        // console.log("tmp", tmp)
      }
      fetchData().catch(console.error);
    }
    fetchData().catch(console.error);
  }, [myQueryData])

  const events = {
    doubleClick: function (event) {
      const {nodes: nodeId} = event;
      // console.log("nodeId" ,nodeId)
      const node = graph.nodes.find(e => e.id === nodeId[0])
      switch (node && node.type) {
        case "slave":
          setMyQueryData({
            ...myQueryData,
            type: "slaves",
            slaves: nodeId
          })
          break;
        case "enslaver":
          setMyQueryData({
            ...myQueryData,
            type: "enslavers",
            enslavers: nodeId
          })
          break;
      }
    },

    click: function (event) {
      const {nodes: nodeId} = event;
      const node = graph.nodes.find(e => e.id === nodeId[0])
      // console.log("click", node)
      if(node && node.type === "voyage"){
        setOpen(true)
        setId(nodeId[0])
      }
    }
  };
  useEffect(()=>{
    console.log(height)
    window.addEventListener('resize', ()=>setOption(
      {...options,
        height: (0.75*height).toString(),
        width: (0.95*width).toString(),
    }));
  }, [])

  const [options, setOption] = useState({
    physics: {
      enabled: true,
    },
    height: (0.75*height).toString(),
    width: (0.95*width).toString(),
  });

  return (
    <div>
      <h1>Relation
        between: {title}</h1>
      {/*<Button onClick={()=>console.log("data:", data)}>print data</Button>*/}
      {/*<Button onClick={()=>console.log("graph:", graph)}>print graph</Button>*/}
      {/*<Button onClick={()=>console.log("graph:", myQueryData)}>print myQueryData</Button>*/}
      {/*<Button onClick={()=>console.log("dataSet:", props.dataSet)}>print dataSet</Button>*/}
      {/*<Button onClick={()=>props.setDataSet(1)}>change dataSet</Button>*/}
      {isLoading ?
        <CircularProgress/> :
        <Graph
          graph={graph}
          options={options}
          events={events}
        />}
    </div>
  )
}