import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../services/api";
import { useCategories } from "../hooks/useCategories";
import type { EventDto } from "../types/EventDto";

const eventSchema = z.object({
  title: z.string().trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be no more than 120 characters."),

  description: z.string().trim()
    .min(10, "Description must be at least 10 characters."),

  imageUrl: z.string().trim().refine(
    (value) => value === "" || isValidHttpUrl(value),
    "Enter a valid HTTP or HTTPS image URL."
  ).optional(),

  location: z.string().trim()
    .min(2, "Location must be at least 2 characters."),

  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),

  price: z.coerce.number()
    .min(0, "Price cannot be negative."),

  capacity: z.coerce.number()
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1."),

  categoryId: z.coerce.number()
    .int()
    .min(1, "Select a category."),
}).superRefine((values, context) => {
  if (
    values.startDate &&
    values.endDate &&
    new Date(values.endDate) <= new Date(values.startDate)
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "End date must be after the start date.",
    });
  }
});

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type FormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (dto: EventDto) => Promise<void>;
  submitLabel: string;
}

function toApiDate(value: string): string {
  return new Date(value).toISOString();
}

const emptyValues: FormValues = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
  startDate: "",
  endDate: "",
  price: 0,
  capacity: 1,
  categoryId: 0,
};

export default function EventForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: EventFormProps) {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onTouched",
    defaultValues: {
      ...emptyValues,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...emptyValues,
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  async function submit(values: FormValues) {
    const dto: EventDto = {
      title: values.title.trim(),
      description: values.description.trim(),
      imageUrl: values.imageUrl?.trim() || null,
      location: values.location.trim(),
      startDate: toApiDate(values.startDate),
      endDate: toApiDate(values.endDate),
      price: values.price,
      capacity: values.capacity,
      categoryId: values.categoryId,
    };

    try {
      await onSubmit(dto);
    } catch (error) {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unexpected error. Please try again.";

      setError("root.server", {
        type: "server",
        message,
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="card card-body shadow-sm"
    >
      {errors.root?.server && (
        <div className="alert alert-danger">
          {errors.root.server.message}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          {...register("title")}
        />
        {errors.title && (
          <div className="invalid-feedback">
            {errors.title.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          rows={4}
          {...register("description")}
        />
        {errors.description && (
          <div className="invalid-feedback">
            {errors.description.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Image URL (optional)</label>
        <input
          className={`form-control ${errors.imageUrl ? "is-invalid" : ""}`}
          {...register("imageUrl")}
        />
        {errors.imageUrl && (
          <div className="invalid-feedback">
            {errors.imageUrl.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <input
          className={`form-control ${errors.location ? "is-invalid" : ""}`}
          {...register("location")}
        />
        {errors.location && (
          <div className="invalid-feedback">
            {errors.location.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Start date and time</label>
        <input
          type="datetime-local"
          className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
          {...register("startDate")}
        />
        {errors.startDate && (
          <div className="invalid-feedback">
            {errors.startDate.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">End date and time</label>
        <input
          type="datetime-local"
          className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
          {...register("endDate")}
        />
        {errors.endDate && (
          <div className="invalid-feedback">
            {errors.endDate.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className={`form-control ${errors.price ? "is-invalid" : ""}`}
          {...register("price")}
        />
        {errors.price && (
          <div className="invalid-feedback">
            {errors.price.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Capacity</label>
        <input
          type="number"
          min="1"
          step="1"
          className={`form-control ${errors.capacity ? "is-invalid" : ""}`}
          {...register("capacity")}
        />
        {errors.capacity && (
          <div className="invalid-feedback">
            {errors.capacity.message}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
          {...register("categoryId")}
          disabled={categoriesLoading}
        >
          <option value="0">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {errors.categoryId && (
          <div className="invalid-feedback">
            {errors.categoryId.message}
          </div>
        )}

        {categoriesError && (
          <div className="text-danger mt-1">
            {categoriesError}
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || categoriesLoading}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => reset({ ...emptyValues, ...defaultValues })}
          disabled={isSubmitting}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
