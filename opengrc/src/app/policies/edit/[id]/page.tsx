"use client";

import { Edit, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, DatePicker, Select, Card, Row, Col, message } from "antd";
import { useParams } from "next/navigation";
import dayjs from 'dayjs';
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";

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
  prepared_date?: string;
  review_date?: string;
  next_revision_due_date?: string;
}

export default function PolicyEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm<IPolicyData, HttpError>({
    resource: "policies",
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

  const { renderAttachments } = useAttachments(params.id as string);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form 
        {...formProps} 
        layout="vertical"
        initialValues={{
          ...record,
          prepared_date: record?.prepared_date ? dayjs(record.prepared_date) : null,
          review_date: record?.review_date ? dayjs(record.review_date) : null,
          next_revision_due_date: record?.next_revision_due_date ? dayjs(record.next_revision_due_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
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
            <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
              {renderAttachments()}
            </Card>
            <Activity parentId={params.id as string} />
          </Col>
          <Col span={6}>
            <Card title="Metadata" style={{ marginBottom: 20, borderRadius: 8 }}>
              <Form.Item label="Created At" name="created_at">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Updated At" name="updated_at">
                <Input disabled />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}