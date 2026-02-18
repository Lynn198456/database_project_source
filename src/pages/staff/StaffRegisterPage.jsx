import AuthRegisterTemplate from "../AuthRegisterTemplate";

export default function StaffRegisterPage() {
  return (
    <AuthRegisterTemplate
      role="STAFF"
      title="Cinema Listic Staff"
      subtitle="Create a staff account for operations and scheduling."
      loginPath="/staff/login"
    />
  );
}
