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
import { BaseKey, BaseRecord, CrudFilters, useNavigation, useMany } from "@refinedev/core";
import { Space, Table, Checkbox, Button, Popover, Select, Input, Tag } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined } from "@ant-design/icons";

export default function TestingList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "audit_strategy",
    "evidence_request",
    "compliance_status",
    "workflow_status",
    "test_date",
    "tester",
    "control_id",
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
          field: "test_date",
          order: "desc",
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
            { field: "evidence_request", operator: "contains", value: searchTerm },
            { field: "tester", operator: "contains", value: searchTerm },
            { field: "audit_strategy", operator: "contains", value: searchTerm },
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
    resource: "testing",
    optionLabel: "compliance_status",
    optionValue: "compliance_status",
  });

  const { selectProps: workflowStatusSelectProps } = useSelect({
    resource: "testing",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const { data: controlData, isLoading: controlLoading } = useMany({
    resource: "controls",
    ids: tableProps?.dataSource?.map((item) => item.control_id) || [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const allColumns = [
    {
      dataIndex: "control_id",
      title: "Related Control",
      render: (value: string, record: BaseRecord) => {
        const control = controlData?.data?.find(c => c.id === value);
        return (
          <a onClick={() => show("controls", value)}>{control?.control_id || "N/A"}</a>
        );
      },
    },
    {
      dataIndex: "evidence_request",
      title: "Evidence Request",
      render: (value: string, record: BaseRecord) => (
        <a onClick={() => show("testing", record.id as BaseKey)}>{value || "View Details"}</a>
      ),
    },
    {
      dataIndex: "audit_strategy",
      title: "Audit Strategy",
    },
    {
      dataIndex: "test_of_design",
      title: "Test of Design",
    },
    {
      dataIndex: "test_of_effectiveness",
      title: "Test of Effectiveness",
    },
    {
      dataIndex: "test_results",
      title: "Test Results",
    },
    {
      dataIndex: "compliance_status",
      title: "Compliance Status",
      sorter: true,
      render: (value: string) => (
        <Tag color={getComplianceStatusColor(value)}>{value}</Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Compliance Status"
            options={[
              { value: 'Not Tested', label: 'Not Tested' },
              { value: 'Failed', label: 'Failed' },
              { value: 'Passed with Exceptions', label: 'Passed with Exceptions' },
              { value: 'Passed', label: 'Passed' },
            ]}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      sorter: true,
      render: (value: string) => (
        <Tag color={getWorkflowStatusColor(value)}>{value}</Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Workflow Status"
            options={[
              { value: 'Planned', label: 'Planned' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Reviewed', label: 'Reviewed' },
            ]}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "test_date",
      title: "Test Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "tester",
      title: "Tester",
    },
    {
      dataIndex: "notes",
      title: "Notes",
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
    return visibleColumns.map(column => (
      <Table.Column key={column.dataIndex} {...column} />
    ));
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
        placeholder="Search testing..."
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

function getComplianceStatusColor(status: string | undefined) {
  switch (status) {
    case 'Not Tested':
      return 'blue';
    case 'Failed':
      return 'red';
    case 'Passed with Exceptions':
      return 'orange';
    case 'Passed':
      return 'green';
    default:
      return 'default';
  }
}

function getWorkflowStatusColor(status: string | undefined) {
  switch (status) {
    case 'Planned':
      return 'blue';
    case 'In Progress':
      return 'orange';
    case 'Completed':
      return 'green';
    case 'Reviewed':
      return 'purple';
    default:
      return 'default';
  }
}
