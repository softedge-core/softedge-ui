import { ReactNode, useState } from "react";
import { WizardForm } from "./WizardForm";

export interface Field {
  field: string;
  label: string;
  type: "text" | "select";
  validation?: boolean;
  options?: { label: string; value: string }[];
};

export type FormComponentWizard =
  | { type: "fields"; fields: Field[] }
  | { type: "text"; render: () => React.ReactNode };


export interface StepConfig {
  layout: "stacked" | "inline";
  components: FormComponentWizard[];

  title?: string;
  rightContent?: ReactNode;
};

interface WizardFormLayoutProps {
  steps: StepConfig[];
}

export function FormWizard({ steps }: WizardFormLayoutProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];
  const { title, rightContent } = currentStep;

  const hasTitle = Boolean(title);
  const hasRight = Boolean(rightContent);
  const fullWidth = !hasTitle && !hasRight;

  return (
  <div className={fullWidth ? "w-full" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
    {/* Left: Title + Scrollable Form */}
    <div className="flex flex-col min-h-screen relative">
      {/* Sticky Title */}
      {hasTitle && (
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}

      {/* Scrollable form area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <WizardForm steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} />
      </div>
    </div>

    {/* Right Panel: Sticky on full screen height */}
    {hasRight && (
      <div className="sticky top-0 h-screen overflow-y-auto border-l p-6 bg-blue-100">
        {rightContent}
      </div>
    )}
  </div>
);
}