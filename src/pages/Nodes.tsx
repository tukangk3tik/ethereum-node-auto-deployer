import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiStopCircle, FiFile, FiList } from 'react-icons/fi';
import { MetaData } from '../types/pagination';
import { BadRequestError } from '../types/error';
import DeleteModal, { DeleteModalData } from '../components/modal/DeleteModal';
import { SelectOption } from '../types/utils';
import MasterOfficeModal from '../components/modal/MasterOfficeModal';
import { Node } from '../types/node';
import Button from '../components/Button';
import { getNodes } from '../services/nodes';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { XCircleIcon } from '@heroicons/react/outline';
import { StopIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/outline';
import { uptime } from 'os';
import { RefreshIcon } from '@heroicons/react/solid';
import { SearchCircleIcon } from '@heroicons/react/solid';
import { SearchIcon } from '@heroicons/react/outline';

const Nodes: React.FC = () => {
  const moduleName = 'Node List';
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [metadata, setMetadata] = useState<MetaData>({
    current_page: 1,
    per_page: 10,
    total_items: 0
  });

  const filteredNodes = nodes.filter(node => 
    node.node_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.network.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(metadata.total_items / metadata.per_page);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(metadata.total_items / metadata.per_page)) {
      // fetchNodes(newPage);
    }
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleteModalAnimating, setIsDeleteModalAnimating] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState<DeleteModalData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsModalAnimating(false); 
  };

  const closeModal = () => {
    // First start the closing animation
    setIsModalAnimating(true);
    setFormData({
      _id: '',
      node_id: '',
      type: '',
      network: '',
      is_testnet: false,
      ip_address: '',
      rpc_port: '',
      status: false,
      is_deploying: false,
      uptime: '',
    });
    
    // Then remove the modal from DOM after animation completes
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalAnimating(false);
    }, 300);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditModalAnimating, setIsEditModalAnimating] = useState(false);

  const openEditModal = (node: Node) => {
    setIsEditModalOpen(true);
    setIsEditModalAnimating(false); 
    setFormData({
      _id: node._id,
      node_id: node.node_id,
      type: node.type,
      network: node.network,
      is_testnet: node.is_testnet,
      ip_address: node.ip_address,
      rpc_port: node.rpc_port,
      status: node.status,
      is_deploying: node.is_deploying,
      uptime: node.uptime,
    });
  }

  const closeEditModal = () => {
    // First start the closing animation
    setIsEditModalAnimating(true);
    setFormData({
      _id: '',
      node_id: '',
      type: '',
      network: '',
      is_testnet: false,
      ip_address: '',
      rpc_port: '',
      status: false,
      is_deploying: false,
      uptime: ''
    });
    
    // Then remove the modal from DOM after animation completes
    setTimeout(() => {
      setIsEditModalOpen(false);
      setIsEditModalAnimating(false);
    }, 300);
  }

  const [formData, setFormData] = useState<Node>({
    _id: '',
    node_id: '',
    type: '',
    network: '',
    is_testnet: false,
    ip_address: '',
    rpc_port: '',
    status: false,
    is_deploying: false,
    uptime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Fetch offices from API
  const fetchNodes = async (page: number = 1) => {
    setLoading(true);

    setTimeout(async() => {
      try {
        // Replace with your actual API endpoint
        const response = await getNodes(page, metadata.per_page);
        
        if (response.data.length > 0) {
          setNodes(response.data);
          setMetadata(response.meta_data);
        }
      } catch (error) {
        console.error('Error fetching offices:', error);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  // Fetch provinces when modal opens
  useEffect(() => {
    if (isModalOpen) {
    }
  }, [isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // const { name, value } = e.target;
    // setFormData(prev => ({
    //   ...prev,
    //   [name]: value
    // }));
    
    // // Clear error for this field when user starts typing
    // if (formErrors[name]) {
    //   setFormErrors(prev => {
    //     const newErrors = {...prev};
    //     delete newErrors[name];
    //     return newErrors;
    //   });
    // }
  };


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Node List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your nodes
          </p>
        </div>
        <div  className="px-4 py-2 rounded-md flex items-center">
          <Button
            type="submit"
            fullWidth
            size="md">
            <FiPlus className="mr-2" />
            Add Node 
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Search and filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring--500 focus:border-transparent"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Node Identifier 
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network 
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address 
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RPC Port 
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime 
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions 
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredNodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No nodes found
                  </td>
                </tr>
              ) : (
                filteredNodes.map((node, index) => (
                  <tr key={node._id} className="hover:bg-gray-50">
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{((metadata.current_page - 1) * metadata.per_page) + index + 1}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {node.node_id}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {node.type}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-md ${node.is_testnet ? 'bg-amber-100 text-amber-500' : 'bg-indigo-100 text-indigo-500'}`}>{node.network}</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {node.ip_address}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {node.rpc_port}
                    </td> 
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 flex items-center justify-center">
                        {node.is_deploying ? 
                        <span className="items-center inline-flex rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/20 ring-inset"><RefreshIcon className="w-5 h-5 text-yellow-500" />&nbsp;Deploying</span> : 
                        node.status ? 
                         <span className="items-center inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"><CheckCircleIcon className="w-5 h-5 text-green-500" />&nbsp;Running</span> : 
                        <span className="items-center inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"><XCircleIcon className="w-5 h-5 text-red-500" />&nbsp;Stopped</span>}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                      {node.uptime}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-secondary-600 hover:text-secondary-900"
                          // onClick={() => openDeleteModal(node)}
                          >
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 sm:mx-0 sm:h-8 sm:w-8">
                            <FiSearch size={18} />
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(metadata.current_page - 1)}
              disabled={metadata.current_page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                metadata.current_page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(metadata.current_page + 1)}
              disabled={metadata.current_page === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                metadata.current_page === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(metadata.current_page - 1) * metadata.per_page + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(metadata.current_page * metadata.per_page, metadata.total_items)}
                </span>{' '}
                of <span className="font-medium">{metadata.total_items}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(metadata.current_page - 1)}
                  disabled={metadata.current_page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    metadata.current_page === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - metadata.current_page) < 2
                  )
                  .map((page, i, array) => {
                    // Add ellipsis
                    if (i > 0 && array[i - 1] !== page - 1) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          metadata.current_page === page
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                
                <button
                  onClick={() => handlePageChange(metadata.current_page + 1)}
                  disabled={metadata.current_page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    metadata.current_page === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding new office */}
      {/* {isModalOpen && (
        <MasterOfficeModal
          formTitle="Tambah Kantor Baru"
          isSubmitting={isSubmitting}
          isModalAnimating={isModalAnimating}
          formData={formData}
          formErrors={formErrors}
          locationData={locationData}
          closeModal={closeModal}
          onAnimationEnd={() => setIsModalAnimating(false)}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )} */}

      {/* {isEditModalOpen && (
        <MasterOfficeModal
          formTitle="Ubah Kantor"
          isSubmitting={isSubmitting}
          isModalAnimating={isEditModalAnimating}
          formData={formData}
          formErrors={formErrors}
          locationData={locationData}
          closeModal={closeEditModal}
          onAnimationEnd={() => setIsEditModalAnimating(false)}
          handleInputChange={handleInputChange}
          handleSubmit={handleEditSubmit}
        />
      )} */}
      
      {/* Delete Confirmation Modal */}
      {/* {isDeleteModalOpen && (
        <DeleteModal
          isDeleteLoading={isDeleting}
          isDeleteModalAnimating={isDeleteModalAnimating}
          deleteModalData={officeToDelete}
          handleDelete={handleDelete}
          closeDeleteModal={closeDeleteModal}
          onAnimationEnd={() => setIsDeleteModalAnimating(false)}
        />
      )} */}
    </div>
  );
};

export default Nodes;