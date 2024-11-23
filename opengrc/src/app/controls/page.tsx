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
  control_id: string;
  domain: string;
  control_requirements?: string;
  control_type?: string;
  compliance_status: string;
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
  value: item.control_id,
  label: (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong>{item.control_id}</Text>
        <Space>
          <Tag color={getComplianceStatusColor(item.compliance_status)}>{item.compliance_status}</Tag>
          <Tag color={getWorkflowStatusColor(item.workflow_status)}>{item.workflow_status}</Tag>
        </Space>
      </div>
      <div>
        <Text type="secondary">{item.domain}</Text>
      </div>
      {item.control_requirements && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {item.control_requirements.length > 100 
            ? `${item.control_requirements.slice(0, 100)}...` 
            : item.control_requirements}
        </Text>
      )}
      {item.control_type && (
        <div style={{ marginTop: 4 }}>
          <Tag color={getControlTypeColor(item.control_type)}>{item.control_type}</Tag>
        </div>
      )}
    </div>
  ),
});

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

      if (value) {
        filters.push({
          operator: "or",
          value: [
            { field: "control_id", operator: "contains", value },
            { field: "domain", operator: "contains", value },
            { field: "control_requirements", operator: "contains", value },
            { field: "risk_statement", operator: "contains", value },
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

  const { refetch: refetchControls } = useList<ISearchItem>({
    resource: "controls",
    filters: [
      {
        operator: "or",
        value: [
          { field: "control_id", operator: "contains", value },
          { field: "domain", operator: "contains", value },
          { field: "control_requirements", operator: "contains", value }
        ]
      }
    ],
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const controlOptionGroup = data.data.map(renderItem);
        if (controlOptionGroup.length > 0) {
          setOptions([
            {
              label: renderTitle("Controls"),
              options: controlOptionGroup,
            },
          ]);
        }
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    if (value.length > 2) {
      refetchControls();
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
            show("controls", option.key);
          }
        }}
        notFoundContent="No results found"
        dropdownMatchSelectWidth={true}
      >
        <Input
          placeholder="Search controls by ID, domain, or requirements..."
          suffix={<SearchOutlined />}
          size="large"
        />
      </AutoComplete>
    </div>
  );

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
      render: (value: string) => {
        const colorMap: { [key: string]: string } = {
          'Preventive': 'blue',
          'Detective': 'green',
          'Corrective': 'orange',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
    },
    {
      dataIndex: "control_frequency",
      title: "Control Frequency",
      render: (value: string) => {
        const colorMap: { [key: string]: string } = {
          'Continuous': 'green',
          'Daily': 'blue',
          'Weekly': 'cyan',
          'Monthly': 'purple',
          'Quarterly': 'magenta',
          'Annually': 'red',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
    },
    {
      dataIndex: "control_design",
      title: "Control Design",
      render: (value: string) => {
        const colorMap: { [key: string]: string } = {
          'Manual': 'orange',
          'Automated': 'green',
          'Hybrid': 'blue',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
    },
    {
      dataIndex: "technological_enabler",
      title: "Technological Enabler",
    },
    {
      dataIndex: "management_level",
      title: "Management Level",
      render: (value: string) => {
        const colorMap: { [key: string]: string } = {
          'Strategic': 'red',
          'Tactical': 'blue',
          'Operational': 'green',
        };
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
      },
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
              { value: 'Not Implemented', label: 'Not Implemented' },
              { value: 'Partially Implemented', label: 'Partially Implemented' },
              { value: 'Implemented', label: 'Implemented' },
              { value: 'Not Applicable', label: 'Not Applicable' },
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
              { value: 'Draft', label: 'Draft' },
              { value: 'In Review', label: 'In Review' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Retired', label: 'Retired' },
            ]}
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
      {renderSearch()}
      <Table 
        {...tableProps} 
        rowKey="id"
      >
        {renderColumns()}
      </Table>
    </List>
  );
}

function getComplianceStatusColor(status: string): string {
  switch (status) {
    case 'Not Implemented':
      return 'red';
    case 'Partially Implemented':
      return 'orange';
    case 'Implemented':
      return 'green';
    case 'Not Applicable':
      return 'gray';
    default:
      return 'default';
  }
}

function getWorkflowStatusColor(status: string): string {
  switch (status) {
    case 'Draft':
      return 'blue';
    case 'In Review':
      return 'orange';
    case 'Approved':
      return 'green';
    case 'Retired':
      return 'gray';
    default:
      return 'default';
  }
}

function getControlTypeColor(type: string): string {
  switch (type) {
    case 'Preventive':
      return 'blue';
    case 'Detective':
      return 'green';
    case 'Corrective':
      return 'orange';
    default:
      return 'default';
  }
}
