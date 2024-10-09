"use client";

import { Create, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity, BaseRecord, CreateResponse } from "@refinedev/core";
import { Form, Input, Card, Row, Col } from "antd";
import { useSelect } from "@refinedev/antd";

const { TextArea } = Input;

export default function CitationCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "citations",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { selectProps: authorityDocumentSelectProps } = useSelect({
    resource: "authority_documents",
    optionLabel: "title",
    optionValue: "id",
  });

  const handleCreate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        const createResponse = response as CreateResponse<BaseRecord>;
        if (createResponse.data.id) {
          createChangeHistory({
            resource: "change_history",
            values: {
              table_name: "citations",
              record_id: createResponse.data.id,
              action: "Created",
              change_details: JSON.stringify(values),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error creating citation:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Card title="Citation Details" style={{ marginBottom: 20, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Citation Text"
                name="citation_text"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reference Identifier"
                name="reference_identifier"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Authority Document"
                name="authority_document_id"
              >
                <Select {...authorityDocumentSelectProps} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Create>
  );
}