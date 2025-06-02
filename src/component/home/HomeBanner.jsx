import {
    Grid,
    Paper,
    Box,
    Typography,
    IconButton,
    Stack,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useState, useEffect } from "react";

const HomeBanner = () => {
    const bannerImages = [
        "https://tools.dalathasfarm.com/assets/2023/2023-04/a894a06ffef18edf4e48060cd6040b1e.jpg",
        "https://tools.dalathasfarm.com/assets/2024/2024-01/1caefd022bdb73b8ccbde96f54b9369e.jpg",
        "https://tools.dalathasfarm.com/assets/2023/2023-03/dff67f171dd7d839c1e4e664c44160e6.jpg",
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [slideDirection, setSlideDirection] = useState('left');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const categories = [
        "Dâu Tây Hasfarm",
        "Hoa Cưới",
        "Bình Hoa",
        "Hoa Chúc Mừng",
        "Hoa Chia Buồn",
        "Hoa Xinh Giá Tốt",
        "E-Gift Voucher",
        "Phụ Liệu Hoa",
    ];


    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setSlideDirection('left');
        setCurrentImage((prev) => (prev + 1) % bannerImages.length);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setSlideDirection('right');
        setCurrentImage((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
        setTimeout(() => setIsTransitioning(false), 800);
    };

    const features = [
        {
            icon: "/icons/price.png",
            title: "Cam kết",
            description: "Giá cả hợp lý",
            borderColor: "#FFA500",
        },
        {
            icon: "/icons/delivery.png",
            title: "Giao nhanh",
            description: "Nội thành",
            borderColor: "#00AA66",
        },
        {
            icon: "/icons/fresh.png",
            title: "Đảm bảo",
            description: "Sạch, Tươi, Mới",
            borderColor: "#00AA66",
        },
        {
            icon: "/icons/eco.png",
            title: "Thân thiện",
            description: "Môi trường sống",
            borderColor: "#FFA500",
        },
    ];

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="stretch" sx={{ mt: 2 }}>
            {/* Sidebar */}
            <Grid item xs={12} sm={3}>
                <Paper
                    elevation={2}
                    sx={{
                        height: 260,  // Fixed height to match banner
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: "#fff",
                            bgcolor: "#16a34a",
                            p: 1.5,
                            textAlign: 'center',
                            flexShrink: 0 // Prevents header from shrinking
                        }}
                    >
                        DANH MỤC
                    </Typography>
                    <Box sx={{
                        flex: 1,  // Takes remaining space
                        overflowY: 'auto' // Adds scroll when content overflows
                    }}>
                        <List sx={{ p: 0 }}>
                            {categories.map((item, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        '&:hover': {
                                            color: '#16a34a',
                                            bgcolor: 'rgba(22, 163, 74, 0.1)',
                                            cursor: 'pointer'
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={item}
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>
            </Grid>

            {/* Banner with slide effect */}
            <Grid item xs={12} sm={6}>
                <Paper
                    elevation={2}
                    sx={{
                        height: 260,
                        overflow: "hidden",
                        borderRadius: "15px",
                        position: "relative"
                    }}
                >
                    <Box
                        component="img"
                        src={bannerImages[currentImage]}
                        alt="Banner"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            animation: `${slideDirection === 'left' ? 'slideLeft' : 'slideRight'} 0.8s ease-in-out`,
                            '@keyframes slideLeft': {
                                from: {
                                    transform: 'translateX(100%)',
                                    opacity: 0.5
                                },
                                to: {
                                    transform: 'translateX(0)',
                                    opacity: 1
                                }
                            },
                            '@keyframes slideRight': {
                                from: {
                                    transform: 'translateX(-100%)',
                                    opacity: 0.5
                                },
                                to: {
                                    transform: 'translateX(0)',
                                    opacity: 1
                                }
                            }
                        }}
                    />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            right: 0,
                            transform: "translateY(-50%)",
                            px: 1
                        }}
                    >
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.7)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.7)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" }
                            }}
                        >
                            <ArrowForward />
                        </IconButton>
                    </Stack>
                </Paper>
            </Grid>

            {/* Features */}
            <Grid item xs={12} sm={3}>
                <Grid
                    container
                    spacing={1}
                    sx={{
                        height: 260,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '8px'
                    }}
                >
                    {features.map((item, idx) => (
                        <Paper
                            key={idx}
                            elevation={1}
                            sx={{
                                height: '100%',
                                p: 1.5,
                                border: `1px solid ${item.borderColor}`,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                component="img"
                                src={item.icon}
                                alt={item.title}
                                sx={{ height: 40, mb: 1 }}
                            />
                            <Typography fontWeight={600} fontSize={14}>
                                {item.title}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                                {item.description}
                            </Typography>
                        </Paper>
                    ))}
                </Grid>
            </Grid>
        </Grid >
    );
};

export default HomeBanner;
