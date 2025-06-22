import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Checkbox
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getProducts, deleteProduct, updateProduct } from "../../services/productService";
import { getCategory } from "../../services/categoryService";
import { getFlower } from "../../services/flowerService";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [addOpen, setAddOpen] = useState(false);
    const [addProduct, setAddProduct] = useState({
        name: "",
        description: "",
        category_id: "",
        status: 1,
        sizes: [
            { size: "Nhỏ", price: "", recipes: [] },
            { size: "Lớn", price: "", recipes: [] }
        ]
    });

    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data.data || []);
        } catch {
            alert("Error loading product list");
        }
    };
    const fetchCategories = async () => {
        try {
            const res = await getCategory();
            setCategories(res.data.data || []);
        } catch {
            alert("Error loading categories");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        // Lấy danh sách hoa
        getFlower().then(res => setFlowers(res.data.data || []));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (e) {
            console.error("Error deleting product:", e);
            alert("Lỗi khi xóa sản phẩm");
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : "";
    };

    // Mở popup sửa
    const handleEditOpen = (product) => {
        setEditProduct({ ...product }); // clone để chỉnh sửa
        setEditOpen(true);
    };

    // Đóng popup
    const handleEditClose = () => {
        setEditOpen(false);
        setEditProduct(null);
    };

    // Lưu thay đổi
    const handleEditSave = async () => {
        try {
            await updateProduct(editProduct.id, editProduct);
            setEditOpen(false);
            setEditProduct(null);
            fetchProducts();
        } catch (e) {
            console.error("Error updating product:", e);
            alert("Lỗi khi cập nhật sản phẩm");
        }
    };

    // Xử lý thay đổi trường
    const handleEditChange = (e) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };

    // Xử lý thay đổi giá size
    const handleSizePriceChange = (idx, value) => {
        const sizes = [...editProduct.sizes];
        sizes[idx].price = value;
        setEditProduct({ ...editProduct, sizes });
    };

    const handleCheckFlower = (sizeIdx, flower) => {
        const sizes = [...editProduct.sizes];
        const recipes = sizes[sizeIdx].recipes || [];
        const exists = recipes.find(r => r.flower_id === flower.id);
        if (exists) {
            sizes[sizeIdx].recipes = recipes.filter(r => r.flower_id !== flower.id);
        } else {
            sizes[sizeIdx].recipes = [
                ...recipes,
                { flower_id: flower.id, quantity: 1 }
            ];
        }
        setEditProduct({ ...editProduct, sizes });
    };

    const handleRecipeChange = (sizeIdx, flower_id, value) => {
        const sizes = [...editProduct.sizes];
        sizes[sizeIdx].recipes = sizes[sizeIdx].recipes.map(r =>
            r.flower_id === flower_id ? { ...r, quantity: value } : r
        );
        setEditProduct({ ...editProduct, sizes });
    };

    const handleAddOpen = () => {
        setAddProduct({
            name: "",
            description: "",
            category_id: "",
            status: 1,
            sizes: [
                { size: "Nhỏ", price: "", recipes: [] },
                { size: "Lớn", price: "", recipes: [] }
            ]
        });
        setAddOpen(true);
    };
    const handleAddClose = () => setAddOpen(false);

    // Xử lý thay đổi trường thêm sản phẩm
    const handleAddChange = (e) => {
        setAddProduct({ ...addProduct, [e.target.name]: e.target.value });
    };

    // Xử lý thay đổi giá size thêm sản phẩm
    const handleAddSizePriceChange = (idx, value) => {
        const sizes = [...addProduct.sizes];
        sizes[idx].price = value;
        setAddProduct({ ...addProduct, sizes });
    };

    // Xử lý chọn hoa cho size thêm sản phẩm
    const handleAddCheckFlower = (sizeIdx, flower) => {
        const sizes = [...addProduct.sizes];
        const recipes = sizes[sizeIdx].recipes || [];
        const exists = recipes.find(r => r.flower_id === flower.id);
        if (exists) {
            sizes[sizeIdx].recipes = recipes.filter(r => r.flower_id !== flower.id);
        } else {
            sizes[sizeIdx].recipes = [
                ...recipes,
                { flower_id: flower.id, quantity: 1 }
            ];
        }
        setAddProduct({ ...addProduct, sizes });
    };

    // Xử lý thay đổi số lượng hoa trong công thức thêm sản phẩm
    const handleAddRecipeChange = (sizeIdx, flower_id, value) => {
        const sizes = [...addProduct.sizes];
        sizes[sizeIdx].recipes = sizes[sizeIdx].recipes.map(r =>
            r.flower_id === flower_id ? { ...r, quantity: value } : r
        );
        setAddProduct({ ...addProduct, sizes });
    };

    const handleAddSave = async () => {
        try {
            await updateProduct(null, addProduct); // hoặc gọi createProduct tuỳ API
            setAddOpen(false);
            fetchProducts();
        } catch (e) {
            console.error("Error adding product:", e);
            alert("Lỗi khi thêm sản phẩm");
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>
                Quản lý sản phẩm
            </Typography>
            <Button
                variant="contained"
                color="success"
                onClick={handleAddOpen}
                sx={{ mb: 2 }}
            >
                Thêm sản phẩm
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
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
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEditOpen(p)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Popup sửa sản phẩm */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Sửa sản phẩm</DialogTitle>
                <DialogContent>
                    {editProduct && (
                        <Box>
                            <TextField
                                label="Tên sản phẩm"
                                name="name"
                                value={editProduct.name}
                                onChange={handleEditChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Mô tả"
                                name="description"
                                value={editProduct.description}
                                onChange={handleEditChange}
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
                                onChange={handleEditChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </TextField>
                            {/* Danh sách size */}
                            {editProduct.sizes && editProduct.sizes.map((size, idx) => (
                                <Box key={size.id || idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 2 }}>
                                    <Typography fontWeight={600}>Kích thước: {size.size}</Typography>
                                    <TextField
                                        label="Giá"
                                        value={size.price}
                                        onChange={e => handleSizePriceChange(idx, e.target.value)}
                                        sx={{ mb: 1, ml: 2 }}
                                    />
                                    <Typography fontWeight={500} mt={1} mb={1}>Chọn hoa cho size này:</Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell />
                                                <TableCell>Tên hoa</TableCell>
                                                <TableCell>Số lượng</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {flowers.map(flower => {
                                                const recipe = (size.recipes || []).find(r => r.flower_id === flower.id);
                                                return (
                                                    <TableRow key={flower.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={!!recipe}
                                                                onChange={() => handleCheckFlower(idx, flower)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{flower.name}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={recipe ? recipe.quantity : ""}
                                                                onChange={e => handleRecipeChange(idx, flower.id, e.target.value)}
                                                                disabled={!recipe}
                                                                inputProps={{ min: 1 }}
                                                            />
                                                        </TableCell>
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
                    <Button onClick={handleEditClose}>Hủy</Button>
                    <Button onClick={handleEditSave} variant="contained" color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Popup thêm sản phẩm */}
            <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
                <DialogTitle>Thêm sản phẩm</DialogTitle>
                <DialogContent>
                    <Box>
                        <TextField
                            label="Tên sản phẩm"
                            name="name"
                            value={addProduct.name}
                            onChange={handleAddChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Mô tả"
                            name="description"
                            value={addProduct.description}
                            onChange={handleAddChange}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Danh mục"
                            name="category_id"
                            select
                            value={addProduct.category_id}
                            onChange={handleAddChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </TextField>
                        {/* Danh sách size */}
                        {addProduct.sizes && addProduct.sizes.map((size, idx) => (
                            <Box key={idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 2 }}>
                                <TextField
                                    label="Tên size"
                                    value={size.size}
                                    onChange={e => {
                                        const sizes = [...addProduct.sizes];
                                        sizes[idx].size = e.target.value;
                                        setAddProduct({ ...addProduct, sizes });
                                    }}
                                    sx={{ mb: 1, mr: 2 }}
                                />
                                <TextField
                                    label="Giá"
                                    value={size.price}
                                    onChange={e => handleAddSizePriceChange(idx, e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                                <Typography fontWeight={500} mt={1} mb={1}>Chọn hoa cho size này:</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>Tên hoa</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {flowers.map(flower => {
                                            const recipe = (size.recipes || []).find(r => r.flower_id === flower.id);
                                            return (
                                                <TableRow key={flower.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={!!recipe}
                                                            onChange={() => handleAddCheckFlower(idx, flower)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{flower.name}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={recipe ? recipe.quantity : ""}
                                                            onChange={e => handleAddRecipeChange(idx, flower.id, e.target.value)}
                                                            disabled={!recipe}
                                                            inputProps={{ min: 1 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddClose}>Hủy</Button>
                    <Button onClick={handleAddSave} variant="contained" color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProduct;