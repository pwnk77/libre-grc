'use client';

import React, { useContext } from 'react';
import { useList } from '@refinedev/core';
import { Card, Row, Col, Statistic, Spin, theme } from 'antd';
import { ColorModeContext } from '@contexts/color-mode';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

interface ControlData {
  id: string;
  domain: string;
  compliance_status: string;
  control_type: string;
  control_owner_id: string;
  workflow_status: string;
  citation_ids?: string[];
}

interface AuditData {
  workflow_status: string;
}

interface PolicyData {
  workflow_status: string;
}

interface TestingData {
  control_id: string;
  compliance_status: string;
}

interface UserData {
  id: string;
  full_name: string;
}

// Updated color palette
const COLORS: Record<string, string> = {
  'Not Implemented': '#722ED1', // Pull purple
  'Partially Implemented': '#FAAD14', // Warning 400
  'Implemented': '#52C41A', // Success 500
  'Draft': '#1890FF', // Info 500
  'In Review': '#13C2C2', // Cyan 500
  'Approved': '#52C41A', // Success 500
  'Retired': '#F5222D', // Error 500
  'Closed': '#52C41A', // Success 500
  'Preventive': '#FA8C16', // Orange 500
  'Detective': '#EB2F96', // Magenta 500
  'Corrective': '#722ED1', // Pull purple 500
  'Reporting': '#1890FF', // Info 500
  'In Progress': '#FAAD14', // Warning 400
  'Planned': '#13C2C2', // Cyan 500
  'Under Review': '#722ED1', // Pull purple 500
  'Published': '#13C2C2', // Cyan 500
  'Default': '#8C8C8C', // Gray 500 (for any other status)
};

const ComplianceDashboard: React.FC = () => {
  const { mode } = useContext(ColorModeContext);
  const { token } = theme.useToken();

  const { data: authorityDocuments, isLoading: isLoadingAuthDocs } = useList({ 
    resource: 'authority_documents',
    pagination: { mode: 'off' }
  });
  const { data: citations, isLoading: isLoadingCitations } = useList({ 
    resource: 'citations',
    pagination: { mode: 'off' }
  });
  const { data: controls, isLoading: isLoadingControls } = useList<ControlData>({ 
    resource: 'controls',
    pagination: { mode: 'off' }
  });
  const { data: audits, isLoading: isLoadingAudits } = useList<AuditData>({ 
    resource: 'audits',
    pagination: { mode: 'off' }
  });
  const { data: policies, isLoading: isLoadingPolicies } = useList<PolicyData>({ 
    resource: 'policies',
    pagination: { mode: 'off' }
  });
  const { data: testing, isLoading: isLoadingTesting } = useList<TestingData>({ 
    resource: 'testing',
    pagination: { mode: 'off' }
  });
  const { data: users, isLoading: isLoadingUsers } = useList<UserData>({ 
    resource: 'users',
    pagination: { mode: 'off' }
  });

  const isLoading = isLoadingAuthDocs || isLoadingCitations || isLoadingControls || isLoadingAudits || isLoadingPolicies || isLoadingTesting || isLoadingUsers;

  if (isLoading) {
    return <Spin size="large" />;
  }

  const complianceStatusByDomain = controls?.data?.reduce((acc, control) => {
    if (!acc[control.domain]) {
      acc[control.domain] = { 'Not Implemented': 0, 'Partially Implemented': 0, 'Implemented': 0 };
    }
    acc[control.domain][control.compliance_status]++;
    return acc;
  }, {} as Record<string, Record<string, number>>) || {};

  const complianceStatusByDomainData = Object.entries(complianceStatusByDomain).map(([domain, statuses]) => ({
    domain,
    'Not Implemented': statuses['Not Implemented'] || 0,
    'Partially Implemented': statuses['Partially Implemented'] || 0,
    'Implemented': statuses['Implemented'] || 0,
  }));

  const controlsByStatus = controls?.data?.reduce((acc, control) => {
    acc[control.compliance_status] = (acc[control.compliance_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const controlsByType = controls?.data?.reduce((acc, control) => {
    acc[control.control_type] = (acc[control.control_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const auditsByStatus = audits?.data?.reduce((acc, audit) => {
    acc[audit.workflow_status] = (acc[audit.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const policiesByStatus = policies?.data?.reduce((acc, policy) => {
    acc[policy.workflow_status] = (acc[policy.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const citationComplianceStatus = controls?.data?.reduce((acc, control) => {
    control.citation_ids?.forEach((citationId: string) => {
      if (!acc[citationId]) {
        acc[citationId] = { compliant: 0, nonCompliant: 0 };
      }
      if (control.compliance_status === 'Implemented') {
        acc[citationId].compliant++;
      } else {
        acc[citationId].nonCompliant++;
      }
    });
    return acc;
  }, {} as Record<string, { compliant: number, nonCompliant: number }>) || {};

  const citationComplianceData = Object.entries(citationComplianceStatus).map(([citationId, status]) => ({
    citationId,
    Compliant: status.compliant,
    'Non-Compliant': status.nonCompliant,
  }));

  const controlOwnerData = controls?.data?.reduce((acc, control) => {
    const ownerName = users?.data?.find(user => user.id === control.control_owner_id)?.full_name || control.control_owner_id;
    if (!acc[ownerName]) {
      acc[ownerName] = {
        complianceStatus: { 'Not Implemented': 0, 'Partially Implemented': 0, 'Implemented': 0 },
        workflowStatus: { 'Draft': 0, 'In Review': 0, 'Approved': 0, 'Retired': 0 }
      };
    }
    acc[ownerName].complianceStatus[control.compliance_status]++;
    acc[ownerName].workflowStatus[control.workflow_status]++;
    return acc;
  }, {} as Record<string, { 
    complianceStatus: Record<string, number>, 
    workflowStatus: Record<string, number> 
  }>) || {};

  const controlOwnerChartData = Object.entries(controlOwnerData).map(([ownerName, data]) => ({
    name: ownerName,
    'Not Implemented': data.complianceStatus['Not Implemented'],
    'Partially Implemented': data.complianceStatus['Partially Implemented'],
    'Implemented': data.complianceStatus['Implemented'],
    'Draft': data.workflowStatus['Draft'],
    'In Review': data.workflowStatus['In Review'],
    'Approved': data.workflowStatus['Approved'],
    'Retired': data.workflowStatus['Retired'],
  }));

  const testingComplianceByDomain = testing?.data?.reduce((acc, test) => {
    const control = controls?.data?.find(c => c.id === test.control_id);
    if (control) {
      if (!acc[control.domain]) {
        acc[control.domain] = {};
      }
      acc[control.domain][test.compliance_status] = (acc[control.domain][test.compliance_status] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, Record<string, number>>) || {};

  const testingComplianceData = Object.entries(testingComplianceByDomain).flatMap(([domain, statuses]) =>
    Object.entries(statuses).map(([status, count]) => ({ domain, status, count }))
  );

  const commonChartConfig = {
    appendPadding: 10,
    legend: {
      position: 'bottom' as const,
      itemName: {
        style: {
          fill: mode === 'light' ? '#000000' : '#ffffff',
        },
      },
    },
    label: {
      style: {
        fill: mode === 'light' ? '#000000' : '#ffffff',
        fontSize: 12,
      },
    },
    interactions: [{ type: 'element-active' }],
    theme: mode,
  };

  const chartTextColor = mode === 'light' ? token.colorTextSecondary : token.colorTextBase;

  const renderDonutChart = (data: any[], dataKey: string, nameKey: string, title: string) => (
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

  const renderBarChart = (data: any[], xDataKey: string, barDataKeys: string[], title: string, stacked: boolean = false) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
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
        {barDataKeys.map((key) => (
          <Bar 
            key={key} 
            dataKey={key} 
            stackId={stacked ? "a" : undefined} 
            fill={COLORS[key] || COLORS['Default']} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Authority Documents" value={authorityDocuments?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Citations" value={citations?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Controls" value={controls?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Audits" value={audits?.data?.length || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Card title="Control Types">
            {renderDonutChart(
              Object.entries(controlsByType).map(([type, count]) => ({ type, count })),
              'count',
              'type',
              'Control Types'
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Audit Status">
            {renderDonutChart(
              Object.entries(auditsByStatus).map(([status, count]) => ({ status, count })),
              'count',
              'status',
              'Audit Status'
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Policy Status">
            {renderDonutChart(
              Object.entries(policiesByStatus).map(([status, count]) => ({ status, count })),
              'count',
              'status',
              'Policy Status'
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="Compliance Status by Domain">
            {renderBarChart(
              complianceStatusByDomainData,
              'domain',
              ['Not Implemented', 'Partially Implemented', 'Implemented'],
              'Compliance Status by Domain',
              true
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Control Owner Compliance Status">
            {renderBarChart(
              controlOwnerChartData,
              'name',
              ['Not Implemented', 'Partially Implemented', 'Implemented'],
              'Control Owner Compliance Status',
              true
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Control Owner Workflow Status">
            {renderBarChart(
              controlOwnerChartData,
              'name',
              ['Draft', 'In Review', 'Approved', 'Retired'],
              'Control Owner Workflow Status',
              true
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ComplianceDashboard;
