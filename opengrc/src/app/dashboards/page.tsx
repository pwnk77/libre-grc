'use client';

import React from 'react';
import { useList } from '@refinedev/core';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { Bar, Pie } from '@ant-design/plots';

const DashboardPage: React.FC = () => {
  const { data: authorityDocuments, isLoading: isLoadingAuthDocs } = useList({ 
    resource: 'authority_documents',
    pagination: { mode: 'off' }
  });
  const { data: citations, isLoading: isLoadingCitations } = useList({ 
    resource: 'citations',
    pagination: { mode: 'off' }
  });
  const { data: controls, isLoading: isLoadingControls } = useList({ 
    resource: 'controls',
    pagination: { mode: 'off' }
  });
  const { data: risks, isLoading: isLoadingRisks } = useList({ 
    resource: 'risks',
    pagination: { mode: 'off' }
  });
  const { data: secureByDesign, isLoading: isLoadingSBD } = useList({ 
    resource: 'secure_by_design',
    pagination: { mode: 'off' }
  });
  const { data: audits, isLoading: isLoadingAudits } = useList({ 
    resource: 'audits',
    pagination: { mode: 'off' }
  });
  const { data: policies, isLoading: isLoadingPolicies } = useList({ 
    resource: 'policies',
    pagination: { mode: 'off' }
  });

  const isLoading = isLoadingAuthDocs || isLoadingCitations || isLoadingControls || isLoadingRisks || isLoadingSBD || isLoadingAudits || isLoadingPolicies;

  if (isLoading) {
    return <Spin size="large" />;
  }

  const controlsByDomain = controls?.data?.reduce((acc, control) => {
    acc[control.domain] = (acc[control.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const controlsByStatus = controls?.data?.reduce((acc, control) => {
    acc[control.compliance_status] = (acc[control.compliance_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const controlsByType = controls?.data?.reduce((acc, control) => {
    acc[control.control_type] = (acc[control.control_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByOwner = risks?.data?.reduce((acc, risk) => {
    acc[risk.risk_owner_id] = (acc[risk.risk_owner_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const risksByResponse = risks?.data?.reduce((acc, risk) => {
    acc[risk.risk_response] = (acc[risk.risk_response] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const auditsByStatus = audits?.data?.reduce((acc, audit) => {
    acc[audit.workflow_status] = (acc[audit.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const sbdByStatus = secureByDesign?.data?.reduce((acc, sbd) => {
    acc[sbd.workflow_status] = (acc[sbd.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const policiesByStatus = policies?.data?.reduce((acc, policy) => {
    acc[policy.workflow_status] = (acc[policy.workflow_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Card>
            <Statistic title="Authority Documents" value={authorityDocuments?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Citations" value={citations?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Controls" value={controls?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Risks" value={risks?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Secure by Design" value={secureByDesign?.data?.length || 0} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Audits" value={audits?.data?.length || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Card title="Controls by Domain">
            <Bar
              data={Object.entries(controlsByDomain).map(([domain, count]) => ({ domain, count }))}
              xField="count"
              yField="domain"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Control Compliance Status">
            <Pie
              data={Object.entries(controlsByStatus).map(([status, count]) => ({ status, count }))}
              angleField="count"
              colorField="status"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Control Types">
            <Pie
              data={Object.entries(controlsByType).map(([type, count]) => ({ type, count }))}
              angleField="count"
              colorField="type"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Risks by Owner">
            <Bar
              data={Object.entries(risksByOwner).map(([owner, count]) => ({ owner, count }))}
              xField="count"
              yField="owner"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Risk Response">
            <Pie
              data={Object.entries(risksByResponse).map(([response, count]) => ({ response, count }))}
              angleField="count"
              colorField="response"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Card title="Audit Status">
            <Pie
              data={Object.entries(auditsByStatus).map(([status, count]) => ({ status, count }))}
              angleField="count"
              colorField="status"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Secure by Design Status">
            <Pie
              data={Object.entries(sbdByStatus).map(([status, count]) => ({ status, count }))}
              angleField="count"
              colorField="status"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Policy Status">
            <Pie
              data={Object.entries(policiesByStatus).map(([status, count]) => ({ status, count }))}
              angleField="count"
              colorField="status"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
