'use client';

import React from 'react';
import { useList, useOne } from '@refinedev/core';
import { Card, Row, Col, Spin, Table, List, Avatar } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTable } from '@refinedev/antd';
import dayjs from 'dayjs';
import Image from 'next/image';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const HomePage: React.FC = () => {
  const { data: currentUser, isLoading: isLoadingUser } = useOne({
    resource: 'users',
    id: 'a703c967-cbf5-4145-8e62-f072e7706e1b', // Alice's actual ID
  });

  const { tableProps: taskProps, isLoading: isLoadingTasks } = useTable({
    resource: 'tasks',
    filters: {
      initial: [
        {
          field: 'assignee_id',
          operator: 'eq',
          value: 'a703c967-cbf5-4145-8e62-f072e7706e1b',
        },
        {
          field: 'status',
          operator: 'in',
          value: ['Not Started', 'In Progress', 'Overdue'],
        },
      ],
    },
    sorters: {
      initial: [{ field: 'due_date', order: 'asc' }],
    },
  });

  const { data: completedTasks, isLoading: isLoadingCompletedTasks } = useList({
    resource: 'tasks',
    filters: [
      {
        field: 'assignee_id',
        operator: 'eq',
        value: 'a703c967-cbf5-4145-8e62-f072e7706e1b',
      },
      {
        field: 'status',
        operator: 'eq',
        value: 'Completed',
      },
    ],
    pagination: { pageSize: 5 },
  });

  const { data: teamMembers, isLoading: isLoadingTeam } = useList({
    resource: 'users',
    filters: [
      {
        field: 'team',
        operator: 'in',
        value: ['Privacy Team', 'Compliance Team', 'Risk Team', 'Security Operations'],
      },
    ],
  });

  const { data: assets, isLoading: isLoadingAssets } = useList({
    resource: 'assets',
    pagination: { pageSize: 5 },
  });

  const isLoading = isLoadingUser || isLoadingTasks || isLoadingCompletedTasks || isLoadingTeam || isLoadingAssets;

  if (isLoading) {
    return <Spin size="large" />;
  }

  const taskColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Type',
      dataIndex: 'task_type',
      key: 'task_type',
    },
  ];

  const taskStatusData = taskProps.dataSource?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const taskStatusChartData = Object.entries(taskStatusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div>
      <h1>Welcome, Alice Williams</h1>
      
      <div style={{ marginBottom: '16px', position: 'relative', width: '100%', height: '260px' }}>
        <Image
          src="/banners/landing_page.png"
          alt="OpenGRC Dashboard Banner"
          layout="fill"
          objectFit="cover"
        />
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Your Tasks">
            <Table {...taskProps} columns={taskColumns} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Task Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Completed Tasks">
            <List
              dataSource={completedTasks?.data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`Completed on: ${dayjs(item.updated_at).format('YYYY-MM-DD')}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Your Team">
            <List
              dataSource={teamMembers?.data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{item.full_name[0]}</Avatar>}
                    title={item.full_name}
                    description={`${item.job_title} - ${item.team}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="Assets">
            <Table
              dataSource={assets?.data}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Type',
                  dataIndex: 'asset_type',
                  key: 'asset_type',
                },
                {
                  title: 'Classification',
                  dataIndex: 'classification',
                  key: 'classification',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
