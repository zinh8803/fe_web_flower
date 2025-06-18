import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderUserdetail } from "../../services/userService";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Divider } from "@mui/material";

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        getOrderUserdetail(token, id)
            .then(res => setOrder(res.data.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Typography>Đang tải...</Typography>;
    if (!order) return <Typography>Không tìm thấy đơn hàng.</Typography>;

    return (
        <Box maxWidth="1000px" mx="auto" mt={4}>
            <Typography variant="h5" fontWeight={700} mb={2}>
                Chi tiết đơn hàng #{order.id}
            </Typography>
            <Box mb={2}>
                <Typography><b>Khách hàng:</b> {order.name}</Typography>
                <Typography><b>Email:</b> {order.email}</Typography>
                <Typography><b>Điện thoại:</b> {order.phone}</Typography>
                <Typography><b>Địa chỉ:</b> {order.address}</Typography>
                <Typography><b>Ghi chú:</b> {order.note}</Typography>
                <Typography><b>Trạng thái:</b> {order.status}</Typography>
                <Typography><b>Ngày mua:</b> {order.buy_at}</Typography>
                <Typography><b>Phương thức thanh toán:</b> {order.payment_method}</Typography>
                <Typography><b>Mã giảm giá:</b> {order.discount ? order.discount.name : "Không có"}</Typography>
                <Typography><b>Giá trị mã giảm giá:</b> {order.discount ? `${order.discount.value}đ` : "0đ"}</Typography>
                <Typography><b>Tổng tiền:</b> <span style={{ color: "red", fontWeight: 700 }}>{order.total_price}đ</span></Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>
                Sản phẩm trong đơn hàng
            </Typography>
            <Grid container spacing={2}>
                {order.order_details.map(detail => (
                    <Grid item xs={12} sm={6} md={4} key={detail.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="160"
                                image={detail.product.image_url}
                                alt={detail.product.name}
                            />
                            <CardContent>
                                <Typography fontWeight={600}>{detail.product.name}</Typography>
                                <Typography>Số lượng: {detail.quantity}</Typography>
                                <Typography>Đơn giá: {Number(detail.product_price).toLocaleString()}đ</Typography>
                                <Typography color="error" fontWeight={700}>
                                    Thành tiền: {Number(detail.subtotal).toLocaleString()}đ
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default OrderDetail;