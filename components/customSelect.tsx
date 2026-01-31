import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";

type Option = { label: string; value: string };

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className="w-full h-12 px-3 text-sm rounded-lg border border-gray-200
                       bg-white text-gray-900 flex items-center justify-between
                       focus:outline-none focus:border-main"
          >
            <span className={selected ? "" : "text-gray-400"}>
              {selected?.label || placeholder}
            </span>
            <FaChevronDown className="text-gray-400 text-xs" />
          </Listbox.Button>

          <Listbox.Options
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto
                       rounded-lg bg-white shadow-lg border border-gray-200 text-sm"
          >
            {options.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  `cursor-pointer px-3 py-2 ${
                    active ? "bg-main text-white" : "text-gray-900"
                  }`
                }
              >
                {opt.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
