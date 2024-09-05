"use server";

import { z } from "zod";

const GETFORM_FORM_ID = "YOUR_FORM_ID_HERE";

const schema = z.object({
  type: z.enum(["Problem", "Question", "Feedback"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  file: z.any().optional(),
});

type FormSchema = z.infer<typeof schema>;

type FormResponse = {
  success: boolean;
  message?: string;
  formValues?: Record<string, string | null>;
  errors?: {
    [key: string]: string[];
  };
};

export async function submitForm(
  currentState: any,
  formData: FormData
): Promise<FormResponse> {
  const validatedFields = schema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    file: formData.get("file"),
  } as FormSchema);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`https://getform.io/f/${GETFORM_FORM_ID}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return { success: false, message: "Error submitting form" };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Form submitted successfully",
      formValues: data.formValues,
    };
  } catch (error) {
    return { success: false, errors: { form: ["Failed to submit form"] } };
  }
}
