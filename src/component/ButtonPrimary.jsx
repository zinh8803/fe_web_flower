import React from "react";
import { Button } from "@mui/material";

const ButtonPrimary = ({ children, ...props }) => {
    return (
        <Button variant="contained" color="primary" {...props}>
            {children}
        </Button>
    );
};

export default ButtonPrimary;
