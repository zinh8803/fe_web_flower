import { Typography, Link, Box } from "@mui/material";

const Breadcrumb = ({ items }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
            {items.map((item, idx) => (
                <span key={idx}>
                    {item.href ? (
                        <Link
                            sx={{
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span style={{ color: '#333', fontWeight: 'bold' }}>{item.label}</span>
                    )}
                    {idx < items.length - 1 && " / "}
                </span>
            ))}
        </Typography>
    </Box>
);

export default Breadcrumb;