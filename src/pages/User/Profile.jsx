import React, { useEffect, useState } from "react";
import { getProfile, getUpdateProfile } from "../../services/userService";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import ProfileForm from "../../component/user/ProfileForm";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        const token = localStorage.getItem("token");
        getProfile(token)
            .then(res => {
                setProfile(res.data.data);
                setForm(res.data.data);
            })
            .finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", form.name || "");
        formData.append("phone", form.phone || "");
        formData.append("address", form.address || "");
        if (form.image) {
            formData.append("image", form.image);
        }
        try {
            await getUpdateProfile(token, formData);
            // Lấy lại profile mới nhất
            getProfile(token).then(res => {
                setProfile(res.data.data);
                setForm(res.data.data);
                dispatch(setUser({ user: res.data.data, token }));
            });
        } catch (error) {
            console.error("Cập nhật thông tin thất bại:", error);
            alert("Cập nhật thất bại!");
        }
    };

    if (loading) return <Typography>Đang tải...</Typography>;
    if (!profile) return <Typography>Không tìm thấy thông tin tài khoản.</Typography>;

    return (
        <ProfileForm
            form={form}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            loading={loading}
        />
    );
};

export default Profile;