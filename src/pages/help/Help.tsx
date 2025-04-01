
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Video, FileText, MessageCircle, Mail } from 'lucide-react';

export const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "How do I create a new project?",
      answer: "To create a new project, navigate to the dashboard and click on the 'New Project' button. You'll be guided through a step-by-step configuration process to set up your educational content project."
    },
    {
      question: "Can I upload my own curriculum standards?",
      answer: "Yes! When creating or editing a project, select 'Custom' in the Standards dropdown during the Language Configuration step. You'll be prompted to upload your custom standards document in the subsequent Documents step."
    },
    {
      question: "How do I add team members to my project?",
      answer: "In the Project Workspace, navigate to the 'Settings' tab and select 'Team Members'. From there, you can invite collaborators via email and set their permission levels."
    },
    {
      question: "What file types are supported for knowledge base uploads?",
      answer: "MultiGuide supports PDF, DOCX, DOC, TXT, RTF, and XLSX files for knowledge base uploads. Files must be under 10MB in size."
    },
    {
      question: "How do I export my finished content?",
      answer: "In the Content Workspace, select the content you wish to export and click the 'Export' button. You can choose from various formats including PDF, DOCX, HTML, and markdown."
    },
    {
      question: "Can I customize the AI's content generation style?",
      answer: "Absolutely! During project setup, you can adjust parameters like language complexity, cultural integration, terminology, and more. You can further refine these settings in the project configuration at any time."
    }
  ];
  
  const tutorialVideos = [
    {
      title: "Getting Started with MultiGuide",
      duration: "5:32",
      thumbnail: "https://via.placeholder.com/320x180",
      url: "#video-getting-started"
    },
    {
      title: "Setting Up Your Knowledge Base",
      duration: "7:15",
      thumbnail: "https://via.placeholder.com/320x180",
      url: "#video-knowledge-base"
    },
    {
      title: "Content Generation Best Practices",
      duration: "9:48",
      thumbnail: "https://via.placeholder.com/320x180",
      url: "#video-content-generation"
    },
    {
      title: "Customizing AI Outputs",
      duration: "6:27",
      thumbnail: "https://via.placeholder.com/320x180",
      url: "#video-customizing-ai"
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    searchQuery === '' || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <MainLayout contentWidth="wide">
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Help Center</h1>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Find answers to common questions, watch tutorial videos, and learn how to get the most out of MultiGuide.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search for help topics..." 
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Detailed guides & references</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Comprehensive documentation covering all aspects of the platform.
              </p>
              <Button variant="outline" className="w-full">View Documentation</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <Video className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Learn by watching</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Step-by-step video guides to help you master MultiGuide.
              </p>
              <Button variant="outline" className="w-full">Watch Tutorials</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get personalized help</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Have a specific question? Our support team is here to help.
              </p>
              <Button variant="outline" className="w-full">Contact Us</Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="faqs" className="max-w-4xl mx-auto">
          <TabsList className="mb-8 w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger value="faqs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent">
              Frequently Asked Questions
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent">
              Tutorial Videos
            </TabsTrigger>
            <TabsTrigger value="guides" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent">
              Quick Start Guides
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faqs">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="px-6 py-4 hover:bg-slate-50">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                        <p className="text-slate-700">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-slate-500">No matching FAQs found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorialVideos.map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{video.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{video.duration}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Video className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-slate-700" />
                  </div>
                  <CardTitle>New User Guide</CardTitle>
                  <CardDescription>Get started with MultiGuide</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Learn the basics of creating projects, navigating the interface, and generating your first content.
                  </p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-slate-700" />
                  </div>
                  <CardTitle>Knowledge Base Setup</CardTitle>
                  <CardDescription>Optimize your content creation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Learn how to effectively set up and organize your knowledge base for better AI content generation.
                  </p>
                  <Button variant="outline" className="w-full">View Guide</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <h2 className="text-xl font-semibold mb-4">Still need help?</h2>
          <p className="text-slate-600 mb-6">
            Our support team is ready to assist you with any questions or issues you might have.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Start Live Chat
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
