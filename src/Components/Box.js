import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./Box.css";

function Box({ title, cases, total, ...props }) {
  return (
    <Card onClick={props.onClick} className="box">
      <CardContent>
        <Typography className="title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="cases">+{cases}</h2>
        <Typography color="textSecondary" className="total">
          Total +{total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Box;
