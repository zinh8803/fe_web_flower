import React, { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip,
    CircularProgress, List, ListItem, ListItemText, Pagination, TextField, Button
} from "@mui/material";
import { searchStockWarning } from "../../services/productService";

const StockProductAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const fetchData = (q, p) => {
        setLoading(true);
        searchStockWarning(q, p)
            .then(res => {
                const rawData = res.data?.data || [];
                const grouped = rawData.reduce((acc, item) => {
                    const existingProduct = acc.find(p => p.product_id === item.product_id);
                    if (existingProduct) {
                        existingProduct.sizes.push({
                            size: item.size,
                            max_quantity: item.max_quantity,
                            limiting_flower: item.limiting_flower,
                            warning: item.warning
                        });
                    } else {
                        acc.push({
                            product_id: item.product_id,
                            product_image: item.product_image,
                            product_name: item.product_name,
                            sizes: [{
                                size: item.size,
                                max_quantity: item.max_quantity,
                                limiting_flower: item.limiting_flower,
                                warning: item.warning
                            }]
                        });
                    }
                    return acc;
                }, []);
                setData(grouped);
                setLastPage(res.data?.last_page || 1);
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData(search, page);
        // eslint-disable-next-line
    }, [search, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchValue);
    };

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>Tồn kho sản phẩm hôm nay</Typography>
            <Box mb={2} component="form" onSubmit={handleSearch} display="flex" gap={2}>
                <TextField
                    label="Tìm kiếm sản phẩm"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    size="small"
                />
                <Button type="submit" variant="contained">Tìm kiếm</Button>
            </Box>
            {loading ? <CircularProgress /> : (
                <>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Kích thước & Tồn kho</TableCell>
                                <TableCell>Hoa gần hết</TableCell>
                                <TableCell>Cảnh báo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(data || []).map((product, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                                    <TableCell>
                                        <img src={product.product_image} alt={product.product_name} width={50} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold">
                                            {product.product_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <List dense>
                                            {product.sizes.map((size, sizeIdx) => (
                                                <ListItem key={sizeIdx} disablePadding>
                                                    <ListItemText
                                                        primary={`${size.size}: ${size.max_quantity} sản phẩm`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </TableCell>
                                    <TableCell>
                                        <List dense>
                                            {product.sizes.map((size, sizeIdx) => (
                                                <ListItem key={sizeIdx} disablePadding>
                                                    <ListItemText
                                                        primary={size.limiting_flower
                                                            ? `${size.limiting_flower.name} (còn ${size.limiting_flower.available})`
                                                            : "Không có"}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" flexDirection="column" gap={0.5}>
                                            {product.sizes.map((size, sizeIdx) => (
                                                <Chip
                                                    key={sizeIdx}
                                                    label={size.warning ? "Gần hết" : "Ổn"}
                                                    color={size.warning ? "error" : "success"}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box mt={2} display="flex" justifyContent="center">
                        <Pagination
                            count={lastPage}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default StockProductAdmin;