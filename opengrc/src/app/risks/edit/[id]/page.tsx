"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, DatePicker, Tabs, Card, Row, Col, Typography } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';

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

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "name",
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
    <Edit saveButtonProps={saveButtonProps}>
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
            <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
              {renderAttachments()}
            </Card>
            <Activity parentId={params.id as string} />
          </Col>
          <Col span={6}>
            <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
              <Row gutter={[16, 24]}>
                <Col span={24}>
                  <Title level={5}>Created At</Title>
                  <p>{record?.created_at ? dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</p>
                </Col>
                <Col span={24}>
                  <Title level={5}>Updated At</Title>
                  <p>{record?.updated_at ? dayjs(record.updated_at).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}