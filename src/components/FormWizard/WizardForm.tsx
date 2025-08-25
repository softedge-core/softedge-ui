// import React, { useState } from "react";
// import { Button } from "@/ui/button";
// import { FieldRenderer } from "../Form/components/FieldRenderer";
// import { Alert } from "@/ui/alert";
// import { Separator } from "@/ui/separator";
// import { useForm } from "react-hook-form";
// import { StepConfig } from "./FormWizard";
// import { FormComponent } from "../Form/common";

// // export type FieldType = "text" | "textarea" | "select" | "checkbox" | "switch" | "date" | "daterange";

// // export interface SelectOption {
// //   label: string;
// //   value: string;
// // }

// // export interface FieldConfig {
// //     field: string;
// //     label: string;
// //     type: FieldType;
// //     validation?: boolean;
// //     options?: SelectOption[];
// //     multipleOption?: Boolean;
// //     dependsOn?: string;
// //     width?: string;
// // };

// // export type FormComponent =
// //   | { type: "alert"; alert: { type: "info" | "success" | "warning" | "error"; message: string } }
// //   | { type: "notice"; notice: { type: string; message: string } }
// //   | { type: "divider" }
// //   | { type: "fields"; inline?: boolean; fields: FieldConfig[] }
// //   | { type: "text"; render: () => React.ReactNode };

// // export interface StepConfig {
// //   layout: "stacked" | "inline";
// //   components: FormComponent[];
// // };

// export interface WizardFormProps {
//   steps: StepConfig[];
//   stepIndex: number;
//   setStepIndex: React.Dispatch<React.SetStateAction<number>>;
//   closeButton?: () => void;
//   defaultValues?: Record<string, any>;
// }

// export function WizardForm({ steps, stepIndex, setStepIndex, closeButton, defaultValues = {} }: WizardFormProps) {
// const {
//       register,
//       handleSubmit,
//       setValue,
//       watch,
//       formState: { errors },
//     } = useForm({ defaultValues });

//   const [formData, setFormData] = useState<Record<string, any>>({});
//   //const [errors, setErrors] = useState<Record<string, boolean>>({});

//   const currentStep = steps[stepIndex];

//   const handleChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     // setErrors((prev) => ({ ...prev, [field]: false }));
//   };

//   const handleNext = () => {
//     const newErrors: Record<string, boolean> = {};

//     currentStep.components.forEach((comp) => {
//       if (comp.type === "fields") {
//         comp.fields.forEach((field) => {
//           if (field.validation && !formData[field.field]) {
//             newErrors[field.field] = true;
//           }
//         });
//       }
//     });

//     if (Object.keys(newErrors).length > 0) {
//       //setErrors(newErrors);
//       return;
//     }

//     setStepIndex((prev) => prev + 1);
//   };

//   const handlePrev = () => {
//     setStepIndex((prev) => Math.max(prev - 1, 0));
//   };

//   const renderComponent = (component: FormComponent, index: number, layout: "stacked" | "inline") => {
//       switch (component.type) {
//         case "alert":
//           return (
//             <Alert key={`alert-${index}`} variant="default">
//               {component.alert.message}
//             </Alert>
//           );
//         case "notice":
//           return (
//             <div key={`notice-${index}`} className="text-sm text-muted-foreground italic">
//               {component.notice.message}
//             </div>
//           );
//         case "divider":
//           return <Separator key={`divider-${index}`} className="my-6" />;
//         case "fields":
//           const isInline = layout === "stacked" && component.inline;
//           const fieldCount = component.fields.length;
//           const colCount = Math.min(fieldCount, 4);
//           const gridCols =
//             colCount === 1 ? "grid-cols-1"
//             : colCount === 2 ? "grid-cols-2"
//             : colCount === 3 ? "grid-cols-3"
//             : "grid-cols-4";
  
//           return (
//             <div className={isInline ? `grid gap-4 ${gridCols}` : "space-y-4"}>
//             {/* <React.Fragment key={`fields-${index}`}> */}
//               {component.fields.map((field) => (
//                 <FieldRenderer
//                   key={field.field}
//                   field={field}
//                   layout={layout}
//                   register={register}
//                   errors={errors}
//                   watch={watch}
//                   setValue={setValue}
//                   defaultValues={defaultValues}
//                   width={field.width ?? ""}              
//                   />
//               ))}
//             {/* </React.Fragment> */}
//             </div>
//           );
//         case "text":
//           return <React.Fragment key={`text-${index}`}>{component.render()}</React.Fragment>;
//         default:
//           return null;
//       }
//     };

//   return (
//     <div className="space-y-6">
//       {currentStep.components.map((component, index) => renderComponent(component, index, currentStep.layout))}
//       {/* {currentStep.components.map((comp, idx) => {
//         section.components.map((component, index) => renderComponent(component, index, section.layout))
//       })} */}
//       {/* Sticky footer buttons */}
//       {/* <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex justify-between z-10">
//         {stepIndex > 0 && (
//           <Button variant="outline" onClick={handlePrev}>
//             Sebelumnya
//           </Button>
//         )}
//         {stepIndex < steps.length - 1 ? (
//           <Button onClick={handleNext}>Berikutnya</Button>
//         ) : (
//           <Button onClick={() => alert(JSON.stringify(formData, null, 2))}>
//             Submit
//           </Button>
//         )}
//       </div> */}

//       <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex justify-between z-10">
//         <div className="flex gap-2">
//           {/* Show Close Button only if closeButton is true AND stepIndex === 1 */}
//           {closeButton && stepIndex === 0 && (
//             <Button variant="secondary" onClick={closeButton}>
//               Tutup
//             </Button>
//           )}

//           {/* Previous Button */}
//           {stepIndex > 0 && (
//             <Button variant="outline" onClick={handlePrev}>
//               Sebelumnya
//             </Button>
//           )}
//         </div>

//         {/* Next / Submit Button */}
//         {stepIndex < steps.length - 1 ? (
//           <Button onClick={handleNext}>Berikutnya</Button>
//         ) : (
//           <Button onClick={() => alert(JSON.stringify(formData, null, 2))}>
//             Submit
//           </Button>
//         )}
//       </div>

//       {/* <div className="flex justify-between pt-4">
//         {stepIndex > 0 && <Button onClick={handlePrev}>Sebelumnya</Button>}
//         {stepIndex < steps.length - 1 ? (
//           <Button onClick={handleNext}>Berikutnya</Button>
//         ) : (
//           <Button onClick={() => alert(JSON.stringify(formData, null, 2))}>
//             Submit
//           </Button>
//         )}
//       </div> */}
//     </div>
//   );
// }
import React from "react";
import { Button } from "@/ui/button";
import { FieldRenderer } from "../Form/components/FieldRenderer";
import { Alert } from "@/ui/alert";
import { Separator } from "@/ui/separator";
import { useForm } from "react-hook-form";
import { StepConfig } from "./FormWizard";
import { FormComponent } from "../Form/common";

export interface WizardFormProps {
  steps: StepConfig[];
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  closeButton?: () => void;
  defaultValues?: Record<string, any>;
}

export function WizardForm({
  steps,
  stepIndex,
  setStepIndex,
  closeButton,
  defaultValues = {},
}: WizardFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const getCurrentStepFieldNames = () => {
    const names: string[] = [];
    currentStep.components.forEach((comp) => {
      if (comp.type === "fields") comp.fields.forEach((f) => names.push(f.field));
    });
    return names;
  };

  const handleNext = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault(); // <- stops accidental submits
    const names = getCurrentStepFieldNames();
    const ok = await trigger(names as any, { shouldFocus: true });
    if (!ok) return;
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: Record<string, any>) => {
    alert(JSON.stringify(data, null, 2));
  };

  const renderComponent = (
    component: FormComponent,
    index: number,
    layout: "stacked" | "inline"
  ) => {
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
      case "fields": {
        const isInline = layout === "stacked" && component.inline;
        const fieldCount = component.fields.length;
        const colCount = Math.min(fieldCount, 4);
        const gridCols =
          colCount === 1
            ? "grid-cols-1"
            : colCount === 2
            ? "grid-cols-2"
            : colCount === 3
            ? "grid-cols-3"
            : "grid-cols-4";

        return (
          <div
            key={`fields-${index}`}
            className={isInline ? `grid gap-4 ${gridCols}` : "space-y-4"}
          >
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
                // If FieldRenderer renders any buttons, ensure they pass type="button"
              />
            ))}
          </div>
        );
      }
      case "text":
        return <React.Fragment key={`text-${index}`}>{component.render()}</React.Fragment>;
      default:
        return null;
    }
  };

  // Prevent Enter from submitting on non-final steps; you can also call handleNext here if you want Enter = Next
  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (!isLastStep && e.key === "Enter") {
      e.preventDefault();
      // Optionally treat Enter as Next:
      // handleNext(e);
    }
  };

  return (
    <form
      className="space-y-6"
      // Only allow submit on the last step
      onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
      onKeyDown={handleFormKeyDown}
    >
      {currentStep.components.map((component, index) =>
        renderComponent(component, index, currentStep.layout)
      )}

      <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex justify-between z-10">
        <div className="flex gap-2">
          {closeButton && stepIndex === 0 && (
            <Button variant="secondary" type="button" onClick={closeButton}>
              Tutup
            </Button>
          )}

          {stepIndex > 0 && (
            <Button variant="outline" type="button" onClick={handlePrev}>
              Sebelumnya
            </Button>
          )}
        </div>

        {isLastStep ? (
          <Button type="submit">Submit</Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Berikutnya
          </Button>
        )}
      </div>
    </form>
  );
}