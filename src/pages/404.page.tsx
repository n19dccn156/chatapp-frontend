import { Button, Result } from "antd";

export default function NotFoundPage() {
    return (
        <div>
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, Trang bạn tìm không tồn tại"
                extra={<Button type="primary">Trang chủ</Button>}
            />
        </div>
    )
}
