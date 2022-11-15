import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog,TablePagination} from "@mui/material";
import "universalviewer/dist/esm/index.css";
import { init } from "universalviewer";
import InfiniteScroll from "react-infinite-scroll-component";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import {
    useWindowSize,
  } from '@react-hook/window-size'
import axios from "axios";
import { SettingsOverscanOutlined } from "@mui/icons-material";
import { alpha } from "@mui/material";

const AUTH_TOKEN = process.env.AD_APP_AUTHTOKEN;
const adurl = "http://127.0.0.1:8000/advertisement/"
const url = 'https://voyages3-api.crc.rice.edu/docs/'
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
                    }}/>;
};
function curImage(src){
  var arr1 = src.split("medium");
  return arr1[0] + "square" + arr1[1];
  
}
export default function Archive(props) {
    const [width, height] = useWindowSize()
    const [manifest, setManifest]= useState({});
    const [open, setOpen] = useState(false);
    const [apiUrl,setapiurl] = useState([])
    const [itemData, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const {filter_obj, set_filter_obj} = props.state;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(16);
    const [total, setTotal] = useState(0)

    const handleOpen = (manifest) => {
      setOpen(true);
      setManifest(manifest)}
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

      // useEffect(()=>{
      //   var data = new FormData();
      //   fetch('https://voyages3-api.crc.rice.edu/docs/',{
      //     method: 'POST',
      //     body: data,
      //     headers: {'Authorization':AUTH_TOKEN}
      //   }).then(res=>setTotal(parseInt(res.headers.get("total_results_count"))));
      // },[])

      const fetchData = async () => {
     

      var data = new FormData();

        data.append("hierarchical", "False");
        
        data.append("results_per_page", rowsPerPage);
        data.append("results_page", page+1);
         for (const property in filter_obj) {
          filter_obj[property].forEach((v) => {
            data.append(property, v);
          })}
       
        const res = await fetch(adurl,{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        })
        const result = await res.json();
        console.log("🚀 ~ file: ArcAd.js ~ line 117 ~ fetchData ~ result", result)
        setapiurl(result)
        setPage(page + 1);
        
        const fetchImage = async ()=> {
          const promises = result.map(item => {
          console.log("🚀 ~ file: ArcAd.js ~ line 133 ~ promises ~ promises",item.dspace_iiif_uri)
            return fetch(item.dspace_iiif_uri, {
              method: "GET",
            }).then(res => {
              return res.json()
            }).then(res => {
            console.log("🚀 ~ file: ArcAd.js ~ line 128 ~ returnfetch ~ res", res)
            var dict = {"title": res.title, "image": curImage(res.thumbnail[0].id),"uri":item.dspace_iiif_uri}

              return dict;
            })
          })
          const response = await Promise.all(promises)
          setData([...itemData, ...response])
          console.log("🚀 total data length after set data", itemData.length)
          
          if(response.length<=0){
          //if(itemData.length>=total){
            
            setHasMore(false)
          }
        
        }
        fetchImage().catch(console.error);
      }

      useEffect(()=>{
        console.log("filter object updated")

        // var data = new FormData();
        // fetch('https://voyages3-api.crc.rice.edu/docs/',{
        //   method: 'POST',
        //   body: data,
        //   headers: {'Authorization':AUTH_TOKEN}
        // }).then(res=>setTotal(parseInt(res.headers.get("total_results_count"))));

        //when filter_obj changes, go back to first page
        // if(filter_obj !== {}){
        // window.location.reload()

        // }
        setPage(0);
        setData([])
        setapiurl( [])
        fetchData()
        // setHasMore(true)
          
        
      }, [filter_obj])




    return (
      <div id="infinite-container" style={{ overflow: 'auto'}}>
      <InfiniteScroll
      dataLength={itemData.length} //This is important field to render the next data
      next={fetchData}
      getScrollParent={()=>document.getElementById('infinite-container')} 
      useWindow={false}

      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          end message
        </p>
      } >


<ImageList sx={{ width: width, height: "99%" }} cols={
              Math.sqrt(rowsPerPage)
              } gap={30} >
     
              {itemData.map((item) => (
                <ImageListItem key={item.image}>
                  <img
                    src={`${item.image}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.title}
                    sx ={{
                      bgcolor: alpha('#549165',0.8)
                    }}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${item.title}`}
                        onClick={() => handleOpen(item.uri.url)}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
              
            </ImageList>
    
    

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

        </InfiniteScroll>
        </div>
    );
}
