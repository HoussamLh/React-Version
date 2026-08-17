import { useCallback, useMemo, useState, type FormEvent } from "react";
import type { AdminProjectFormValues } from "../types/projectsCms.types";

type UseAdminProjectFormOptions = {
  initialValues?: AdminProjectFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: AdminProjectFormValues) => void | Promise<void>;
};

const defaultProjectFormValues: AdminProjectFormValues = {
  title: "",
  slug: "",
  text: "",

  category: "web",
  tags: [],

  mediaType: "image",
  imageUrl: null,
  videoUrl: null,
  videoPosterUrl: null,

  span: "span 6",
  imageHeight: "320px",
  hoverAccent: "green",

  demoUrl: null,
  githubUrl: null,

  featured: false,
  status: "draft",
  sortOrder: 0,
};

const createSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const parseTagsInput = (value: string) => {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getNullableTextValue = (value: string) => {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
};

export const useAdminProjectForm = ({
  initialValues,
  isSubmitting = false,
  onSubmit,
}: UseAdminProjectFormOptions) => {
  const [values, setValues] = useState<AdminProjectFormValues>(
    initialValues ?? defaultProjectFormValues,
  );

  const [tagsInput, setTagsInput] = useState(values.tags.join(", "));
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(values.slug));
  const [validationError, setValidationError] = useState<string | null>(null);

  const mediaPreview = useMemo(() => {
    if (values.mediaType === "video") {
      return values.videoPosterUrl ?? values.imageUrl;
    }

    return values.imageUrl ?? values.videoPosterUrl;
  }, [values.imageUrl, values.mediaType, values.videoPosterUrl]);

  const updateValue = useCallback(
    <Key extends keyof AdminProjectFormValues>(
      key: Key,
      nextValue: AdminProjectFormValues[Key],
    ) => {
      setValues((currentValues) => ({
        ...currentValues,
        [key]: nextValue,
      }));
    },
    [],
  );

  const handleTitleChange = useCallback(
    (nextTitle: string) => {
      setValues((currentValues) => ({
        ...currentValues,
        title: nextTitle,
        slug: hasEditedSlug ? currentValues.slug : createSlug(nextTitle),
      }));
    },
    [hasEditedSlug],
  );

  const handleSlugChange = useCallback(
    (nextSlug: string) => {
      setHasEditedSlug(true);
      updateValue("slug", createSlug(nextSlug));
    },
    [updateValue],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextValues: AdminProjectFormValues = {
        ...values,
        title: values.title.trim(),
        slug: values.slug.trim(),
        text: values.text.trim(),
        tags: parseTagsInput(tagsInput),
        imageUrl: getNullableTextValue(values.imageUrl ?? ""),
        videoUrl: getNullableTextValue(values.videoUrl ?? ""),
        videoPosterUrl: getNullableTextValue(values.videoPosterUrl ?? ""),
        demoUrl: getNullableTextValue(values.demoUrl ?? ""),
        githubUrl: getNullableTextValue(values.githubUrl ?? ""),
        imageHeight: values.imageHeight.trim() || "320px",
        sortOrder: Number(values.sortOrder) || 0,
      };

      if (!nextValues.title) {
        setValidationError("Project title is required.");
        return;
      }

      if (!nextValues.slug) {
        setValidationError("Project slug is required.");
        return;
      }

      if (!nextValues.text) {
        setValidationError("Project text is required.");
        return;
      }

      if (nextValues.mediaType === "image" && !nextValues.imageUrl) {
        setValidationError("Image URL is required when media type is image.");
        return;
      }

      if (nextValues.mediaType === "video" && !nextValues.videoUrl) {
        setValidationError("Video URL is required when media type is video.");
        return;
      }

      setValidationError(null);

      await onSubmit(nextValues);
    },
    [onSubmit, tagsInput, values],
  );

  return {
    values,
    tagsInput,
    hasEditedSlug,
    validationError,
    mediaPreview,
    isSubmitting,

    setTagsInput,
    setHasEditedSlug,
    updateValue,
    handleTitleChange,
    handleSlugChange,
    handleSubmit,
  };
};
