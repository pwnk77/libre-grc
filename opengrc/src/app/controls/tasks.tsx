import React from "react";
import { useForm, useTable, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Button, Table, Space, Select } from "antd";
import { useCreate, useUpdate, useDelete } from "@refinedev/core";
import { DeleteOutlined } from "@ant-design/icons";

export const TasksTab: React.FC<{ controlId: string }> = ({ controlId }) => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "tasks",
    action: "create",
    successNotification: () => ({
      message: "Task created successfully",
      type: "success",
    }),
  });

  const { tableProps } = useTable({
    resource: "tasks",
    filters: {
      permanent: [
        {
          field: "related_entity_id",
          operator: "eq",
          value: controlId,
        },
        {
          field: "entity_type",
          operator: "eq",
          value: "controls",
        },
      ],
    },
  });

  const { mutate: createTask } = useCreate();
  const { mutate: updateTask } = useUpdate();
  const { mutate: deleteTask } = useDelete();

  const { selectProps: assigneeSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const onFinish = async (values: any) => {
    await createTask({
      resource: "tasks",
      values: {
        ...values,
        related_entity_id: controlId,
        entity_type: "controls",
        task_type: "Control",
      },
    });
    formProps.form?.resetFields();
  };

  return (
    <>
      <Form {...formProps} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="assignee_id"
          label="Assignee"
        >
          <Select {...assigneeSelectProps} />
        </Form.Item>
        <Form.Item
          name="due_date"
          label="Due Date"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'Not Started', label: 'Not Started' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button {...saveButtonProps} type="primary">
            Create Task
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex="assignee_id"
          title="Assignee"
          render={(value) => {
            const assignee = assigneeSelectProps.options?.find(
              (option) => option.value === value
            );
            return assignee ? assignee.label : "Unassigned";
          }}
        />
        <Table.Column
          dataIndex="due_date"
          title="Due Date"
          render={(value) => value && new Date(value).toLocaleDateString()}
        />
        <Table.Column dataIndex="status" title="Status" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <Button
                icon={<DeleteOutlined />}
                danger
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
    </>
  );
};
