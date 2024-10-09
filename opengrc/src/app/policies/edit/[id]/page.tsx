"use client";

import { Edit, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, DatePicker, Select, Card, Row, Col } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function PolicyEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "policies",
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
              table_name: "policies",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating policy:", error);
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
          prepared_date: record?.prepared_date ? dayjs(record.prepared_date) : null,
          review_date: record?.review_date ? dayjs(record.review_date) : null,
          next_revision_due_date: record?.next_revision_due_date ? dayjs(record.next_revision_due_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
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