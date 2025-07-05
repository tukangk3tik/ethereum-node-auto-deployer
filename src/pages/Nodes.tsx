import React, { useState, useEffect, Fragment } from 'react';
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MetaData } from '../types/pagination';
import DeleteModal, { DeleteModalData } from '../components/modal/DeleteModal';
import { CreateUpdateNodeRequest, Node } from '../types/node';
import Button from '../components/Button';
import { createNode, getNodes } from '../services/node.service';
import { XCircleIcon } from '@heroicons/react/outline';
import { RefreshIcon } from '@heroicons/react/solid';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import NodeModal from '../components/modal/NodeModal';
import { BadRequestError } from '../types/error';
import { getClientTypeOptions, getNetworkOptions } from '../services/master.data.service';
import { SelectOption } from '../types/select_option';
import { PlayIcon, StopIcon, TrashIcon } from '@heroicons/react/solid';
import { PencilIcon } from '@heroicons/react/solid';

const Nodes: React.FC = () => {
  const moduleName = 'Node List';
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [metadata, setMetadata] = useState<MetaData>({
    current_page: 1,
    limit: 10,
    total_items: 0
  });

  const filteredNodes = nodes.filter(node => 
    node.node_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.client_type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.host_ip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const perPage = metadata?.limit && metadata.limit > 0 ? metadata.limit : 1;
  const totalPages = Math.max(1, Math.ceil((metadata?.total_items ?? 0) / (perPage)));

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(metadata.total_items / perPage)) {
      fetchNodes(newPage);
    }
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleteModalAnimating, setIsDeleteModalAnimating] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<DeleteModalData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsModalAnimating(false);
  };

  const closeModal = () => {
    // First start the closing animation
    setIsModalAnimating(true);
    setFormData({
      node_code: '',
      client_type: '',
      network: '',
      host_ip: '',
      host_user: '',
      http_port: '',
      ws_port: '',
      p2p_port: '',
      auto_deploy: false,
    });
    setFormErrors({});
    setSelectedNetwork(null);
    setSelectedClientType(null);
    
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
      node_code: node.node_code,
      client_type: node.client_type._id,
      network: node.network._id,
      host_ip: node.host_ip,
      host_user: node.host_user,
      http_port: node.http_port,
      ws_port: node.ws_port,
      p2p_port: node.p2p_port,
      auto_deploy: false,
    });
    setSelectedClientType({
      _id: node.client_type._id,
      name: node.client_type.name,
    });
    setSelectedNetwork({
      _id: node.network._id,
      name: node.network.name,
    })
  }

  const closeEditModal = () => {
    // First start the closing animation
    setIsEditModalAnimating(true);
    setFormData({
      _id: '',
      node_code: '',
      client_type: '',
      network: '',
      host_ip: '',
      host_user: '',
      http_port: '',
      ws_port: '',
      p2p_port: '',
      auto_deploy: false,
    });
    
    // Then remove the modal from DOM after animation completes
    setTimeout(() => {
      setIsEditModalOpen(false);
      setIsEditModalAnimating(false);
    }, 300);
  }

  const [formData, setFormData] = useState<CreateUpdateNodeRequest>({
    _id: '',
    node_code: '',
    client_type: '',
    network: '',
    host_ip: '',
    host_user: '',
    http_port: '',
    ws_port: '',
    p2p_port: '',
    auto_deploy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Fetch offices from API
  const fetchNodes = async (page: number = 1) => {
    setLoading(true);

    setTimeout(async() => {
      try {
        // Replace with your actual API endpoint
        const response = await getNodes(page, metadata.limit);
        
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
    fetchNetworkOptions();
    fetchClientTypeOptions();
  }, []);

  // Fetch provinces when modal opens
  useEffect(() => {
    if (isModalOpen) {
    }
  }, [isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'auto_deploy') {
      const isChecked = (e.target instanceof HTMLInputElement) ? e.target.checked : false;
      setFormData(prev => ({
        ...prev,
        auto_deploy: isChecked
      }));
    }
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleSshKeyFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let file = null;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      file = e.target.files[0] || null;
    }
    setSelectedFile(file);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.node_code.trim()) errors.node_code = "Node Code Identifier is required";
    if (!formData.host_ip.trim()) errors.host_ip = "Host IP Address is required";
    if (!formData.host_user.trim()) errors.host_user = "Host User is required";
    if (!formData.http_port.trim()) errors.http_port = "HTTP Port is required";
    if (!formData.ws_port.trim()) errors.ws_port = "WS Port is required";
    if (!formData.p2p_port.trim()) errors.p2p_port = "P2P Port is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const multiPartFormData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          multiPartFormData.append(key, value);
        }
      }
      if (selectedFile) {
        multiPartFormData.append('private_key', selectedFile);
      }

      const response = await createNode(multiPartFormData);
      if (response.data) {
        setNodes(prev => [response.data!, ...prev]);
      }
      closeModal();
      
      fetchNodes(metadata.current_page);
    } catch (error) {
      console.error('Error creating node:', error);

      if (error instanceof BadRequestError) {
        error.fields.forEach((e) => {
          if (e === "node_code") {
            setFormErrors(prev => ({
              ...prev,
              code: error.message
            }));
          }
        })
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const multiPartFormData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          multiPartFormData.append(key, value);
        }
      }
      if (selectedFile) {
        multiPartFormData.append('private_key', selectedFile);
      }

      const response = await createNode(multiPartFormData);
      if (response.data) {
        setNodes(prev => [response.data!, ...prev]);
      }
      closeEditModal();
      
      fetchNodes(metadata.current_page);
    } catch (error) {
      console.error('Error creating node:', error);

      if (error instanceof BadRequestError) {
        error.fields.forEach((e) => {
          if (e === "node_code") {
            setFormErrors(prev => ({
              ...prev,
              code: error.message
            }));
          }
        })
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  {/* Fetch network options */}
  const [networkOptions, setNetworkOptions] = useState<SelectOption[]>([]);
  const fetchNetworkOptions = async () => {
    try {
      const response = await getNetworkOptions();
      if (response.data) {
        setNetworkOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching network options:', error);
    }
  };

  const [selectedNetwork, setSelectedNetwork] = useState<SelectOption | null>(null);
  const handleNetworkChange = (network: SelectOption) => {
    setSelectedNetwork(network);
    setFormData(prev => ({
      ...prev,
      network: network._id,
    }));
    // Clear error for district field
    if (formErrors.district) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.district;
        return newErrors;
      });
    }
  };
  const networkOptionData = {
      data: {label: "Network",
      values: networkOptions,
      isLoading: false,
      selectedValue: selectedNetwork,
      fieldError: null,
      placeholder: "Select a network",
    },
    onChange: handleNetworkChange,
    handleQueryChange: () => {},
    handleClearSearch: () => {}
  }

  {/* Fetch client type options */}
  const [clientTypeOptions, setClientTypeOptions] = useState<SelectOption[]>([]);
  const fetchClientTypeOptions = async () => {
    try {
      const response = await getClientTypeOptions();
      if (response.data) {
        setClientTypeOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching client type options:', error);
    }
  };

  const [selectedClientType, setSelectedClientType] = useState<SelectOption | null>(null);
  const handleClientTypeChange = (clientType: SelectOption) => {
    setSelectedClientType(clientType);
    setFormData(prev => ({
      ...prev,
      client_type: clientType._id,
    }));
    // Clear error for client_type field
    if (formErrors.client_type) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.client_type;
        return newErrors;
      });
    }
  };
  const clientTypeOptionData = {
    data: {
      label: "Client Type",
      values: clientTypeOptions,
      isLoading: false,
      selectedValue: selectedClientType,
      fieldError: null,
      placeholder: "Select a client type",
    },
    onChange: handleClientTypeChange,
    handleQueryChange: () => {},
    handleClearSearch: () => {}
  }

  const openDeleteModal = (node: Node) => {
    setNodeToDelete({
      id: node._id,
      name: node.node_code,
      label: '',
    });
    setIsDeleteModalOpen(true);
    setIsDeleteModalAnimating(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalAnimating(true);
    setTimeout(() => {
      setIsDeleteModalOpen(false);
      setIsDeleteModalAnimating(false);
      setNodeToDelete(null);
    }, 300);
  };

  const handleDelete = async () => {
    if (!nodeToDelete) return;

    setIsDeleting(true);
    try {
      console.log('Deleting node:', nodeToDelete.id);
      // await deleteNode(selectedNode._id);
      // setNodes(prev => prev.filter(node => node._id !== selectedNode._id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting node:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{moduleName}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your nodes
          </p>
        </div>
        <div  className="px-4 py-2 rounded-md flex items-center">
          <Button
            type="button"
            fullWidth
            size="md"
            className="rounded-md"
            onClick={openModal}>
            <FiPlus className="mr-2" />
            Add Node 
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg">
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
                  Node Code (ID) 
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
                  HTTP Port 
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
                      #{((metadata.current_page - 1) * metadata.limit) + index + 1}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {node.node_code}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {node.client_type.name}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-md ${node.network.key !== 'mainnet' ? 'bg-amber-100 text-amber-500' : 'bg-indigo-100 text-indigo-500'}`}>{node.network.name}</span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {node.host_ip}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {node.http_port}
                    </td> 
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 flex items-center justify-center">
                        {node.status === "deploying" ? <span className="items-center inline-flex rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/20 ring-inset"><RefreshIcon className="w-5 h-5 text-yellow-500" />&nbsp;Deploying</span> : ""}
                        {node.status === "running" ? <span className="items-center inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"><PlayIcon className="w-5 h-5 text-green-500" />&nbsp;Running</span> : ""}
                        {node.status === "stopping" ? <span className="items-center inline-flex rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/20 ring-inset"><RefreshIcon className="w-5 h-5 text-yellow-500" />&nbsp;Stopping</span> : ""}
                        {node.status === "stopped" ? <span className="items-center inline-flex rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-600/20 ring-inset"><StopIcon className="w-5 h-5 text-gray-500" />&nbsp;Stopped</span> : ""}
                        {node.status === "error" ? <span className="items-center inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"><XCircleIcon className="w-5 h-5 text-red-500" />&nbsp;Error</span> : ""}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                      {node.uptime}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-center text-sm font-medium relative overflow-visible">
                      <div className='flex item-centers'>
                        <button
                          className={`justify-end text-gray-500 block w-full text-sm flex items-center`}
                          onClick={() => openEditModal(node)}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <div className="flex justify-end space-x-2">
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <MenuButton as={Button}
                                variant="white"
                                size="xs"
                                type="button"
                                iconPosition="none"
                                className="rounded-full"
                                icon={<DotsVerticalIcon className="w-4 h-4 text-gray-500" />}
                                disabled={node.status === "deploying" || node.status === "stopping"}
                              />
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <MenuItems className={`absolute right-0 ${(index < metadata.total_items && index > metadata.total_items - 3) || (metadata.total_items === metadata.limit && index > metadata.limit - 2)
                                ? 'origin-bottom-right bottom-full' 
                                : 'origin-top-right top-full'} 
                                mt-2 w-32 divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-gray-100 ring-opacity-4 focus:outline-none z-50`
                              }>
                                <div className="py-1">
                                  <MenuItem>
                                    {({ focus }) => (
                                      <button
                                        disabled={node.status === "running"}
                                        className={`${focus ? 'bg-gray-100' : ''} text-left ${node.status === "running" ? `text-gray-500` : `text-green-500`} block w-full px-4 py-2 text-sm flex items-center`}
                                        onClick={() => console.log('Run', node._id)}
                                      >
                                        <PlayIcon className="w-5 h-5" />
                                        <span className='pl-2'>Run</span>
                                      </button>
                                    )}
                                  </MenuItem>
                                  <MenuItem>
                                    {({ focus }) => (
                                        <button
                                          disabled={node.status === "stopped"}
                                          className={`${focus ? 'bg-gray-100' : ''} text-left ${node.status === "stopped" ? `text-gray-500` : `text-amber-500`} block w-full px-4 py-2 text-sm flex items-center`}
                                          onClick={() => console.log('Stop', node._id)}
                                        >
                                          <StopIcon className="w-5 h-5" />
                                          <span className='pl-2'>Stop</span>
                                        </button>
                                    )}
                                  </MenuItem>
                                  <MenuItem>
                                    {({ focus }) => (
                                      <button
                                        className={`${focus ? 'bg-gray-100' : ''} text-left text-red-500 block w-full px-4 py-2 text-sm flex items-center`}
                                        onClick={() => openDeleteModal(node)}
                                      >
                                        <TrashIcon className="w-5 h-5" />
                                        <span className='pl-2'>Delete</span>
                                      </button>
                                    )}
                                  </MenuItem>
                                </div>
                              </MenuItems>
                            </Transition>
                          </Menu>
                        </div>
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
                Showing <span className="font-medium">{(metadata.current_page - 1) * metadata.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(metadata.current_page * metadata.limit, metadata.total_items)}
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
      {isModalOpen && (
        <NodeModal
          formTitle="Add new node"
          networkData={networkOptionData}
          clientTypeData={clientTypeOptionData}
          isSubmitting={isSubmitting}
          isModalAnimating={isModalAnimating}
          formData={formData}
          formErrors={formErrors}
          closeModal={closeModal}
          onAnimationEnd={() => setIsModalAnimating(false)}
          handleInputChange={handleInputChange}
          handleFileChange={handleSshKeyFileChange}
          handleSubmit={handleSubmit}
        />
      )}

      {isEditModalOpen && (
        <NodeModal
          formTitle="Update Node"
          networkData={networkOptionData}
          clientTypeData={clientTypeOptionData}
          isSubmitting={isSubmitting}
          isModalAnimating={isEditModalAnimating}
          formData={formData}
          formErrors={formErrors}
          closeModal={closeEditModal}
          onAnimationEnd={() => setIsEditModalAnimating(false)}
          handleInputChange={handleInputChange}
          handleFileChange={handleSshKeyFileChange}
          handleSubmit={handleEditSubmit}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          isDeleteLoading={isDeleting}
          isDeleteModalAnimating={isDeleteModalAnimating}
          deleteModalData={nodeToDelete}
          handleDelete={handleDelete}
          closeDeleteModal={closeDeleteModal}
          onAnimationEnd={() => setIsDeleteModalAnimating(false)}
        />
      )}
    </div>
  );
};

export default Nodes;