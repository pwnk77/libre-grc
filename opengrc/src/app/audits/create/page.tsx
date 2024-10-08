"use client";

import { Create, useForm } from "@refinedev/antd";
import { BaseKey, useCreate, useGetIdentity, useList } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Typography, Tabs, Card, Row, Col } from "antd";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AuditCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "audits",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const [users, setUsers] = useState<{ value: BaseKey; label: string }[]>([]);

  const { data: userData, isLoading: userLoading } = useList({
    resource: "users",
  });

  useEffect(() => {
    if (userData?.data) {
      const formattedUsers = userData.data.map(user => ({
        value: user.id,
        label: user.full_name,
      }));
      setUsers(formattedUsers as { value: BaseKey; label: string }[]);
    }
  }, [userData]);

  const renderRightSideBox = () => (
    <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Form.Item label="Audit Partner" name="audit_partner">
            <Select options={users} loading={userLoading} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Engagement Lead" name="engagement_lead">
            <Select options={users} loading={userLoading} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Workflow Status" name="workflow_status">
            <Select
              options={[
                { value: "Planned", label: "Planned" },
                { value: "In Progress", label: "In Progress" },
                { value: "Reporting", label: "Reporting" },
                { value: "Closed", label: "Closed" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const tabItems = [
    {
      key: "1",
      label: "Overview",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Form.Item
              label="Audit Name"
              name="audit_name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Scope"
              name="scope"
            >
              <TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
            >
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Related Circulars"
              name="related_circulars"
            >
              <Select mode="tags" style={{ width: '100%' }} placeholder="Enter related circulars" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Dates",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={12}>
            <Form.Item
              label="Planned Start Date"
              name="planned_start_date"
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Planned End Date"
              name="planned_end_date"
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Actual Start Date"
              name="actual_start_date"
            >
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Actual End Date"
              name="actual_end_date"
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Stakeholders",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Form.Item
              label="Key Stakeholders"
              name="key_stakeholders"
            >
              <Select mode="tags" style={{ width: '100%' }} placeholder="Enter key stakeholders" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
  ];

  interface CreateResponse {
    data?: {
      id: string | number;
    };
  }

  const handleCreate = async (values: any) => {
    try {
      const response: CreateResponse = await formProps.onFinish?.(values) || {};
      if (response.data?.id) {
        createChangeHistory({
          resource: "change_history",
          values: {
            table_name: "audits",
            record_id: response.data.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating audit:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Row gutter={24}>
          <Col span={18}>
            <Tabs defaultActiveKey="1" items={tabItems} />
          </Col>
          <Col span={6}>
            {renderRightSideBox()}
          </Col>
        </Row>
      </Form>
    </Create>
  );
}