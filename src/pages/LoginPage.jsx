import AuthLoginTemplate from "./AuthLoginTemplate";

export default function LoginPage() {
  return (
    <AuthLoginTemplate
      role="CUSTOMER"
      title="Cinema Listic"
      subtitle="Customer login"
      registerPath="/register"
    />
  );
}
