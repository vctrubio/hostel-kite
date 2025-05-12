"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Form, Select, Button, message, Card, Space, Alert, Spin } from "antd";
import { Id } from "@/convex/_generated/dataModel";

interface LessonFormProps {
  lessonId?: string; // Optional for new lessons
}

export default function LessonForm({ lessonId }: LessonFormProps = {}) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(!lessonId); // Edit mode if new lesson
  const [messageApi, contextHolder] = message.useMessage();

  // Get data
  const teachers = useQuery(api.models.teacher.get);
  const bookings = useQuery(api.models.booking.get);
  const packages = useQuery(api.models.package.get);
  const students = useQuery(api.models.student.get);
  
  const lessonData = useQuery(
    api.models.lesson.getById,
    lessonId ? { id: lessonId as Id<"lessons"> } : "skip"
  );
  
  // Mutations
  const createLesson = useMutation(api.models.lesson.create);
  const updateLesson = useMutation(api.models.lesson.updateId);

  // Update form when lesson data is loaded
  useEffect(() => {
    if (lessonData) {
      form.setFieldsValue(lessonData);
    }
  }, [lessonData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (lessonId) {
        // Update existing lesson
        await updateLesson({
          id: lessonId as Id<"lessons">,
          ...values,
          sessionId: lessonData?.sessionId || [],
        });
        messageApi.success("Lesson updated successfully!");
        setIsEditing(false);
      } else {
        // Create new lesson
        await createLesson(values);
        messageApi.success("Lesson created successfully!");
        form.resetFields();
      }
    } catch (error) {
      messageApi.error(`Error: ${error}`);
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (lessonData) {
      form.setFieldsValue(lessonData);
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(true);
  };

  // Loading state
  if (lessonId && lessonData === undefined) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  // Lesson not found
  if (lessonId && lessonData === null) {
    return (
      <Alert
        message="Lesson Not Found"
        description={`The lesson with ID ${lessonId} does not exist.`}
        type="error"
        showIcon
      />
    );
  }

  // Prepare booking options with student information
  const bookingOptions = bookings?.map(booking => {
    // Find package info
    const pkg = packages?.find(p => p._id === booking.packageId);
    
    // Find students info
    const studentNames = booking.studentsIds
      .map(id => {
        const student = students?.find(s => s._id === id);
        return student ? student.fullName : "Unknown";
      })
      .join(", ");
      
    return {
      label: `${booking.startDate} | ${pkg?.desc || 'Package'} | ${studentNames}`,
      value: booking._id,
    };
  });

  // Determine the title based on the current mode
  const title = lessonId 
    ? `Lesson`
    : `New Lesson`;

  // Create extra header content with buttons and/or ID
  const extraHeaderContent = lessonId ? (
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
  ) : null;

  return (
    <Card
      title={
        <div className="flex items-center gap-4">
          <span>{title}</span>
          {lessonId && (
            <span className="text-gray-500 text-sm font-mono">ID: {lessonId}</span>
          )}
        </div>
      }
      extra={extraHeaderContent}
      className="w-full shadow-md bg-white"
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={lessonData || {}}
      >
        {/* Booking Selection */}
        <Form.Item
          name="bookingId"
          label="Booking"
          rules={[{ required: true, message: 'Please select a booking' }]}
        >
          <Select 
            placeholder="Select a booking"
            disabled={!isEditing}
            loading={bookings === undefined}
            options={bookingOptions}
            showSearch
            filterOption={(input, option) => 
              (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        
        {/* Teacher Selection */}
        <Form.Item
          name="teacherId"
          label="Teacher"
          rules={[{ required: true, message: 'Please select a teacher' }]}
        >
          <Select
            placeholder="Select teacher"
            disabled={!isEditing}
            loading={teachers === undefined}
            options={teachers?.map(teacher => ({
              label: teacher.fullName,
              value: teacher._id,
            }))}
            showSearch
            filterOption={(input, option) => 
              (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>
        
        {/* Submit Button for New Lesson */}
        {!lessonId && (
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} block>
              Create Lesson
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}