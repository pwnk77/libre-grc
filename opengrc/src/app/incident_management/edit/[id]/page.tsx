"use client";

import { Edit, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Tabs, Card, Row, Col, message } from "antd";
import { useParams } from "next/navigation";
import dayjs from 'dayjs';

const { TextArea } = Input;
const { TabPane } = Tabs;

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
const incidentIdRules = [
  { required: true, message: 'Incident ID is required' },
  { min: 3, message: 'Incident ID must be at least 3 characters' },
  { max: 100, message: 'Incident ID cannot exceed 100 characters' },
  {
    validator: async (_: any, value: string) => {
      if (value) {
        if (/<[^>]*>/.test(value)) {
          throw new Error('HTML tags are not allowed');
        }
        if (/(\b(select|insert|update|delete|drop|union|exec)\b)|(['";])/i.test(value)) {
          throw new Error('Invalid characters or SQL keywords detected');
        }
        if (!/^[A-Za-z0-9-_]+$/.test(value)) {
          throw new Error('Only letters, numbers, hyphens and underscores allowed');
        }
      }
      return Promise.resolve();
    }
  }
];

const incidentSummaryRules = [
  { required: true, message: 'Incident summary is required' },
  { min: 10, message: 'Incident summary must be at least 10 characters' },
  { max: 500, message: 'Incident summary cannot exceed 500 characters' },
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

const containmentMeasuresRules = [
  { max: 2000, message: 'Containment measures cannot exceed 2000 characters' },
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

const resolutionStepsRules = [
  { max: 2000, message: 'Resolution steps cannot exceed 2000 characters' },
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

export default function IncidentEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "incident_management",
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
          response_time: record?.response_time ? dayjs(record.response_time) : null,
          reported_date: record?.reported_date ? dayjs(record.reported_date) : null,
          target_resolution_date: record?.target_resolution_date ? dayjs(record.target_resolution_date) : null,
        }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Information" key="1">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="incident_id"
                  label="Incident ID"
                  rules={incidentIdRules}
                  validateTrigger={['onChange', 'onBlur']}
                  normalize={(value) => value?.trim()}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incident_summary"
                  label="Incident Summary"
                  rules={incidentSummaryRules}
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
                    rows={4}
                    maxLength={2000}
                    showCount
                  />
                </Form.Item>
              </Col>
              {/* ... other fields ... */}
            </Row>
          </TabPane>
          <TabPane tab="Response Details" key="2">
            <Row gutter={24}>
              {/* ... other fields ... */}
              <Col span={24}>
                <Form.Item
                  name="containment_measures"
                  label="Containment Measures"
                  rules={containmentMeasuresRules}
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
              <Col span={24}>
                <Form.Item
                  name="resolution_steps"
                  label="Resolution Steps"
                  rules={resolutionStepsRules}
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
          </TabPane>
          {/* ... other tabs ... */}
        </Tabs>
      </Form>
    </Edit>
  );
} 