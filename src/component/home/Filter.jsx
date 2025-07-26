import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { getFlowerTypes } from "../../services/flowerTypeService";
import { getFlower } from "../../services/flowerService";
import { COLORS } from "../../utils/color";


const Filter = ({ onFilter }) => {
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [flowerTypes, setFlowerTypes] = useState([]);
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [ManualFilter, setManualFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [flowerRes, typeRes] = await Promise.all([
          getFlower(),
          getFlowerTypes(),
        ]);

        const apiColors = [
          ...new Set(flowerRes.data.data.map((flower) => flower.color)),
        ];
        const availableColors = COLORS.filter((color) =>
          apiColors.includes(color)
        );
        setColors(availableColors.length > 0 ? availableColors : apiColors);

        setFlowerTypes(typeRes.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleColorChange = (color) => {
    setSelectedColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      }
      return [...prev, color];
    });
  };

  const handleTypeChange = (typeId) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId);
      }
      return [...prev, typeId];
    });
  };


  const handleApplyFilter = () => {
    setManualFilter(true);

    let minPrice = priceRange[0] === "" ? 0 : Number(priceRange[0]);
    let maxPrice = priceRange[1] === "" ? 10000000 : Number(priceRange[1]);
    if (minPrice > maxPrice) minPrice = maxPrice;

    onFilter({
      color: selectedColors.length > 0 ? selectedColors : null,
      flower_type_id: selectedTypes.length > 0 ? selectedTypes : null,
      price: [minPrice, maxPrice],
    });

    window.scrollTo(0, 0);
  };


  const handleResetFilters = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setPriceRange([0, 1000000]);
    setManualFilter(true);
    onFilter({});
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: 2,
        position: "relative",
      }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Bộ lọc sản phẩm
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Màu sắc
            </Typography>
            <FormGroup>
              {colors.map((color) => (
                <FormControlLabel
                  key={color}
                  control={
                    <Checkbox
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorChange(color)}
                      sx={{
                        color:
                          color === "Đỏ"
                            ? "#f44336"
                            : color === "Xanh dương"
                              ? "#2196f3"
                              : color === "Vàng"
                                ? "#ffeb3b"
                                : color === "Hồng"
                                  ? "#e91e63"
                                  : color === "Tím"
                                    ? "#9c27b0"
                                    : color === "Xanh lá"
                                      ? "#4caf50"
                                      : color === "Cam"
                                        ? "#ff9800"
                                        : color === "Nâu"
                                          ? "#795548"
                                          : color === "Đen"
                                            ? "#000000"
                                            : "gray",
                      }}
                    />
                  }
                  label={color}
                />
              ))}
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Loại hoa
            </Typography>
            <FormGroup>
              {flowerTypes.map((type) => (
                <FormControlLabel
                  key={type.id}
                  control={
                    <Checkbox
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => handleTypeChange(type.id)}
                    />
                  }
                  label={type.name}
                />
              ))}
            </FormGroup>

            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Khoảng giá
            </Typography>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <input
                type="number"
                min={0}
                value={priceRange[0]}
                onChange={e => {
                  const val = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                  setPriceRange([val, priceRange[1]]);
                }}
                style={{
                  width: 100,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc"
                }}
                placeholder="Từ"
              />
              <span>-</span>
              <input
                type="number"
                min={0}
                value={priceRange[1]}
                onChange={e => {
                  const val = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                  setPriceRange([priceRange[0], val]);
                }}
                style={{
                  width: 100,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc"
                }}
                placeholder="Đến"
              />
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilter}
                disabled={loading}
                sx={{ minWidth: "120px" }}>
                Áp dụng
              </Button>

              {(selectedColors.length > 0 || selectedTypes.length > 0 || priceRange[0] !== "" || priceRange[1] !== "") && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleResetFilters}
                  sx={{ minWidth: "120px" }}>
                  Xóa bộ lọc
                </Button>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Filter;
