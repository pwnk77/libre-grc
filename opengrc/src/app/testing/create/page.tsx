"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Row, Col, message } from "antd";

const { TextArea } = Input;

interface ITestData {
  evidence_request?: string;
  test_of_design?: string;
  test_of_effectiveness?: string;
  test_results?: string;
  tester?: string;
  notes?: string;
  control_id?: string;
  audit_strategy?: string;
  test_date?: string;
  compliance_status?: string;
  workflow_status?: string;
}

interface IError {
  response: {
    data: {
      errors: {
        [key: string]: string[];
      };
    };
  };
}

export default function TestingCreate() {
  const { formProps, saveButtonProps } = useForm<ITestData, HttpError>({
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

  const { selectProps: controlSelectProps } = useSelect({
    resource: "controls",
    optionLabel: "control_id",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="control_id"
              label="Related Control"
              rules={[{ required: true }]}
            >
              <Select {...controlSelectProps} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="test_date"
              label="Test Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Evidence Request"
          name="evidence_request"
          rules={[
            { required: true, message: 'Evidence request is required' },
            { min: 10, message: 'Evidence request must be at least 10 characters' },
            { max: 2000, message: 'Evidence request cannot exceed 2000 characters' },
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

        <Form.Item
          name="audit_strategy"
          label="Audit Strategy"
        >
          <Select
            style={{ width: '100%' }}
            options={[
              { value: 'Substantive', label: 'Substantive' },
              { value: 'Control-based', label: 'Control-based' },
              { value: 'Combined', label: 'Combined' },
              { value: 'Risk-based', label: 'Risk-based' },
              { value: 'Compliance-based', label: 'Compliance-based' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Test of Design"
          name="test_of_design"
          rules={[
            { max: 2000, message: 'Test of design cannot exceed 2000 characters' },
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

        <Form.Item
          label="Test of Effectiveness"
          name="test_of_effectiveness"
          rules={[
            { max: 2000, message: 'Test of effectiveness cannot exceed 2000 characters' },
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

        <Form.Item
          label="Test Results"
          name="test_results"
          rules={[
            { max: 2000, message: 'Test results cannot exceed 2000 characters' },
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

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="compliance_status"
              label="Compliance Status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'Not Tested', label: 'Not Tested' },
                  { value: 'Failed', label: 'Failed' },
                  { value: 'Passed with Exceptions', label: 'Passed with Exceptions' },
                  { value: 'Passed', label: 'Passed' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="workflow_status"
              label="Workflow Status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 'Planned', label: 'Planned' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Reviewed', label: 'Reviewed' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tester"
          name="tester"
          rules={[
            { required: true, message: 'Tester name is required' },
            { max: 100, message: 'Tester name cannot exceed 100 characters' },
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

        <Form.Item
          label="Notes"
          name="notes"
          rules={[
            { max: 2000, message: 'Notes cannot exceed 2000 characters' },
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
      </Form>
    </Create>
  );
}
