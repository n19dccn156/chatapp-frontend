import { Row, Col, Input, Button, Form, Select, Upload, UploadProps, UploadFile, message } from "antd";
import { IRegisterForm } from "../interface/user.me";
import { onRegister } from "../api/user.me";
import { useNavigate } from "react-router-dom";
import { CameraOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { onSaveFile } from "../api/file";

export default function RegisterPage() {

    const navigate = useNavigate();
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

    function onFinish(form: IRegisterForm) {
        if(fileList.length === 0) {
            message.warning("Hãy chọn ảnh đại diện.");
            return;
        }
        onSaveFile(fileList[0].originFileObj as Blob)
        .then(url => {
            form.avatar = url;
            onRegister(form)
            .then(() => {
                message.success("Tạo tài khoản thành công.")
                navigate("/login");
                return;
            })
            .catch(res => {
                message.error(res.response.data.message);
            });
        })
        .catch(message => {
            message.error(message)
        })
    }

    function onLogin() {
        navigate("/login")
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <Row>
            <Col span={12} offset={10} style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
                <Form<IRegisterForm>
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 400, minWidth: 400, backgroundColor: '#f0f0f0', padding: '32px 32px 0', borderRadius: 8 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item 
                        label={<CameraOutlined style={{fontSize: 40}}/>}>
                        <Upload
                            beforeUpload={() =>{return false;}}
                            listType="picture-circle"
                            onChange={handleChange}
                        >
                            {fileList.length > 0 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Email" name="email" 
                        rules={[{ required: true, message: 'Email không bỏ trống' }, 
                                { type: 'email', message: 'Email không hợp lệ'}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu" name="password" 
                        rules={[{ required: true, message: 'Mật khẩu không bỏ trống' },
                                { min: 6, message: 'Mật khẩu phải từ 6 ký tự'}]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Biệt danh" name="nickname" rules={[{ required: true, message: 'Biệt danh không bỏ trống' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính" name="gender" 
                        rules={[{ required: true, message: 'Giới tính không bỏ trống' }]}
                    >
                        <Select>
                            <Select.Option value="MALE">Nam</Select.Option>
                            <Select.Option value="FEMALE">Nữ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                        <Button danger onClick={onLogin} style={{marginLeft: 16}}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}
