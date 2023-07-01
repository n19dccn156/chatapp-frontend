import { Button, Checkbox, Col, Form, Input, Row, message } from "antd";
import { onLogin } from "../api/user.me";
import { ILoginForm } from "../interface/user.me";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    function onFinish(form: ILoginForm) {
        onLogin(form)
        .then(() => {
            message.success("Đăng nhập thành công.");
            localStorage.setItem("email", form.email);
            navigate("/");
        })
        .catch(() => {
            message.error("Tài khoản hoặc mật khẩu sai.")
        })
    }

    function onRegister() {
        navigate("/register");
    }

    return (
        <Row>
            <Col span={16} offset={8} style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
                <Form<ILoginForm>
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 800, minWidth: 400, backgroundColor: '#f0f0f0', padding: '32px 32px 0', borderRadius: 8 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email không bỏ trống' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không bỏ trống' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox>Nhớ tài khoản</Checkbox>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
                        <Button danger onClick={onRegister} style={{marginLeft: 16}}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}
