import React, { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import ProductGrid from "../../component/home/ProductGrid";
import Filter from "../../component/home/filter";

const Home = () => {
    document.title = 'Trang sản phẩm';
    const [filterParams, setFilterParams] = useState({});

    const handleFilter = (params) => {
        setFilterParams(params);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Tiêu đề chung */}
            <Typography variant="h6" fontWeight={700} color="green" mb={3}>
                HOA TẶNG & HOA DỊCH VỤ
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Bộ lọc bên trái - cố định width */}
                <Box
                    sx={{
                        width: 280,
                        flexShrink: 0, // Không co lại
                        position: { sm: 'sticky' },
                        top: { sm: 20 },
                        alignSelf: 'flex-start'
                    }}
                >
                    <Filter onFilter={handleFilter} />
                </Box>

                {/* Danh sách sản phẩm - chiếm phần còn lại */}
                <Box sx={{ flex: 1 }}>
                    <ProductGrid
                        filterParams={filterParams}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default Home;
