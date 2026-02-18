import AuthRegisterTemplate from "./AuthRegisterTemplate";

export default function RegisterPage() {
  return (
    <AuthRegisterTemplate
      role="CUSTOMER"
      title="Cinema Listic Customer"
      subtitle="Join the club for faster checkout, rewards, and saved seats."
      loginPath="/login"
    />
  );
}
