import { createFileRoute } from "@tanstack/react-router";
import RegistrationForm from "@/components/RegistrationForm";
export const Route = createFileRoute('/register')({
    component: RegistrationPage,
  })

function RegistrationPage() {
    return (
      <div className=" flex items-center justify-center bg-gradient-to-br from-[#f5f4ea] to-[#f8f7ed]">
        <RegistrationForm />
      </div>
    )
}