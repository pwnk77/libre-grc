"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Card, Row, Col, Select } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import { useSelect } from "@refinedev/antd";

const { TextArea } = Input;

export default function CitationEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "citations",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { selectProps: authorityDocumentSelectProps } = useSelect({
    resource: "authority_documents",
    optionLabel: "title",
    optionValue: "id",
  });

  const handleUpdate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        const changedFields = Object.keys(values).reduce((acc: Record<string, any>, key) => {
          if (JSON.stringify(values[key]) !== JSON.stringify(record?.[key])) {
            acc[key] = values[key];
          }
          return acc;
        }, {});

        if (Object.keys(changedFields).length > 0) {
          createChangeHistory({
            resource: "change_history",
            values: {
              table_name: "citations",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating citation:", error);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form 
        {...formProps} 
        onFinish={handleUpdate}
        layout="vertical"
        initialValues={record}
      >
        <Row gutter={24}>
          <Col span={18}>
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
            <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
              {renderAttachments()}
            </Card>
            <Activity parentId={params.id as string} />
          </Col>
          <Col span={6}>
            <Card title="Metadata" style={{ marginBottom: 20, borderRadius: 8 }}>
              <Form.Item label="Created At" name="created_at">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Updated At" name="updated_at">
                <Input disabled />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
