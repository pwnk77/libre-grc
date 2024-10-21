"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, Card, Row, Col, Typography, DatePicker, Switch } from "antd";
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

export default function SecureByDesignEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "secure_by_design",
    id: params.id as string,
    action: "edit",
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { selectProps: companySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "entity",
    optionValue: "id",
  });

  const { selectProps: userSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
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
              table_name: "secure_by_design",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating secure by design record:", error);
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
          expected_go_live_date: record?.expected_go_live_date ? dayjs(record.expected_go_live_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Card title="Secure by Design Details" style={{ marginBottom: 20, borderRadius: 8 }}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="product_name" label="Product Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="product_type" label="Product Type" rules={[{ required: true }]}>
                    <Select
                      options={[
                        { value: 'New', label: 'New' },
                        { value: 'Existing', label: 'Existing' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="description" label="Description">
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="expected_go_live_date" label="Expected Go Live Date">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="infrastructure_details" label="Infrastructure Details">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="external_party_involvement" label="External Party Involvement" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="applicable_compliances" label="Applicable Compliances">
                    <Select mode="tags" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="advisory_provided" label="Advisory Provided">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="workflow_status" label="Workflow Status">
                    <Select
                      options={[
                        { value: 'Initiation', label: 'Initiation' },
                        { value: 'Design Review', label: 'Design Review' },
                        { value: 'Implementation', label: 'Implementation' },
                        { value: 'Verification', label: 'Verification' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Contextual Information" style={{ marginBottom: 20, borderRadius: 8 }}>
              <Form.Item name="company_info_id" label="Company">
                <Select
                  {...companySelectProps}
                  placeholder="Select Company"
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item name="product_owner_id" label="Product Owner">
                <Select
                  {...userSelectProps}
                  placeholder="Select Product Owner"
                />
              </Form.Item>
              <Form.Item name="sbd_reviewer_id" label="SBD Reviewer">
                <Select
                  {...userSelectProps}
                  placeholder="Select SBD Reviewer"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
