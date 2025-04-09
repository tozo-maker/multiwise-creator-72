
import React from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeCard } from '@/components/shared/ThemeCard';

export const Help = () => {
  return (
    <ModernLayout contentWidth="wide">
      <HelpContent />
    </ModernLayout>
  );
};

const HelpContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <ThemeCard className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Help & Support</CardTitle>
            <CardDescription>
              Find resources and support for using MultiGuide effectively
            </CardDescription>
          </CardHeader>
        </ThemeCard>

        <Tabs defaultValue="guides" className="space-y-4">
          <TabsList>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Learn the basics of using MultiGuide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">A complete walkthrough of all essential features to help you create your first educational project.</p>
                  <Button variant="outline">Read Guide</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Content Creation
                  </CardTitle>
                  <CardDescription>
                    Master MultiGuide's content generation tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">Learn how to use our AI-powered tools to create engaging educational content faster.</p>
                  <Button variant="outline">Read Guide</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Introduction to MultiGuide
                  </CardTitle>
                  <CardDescription>
                    5:32 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">A quick overview of the platform and its main features.</p>
                  <Button>Watch Video</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Advanced Project Features
                  </CardTitle>
                  <CardDescription>
                    12:45 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">Dive deeper into the advanced functionality of MultiGuide projects.</p>
                  <Button>Watch Video</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-medium mb-1">How do I create my first project?</h3>
                  <p className="text-sm text-muted-foreground">Click the "New Project" button in the top navigation bar and follow the guided wizard.</p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium mb-1">Can I export my content to other formats?</h3>
                  <p className="text-sm text-muted-foreground">Yes, you can export to PDF, DOCX, HTML, and more through the project export menu.</p>
                </div>
                <div className="pb-3">
                  <h3 className="font-medium mb-1">How can I share my project with others?</h3>
                  <p className="text-sm text-muted-foreground">Use the Share button on any project to invite collaborators or generate a shareable link.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact Support
                </CardTitle>
                <CardDescription>
                  Get help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Need additional help? Our support team is available Monday through Friday, 9am-5pm EST.</p>
                <Button className="mr-4">Chat with Support</Button>
                <Button variant="outline">Send Email</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Help;
