'use client';

import React, { useContext } from 'react';
import { useList } from '@refinedev/core';
import { Card, Row, Col, Statistic, Spin, theme } from 'antd';
import { ColorModeContext } from '@contexts/color-mode';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

interface RiskData {
  id: string;
  risk_owner_id: string;
  risk_response: string;
  impact_type: string;
  inherent_risk_level: string;
  residual_risk_level: string;
  workflow_status: string;
}

interface SecureByDesignData {
  workflow_status: string;
}

interface UserData {
  id: string;
  full_name: string;
}

// Updated color palette
const COLORS: Record<string, string> = {
  'Treat': '#1890FF', // Info 500
  'Transfer': '#13C2C2', // Cyan 500
  'Terminate': '#F5222D', // Error 500
  'Accept': '#52C41A', // Success 500
  'Financial': '#722ED1', // Purple 500
  'Operational': '#FA8C16', // Orange 500
  'Reputational': '#EB2F96', // Magenta 500
  'Compliance': '#FAAD14', // Warning 400
  'Critical': '#F5222D', // Error 500
  'High': '#FA8C16', // Orange 500
  'Medium': '#FAAD14', // Warning 400
  'Low': '#52C41A', // Success 500
  'Identified': '#1890FF', // Info 500
  'Assessed': '#13C2C2', // Cyan 500
  'Treated': '#52C41A', // Success 500
  'Monitored': '#722ED1', // Purple 500
  'Initiation': '#1890FF', // Info 500
  'Design Review': '#13C2C2', // Cyan 500
  'Implementation': '#52C41A', // Success 500
  'Verification': '#722ED1', // Purple 500
  'Default': '#8C8C8C', // Gray 500 (for any other status)
};

const RiskDashboard: React.FC = () => {
  const { mode } = useContext(ColorModeContext);
  const { token } = theme.useToken();

  const { data: risks, isLoading: isLoadingRisks } = useList<RiskData>({ 
    resource: 'risks',
    pagination: { mode: 'off' }
  });
  const { data: secureByDesign, isLoading: isLoadingSBD } = useList<SecureByDesignData>({ 
    resource: 'secure_by_design',
    pagination: { mode: 'off' }
  });
  const { data: users, isLoading: isLoadingUsers } = useList<UserData>({ 
    resource: 'users',
    pagination: { mode: 'off' }
  });

  const isLoading = isLoadingRisks || isLoadingSBD || isLoadingUsers;

  if (isLoading) {
    return <Spin size="large" />;
  }

  const risksByOwner = risks?.data?.reduce((acc, risk) => {
    const ownerName = users?.data?.find(user => user.id === risk.risk_owner_id)?.full_name || risk.risk_owner_id;
    acc[ownerName] = (acc[ownerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByResponse = risks?.data?.reduce((acc, risk) => {
    acc[risk.risk_response] = (acc[risk.risk_response] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByImpactType = risks?.data?.reduce((acc, risk) => {
    acc[risk.impact_type] = (acc[risk.impact_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByInherentLevel = risks?.data?.reduce((acc, risk) => {
    acc[risk.inherent_risk_level] = (acc[risk.inherent_risk_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByResidualLevel = risks?.data?.reduce((acc, risk) => {
    acc[risk.residual_risk_level] = (acc[risk.residual_risk_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByWorkflowStatus = risks?.data?.reduce((acc, risk) => {
    acc[risk.workflow_status] = (acc[risk.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const sbdByStatus = secureByDesign?.data?.reduce((acc, sbd) => {
    acc[sbd.workflow_status] = (acc[sbd.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const chartTextColor = mode === 'light' ? token.colorTextSecondary : token.colorTextBase;

  const renderPieChart = (data: any[], dataKey: string, nameKey: string, title: string) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry[nameKey]] || COLORS['Default']} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: token.colorBgElevated, borderColor: token.colorBorder }} />
        <Legend formatter={(value) => <span style={{ color: chartTextColor }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = (data: any[], xDataKey: string, barDataKey: string, title: string) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xDataKey} 
          tick={{ fill: chartTextColor }}
          axisLine={{ stroke: token.colorBorder }}
        />
        <YAxis 
          tick={{ fill: chartTextColor }}
          axisLine={{ stroke: token.colorBorder }}
        />
        <Tooltip contentStyle={{ backgroundColor: token.colorBgElevated, borderColor: token.colorBorder }} />
        <Legend formatter={(value) => <span style={{ color: chartTextColor }}>{value}</span>} />
        <Bar dataKey={barDataKey} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry[xDataKey]] || COLORS['Default']} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div>
      <h1 style={{ color: mode === 'light' ? '#000000' : '#ffffff' }}>Risk Posture</h1>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
            <Statistic title="Secure by Design" value={secureByDesign?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Risks" value={risks?.data?.length || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Secure by Design Status">
            {renderPieChart(
              Object.entries(sbdByStatus).map(([status, count]) => ({ status, count })),
              'count',
              'status',
              'Secure by Design Status'
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Risk Impact Type">
            {renderPieChart(
              Object.entries(risksByImpactType).map(([type, count]) => ({ type, count })),
              'count',
              'type',
              'Risk Impact Type'
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Risk Response">
            {renderPieChart(
              Object.entries(risksByResponse).map(([response, count]) => ({ response, count })),
              'count',
              'response',
              'Risk Response'
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Risks by Owner">
            {renderBarChart(
              Object.entries(risksByOwner).map(([owner, count]) => ({ owner, count })),
              'owner',
              'count',
              'Risks by Owner'
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Inherent Risk Level">
            {renderPieChart(
              Object.entries(risksByInherentLevel).map(([level, count]) => ({ level, count })),
              'count',
              'level',
              'Inherent Risk Level'
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Residual Risk Level">
            {renderPieChart(
              Object.entries(risksByResidualLevel).map(([level, count]) => ({ level, count })),
              'count',
              'level',
              'Residual Risk Level'
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="Risk Workflow Status">
            {renderBarChart(
              Object.entries(risksByWorkflowStatus).map(([status, count]) => ({ status, count })),
              'status',
              'count',
              'Risk Workflow Status'
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskDashboard;
