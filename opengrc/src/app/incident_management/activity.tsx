import { useList } from "@refinedev/core";
import { List, Timeline, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

export const Activity = ({ parentId }: { parentId: string }) => {
  const { data } = useList({
    resource: "change_history",
    filters: [
      {
        field: "record_id",
        operator: "eq",
        value: parentId,
      },
      {
        field: "table_name",
        operator: "eq",
        value: "incident_management",
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  return (
    <Timeline>
      {data?.data.map((item: any) => (
        <Timeline.Item key={item.id}>
          <Text strong>{item.action}</Text>
          <Text> by {item.changed_by_name} </Text>
          <Text type="secondary">
            {dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </Text>
          {item.change_details && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                {JSON.stringify(JSON.parse(item.change_details), null, 2)}
              </Text>
            </div>
          )}
        </Timeline.Item>
      ))}
    </Timeline>
  );
}; 