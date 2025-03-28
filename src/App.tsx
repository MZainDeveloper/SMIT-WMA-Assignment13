import React, { useState } from "react";
import {
  PlusCircle,
  Trash2Icon,
  PencilIcon,
  GraduationCap,
  Search,
} from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  class: string;
  rollNumber: string;
  section: string;
  email: string;
  phone: string;
  createdAt: Date;
}

interface FormData {
  fullName: string;
  class: string;
  rollNumber: string;
  section: string;
  email: string;
  phone: string;
}

const initialFormState: FormData = {
  fullName: "",
  class: "",
  rollNumber: "",
  section: "",
  email: "",
  phone: "",
};

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const validateForm = (data: FormData): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!data.fullName.trim()) newErrors.fullName = "Required";
    if (!data.class.trim()) newErrors.class = "Required";
    if (!data.section.trim()) newErrors.section = "Required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Invalid email";
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Invalid phone";
    }

    if (!data.rollNumber.trim()) {
      newErrors.rollNumber = "Required";
    } else if (
      students.some(
        (student) =>
          student.rollNumber === data.rollNumber && student.id !== editingId
      )
    ) {
      newErrors.rollNumber = "Must be unique";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    if (editingId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingId ? { ...student, ...formData } : student
        )
      );
      setEditingId(null);
    } else {
      const newStudent: Student = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    setFormData(initialFormState);
    setIsFormVisible(false);
  };

  const startEditing = (student: Student) => {
    setFormData({
      fullName: student.fullName,
      class: student.class,
      rollNumber: student.rollNumber,
      section: student.section,
      email: student.email,
      phone: student.phone,
    });
    setEditingId(student.id);
    setIsFormVisible(true);
    setErrors({});
  };

  // Updated handleChange to support both input and select elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setErrors({});
    setIsFormVisible(false);
  };

  // Filter students based on search term (searches multiple fields)
  const filteredStudents = students.filter((student) =>
    [
      student.fullName,
      student.class,
      student.rollNumber,
      student.section,
      student.email,
      student.phone,
    ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Student Records Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your student records efficiently
          </p>
        </div>

        {/* Add New & Search Bar in one line */}
        <div className="flex flex-col sm:flex-row items-center justify-evenly mb-4 gap-2">
          {!isFormVisible && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="w-full sm:w-2/5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg transition duration-150 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add New Student</span>
            </button>
          )}
          {!isFormVisible && (
            <div className="w-full sm:w-2/5 relative transition duration-150 transform hover:scale-105">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Student Form */}
        {isFormVisible && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.fullName ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="Class/Grade"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.class ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.class && (
                    <p className="mt-1 text-xs text-red-500">{errors.class}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Roll Number"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.rollNumber ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.rollNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.rollNumber}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.section ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="" disabled>
                      Select Section
                    </option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                  {errors.section && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.section}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                  {editingId ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Students List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">
                {searchTerm ? "No matching students found" : "No students yet"}
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-400">
                  Add your first student using the button above
                </p>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  className="p-4 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.fullName}
                      </h3>
                      <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500">
                        <p>Class: {student.class}</p>
                        <p>Roll Number: {student.rollNumber}</p>
                        <p>Section: {student.section}</p>
                        <p>Email: {student.email}</p>
                        <p>Phone: {student.phone}</p>
                        <p>Added: {student.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(student)}
                        className="text-indigo-600 hover:text-indigo-700 transition duration-150 transform hover:scale-110"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this student?"
                            )
                          ) {
                            setStudents((prev) =>
                              prev.filter((s) => s.id !== student.id)
                            );
                          }
                        }}
                        className="text-red-600 hover:text-red-700 transition duration-150 transform hover:scale-110"
                      >
                        <Trash2Icon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
