import {
    Container,
    Slider,
    IconButton,
    Button,
    Checkbox,
    FormControlLabel,
    ListItem,
    Grid,
    List,
    ListItemText,
    Card, CardContent, CardHeader, Box, Paper, Chip, TextField, Menu, Typography//, MenuItem
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ArrowRightAlt';
import ChevronRightIcon from '@mui/icons-material/ArrowRightAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useQuery } from 'react-query'
import * as React from 'react';
import { MenuItem } from '@mui/material';
import { NestedMenuItem } from './NestedMenuItem'
import { AppContext } from "./Filter";
import { autocomplete_text_fields } from './var'

import { useContext } from "react";
import { VoyageContext } from "../VoyageApp";
import { columnOptions } from '../Result/Table/tableVars';

export const MenuContext = React.createContext();

function Cascading(props) {

    const [menuPosition, setMenuPosition] = React.useState(null);
    const [option, setOption] = React.useState('');
    const { labels, setLabels } = React.useContext(AppContext)
    //add end point
    const { options_flat, search_object, nested_tree } = useContext(props.context);     // <--------- CONTEXT

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const menuName = props.menuName;
    // const buttonName = props.button;

    // var render = menuName === "" ? options_tree : options_tree[menuName];

    function isChildren(key) {
        if (key) return true
        else return false
    }

    function isLast(node) {
        return node === null
    }

    function containsOnly(node) {
        if (Object.keys(node).length === 1)
            return true;
        return false;
    }

    const handleOptionClick = (option, type, flatlabel) => {
        handleClose();
        setOption(option);

        if (!labels.some(e => e.option == option)) {
            setLabels([...labels, { option: option, type: type, label: flatlabel }])
        }
        else
            alert("The variable has been selected.")

    }

    const renderTree = (nodes, name) => {
        return (
            Object.keys(nodes).map((key) =>
                isChildren(key)
                    ? isLast(nodes[key])
                        // ? containsOnly(nodes[key])
                        ? <MenuItem value={key} key={key} onClick={() => { handleOptionClick(key, options_flat[key].type, options_flat[key].flatlabel) }}>
                            {options_flat[key].flatlabel}
                        </MenuItem>
                        // : null
                        : containsOnly(nodes[key])
                            ? renderTree(nodes[key], key)
                            // ? null
                            : <NestedMenuItem
                                key={key}
                                // label={options_flat[nameConcat(name,key)].label}
                                label={options_flat[key].flatlabel}
                                parentMenuOpen={open}
                                onClick={handleClose}
                            >
                                {renderTree(nodes[key], key)}
                            </NestedMenuItem>
                    : null
            )
        )
    };


    return (
        // <Container>
        // <Grid container >
        <Grid item>
            {Object.keys(nested_tree[menuName]).length > 1 ?
                <TreeView
                    aria-label="option menu"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    <Button
                        variant="text"
                        onClick={handleClick}
                        style={{ maxWidth: '280px', maxHeight: '30px', color: "#fff" }}
                    >
                        {options_flat[menuName].flatlabel}
                    </Button>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        {/*<Button onClick={()=>console.log("render:", render)}>print render</Button>*/}
                        {renderTree(nested_tree[menuName], "")}
                    </Menu>
                </TreeView>
                : <Button
                    variant="text"
                    onClick={() => handleOptionClick(menuName, options_flat[menuName].type, options_flat[menuName].flatlabel)}
                    style={{ maxWidth: '280px', maxHeight: '30px', color: "#fff" }}
                >
                    {options_flat[menuName].flatlabel}
                </Button>
            }
        </Grid>
        // </Grid>
        // </Container>
    );
}

export default Cascading;
