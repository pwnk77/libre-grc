"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Row, Col } from "antd";

const { TextArea } = Input;

export default function TestingCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "testing",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { selectProps: controlSelectProps } = useSelect({
    resource: "controls",
    optionLabel: "control_id",
    optionValue: "id",
  });

  const handleCreate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        createChangeHistory({
          resource: "change_history",
          values: {
            table_name: "testing",
            record_id: (response as any)?.data?.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating testing:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
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
          name="evidence_request"
          label="Evidence Request"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
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
          name="test_of_design"
          label="Test of Design"
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="test_of_effectiveness"
          label="Test of Effectiveness"
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="test_results"
          label="Test Results"
        >
          <TextArea rows={4} />
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
          name="tester"
          label="Tester"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Create>
  );
}
