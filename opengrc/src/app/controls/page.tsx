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
import { Space, Table, Checkbox, Button, Popover, Select } from "antd";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";

export default function ControlList() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "control_id",
    "domain",
    "control_requirements",
    "risk_statement",
    "compliance_status",
    "workflow_status",
    "created_at",
  ]);

  const { show } = useNavigation();

  const { tableProps, searchFormProps } = useTable({
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
      const { q, compliance_status, workflow_status } = params as {
        q: string;
        compliance_status: string;
        workflow_status: string;
      };

      filters.push({
        field: "q",
        operator: "eq",
        value: q,
      });

      filters.push({
        field: "compliance_status",
        operator: "eq",
        value: compliance_status,
      });

      filters.push({
        field: "workflow_status",
        operator: "eq",
        value: workflow_status,
      });

      return filters;
    },
  });

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
    const actionColumn = {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    };

    const visibleColumns = [actionColumn, ...allColumns.filter(col => selectedColumns.includes(col.dataIndex))];
    return visibleColumns.map(column => <Table.Column key={column.dataIndex} {...column} />);
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
      <Table 
        {...tableProps} 
        rowKey="id"
        onRow={(record) => ({
          onClick: () => show("controls", record.id as BaseKey),
        })}
      >
        {renderColumns()}
      </Table>
    </List>
  );
}