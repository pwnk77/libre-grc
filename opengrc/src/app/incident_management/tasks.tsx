import React from "react";
import { useTable, useSelect } from "@refinedev/antd";
import { Table, Button, Space, Tag } from "antd";
import { useDelete } from "@refinedev/core";
import { DeleteOutlined } from "@ant-design/icons";

export const TasksTab = ({ incidentId }: { incidentId: string }) => {
  const { tableProps } = useTable({
    resource: "tasks",
    filters: {
      permanent: [
        {
          field: "parent_id",
          operator: "eq",
          value: incidentId,
        },
        {
          field: "parent_type",
          operator: "eq",
          value: "incident_management",
        },
      ],
    },
  });

  const { mutate: deleteTask } = useDelete();

  const { selectProps: assigneeSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  return (
    <Table {...tableProps} rowKey="id">
      <Table.Column dataIndex="title" title="Title" />
      <Table.Column dataIndex="description" title="Description" />
      <Table.Column
        dataIndex="status"
        title="Status"
        render={(value: string) => (
          <Tag color={value === "completed" ? "green" : "blue"}>{value}</Tag>
        )}
      />
      <Table.Column
        title="Actions"
        dataIndex="actions"
        render={(_, record: any) => (
          <Space>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteTask({
                  resource: "tasks",
                  id: record.id,
                });
              }}
            />
          </Space>
        )}
      />
    </Table>
  );
}; 