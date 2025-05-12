"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button, Form, Select, message, Card } from "antd";

type EntityType = "students" | "teachers";

interface GenericLinkFormProps {
  entityId: string;
  entityType: EntityType;
  onSuccess?: () => void;
}

export default function GenericLinkForm({ entityId, entityType, onSuccess }: GenericLinkFormProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available inactive users using the isActive query
  const usersStatus = useQuery(api.models.users.isActive);
  
  // Get appropriate link mutation based on entity type
  const linkAccount = useMutation(
    entityType === "students" 
      ? api.models.admin.linkStudentAccount 
      : api.models.admin.linkTeacherAccount
  );

  const handleSubmit = async (values: { userId: string }) => {
    try {
      setIsSubmitting(true);
      
      if (entityType === "students") {
        await linkAccount({
          studentId: entityId as Id<"students">,
          userId: values.userId as Id<"users">
        });
      } else {
        await linkAccount({
          teacherId: entityId as Id<"teachers">,
          userId: values.userId as Id<"users">
        });
      }
      
      messageApi.success(`${entityType.slice(0, -1)} linked to user successfully!`);
      form.resetFields();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      messageApi.error(`Error linking account: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format only inactive users for select dropdown
  const userOptions = usersStatus?.inactive?.map(user => ({
    label: `${user.name || 'Unnamed'} (${user.email})`,
    value: user._id,
  })) || [];

  return (
    <Card 
      title={`Link to User Account`}
      className="w-full shadow-md mt-4"
    >
      {contextHolder}
      <p className="mb-4">
        This {entityType.slice(0, -1)} is not linked to any user account. 
        Link it to allow the user to access this {entityType.slice(0, -1)}'s data.
      </p>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="userId"
          label="Select User"
          rules={[{ required: true, message: 'Please select a user' }]}
        >
          <Select
            placeholder={userOptions.length ? "Select a user to link" : "No available users to link"}
            options={userOptions}
            loading={!usersStatus}
            showSearch
            optionFilterProp="label"
            notFoundContent="No unassigned users available"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isSubmitting}
            disabled={!userOptions.length}
            block
          >
            Link Account
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}