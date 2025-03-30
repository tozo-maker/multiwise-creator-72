
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookText, MessageSquare, Globe, Users, Shield } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center mr-2">
              <BookText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">MultiGuide</span>
          </div>
          
          <div className="space-x-2">
            <Link to="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                Create Educational Content with AI Assistance
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8">
                Streamline your educational content creation process with our AI-powered platform. 
                Perfect for teachers, education publishers, and language learning professionals.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="gap-2">
                    Get Started for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline">
                    Login to Your Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-12 relative">
              <div className="relative z-10 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
                <img 
                  src="/dashboard-preview.png" 
                  alt="Platform Dashboard Preview" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/1200x600/e5e7eb/a1a1aa?text=Dashboard+Preview';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-brand-500 rounded-full opacity-5 blur-3xl -z-10 transform translate-y-1/4"></div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Assisted Content</h3>
                <p className="text-slate-600">
                  Generate educational content with AI assistance tailored to your curriculum needs and teaching style.
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multilingual Support</h3>
                <p className="text-slate-600">
                  Create content in multiple languages with proper localization and cultural context.
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaboration Tools</h3>
                <p className="text-slate-600">
                  Work together with your team to create, review, and improve educational materials.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <div className="h-8 w-8 rounded-md bg-brand-500 flex items-center justify-center mr-2">
                <BookText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MultiGuide</span>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
              <div>
                <h4 className="font-medium text-white mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Testimonials</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2023 MultiGuide. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
