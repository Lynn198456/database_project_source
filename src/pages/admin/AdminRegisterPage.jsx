import AuthRegisterTemplate from "../AuthRegisterTemplate";

export default function AdminRegisterPage() {
  return (
    <AuthRegisterTemplate
      role="ADMIN"
      title="Cinema Listic Admin"
      subtitle="Create an admin account for full management access."
      loginPath="/admin/login"
    />
  );
}
