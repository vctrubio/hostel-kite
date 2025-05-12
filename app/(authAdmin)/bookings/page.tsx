"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button, Modal, Space, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BookingForm from "@/components/forms/bookingForm";

export default function BookingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bookings = useQuery(api.models.booking.get);
  const packages = useQuery(api.models.package.get);
  const students = useQuery(api.models.student.get);

  // State to store enriched bookings data with package and student names
  const [enrichedBookings, setEnrichedBookings] = useState<any[]>([]);

  // Process bookings to add readable package and student names
  useEffect(() => {
    if (bookings && packages && students) {
      const enriched = bookings.map(booking => {
        // Find the package
        const pkg = packages.find(p => p._id === booking.packageId);
        
        // Find the students
        const studentNames = booking.studentsIds
          .map(id => students.find(s => s._id === id)?.fullName || 'Unknown Student')
          .join(', ');
        
        return {
          ...booking,
          packageName: pkg ? `${pkg.desc || 'Package'} (${pkg.hours}h)` : 'Unknown Package',
          studentNames,
        };
      });
      
      setEnrichedBookings(enriched);
    }
  }, [bookings, packages, students]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl">All Bookings</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            Create New Booking
          </Button>
        </div>
        
        {/* Modal for creating new booking */}
        <Modal
          title="Create New Booking"
          open={isModalOpen}
          onCancel={closeModal}
          footer={null}
          width={700}
        >
          <BookingForm />
        </Modal>

        <Card className="mb-4">
          <p className="text-gray-600 mb-1">
            <strong>Total Bookings:</strong> {bookings?.length || 0}
          </p>
          <p className="text-sm text-gray-500">
            Select a booking from the table below to view details or create a new booking using the button above.
          </p>
        </Card>

        {/* Display bookings with custom columns */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrichedBookings.length > 0 ? (
              enrichedBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.packageName}
                  </td>
                  <td className="px-6 py-4">
                    {booking.studentNames}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.startDate}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Space>
                      <Button 
                        type="primary"
                        size="small"
                        onClick={() => {
                          // Implement viewing booking details
                          console.log(`View booking ${booking._id}`);
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        danger 
                        size="small"
                        onClick={() => {
                          // Implement delete functionality
                          console.log(`Delete booking ${booking._id}`);
                        }}
                      >
                        Delete
                      </Button>
                    </Space>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  {bookings === undefined ? "Loading bookings..." : "No bookings found. Create your first booking!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}