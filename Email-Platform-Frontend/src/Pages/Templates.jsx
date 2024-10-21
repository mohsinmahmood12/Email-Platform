import React, { useState, useEffect } from 'react';
import { IoIosSearch } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { FaRegEdit, FaMagic } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../services/templateService';
import { generateTemplate, improveEmail } from '../services/aiService';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', description: '' });
  const [templateType, setTemplateType] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const fetchedTemplates = await getTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = async () => {
    try {
      const createdTemplate = await createTemplate(newTemplate);
      setTemplates([...templates, createdTemplate]);
      setIsCreating(false);
      setNewTemplate({ name: '', content: '', description: '' });
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const handleUpdateTemplate = async (id, updatedTemplate) => {
    try {
      const updated = await updateTemplate(id, updatedTemplate);
      setTemplates(templates.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleGenerateTemplate = async () => {
    setIsGenerating(true);
    try {
      const generatedTemplate = await generateTemplate(templateType);
      setTemplates([...templates, generatedTemplate]);
    } catch (error) {
      console.error("Error generating template:", error);
    } finally {
      setIsGenerating(false);
      setTemplateType('');
    }
  };

  const handleImproveTemplate = async (id) => {
    try {
      const template = templates.find(t => t.id === id);
      const improvedContent = await improveEmail(template.content);
      const updatedTemplate = { ...template, content: improvedContent };
      const improved = await updateTemplate(id, updatedTemplate);
      setTemplates(templates.map(t => t.id === id ? improved : t));
    } catch (error) {
      console.error("Error improving template:", error);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <div className="w-64 h-10 bg-gray-800 flex items-center px-4 rounded-full">
          <IoIosSearch className="text-gray-400" />
          <input
            type="text"
            className="w-full bg-transparent text-sm outline-none ml-2 text-white placeholder-gray-400"
            placeholder="Search by people, template, messages"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Recently used</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.slice(0, 3).map(template => (
            <TemplateCard key={template.id} template={template} onUpdate={handleUpdateTemplate} onImprove={handleImproveTemplate} onDelete={handleDeleteTemplate} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">All Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} onUpdate={handleUpdateTemplate} onImprove={handleImproveTemplate} onDelete={handleDeleteTemplate} />
          ))}
        </div>
      </div>

      {isCreating && (
        <CreateTemplateModal
          newTemplate={newTemplate}
          setNewTemplate={setNewTemplate}
          onCreate={handleCreateTemplate}
          onClose={() => setIsCreating(false)}
        />
      )}

      {isGenerating && (
        <GenerateTemplateModal
          templateType={templateType}
          setTemplateType={setTemplateType}
          onGenerate={handleGenerateTemplate}
          onClose={() => setIsGenerating(false)}
        />
      )}

      <div className="fixed bottom-8 right-8">
        <button
          className="w-14 h-14 rounded-full bg-[#1FD1F8] flex justify-center items-center text-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300"
          onClick={() => setIsCreating(true)}
        >
          <FaRegEdit className="text-xl" />
        </button>
      </div>
    </div>
  );
}

const TemplateCard = ({ template, onUpdate, onImprove, onDelete }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden">
    <div className="h-40 bg-gray-700"></div>
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
      <p className="text-sm text-gray-400 mb-4">{template.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button onClick={() => onUpdate(template.id, { ...template, name: "Updated " + template.name })} className="text-[#1FD1F8]">
            <CiEdit className="text-xl" />
          </button>
          <button onClick={() => onImprove(template.id)} className="text-purple-400">
            <FaMagic className="text-xl" />
          </button>
        </div>
        <Link to={`/compose?template=${template.id}`} className="px-4 py-1 bg-[#1FD1F8] text-gray-900 rounded-full text-sm font-medium">
          Use
        </Link>
      </div>
    </div>
  </div>
)

const CreateTemplateModal = ({ newTemplate, setNewTemplate, onCreate, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Create New Template</h2>
      <input
        type="text"
        placeholder="Template Name"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        value={newTemplate.name}
        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
      />
      <textarea
        placeholder="Template Content"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        value={newTemplate.content}
        onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        value={newTemplate.description}
        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
      />
      <div className="flex justify-end">
        <button
          onClick={onCreate}
          className="bg-[#1FD1F8] text-gray-900 px-4 py-2 rounded mr-2"
        >
          Create
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)

const GenerateTemplateModal = ({ templateType, setTemplateType, onGenerate, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Generate AI Template</h2>
      <input
        type="text"
        placeholder="Template Type (e.g., marketing, newsletter)"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        value={templateType}
        onChange={(e) => setTemplateType(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
        >
          Generate
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)

export default Templates;