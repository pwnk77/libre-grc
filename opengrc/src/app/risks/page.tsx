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
import { Space, Table, Checkbox, Button, Popover, Select, Input, Tag } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined } from "@ant-design/icons";

export default function RisksList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "risk_id",
    "risk_summary",
    "inherent_risk_level",
    "risk_response",
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
          field: "risk_id",
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
      const { workflow_status, inherent_risk_level } = params as {
        workflow_status: string;
        inherent_risk_level: string;
      };

      if (searchTerm) {
        filters.push({
          operator: "or",
          value: [
            { field: "risk_id", operator: "contains", value: searchTerm },
            { field: "risk_summary", operator: "contains", value: searchTerm },
            { field: "description", operator: "contains", value: searchTerm },
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

      if (inherent_risk_level) {
        filters.push({
          field: "inherent_risk_level",
          operator: "eq",
          value: inherent_risk_level,
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
    resource: "risks",
    optionLabel: "workflow_status",
    optionValue: "workflow_status",
  });

  const { selectProps: inherentRiskLevelSelectProps } = useSelect({
    resource: "risks",
    optionLabel: "inherent_risk_level",
    optionValue: "inherent_risk_level",
  });

  const allColumns = [
    {
      dataIndex: "risk_id",
      title: "Risk ID",
      sorter: true,
    },
    {
      dataIndex: "risk_summary",
      title: "Risk Summary",
      sorter: true,
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "risk_analyst",
      title: "Risk Analyst",
    },
    {
      dataIndex: "risk_reporter",
      title: "Risk Reporter",
    },
    {
      dataIndex: "line_of_business",
      title: "Line of Business",
    },
    {
      dataIndex: "impact_type",
      title: "Impact Type",
    },
    {
      dataIndex: "impact",
      title: "Impact",
      render: (value: string) => <Tag color={getImpactColor(value)}>{value}</Tag>,
    },
    {
      dataIndex: "likelihood",
      title: "Likelihood",
      render: (value: string) => <Tag color={getLikelihoodColor(value)}>{value}</Tag>,
    },
    {
      dataIndex: "inherent_risk_level",
      title: "Inherent Risk Level",
      render: (value: string) => <Tag color={getRiskLevelColor(value)}>{value}</Tag>,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select
            style={{ minWidth: 200 }}
            mode="multiple"
            placeholder="Select Inherent Risk Level"
            {...inherentRiskLevelSelectProps}
          />
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "risk_response",
      title: "Risk Response",
      render: (value: string) => <Tag color={getRiskResponseColor(value)}>{value}</Tag>,
    },
    {
      dataIndex: "risk_due_date",
      title: "Risk Due Date",
      render: (value: any) => <DateField value={value} />,
      sorter: true,
    },
    {
      dataIndex: "residual_risk_level",
      title: "Residual Risk Level",
      render: (value: string) => <Tag color={getRiskLevelColor(value)}>{value}</Tag>,
    },
    {
      dataIndex: "workflow_status",
      title: "Workflow Status",
      render: (value: string) => <Tag color={getWorkflowStatusColor(value)}>{value}</Tag>,
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
            disabled={column.dataIndex === 'risk_id'}
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
      if (column.dataIndex === 'risk_id') {
        return (
          <Table.Column
            key={column.dataIndex}
            {...column}
            render={(value: string, record: BaseRecord) => (
              <a onClick={() => show("risks", record.id as BaseKey)}>{value}</a>
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
        placeholder="Search risks..."
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

function getWorkflowStatusColor(status: string) {
  switch (status) {
    case 'Identified':
      return 'blue';
    case 'Assessed':
      return 'orange';
    case 'Treated':
      return 'green';
    case 'Monitored':
      return 'purple';
    default:
      return 'default';
  }
}

function getImpactColor(impact: string) {
  switch (impact) {
    case 'Critical':
      return 'red';
    case 'High':
      return 'orange';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'default';
  }
}

function getLikelihoodColor(likelihood: string) {
  switch (likelihood) {
    case 'Almost Certain':
      return 'red';
    case 'Likely':
      return 'orange';
    case 'Slightly Likely':
      return 'yellow';
    case 'Rare':
      return 'green';
    default:
      return 'default';
  }
}

function getRiskLevelColor(level: string) {
  switch (level) {
    case 'Critical':
      return 'red';
    case 'High':
      return 'orange';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'default';
  }
}

function getRiskResponseColor(response: string) {
  switch (response) {
    case 'Treat':
      return 'blue';
    case 'Transfer':
      return 'purple';
    case 'Terminate':
      return 'red';
    case 'Accept':
      return 'green';
    default:
      return 'default';
  }
}