import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from "@mui/material";

const ConfirmDialog = ({ open, onClose, onConfirm, title = "Xác nhận", content = "Bạn chắc chắn muốn thực hiện hành động này?", loading = false }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Xác nhận"}
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;