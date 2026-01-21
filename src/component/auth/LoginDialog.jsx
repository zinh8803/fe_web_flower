// @ts-nocheck
import {
  Dialog,
  DialogContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { orange } from "@mui/material/colors";
import RegisterDialog from "./RegisterDialog";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { login, getProfile, loginWithGoogle } from "../../services/userService";
import { useState, useEffect, useRef } from "react";
import { showNotification } from "../../store/notificationSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginDialog = ({ open, onClose }) => {
  const [openRegister, setOpenRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showCurrent, setShowCurrent] = useState(false);
  const googleBtnRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    // Load Google Identity script nếu chưa có
    if (!document.getElementById("google-identity")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-identity";
      script.onload = () => setGoogleReady(true);
      document.body.appendChild(script);
    } else {
      setGoogleReady(true);
    }
  }, []);

  // Hàm xử lý credential từ Google
  const handleGoogleCredential = async (response) => {
    setLoading(true);
    try {
      const credential = response.credential;
      await loginWithGoogle(credential);
      const profileRes = await getProfile();
      const userData = profileRes.data.data;

      dispatch(setUser({ user: userData }));
      localStorage.setItem("user", JSON.stringify(userData));

      dispatch(
        showNotification({
          message: "Đăng nhập Google thành công!",
          severity: "success",
        })
      );

      onClose(false);
    } catch (error) {
      dispatch(
        showNotification({
          message: "Đăng nhập Google thất bại!",
          severity: "error",
        })
      );
      console.error("Google login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Đảm bảo render nút Google khi dialog mở và script đã sẵn sàng
  useEffect(() => {
    let retryTimeout;
    function tryRenderGoogleButton() {
      if (
        open &&
        googleBtnRef.current &&
        window.google &&
        window.google.accounts &&
        window.google.accounts.id &&
        GOOGLE_CLIENT_ID
      ) {
        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          locale: "vi",
        });
      } else if (open) {
        // Nếu chưa sẵn sàng, thử lại sau 200ms
        retryTimeout = setTimeout(tryRenderGoogleButton, 200);
      }
    }
    if (open) {
      tryRenderGoogleButton();
    }
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
    // eslint-disable-next-line
  }, [open, googleReady, GOOGLE_CLIENT_ID]);

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseAll = () => {
    setOpenRegister(false);
    onClose(false);
  };

  const handleSwitchToLogin = () => {
    setOpenRegister(false);
    setTimeout(() => {
      onClose(true);
    }, 100);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      const profileRes = await getProfile();
      const userData = profileRes.data.data;

      dispatch(setUser({ user: userData }));
      localStorage.setItem("user", JSON.stringify(userData));

      dispatch(
        showNotification({
          message: "Đăng nhập thành công!",
          severity: "success",
        })
      );

      onClose(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(
          showNotification({
            message: "Tài khoản của bạn đã bị khóa.",
            severity: "error",
          })
        );
      } else {
        dispatch(
          showNotification({
            message: "Tài khoản hoặc mật khẩu không đúng!",
            severity: "error",
          })
        );
      }
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseAll}>
        <DialogContent
          sx={{
            width: { xs: "100%", sm: "600px" },
            padding: 3,
            position: "relative",
          }}>
          {/* Add Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleCloseAll}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold" color="green" mb={2}>
            Đăng nhập
          </Typography>

          <Typography variant="body1" fontWeight="bold">
            Đăng nhập bằng email
          </Typography>
          <TextField
            fullWidth
            label="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!email && email !== ""}
            helperText={!email && email !== "" ? "Vui lòng nhập email" : ""}
          />

          <Typography variant="body1" fontWeight="bold">
            Mật khẩu
          </Typography>
          <TextField
            fullWidth
            label="Mật khẩu"
            type={showCurrent ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!password && password !== ""}
            helperText={
              !password && password !== "" ? "Vui lòng nhập mật khẩu" : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => setShowCurrent((show) => !show)}
                    edge="end">
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}>
            <FormControlLabel control={<Checkbox />} label="Ghi nhớ mật khẩu" />
            <Link
              href="/reset-password"
              fontSize={14}
              fontWeight="bold"
              sx={{ color: orange[500], textDecoration: "none" }}>
              Quên mật khẩu ?
            </Link>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center">
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "orange",
                borderRadius: 5,
                maxWidth: "80%",
              }}
              onClick={() => {
                if (!email || !password) {
                  dispatch(
                    showNotification({
                      message: "Vui lòng nhập đầy đủ email và mật khẩu!",
                      severity: "warning",
                    })
                  );
                  return;
                }
                handleLogin();
              }}
              size="large">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "ĐĂNG NHẬP"
              )}
            </Button>
            {/* Nút đăng nhập Google không dùng thư viện */}
            <Box mt={2} width="80%" display="flex" justifyContent="center">
              <div ref={googleBtnRef} style={{ width: "100%" }}></div>
            </Box>
          </Box>

          <Box mt={2} textAlign="center">
            <Typography fontSize={14}>
              Bạn chưa có tài khoản?{" "}
              <Link
                onClick={handleOpenRegister}
                sx={{
                  color: "orange",
                  fontWeight: "bold",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                Đăng ký
              </Link>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <RegisterDialog
        open={openRegister}
        onClose={handleCloseAll}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default LoginDialog;
