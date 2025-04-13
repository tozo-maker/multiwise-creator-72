
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode; // Changed from icon component to ReactNode
  trend: string;
  trendUp?: boolean;
  backgroundColor: string;
  ariaLabel: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp = true, // Default to true if not provided
  backgroundColor,
  ariaLabel
}) => {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="transition-all duration-300"
    >
      <Card className="border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md dark:hover:shadow-slate-800/30 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100" aria-label={ariaLabel}>{value}</h3>
              <p className={`text-xs mt-1 flex items-center ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trendUp ? 
                  <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                }
                {trend}
              </p>
            </div>
            <div className={`p-2 rounded-full ${backgroundColor} transition-transform hover:scale-110 duration-300`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
