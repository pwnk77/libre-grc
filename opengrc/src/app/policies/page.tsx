"use client";

import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  useTable,
  FilterDropdown,
  useSelect,
  CreateButton,
} from "@refinedev/antd";
import { BaseKey, BaseRecord, CrudFilters, useNavigation } from "@refinedev/core";
import { Space, Table, Checkbox, Button, Popover, Select, Input } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined } from "@ant-design/icons";

export default function PoliciesList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "policy_name",
    "prepared_by",
    "review_date",
    "workflow_status",
    "created_at",
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const { show } = useNavigation();

  const { tableProps, searchFormProps, setFilters } = useTable({
    syncWithLocation: true,
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "policy_name",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "workflow_status",
          operator: "eq",
          value: null,
        },
      ],
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { workflow_status } = params as {
        workflow_status: string;
      };

      if (searchTerm) {
        filters.push({
          operator: "or",
          value: [
            { field: "policy_name", operator: "contains", value: searchTerm },
            { field: "prepared_by", operator: "contains", value: searchTerm },
            { field: "purpose", operator: "contains", value: searchTerm },
          ],
        });
      }

      if (workflow_status) {
        filters.push({
          field: "workflow_status",
          operator: "eq",
          value: workflow_status,
        });
      }

      return filters;
    },
  });

  // Clear search on page reload
  useEffect(() => {
    setSearchTerm("");
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    if (newSearchTerm === "") {
      setFilters([], "replace");
    }
  };

  const handleSearch = () => {
    searchFormProps?.onFinish?.({});
  };

  const { selectProps: workflowStatusSelectProps } = useSelect({
    resource: "policies",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const allColumns = [
    {
      dataIndex: "policy_name",
      title: "Policy Name",
      sorter: true,
    },
    {
      dataIndex: "purpose",
      title: "Purpose",
    },
    {
      dataIndex: "prepared_by",
      title: "Prepared By",
    },
    {
      dataIndex: "reviewed_by",
      title: "Reviewed By",
    },
    {
      dataIndex: "prepared_date",
      title: "Prepared Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "review_date",
      title: "Review Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "next_revision_due_date",
      title: "Next Revision Due Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "policy_link",
      title: "Policy Link",
      render: (value: string) => value ? <a href={value} target="_blank" rel="noopener noreferrer">View Policy</a> : "-",
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Status"
            {...workflowStatusSelectProps}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "created_at",
      title: "Created At",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "updated_at",
      title: "Updated At",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
  ];

  const ConfigureColumnsContent = (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {allColumns.map((column) => (
        <div key={column.dataIndex} style={{ marginBottom: '8px' }}>
          <Checkbox
            checked={selectedColumns.includes(column.dataIndex)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedColumns([...selectedColumns, column.dataIndex]);
              } else {
                setSelectedColumns(selectedColumns.filter(col => col !== column.dataIndex));
              }
            }}
            disabled={column.dataIndex === 'policy_name'}
          >
            {column.title}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  const renderColumns = () => {
    const visibleColumns = allColumns.filter(col => selectedColumns.includes(col.dataIndex));
    return visibleColumns.map(column => {
      if (column.dataIndex === 'policy_name') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("policies", record.id as BaseKey)}>{value}</a>
            )}
          />
        );
      }
      return <Table.Column key={column.dataIndex} {...column} />;
    });
  };

  return (
    <List
      headerButtons={[
        <CreateButton key="create" />,
        <Popover
          key="configure"
          content={ConfigureColumnsContent}
          title="Configure Columns"
          trigger="click"
          placement="bottomRight"
        >
          <Button icon={<SettingOutlined />}>Configure</Button>
        </Popover>,
      ]}
    >
      <Input.Search
        placeholder="Search policies..."
        value={searchTerm}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <Table 
        {...tableProps} 
        rowKey="id"
      >
        {renderColumns()}
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}