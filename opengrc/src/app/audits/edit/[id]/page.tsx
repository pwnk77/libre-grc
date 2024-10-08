"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, Tabs, Card, Row, Col, Typography, DatePicker } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

export default function AuditEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "audits",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const userIds = [
    record?.audit_partner,
    record?.engagement_lead,
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
      <Form.Item name="audit_partner" label="Audit Partner">
        <Select
          options={userData?.data?.map(user => ({ value: user.id, label: user.full_name }))}
          loading={userLoading}
        />
      </Form.Item>
      <Form.Item name="engagement_lead" label="Engagement Lead">
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
      <Form.Item name="workflow_status" label="Workflow Status">
        <Select
          options={[
            { value: 'Planned', label: 'Planned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Reporting', label: 'Reporting' },
            { value: 'Closed', label: 'Closed' },
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
          <Form.Item name="audit_name" label="Audit Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="scope" label="Scope">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item name="related_circulars" label="Related Circulars">
            <Select mode="tags" style={{ width: '100%' }} />
          </Form.Item>
        </>
      ),
    },
    {
      key: "2",
      label: "Dates",
      children: (
        <>
          <Form.Item name="planned_start_date" label="Planned Start Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="planned_end_date" label="Planned End Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="actual_start_date" label="Actual Start Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="actual_end_date" label="Actual End Date">
            <DatePicker />
          </Form.Item>
        </>
      ),
    },
    {
      key: "3",
      label: "Stakeholders",
      children: (
        <>
          <Form.Item name="key_stakeholders" label="Key Stakeholders">
            <Select mode="tags" style={{ width: '100%' }} />
          </Form.Item>
        </>
      ),
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
              table_name: "audits",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating audit:", error);
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
          planned_start_date: record?.planned_start_date ? dayjs(record.planned_start_date) : null,
          planned_end_date: record?.planned_end_date ? dayjs(record.planned_end_date) : null,
          actual_start_date: record?.actual_start_date ? dayjs(record.actual_start_date) : null,
          actual_end_date: record?.actual_end_date ? dayjs(record.actual_end_date) : null,
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