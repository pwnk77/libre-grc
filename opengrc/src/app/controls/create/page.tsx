"use client";

import { Create, useForm } from "@refinedev/antd";
import { BaseKey, useCreate, useGetIdentity, useList } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Typography, Tabs, Card, Row, Col } from "antd";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

export default function ControlCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "controls",
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
          <Title level={4}>Ownership</Title>
        </Col>
        <Col span={24}>
          <Form.Item label="Control Owner" name="control_owner">
            <Select options={users} loading={userLoading} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Process Owner" name="process_owner">
            <Select options={users} loading={userLoading} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Compliance SPOC" name="compliance_spoc">
            <Select options={users} loading={userLoading} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Title level={4}>Status</Title>
        </Col>
        <Col span={24}>
          <Form.Item label="Compliance Status" name="compliance_status">
            <Select
              options={[
                { value: "Not Implemented", label: "Not Implemented" },
                { value: "Partially Implemented", label: "Partially Implemented" },
                { value: "Implemented", label: "Implemented" },
                { value: "Not Applicable", label: "Not Applicable" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Workflow Status" name="workflow_status">
            <Select
              options={[
                { value: "Draft", label: "Draft" },
                { value: "In Review", label: "In Review" },
                { value: "Approved", label: "Approved" },
                { value: "Retired", label: "Retired" },
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
              label="Control ID"
              name="control_id"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Domain"
              name="domain"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Control Requirements"
              name="control_requirements"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Risk Statement"
              name="risk_statement"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Implementation",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Form.Item
              label="Current Implementation"
              name="current_implementation"
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Enhancements"
              name="enhancements"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Implementation Guidance"
              name="implementation_guidance"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Details",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Form.Item
              label="Control Type"
              name="control_type"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Control Frequency"
              name="control_frequency"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Control Design"
              name="control_design"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Technological Enabler"
              name="technological_enabler"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Management Level"
              name="management_level"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "4",
      label: "Framework",
      children: (
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Form.Item
              label="Framework Name"
              name="framework_name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Framework Version"
              name="framework_version"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Framework Description"
              name="framework_description"
            >
              <Input.TextArea rows={3} />
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
            table_name: "controls",
            record_id: response.data.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating control:", error);
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