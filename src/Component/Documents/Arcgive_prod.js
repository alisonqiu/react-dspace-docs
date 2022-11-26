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

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
const adurl = "http://127.0.0.1:8000/advertisement/"
//const url = 'https://voyages3-api.crc.rice.edu/docs/'
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
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    var [page, setPage] = React.useState(0);
    const [apiUrl,setapiurl] = React.useState([])
    const [itemData, setData] = React.useState([])
    const [showImage,setShowImage] = React.useState(true)

    //from enslaved
    const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [pagination, setPagination] = useState({
    currPage: 0,
    rowsPerPage: 16,
    totalRows: 0,
  });


    const {filter_obj, set_filter_obj,
          //page, setPage,
          // apiUrl,setapiurl,
          // itemData, setData,
          //showImage,setShowImage
        } = props.state;

 

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
        maxHeight: 500,
      };

      // useEffect(()=>{
      //   var data = new FormData();
      //   fetch('https://voyages3-api.crc.rice.edu/docs/',{
      //     method: 'POST',
      //     body: data,
      //     headers: {'Authorization':AUTH_TOKEN}
      //   }).then(res=>setTotal(parseInt(res.headers.get("total_results_count"))));
      //   fetchData()
      // },[])


      

      // const fetchData = async () => {
      //   console.log("insdie fetchData" )
      //   var data = new FormData();
      //   data.append("hierarchical", "False");
          
      //   data.append("selected_fields", 'url');
      //   data.append("results_per_page", 16);
        
      //   data.append("results_page", page+1);
      //   console.log("results_page page+1: ",page+1)
     

      //    for (const property in filter_obj) {
      //     filter_obj[property].forEach((v) => {
      //       data.append(property, v);
      //     })}
       
      //   const res = await fetch(url,{
      //     method: 'POST',
      //     body: data,
      //     headers: {'Authorization':AUTH_TOKEN}
      //   })
      //   const result = await res.json();
      //   setapiurl(result)
      //   setPage(page + 1);
        
      //   const fetchImage = async ()=> {
      //     const promises = result.map(uri => {
      //       return fetch(Object.values(uri), {
      //         method: "GET",
      //       }).then(res => {
      //         return res.json()
      //       }).then(res => {
      //         //console.log(uri,"🚀 ~ file: Arcgive_prod.js ~ line 130 ~ returnfetch ~ res", res)
      //         var dict = {"title": res.label.none[0], "image": curImage(res.thumbnail[0].id),"uri":uri}

      //         return dict;
      //       })
      //     })
      //     const response = await Promise.all(promises)
      //     setData([...itemData, ...response])
      //     if(response.length<=0){
            
      //       setHasMore(false)
      //       console.log("🚀 has more is false")
      //     }
        
      //   }
      //   fetchImage().catch(console.error);
      // }


        const fetchData2 = async ()=> {
          setIsLoading(true);
          setapiurl([]);
          let queryData = new FormData();
          queryData.append("hierarchical", "False");
          queryData.append("results_page", pagination.currPage + 1);
      //   queryData.append("selected_fields", 'url');
          queryData.append("results_per_page", pagination.rowsPerPage);
          
          for (const property in filter_obj) {
            filter_obj[property].forEach((v) => {
              queryData.append(property, v);
            });
          }
          
          axios.post("/", queryData).then((res) => {
            console.log("🚀 ~ file: Arcgive_prod.js ~ line 185 ~ axios.post ~ res", res)
            setPagination({
              ...pagination,
              totalRows: Number(res.headers.total_results_count),
            });
            return res.json()
          }).then((result)=>{
            console.log('result: ', result)
            setapiurl(result.data.url)
        
        const fetchImage = async ()=> {
          const promises = result.map(uri => {
            return fetch(uri, {
              method: "GET",
            }).then(res => {
              return res.json()
            }).then(res => {
              //console.log(uri,"🚀 ~ file: Arcgive_prod.js ~ line 130 ~ returnfetch ~ res", res)
              var dict = {"title": res.label.none[0], "image": curImage(res.thumbnail[0].id),"uri":uri}

              return dict;
            })
          })
          const response = await Promise.all(promises)
          setData([...itemData, ...response])
          if(response.length<=0){
            
            setHasMore(false)
            console.log("🚀 has more is false")
          }
        
        }
        fetchImage().then(
            setIsLoading(false)
        ).catch(console.error);
          })
  
          
      
          }


        
        





     

      React.useEffect(()=>{
      console.log('filter obj changed...')
        fetchData2()
          
        
      }, [
        pagination.currPage,
        pagination.rowsPerPage,
        filter_obj])


      


    return (
      <div id="infinite-container" style={{ overflow: 'auto'}}>
  
      <InfiniteScroll
      dataLength={itemData.length} //This is important field to render the next data
      next={fetchData2}
      getScrollParent={()=>document.getElementById('infinite-container')} 
      useWindow={false}

      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          end message
        </p>
      } 
      
      >

{showImage? 
 <ImageList sx={{ width: width, height: "99%" }} cols={
  Math.sqrt(16)
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
: <h1>'loading'</h1>}
         
    
    

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
