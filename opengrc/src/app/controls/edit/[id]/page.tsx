"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity, useList } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, Tabs, Card, Row, Col, Typography, DatePicker, Tag, List } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs'; // Import dayjs
import { TasksTab } from "../../tasks";
import { AssetsTab } from "../../assets";

const { TextArea } = Input;
const { Title } = Typography;

export default function ControlEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "controls",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { data: companyData, isLoading: companyLoading } = useList({
    resource: "company_info",
  });

  const userIds = [
    record?.control_owner_id,
    record?.process_owner_id,
    record?.compliance_spoc_id,
  ].filter(Boolean);

  const { data: userData, isLoading: userLoading } = useMany({
    resource: "users",
    ids: userIds,
    queryOptions: {
      enabled: userIds.length > 0,
    },
  });

  const { data: citationsData, isLoading: citationsLoading } = useMany({
    resource: "citations",
    ids: record?.citation_ids || [],
    queryOptions: {
      enabled: !!record?.citation_ids,
    },
  });

  const renderRightSideBox = () => (
    <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
      <Form.Item name="control_owner_id" label="Control Owner">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="process_owner_id" label="Process Owner">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="compliance_spoc_id" label="Compliance SPOC">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="company_info_id" label="Company">
        <Select
          options={companyData?.data?.map(company => ({ value: company.id, label: company.entity }))}
          loading={companyLoading}
        />
      </Form.Item>
      <Form.Item name="created_at" label="Created At">
        <DatePicker 
          showTime 
          format="YYYY-MM-DD HH:mm:ss"
          disabled
        />
      </Form.Item>
      <Form.Item name="updated_at" label="Updated At">
        <DatePicker 
          showTime 
          format="YYYY-MM-DD HH:mm:ss"
          disabled
        />
      </Form.Item>
      <Form.Item name="compliance_status" label="Compliance Status">
        <Select
          options={[
            { value: 'Not Implemented', label: <Tag color="red">Not Implemented</Tag> },
            { value: 'Partially Implemented', label: <Tag color="orange">Partially Implemented</Tag> },
            { value: 'Implemented', label: <Tag color="green">Implemented</Tag> },
            { value: 'Not Applicable', label: <Tag color="gray">Not Applicable</Tag> },
          ]}
        />
      </Form.Item>
      <Form.Item name="workflow_status" label="Workflow Status">
        <Select
          options={[
            { value: 'Draft', label: <Tag color="blue">Draft</Tag> },
            { value: 'In Review', label: <Tag color="orange">In Review</Tag> },
            { value: 'Approved', label: <Tag color="green">Approved</Tag> },
            { value: 'Retired', label: <Tag color="gray">Retired</Tag> },
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
            <Select
              options={[
                { value: 'Preventive', label: <Tag color="blue">Preventive</Tag> },
                { value: 'Detective', label: <Tag color="green">Detective</Tag> },
                { value: 'Corrective', label: <Tag color="orange">Corrective</Tag> },
              ]}
            />
          </Form.Item>
          <Form.Item name="control_frequency" label="Control Frequency">
            <Select
              options={[
                { value: 'Continuous', label: <Tag color="green">Continuous</Tag> },
                { value: 'Daily', label: <Tag color="blue">Daily</Tag> },
                { value: 'Weekly', label: <Tag color="cyan">Weekly</Tag> },
                { value: 'Monthly', label: <Tag color="purple">Monthly</Tag> },
                { value: 'Quarterly', label: <Tag color="magenta">Quarterly</Tag> },
                { value: 'Annually', label: <Tag color="red">Annually</Tag> },
              ]}
            />
          </Form.Item>
          <Form.Item name="control_design" label="Control Design">
            <Select
              options={[
                { value: 'Manual', label: <Tag color="orange">Manual</Tag> },
                { value: 'Automated', label: <Tag color="green">Automated</Tag> },
                { value: 'Hybrid', label: <Tag color="blue">Hybrid</Tag> },
              ]}
            />
          </Form.Item>
          <Form.Item name="technological_enabler" label="Technological Enabler">
            <Input />
          </Form.Item>
          <Form.Item name="management_level" label="Management Level">
            <Select
              options={[
                { value: 'Strategic', label: <Tag color="red">Strategic</Tag> },
                { value: 'Tactical', label: <Tag color="blue">Tactical</Tag> },
                { value: 'Operational', label: <Tag color="green">Operational</Tag> },
              ]}
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: "4",
      label: "Citations",
      children: (
        <List
          dataSource={citationsData?.data || []}
          loading={citationsLoading}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.citation_text}
                description={`Reference: ${item.reference_identifier}`}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "5",
      label: "Tasks",
      children: <TasksTab controlId={params.id as string} />,
    },
    {
      key: "6",
      label: "Assets",
      children: <AssetsTab controlId={params.id as string} />,
    },
  ];

  const handleUpdate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        const changedFields = Object.keys(values).reduce((acc: Record<string, any>, key) => {
          if (JSON.stringify(values[key]) !== JSON.stringify(record?.[key])) {
            acc[key] = values[key];
          }
          return acc;
        }, {});

        if (Object.keys(changedFields).length > 0) {
          createChangeHistory({
            resource: "change_history",
            values: {
              table_name: "controls",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating control:", error);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form 
        {...formProps} 
        onFinish={handleUpdate}
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
