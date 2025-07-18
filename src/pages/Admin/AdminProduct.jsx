import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Checkbox,
    Pagination, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Divider
} from "@mui/material";
import { Edit, Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getCategory } from "../../services/categoryService";
import { getFlower } from "../../services/flowerService";
import { forwardRef } from "react";
const RichTextEditor = forwardRef(({ value, onChange, placeholder }, ref) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Mô tả sản phẩm
            </Typography>
            <TextField
                multiline
                fullWidth
                rows={6}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                inputRef={ref}
                sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'inherit' } }}
            />
        </Box>
    );
});
const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingPage, setLoadingPage] = useState(false);
    const [search, setSearch] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const rowsPerPage = 10;

    const [flowerDropdownOpen, setFlowerDropdownOpen] = useState({});
    const [flowerSearches, setFlowerSearches] = useState(["", ""]);

    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([
                fetchCategories(),
                fetchFlowers()
            ]);
            fetchProducts(page, search);
        };
        loadInitialData();
    }, [page, search]);

    const fetchProducts = async (pageNumber, searchTerm = search) => {
        try {
            setLoadingPage(true);
            const res = await getProducts(pageNumber, searchTerm);
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta?.last_page || 1);
        } catch {
            alert("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoadingPage(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategory();
            setCategories(res.data.data || []);
        } catch {
            alert("Lỗi khi tải danh mục");
        }
    };
    const fetchFlowers = async () => {
        try {
            const res = await getFlower();
            setFlowers(res.data.data || []);
        } catch {
            alert("Lỗi khi tải danh sách hoa");
        }
    };
    useEffect(() => {
        if (openDialog && editProduct && editProduct.sizes) {
            setFlowerSearches(Array(editProduct.sizes.length).fill(""));
            setFlowerDropdownOpen({});
        }
    }, [openDialog, editProduct]);

    const handleToggleDropdown = (sizeIdx) => {
        setFlowerDropdownOpen(prev => ({
            ...prev,
            [sizeIdx]: !prev[sizeIdx]
        }));
    };
    const handleDescriptionChange = (value) => {
        setEditProduct(prev => ({ ...prev, description: value }));
    };
    const handlePageChange = async (event, newPage) => {
        if (loadingPage) return;

        try {
            setLoadingPage(true);
            const res = await getProducts(newPage);
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta.last_page || 1);
            setPage(newPage);
        } catch {
            alert("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoadingPage(false);
        }
    };
    const handleOpenDialog = (product = null) => {
        if (product) {
            setEditProduct(JSON.parse(JSON.stringify(product)));
            setImagePreview("");
        } else {
            setEditProduct({
                name: "",
                description: "",
                category_id: "",
                status: 1,
                sizes: [
                    { size: "Nhỏ", price: "", receipt_details: [] },
                    { size: "Lớn", price: "", receipt_details: [] }
                ]
            });
            setImagePreview("");
        }
        setOpenDialog(true);
    };
    const handleCloseDialog = () => setOpenDialog(false);

    const handleFieldChange = (e) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };
    const handleSizeChange = (idx, field, value) => {
        const sizes = [...editProduct.sizes];
        sizes[idx][field] = value;
        setEditProduct({ ...editProduct, sizes });
    };
    const handleDetailChange = (sizeIdx, flower_id, field, value) => {
        const sizes = [...editProduct.sizes];
        sizes[sizeIdx].receipt_details = sizes[sizeIdx].receipt_details.map(d =>
            d.flower_id === flower_id ? { ...d, [field]: value } : d
        );
        setEditProduct({ ...editProduct, sizes });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (editProduct.id) {
                formData.append("_method", "PUT");
            }
            formData.append("name", editProduct.name);
            formData.append("description", editProduct.description);
            formData.append("category_id", editProduct.category_id);
            formData.append("status", 1);

            if (editProduct.image instanceof File) {
                formData.append("image", editProduct.image);
            }

            editProduct.sizes.forEach((size, i) => {
                formData.append(`sizes[${i}][size]`, size.size);
                formData.append(`sizes[${i}][price]`, size.price);
                size.receipt_details.forEach((r, j) => {
                    formData.append(`sizes[${i}][recipes][${j}][flower_id]`, r.flower_id);
                    formData.append(`sizes[${i}][recipes][${j}][quantity]`, r.quantity);
                });
            });

            if (editProduct.id) {
                await updateProduct(editProduct.id, formData, { headers: { "Content-Type": "multipart/form-data" } });
            } else {
                await createProduct(formData, { headers: { "Content-Type": "multipart/form-data" } });
            }
            setOpenDialog(false);
            fetchProducts();
        } catch {
            alert("Lỗi khi lưu sản phẩm");
        }
        setLoading(false);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProduct(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch {
            alert("Lỗi khi xóa sản phẩm");
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : "";
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchValue);
    };

    const handleFlowerSearchChange = (idx, value) => {
        const arr = [...flowerSearches];
        arr[idx] = value;
        setFlowerSearches(arr);
    };

    const handleCheckFlowerSync = (sizeIdx, flower) => {
        const sizes = [...editProduct.sizes];
        const details = sizes[sizeIdx].receipt_details || [];
        const exists = details.find(d => d.flower_id === flower.id);

        if (exists) {
            sizes.forEach((sz, i) => {
                sizes[i].receipt_details = (sz.receipt_details || []).filter(d => d.flower_id !== flower.id);
            });
        } else {
            sizes.forEach((sz, i) => {
                const szDetails = sz.receipt_details || [];
                if (!szDetails.find(d => d.flower_id === flower.id)) {
                    sizes[i].receipt_details = [
                        ...szDetails,
                        {
                            flower_id: flower.id,
                            flower_name: flower.name,
                            quantity: 1
                        }
                    ];
                }
            });
        }
        setEditProduct({ ...editProduct, sizes });
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý sản phẩm
            </Typography>

            <Box mb={2} component="form" onSubmit={handleSearch} display="flex" gap={2}>
                <TextField
                    label="Tìm kiếm sản phẩm"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    size="small"
                />
                <Button type="submit" variant="contained">Tìm kiếm</Button>
            </Box>

            <Button
                variant="contained"
                color="success"
                sx={{ mb: 2 }}
                onClick={() => handleOpenDialog()}
                disabled={loadingPage}
            >
                Thêm sản phẩm
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingPage ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((p, index) => (
                                <TableRow key={p.id}>
                                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>
                                        <img src={p.image_url} alt={p.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
                                    </TableCell>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>
                                        {p.sizes && p.sizes.length > 0
                                            ? p.sizes.map(s => `${s.size}: ${Number(s.price).toLocaleString()}đ`).join(", ")
                                            : "Liên hệ"}
                                    </TableCell>
                                    <TableCell>{getCategoryName(p.category_id)}</TableCell>
                                    <TableCell>
                                        {p.status ? (
                                            <span style={{ color: "green" }}>Hiện</span>
                                        ) : (
                                            <span style={{ color: "gray" }}>Ẩn</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleOpenDialog(p)} disabled={loadingPage}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(p.id)} disabled={loadingPage}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" mt={3} alignItems="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={loadingPage} // Disable khi đang loading
                />
                {loadingPage && (
                    <CircularProgress size={24} sx={{ ml: 2 }} />
                )}
            </Box>

            {/* Popup thêm/sửa sản phẩm */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editProduct?.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
                <DialogContent>
                    {editProduct && (
                        <Box>
                            <TextField
                                label="Tên sản phẩm"
                                name="name"
                                value={editProduct.name}
                                onChange={handleFieldChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <RichTextEditor
                                value={editProduct.description || ''}
                                onChange={handleDescriptionChange}
                                placeholder="Nhập mô tả sản phẩm..."
                            />
                            <TextField
                                label="Danh mục"
                                name="category_id"
                                select
                                value={editProduct.category_id}
                                onChange={handleFieldChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </TextField>
                            {/* <TextField
                                label="Trạng thái"
                                name="status"
                                select
                                value={editProduct.status}
                                onChange={handleFieldChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value={1}>Hiện</MenuItem>
                                <MenuItem value={0}>Ẩn</MenuItem>
                            </TextField> */}

                            {/* Ảnh sản phẩm */}
                            <Box sx={{ mb: 2 }}>
                                <Typography fontWeight={500}>Ảnh sản phẩm:</Typography>
                                {(imagePreview || editProduct.image_url) && (
                                    <img
                                        src={imagePreview || editProduct.image_url}
                                        alt="Ảnh sản phẩm"
                                        style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 8, borderRadius: 8 }}
                                    />
                                )}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{ mt: 1 }}
                                >
                                    Chọn ảnh
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Box>

                            {/* Danh sách size với dropdown */}
                            {editProduct.sizes && editProduct.sizes.map((size, idx) => {
                                const flowerSearch = flowerSearches[idx] || "";
                                const filteredFlowers = flowers.filter(f =>
                                    f.name.toLowerCase().includes(flowerSearch.toLowerCase())
                                );

                                return (
                                    <Box key={idx} sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <TextField
                                                label="Tên size"
                                                disabled
                                                value={size.size}
                                                sx={{ flex: 1 }}
                                            />
                                            <TextField
                                                label="Giá"
                                                type="number"
                                                value={size.price}
                                                onChange={e => handleSizeChange(idx, "price", e.target.value)}
                                                sx={{ flex: 1 }}
                                                InputProps={{
                                                    endAdornment: <span>đ</span>
                                                }}
                                                inputProps={{ min: 0, step: 1000 }}
                                            />
                                        </Box>

                                        {/* Phần dropdown chọn hoa */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Chọn hoa cho {size.size}
                                            </Typography>

                                            <TextField
                                                label="Tìm kiếm hoa"
                                                value={flowerSearch}
                                                onChange={(e) => handleFlowerSearchChange(idx, e.target.value)}
                                                onFocus={() => handleToggleDropdown(idx)}
                                                fullWidth
                                                size="small"
                                                sx={{ mb: 1 }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleToggleDropdown(idx)}
                                                        >
                                                            {flowerDropdownOpen[idx] ? <ExpandLess /> : <ExpandMore />}
                                                        </IconButton>
                                                    )
                                                }}
                                            />

                                            {/* Dropdown menu */}
                                            {flowerDropdownOpen[idx] && (
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        position: 'absolute',
                                                        zIndex: 1000,
                                                        width: '100%',
                                                        maxHeight: 300,
                                                        overflow: 'auto',
                                                        mt: 0.5,
                                                        boxShadow: 3
                                                    }}
                                                >
                                                    <Box display="flex" justifyContent="flex-end" p={1}>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleToggleDropdown(idx)}
                                                        >
                                                            Đóng
                                                        </Button>
                                                    </Box>
                                                    <List dense>
                                                        {filteredFlowers.length === 0 ? (
                                                            <ListItem>
                                                                <ListItemText primary="Không tìm thấy hoa phù hợp" />
                                                            </ListItem>
                                                        ) : (
                                                            filteredFlowers.map((flower) => {
                                                                const detail = (size.receipt_details || []).find(d => d.flower_id === flower.id);
                                                                const isSelected = !!detail;

                                                                return (
                                                                    <React.Fragment key={flower.id}>
                                                                        <ListItem
                                                                            button
                                                                            onClick={() => handleCheckFlowerSync(idx, flower)}
                                                                        >
                                                                            <ListItemIcon>
                                                                                <Checkbox
                                                                                    edge="start"
                                                                                    checked={isSelected}
                                                                                    tabIndex={-1}
                                                                                    disableRipple
                                                                                />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                primary={flower.name}
                                                                            // secondary={`ID: ${flower.id}`}
                                                                            />
                                                                            {isSelected && (
                                                                                <Box display="flex" alignItems="center">
                                                                                    <TextField
                                                                                        label="SL"
                                                                                        type="number"
                                                                                        size="small"
                                                                                        value={detail?.quantity || 1}
                                                                                        onChange={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleDetailChange(idx, flower.id, "quantity", parseInt(e.target.value) || 1);
                                                                                        }}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        inputProps={{
                                                                                            min: 1,
                                                                                            style: { width: '60px' }
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            )}
                                                                        </ListItem>
                                                                        <Divider />
                                                                    </React.Fragment>
                                                                );
                                                            })
                                                        )}
                                                    </List>
                                                </Paper>
                                            )}
                                        </Box>

                                        {/* Hiển thị hoa đã chọn */}
                                        {size.receipt_details && size.receipt_details.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Hoa đã chọn cho {size.size} ({size.receipt_details.length})
                                                </Typography>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Tên hoa</TableCell>
                                                            <TableCell>Số lượng</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {size.receipt_details.map((detail) => {
                                                            const flower = flowers.find(f => f.id === detail.flower_id);
                                                            const flowerName = flower ? flower.name : detail.flower_name || "Không xác định";

                                                            return (
                                                                <TableRow key={detail.flower_id}>
                                                                    <TableCell>{flowerName}</TableCell>
                                                                    <TableCell>
                                                                        <TextField
                                                                            type="number"
                                                                            size="small"
                                                                            value={detail.quantity}
                                                                            onChange={e => handleDetailChange(idx, detail.flower_id, "quantity", parseInt(e.target.value) || 1)}
                                                                            inputProps={{ min: 1 }}
                                                                            sx={{ width: 80 }}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProduct;