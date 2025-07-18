import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderUserdetail } from "../../services/userService";
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from "@mui/material";
import Breadcrumb from "../../component/breadcrumb/Breadcrumb";

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Chi tiết đơn hàng';
        const token = localStorage.getItem("token");
        getOrderUserdetail(token, id)
            .then(res => setOrder(res.data.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
        </Box>)
    if (!order) return <Typography>Không tìm thấy đơn hàng.</Typography>;

    return (
        <Box maxWidth="1450px" mx="auto" mt={4}>
            <Breadcrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Lịch sử đơn hàng", href: "/orders/history" },
                    { label: "Chi tiết đơn hàng" }
                ]}
            />
            <Typography variant="h5" fontWeight={700} mb={2}>
                Chi tiết đơn hàng #{order.order_code}
            </Typography>
            <Box mb={2} display="flex" flexWrap="wrap" gap={4}>
                <Box flex={1} minWidth={280}>
                    <Typography><b>Khách hàng:</b> {order.name}</Typography>
                    <Typography><b>Email:</b> {order.email}</Typography>
                    <Typography><b>Điện thoại:</b> {order.phone}</Typography>
                    <Typography><b>Địa chỉ:</b> {order.address}</Typography>
                    <Typography><b>Ghi chú:</b> {order.note}</Typography>
                    <Typography><b>Trạng thái:</b> {order.status}</Typography>
                </Box>
                <Box flex={1} minWidth={280}>
                    <Typography><b>Ngày mua:</b> {order.buy_at}</Typography>
                    <Typography><b>Phương thức thanh toán:</b> {order.payment_method}</Typography>
                    <Typography>
                        <b>Mã giảm giá:</b> {order.discount ? order.discount.name : "Không có"}
                        {order.discount && (
                            <>
                                <br />
                                <b>Giá trị mã giảm giá:</b>{" "}
                                {order.discount.type === "fixed"
                                    ? `${Number(order.discount.value).toLocaleString()}đ`
                                    : order.discount.type === "percent"
                                        ? `${order.discount.value}%`
                                        : "0đ"}
                            </>
                        )}
                    </Typography>
                    <Typography>
                        <b>Tổng tiền:</b>{" "}
                        <span style={{ color: "red", fontWeight: 700 }}>
                            {Number(order.total_price).toLocaleString()}đ
                        </span>
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>
                Sản phẩm trong đơn hàng
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Kích thước</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Thành tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.order_details.map(detail => (
                            <TableRow key={detail.id}>
                                <TableCell>
                                    {detail.product?.image_url ? (
                                        <img
                                            src={detail.product.image_url}
                                            alt={detail.product.name}
                                            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                                        />
                                    ) : (
                                        <span style={{ color: "#ccc" }}>Không có ảnh</span>
                                    )}
                                </TableCell>
                                <TableCell>{detail.product?.name}</TableCell>
                                <TableCell>
                                    {detail.product_size?.size ? detail.product_size.size : ""}
                                </TableCell>
                                <TableCell>{detail.quantity}</TableCell>
                                <TableCell>
                                    <span style={{ color: "red", fontWeight: 700 }}>
                                        {Number(detail.subtotal).toLocaleString()}đ
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrderDetail;