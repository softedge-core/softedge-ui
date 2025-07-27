// components/Form/FieldRenderer.tsx
import React, { useState } from "react";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Checkbox } from "@/ui/checkbox";
import { Switch } from "@/ui/switch";
import { FieldError, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { FieldConfig } from "@/components/Form";
import { format } from "date-fns";
import { SESingleSelect } from "@/ui/SESingleSelect";
import { SingleOptionList } from "@/ui/SEPopoverSingle";

interface FieldRendererProps {
    field: FieldConfig & { defaultValue?: any };
    layout: "stacked" | "inline";
    register: UseFormRegister<any>;
    errors: Record<string, any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    defaultValues: Record<string, any>;
    width: string;
  }
  
  export const FieldRenderer: React.FC<FieldRendererProps> = ({
    field,
    layout,
    register,
    errors,
    watch,
    setValue,
    defaultValues,
  }) => {
    const [open, setOpen] = useState(false);
    const rules = field.validation ? { required: `${field.label} wajib diisi` } : {};
    const error = errors[field.field];
    const isDisabled = field.dependsOn ? !watch(field.dependsOn) : false;
    const isMultiple = field.multipleOption ? field.multipleOption : false;
    const value = watch(field.field) ?? field.defaultValue;
    //const widthClass = field.width !== "" || field.width !== undefined ? `w-[${field.width}]` : "w-full";
    const customWidth = field.width ? field.width : "100%";

    const renderStacked = (control: React.ReactNode) => (
      <div
        key={field.field}
        className="space-y-1"
        style={{ width: customWidth }}
      >
        <label className="text-sm font-medium">{field.label}</label>
        {control}
        {error && <p className="text-sm text-red-500">{error.message as string}</p>}
      </div>
    );
  
    const renderInline = (control: React.ReactNode) => (
      <div
        key={field.field}
        className="flex items-center gap-4 mb-2"
        style={{ width: customWidth }}
      >
        <label className="w-40 text-sm font-medium text-right">{field.label}</label>
        <div className="flex-1">
          {control}
          {error && <p className="text-sm text-red-500 mt-1">{error.message as string}</p>}
        </div>
      </div>
    );
  
    const control = (() => {
      switch (field.type) {
        case "textarea":
          return <Textarea className="w-auto max-w-sm" disabled={isDisabled} defaultValue={field.defaultValue} {...register(field.field, rules)} />;
        case "select":
          return (
            <>
                {isMultiple ? (
                    <>Multiple</>
                ) : (
                  <>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  disabled={isDisabled}
                  className="border px-2 py-1 rounded w-full text-left"
                >
                  {value ? (
                    field.options?.find((opt) => opt.value === value)?.label
                  ) : (
                    <span className="text-muted-foreground">Pilih {field.label}</span>
                  )}
                </button>
                {open && (
                  <div className="absolute z-50 bg-white border rounded shadow-md mt-1">
                    <SingleOptionList
                      label={field.label}
                      options={(field.options ?? []).map((opt) => opt.label)}
                      value={
                        field.options?.find((opt) => opt.value === value)?.label || null
                      }
                      onSelect={(selectedLabel) => {
                        const selectedValue =
                          field.options?.find((opt) => opt.label === selectedLabel)?.value ||
                          null;
                        setValue(field.field, selectedValue);
                      }}
                      setOpen={setOpen}
                    />
                  </div>
                )}
              </>
                    // <SESingleSelect options={(field.options ?? []).map(opt => ({ value: opt.value, label: opt.label }))} value={defaultValues[field.field] ?? field.defaultValue} onChange={(val) => setValue(field.field, val)}  disable={isDisabled}/>
                //     <Select
                //     disabled={isDisabled}
                //     defaultValue={defaultValues[field.field] ?? field.defaultValue}
                //     onValueChange={(val) => setValue(field.field, val)}
                //   >
                //     <SelectTrigger className="w-auto max-w-sm">
                //       <SelectValue placeholder={`Pilih ${field.label}`} />
                //     </SelectTrigger>
                //     <SelectContent className="bg-white">
                //       {field.options?.map((opt) => (
                //         <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                //       ))}
                //     </SelectContent>
                //   </Select> 
                )}
            </>
          );
        case "checkbox":
          return (
            <div className="flex flex-col gap-2">
              {field.options?.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={Array.isArray(value) ? value.includes(opt.value) : false}
                    onCheckedChange={(checked) => {
                      const newValue = Array.isArray(value) ? [...value] : [];
                      if (checked) {
                        setValue(field.field, [...newValue, opt.value]);
                      } else {
                        setValue(field.field, newValue.filter((v) => v !== opt.value));
                      }
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          );
        case "switch":
          return (
            <div className="flex items-center gap-3">
              {field.options?.[0]?.label && <span className="text-sm text-muted-foreground">{field.options[0].label}</span>}
              <Switch
                checked={value ?? false}
                onCheckedChange={(val) => setValue(field.field, val)}
                disabled={isDisabled}
              />
              {field.options?.[1]?.label && <span className="text-sm text-muted-foreground">{field.options[1].label}</span>}
            </div>
          );
        case "date":
          return (
            <Input
              type="date"
              className="w-auto max-w-sm"
              disabled={isDisabled}
              defaultValue={field.defaultValue}
              {...register(field.field, rules)}
            />
          );
        case "daterange":
          return (
            <div className="flex gap-2">
              <Input
                type="date"
                className="w-auto max-w-sm"
                disabled={isDisabled}
                defaultValue={field.defaultValue?.start}
                {...register(`${field.field}.start`, rules)}
              />
              <span className="text-sm mt-2">s.d.</span>
              <Input
                type="date"
                className="w-auto max-w-sm"
                disabled={isDisabled}
                defaultValue={field.defaultValue?.end}
                {...register(`${field.field}.end`, rules)}
              />
            </div>
          );
        default:
          return <Input type="text" disabled={isDisabled} defaultValue={field.defaultValue} {...register(field.field, rules)} />;
      }
    })();
  
    return layout === "inline" ? renderInline(control) : renderStacked(control);
  };
