import { useMutation } from "@tanstack/react-query";
import { api, type ResponseInput, type ResponseResult } from "@shared/routes";

export function useCreateResponse() {
  return useMutation<ResponseResult, Error, ResponseInput>({
    mutationFn: async (data: ResponseInput) => {
      const res = await fetch(api.responses.create.path, {
        method: api.responses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        let errorMessage = "Failed to send response";
        try {
          const errorData = await res.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // fallback to default error
        }
        throw new Error(errorMessage);
      }
      
      return api.responses.create.responses[201].parse(await res.json());
    },
  });
}
