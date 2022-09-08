import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Modal,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Avatar,
} from "@mui/material";

import ResponsiveAppBar from "../NavBar";
import { DocContext } from "./DocumentsApp";
import UVModal from "./UVModal";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";

export default function Documents(props) {
  const { dataSet, pageType } = useContext(DocContext);
  const UVContext = React.createContext({});
  const [manifest, setManifest] = useState(props.url);
  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);
  const [uvOpen, setUVOpen] = useState(false);
  const handleUVOpen = () => setUVOpen(true);
  const handleUVClose = () => setUVOpen(false);

  const ButtonLink = styled(Button)(({ theme }) => ({
    textAlign: "left",
    flexWrap: "wrap",
  }));

  useEffect(() => {
    fetch(manifest)
      .then((response) => response.json())
      .then((response) => {
        setTitle(response.label.none);
        setImage(response.thumbnail[0].id);
      });
  }, [manifest]);

  return (
    <div>
      {/* <ResponsiveAppBar context={DocContext}/> */}
      <Link component={ButtonLink} onClick={handleUVOpen} style={{color: "#f21b42", textDecorationColor: '#f21b42'}}>
        {props.title}
      </Link>
      <UVContext.Provider
        value={{
          manifest,
          setManifest,
          uvOpen,
          setUVOpen,
          handleUVOpen,
          handleUVClose,
        }}
      >
        <UVModal useContext={UVContext} />
      </UVContext.Provider>
    </div>
  );
}
