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

export default function AuditsList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "product_name",
    "description",
    "product_type",
    "line_of_business",
    "expected_go_live_date",
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
          field: "product_name",
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
            { field: "product_name", operator: "contains", value: searchTerm },
            { field: "description", operator: "contains", value: searchTerm },
            { field: "line_of_business", operator: "contains", value: searchTerm },
            // Add more fields as needed
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
      // Reset the table and URL when search is cleared
      setFilters([], "replace");
    }
  };

  const handleSearch = () => {
    searchFormProps?.onFinish?.({});
  };

  const { selectProps: workflowStatusSelectProps } = useSelect({
    resource: "secure_by_design",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const allColumns = [
    {
      dataIndex: "product_name",
      title: "Product Name",
      sorter: true,
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "product_type",
      title: "Product Type",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Product Type"
            options={[
              { value: 'New', label: 'New' },
              { value: 'Existing', label: 'Existing' },
            ]}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "line_of_business",
      title: "Line of Business",
    },
    {
      dataIndex: "expected_go_live_date",
      title: "Expected Go Live Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "infrastructure_details",
      title: "Infrastructure Details",
    },
    {
      dataIndex: "external_party_involvement",
      title: "External Party Involvement",
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      dataIndex: "applicable_compliances",
      title: "Applicable Compliances",
      render: (compliances: string[]) => compliances?.join(", "),
    },
    {
      dataIndex: "advisory_provided",
      title: "Advisory Provided",
    },
    {
      dataIndex: "reviewer",
      title: "Reviewer",
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      sorter: true,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Workflow Status"
            options={[
              { value: 'Initiation', label: 'Initiation' },
              { value: 'Design Review', label: 'Design Review' },
              { value: 'Implementation', label: 'Implementation' },
              { value: 'Verification', label: 'Verification' },
            ]}
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
            disabled={column.dataIndex === 'product_name'}
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
      if (column.dataIndex === 'product_name') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("secure_by_design", record.id as BaseKey)}>{value}</a>
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
        placeholder="Search products..."
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
      </Table>
    </List>
  );
}