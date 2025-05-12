"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GenericTable } from "@/utils/genericTableMaster";
import { Button, Modal, Tabs, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PackageForm from "@/components/forms/packageForm";

export default function PackagesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const packages = useQuery(api.models.package.get);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Packages Management</h1>
      <div className="p-6 rounded-lg shadow">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl">All Packages</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            Add New Package
          </Button>
        </div>
        
        {/* Modal for adding new package */}
        <Modal
          title="Add New Package"
          open={isModalOpen}
          onCancel={closeModal}
          footer={null}
          width={700}
        >
          <PackageForm />
        </Modal>

        {packages ? (
          <GenericTable modelKey="packages" data={packages} />
        ) : (
          <p>Loading packages...</p>
        )}
      </div>
    </main>
  );
}