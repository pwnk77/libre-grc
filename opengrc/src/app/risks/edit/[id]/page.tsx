"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, DatePicker, Tabs, Card, Row, Col, Typography, Divider } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';
import { TasksTab } from "../../tasks";
import { AssetsTab } from "../../assets";
import { useState } from "react";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;

export default function RiskEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "risks",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();
  const [activeTab, setActiveTab] = useState("1");

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "entity",
    optionValue: "id",
  });

  const { selectProps: userSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

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
              table_name: "risks",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating risk:", error);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form 
        {...formProps} 
        onFinish={handleUpdate}
        layout="vertical"
        initialValues={{
          ...record,
          risk_due_date: record?.risk_due_date ? dayjs(record.risk_due_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Basic Information" key="1">
                <Card>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="risk_id"
                        label="Risk ID"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="risk_summary"
                        label="Risk Summary"
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
                  </Row>
                </Card>
              </TabPane>

              <TabPane tab="Risk Assessment" key="2">
                <Card>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="impact_type"
                        label="Impact Type"
                      >
                        <Select
                          options={[
                            { value: 'Financial', label: 'Financial' },
                            { value: 'Operational', label: 'Operational' },
                            { value: 'Reputational', label: 'Reputational' },
                            { value: 'Compliance', label: 'Compliance' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="impact"
                        label="Impact"
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
                    <Col span={12}>
                      <Form.Item
                        name="likelihood"
                        label="Likelihood"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { value: 'Almost Certain', label: 'Almost Certain' },
                            { value: 'Likely', label: 'Likely' },
                            { value: 'Slightly Likely', label: 'Slightly Likely' },
                            { value: 'Rare', label: 'Rare' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="inherent_risk_level"
                        label="Inherent Risk Level"
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
                  </Row>
                </Card>
              </TabPane>

              <TabPane tab="Risk Treatment" key="3">
                <Card>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="risk_response"
                        label="Risk Response"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { value: 'Treat', label: 'Treat' },
                            { value: 'Transfer', label: 'Transfer' },
                            { value: 'Terminate', label: 'Terminate' },
                            { value: 'Accept', label: 'Accept' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="risk_due_date"
                        label="Risk Due Date"
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="compensating_controls"
                        label="Compensating Controls"
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="mitigating_controls"
                        label="Mitigating Controls"
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="risk_acceptance_justifications"
                        label="Risk Acceptance Justifications"
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </TabPane>

              <TabPane tab="Tasks" key="4">
                <TasksTab riskId={params.id as string} />
              </TabPane>

              <TabPane tab="Assets" key="5">
                <AssetsTab riskId={params.id as string} />
              </TabPane>

              <TabPane tab="Attachments" key="6">
                <Card>
                  {renderAttachments()}
                </Card>
              </TabPane>

              <TabPane tab="Activity" key="7">
                <Activity parentId={params.id as string} />
              </TabPane>
            </Tabs>
          </Col>
          <Col span={6}>
            <Card title="Contextual Information">
              <Form.Item
                name="company_info_id"
                label="Company"
              >
                <Select {...entitySelectProps} />
              </Form.Item>
              <Form.Item
                name="risk_owner_id"
                label="Risk Owner"
              >
                <Select {...userSelectProps} />
              </Form.Item>
              <Form.Item
                name="risk_reporter_id"
                label="Risk Reporter"
              >
                <Select {...userSelectProps} />
              </Form.Item>
              <Form.Item
                name="risk_manager_id"
                label="Risk Manager"
              >
                <Select {...userSelectProps} />
              </Form.Item>
              <Form.Item
                name="workflow_status"
                label="Workflow Status"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'Identified', label: 'Identified' },
                    { value: 'Assessed', label: 'Assessed' },
                    { value: 'Treated', label: 'Treated' },
                    { value: 'Monitored', label: 'Monitored' },
                  ]}
                />
              </Form.Item>
              <Divider />
              <Title level={5}>Created At</Title>
              <p>{record?.created_at ? dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</p>
              <Title level={5}>Updated At</Title>
              <p>{record?.updated_at ? dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</p>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
