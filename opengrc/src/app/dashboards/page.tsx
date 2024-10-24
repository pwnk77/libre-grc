'use client';

import React, { useState } from 'react';
import { Tabs, Spin } from 'antd';
import ComplianceDashboard from './compliance';
import RiskDashboard from './risk';

const { TabPane } = Tabs;

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compliance');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Compliance Posture" key="compliance">
          <ComplianceDashboard />
        </TabPane>
        <TabPane tab="Risk Posture" key="risk">
          <RiskDashboard />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
