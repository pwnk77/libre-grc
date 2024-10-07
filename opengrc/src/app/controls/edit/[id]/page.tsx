"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useMany } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, Tabs, Card, Row, Col, Typography, DatePicker } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs'; // Import dayjs

const { TextArea } = Input;
const { Title } = Typography;

export default function ControlEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "controls",
    id: params.id as string,
  });

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const userIds = [
    record?.control_owner,
    record?.process_owner,
    record?.compliance_spoc,
  ].filter(Boolean);

  const { data: userData, isLoading: userLoading } = useMany({
    resource: "users",
    ids: userIds,
    queryOptions: {
      enabled: userIds.length > 0,
    },
  });

  const renderRightSideBox = () => (
    <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Form.Item name="control_owner" label="Control Owner">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="process_owner" label="Process Owner">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="compliance_spoc" label="Compliance SPOC">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="created_at" label="Created At">
        <DatePicker 
          showTime 
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item name="updated_at" label="Updated At">
        <DatePicker 
          showTime 
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item name="compliance_status" label="Compliance Status">
        <Select
          options={[
            { value: 'Not Implemented', label: 'Not Implemented' },
            { value: 'Partially Implemented', label: 'Partially Implemented' },
            { value: 'Implemented', label: 'Implemented' },
            { value: 'Not Applicable', label: 'Not Applicable' },
          ]}
        />
      </Form.Item>
      <Form.Item name="workflow_status" label="Workflow Status">
        <Select
          options={[
            { value: 'Draft', label: 'Draft' },
            { value: 'In Review', label: 'In Review' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Retired', label: 'Retired' },
          ]}
        />
      </Form.Item>
    </Card>
  );

  const tabItems = [
    {
      key: "1",
      label: "Overview",
      children: (
        <>
          <Form.Item name="control_id" label="Control ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="domain" label="Domain" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="control_requirements" label="Control Requirements" rules={[{ required: true }]}>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="risk_statement" label="Risk Statement" rules={[{ required: true }]}>
            <TextArea rows={3} />
          </Form.Item>
        </>
      ),
    },
    {
      key: "2",
      label: "Implementation",
      children: (
        <>
          <Form.Item name="current_implementation" label="Current Implementation">
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="enhancements" label="Enhancements">
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="implementation_guidance" label="Implementation Guidance">
            <TextArea rows={5} />
          </Form.Item>
        </>
      ),
    },
    {
      key: "3",
      label: "Details",
      children: (
        <>
          <Form.Item name="control_type" label="Control Type">
            <Input />
          </Form.Item>
          <Form.Item name="control_frequency" label="Control Frequency">
            <Input />
          </Form.Item>
          <Form.Item name="control_design" label="Control Design">
            <Input />
          </Form.Item>
          <Form.Item name="technological_enabler" label="Technological Enabler">
            <Input />
          </Form.Item>
          <Form.Item name="management_level" label="Management Level">
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      key: "4",
      label: "Framework",
      children: (
        <>
          <Form.Item name="framework_name" label="Framework Name">
            <Input />
          </Form.Item>
          <Form.Item name="framework_version" label="Framework Version">
            <Input />
          </Form.Item>
          <Form.Item name="framework_description" label="Framework Description">
            <TextArea rows={5} />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form 
        {...formProps} 
        layout="vertical"
        initialValues={{
          ...record,
          created_at: record?.created_at ? dayjs(record.created_at) : null,
          updated_at: record?.updated_at ? dayjs(record.updated_at) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Tabs defaultActiveKey="1" items={tabItems} />
            <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
              {renderAttachments()}
            </Card>
            <Activity parentId={params.id as string} />
          </Col>
          <Col span={6}>
            {renderRightSideBox()}
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}