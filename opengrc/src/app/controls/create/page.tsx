"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function ControlCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "controls",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
        {/* Add other form items here */}
      </Form>
    </Create>
  );
}