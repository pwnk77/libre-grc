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

export default function ControlsLibrary() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "control_id",
    "domain",
    "control_requirements",
    "risk_statement",
    "compliance_status",
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
          field: "control_id",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "compliance_status",
          operator: "eq",
          value: null,
        },
      ],
    },
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { compliance_status, workflow_status } = params as {
        compliance_status: string;
        workflow_status: string;
      };

      if (searchTerm) {
        filters.push({
          operator: "or",
          value: [
            { field: "control_id", operator: "contains", value: searchTerm },
            { field: "domain", operator: "contains", value: searchTerm },
            { field: "control_requirements", operator: "contains", value: searchTerm },
            { field: "risk_statement", operator: "contains", value: searchTerm },
            // Add more fields as needed
          ],
        });
      }

      if (compliance_status) {
        filters.push({
          field: "compliance_status",
          operator: "eq",
          value: compliance_status,
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

  const { selectProps: complianceStatusSelectProps } = useSelect({
    resource: "controls",
    optionLabel: "compliance_status",
    optionValue: "compliance_status",
  });

  const { selectProps: workflowStatusSelectProps } = useSelect({
    resource: "controls",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const allColumns = [
    {
      dataIndex: "control_id",
      title: "Control ID",
      sorter: true,
    },
    {
      dataIndex: "domain",
      title: "Domain",
      sorter: true,
    },
    {
      dataIndex: "control_requirements",
      title: "Control Requirements",
    },
    {
      dataIndex: "risk_statement",
      title: "Risk Statement",
    },
    {
      dataIndex: "current_implementation",
      title: "Current Implementation",
    },
    {
      dataIndex: "enhancements",
      title: "Enhancements",
    },
    {
      dataIndex: "compliance_level",
      title: "Compliance Level",
    },
    {
      dataIndex: "implementation_guidance",
      title: "Implementation Guidance",
    },
    {
      dataIndex: "control_type",
      title: "Control Type",
    },
    {
      dataIndex: "control_frequency",
      title: "Control Frequency",
    },
    {
      dataIndex: "control_design",
      title: "Control Design",
    },
    {
      dataIndex: "technological_enabler",
      title: "Technological Enabler",
    },
    {
      dataIndex: "management_level",
      title: "Management Level",
    },
    {
      dataIndex: "compliance_status",
      title: "Compliance Status",
      sorter: true,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Compliance Status"
            {...complianceStatusSelectProps}
          />
        </FilterDropdown>
      ),
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
            {...workflowStatusSelectProps}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "framework_name",
      title: "Framework Name",
    },
    {
      dataIndex: "framework_version",
      title: "Framework Version",
    },
    {
      dataIndex: "framework_description",
      title: "Framework Description",
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
            disabled={column.dataIndex === 'control_id'}
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
      if (column.dataIndex === 'control_id') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("controls", record.id as BaseKey)}>{value}</a>
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
        placeholder="Search controls..."
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