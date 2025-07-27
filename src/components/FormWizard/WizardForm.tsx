import { useState } from "react";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";

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
};

export interface WizardFormProps {
  steps: StepConfig[];
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function WizardForm({ steps, stepIndex, setStepIndex }: WizardFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const currentStep = steps[stepIndex];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleNext = () => {
    const newErrors: Record<string, boolean> = {};

    currentStep.components.forEach((comp) => {
      if (comp.type === "fields") {
        comp.fields.forEach((field) => {
          if (field.validation && !formData[field.field]) {
            newErrors[field.field] = true;
          }
        });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-6">
      {currentStep.components.map((comp, idx) => {
        if (comp.type === "text") {
          return <div key={idx}>{comp.render()}</div>;
        }

        if (comp.type === "fields") {
          return (
            <div key={idx} className="space-y-4">
              {comp.fields.map((field) => (
                <div key={field.field} className="flex flex-col gap-1">
                  <label className="text-sm font-medium">{field.label}</label>

                  {field.type === "text" && (
                    <Input
                      value={formData[field.field] || ""}
                      onChange={(e) => handleChange(field.field, e.target.value)}
                      className={errors[field.field] ? "border-red-500" : ""}
                    />
                  )}

                  {field.type === "select" && (
                    <Select
                      onValueChange={(val) => handleChange(field.field, val)}
                      defaultValue={formData[field.field] || ""}
                    >
                      <SelectTrigger className={errors[field.field] ? "border-red-500" : ""}>
                        <SelectValue placeholder={`Pilih ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {errors[field.field] && (
                    <span className="text-red-500 text-sm">Field wajib diisi</span>
                  )}
                </div>
              ))}
            </div>
          );
        }

        return null;
      })}

      {/* Sticky footer buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex justify-between z-10">
        {stepIndex > 0 && (
          <Button variant="outline" onClick={handlePrev}>
            Sebelumnya
          </Button>
        )}
        {stepIndex < steps.length - 1 ? (
          <Button onClick={handleNext}>Berikutnya</Button>
        ) : (
          <Button onClick={() => alert(JSON.stringify(formData, null, 2))}>
            Submit
          </Button>
        )}
      </div>

      {/* <div className="flex justify-between pt-4">
        {stepIndex > 0 && <Button onClick={handlePrev}>Sebelumnya</Button>}
        {stepIndex < steps.length - 1 ? (
          <Button onClick={handleNext}>Berikutnya</Button>
        ) : (
          <Button onClick={() => alert(JSON.stringify(formData, null, 2))}>
            Submit
          </Button>
        )}
      </div> */}
    </div>
  );
}