"use client";

import { Create, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity, BaseRecord, CreateResponse } from "@refinedev/core";
import { Form, Input, DatePicker, Select, Card, Row, Col } from "antd";

const { TextArea } = Input;

export default function PolicyCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "policies",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const handleCreate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        const createResponse = response as CreateResponse<BaseRecord>;
        if (createResponse.data.id) {
          createChangeHistory({
            resource: "change_history",
            values: {
              table_name: "policies",
              record_id: createResponse.data.id,
              action: "Created",
              change_details: JSON.stringify(values),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error creating policy:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Card title="Policy Details" style={{ marginBottom: 20, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Policy Name"
                name="policy_name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Purpose"
                name="purpose"
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Prepared By"
                name="prepared_by"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reviewed By"
                name="reviewed_by"
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
              >
                <Input />
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