"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Tabs, Row, Col } from "antd";

const { TextArea } = Input;
const { TabPane } = Tabs;

export default function IncidentCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "incident_management",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "entity",
    optionValue: "id",
  });

  const { selectProps: incidentOwnerSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const handleCreate = async (values: any) => {
    try {
      const response = await formProps.onFinish?.(values);
      if (response && 'data' in response) {
        createChangeHistory({
          resource: "change_history",
          values: {
            table_name: "incident_management",
            record_id: (response as any)?.data?.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating incident:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Information" key="1">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="incident_id"
                  label="Incident ID"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incident_summary"
                  label="Incident Summary"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="severity"
                  label="Severity"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'Critical', label: 'Critical' },
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="impact_type"
                  label="Impact Type"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'Security', label: 'Security' },
                      { value: 'Availability', label: 'Availability' },
                      { value: 'Performance', label: 'Performance' },
                      { value: 'Data', label: 'Data' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="incident_status"
                  label="Incident Status"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'Open', label: 'Open' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Resolved', label: 'Resolved' },
                      { value: 'Closed', label: 'Closed' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Response Details" key="2">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="detection_method"
                  label="Detection Method"
                >
                  <Select
                    options={[
                      { value: 'Automated Alert', label: 'Automated Alert' },
                      { value: 'Manual Detection', label: 'Manual Detection' },
                      { value: 'Third Party', label: 'Third Party' },
                      { value: 'Customer Report', label: 'Customer Report' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="response_time"
                  label="Initial Response Time"
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="containment_measures"
                  label="Containment Measures"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="resolution_steps"
                  label="Resolution Steps"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Assignment" key="3">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="entity_id"
                  label="Entity"
                  rules={[{ required: true }]}
                >
                  <Select {...entitySelectProps} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="incident_owner"
                  label="Incident Owner"
                  rules={[{ required: true }]}
                >
                  <Select {...incidentOwnerSelectProps} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reported_date"
                  label="Reported Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="target_resolution_date"
                  label="Target Resolution Date"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Tasks" key="4">
            <p>Tasks can be added after creating the incident.</p>
          </TabPane>
        </Tabs>
        <Form.Item
          name="workflow_status"
          label="Workflow Status"
          rules={[{ required: true }]}
          initialValue="Reported"
        >
          <Select
            options={[
              { value: 'Reported', label: 'Reported' },
              { value: 'Under Investigation', label: 'Under Investigation' },
              { value: 'Remediation', label: 'Remediation' },
              { value: 'Resolved', label: 'Resolved' },
              { value: 'Closed', label: 'Closed' },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
} 