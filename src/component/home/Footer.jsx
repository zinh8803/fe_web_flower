import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
  Button,
  Paper
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Footer() {


  return (
    <Box component="footer"
      py={2}
      boxShadow={1}
      bgcolor="#fff"

    >


      <Box sx={{ bgcolor: "#f8f9fa", py: 6 }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ textAlign: { xs: 'center', md: 'inherit' } }}
          >
            {/* Company Info - nằm ngoài cùng bên trái */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <img
                src="https://shop.dalathasfarm.com/public/dalathasfarm/images/footer-logo.png"
                alt="Dalat Hasfarm"
                style={{ height: 48, marginBottom: 12 }}
              />
              <Box sx={{ textAlign: 'left', maxWidth: 260, width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    mb: 1,
                    fontSize: '1rem',
                    textAlign: 'left'
                  }}
                >
                  Công ty TNHH Dalat Hasfarm
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  Dalat Hasfarm - Được biết đến là công ty tiên phong mở đầu cho việc trồng hoa chuyên nghiệp tại Việt Nam được thành lập từ năm 1994.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    mt: 1,
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  Năm 2013 Dalat Hasfarm được tạp chí Flowers Tech có trụ sở tại Mỹ bình chọn là công ty hoa tươi lớn nhất Đông Nam Á.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    mt: 1,
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <strong>- Địa chỉ trụ sở:</strong> 450 Nguyễn Tử Lực, P.8, Đà Lạt, Lâm Đồng, Việt Nam
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                    mt: 1,
                    fontSize: '13px',
                    textAlign: 'left'
                  }}
                >
                  <strong>- Giấy chứng nhận Đăng ký Doanh nghiệp số:</strong> <strong>5800000167</strong> do Sở Kế hoạch và Đầu tư Tỉnh Lâm Đồng cấp ngày 07/06/1994
                </Typography>
              </Box>
            </Grid>

            {/* Webshop Menu */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
              <Box sx={{ width: '100%', textAlign: 'left', maxWidth: 220 }}>
                <Stack spacing={2}>
                  <Link
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
                    Trang chủ
                  </Link>
                  <Link
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
                    Cẩm nang
                  </Link>
                  <Link
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
                    Khuyến mãi
                  </Link>
                </Stack>
              </Box>
            </Grid>

            {/* Company Info Menu */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
              <Box sx={{ width: '100%', textAlign: 'left', maxWidth: 220 }}>
                <Stack spacing={2}>
                  <Link
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
                    Giới thiệu Dalat Hasfarm
                  </Link>
                  <Link
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
                  </Link>
                  <Link
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
                    Chính sách bảo mật
                  </Link>
                  <Link
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
                    Hướng dẫn mua hàng
                  </Link>
                  <Link
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
                    Điều khoản sử dụng
                  </Link>
                </Stack>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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

              <Box sx={{ width: '100%', textAlign: 'left', maxWidth: 260 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <EmailIcon sx={{ color: '#4CAF50', fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Email Đặt Hàng:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        webshop@dalathasfarm.com
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <EmailIcon sx={{ color: '#4CAF50', fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Email CSKH:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        hotro@dalathasfarm.com
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <PhoneIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Hotline: 1800 1143
                    </Typography>
                  </Stack>

                  {/* Certification Badges */}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: '#4CAF50',
                        fontSize: '11px',
                        '&:hover': { bgcolor: '#45a049' }
                      }}
                    >
                      DMCA
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: '#4CAF50',
                        color: 'white',
                        fontSize: '11px',
                        '&:hover': { bgcolor: '#45a049' }
                      }}
                    >
                      PROTECTED
                    </Button>
                  </Stack>

                  {/* Government Certification */}
                  <Paper
                    elevation={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: '#1976d2',
                      color: 'white',
                      p: 1.5,
                      borderRadius: 2,
                      mt: 2
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 35 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
                        ĐÃ THÔNG BÁO
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '11px' }}>
                        BỘ CÔNG THƯƠNG
                      </Typography>
                    </Box>
                  </Paper>
                </Stack>
              </Box>
            </Grid>
          </Grid>




        </Container>
      </Box>

      {/* Copyright */}
      <Box sx={{ bgcolor: "#e9ecef", py: 2.5, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          © 2020 Dalathasfarm. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}