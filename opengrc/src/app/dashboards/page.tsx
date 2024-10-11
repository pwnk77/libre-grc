"use client";

import React, { useState, useEffect } from 'react';
import { useList } from "@refinedev/core";
import { Card, Row, Col, Tabs, Statistic, Progress, Table, Select, DatePicker, Button, Space } from "antd";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [filterDate, setFilterDate] = useState<[string, string] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const { data: controlsData, isLoading: isLoadingControls } = useList({
    resource: "controls",
    pagination: { mode: "off" },
  });

  const { data: testingData, isLoading: isLoadingTesting } = useList({
    resource: "testing",
    pagination: { mode: "off" },
  });

  const { data: auditsData, isLoading: isLoadingAudits } = useList({
    resource: "audits",
    pagination: { mode: "off" },
  });

  const { data: citationsData, isLoading: isLoadingCitations } = useList({
    resource: "citations",
    pagination: { mode: "off" },
  });

  const complianceData = [
    { name: 'Compliant', value: 17 },
    { name: 'Non-Compliant', value: 6 },
  ];

  const controlStatusData = [
    { name: 'Implemented', value: 12 },
    { name: 'Partially Implemented', value: 8 },
    { name: 'Not Implemented', value: 3 },
  ];

  const riskLevelsData = [
    { name: 'High', value: 5 },
    { name: 'Medium', value: 10 },
    { name: 'Low', value: 8 },
  ];

  const complianceByDomainData = [
    { name: 'Access Control', value: 85 },
    { name: 'Asset Management', value: 70 },
    { name: 'Business Continuity', value: 90 },
    { name: 'Cryptography', value: 75 },
    { name: 'Information Security', value: 80 },
  ];

  const renderCompliancePosture = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card>
            <Statistic
              title="Overall Compliance"
              value={74}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress percent={74} status="active" />
          </Card>
        </motion.div>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card>
            <Statistic
              title="Controls Implemented"
              value={20}
              suffix="/ 23"
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress percent={87} status="active" strokeColor="#1890ff" />
          </Card>
        </motion.div>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card>
            <Statistic
              title="Open Findings"
              value={8}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </motion.div>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card>
            <Statistic
              title="Completed Audits"
              value={3}
              valueStyle={{ color: '#096dd9' }}
            />
          </Card>
        </motion.div>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Compliance Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Compliance by Domain">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceByDomainData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );

  const renderControlPosture = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Control Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={controlStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Risk Levels">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskLevelsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="Recent Control Updates">
          <Table
            dataSource={controlsData?.data?.slice(0, 5) || []}
            columns={[
              { title: 'Control ID', dataIndex: 'control_id', key: 'control_id' },
              { title: 'Title', dataIndex: 'title', key: 'title' },
              { title: 'Status', dataIndex: 'status', key: 'status' },
              { title: 'Last Updated', dataIndex: 'updated_at', key: 'updated_at' },
            ]}
            loading={isLoadingControls}
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderFilterMenu = () => (
    <Card style={{ marginBottom: 16 }}>
      <Space>
        <RangePicker
          onChange={(dates, dateStrings) => setFilterDate(dateStrings)}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Select Status"
          onChange={(value) => setFilterStatus(value)}
          allowClear
        >
          <Select.Option value="compliant">Compliant</Select.Option>
          <Select.Option value="non-compliant">Non-Compliant</Select.Option>
        </Select>
        <Button type="primary" onClick={() => console.log("Apply filters")}>
          Apply Filters
        </Button>
      </Space>
    </Card>
  );

  return (
    <div>
      {renderFilterMenu()}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Compliance Posture" key="1">
          {renderCompliancePosture()}
        </TabPane>
        <TabPane tab="Control Posture" key="2">
          {renderControlPosture()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DashboardPage;