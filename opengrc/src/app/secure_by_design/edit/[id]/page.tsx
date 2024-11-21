"use client";

import { Edit, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Switch, Card, Row, Col, message } from "antd";
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
const productNameRules = [
  { required: true, message: 'Product name is required' },
  { min: 3, message: 'Product name must be at least 3 characters' },
  { max: 200, message: 'Product name cannot exceed 200 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        if (/[^\w\s.,!?-]/.test(value)) {
          throw new Error('Contains invalid special characters');
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

const infrastructureDetailsRules = [
  { max: 1000, message: 'Infrastructure details cannot exceed 1000 characters' },
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

const advisoryProvidedRules = [
  { max: 1000, message: 'Advisory cannot exceed 1000 characters' },
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

const reviewerRules = [
  { max: 100, message: 'Reviewer name cannot exceed 100 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (!/^[a-zA-Z\s.,'-]+$/.test(value)) {
          throw new Error('Only letters, spaces and basic punctuation allowed');
        }
      }
      return Promise.resolve();
    }
  }
];

export default function SecureByDesignEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "secure_by_design",
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
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form 
        {...formProps} 
        layout="vertical"
        initialValues={{
          ...record,
          expected_go_live_date: record?.expected_go_live_date ? dayjs(record.expected_go_live_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Card title="Secure by Design Details">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="product_name"
                    label="Product Name"
                    rules={productNameRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
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
                    <TextArea 
                      rows={3} 
                      maxLength={2000}
                      showCount
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="infrastructure_details"
                    label="Infrastructure Details"
                    rules={infrastructureDetailsRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="advisory_provided"
                    label="Advisory Provided"
                    rules={advisoryProvidedRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="reviewer"
                    label="Reviewer"
                    rules={reviewerRules}
                    validateTrigger={['onChange', 'onBlur']}
                    normalize={(value) => value?.trim()}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                {/* Rest of your form fields... */}
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
