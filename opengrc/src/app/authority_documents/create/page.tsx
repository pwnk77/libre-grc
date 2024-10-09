"use client";

import { Create, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity, BaseRecord, CreateResponse } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Card, Row, Col } from "antd";

const { TextArea } = Input;

export default function AuthorityDocumentCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "authority_documents",
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
              table_name: "authority_documents",
              record_id: createResponse.data.id,
              action: "Created",
              change_details: JSON.stringify(values),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error creating authority document:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Card title="Authority Document Details" style={{ marginBottom: 20, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Type"
                name="type"
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
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Issuing Body"
                name="issuing_body"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Version"
                name="version"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Publication Date"
                name="publication_date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Create>
  );
}