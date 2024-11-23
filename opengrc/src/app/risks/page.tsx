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
import { BaseKey, BaseRecord, CrudFilters, useNavigation, useList } from "@refinedev/core";
import { Space, Table, Checkbox, Button, Popover, Select, Input, Tag, AutoComplete, Typography } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined, SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ISearchItem {
  id: string;
  risk_id: string;
  risk_summary: string;
  description?: string;
  impact: string;
  likelihood: string;
  inherent_risk_level: string;
  workflow_status: string;
}

interface IOptionGroup {
  key: string;
  value: string;
  label: React.ReactNode;
}

interface IOptions {
  label: React.ReactNode;
  options: IOptionGroup[];
}

const renderTitle = (title: string) => (
  <Text strong style={{ fontSize: "16px" }}>
    {title}
  </Text>
);

const renderItem = (item: ISearchItem): IOptionGroup => ({
  key: item.id,
  value: `${item.risk_id}: ${item.risk_summary}`,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.risk_id}: {item.risk_summary}</Text>
        <Space>
          <Tag color={getImpactColor(item.impact)}>{item.impact}</Tag>
          <Tag color={getWorkflowStatusColor(item.workflow_status)}>{item.workflow_status}</Tag>
        </Space>
      </div>
      {item.description && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.description.length > 100 
            ? `${item.description.slice(0, 100)}...` 
            : item.description}
        </Text>
      )}
      <div style={{ marginTop: 4 }}>
        <Tag color={getLikelihoodColor(item.likelihood)}>Likelihood: {item.likelihood}</Tag>
        <Tag color={getRiskLevelColor(item.inherent_risk_level)}>Risk Level: {item.inherent_risk_level}</Tag>
      </div>
    </div>
  ),
});

export default function RisksList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "risk_id",
    "risk_summary",
    "impact_type",
    "impact",
    "likelihood",
    "inherent_risk_level",
    "risk_response",
    "workflow_status",
    "created_at",
  ]);
  const [value, setValue] = useState<string>("");
  const [options, setOptions] = useState<IOptions[]>([]);

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

      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "risk_id", operator: "contains", value },
            { field: "risk_summary", operator: "contains", value },
            { field: "description", operator: "contains", value }
          ]
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

  const { refetch: refetchRisks } = useList<ISearchItem>({
    resource: "risks",
    filters: [
      {
        operator: "or",
        value: [
          { field: "risk_id", operator: "contains", value },
          { field: "risk_summary", operator: "contains", value },
          { field: "description", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const riskOptionGroup = data.data.map(renderItem);
        if (riskOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Risks"),
              options: riskOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchRisks();
    }
  }, [value]);

  const renderSearch = () => (
    <div style={{ 
      width: 500, 
      marginBottom: 16,
      marginLeft: 'auto'  // Push to right side
    }}>
      <AutoComplete<string, IOptions>
        style={{ width: "100%" }}
        options={options}
        onSearch={(value: string) => setValue(value)}
        onSelect={(value, option: any) => {
          if (option.key) {
            show("risks", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search risks by ID, summary, or description..."
          suffix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
    </div>
  );

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
      {renderSearch()}
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
