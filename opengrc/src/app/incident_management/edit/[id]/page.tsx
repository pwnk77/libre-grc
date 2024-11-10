"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, DatePicker, Tabs, Card, Row, Col, Typography, Divider, Space } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';
import { TasksTab } from "../../tasks";
import { useState } from "react";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function IncidentEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "incident_management",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "entity",
    optionValue: "id",
  });

  const { selectProps: incidentOwnerSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const [activeTab, setActiveTab] = useState("1");

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
              table_name: "incident_management",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating incident:", error);
    }
  };

  const renderRightSideBox = () => (
    <Card title="Assignment Details" style={{ borderRadius: 8 }}>
      <Form.Item
        name="entity_id"
        label="Entity"
        rules={[{ required: true }]}
      >
        <Select {...entitySelectProps} />
      </Form.Item>
      <Form.Item
        name="incident_owner"
        label="Incident Owner"
        rules={[{ required: true }]}
      >
        <Select {...incidentOwnerSelectProps} />
      </Form.Item>
      <Form.Item
        name="reported_date"
        label="Reported Date"
        rules={[{ required: true }]}
        getValueProps={(value) => ({
          value: value ? dayjs(value) : undefined,
        })}
      >
        <DatePicker showTime style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="target_resolution_date"
        label="Target Resolution Date"
        getValueProps={(value) => ({
          value: value ? dayjs(value) : undefined,
        })}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Divider />
      <Title level={5}>Created At</Title>
      <Text>{record?.created_at ? dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</Text>
      <Title level={5} style={{ marginTop: 16 }}>Updated At</Title>
      <Text>{record?.updated_at ? dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</Text>
    </Card>
  );

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleUpdate} layout="vertical">
        <Row gutter={24}>
          <Col span={18}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Basic Information" key="1">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="incident_id"
                        label="Incident ID"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="incident_summary"
                        label="Incident Summary"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="severity"
                        label="Severity"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { value: 'Critical', label: 'Critical' },
                            { value: 'High', label: 'High' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'Low', label: 'Low' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="impact_type"
                        label="Impact Type"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { value: 'Security', label: 'Security' },
                            { value: 'Availability', label: 'Availability' },
                            { value: 'Performance', label: 'Performance' },
                            { value: 'Data', label: 'Data' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="incident_status"
                        label="Incident Status"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { value: 'Open', label: 'Open' },
                            { value: 'In Progress', label: 'In Progress' },
                            { value: 'Resolved', label: 'Resolved' },
                            { value: 'Closed', label: 'Closed' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Response Details" key="2">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="detection_method"
                        label="Detection Method"
                      >
                        <Select
                          options={[
                            { value: 'Automated Alert', label: 'Automated Alert' },
                            { value: 'Manual Detection', label: 'Manual Detection' },
                            { value: 'Third Party', label: 'Third Party' },
                            { value: 'Customer Report', label: 'Customer Report' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="response_time"
                        label="Initial Response Time"
                      >
                        <DatePicker showTime style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="containment_measures"
                        label="Containment Measures"
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="resolution_steps"
                        label="Resolution Steps"
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Tasks" key="3">
                  <TasksTab incidentId={params.id as string} />
                </TabPane>
              </Tabs>
              <Form.Item
                name="workflow_status"
                label="Workflow Status"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Reported', label: 'Reported' },
                    { value: 'Under Investigation', label: 'Under Investigation' },
                    { value: 'Remediation', label: 'Remediation' },
                    { value: 'Resolved', label: 'Resolved' },
                    { value: 'Closed', label: 'Closed' },
                  ]}
                />
              </Form.Item>
              <Divider />
              {activeTab !== "3" && (
                <>
                  <Card title="Attachments" style={{ borderRadius: 8 }}>
                    {renderAttachments()}
                  </Card>
                  <Divider />
                  <Card title="Activity" style={{ borderRadius: 8 }}>
                    <Activity parentId={params.id as string} />
                  </Card>
                </>
              )}
            </Space>
          </Col>
          <Col span={6}>
            {renderRightSideBox()}
          </Col>
        </Row>
      </Form>
    </Edit>
  );
} 