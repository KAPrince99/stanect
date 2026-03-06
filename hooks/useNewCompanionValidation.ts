import { companionSchema } from "@/schemas/newCompanionSchema";
import { useTabFormStore } from "@/store/useTabFormStore";

export function useCompanionValidation() {
  const data = useTabFormStore();

  const validate = () => {
    const result = companionSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    return { success: true, data: result.data };
  };

  return validate;
}
