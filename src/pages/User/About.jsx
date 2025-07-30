import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import SubscribeBell from "../../component/home/SubscribeBell";
import dathoa from "../../assets/img/dathoa.jpg";
import camhoa from "../../assets/img/camhoa.jpg";
import giaohoa from "../../assets/img/giaohoa.jpg";
const About = () => {
    document.title = 'Trang giới thiệu';

    return (
        <Box sx={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>


            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <Box sx={{ p: 3, borderRadius: 2, bgcolor: "#fff" }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4,
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="h4" sx={{ mb: 2, color: '#8D6E63', textAlign: 'center' }}>
                                Về Chúng Tôi
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Chào mừng bạn đến với cửa hàng hoa trực tuyến của chúng tôi – nơi gửi gắm những thông điệp yêu thương qua từng cánh hoa tươi thắm.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Chúng tôi cung cấp đa dạng các loại hoa cho mọi dịp lễ: sinh nhật, cưới hỏi, khai trương, chia buồn và các sự kiện đặc biệt khác.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Mỗi bó hoa là một tác phẩm nghệ thuật được tạo nên từ sự tâm huyết và gu thẩm mỹ tinh tế của đội ngũ nghệ nhân.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Chúng tôi luôn chọn hoa tươi nhất trong ngày, kết hợp cùng phong cách gói hiện đại, trang nhã và đúng yêu cầu khách hàng.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Giao hàng nhanh chóng, đúng giờ, đúng địa điểm là cam kết không đổi từ khi thành lập đến nay.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Hãy để chúng tôi đồng hành cùng bạn, lan tỏa cảm xúc chân thành đến những người bạn yêu thương.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Đội ngũ nhân viên tư vấn luôn sẵn sàng lắng nghe và hỗ trợ bạn lựa chọn sản phẩm phù hợp nhất với nhu cầu.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Chúng tôi cũng cung cấp dịch vụ đặt hoa theo yêu cầu và thiết kế riêng theo phong cách bạn mong muốn.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Từng đơn hàng đều được chăm chút cẩn thận từ khâu chọn hoa đến đóng gói và giao đến tận tay người nhận.
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: '#555' }}>
                                Chọn chúng tôi – bạn chọn một dịch vụ tận tâm, uy tín và giàu cảm xúc trong từng khoảnh khắc yêu thương.
                            </Typography>

                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <CardMedia
                                component="img"
                                image="https://bizweb.dktcdn.net/100/487/411/files/shop-hoa-tuoi-quan-7-hcm.jpg?v=1726122260430"
                                alt="Giới thiệu cửa hàng"
                                sx={{ borderRadius: 3, boxShadow: 3, width: '100%', height: 'auto' }}
                            />
                        </Box>
                    </Box>



                    <Box sx={{ backgroundColor: '#', py: 5 }}>
                        <Container>
                            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#BF360C' }}>
                                Cam Kết Chất Lượng
                            </Typography>
                            <Grid container spacing={4}>
                                {[
                                    {
                                        text: 'Hoa luôn tươi mới và được bảo quản cẩn thận.',
                                        image: 'https://bizweb.dktcdn.net/thumb/large/100/487/411/products/7ce7dcae-4e2e-47fe-8457-a8ffe03fb4ad.jpg?v=1731985244440',
                                    },
                                    {
                                        text: 'Giao hàng miễn phí trong nội thành.',
                                        image: 'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/4f04fa979dc84efc9cd17e21143fa170-1710822586.jpeg&w=273&h=280&zc=1&q=80',
                                    },
                                    {
                                        text: 'Thiết kế hoa độc đáo, phù hợp mọi sự kiện.',
                                        image: 'https://hoatuoiciti.com/timthumb.php?src=upload/sanpham/z5817742168550a4904a2db9454a4dffe27fe32e3c4567-1725981606.jpg&w=273&h=280&zc=1&q=80',
                                    },
                                ].map((item, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                            <CardMedia
                                                component="img"
                                                image={item.image}
                                                alt={item.text}
                                                sx={{
                                                    height: 200,
                                                    objectFit: 'cover',
                                                    borderRadius: '8px 8px 0 0',
                                                }}
                                            />
                                            <CardContent>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6D4C41' }}
                                                >
                                                    {item.text}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Box>

                    <Box sx={{ backgroundColor: '#', py: 5 }}>
                        <Container>
                            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#BF360C' }}>
                                Dịch Vụ Của Chúng Tôi
                            </Typography>
                            <Grid container spacing={4}>
                                {[
                                    {
                                        text: 'Giao Hoa Tận Nơi - Dịch vụ giao hoa nhanh chóng',
                                        image: giaohoa
                                    },
                                    {
                                        text: 'Cắm Hoa Sự Kiện - Dịch vụ trang trí',
                                        image: camhoa
                                    },
                                    {
                                        text: 'Đặt Hoa Online - Dễ dàng đặt hoa online.',
                                        image: dathoa
                                    },
                                ].map((item, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Card sx={{
                                            boxShadow: 3, borderRadius: 2, flexDirection: 'column', height: '100%',
                                            display: 'flex',
                                        }}>
                                            <CardMedia
                                                component="img"
                                                image={item.image}
                                                alt={item.text}
                                                sx={{
                                                    height: 200,
                                                    objectFit: 'cover',
                                                    borderRadius: '8px 8px 0 0',
                                                }}
                                            />
                                            <CardContent>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ textAlign: 'center', fontWeight: 'bold', color: '#6D4C41' }}
                                                >
                                                    {item.text}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Box>

                    <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#BF360C', mb: 2 }}>
                            Ưu Đãi & Khuyến Mãi
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6D4C41', maxWidth: '600px', mx: 'auto', lineHeight: 1.8 }}>
                            Nhận ưu đãi hấp dẫn khi mua hàng và đăng ký tài khoản thành viên. Đừng bỏ lỡ các chương trình khuyến mãi giảm giá từ chúng tôi!
                        </Typography>
                    </Box>



                    <SubscribeBell />
                </Box>
            </Box>
        </Box >
    );
};

export default About;
