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
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [manualFilter, setManualFilter] = useState(false);

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
      return [color];
    });
  };

  const handleTypeChange = (typeId) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId);
      }
      return [typeId];
    });
  };

  const handleApplyFilter = () => {
    setManualFilter(true);
    onFilter({
      color: selectedColors.length > 0 ? selectedColors[0] : null,
      flower_type_id: selectedTypes.length > 0 ? selectedTypes[0] : null,
    });
  };

  const handleResetFilters = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
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

            {/* Thêm nút Áp dụng ở cuối */}
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilter}
                disabled={loading}
                sx={{ minWidth: "120px" }}>
                Áp dụng
              </Button>

              {(selectedColors.length > 0 || selectedTypes.length > 0) && (
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
