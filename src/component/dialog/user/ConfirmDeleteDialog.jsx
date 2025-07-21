import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, title = "Xác nhận xóa", content = "Bạn chắc chắn muốn xóa mục này?" }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography>{content}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={onConfirm} color="error" variant="contained">
                Xóa
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteDialog;