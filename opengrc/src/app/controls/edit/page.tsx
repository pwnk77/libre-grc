"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function ControlEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Control ID"
          name="control_id"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Domain"
          name="domain"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Control Requirements"
          name="control_requirements"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
        <Form.Item
          label="Risk Statement"
          name="risk_statement"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Compliance Level"
          name="compliance_level"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Control Type"
          name="control_type"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Control Frequency"
          name="control_frequency"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Compliance Status"
          name="compliance_status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "compliant", label: "Compliant" },
              { value: "non_compliant", label: "Non-Compliant" },
              { value: "partially_compliant", label: "Partially Compliant" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Workflow Status"
          name="workflow_status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "draft", label: "Draft" },
              { value: "in_review", label: "In Review" },
              { value: "approved", label: "Approved" },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}