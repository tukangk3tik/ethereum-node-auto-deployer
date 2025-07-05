import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { Fragment } from "react";
import { SelectOption, SelectOptionData } from "../types/select_option";

interface RegularSelectOption {
  data: SelectOptionData;
  label: string;
  isDisable: boolean;
  handleChange: (value: SelectOption) => void;
}

const RegularSelectOption: React.FC<RegularSelectOption> = ({ 
  data,
  label,
  isDisable = false,
  handleChange,
}) => {
  return (
    <div>
    <label className="block text-sm font-medium leading-6 text-gray-900">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="mt-1 relative">
      <Listbox value={data.selectedValue} onChange={handleChange} disabled={isDisable}>
        <div className="relative">
          <ListboxButton className={`relative w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left text-sm shadow-sm ring-1 
            ${data.fieldError ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-indigo-500 h-9
            ${isDisable ? 'bg-gray-200' : 'bg-white'}`}
          >
          <span className="block truncate">
            {data.selectedValue ? data.selectedValue.name : data.placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FiChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-50 sm:text-sm">
              <div className="max-h-48 overflow-y-auto mt-1">
                {(
                  data.values.map((item) => (
                    <ListboxOption
                      key={item._id}
                      value={item}
                      className={({ selected, active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 
                        ${selected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}
                        ${active ? 'bg-gray-100' : ''}`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {item.name}
                          </span>
                        </>
                      )}
                    </ListboxOption>
                  ))
                )}
              </div>
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {data.fieldError && (
        <p className="mt-1 text-xs text-red-500 flex items-center">
          <span className="mr-1">⚠</span> {data.fieldError}
        </p>
      )}
    </div>
  </div>
  );
};

export default RegularSelectOption;