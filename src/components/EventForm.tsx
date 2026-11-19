import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../services/api";
import { useCategories } from "../hooks/useCategories";
import type { EventDto } from "../types/EventDto";

const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Enter at least 3 characters.")
      .max(120, "Use 120 characters or fewer."),
    description: z.string().trim().min(10, "Enter at least 10 characters."),
    imageUrl: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" || value.startsWith("/images/") || isValidHttpUrl(value),
        "Enter an /images/... path or a valid HTTP or HTTPS URL.",
      )
      .optional(),
    location: z.string().trim().min(2, "Enter a location."),
    startDate: z.string().min(1, "Choose a start date and time."),
    endDate: z.string().min(1, "Choose an end date and time."),
    price: z.coerce.number().min(0, "Price cannot be negative."),
    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number.")
      .min(1, "Capacity must be at least 1."),
    categoryId: z.coerce.number().int().min(1, "Choose a category."),
  })
  .superRefine((values, context) => {
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
      title: "",
      description: "",
      imageUrl: "",
      location: "",
      startDate: "",
      endDate: "",
      price: 0,
      capacity: 1,
      categoryId: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues)
      reset({
        title: "",
        description: "",
        imageUrl: "",
        location: "",
        startDate: "",
        endDate: "",
        price: 0,
        capacity: 1,
        categoryId: 0,
        ...defaultValues,
      });
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
      setError("root.server", { type: "server", message });
    }
  }

  const invalidClass = (field: keyof FormValues) =>
    errors[field] ? " is-invalid" : "";

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="card card-body shadow-sm"
    >
      {errors.root?.server && (
        <div className="alert alert-danger" role="alert">
          {errors.root.server.message}
        </div>
      )}
      {categoriesError && (
        <div className="alert alert-warning">
          Categories could not be loaded: {categoriesError}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="title"
          className={`form-control${invalidClass("title")}`}
          {...register("title")}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description <span className="form-required">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className={`form-control${invalidClass("description")}`}
          {...register("description")}
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description.message}</div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="location" className="form-label">
            Location <span className="form-required">*</span>
          </label>
          <input
            id="location"
            className={`form-control${invalidClass("location")}`}
            {...register("location")}
          />
          {errors.location && (
            <div className="invalid-feedback">{errors.location.message}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="imageUrl" className="form-label">
            Image path or URL
          </label>
          <input
            id="imageUrl"
            type="text"
            placeholder="/images/event-name.jpg"
            className={`form-control${invalidClass("imageUrl")}`}
            {...register("imageUrl")}
          />
          <div className="form-text">
            Put image files in the frontend public/images folder, then enter a
            path such as /images/event-name.jpg. The path is saved in the event
            record.
          </div>
          {errors.imageUrl && (
            <div className="invalid-feedback">{errors.imageUrl.message}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="startDate" className="form-label">
            Start date and time <span className="form-required">*</span>
          </label>
          <input
            id="startDate"
            type="datetime-local"
            className={`form-control${invalidClass("startDate")}`}
            {...register("startDate")}
          />
          {errors.startDate && (
            <div className="invalid-feedback">{errors.startDate.message}</div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="endDate" className="form-label">
            End date and time <span className="form-required">*</span>
          </label>
          <input
            id="endDate"
            type="datetime-local"
            className={`form-control${invalidClass("endDate")}`}
            {...register("endDate")}
          />
          {errors.endDate && (
            <div className="invalid-feedback">{errors.endDate.message}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="price" className="form-label">
            Price (£) <span className="form-required">*</span>
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            className={`form-control${invalidClass("price")}`}
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price.message}</div>
          )}
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity <span className="form-required">*</span>
          </label>
          <input
            id="capacity"
            type="number"
            min="1"
            step="1"
            className={`form-control${invalidClass("capacity")}`}
            {...register("capacity", { valueAsNumber: true })}
          />
          {errors.capacity && (
            <div className="invalid-feedback">{errors.capacity.message}</div>
          )}
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="categoryId" className="form-label">
            Category <span className="form-required">*</span>
          </label>
          <select
            id="categoryId"
            className={`form-select${invalidClass("categoryId")}`}
            disabled={categoriesLoading}
            {...register("categoryId")}
          >
            <option value="0">
              {categoriesLoading ? "Loading categories…" : "Choose a category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className="invalid-feedback">{errors.categoryId.message}</div>
          )}
        </div>
      </div>

      <div className="d-flex gap-2 mt-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || categoriesLoading}
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </button>
      </div>
      <p className="form-text mt-3 mb-0">
        Fields marked * are required. The API performs its own validation too.
      </p>
    </form>
  );
}
