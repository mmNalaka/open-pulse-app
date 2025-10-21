import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Site name is required")
    .max(255, "Site name must be at most 255 characters"),
  domain: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
      message: "Domain must be a valid URL",
    })
    .max(255, "Domain must be at most 255 characters"),
  metadata: z.string().min(0),
});

type CreateSiteFormProps = {
  onSubmit?: (data: { name: string; domain: string; metadata: string }) => Promise<void> | void;
  isLoading?: boolean;
};

export function CreateSiteForm({ onSubmit, isLoading }: CreateSiteFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      domain: "",
      metadata: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (onSubmit) {
        await onSubmit(value);
      }
    },
  });

  return (
    <form
      id="create-site-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Site Name</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  disabled={isLoading}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="My Awesome Site"
                  value={field.state.value}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="domain">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Domain</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  disabled={isLoading}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com"
                  value={field.state.value}
                />
                <FieldDescription>Enter the full URL of your site</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="metadata">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Additional Configuration (JSON)</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    aria-invalid={isInvalid}
                    className="min-h-24 resize-none font-mono text-sm"
                    disabled={isLoading}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={4}
                    value={field.state.value}
                  />
                </InputGroup>
                <FieldDescription>
                  Optional JSON metadata for additional site configuration
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
