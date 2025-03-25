import { X, CheckCircle, XCircle, AlertCircle, HelpCircle } from "lucide-react";
import { ReactNode } from "react";

type NotificationVariant = "success" | "error" | "warning" | "info" | "question";

interface NotificationProps {
  title: string;
  message?: string;
  variant: NotificationVariant;
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  success: {
    bg: "bg-gradient-to-r from-green-900/90 to-green-600/90",
    bubble: "bg-green-700",
    icon: <CheckCircle className="h-4 w-4 text-white" />,
  },
  error: {
    bg: "bg-gradient-to-r from-red-900/90 to-red-600/90",
    bubble: "bg-red-700",
    icon: <XCircle className="h-4 w-4 text-white" />,
  },
  warning: {
    bg: "bg-gradient-to-r from-amber-900/90 to-amber-600/90", 
    bubble: "bg-amber-600",
    icon: <AlertCircle className="h-4 w-4 text-white" />,
  },
  info: {
    bg: "bg-gradient-to-r from-blue-900/90 to-blue-600/90",
    bubble: "bg-blue-700",
    icon: <AlertCircle className="h-4 w-4 text-white" />,
  },
  question: {
    bg: "bg-gradient-to-r from-blue-900/90 to-blue-600/90",
    bubble: "bg-blue-700",
    icon: <HelpCircle className="h-4 w-4 text-white" />,
  },
};

export function Notification({ title, message, variant, onClose, className }: NotificationProps) {
  const styles = variantStyles[variant];
  
  return (
    <div className={`relative rounded-2xl ${styles.bg} p-4 text-white shadow-lg ${className || ""}`}>
      <div className="absolute -left-2.5 -top-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-lg z-10 overflow-visible">
        <div className={`absolute inset-0 ${styles.bubble} rounded-full opacity-80`}></div>
        <div className="relative">
          {styles.icon}
        </div>
      </div>
      
      <div className="absolute -right-4 -top-4">
        {onClose && (
          <button 
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-black/70 hover:bg-white/30 transition-colors"
          >
            <X className="h-2.5 w-2.5 text-white" />
          </button>
        )}
      </div>
      
      <div className="ml-4">
        <h3 className="text-base font-medium text-white">{title}</h3>
        {message && <p className="mt-0.5 text-sm text-white/90">{message}</p>}
      </div>
      
      {/* Decorative bubbles */}
      <div className="absolute -z-10 inset-0 overflow-hidden rounded-2xl">
        <div className="absolute left-4 bottom-2 h-2.5 w-2.5 rounded-full bg-white/10"></div>
        <div className="absolute left-10 bottom-5 h-1.5 w-1.5 rounded-full bg-white/10"></div>
        <div className="absolute right-5 bottom-3 h-1.5 w-1.5 rounded-full bg-white/10"></div>
        <div className="absolute left-5 top-5 h-3 w-3 rounded-full bg-white/10"></div>
        <div className="absolute right-8 top-2 h-2.5 w-2.5 rounded-full bg-white/10"></div>
        <div className="absolute right-3 bottom-10 h-1 w-1 rounded-full bg-white/10"></div>
      </div>
    </div>
  );
}

// Predefined notification components
export function SuccessNotification({ onClose, className }: { onClose?: () => void, className?: string }) {
  return (
    <Notification
      variant="success"
      title="Well done!"
      message="Your message has been sent successfully."
      onClose={onClose}
      className={className}
    />
  );
}

export function ErrorNotification({ onClose, className }: { onClose?: () => void, className?: string }) {
  return (
    <Notification
      variant="error"
      title="Oh snap!"
      message="Change a few things up and try submitting again."
      onClose={onClose}
      className={className}
    />
  );
}

export function InfoNotification({ onClose, className }: { onClose?: () => void, className?: string }) {
  return (
    <Notification
      variant="info"
      title="Heads up!"
      message="This alert needs your attention, but it's not super important."
      onClose={onClose}
      className={className}
    />
  );
}

export function WarningNotification({ onClose, className }: { onClose?: () => void, className?: string }) {
  return (
    <Notification
      variant="warning"
      title="Warning!"
      message="There was a problem with your network connection."
      onClose={onClose}
      className={className}
    />
  );
}

export function QuestionNotification({ onClose, className }: { onClose?: () => void, className?: string }) {
  return (
    <Notification
      variant="question"
      title="Hi there!"
      message="Do you have a problem? Just use this contact form."
      onClose={onClose}
      className={className}
    />
  );
}