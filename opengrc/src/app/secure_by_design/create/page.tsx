"use client";

import { Create, useForm } from "@refinedev/antd";
import { useCreate, useGetIdentity, useList } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Typography, Card, Row, Col, Switch } from "antd";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function SecureByDesignCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "secure_by_design",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const [companies, setCompanies] = useState<{ value: string; label: string }[]>([]);

  const { data: companyData, isLoading: companyLoading } = useList({
    resource: "company_info",
  });

  useEffect(() => {
    if (companyData?.data) {
      const formattedCompanies = companyData.data.map(company => ({
        value: company.id,
        label: company.name,
      }));
      setCompanies(formattedCompanies);
    }
  }, [companyData]);

  const handleCreate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        createChangeHistory({
          resource: "change_history",
          values: {
            table_name: "secure_by_design",
            record_id: response.data.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating secure by design record:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Card title="Secure by Design Details" style={{ marginBottom: 20, borderRadius: 8 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Product Name"
                name="product_name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Product Type"
                name="product_type"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'New', label: 'New' },
                    { value: 'Existing', label: 'Existing' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Description"
                name="description"
              >
                <TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Line of Business"
                name="line_of_business"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Expected Go Live Date"
                name="expected_go_live_date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Entity"
                name="entity_id"
              >
                <Select
                  options={companies}
                  loading={companyLoading}
                  placeholder="Select Entity"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Infrastructure Details"
                name="infrastructure_details"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="External Party Involvement"
                name="external_party_involvement"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Applicable Compliances"
                name="applicable_compliances"
              >
                <Select mode="tags" style={{ width: '100%' }} placeholder="Enter applicable compliances" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Advisory Provided"
                name="advisory_provided"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reviewer"
                name="reviewer"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Workflow Status"
                name="workflow_status"
              >
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
      </Form>
    </Create>
  );
}