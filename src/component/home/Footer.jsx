import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Button,
  Paper
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Logo from "../../assets/img/LOGO_HOA.png";

export default function Footer() {
  return (
    <Box component="footer" display="flex" flexDirection="column" minHeight="1px">
      <Box sx={{ bgcolor: "#f8f9fa", py: 6, flex: "1 0 auto" }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            alignItems="flex-start"
            sx={{
              textAlign: { xs: 'center', md: 'inherit' },
              justifyContent: { md: "space-between" }
            }}
          >
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' }
              }}
            >
              <img
                src={Logo}
                alt="Dalat Hasfarm"
                style={{ height: 48, marginBottom: 12 }}
              />
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 260, width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    mb: 1,
                    fontSize: '1rem',
                  }}
                >
                  Công ty TNHH HOA SHOP
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    fontSize: '13px',
                  }}
                >
                  HOA SHOP - Được biết đến là công ty tiên phong mở đầu cho việc trồng hoa chuyên nghiệp tại Việt Nam được thành lập từ năm 1994.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    mt: 1,
                    fontSize: '13px',
                  }}
                >
                  Năm 2013 HOA SHOP được tạp chí Flowers Tech có trụ sở tại Mỹ bình chọn là công ty hoa tươi lớn nhất Đông Nam Á.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    mt: 1,
                    fontSize: '13px',
                  }}
                >
                  <strong>- Địa chỉ trụ sở:</strong> Quận 1, TP. Hồ Chí Minh
                </Typography>
                {/* <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    mt: 1,
                    fontSize: '13px',
                  }}
                >
                  <strong>- Giấy chứng nhận Đăng ký Doanh nghiệp số:</strong> <strong>5800000167</strong> do Sở Kế hoạch và Đầu tư Tỉnh Lâm Đồng cấp ngày 07/06/1994
                </Typography> */}
              </Box>
            </Grid>

            {/* WEBSHOP */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'center' },
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 3,
                  fontSize: '1rem'
                }}
              >
                WEBSHOP
              </Typography>
              <Box sx={{ width: '100%', textAlign: 'center', maxWidth: 220 }}>
                <Stack spacing={2}>
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Cẩm nang
                  </Link>
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Khuyến mãi
                  </Link>
                </Stack>
              </Box>
            </Grid>

            {/* THÔNG TIN */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'center' },
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 3,
                  fontSize: '1rem'
                }}
              >
                THÔNG TIN
              </Typography>
              <Box sx={{ width: '100%', textAlign: 'center', maxWidth: 220 }}>
                <Stack spacing={2}>
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Giới thiệu Hoa Shop
                  </Link>
                  {/* <Link
                    href="#"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Shop Dalat Hasfarm
                  </Link> */}
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Chính sách bảo mật
                  </Link>
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Hướng dẫn mua hàng
                  </Link>
                  <Link
                    href="/about"
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#4CAF50',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Điều khoản sử dụng
                  </Link>
                </Stack>
              </Box>
            </Grid>

            {/* LIÊN HỆ */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  mb: 3,
                  fontSize: '1rem'
                }}
              >
                LIÊN HỆ
              </Typography>
              <Box sx={{ width: '100%', textAlign: { xs: 'center', md: 'left' }, maxWidth: 260 }}>
                <Stack spacing={2.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    justifyContent={{ xs: "center", md: "flex-start" }}
                  >
                    <EmailIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Email Đặt Hàng:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        hoashop@hoashop.com
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    justifyContent={{ xs: "center", md: "flex-start" }}
                  >
                    <EmailIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Email CSKH:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        hotro@hoashop.com
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    justifyContent={{ xs: "center", md: "flex-start" }}
                  >
                    <PhoneIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333', textAlign: "left" }}>
                      Hotline: 1800 1143
                    </Typography>
                  </Stack>


                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Copyright  */}
      <Box
        sx={{
          bgcolor: "#e9ecef",
          py: 2.5,
          textAlign: 'center',
          mt: "auto"
        }}
      >
        <Typography variant="body2" sx={{ color: '#666' }}>
          © 2020 Hoa Shop. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}