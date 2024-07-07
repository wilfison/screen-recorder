import { Icon } from "@phosphor-icons/react";

type SelectionListType = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  icon: Icon;
  active: boolean;
  disabled?: boolean;
  selectionList: SelectionListType[];
  onChangeCheck?: (checked: boolean) => void;
  onSelectionChange?: (value: string) => void;
};

export default function Control(props: Props) {
  const indicatorClass = props.active ? "active" : "inactive";

  const handleCheck = () => props.onChangeCheck?.(!props.active);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onSelectionChange?.(e.target.value);
  };

  return (
    <div className="row device">
      <button
        className="device-indicator"
        onClick={handleCheck}
        disabled={props.disabled}
      >
        <props.icon size={16} className="icon" />
        <span className={`indicator ${indicatorClass}`}></span>
      </button>

      <div className="device-selector">
        <label className={props.active ? "" : "disabled"}>{props.label}</label>
        <select
          disabled={props.disabled || !props.active}
          onChange={handleSelectionChange}
        >
          {props.selectionList.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
