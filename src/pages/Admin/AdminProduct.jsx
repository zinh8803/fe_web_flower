import React, { useState, useEffect } from "react";
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, CircularProgress
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getProducts, deleteProduct, updateProduct, createProduct } from "../../services/productService";
import { getCategory } from "../../services/categoryService";
import { getImportReceipts } from "../../services/importReceiptsService";

const defaultProduct = {
    name: "",
    description: "",
    category_id: "",
    status: 1,
    image: null,
    sizes: [
        { size: "Nhỏ", price: "", recipes: [] },
        { size: "Lớn", price: "", recipes: [] }
    ]
};

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null); // null: thêm, object: sửa
    const [addProduct, setAddProduct] = useState({ ...defaultProduct });
    const [loading, setLoading] = useState(false);

    // Fetch data
    useEffect(() => {
        fetchProducts();
        getCategory().then(res => setCategories(res.data.data || []));
        fetchFlowersFromReceipts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data.data || []);
        } catch {
            alert("Lỗi khi tải sản phẩm");
        }
    };

    const fetchFlowersFromReceipts = async () => {
        try {
            const res = await getImportReceipts();
            // Tổng hợp tồn kho từng hoa
            const flowerMap = {};
            (res.data.data || []).forEach(receipt => {
                (receipt.details || []).forEach(detail => {
                    if (!flowerMap[detail.flower_id]) {
                        flowerMap[detail.flower_id] = {
                            id: detail.flower_id,
                            name: detail.flower_name,
                            remaining_quantity: 0
                        };
                    }
                    flowerMap[detail.flower_id].remaining_quantity += Number(detail.remaining_quantity);
                });
            });
            setFlowers(Object.values(flowerMap));
        } catch {
            alert("Lỗi khi tải hoa từ phiếu nhập");
        }
    };

    // Mở popup Thêm
    const handleAddOpen = () => {
        setAddProduct({ ...defaultProduct });
        setAddDialogOpen(true);
    };

    // Mở popup Sửa
    const handleEditOpen = (product) => {
        setEditProduct({
            ...product,
            image: null, // reset image để chọn lại nếu muốn
            sizes: product.sizes?.length
                ? product.sizes.map(s => ({
                    ...s,
                    recipes: s.recipes || []
                }))
                : [
                    { size: "Nhỏ", price: "", recipes: [] },
                    { size: "Lớn", price: "", recipes: [] }
                ]
        });
        setDialogOpen(true);
    };

    // Đóng popup
    const handleDialogClose = () => {
        setDialogOpen(false);
        setAddDialogOpen(false);
        setEditProduct(null);
        setAddProduct({ ...defaultProduct });
    };

    // Xử lý thay đổi trường chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddProduct(prev => ({ ...prev, [name]: value }));
    };

    // Đổi hình
    const handleImageChange = (e) => {
        setEditProduct(prev => ({ ...prev, image: e.target.files[0] }));
    };

    // Thay đổi tên size
    const handleSizeNameChange = (idx, value) => {
        setEditProduct(prev => {
            const sizes = [...prev.sizes];
            sizes[idx].size = value;
            return { ...prev, sizes };
        });
    };

    const handleAddSizeNameChange = (idx, value) => {
        setAddProduct(prev => {
            const sizes = [...prev.sizes];
            sizes[idx].size = value;
            return { ...prev, sizes };
        });
    };

    // Thay đổi giá size (chỉ cho sửa)
    const handleSizePriceChange = (idx, value) => {
        setEditProduct(prev => {
            const sizes = [...prev.sizes];
            sizes[idx].price = value;
            return { ...prev, sizes };
        });
    };

    // Thay đổi số lượng hoa cho size
    const handleRecipeChange = (sizeIdx, flowerId, value) => {
        setEditProduct(prev => {
            const sizes = [...prev.sizes];
            let recipes = sizes[sizeIdx].recipes || [];
            const idx = recipes.findIndex(r => r.flower_id === flowerId);
            if (idx > -1) {
                recipes[idx].quantity = value;
            } else {
                recipes.push({ flower_id: flowerId, quantity: value });
            }
            sizes[sizeIdx].recipes = recipes;
            return { ...prev, sizes };
        });
    };

    const handleAddRecipeChange = (sizeIdx, flowerId, value) => {
        setAddProduct(prev => {
            const sizes = [...prev.sizes];
            let recipes = sizes[sizeIdx].recipes || [];
            const idx = recipes.findIndex(r => r.flower_id === flowerId);
            if (idx > -1) {
                recipes[idx].quantity = value;
            } else {
                recipes.push({ flower_id: flowerId, quantity: value });
            }
            sizes[sizeIdx].recipes = recipes;
            return { ...prev, sizes };
        });
    };

    // Lưu sản phẩm (thêm hoặc sửa)
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
            if (editProduct.image) {
                formData.append("image", editProduct.image);
            }
            // Nếu là thêm thì bỏ giá size
            const sizes = editProduct.sizes.map(s => ({
                ...s,
                price: editProduct.id ? s.price : undefined // chỉ gửi price khi sửa
            }));
            formData.append("sizes", JSON.stringify(sizes));
            if (editProduct.id) {
                await updateProduct(editProduct.id, formData);
            } else {
                await createProduct(formData);
            }
            setDialogOpen(false);
            fetchProducts();
        } catch (e) {
            console.error(e);
            alert("Lỗi khi lưu sản phẩm");
        }
        setLoading(false);
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
    const getCategoryName = (id) => categories.find(c => c.id === id)?.name || "";

    const handleFlowerCheck = (sizeIdx, flowerId, checked) => {
        setEditProduct(prev => {
            const sizes = [...prev.sizes];
            let recipes = sizes[sizeIdx].recipes || [];
            const idx = recipes.findIndex(r => r.flower_id === flowerId);
            if (checked) {
                // Nếu chưa có thì thêm với quantity mặc định 1
                if (idx === -1) recipes.push({ flower_id: flowerId, quantity: 1 });
            } else {
                // Bỏ tích thì xóa khỏi mảng
                recipes = recipes.filter(r => r.flower_id !== flowerId);
            }
            sizes[sizeIdx].recipes = recipes;
            return { ...prev, sizes };
        });
    };

    const handleAddFlowerCheck = (sizeIdx, flowerId, checked) => {
        setAddProduct(prev => {
            const sizes = [...prev.sizes];
            let recipes = sizes[sizeIdx].recipes || [];
            const idx = recipes.findIndex(r => r.flower_id === flowerId);
            if (checked) {
                // Nếu chưa có thì thêm với quantity mặc định 1
                if (idx === -1) recipes.push({ flower_id: flowerId, quantity: 1 });
            } else {
                // Bỏ tích thì xóa khỏi mảng
                recipes = recipes.filter(r => r.flower_id !== flowerId);
            }
            sizes[sizeIdx].recipes = recipes;
            return { ...prev, sizes };
        });
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

            {/* Popup Thêm/Sửa */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>{editProduct?.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
                <DialogContent>
                    {editProduct && (
                        <Box>
                            <TextField
                                label="Tên sản phẩm"
                                name="name"
                                value={editProduct.name}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Mô tả"
                                name="description"
                                value={editProduct.description}
                                onChange={handleChange}
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
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </TextField>
                            {/* Đổi hình (chỉ sửa mới có ảnh cũ) */}
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mb: 2, mr: 2 }}
                            >
                                {editProduct.image ? "Đã chọn ảnh mới" : "Đổi ảnh"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {editProduct.id && editProduct.image_url && (
                                <img src={editProduct.image_url} alt="Ảnh cũ" style={{ width: 60, height: 60, objectFit: "cover", marginLeft: 8 }} />
                            )}
                            <TextField
                                label="Trạng thái"
                                name="status"
                                select
                                value={editProduct.status}
                                onChange={handleChange}
                                fullWidth
                                sx={{ mb: 2, mt: 2 }}
                            >
                                <MenuItem value={1}>Hiện</MenuItem>
                                <MenuItem value={0}>Ẩn</MenuItem>
                            </TextField>
                            {/* Danh sách size */}
                            {editProduct.sizes && editProduct.sizes.map((size, idx) => {
                                // Nếu là sửa thì merge receipt_details và recipes, nếu thêm thì chỉ dùng flowers
                                const mergedFlowers = editProduct.id
                                    ? [
                                        ...(size.receipt_details || []),
                                        ...(size.recipes || [])
                                            .filter(r => !(size.receipt_details || []).some(f => Number(f.flower_id) === Number(r.flower_id)))
                                            .map(r => ({
                                                flower_id: r.flower_id,
                                                flower_name: r.flower_name || `Hoa ID ${r.flower_id}`,
                                                remaining_quantity: 0
                                            }))
                                    ]
                                    : flowers.map(flower => ({
                                        flower_id: flower.id,
                                        flower_name: flower.name,
                                        remaining_quantity: flower.remaining_quantity
                                    }));

                                return (
                                    <Box key={idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 2 }}>
                                        <TextField
                                            label="Tên size"
                                            value={size.size}
                                            onChange={e => handleSizeNameChange(idx, e.target.value)}
                                            sx={{ mb: 1, mr: 2 }}
                                        />
                                        {editProduct.id && (
                                            <TextField
                                                label="Giá"
                                                value={size.price}
                                                onChange={e => handleSizePriceChange(idx, e.target.value)}
                                                sx={{ mb: 1 }}
                                            />
                                        )}
                                        <Typography fontWeight={500} mt={1} mb={1}>Chọn hoa cho size này:</Typography>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell>Tên hoa</TableCell>
                                                    <TableCell>Số lượng</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {mergedFlowers.map(flower => {
                                                    const recipe = size.recipes?.find(r => Number(r.flower_id) === Number(flower.flower_id));
                                                    const checked = !!recipe;
                                                    return (
                                                        <TableRow key={flower.flower_id}>
                                                            <TableCell>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={e => handleFlowerCheck(idx, flower.flower_id, e.target.checked)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                {flower.flower_name}
                                                                <span style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
                                                                    (Tồn: {flower.remaining_quantity})
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    size="small"
                                                                    value={recipe ? recipe.quantity : ""}
                                                                    onChange={e => handleRecipeChange(idx, flower.flower_id, e.target.value)}
                                                                    inputProps={{
                                                                        min: 1,
                                                                        max: flower.remaining_quantity
                                                                    }}
                                                                    sx={{ width: 80 }}
                                                                    disabled={!checked || flower.remaining_quantity === 0}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                );
                            })}

                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Popup Thêm sản phẩm */}
            <Dialog open={addDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Thêm sản phẩm</DialogTitle>
                <DialogContent>
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
                    {/* Đổi hình (chỉ sửa mới có ảnh cũ) */}
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mb: 2, mr: 2 }}
                    >
                        {addProduct.image ? "Đã chọn ảnh mới" : "Đổi ảnh"}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    {addProduct.id && addProduct.image_url && (
                        <img src={addProduct.image_url} alt="Ảnh cũ" style={{ width: 60, height: 60, objectFit: "cover", marginLeft: 8 }} />
                    )}
                    <TextField
                        label="Trạng thái"
                        name="status"
                        select
                        value={addProduct.status}
                        onChange={handleAddChange}
                        fullWidth
                        sx={{ mb: 2, mt: 2 }}
                    >
                        <MenuItem value={1}>Hiện</MenuItem>
                        <MenuItem value={0}>Ẩn</MenuItem>
                    </TextField>
                    {/* Danh sách size */}
                    {addProduct.sizes && addProduct.sizes.map((size, idx) => (
                        <Box key={idx} sx={{ mb: 2, p: 1, border: "1px solid #eee", borderRadius: 2 }}>
                            <TextField
                                label="Tên size"
                                value={size.size}
                                onChange={e => handleAddSizeNameChange(idx, e.target.value)}
                                sx={{ mb: 1, mr: 2 }}
                            />
                            <Typography fontWeight={500} mt={1} mb={1}>Chọn hoa cho size này:</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Tên hoa</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {flowers.map(flower => {
                                        const recipe = size.recipes?.find(r => Number(r.flower_id) === Number(flower.id));
                                        const checked = !!recipe;
                                        return (
                                            <TableRow key={flower.id}>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={e => handleAddFlowerCheck(idx, flower.id, e.target.checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {flower.name}
                                                    <span style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
                                                        (Tồn: {flower.remaining_quantity})
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={recipe ? recipe.quantity : ""}
                                                        onChange={e => handleAddRecipeChange(idx, flower.id, e.target.value)}
                                                        inputProps={{
                                                            min: 1,
                                                            max: flower.remaining_quantity
                                                        }}
                                                        sx={{ width: 80 }}
                                                        disabled={!checked || flower.remaining_quantity === 0}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    ))}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProduct;