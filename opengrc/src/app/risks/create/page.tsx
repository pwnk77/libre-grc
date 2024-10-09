"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Row, Col, Tabs } from "antd";

const { TextArea } = Input;
const { TabPane } = Tabs;

export default function RiskCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "risks",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "name",
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
            record_id: response.data.id,
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Information" key="1">
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
            </Row>
            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="risk_analyst"
                  label="Risk Analyst"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="risk_reporter"
                  label="Risk Reporter"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Risk Details" key="2">
            <Form.Item
              name="entity_id"
              label="Entity"
            >
              <Select {...entitySelectProps} />
            </Form.Item>
            <Form.Item
              name="line_of_business"
              label="Line of Business"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="assets"
              label="Assets"
            >
              <Select mode="tags" />
            </Form.Item>
            <Form.Item
              name="support_functions"
              label="Support Functions"
            >
              <Select mode="tags" />
            </Form.Item>
          </TabPane>
          <TabPane tab="Risk Assessment" key="3">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="impact_type"
                  label="Impact Type"
                >
                  <Input />
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
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="likelihood"
                  label="Likelihood"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'Rare', label: 'Rare' },
                      { value: 'Slightly Likely', label: 'Slightly Likely' },
                      { value: 'Likely', label: 'Likely' },
                      { value: 'Almost Certain', label: 'Almost Certain' },
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
          </TabPane>
          <TabPane tab="Risk Treatment" key="4">
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
            <Form.Item
              name="risk_due_date"
              label="Risk Due Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="residual_risk_level"
              label="Residual Risk Level"
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
            <Form.Item
              name="compensating_controls"
              label="Compensating Controls"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="mitigating_controls"
              label="Mitigating Controls"
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="risk_acceptance_justifications"
              label="Risk Acceptance Justifications"
            >
              <TextArea rows={4} />
            </Form.Item>
          </TabPane>
        </Tabs>
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
      </Form>
    </Create>
  );
}