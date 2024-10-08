import { useList, useCreate, useGetIdentity, useMany } from "@refinedev/core";
import { List, Avatar, Typography, Input, Button, Timeline, Card, Spin } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { DateField } from "@refinedev/antd";

const { Text, Title } = Typography;
const { TextArea } = Input;

const formatChangeDetails = (changeDetails: string) => {
  try {
    const changes = JSON.parse(changeDetails);
    return Object.entries(changes).map(([key, value]) => (
      <div key={key}>
        <Text strong>{key}: </Text>
        <Text>{JSON.stringify(value)}</Text>
      </div>
    ));
  } catch (error) {
    console.error("Error parsing change details:", error);
    return <Text>{changeDetails}</Text>;
  }
};

export function Activity({ parentId }: { parentId: string }) {
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("comments");

  // Comments data
  const { data: commentsData, isLoading: commentsLoading } = useList({
    resource: "comments",
    filters: [
      { field: "parent_table", operator: "eq", value: "controls" },
      { field: "parent_id", operator: "eq", value: parentId },
    ],
    sorters: [{ field: "created_at", order: "desc" }],
    queryOptions: {
      enabled: !!parentId,
    },
  });

  // History data
  const { data: historyData, isLoading: historyLoading } = useList({
    resource: "change_history",
    filters: [
      { field: "table_name", operator: "eq", value: "controls" },
      { field: "record_id", operator: "eq", value: parentId },
    ],
    sorters: [{ field: "created_at", order: "desc" }],
    queryOptions: {
      enabled: !!parentId,
    },
  });

  const userIds = [
    ...(commentsData?.data?.map((comment) => comment.user_id) || []),
    ...(historyData?.data?.map((history) => history.changed_by) || []),
  ].filter(Boolean);

  const { data: userData, isLoading: userLoading } = useMany({
    resource: "users",
    ids: userIds,
    queryOptions: {
      enabled: userIds.length > 0,
    },
  });

  const { mutate: createComment } = useCreate();
  const { data: identity } = useGetIdentity<{ id: string }>();

  const handleAddComment = () => {
    if (newComment.trim() && identity?.id) {
      createComment({
        resource: "comments",
        values: {
          content: newComment,
          parent_table: "controls",
          parent_id: parentId,
          user_id: identity.id,
        },
        successNotification: {
          message: "Comment added successfully",
          type: "success",
        },
        errorNotification: {
          message: "Error adding comment",
          type: "error",
        },
      });
      setNewComment("");
    }
  };

  const renderComments = () => (
    <>
      {commentsLoading ? (
        <Spin />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={commentsData?.data || []}
          locale={{ emptyText: "No comments yet" }}
          renderItem={(item) => {
            const user = userData?.data?.find((u) => u.id === item.user_id);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={user?.full_name || "Anonymous"}
                  description={
                    <>
                      <Text>{item.content}</Text>
                      <br />
                      <Text type="secondary">
                        <DateField value={item.created_at} format="LLL" />
                      </Text>
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
      <div style={{ marginTop: 16 }}>
        <TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{ marginTop: 8 }}
          onClick={handleAddComment}
        >
          Add Comment
        </Button>
      </div>
    </>
  );

  const renderHistory = () => (
    <>
      {historyLoading ? (
        <Spin />
      ) : (
        <Timeline
          items={
            historyData?.data?.map((item) => {
              const user = userData?.data?.find((u) => u.id === item.changed_by);
              return {
                children: (
                  <>
                    <Text strong>{item.action}</Text>
                    <br />
                    <Text type="secondary">
                      By {user?.full_name || "Unknown User"} on <DateField value={item.created_at} format="LLL" />
                    </Text>
                    <br />
                    {formatChangeDetails(item.change_details)}
                  </>
                ),
              };
            }) || []
          }
        />
      )}
    </>
  );

  return (
    <Card
      title="Activity"
      extra={
        <Button.Group>
          <Button type={activeTab === "comments" ? "primary" : "default"} onClick={() => setActiveTab("comments")}>
            Comments
          </Button>
          <Button type={activeTab === "history" ? "primary" : "default"} onClick={() => setActiveTab("history")}>
            History
          </Button>
        </Button.Group>
      }
      style={{ marginTop: 20, borderRadius: 8 }}
    >
      {activeTab === "comments" ? renderComments() : renderHistory()}
    </Card>
  );
}
