import React from "react";
import { Alert } from "@/ui/alert";
import { Separator } from "@/ui/separator";
import { Button } from "@/ui/button";
import { useForm } from "react-hook-form";
import { FieldRenderer } from "./components/FieldRenderer";
import { FormComponent, FormSection } from "./common";

export interface SoftEdgeFormProps {
  schema: FormSection[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  defaultValues?: Record<string, any>;
}

export function SoftEdgeForm({ schema, onSubmit, defaultValues = {} }: SoftEdgeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const renderComponent = (component: FormComponent, index: number, layout: "stacked" | "inline") => {
    switch (component.type) {
      case "alert":
        return (
          <Alert key={`alert-${index}`} variant="default">
            {component.alert.message}
          </Alert>
        );
      case "notice":
        return (
          <div key={`notice-${index}`} className="text-sm text-muted-foreground italic">
            {component.notice.message}
          </div>
        );
      case "divider":
        return <Separator key={`divider-${index}`} className="my-6" />;
      case "fields":
        const isInline = layout === "stacked" && component.inline;
        const fieldCount = component.fields.length;
        const colCount = Math.min(fieldCount, 4);
        const gridCols =
          colCount === 1 ? "grid-cols-1"
          : colCount === 2 ? "grid-cols-2"
          : colCount === 3 ? "grid-cols-3"
          : "grid-cols-4";

        return (
          <div className={isInline ? `grid gap-4 ${gridCols}` : "space-y-4"}>
          {/* <React.Fragment key={`fields-${index}`}> */}
            {component.fields.map((field) => (
              <FieldRenderer
                key={field.field}
                field={field}
                layout={layout}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                defaultValues={defaultValues}
                width={field.width ?? ""}              
                />
            ))}
          {/* </React.Fragment> */}
          </div>
        );
      case "text":
        return <React.Fragment key={`text-${index}`}>{component.render()}</React.Fragment>;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {schema.flatMap((section) =>
        section.components.map((component, index) => renderComponent(component, index, section.layout))
      )}
      <div className="flex justify-end">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}