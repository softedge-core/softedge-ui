import { ReactNode, useState } from "react";
import { FormComponent } from "../Form/common";
import { WizardForm } from "./WizardForm";

// export type FieldType = "text" | "textarea" | "select" | "checkbox" | "switch" | "date" | "daterange";

// export interface SelectOption {
//   label: string;
//   value: string;
// }

// export interface FieldConfig {
//     field: string;
//     label: string;
//     type: FieldType;
//     validation?: boolean;
//     options?: SelectOption[];
//     multipleOption?: Boolean;
//     dependsOn?: string;
//     width?: string;
// };
// export type FormComponent =
//   | { type: "alert"; alert: { type: "info" | "success" | "warning" | "error"; message: string } }
//   | { type: "notice"; notice: { type: string; message: string } }
//   | { type: "divider" }
//   | { type: "fields"; inline?: boolean; fields: FieldConfig[] }
//   | { type: "text"; render: () => React.ReactNode };


export interface StepConfig {
  layout: "stacked" | "inline";
  components: FormComponent[];
  titleContent?: ReactNode;
  rightContent?: ReactNode;
};

interface WizardFormLayoutProps {
  steps: StepConfig[];
  closeButton?: () => void;
}

export function FormWizard({ steps, closeButton }: WizardFormLayoutProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];
  const { titleContent, rightContent } = currentStep;

  const hasTitle = Boolean(titleContent);
  const hasRight = Boolean(rightContent);

  return (
    <div className={`grid ${hasRight ? "grid-cols-2" : "grid-cols-1"} gap-6 w-full h-screen`}>
      
      <div className="flex flex-col h-screen w-full">
        {hasTitle && titleContent}        
        <div className="flex-1 overflow-y-auto pt-4 px-4 pb-32">
          <WizardForm
            steps={steps}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            closeButton={closeButton}
          />
        </div>
      </div>

      {hasRight && (
        <div className="sticky top-0 h-screen border-l overflow-y-auto p-6 bg-gray-50">
          {rightContent}
        </div>
      )}
    </div>
);
}