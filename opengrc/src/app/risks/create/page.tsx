"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { Form, Input, Select, DatePicker, Row, Col, Tabs } from "antd";

const { TextArea } = Input;
const { TabPane } = Tabs;

export default function RiskCreate() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "risks",
  });
  const { mutate: createChangeHistory } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const { selectProps: entitySelectProps } = useSelect({
    resource: "company_info",
    optionLabel: "entity",
    optionValue: "id",
  });

  const { selectProps: riskOwnerSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const { selectProps: riskReporterSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const { selectProps: riskManagerSelectProps } = useSelect({
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
            table_name: "risks",
            record_id: (response as any)?.data?.id,
            action: "Created",
            change_details: JSON.stringify(values),
            changed_by: identity?.id,
          },
        });
      }
    } catch (error) {
      console.error("Error creating risk:", error);
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleCreate} layout="vertical">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Information" key="1">
            {/* Basic Information fields */}
          </TabPane>
          <TabPane tab="Risk Details" key="2">
            {/* Risk Details fields */}
          </TabPane>
          <TabPane tab="Risk Assessment" key="3">
            {/* Risk Assessment fields */}
          </TabPane>
          <TabPane tab="Risk Treatment" key="4">
            {/* Risk Treatment fields */}
          </TabPane>
          <TabPane tab="Tasks" key="5">
            <p>Tasks can be added after creating the risk.</p>
          </TabPane>
          <TabPane tab="Assets" key="6">
            <p>Assets can be tagged after creating the risk.</p>
          </TabPane>
        </Tabs>
        <Form.Item
          name="workflow_status"
          label="Workflow Status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'Identified', label: 'Identified' },
              { value: 'Assessed', label: 'Assessed' },
              { value: 'Treated', label: 'Treated' },
              { value: 'Monitored', label: 'Monitored' },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
}
