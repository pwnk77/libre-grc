"use client";

import { Create, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, DatePicker, Select, Card, Row, Col, message } from "antd";

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

interface IPolicyData {
  policy_name?: string;
  purpose?: string;
  prepared_by?: string;
  reviewed_by?: string;
  policy_link?: string;
  workflow_status?: string;
}

export default function PolicyCreate() {
  const { formProps, saveButtonProps } = useForm<IPolicyData, HttpError>({
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
        <Card title="Policy Details" style={{ marginBottom: 20, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Policy Name"
                name="policy_name"
                rules={[
                  { required: true, message: 'Policy name is required' },
                  { min: 3, message: 'Policy name must be at least 3 characters' },
                  { max: 200, message: 'Policy name cannot exceed 200 characters' },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        if (/<[^>]*>/.test(value)) {
                          throw new Error('HTML tags are not allowed');
                        }
                        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
                          throw new Error('Invalid characters or SQL keywords detected');
                        }
                      }
                    }
                  }
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Purpose"
                name="purpose"
                rules={[
                  { max: 2000, message: 'Purpose cannot exceed 2000 characters' },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        if (/<[^>]*>/.test(value)) {
                          throw new Error('HTML tags are not allowed');
                        }
                        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
                          throw new Error('Invalid characters or SQL keywords detected');
                        }
                      }
                    }
                  }
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <TextArea rows={4} maxLength={2000} showCount />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Prepared By"
                name="prepared_by"
                rules={[
                  { max: 100, message: 'Name cannot exceed 100 characters' },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        if (/<[^>]*>/.test(value)) {
                          throw new Error('HTML tags are not allowed');
                        }
                        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
                          throw new Error('Invalid characters or SQL keywords detected');
                        }
                        if (!/^[A-Za-z\s\-'.]+$/.test(value)) {
                          throw new Error('Only letters, spaces, hyphens, apostrophes and periods allowed');
                        }
                      }
                    }
                  }
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reviewed By"
                name="reviewed_by"
                rules={[
                  { max: 100, message: 'Name cannot exceed 100 characters' },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        if (/<[^>]*>/.test(value)) {
                          throw new Error('HTML tags are not allowed');
                        }
                        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
                          throw new Error('Invalid characters or SQL keywords detected');
                        }
                        if (!/^[A-Za-z\s\-'.]+$/.test(value)) {
                          throw new Error('Only letters, spaces, hyphens, apostrophes and periods allowed');
                        }
                      }
                    }
                  }
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Prepared Date"
                name="prepared_date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Review Date"
                name="review_date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Next Revision Due Date"
                name="next_revision_due_date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Policy Link"
                name="policy_link"
                rules={[
                  { max: 2000, message: 'URL cannot exceed 2000 characters' },
                  {
                    validator: async (_, value) => {
                      if (value) {
                        if (/<[^>]*>/.test(value)) {
                          throw new Error('HTML tags are not allowed');
                        }
                        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
                          throw new Error('Invalid characters or SQL keywords detected');
                        }
                        try {
                          new URL(value);
                        } catch {
                          throw new Error('Please enter a valid URL (e.g., https://example.com)');
                        }
                      }
                    }
                  }
                ]}
                validateTrigger={['onChange', 'onBlur']}
              >
                <Input placeholder="https://example.com/policy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Workflow Status"
                name="workflow_status"
              >
                <Select>
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Under Review">Under Review</Select.Option>
                  <Select.Option value="Approved">Approved</Select.Option>
                  <Select.Option value="Published">Published</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Create>
  );
}