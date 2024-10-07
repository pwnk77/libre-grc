"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function ControlList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="control_id" title="Control ID" />
        <Table.Column dataIndex="domain" title="Domain" />
        <Table.Column dataIndex="control_requirements" title="Control Requirements" />
        <Table.Column dataIndex="risk_statement" title="Risk Statement" />
        <Table.Column dataIndex="compliance_level" title="Compliance Level" />
        <Table.Column dataIndex="control_type" title="Control Type" />
        <Table.Column dataIndex="control_frequency" title="Control Frequency" />
        <Table.Column dataIndex="compliance_status" title="Compliance Status" />
        <Table.Column dataIndex="workflow_status" title="Workflow Status" />
        <Table.Column
          dataIndex={["created_at"]}
          title="Created At"
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
