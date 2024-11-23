"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity, HttpError } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, DatePicker, Tabs, Card, Row, Col, Typography, Divider, message } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';
import { TasksTab } from "../../tasks";
import { AssetsTab } from "../../assets";
import { useState } from "react";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;

// Add interface for form error type
interface IError {
  response: {
    data: {
      errors: {
        [key: string]: string[];
      };
    };
  };
}

// Add sanitization helper
const sanitizeInput = (value: string): string => {
  // Remove HTML tags
  const withoutHtml = value.replace(/<[^>]*>/g, '');
  
  // Remove special characters except basic punctuation
  const sanitized = withoutHtml.replace(/[^\w\s.,!?-]/g, '');
  
  return sanitized.trim();
};

// Add validation rules
const riskSummaryRules = [
  { required: true, message: 'Risk summary is required' },
  { min: 10, message: 'Risk summary must be at least 10 characters' },
  { max: 500, message: 'Risk summary cannot exceed 500 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        // Check for potential script injection
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        // Check for SQL injection patterns
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        // Check for excessive special characters
        if (/[^\w\s.,!?-]/.test(value)) {
          throw new Error('Contains invalid special characters');
        }
      }
      return Promise.resolve();
    }
  }
];

// Add validation rules for description
const descriptionRules = [
  { max: 2000, message: 'Description cannot exceed 2000 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        // Check for potential script injection
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        // Check for SQL injection patterns
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        // Check for excessive special characters
        if (/[^\w\s.,!?-]/.test(value)) {
          throw new Error('Contains invalid special characters');
        }
      }
      return Promise.resolve();
    }
  }
];

export default function RiskEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "risks",
    id: params.id as string,
    meta: {
      onError: (error: IError) => {
        // Handle server-side validation errors
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors;
          
          // Set form errors from server response
          Object.keys(errors).forEach((key) => {
            formProps.form?.setFields([
              {
                name: key,
                errors: Array.isArray(errors[key]) ? errors[key] : [errors[key]],
              },
            ]);
          });
          message.error('Validation failed. Please check the form.');
        }
      },
    },
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
      // Sanitize both fields before submission
      const sanitizedValues = {
        ...values,
        risk_summary: sanitizeInput(values.risk_summary),
        description: sanitizeInput(values.description),
      };

      const response = await formProps.onFinish?.(sanitizedValues);
      if (response && 'data' in response) {
        const changedFields = Object.keys(sanitizedValues).reduce((acc: Record<string, any>, key) => {
          if (JSON.stringify(sanitizedValues[key]) !== JSON.stringify(record?.[key])) {
            acc[key] = sanitizedValues[key];
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
          message.success('Risk updated successfully');
        }
      }
    } catch (error) {
      console.error("Error updating risk:", error);
      message.error('Failed to update risk');
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
                        rules={[
                          { required: true },
                          { pattern: /^[A-Za-z0-9-_]+$/, message: "Risk ID can only contain letters, numbers, hyphens and underscores" }
                        ]}
                        validateTrigger={["onChange", "onBlur"]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="risk_summary"
                        label="Risk Summary"
                        rules={riskSummaryRules}
                        validateTrigger={['onChange', 'onBlur']}
                        normalize={(value) => value?.trim()}
                      >
                        <Input.TextArea
                          rows={2}
                          maxLength={500}
                          showCount
                          onPaste={(e) => {
                            // Sanitize pasted content
                            const pastedText = e.clipboardData.getData('text');
                            e.preventDefault();
                            const sanitized = sanitizeInput(pastedText);
                            const target = e.target as HTMLTextAreaElement;
                            const start = target.selectionStart;
                            const end = target.selectionEnd;
                            const currentValue = target.value;
                            const newValue = currentValue.substring(0, start) + sanitized + currentValue.substring(end);
                            formProps.form?.setFieldValue('risk_summary', newValue);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                        rules={descriptionRules}
                        validateTrigger={['onChange', 'onBlur']}
                        normalize={(value) => value?.trim()}
                      >
                        <Input.TextArea
                          rows={4}
                          maxLength={2000}
                          showCount
                          onPaste={(e) => {
                            // Sanitize pasted content
                            const pastedText = e.clipboardData.getData('text');
                            e.preventDefault();
                            const sanitized = sanitizeInput(pastedText);
                            const target = e.target as HTMLTextAreaElement;
                            const start = target.selectionStart;
                            const end = target.selectionEnd;
                            const currentValue = target.value;
                            const newValue = currentValue.substring(0, start) + sanitized + currentValue.substring(end);
                            formProps.form?.setFieldValue('description', newValue);
                          }}
                        />
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
