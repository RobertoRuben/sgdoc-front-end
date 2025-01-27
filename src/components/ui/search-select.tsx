import ReactSelect from "react-select";

interface SelectProps<T> {
  options: { value: T; label: string }[];
  value?: { value: T; label: string };
  onChange: (value: { value: T; label: string } | null) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean; 
  placeholder?: string;
  inputId?: string;
}

export const SearchSelect = <T,>({
  options,
  value,
  onChange,
  isDisabled,
  isLoading,
  placeholder,
  inputId,
}: SelectProps<T>) => {
  return (
    <ReactSelect
      inputId={inputId}
      options={options}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable
      isSearchable
      placeholder={placeholder}
      className="basic-single text-sm"
      classNamePrefix="select"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderWidth: "0.5px",
          borderColor: state.isFocused ? "black" : "#e2e8f0",
          boxShadow: "none",
          fontSize: "0.875rem",
          "&:hover": {
            borderColor: "black",
            borderWidth: "0.5px",
          },
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: "0.875rem",
          backgroundColor: state.isSelected
            ? "#f3f4f6"
            : state.isFocused
            ? "#f9fafb"
            : "white",
          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          fontSize: "0.875rem",
          color: "black",
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          fontSize: "0.875rem",
          color: "black",
        }),
      }}
    />
  );
};