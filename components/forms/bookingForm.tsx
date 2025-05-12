"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Form, Select, DatePicker, Button, message, Card, Space, Alert, Spin } from "antd";
import { Id } from "@/convex/_generated/dataModel";
import dayjs from "dayjs";

interface BookingFormProps {
  bookingId?: string; // Optional for new bookings
}

export default function BookingForm({ bookingId }: BookingFormProps = {}) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(!bookingId); // Edit mode if new booking
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [maxStudents, setMaxStudents] = useState<number>(1);

  // Get data
  const packages = useQuery(api.models.package.get);
  const students = useQuery(api.models.student.get);
  const bookingData = useQuery(
    api.models.booking.getById,
    bookingId ? { id: bookingId as Id<"bookings"> } : "skip"
  );
  
  // Get the selected package details
  const selectedPackage = useQuery(
    api.models.package.getById, 
    selectedPackageId ? { id: selectedPackageId as Id<"packages"> } : "skip"
  );

  // Mutations
  const createBooking = useMutation(api.models.booking.create);
  const updateBooking = useMutation(api.models.booking.updateId);

  // Update selected package when form changes
  useEffect(() => {
    const packageId = form.getFieldValue("packageId");
    if (packageId) {
      setSelectedPackageId(packageId);
    }
  }, [form]);

  // Update form when booking data is loaded
  useEffect(() => {
    if (bookingData) {
      form.setFieldsValue({
        ...bookingData,
        startDate: bookingData.startDate ? dayjs(bookingData.startDate) : undefined
      });
      if (bookingData.packageId) {
        setSelectedPackageId(bookingData.packageId);
      }
    }
  }, [bookingData, form]);

  // Update max students when package changes
  useEffect(() => {
    if (selectedPackage) {
      setMaxStudents(selectedPackage.capacity || 1);
      
      // If current selection exceeds capacity, trim it
      const currentStudents = form.getFieldValue("studentsIds") || [];
      if (currentStudents.length > selectedPackage.capacity) {
        form.setFieldValue("studentsIds", currentStudents.slice(0, selectedPackage.capacity));
      }
    }
  }, [selectedPackage, form]);

  const handlePackageChange = (value: string) => {
    setSelectedPackageId(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format date as string for storage
      const formattedValues = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
      };
      
      if (bookingId) {
        // Update existing booking
        await updateBooking({
          id: bookingId as Id<"bookings">,
          ...formattedValues,
        });
        messageApi.success("Booking updated successfully!");
        setIsEditing(false);
      } else {
        // Create new booking
        await createBooking(formattedValues);
        messageApi.success("Booking created successfully!");
        form.resetFields();
      }
    } catch (error) {
      messageApi.error(`Error: ${error}`);
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (bookingData) {
      form.setFieldsValue({
        ...bookingData,
        startDate: bookingData.startDate ? dayjs(bookingData.startDate) : undefined
      });
    }
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(true);
  };

  // Loading state
  if (bookingId && bookingData === undefined) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  // Booking not found
  if (bookingId && bookingData === null) {
    return (
      <Alert
        message="Booking Not Found"
        description={`The booking with ID ${bookingId} does not exist.`}
        type="error"
        showIcon
      />
    );
  }

  // Determine the title based on the current mode
  const title = bookingId 
    ? `Booking`
    : `New Booking`;

  // Create extra header content with buttons and/or ID
  const extraHeaderContent = bookingId ? (
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
          {bookingId && (
            <span className="text-gray-500 text-sm font-mono">ID: {bookingId}</span>
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
        initialValues={bookingData || {}}
      >
        {/* Package Selection */}
        <Form.Item
          name="packageId"
          label="Package"
          rules={[{ required: true, message: 'Please select a package' }]}
        >
          <Select 
            placeholder="Select a package"
            onChange={handlePackageChange}
            disabled={!isEditing}
            loading={packages === undefined}
            options={packages?.map(pkg => ({
              label: `${pkg.desc || 'Package'} (${pkg.hours}h, ${pkg.capacity} students, $${pkg.price})`,
              value: pkg._id,
            }))}
          />
        </Form.Item>
        
        {/* Students Selection - Dependent on package selection */}
        <Form.Item
          name="studentsIds"
          label={`Students (max ${maxStudents})`}
          rules={[
            { required: true, message: 'Please select at least one student' },
            { 
              validator: (_, value) => {
                if (value && value.length > maxStudents) {
                  return Promise.reject(`Maximum ${maxStudents} students allowed for this package`);
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select students"
            disabled={!isEditing || !selectedPackageId}
            loading={students === undefined}
            options={students?.map(student => ({
              label: student.fullName,
              value: student._id,
            }))}
            maxTagCount={5}
          />
        </Form.Item>
        
        {/* Date Selection */}
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select a start date' }]}
        >
          <DatePicker 
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            disabled={!isEditing}
          />
        </Form.Item>
        
        {/* Submit Button for New Booking */}
        {!bookingId && (
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} block>
              Create Booking
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}