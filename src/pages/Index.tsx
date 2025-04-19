
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LayoutDashboard, TestTube2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="container mx-auto max-w-5xl py-6">
      <h1 className="text-3xl font-bold mb-6">基于多模态智能感知的实验室用电管理</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>项目介绍</CardTitle>
            <CardDescription>系统概述与主要功能</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              本系统利用多模态智能感知技术，实现实验室电力管理的智能化、自动化与交互式控制。
              通过整合语音识别、自然语言处理与网页界面技术，为实验室管理员提供便捷的用电监控与控制平台。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <FeatureCard 
                icon={<LayoutDashboard size={24} />} 
                title="监控看板" 
                description="实时查看各实验室设备通电状态，支持图形化显示与表格控制。"
                link="/dashboard"
              />
              
              <FeatureCard 
                icon={<TestTube2 size={24} />} 
                title="分步测试" 
                description="独立测试语音交互各环节，包括语音识别、命令处理等模块。"
                link="/testing"
              />
              
              <FeatureCard 
                icon={<Settings size={24} />} 
                title="参数设置" 
                description="配置系统参数，包括API端点、设备信息等。"
                link="/settings"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>系统特点</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>集中化管理多个实验室设备的通电状态</li>
              <li>支持语音命令控制，提高操作便捷性</li>
              <li>实时监控与状态可视化</li>
              <li>灵活配置与扩展</li>
              <li>详细的操作日志与权限管理</li>
              <li>模块化设计，支持分步调试</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>使用场景</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>实验室管理员日常电力管理与监控</li>
              <li>远程控制实验室设备通断电</li>
              <li>紧急情况下的快速电源管理</li>
              <li>教学环境中的集中控制</li>
              <li>设备使用情况分析与能耗管理</li>
              <li>异常用电情况的自动检测与报警</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const FeatureCard = ({ icon, title, description, link }: FeatureCardProps) => {
  return (
    <Link to={link} className="block">
      <div className="border rounded-lg p-4 h-full hover:shadow-md transition-shadow hover:border-primary/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-primary">{icon}</div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex items-center text-sm text-primary font-medium">
          <span>查看详情</span>
          <ArrowRight size={14} className="ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default Index;
