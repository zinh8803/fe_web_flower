import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditorTinymce = ({ value, onChange, height = 300, placeholder = "Nhập mô tả sản phẩm..." }) => {
    const API_KEY = import.meta.env.VITE_API_TINY_MCE_KEY;

    return (
        <Editor
            apiKey={API_KEY}
            value={value}
            onEditorChange={onChange}
            init={{
                height,
                menubar: true,
                plugins: ['image', 'link', 'code', 'preview'],
                toolbar:
                    'undo redo | bold italic underline | alignleft aligncenter alignright | image | code preview',
                automatic_uploads: false,
                file_picker_types: 'image',
                file_picker_callback: function (cb, value, meta) {
                    if (meta.filetype === 'image') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.onchange = function () {
                            const file = input.files[0];
                            const reader = new FileReader();
                            reader.onload = function () {
                                const base64 = reader.result;
                                cb(base64, { title: file.name });
                            };
                            reader.readAsDataURL(file);
                        };
                        input.click();
                    }
                },
                placeholder,
            }}
        />
    );
};

export default RichTextEditorTinymce;