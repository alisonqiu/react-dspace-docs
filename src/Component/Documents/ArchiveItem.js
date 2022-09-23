import React, { useEffect,useRef,useCallback} from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog,TablePagination, CardMedia, Typography, Grid, Link } from "@mui/material";
import {
  LazyLoadImage,
  trackWindowScroll
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import Loading from "./bluebg.jpg";
import { at } from "lodash";

function curImage(src){
  var arr1 = src.split("medium");
  return arr1[0] + "square" + arr1[1];
}

function ArchiveItem(props){
      const { iifUrl, scrollPosition, handleOpen,setPage,page} = props
      console.log("🚀 ~ file: ArchiveItem.js ~ line 17 ~ ArchiveItem ~ page", page)
      const [image, setImage] = React.useState();
      const [atBottom, setAtBottom] = React.useState(false);
      const [title, setTitle] = React.useState();
      const [uri, setUri] = React.useState();

      window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            console.log(window.innerHeight)
            setAtBottom(prev => !prev)
        }
    };

    useEffect(() => {
      if (atBottom){
        setPage(prev => prev+1)
      }
     
    }, [atBottom])


      useEffect(() => {
        fetch(iifUrl.url).then(res => Promise.resolve(res.json())).then(res => {
          setTitle(res.label.none[0]);
          setImage(curImage(res.thumbnail[0].id));
          setUri(iifUrl.url);
        });
      }, [])

      return(
      <Grid item xs={12} sm={6} md={4} lg={3} width="40vh" >
      <Box sx={{ position: 'relative' }} >
        <LazyLoadImage
          key={image}
          alt={"documents_".concat(title)}
          height="100%"
          effect="opacity"
          scrollPosition={scrollPosition}
          src={image}
          width="100%"
          placeholder={<img src={Loading} alt="logo"/>}
          threshold={500}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height:{xs:"2em", sm:"2.7em"},
            // bgcolor: 'rgba(0, 0, 0, 0.54)',
            bgcolor: "rgba(123,139,111, 0.7)",
            // padding: '10px',
            // py: {xs: 0, md: '0.4em', lg:'0.2em'},
            mb:"0.25em",
            fontStyle: 'italic',
            textAlign: "center",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <Typography variant="body3"color="#FFFFFF" component={Link} underline="hover"> */}
            <Link href="#" underline="hover" variant="body3" color="#FFFFFF" onClick={() => handleOpen(uri)}>{title}</Link>
          {/* </Typography> */}
        </Box>
      </Box>
      </Grid>
      )
}

export default trackWindowScroll(ArchiveItem);