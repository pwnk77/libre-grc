'use client';

import React from 'react';
import { useList, useOne } from '@refinedev/core';
import { Card, Row, Col, Statistic, Spin, Table, List, Avatar } from 'antd';
import { Bar } from '@ant-design/plots';
import { useTable } from '@refinedev/antd';
import dayjs from 'dayjs';

const HomePage: React.FC = () => {
  const { data: currentUser, isLoading: isLoadingUser } = useOne({
    resource: 'users',
    id: 'current', // Assuming you have a way to get the current user's ID
  });

  const { tableProps: taskProps, isLoading: isLoadingTasks } = useTable({
    resource: 'tasks',
    filters: {
      initial: [
        {
          field: 'assignee_id',
          operator: 'eq',
          value: currentUser?.data?.id,
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
        value: currentUser?.data?.id,
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
        field: 'manager_id',
        operator: 'eq',
        value: currentUser?.data?.id,
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

  return (
    <div>
      <h1>Welcome, {currentUser?.data?.full_name}</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Your Tasks">
            <Table {...taskProps} columns={taskColumns} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Task Status">
            <Bar
              data={Object.entries(taskStatusData).map(([status, count]) => ({ status, count }))}
              xField="count"
              yField="status"
            />
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
                    description={item.job_title}
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
