"use client";

import { Edit, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Card, Row, Col, message } from "antd";
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
const titleRules = [
  { required: true, message: 'Title is required' },
  { min: 3, message: 'Title must be at least 3 characters' },
  { max: 200, message: 'Title cannot exceed 200 characters' },
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

const identifierRules = [
  { max: 100, message: 'Identifier cannot exceed 100 characters' },
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
          throw new Error('Only letters, numbers, hyphens, underscores and dots allowed');
        }
      }
      return Promise.resolve();
    }
  }
];

const issuingBodyRules = [
  { max: 200, message: 'Issuing body cannot exceed 200 characters' },
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

const versionRules = [
  { max: 50, message: 'Version cannot exceed 50 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        if (!/^[A-Za-z0-9\._-]+$/.test(value)) {
          throw new Error('Only letters, numbers, dots, hyphens and underscores allowed');
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

export default function AuthorityDocumentEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "authority_documents",
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
          publication_date: record?.publication_date ? dayjs(record.publication_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Card title="Authority Document Details">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={titleRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Select.Option value="Circular">Circular</Select.Option>
                      <Select.Option value="Certification">Certification</Select.Option>
                      <Select.Option value="Standard">Standard</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Identifier"
                    name="identifier"
                    rules={identifierRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Issuing Body"
                    name="issuing_body"
                    rules={issuingBodyRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Version"
                    name="version"
                    rules={versionRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={descriptionRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <TextArea 
                      rows={4}
                      maxLength={2000}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
