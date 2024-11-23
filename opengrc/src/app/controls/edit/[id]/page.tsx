"use client";

import { Edit, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Select, Tabs, Card, Row, Col, Typography, DatePicker, Tag, message } from "antd";
import { useParams } from "next/navigation";
import dayjs from 'dayjs';

const { TextArea } = Input;

interface IError {
  response: {
    data: {
      errors: {
        [key: string]: string[];
      };
    };
  };
}

// Add validation rules (same as create page)
const controlIdRules = [
  { required: true, message: 'Control ID is required' },
  { min: 3, message: 'Control ID must be at least 3 characters' },
  { max: 100, message: 'Control ID cannot exceed 100 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        if (!/^[A-Za-z0-9-_\.]+$/.test(value)) {
          throw new Error('Only letters, numbers, hyphens, dots and underscores allowed');
        }
      }
      return Promise.resolve();
    }
  }
];

const domainRules = [
  { required: true, message: 'Domain is required' },
  { max: 200, message: 'Domain cannot exceed 200 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
      }
      return Promise.resolve();
    }
  }
];

const controlRequirementsRules = [
  { required: true, message: 'Control requirements are required' },
  { max: 2000, message: 'Control requirements cannot exceed 2000 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
      }
      return Promise.resolve();
    }
  }
];

const riskStatementRules = [
  { required: true, message: 'Risk statement is required' },
  { max: 2000, message: 'Risk statement cannot exceed 2000 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
      }
      return Promise.resolve();
    }
  }
];

const implementationRules = [
  { max: 2000, message: 'Implementation details cannot exceed 2000 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
      }
      return Promise.resolve();
    }
  }
];

const frameworkRules = [
  { max: 200, message: 'Framework field cannot exceed 200 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
      }
      return Promise.resolve();
    }
  }
];

export default function ControlEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "controls",
    id: params.id as string,
    meta: {
      onError: (error: IError) => {
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors;
          
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

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Overview" key="1">
                <Form.Item
                  name="control_id"
                  label="Control ID"
                  rules={controlIdRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="domain"
                  label="Domain"
                  rules={domainRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="control_requirements"
                  label="Control Requirements"
                  rules={controlRequirementsRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={5}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  name="risk_statement"
                  label="Risk Statement"
                  rules={riskStatementRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={3}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Implementation" key="2">
                <Form.Item
                  name="current_implementation"
                  label="Current Implementation"
                  rules={implementationRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={5}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  name="enhancements"
                  label="Enhancements"
                  rules={implementationRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={3}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  name="implementation_guidance"
                  label="Implementation Guidance"
                  rules={implementationRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={3}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  name="technological_enabler"
                  label="Technological Enabler"
                  rules={frameworkRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Framework" key="3">
                <Form.Item
                  name="framework_name"
                  label="Framework Name"
                  rules={frameworkRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="framework_version"
                  label="Framework Version"
                  rules={frameworkRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="framework_description"
                  label="Framework Description"
                  rules={implementationRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={3}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
