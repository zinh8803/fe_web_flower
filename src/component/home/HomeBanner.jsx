import React, { useEffect, useState, useRef } from "react";
import {
    Paper,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Container,
    Skeleton,
    Chip
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos, LocalShipping, WorkspacePremium, ThumbUp, Spa, ChevronRight } from "@mui/icons-material";
import { getCategory } from "../../services/categoryService";
import { Link } from "react-router-dom";

const HomeBanner = () => {
    const bannerImages = [
        "https://tools.dalathasfarm.com/assets/2023/2023-04/a894a06ffef18edf4e48060cd6040b1e.jpg",
        "https://tools.dalathasfarm.com/assets/2024/2024-01/1caefd022bdb73b8ccbde96f54b9369e.jpg",
        "https://tools.dalathasfarm.com/assets/2023/2023-03/dff67f171dd7d839c1e4e664c44160e6.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCat, setLoadingCat] = useState(true);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        getCategory()
            .then((res) => {
                setCategories(res.data.data || []);
            })
            .catch(() => setCategories([]))
            .finally(() => setLoadingCat(false));
    }, []);

    // Autoplay Timer
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [isHovered, bannerImages.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) {
            handleNext();
        } else if (distance < -50) {
            handlePrev();
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const features = [
        {
            icon: <WorkspacePremium sx={{ fontSize: 26, color: "#f59e0b" }} />,
            title: "Cam kết",
            description: "Giá cả hợp lý",
            borderColor: "rgba(245, 158, 11, 0.3)",
            bgHover: "rgba(254, 243, 199, 0.4)",
        },
        {
            icon: <LocalShipping sx={{ fontSize: 26, color: "#16a34a" }} />,
            title: "Giao nhanh",
            description: "Nội thành 2H",
            borderColor: "rgba(22, 163, 74, 0.3)",
            bgHover: "rgba(220, 252, 231, 0.4)",
        },
        {
            icon: <ThumbUp sx={{ fontSize: 26, color: "#0284c7" }} />,
            title: "Đảm bảo",
            description: "Sạch, Tươi, Mới",
            borderColor: "rgba(2, 132, 199, 0.3)",
            bgHover: "rgba(224, 242, 254, 0.4)",
        },
        {
            icon: <Spa sx={{ fontSize: 26, color: "#10b981" }} />,
            title: "Thân thiện",
            description: "Môi trường sống",
            borderColor: "rgba(16, 185, 129, 0.3)",
            bgHover: "rgba(209, 250, 229, 0.4)",
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2.5,
                    alignItems: "stretch",
                    width: "100%"
                }}
            >
                {/* 1. Sidebar Danh mục */}
                <Box
                    sx={{
                        width: { xs: "100%", md: 260 },
                        flexShrink: 0
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            height: { xs: "auto", md: 320 },
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
                        }}
                    >
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                                color: "#fff",
                                px: 2.5,
                                py: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
                                DANH MỤC SẢN PHẨM
                            </Typography>
                            <Chip
                                label={`${categories.length}`}
                                size="small"
                                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", height: 20, fontSize: "0.75rem", fontWeight: 700 }}
                            />
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                p: 1,
                                "&::-webkit-scrollbar": { width: 5 },
                                "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 3 }
                            }}
                        >
                            {loadingCat ? (
                                <Box sx={{ p: 1 }}>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <Skeleton key={n} height={36} sx={{ mb: 0.5, borderRadius: 1 }} />
                                    ))}
                                </Box>
                            ) : (
                                <List disablePadding>
                                    {categories.map((item) => (
                                        <ListItem
                                            key={item.id}
                                            component={Link}
                                            to={`/category/${item.slug}`}
                                            sx={{
                                                borderRadius: "10px",
                                                py: 1,
                                                px: 2,
                                                mb: 0.5,
                                                color: "#334155",
                                                textDecoration: "none",
                                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                "&:hover": {
                                                    bgcolor: "rgba(22, 163, 74, 0.08)",
                                                    color: "#16a34a",
                                                    transform: "translateX(4px)",
                                                    "& .category-icon": {
                                                        opacity: 1,
                                                        transform: "translateX(0)"
                                                    }
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={item.name}
                                                primaryTypographyProps={{
                                                    fontSize: "0.9rem",
                                                    fontWeight: 600
                                                }}
                                            />
                                            <ChevronRight
                                                className="category-icon"
                                                sx={{
                                                    fontSize: 18,
                                                    opacity: 0,
                                                    transform: "translateX(-6px)",
                                                    transition: "all 0.2s ease"
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </Paper>
                </Box>

                {/* 2. Banner Slider Container */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0
                    }}
                >
                    <Paper
                        elevation={0}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        sx={{
                            height: { xs: 220, sm: 280, md: 320 },
                            width: "100%",
                            borderRadius: "16px",
                            overflow: "hidden",
                            position: "relative",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            bgcolor: "#1e293b"
                        }}
                    >
                        {/* Slide Track */}
                        <Box
                            sx={{
                                display: "flex",
                                width: `${bannerImages.length * 100}%`,
                                height: "100%",
                                transform: `translateX(-${currentIndex * (100 / bannerImages.length)}%)`,
                                transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
                            }}
                        >
                            {bannerImages.map((img, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        width: `${100 / bannerImages.length}%`,
                                        height: "100%",
                                        position: "relative",
                                        flexShrink: 0
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={img}
                                        alt={`Banner Hoa ${idx + 1}`}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                    {/* Soft Vignette Overlay */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 100%)",
                                            pointerEvents: "none"
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>

                        {/* Prev Arrow */}
                        <IconButton
                            onClick={handlePrev}
                            aria-label="Previous Slide"
                            sx={{
                                position: "absolute",
                                left: 14,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 3,
                                bgcolor: "rgba(255, 255, 255, 0.85)",
                                backdropFilter: "blur(6px)",
                                color: "#1e293b",
                                width: 38,
                                height: 38,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                transition: "all 0.25s ease",
                                opacity: isHovered ? 1 : 0.7,
                                "&:hover": {
                                    bgcolor: "#ffffff",
                                    transform: "translateY(-50%) scale(1.1)",
                                    color: "#16a34a"
                                }
                            }}
                        >
                            <ArrowBackIosNew sx={{ fontSize: 16 }} />
                        </IconButton>

                        {/* Next Arrow */}
                        <IconButton
                            onClick={handleNext}
                            aria-label="Next Slide"
                            sx={{
                                position: "absolute",
                                right: 14,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 3,
                                bgcolor: "rgba(255, 255, 255, 0.85)",
                                backdropFilter: "blur(6px)",
                                color: "#1e293b",
                                width: 38,
                                height: 38,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                transition: "all 0.25s ease",
                                opacity: isHovered ? 1 : 0.7,
                                "&:hover": {
                                    bgcolor: "#ffffff",
                                    transform: "translateY(-50%) scale(1.1)",
                                    color: "#16a34a"
                                }
                            }}
                        >
                            <ArrowForwardIos sx={{ fontSize: 16 }} />
                        </IconButton>

                        {/* Indicator Pill Dots */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 14,
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                zIndex: 3,
                                bgcolor: "rgba(0, 0, 0, 0.3)",
                                backdropFilter: "blur(6px)",
                                px: 1.5,
                                py: 0.6,
                                borderRadius: "999px"
                            }}
                        >
                            {bannerImages.map((_, idx) => (
                                <Box
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    sx={{
                                        height: 8,
                                        width: currentIndex === idx ? 24 : 8,
                                        borderRadius: "999px",
                                        bgcolor: currentIndex === idx ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                                        cursor: "pointer",
                                        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                                        "&:hover": {
                                            bgcolor: "#ffffff"
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Box>

                {/* 3. Features Cards */}
                <Box
                    sx={{
                        width: { xs: "100%", md: 240 },
                        flexShrink: 0
                    }}
                >
                    <Box
                        sx={{
                            height: { xs: "auto", md: 320 },
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gridTemplateRows: { xs: "auto auto", md: "1fr 1fr" },
                            gap: "12px"
                        }}
                    >
                        {features.map((item, idx) => (
                            <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    p: 1.5,
                                    borderRadius: "14px",
                                    border: `1px solid ${item.borderColor}`,
                                    bgcolor: "#ffffff",
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                                        bgcolor: item.bgHover,
                                        borderColor: "transparent"
                                    }
                                }}
                            >
                                <Box sx={{ mb: 0.8, transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.15)" } }}>
                                    {item.icon}
                                </Box>
                                <Typography fontWeight={700} fontSize={13} color="#1e293b" lineHeight={1.2}>
                                    {item.title}
                                </Typography>
                                <Typography fontSize={11} color="#64748b" mt={0.3}>
                                    {item.description}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default HomeBanner;
