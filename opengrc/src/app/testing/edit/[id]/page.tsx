"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { useMany, useCreate, useGetIdentity, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Form, Input, Select, DatePicker, Row, Col, Card, Typography } from "antd";
import { Activity } from "../../activity";
import { useAttachments } from "../../attachments";
import dayjs from 'dayjs';
import { TasksTab } from "../../tasks";

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

export default function TestingEdit() {
  const params = useParams();
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "testing",
    id: params.id as string,
  });

  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { data, isLoading } = queryResult || {};
  const record = data?.data;

  const { renderAttachments } = useAttachments(params.id as string);

  const { selectProps: controlSelectProps } = useSelect({
    resource: "controls",
    optionLabel: "control_id",
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
              table_name: "testing",
              record_id: params.id,
              action: "Updated",
              change_details: JSON.stringify(changedFields),
              changed_by: identity?.id,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error updating testing:", error);
    }
  };

  const { data: companyInfoData, isLoading: companyInfoLoading } = useOne({
    resource: "company_info",
    id: record?.company_info_id || "",
    queryOptions: {
      enabled: !!record?.company_info_id,
    },
  });

  const { data: evidenceProviderData, isLoading: evidenceProviderLoading } = useOne({
    resource: "users",
    id: record?.evidence_provider_id || "",
    queryOptions: {
      enabled: !!record?.evidence_provider_id,
    },
  });

  const { data: complianceManagerData, isLoading: complianceManagerLoading } = useOne({
    resource: "users",
    id: record?.compliance_manager_id || "",
    queryOptions: {
      enabled: !!record?.compliance_manager_id,
    },
  });

  const tabItems = [
    // ... other tab items
    {
      key: "tasks",
      label: "Tasks",
      children: <TasksTab testingId={params.id as string} />,
    },
  ];

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form 
        {...formProps} 
        onFinish={handleUpdate}
        layout="vertical"
        initialValues={{
          ...record,
          test_date: record?.test_date ? dayjs(record.test_date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={18}>
            <Card>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name="control_id"
                    label="Related Control"
                    rules={[{ required: true }]}
                  >
                    <Select {...controlSelectProps} />
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
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea rows={4} />
              </Form.Item>
            </Card>
            <Card title="Attachments" style={{ marginTop: 20, borderRadius: 8 }}>
              {renderAttachments()}
            </Card>
            <Activity parentId={params.id as string} />
          </Col>
          <Col span={6}>
            <Card title="Contextual Information">
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Text strong>Company Info:</Text>
                  <Paragraph>{companyInfoData?.data?.entity || "N/A"}</Paragraph>
                </Col>
                <Col span={24}>
                  <Text strong>Evidence Provider:</Text>
                  <Paragraph>{evidenceProviderData?.data?.full_name || "N/A"}</Paragraph>
                </Col>
                <Col span={24}>
                  <Text strong>Compliance Manager:</Text>
                  <Paragraph>{complianceManagerData?.data?.full_name || "N/A"}</Paragraph>
                </Col>
                <Col span={24}>
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
                <Col span={24}>
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
                <Col span={24}>
                  <Form.Item
                    name="tester"
                    label="Tester"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="test_date"
                    label="Test Date"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
