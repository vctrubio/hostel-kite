"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { genericTableView } from "@/utils/modelTableViews";
import { Id } from "@/convex/_generated/dataModel";
import { Button, Form, Input, InputNumber, message, Card, Alert, Spin, Select, Space } from "antd";
import VerificationBadge from "@/components/custom/VerificationBadge";
import GenericLinkForm from "./GenericLinkForm";

type EntityType = "students" | "teachers";

// Infer form data types from the genericTableView configuration
type GenericFormData = {
  [key: string]: string | number | string[] | undefined;
};

interface GenericEntityFormProps {
  entityType: EntityType;
  entityId?: string; // Optional for new entities
}

export default function GenericEntityForm({ entityType, entityId }: GenericEntityFormProps) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(!entityId); // Edit mode if new entity
  const [messageApi, contextHolder] = message.useMessage();

  // Get the configuration for this entity type
  const entityConfig = genericTableView[entityType];
  
  // Get mutation functions for this entity type
  const createEntity = useMutation(
    entityType === "students" 
      ? api.models.student.create 
      : api.models.teacher.create
  );
  
  const updateEntity = useMutation(
    entityType === "students" 
      ? api.models.student.updateId 
      : api.models.teacher.updateId
  );

  // Query for existing entity data if ID is provided
  const entityData = useQuery(
    entityType === "students" 
      ? api.models.student.getById 
      : api.models.teacher.getById,
    entityId ? { id: entityId as Id<any> } : "skip"
  );

  // Initialize form with data when it's loaded
  useEffect(() => {
    if (entityData) {
      form.setFieldsValue(entityData);
    }
  }, [entityData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (entityId) {
        // Update existing entity
        await updateEntity({
          id: entityId as Id<any>,
          ...values,
        });
        messageApi.success("Updated successfully!");
        setIsEditing(false);
      } else {
        // Create new entity
        await createEntity(values);
        messageApi.success("Created successfully!");
        form.resetFields();
      }
    } catch (error) {
      messageApi.error(`Error: ${error}`);
    }
  };

  const handleCancel = () => {
    if (entityData) {
      form.setFieldsValue(entityData);
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(true);
  };

  // Add a refresh trigger for when entity is linked to a user
  const handleLinkSuccess = () => {
    // Force a re-fetch of the entity data
    if (entityType === "students") {
      api.models.student.getById.invalidate();
    } else {
      api.models.teacher.getById.invalidate();
    }
  };

  // Custom styles for better readability of disabled inputs
  const disabledInputStyle = {
    color: 'rgba(0, 0, 0, 0.85)', // Darker text color for disabled state
    background: '#f5f5f5',        // Light background to indicate disabled
    cursor: 'not-allowed'
  };

  // Render form fields based on configuration
  const renderFormFields = () => {
    const { formFields } = entityConfig;
    
    return Object.entries(formFields).map(([fieldName, fieldConfig]: [string, any]) => {
      const { label, required, ...fieldProps } = fieldConfig;
      
      const commonProps = {
        name: fieldName,
        label: label,
        rules: required ? [{ required: true, message: `${label} is required` }] : undefined,
      };

      switch (fieldConfig.type) {
        case "string":
          return (
            <Form.Item key={fieldName} {...commonProps}>
              <Input 
                disabled={!isEditing} 
                style={!isEditing ? disabledInputStyle : undefined}
              />
            </Form.Item>
          );
          
        case "number":
          return (
            <Form.Item key={fieldName} {...commonProps}>
              <InputNumber 
                min={fieldConfig.min} 
                max={fieldConfig.max}
                style={{ 
                  width: '100%',
                  ...((!isEditing) ? disabledInputStyle : {})
                }} 
                disabled={!isEditing}
              />
            </Form.Item>
          );
          
        case "multiselect":
          return (
            <Form.Item key={fieldName} {...commonProps}>
              <Select
                mode="multiple"
                placeholder={`Select ${label}`}
                disabled={!isEditing}
                style={!isEditing ? disabledInputStyle : undefined}
                options={fieldConfig.options.map((option: string) => ({
                  label: option,
                  value: option,
                }))}
              />
            </Form.Item>
          );
          
        default:
          return null;
      }
    });
  };

  // Loading state
  if (entityId && entityData === undefined) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  // Entity not found
  if (entityId && entityData === null) {
    return (
      <Alert
        message="Entity Not Found"
        description={`The ${entityType.slice(0, -1)} with ID ${entityId} does not exist.`}
        type="error"
        showIcon
      />
    );
  }

  // Check if entity is verified (has userId)
  const isVerified = entityId && entityData && !!entityData.userId;

  // Create a human-readable entity type (e.g., "Student" or "Teacher")
  const entityTypeSingular = entityType.slice(0, -1).charAt(0).toUpperCase() + entityType.slice(0, -1).slice(1);
  
  // Determine the title based on the current mode
  const title = entityId 
    ? `${entityTypeSingular}`
    : `New ${entityTypeSingular}`;

  // Create extra header content with buttons and/or ID
  const extraHeaderContent = entityId ? (
    isEditing ? (
      <Space>
        <Button type="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Space>
    ) : (
      <Button type="primary" onClick={toggleEditMode}>
        Edit
      </Button>
    )
  ) : (
    <Button type="primary" onClick={handleSubmit}>
      Create
    </Button>
  );

  return (
    <>
      <Card
        title={
          <div className="flex items-center gap-4">
            <span>{title}</span>
            {/* Show ID if it exists */}
            {entityId && (
              <span className="text-gray-500 text-sm font-mono">ID: {entityId}</span>
            )}
            {/* Show verification badge if data exists */}
            {entityId && entityData && (
              <VerificationBadge isVerified={isVerified} />
            )}
          </div>
        }
        extra={extraHeaderContent}
        className="w-full shadow-md"
      >
        {contextHolder}
        <Form
          form={form}
          layout="vertical"
          initialValues={entityData || {}}
        >
          {renderFormFields()}

          {/* Bottom create button only for new entities */}
          {!entityId && isEditing && (
            <Form.Item>
              <Button type="primary" onClick={handleSubmit} block>
                Create
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
      
      {/* Show linking form if entity exists but is not verified */}
      {entityId && entityData && !isVerified && (
        <GenericLinkForm 
          entityId={entityId} 
          entityType={entityType}
          onSuccess={handleLinkSuccess}
        />
      )}
    </>
  );
}