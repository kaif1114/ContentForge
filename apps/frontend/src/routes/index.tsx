import { Button } from "@/components/ui/button";
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Squirrel } from "lucide-react";

export const Route = createFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-wayflyer-green flex items-center justify-center">
              <Squirrel size={28} className="stroke-[#45c19a] sm:h-[35px] sm:w-[35px]" />
            </div>
            <span className="text-xl font-semibold text-gray-900">ContentForge</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/sources" className="text-gray-700 hover:text-gray-900">Sources</Link>
            <a href="https://deepwiki.com/kaif1114/ContentForge/1-overview" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">Docs</a>
            <Link to="/posts" className="text-gray-700 hover:text-gray-900">Posts</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 mb-6">
              Content Creation Made Easy
             </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Boost Your <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Productivity</span>,<br />
              Simplify Your Life
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              We're here to simplify the intricacies of your life, providing a user-friendly platform that not only manages your tasks effortlessly but also enhances your overall efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <a href="https://deepwiki.com/kaif1114/ContentForge/1-overview">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-3 border-teal-200 text-teal-700 hover:bg-teal-50">
                Preview Platform
              </Button>
              
             </a>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-teal-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Hi Tanveer!</div>
                    <div className="text-sm text-gray-500">Content Creator</div>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 text-teal-600 bg-teal-50 rounded-lg">
                    <div className="w-4 h-4 bg-teal-600 rounded"></div>
                    <span className="font-medium">Posts</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Sources</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>LinkedIn</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Twitter</span>
                  </div>
                </nav>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl p-6 text-white">
                    <h3 className="font-semibold text-black mb-2">R&D for New Banking Mobile App</h3>
                    <div className="flex -space-x-2">
                      <h5>R&D is the process of researching and developing new products or services. it is a crucial step in the product development process. Most of the time, it is done by the product team and the R&D team. </h5>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-200 to-cyan-400 rounded-xl p-6 text-white relative">
                    <h3 className="font-semibold text-black mb-2">Check Posts</h3>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                        👋
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Posts Created</h3>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">Archive</Badge>
                      <Badge className="bg-teal-600 text-white">New</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">11 Posts For Twitter and LinkedIn</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
