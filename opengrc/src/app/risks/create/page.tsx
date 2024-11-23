"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Tabs, Row, Col, Card } from "antd";
import { useState } from "react";
import { AssetsTab } from "../assets";
import { TasksTab } from "../tasks";

const { TextArea } = Input;
const { TabPane } = Tabs;

export default function RiskCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "risks",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();
  const [activeTab, setActiveTab] = useState("1");

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "entity",
    optionValue: "id",
  });

  const { selectProps: riskOwnerSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const { selectProps: riskReporterSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const { selectProps: riskManagerSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const handleCreate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        createChangeHistory({
          resource: "change_history",
          values: {
            table_name: "risks",
            record_id: (response as any)?.data?.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating risk:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
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
                <Card>
                  <p>Tasks can be added after creating the risk.</p>
                </Card>
              </TabPane>

              <TabPane tab="Assets" key="5">
                <Card>
                  <p>Assets can be tagged after creating the risk.</p>
                </Card>
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
                <Select {...riskOwnerSelectProps} />
              </Form.Item>
              <Form.Item
                name="risk_reporter_id"
                label="Risk Reporter"
              >
                <Select {...riskReporterSelectProps} />
              </Form.Item>
              <Form.Item
                name="risk_manager_id"
                label="Risk Manager"
              >
                <Select {...riskManagerSelectProps} />
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
            </Card>
          </Col>
        </Row>
      </Form>
    </Create>
  );
}
