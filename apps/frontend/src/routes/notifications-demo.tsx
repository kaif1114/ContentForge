import { createFileRoute } from '@tanstack/react-router'
import { 
  Notification, 
  SuccessNotification, 
  ErrorNotification, 
  InfoNotification, 
  WarningNotification, 
  QuestionNotification 
} from '../components/ui/notification'
import { useState } from 'react'

export const Route = createFileRoute('/notifications-demo')({
  component: NotificationsDemoPage,
})

export default function NotificationsDemoPage() {
  const [showDismissable, setShowDismissable] = useState(true)
  
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Notification Components</h1>
          <p className="text-gray-600">A showcase of different notification styles based on the design.</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Standard Notifications</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Success Notification</h3>
              <SuccessNotification />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Error Notification</h3>
              <ErrorNotification />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Info Notification</h3>
              <InfoNotification />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Warning Notification</h3>
              <WarningNotification />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Question Notification</h3>
              <QuestionNotification />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Dismissable Notification</h2>
          {showDismissable && (
            <div className="mb-6">
              <Notification
                variant="success"
                title="Dismissable Notification"
                message="Click the X button to dismiss this notification."
                onClose={() => setShowDismissable(false)}
              />
            </div>
          )}
          {!showDismissable && (
            <button 
              onClick={() => setShowDismissable(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Show Again
            </button>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Custom Notifications Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Login Success</h3>
              <Notification
                variant="success"
                title="Welcome Back!"
                message="You've successfully logged in."
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Login Error</h3>
              <Notification
                variant="error"
                title="Invalid credentials"
                message="Please check your email and password and try again."
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Registration Success</h3>
              <Notification
                variant="success"
                title="Success!"
                message="Your account has been created successfully. Redirecting you..."
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Registration Error</h3>
              <Notification
                variant="error"
                title="Registration Failed"
                message="An account with this email already exists. Please use a different email or sign in."
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Form Integration Examples</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <form className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="mb-6">
                <Notification
                  variant="error"
                  title="Email required"
                  message="Please enter a valid email address to continue."
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}