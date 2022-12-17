import * as React from "react";
import { Fragment } from "react";
import * as ReactDOM from "react-dom";
import { forwardRef, useEffect } from "react";
import { selectMenu, disclosure } from "figma-plugin-ds";
import * as Select from "@radix-ui/react-select";
import { Listbox } from "@headlessui/react";

interface InputProps extends React.HTMLProps<HTMLInputElement> {}
interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {}


interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  destructive?: boolean;
  type?: "button" | "submit" | "reset"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant='primary',
  destructive=false,
  ...rest
}) => {

  return (
    <button className={`button button--${variant}${destructive ? '-destructive' : ''} ${className}`} {...rest}></button>
  )
});

export const Field = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, id, defaultValue = "", value, type = "text", className = "", ...rest },
    ref
  ) => {
    return (
      <div className={className && className}>
        <label htmlFor={id} className="mb-8">
          {label}
        </label>
        <input
          id={id}
          placeholder={label}
          defaultValue={defaultValue}
          value={value}
          className="input__field show-border"
          type={type}
          ref={ref}
          {...rest}
        />
      </div>
    );
  }
);
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, defaultValue = "", className = "", ...rest }, ref) => {
    return (
      <div className={className && className}>
        <label htmlFor={id} className="mb-8">
          {label}
        </label>
        <textarea
          id={id}
          placeholder={label}
          defaultValue={defaultValue}
          className="textarea"
          ref={ref}
          {...rest}
        ></textarea>{" "}
        :
      </div>
    );
  }
);

// const MySelect = ({label, id, defaultValue = "", value = '', type = "text", className = "", options, children, ...rest}) => {
//     useEffect(() => {
//         console.log(options);
//     }, [defaultValue, value, children])

//     return (
//         <div className={`show-border ${className && className}`}>
//             <label htmlFor={id} className="mb-8">{label}</label>

//             <Select.Root value={value}>
//                 <Select.Trigger className='select-menu__button select-menu__button--active'>
//                 <Select.Value className='select-menu__label'>{options[value]}</Select.Value>
//                 <Select.Icon className='select-menu__caret' />
//                 </Select.Trigger>

//                 <Select.Portal>
//                 <Select.Content className='select-menu__menu select-menu__menu--active'>
//                     {/* <Select.ScrollUpButton /> */}
//                     <Select.Viewport>
//                         aa
//                         {Object.keys(options).map(value => {
//                             <Select.Item value={value}>
//                               <Select.ItemText>{options[value]}</Select.ItemText>
//                               <Select.ItemIndicator />
//                             </Select.Item>
//                         })}

//                     </Select.Viewport>
//                     {/* <Select.ScrollDownButton /> */}
//                 </Select.Content>
//                 </Select.Portal>
//             </Select.Root>
//         </div>
//     )
// }
const MySelect = ({
  label,
  id,
  defaultValue = "",
  value = "",
  type = "text",
  className = "",
  options,
  children,
  ...rest
}) => {
  useEffect(() => {
    console.log(options);
  }, [defaultValue, value, children]);

  return (
    <div className={`show-border ${className && className}`}>
      <label htmlFor={id} className="mb-8">
        {label}
      </label>

      <Listbox value={value} {...rest}>
        <div className="select-menu">
        <Listbox.Button className="select-menu__button">
          <span className="select-menu__label">{options[value]}</span>
          <span className="select-menu__caret"></span>
        </Listbox.Button>
        <Listbox.Options className='select-menu__menu select-menu__menu--active'>
          {Object.keys(options).map((value) => {
            return (
                <Listbox.Option
                key={value}
                value={value}
                //  disabled={person.unavailable}
                as={Fragment}
                >
                {({ active, selected }) => 
                    <li className={`select-menu__item ${selected ? 'select-menu__item--selected' : ''}`}>     
                        <span className="select-menu__item-icon"></span>
                        <span className="select-menu__item-label">{options[value]}</span>
                    </li>
                    }
                </Listbox.Option>
            );
          })}
        </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};
export { MySelect as Select };
export const Grid = ({ children }) => {
  return <div className="grid">{children}</div>;
};
export const MenuItem = ({ children, className = "", ...rest }) => {
  return (
    <button className={`menu-item ${className}`} {...rest}>
      {children}
    </button>
  );
};
