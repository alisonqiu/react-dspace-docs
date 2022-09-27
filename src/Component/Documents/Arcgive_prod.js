import React, { useRef, useState, useEffect, useLayoutEffect ,useCallback} from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog,TablePagination, CardMedia, Typography, Grid, Link, CircularProgress } from "@mui/material";
import "universalviewer/dist/esm/index.css";
import { init } from "universalviewer";
import InfiniteScroll from "react-infinite-scroll-component";


import ArchiveItem from "./ArchiveItem";

import {
    useWindowSize,
  } from '@react-hook/window-size'
import axios from "axios";
import { SettingsOverscanOutlined } from "@mui/icons-material";
import { alpha } from "@mui/material";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function useUniversalViewer(ref, options) {
    const [uv, setUv] = useState();
  
    useLayoutEffect(() => {
      const currentUv = init(ref.current, options);
      setUv(currentUv);
  
      return () => {
        currentUv.dispose();
      };
    }, []);
  
    return uv;
  }

const UV = ({ manifest, parentWidth }) => {
  const el = useRef();
  const viewer = useUniversalViewer(
    el,
    {
      manifest,
    }
  );
  return <div ref={el} 
          className="uv" 
          style={{
            width: "50vw",
            height: "50vh"
          }}
          />;
};
function curImage(src){
  var arr1 = src.split("medium");
  return arr1[0] + "square" + arr1[1];
}



export default function Archive() {
    const [width, height] = useWindowSize()
    const [manifest, setManifest]= useState({});
    const [open, setOpen] = useState(false);
    const [apiUrl,setapiurl] = useState([])
    console.log("🚀 ~ file: Arcgive_prod.js ~ line 68 ~ Archive ~ apiUrl", apiUrl)
    const [itemData, setData] = useState([])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(16);
    const [total, setTotal] = useState(0)
    
    const [pics, setPics] = useState([]);
    const temp = []

    // const handleChangePage = (event, newPage) => {
    //   setPage(newPage);
    // };
    // const handleChangeRowsPerPage = (event) => {
    //   setRowsPerPage(parseInt(event.target.value, 10));
    //   setPage(0);
    // };

    const fetchData = async () => {
      console.log("🚀 ~ file: Arcgive_prod.js ~ line 97 ~ fetchData ~ fetchData", fetchData)
      var data = new FormData();
      data.append("hierarchical", "False");
      data.append("selected_fields", 'url');
      data.append("results_per_page", 16);
      data.append("results_page", page + 1);
      const res = await fetch('https://voyages3-api.crc.rice.edu/docs/',{
        method: 'POST',
        body: data,
        headers: {'Authorization':AUTH_TOKEN}
      })
      const result = await res.json();
      setapiurl(result)
      setPage(prev => prev+1)
    }


    const handleOpen = (manifest) => {
      setOpen(true);
      setManifest(manifest);
    }
    const handleClose = () => setOpen(false);
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 4,
        // overflow: "scroll",
        maxHeight: 500,
      };

      useEffect(()=>{
        var data = new FormData();
        fetch('https://voyages3-api.crc.rice.edu/docs/',{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        }).then(res=>setTotal(parseInt(res.headers.get("total_results_count"))));
        
      },[])


      useEffect(()=>{
        const fetchData = async () => {
        var data = new FormData();
        data.append("hierarchical", "False");
        data.append("selected_fields", 'url');
        data.append("results_per_page", 16);
        data.append("results_page", page + 1);
        const res = await fetch('https://voyages3-api.crc.rice.edu/docs/',{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        })
        const result = await res.json();
        setapiurl(result)
      }
        fetchData().catch(console.error);
      },[])
      console.log("🚀 ~ file: Arcgive_prod.js ~ line 142 ~ Archive ~ page", page)

      useEffect(() => {
        const fetchData = async ()=> {
          const promises = apiUrl.map(iifUri => {
            return fetch(Object.values(iifUri), {
              method: "GET",
            }).then(res => Promise.resolve(res.json())).then(res => {
              return ({"title": res.label.none[0], "image": curImage(res.thumbnail[0].id),"uri":iifUri.url});
            })
          })
          const response = await Promise.all(promises)
          setData(response)

        }
        fetchData().catch(console.error);
      }, [apiUrl])

    return (
       
       
      <div>
        <Grid  container spacing={{ xs: 2, md: 2, lg:2}} padding={{ xs: 4, md: 3, lg:4 }}>
       
        <InfiniteScroll
        dataLength={apiUrl.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        //https://github.com/ankeetmaini/react-infinite-scroll-component/issues/308


      >
        {apiUrl.map((item,index) => {
          return <ArchiveItem  key={index} iifUrl={item} scrollPosition={window.scrollY} handleOpen={handleOpen} apiUrl = {apiUrl} />
        })}
      </InfiniteScroll>
      </Grid>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <UV manifest={manifest} />
            </Box>
        </Modal>
    </div>

    );
}