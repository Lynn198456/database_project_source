import AuthLoginTemplate from "../AuthLoginTemplate";

export default function StaffLoginPage() {
  return (
    <AuthLoginTemplate
      role="STAFF"
      title="Cinema Listic Staff"
      subtitle="Staff login"
      registerPath="/staff/register"
    />
  );
}
