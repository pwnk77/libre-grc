"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, DatePicker, Card, Row, Col } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function AuthorityDocumentEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "authority_documents",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

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
              table_name: "authority_documents",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating authority document:", error);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form 
        {...formProps} 
        onFinish={handleUpdate}
        layout="vertical"
        initialValues={{
          ...record,
          publication_date: record?.publication_date ? dayjs(record.publication_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
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