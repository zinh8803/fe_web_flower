import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Checkbox,
    Pagination, CircularProgress 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getCategory } from "../../services/categoryService";
import { getFlower } from "../../services/flowerService";

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

    // Load dữ liệu
    useEffect(() => {
        fetchProducts(page, search);
        fetchCategories();
        fetchFlowers();
        // eslint-disable-next-line
    }, [page, search]);

    const fetchProducts = async (pageNumber, searchTerm = search) => {
        try {
            setLoadingPage(true); // Bắt đầu loading
            const res = await getProducts(pageNumber, searchTerm);
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta?.last_page || 1);
        } catch {
            alert("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoadingPage(false); // Kết thúc loading
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
    // Sửa hàm handlePageChange để chỉ cập nhật page sau khi data đã load xong
    const handlePageChange = async (event, newPage) => {
        if (loadingPage) return; // Ngăn chặn việc click liên tục khi đang loading

        try {
            setLoadingPage(true);
            const res = await getProducts(newPage);
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta.last_page || 1);
            setPage(newPage); // Chỉ cập nhật page sau khi data đã load xong
        } catch {
            alert("Lỗi khi tải danh sách sản phẩm");
        } finally {
            setLoadingPage(false);
        }
    };
    // Mở popup thêm/sửa
    const handleOpenDialog = (product = null) => {
        if (product) {
            setEditProduct(JSON.parse(JSON.stringify(product)));
            setImagePreview(""); // reset preview khi sửa
        } else {
            setEditProduct({
                name: "",
                description: "",
                category_id: "",
                status: 1,
                sizes: [
                    { size: "Nhỏ", receipt_details: [] },
                    { size: "Lớn", receipt_details: [] }
                ]
            });
            setImagePreview("");
        }
        setOpenDialog(true);
    };
    const handleCloseDialog = () => setOpenDialog(false);

    // Xử lý thay đổi trường
    const handleFieldChange = (e) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };
    const handleSizeChange = (idx, field, value) => {
        const sizes = [...editProduct.sizes];
        sizes[idx][field] = value;
        setEditProduct({ ...editProduct, sizes });
    };
    // Chọn hoa cho từng size
    const handleCheckFlower = (sizeIdx, flower) => {
        const sizes = [...editProduct.sizes];
        const details = sizes[sizeIdx].receipt_details || [];
        const exists = details.find(d => d.flower_id === flower.id);
        if (exists) {
            sizes[sizeIdx].receipt_details = details.filter(d => d.flower_id !== flower.id);
        } else {
            sizes[sizeIdx].receipt_details = [
                ...details,
                {
                    flower_id: flower.id,
                    flower_name: flower.name,
                    quantity: 1,
                    //import_price: flower.price || 0,
                    // import_date: new Date().toISOString().slice(0, 10),
                    //status: "hoa tươi"
                }
            ];
        }
        setEditProduct({ ...editProduct, sizes });
    };
    // Sửa chi tiết hoa
    const handleDetailChange = (sizeIdx, flower_id, field, value) => {
        const sizes = [...editProduct.sizes];
        sizes[sizeIdx].receipt_details = sizes[sizeIdx].receipt_details.map(d =>
            d.flower_id === flower_id ? { ...d, [field]: value } : d
        );
        setEditProduct({ ...editProduct, sizes });
    };

    // Lưu sản phẩm
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
            formData.append("status", editProduct.status);

            if (editProduct.image instanceof File) {
                formData.append("image", editProduct.image);
            }

            editProduct.sizes.forEach((size, i) => {
                formData.append(`sizes[${i}][size]`, size.size);
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
    // Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch {
            alert("Lỗi khi xóa sản phẩm");
        }
    };

    // Lấy tên danh mục
    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : "";
    };

    // Thêm hàm handleSearch
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchValue);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý sản phẩm
            </Typography>
            {/* Thêm form tìm kiếm */}
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
                disabled={loadingPage} // Disable khi đang loading
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
                            // Hiển thị skeleton loading hoặc hàng rỗng khi đang loading
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Hiển thị dữ liệu khi đã load xong
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
                            <TextField
                                label="Mô tả"
                                name="description"
                                value={editProduct.description}
                                onChange={handleFieldChange}
                                fullWidth
                                multiline
                                rows={2}
                                sx={{ mb: 2 }}
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
                            <TextField
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
                            </TextField>
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
                            {/* Danh sách size */}
                            {editProduct.sizes && editProduct.sizes.map((size, idx) => (
                                <Box key={idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 2 }}>
                                    <TextField
                                        label="Tên size"
                                        value={size.size}
                                        onChange={e => handleSizeChange(idx, "size", e.target.value)}
                                        sx={{ mb: 1, mr: 2 }}
                                    />
                                    {editProduct.id && (
                                        <TextField
                                            label="Giá"
                                            disabled
                                            value={size.price}
                                            onChange={e => handleSizeChange(idx, "price", e.target.value)}
                                            sx={{ mb: 1 }}
                                        />
                                    )}
                                    <Typography fontWeight={500} mt={1} mb={1}>Chọn hoa cho size này:</Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                <TableCell>Tên hoa</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                                {/* <TableCell>Giá nhập</TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>Trạng thái</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {flowers.map(flower => {
                                                const detail = (size.receipt_details || []).find(d => d.flower_id === flower.id);
                                                return (
                                                    <TableRow key={flower.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={!!detail}
                                                                onChange={() => handleCheckFlower(idx, flower)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{flower.name}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={detail ? detail.quantity : ""}
                                                                onChange={e => handleDetailChange(idx, flower.id, "quantity", e.target.value)}
                                                                disabled={!detail}
                                                                inputProps={{ min: 1 }}
                                                            />
                                                        </TableCell>
                                                        {/* <TableCell>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={detail ? detail.import_price : ""}
                                                                onChange={e => handleDetailChange(idx, flower.id, "import_price", e.target.value)}
                                                                disabled={!detail}
                                                                inputProps={{ min: 0 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="date"
                                                                size="small"
                                                                value={detail ? detail.import_date : ""}
                                                                onChange={e => handleDetailChange(idx, flower.id, "import_date", e.target.value)}
                                                                disabled={!detail}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                size="small"
                                                                value={detail ? detail.status : ""}
                                                                onChange={e => handleDetailChange(idx, flower.id, "status", e.target.value)}
                                                                disabled={!detail}
                                                            />
                                                        </TableCell> */}
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </Box>
                            ))}
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