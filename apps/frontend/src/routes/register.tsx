import { createFileRoute } from "@tanstack/react-router";
import RegistrationForm from "@/components/RegistrationForm";
export const Route = createFileRoute('/register')({
    component: RegistrationPage,
  })

function RegistrationPage() {
    return (
    
        <RegistrationForm />
      
    )
}