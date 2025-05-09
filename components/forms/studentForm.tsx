"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  languages: string[];
};

export default function StudentForm() {
  const createStudent = useMutation(api.models.student.createStudent);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    age: 18,
    languages: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const languageOptions = ["English", "Spanish", "French"];
  
  const handleLanguageChange = (language: string) => {
    setFormData(prev => {
      if (prev.languages.includes(language)) {
        return {
          ...prev,
          languages: prev.languages.filter(lang => lang !== language)
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, language]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createStudent({
        profile: {
          fullName: formData.fullName,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          languages: formData.languages as ("English" | "Spanish" | "French")[],
        },
        age: formData.age
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        age: 18,
        languages: [],
      });
      
      setMessage({ text: "Student created successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: `Error: ${error}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Age *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
            className="w-full p-2 border rounded-md"
            required
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Languages</label>
          <div className="space-y-2">
            {languageOptions.map((language) => (
              <label key={language} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                  className="rounded"
                />
                <span>{language}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-medium disabled:bg-blue-300"
        >
          {isSubmitting ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}