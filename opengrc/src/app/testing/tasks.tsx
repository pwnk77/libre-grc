import React, { useState } from "react";
import { useForm, useTable, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Button, Table, Space, Select, Popconfirm, message } from "antd";
import { useCreate, useUpdate, useDelete } from "@refinedev/core";
import { DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

export const TasksTab: React.FC<{ testingId: string }> = ({ testingId }) => {
  const [form] = Form.useForm();

  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "tasks",
    action: "create",
  });

  const { tableProps, sorter, setSorter } = useTable({
    resource: "tasks",
    filters: {
      permanent: [
        {
          field: "related_entity_id",
          operator: "eq",
          value: testingId,
        },
        {
          field: "entity_type",
          operator: "eq",
          value: "testing",
        },
      ],
    },
    sorters: {
      initial: [{ field: "created_at", order: "desc" }],
    },
  });

  const { mutate: createTask, isLoading: isCreating } = useCreate();
  const { mutate: updateTask } = useUpdate();
  const { mutate: deleteTask } = useDelete();

  const { selectProps: assigneeSelectProps } = useSelect({
    resource: "users",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);

  const isEditing = (record: any) => record.id === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({
      ...record,
      due_date: record.due_date ? dayjs(record.due_date) : null,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (record: any) => {
    try {
      const row = await form.validateFields();
      await updateTask({
        resource: "tasks",
        id: record.id,
        values: {
          ...row,
          due_date: row.due_date ? row.due_date.format('YYYY-MM-DD') : null,
        },
      }, {
        onSuccess: () => {
          setEditingKey(null);
          message.success("Task updated successfully");
        },
        onError: (error) => {
          console.error("Error updating task:", error);
          message.error("Failed to update task");
        },
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const onFinish = async (values: any) => {
    createTask({
      resource: "tasks",
      values: {
        ...values,
        related_entity_id: testingId,
        entity_type: "testing",
        task_type: "Testing",
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
      },
    }, {
      onSuccess: () => {
        message.success("Task created successfully");
        formProps.form?.resetFields();
      },
      onError: (error) => {
        console.error("Error creating task:", error);
        message.error("Failed to create task");
      },
    });
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }: any) => {
    const inputNode = inputType === 'date' ? (
      <DatePicker />
    ) : inputType === 'select' ? (
      <Select
        options={[
          { value: 'Not Started', label: 'Not Started' },
          { value: 'In Progress', label: 'In Progress' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Overdue', label: 'Overdue' },
        ]}
      />
    ) : (
      <Input />
    );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please Input ${title}!` }]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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

      <Form form={form} component={false}>
        <Table 
          {...tableProps} 
          rowKey="id"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        >
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
            render={(value, record: any) => {
              const editable = isEditing(record);
              return editable ? (
                <Form.Item
                  name="due_date"
                  style={{ margin: 0 }}
                >
                  <DatePicker />
                </Form.Item>
              ) : (
                value && dayjs(value).format('YYYY-MM-DD')
              );
            }}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value, record: any) => {
              const editable = isEditing(record);
              return editable ? (
                <Form.Item
                  name="status"
                  style={{ margin: 0 }}
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
              ) : (
                value
              );
            }}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: any) => {
              const editable = isEditing(record);
              return editable ? (
                <Space>
                  <Popconfirm title="Sure to save?" onConfirm={() => save(record)}>
                    <Button icon={<SaveOutlined />} />
                  </Popconfirm>
                  <Button onClick={cancel} icon={<CloseOutlined />} />
                </Space>
              ) : (
                <Space>
                  <Button disabled={editingKey !== null} onClick={() => edit(record)} icon={<EditOutlined />} />
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
              );
            }}
          />
        </Table>
      </Form>
    </Space>
  );
};
