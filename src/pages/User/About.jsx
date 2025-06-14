import React from "react";
import { Box, Container, Typography } from "@mui/material";

const About = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            color: '#333'
        }}>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Về Chúng Tôi
                </Typography>
                <Typography variant="body1" paragraph>
                    Chào mừng bạn đến với cửa hàng hoa trực tuyến của chúng tôi! Chúng tôi chuyên cung cấp các loại hoa tươi đẹp nhất, từ hoa sinh nhật, hoa cưới cho đến hoa tang lễ. Với đội ngũ nhân viên tận tâm và chuyên nghiệp, chúng tôi cam kết mang đến cho bạn những sản phẩm chất lượng cao nhất.
                </Typography>
                <Typography variant="body1" paragraph>
                    Chúng tôi hiểu rằng mỗi bó hoa đều mang trong mình một thông điệp đặc biệt. Vì vậy, chúng tôi luôn cố gắng tạo ra những sản phẩm không chỉ đẹp mắt mà còn ý nghĩa. Hãy để chúng tôi giúp bạn gửi gắm tình cảm của mình qua những bông hoa tươi thắm.
                </Typography>
                <Typography variant="body1" paragraph>
                    Ngoài ra, chúng tôi còn cung cấp dịch vụ giao hàng nhanh chóng và tiện lợi, đảm bảo hoa của bạn sẽ đến tay người nhận trong tình trạng tốt nhất. Hãy cùng khám phá bộ sưu tập hoa của chúng tôi và tìm cho mình những sản phẩm ưng ý nhất!
                </Typography>
                <Typography variant="body1" paragraph>
                    Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi. Chúng tôi rất mong được phục vụ bạn trong thời gian tới!
                </Typography>
            </Container>

        </Box>
    );
};

export default About;
