import AuthLoginTemplate from "../AuthLoginTemplate";

export default function AdminLoginPage() {
  return (
    <AuthLoginTemplate
      role="ADMIN"
      title="Cinema Listic Admin"
      subtitle="Admin login"
      registerPath="/admin/register"
    />
  );
}
