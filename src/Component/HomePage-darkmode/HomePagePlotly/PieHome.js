import React, { Component, PureComponent, useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import {
  donut_value_vars,
  donut_name_vars,
} from "../../VoyagePage/Result/vars";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization - Pie",
  date: "June 14, Tue",
  description:
    "The sobriquet was first applied around 1879. While it was not intended as flattering, it washardly inappropriate. The Academicians at whom it was aimed had worked and socialized in NewYork, the Hudson's port city, and had painted the river and its shores with varying frequency.Most important, perhaps, was that they had all maintained with a certain fidelity a manner oftechnique and composition consistent with those of America's first popular landscape artist,Thomas Cole, who built a career painting the Catskill Mountain scenery bordering the HudsonRiver. A possible implication in the term applied to the group of landscapists was that many ofthem had, like Cole, lived on or near the banks of the Hudson. Further, the river had long servedas the principal route to other sketching grounds favored by the Academicians, particularly theAdirondacks and the mountains of Vermont and New Hampshire.different ways.",
};

function PieComponent() {
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: donut_name_vars[0],
    value: donut_value_vars[1],
  });
  const [aggregation, setAgg] = React.useState("sum");
  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("agg_fn", "sum");
    data.append("cachename", "voyage_export");

    axios
      .post("/voyage/groupby", (data = data))
      .then(function (response) {
        setarrx(Object.keys(response.data[value]));
        setarry(Object.values(response.data[value]));
        console.log(plot_value);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  const navigate = useNavigate();
  const GotoVoyagePage = () => {
    navigate("/");
  };



  return (
    <Card sx={{ display: "flex" }} style={{ background: 'transparent', boxShadow: 'none'}}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Plot
            data={[
              {
                labels: plot_field,
                values: plot_value,
                type: "pie",
                mode: "lines+markers",
              },
            ]}
            layout={{ width: 800, height: 600, title: "Pie Plot" , paper_bgcolor: "rgba(0,0,0,0)", font:{color: "rgba(255,255,255,1)"}}}
            config={{ responsive: true }}
          />
        </CardContent>
      </Box>
      <Box sx={{ boxShadow: 4, margin: 2, padding:2, borderRadius: '10px'}}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <div>
            <CardContent>
              <Button
                variant="text"
                style={{ fontSize: "24px" }}
                component={Link}
                to="/Pie"
              >
                Data Visualization - Pie Charts
              </Button>
              <Typography variant="subtitle1" color="textSecondary">
                {featuredPosts.date}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {featuredPosts.description}
              </Typography>
              <Button variant="text" type="button" onClick={GotoVoyagePage}>
                Continue reading...
              </Button>
            </CardContent>
          </div>
        </CardContent>
      </Box>
    </Card>
  );
}

export default PieComponent;