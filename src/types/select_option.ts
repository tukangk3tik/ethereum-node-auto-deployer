
export interface SelectOption {
  _id: string;
  name: string;
  additional_data?: any;
}

export interface SelectOptionData {
  label: string;
  values: SelectOption[];
  isLoading: boolean;
  selectedValue: SelectOption | null;
  fieldError: string | null;
  placeholder?: string;
}

export interface SelectSearchOptionData extends SelectOptionData {
  searchTerm: string;
  filteredOptions: SelectOption[];
}

export interface SelectOptionProps {
  data: SelectOptionData | SelectSearchOptionData;
  onChange: (value: SelectOption) => void;
  handleQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
}




