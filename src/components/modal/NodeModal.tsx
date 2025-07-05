import { FiPlus, FiX } from "react-icons/fi";
import { CreateUpdateNodeRequest } from "../../types/node";
import Button from "../Button";
import { SelectOptionProps } from "../../types/select_option";
import RegularSelectOption from "../RegularSelectOption";

interface NodeModalProps {
  formTitle: string;
  isSubmitting: boolean;
  isModalAnimating: boolean;
  formData: CreateUpdateNodeRequest;
  clientTypeData: SelectOptionProps;
  networkData: SelectOptionProps;
  formErrors: {[key: string]: string};
  closeModal: () => void;
  onAnimationEnd: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
}

const NodeModal: React.FC<NodeModalProps> = ({
  formTitle,
  isSubmitting,
  isModalAnimating,
  formData,
  clientTypeData,
  networkData,
  formErrors,
  closeModal,
  onAnimationEnd,
  handleInputChange,
  handleFileChange,
  handleSubmit
}) => {
  const isEdit = formData._id ? true : false;

  return (
    <>
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity duration-300 z-40" 
         aria-hidden="true"
        onClick={closeModal} />

      {/* Modal container - centered with flex */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl ${isModalAnimating ? 'animate-modal-out' : 'animate-modal-in'}`}
              onAnimationEnd={onAnimationEnd}>
            {/* Modal header */}
            <div className="border-b border-gray-200 px-4 py-3 sm:px-6 flex items-center justify-between">
              <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center">
                <FiPlus className="mr-2 text-indigo-500" />
                {formTitle} 
              </h3>
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1.5"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <FiX className="h-5 w-5" />
              </button>
            </div>
            {/* Modal body */}
            <div className="bg-white px-4 py-4 sm:px-6 sm:py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                    Node Code (ID)<span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      disabled={isEdit}
                      type="text"
                      id="node_code"
                      name="node_code"
                      placeholder="Ex: GETH-NODE-99"
                      value={formData.node_code}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md px-2 py-1.5 text-sm shadow-sm ring-1 
                        ${formErrors.node_code ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500 
                        ${isEdit ? 'bg-gray-200' : 'bg-white'}`}
                    />
                    {formErrors.node_code && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.node_code}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <RegularSelectOption
                  label={networkData.data.label}
                  data={networkData.data}
                  isDisable={false}
                  handleChange={networkData.onChange}
                />
                <RegularSelectOption
                  label={clientTypeData.data.label}
                  data={clientTypeData.data}
                  isDisable={false}
                  handleChange={clientTypeData.onChange}
                />
              </div>
              <div className="pt-4 grid grid-cols-1 gap-4">
                <div className="flex items-center">
                    <input
                      checked={formData.auto_deploy ? formData.auto_deploy : false}
                      type="checkbox"
                      id="auto_deploy"
                      name="auto_deploy"
                      onChange={handleInputChange}
                      className={`w-4 h-4 text-rounded-sm-600 bg-gray-100 border-gray-300 rounded-md focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                    />
                    <label htmlFor="auto_deploy" className="ms-2 text-sm font-medium">Auto Deploy ?</label>
                    {formErrors.auto_deploy && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.auto_deploy}
                      </p>
                    )}
                  </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4">
              <hr className="border-gray-200" />
            </div>
            <div className="bg-white px-4 py-2 sm:px-6 sm:py-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    HTTP Port <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="http_port"
                      name="http_port"
                      placeholder="Ex: 8545"
                      value={formData.http_port}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md px-2 py-1.5 text-sm shadow-sm ring-1 ${formErrors.http_port ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.http_port && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.http_port}
                      </p>
                    )}
                  </div>
                </div>
                  
                 <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Web Socket Port <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="ws_port"
                      name="ws_port"
                      placeholder="Ex: 8546"
                      value={formData.ws_port}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md px-2 py-1.5 text-sm shadow-sm ring-1 ${formErrors.ws_port ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.ws_port && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.ws_port}
                      </p>
                    )}
                  </div>
                </div>

                 <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    P2P Port <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="p2p_port"
                      name="p2p_port"
                      placeholder="Ex: 30303"
                      value={formData.p2p_port}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md px-2 py-1.5 text-sm shadow-sm ring-1 ${formErrors.p2p_port ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.p2p_port && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.p2p_port}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
             <div className="bg-gray-50 px-4">
              <hr className="border-gray-200" />
            </div>
            <div className="bg-white px-4 py-2 sm:px-6 sm:py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Host IP <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="host_ip"
                      name="host_ip"
                      placeholder="Ex: 10.0.0.1"
                      value={formData.host_ip}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md px-2 py-1.5 text-sm shadow-sm ring-1 ${formErrors.host_ip ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.host_ip && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.host_ip}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Host User <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="host_user"
                      name="host_user"
                      placeholder="Ex: ubuntu"
                      value={formData.host_user}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md px-2 py-1.5 text-sm shadow-sm ring-1 ${formErrors.host_user ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.host_user && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.host_user}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="ssh_key_file" className="block text-sm font-medium leading-6 text-gray-900">
                    SSH Key File (if need)
                  </label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="ssh_key_file"
                      name="ssh_key_file"
                      accept="*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {formErrors.ssh_key_file && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <span className="mr-1">⚠</span> {formErrors.ssh_key_file}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button
                type="button"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={<FiPlus className="h-3.5 w-3.5" />}
                onClick={handleSubmit}
                className="sm:ml-3 sm:w-auto rounded-md"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button 
                type="button"
                variant="secondary"
                size="md"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-md"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeModal;