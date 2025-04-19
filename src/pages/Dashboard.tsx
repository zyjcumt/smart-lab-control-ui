
import React from 'react';
import FloorPlan from '@/components/dashboard/FloorPlan';
import ControlTable from '@/components/dashboard/ControlTable';
import ChatPanel from '@/components/dashboard/ChatPanel';
import LogPanel from '@/components/dashboard/LogPanel';

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">监控看板</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Floor plan and control table (left and bottom) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Floor plan (top left) */}
          <FloorPlan />
          
          {/* Control table (bottom) */}
          <ControlTable />
        </div>
        
        {/* Chat and log panels (right) */}
        <div className="space-y-4">
          {/* Chat panel (top right) */}
          <div className="h-[400px]">
            <ChatPanel />
          </div>
          
          {/* Log panel (bottom right) */}
          <div className="h-[240px]">
            <LogPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
