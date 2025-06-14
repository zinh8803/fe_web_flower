import { Box } from "@mui/material";
import React from "react";

const NotFound = () => {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                color: '#333'
            }}
        >
            <h1>404 - Page Not Found</h1>
            <p>trang không tồn tại.</p>
        </Box>
    );
};

export default NotFound;
