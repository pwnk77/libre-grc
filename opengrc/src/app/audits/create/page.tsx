"use client";

import { Create, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Typography, Tabs, Card, Row, Col, message } from "antd";

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

// Add validation rules
const auditNameRules = [
  { required: true, message: 'Audit name is required' },
  { min: 3, message: 'Audit name must be at least 3 characters' },
  { max: 200, message: 'Audit name cannot exceed 200 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        if (!/^[A-Za-z0-9\s\-_.,()]+$/.test(value)) {
          throw new Error('Only letters, numbers, spaces, and basic punctuation allowed');
        }
      }
      return Promise.resolve();
    }
  }
];

const scopeRules = [
  { max: 2000, message: 'Scope cannot exceed 2000 characters' },
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

const descriptionRules = [
  { max: 2000, message: 'Description cannot exceed 2000 characters' },
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

export default function AuditCreate() {
  const { formProps, saveButtonProps } = useForm({
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

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={18}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Overview" key="1">
                <Form.Item
                  label="Audit Name"
                  name="audit_name"
                  rules={auditNameRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Scope"
                  name="scope"
                  rules={scopeRules}
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
                  label="Description"
                  name="description"
                  rules={descriptionRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <TextArea 
                    rows={5}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>
              </Tabs.TabPane>
              {/* Rest of your tabs */}
            </Tabs>
          </Col>
        </Row>
      </Form>
    </Create>
  );
}