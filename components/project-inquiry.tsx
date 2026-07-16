"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { easeOutExpo } from "@/lib/motion";

type SubmitStatus = "idle" | "submitting" | "success" | "error" | "validation";

type ProjectInquiryContextValue = {
  openProjectInquiry: () => void;
};

const ProjectInquiryContext = createContext<ProjectInquiryContextValue | null>(null);

const copy = {
  en: {
    eyebrow: "New project",
    title: "Tell us what you are building.",
    intro: "A short brief is enough. We will reply within one business day.",
    close: "Close project form",
    projectType: "Project type",
    choose: "Choose an option",
    projectTypes: [
      ["website", "Corporate or marketing website"],
      ["product", "SaaS or web application"],
      ["design", "UI/UX design"],
      ["motion", "Motion and interaction"],
      ["other", "Other"],
    ],
    brief: "About the project",
    briefPlaceholder: "What do you need to launch or improve?",
    timeline: "Timeline",
    timelines: [
      ["urgent", "As soon as possible"],
      ["1-2-months", "1–2 months"],
      ["3-4-months", "3–4 months"],
      ["flexible", "Flexible"],
    ],
    name: "Your name",
    company: "Company",
    optional: "optional",
    contact: "Email or Telegram",
    contactPlaceholder: "name@company.com or @username",
    consent: "By sending this form, you agree that we may use these details to reply to you.",
    submit: "Send project brief",
    submitting: "Sending…",
    successTitle: "Your brief is on its way.",
    successText: "We received it in Telegram and will get back to you shortly.",
    done: "Done",
    error: "We could not send the brief. Try again or email us directly.",
    validation: "Choose a project type and timeline.",
  },
  ru: {
    eyebrow: "Новый проект",
    title: "Расскажите, что вы хотите создать.",
    intro: "Достаточно короткого описания. Ответим в течение одного рабочего дня.",
    close: "Закрыть форму проекта",
    projectType: "Тип проекта",
    choose: "Выберите вариант",
    projectTypes: [
      ["website", "Корпоративный или промосайт"],
      ["product", "SaaS или веб-приложение"],
      ["design", "UI/UX дизайн"],
      ["motion", "Motion и интерактив"],
      ["other", "Другое"],
    ],
    brief: "О проекте",
    briefPlaceholder: "Что нужно запустить или улучшить?",
    timeline: "Сроки",
    timelines: [
      ["urgent", "Как можно скорее"],
      ["1-2-months", "1–2 месяца"],
      ["3-4-months", "3–4 месяца"],
      ["flexible", "Сроки гибкие"],
    ],
    name: "Ваше имя",
    company: "Компания",
    optional: "необязательно",
    contact: "Email или Telegram",
    contactPlaceholder: "name@company.com или @username",
    consent: "Отправляя форму, вы соглашаетесь, что мы используем эти данные для ответа.",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    successTitle: "Заявка отправлена.",
    successText: "Мы получили её в Telegram. Скоро свяжемся с вами.",
    done: "Готово",
    error: "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам на email.",
    validation: "Выберите тип проекта и сроки.",
  },
} as const;

const fieldClass =
  "focus-ring w-full rounded-none border border-white/15 bg-white/[0.035] px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 hover:border-white/25 focus:border-accent/60";

export function ProjectInquiryProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const { site } = useSiteContent();
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openProjectInquiry = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setStatus("idle");
    setProjectType("");
    setTimeline("");
    setOpen(true);
  }, []);

  const closeProjectInquiry = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const firstField = dialogRef.current?.querySelector<HTMLElement>(
        "input:not([type='hidden']), select, textarea, button",
      );
      firstField?.focus();
    }, 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProjectInquiry();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), a[href]",
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [closeProjectInquiry, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    try {
      const formData = new FormData(form);
      if (!projectType || !timeline) {
        setStatus("validation");
        return;
      }

      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          projectType: formData.get("projectType"),
          brief: formData.get("brief"),
          timeline: formData.get("timeline"),
          name: formData.get("name"),
          company: formData.get("company"),
          contact: formData.get("contact"),
          website: formData.get("website"),
        }),
      });

      if (!response.ok) throw new Error("Project inquiry delivery failed");

      form.reset();
      setProjectType("");
      setTimeline("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <ProjectInquiryContext.Provider value={{ openProjectInquiry }}>
      {children}

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label={t.close}
              className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeProjectInquiry}
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-inquiry-title"
              data-lenis-prevent
              className="bg-background/98 fixed inset-y-0 right-0 z-[90] flex w-full max-w-2xl flex-col overflow-hidden border-l border-white/15 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6 sm:px-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  OSONDEV / {t.eyebrow}
                </span>
                <button
                  type="button"
                  onClick={closeProjectInquiry}
                  aria-label={t.close}
                  className="focus-ring inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-10 sm:px-10 sm:py-12">
                {status === "success" ? (
                  <div className="flex min-h-full flex-col justify-center">
                    <div className="mb-8 flex size-12 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-400/10 text-emerald-300">
                      <Check className="size-5" aria-hidden />
                    </div>
                    <h2
                      id="project-inquiry-title"
                      className="text-4xl font-medium tracking-tight sm:text-5xl"
                    >
                      {t.successTitle}
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {t.successText}
                    </p>
                    <Button
                      type="button"
                      size="lg"
                      className="mt-10 w-fit rounded-none"
                      onClick={closeProjectInquiry}
                    >
                      {t.done}
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2
                      id="project-inquiry-title"
                      className="max-w-xl text-balance text-4xl font-medium tracking-tight sm:text-5xl"
                    >
                      {t.title}
                    </h2>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {t.intro}
                    </p>

                    <form className="mt-10 space-y-7" onSubmit={handleSubmit}>
                      <div className="absolute -left-[9999px]" aria-hidden="true">
                        <label htmlFor="project-website">Website</label>
                        <input
                          id="project-website"
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      <Field label={t.projectType} htmlFor="project-type">
                        <CustomSelect
                          id="project-type"
                          name="projectType"
                          value={projectType}
                          placeholder={t.choose}
                          options={t.projectTypes}
                          onValueChange={(value) => {
                            setProjectType(value);
                            if (status === "validation" && timeline) setStatus("idle");
                          }}
                          invalid={status === "validation" && !projectType}
                          errorId="project-select-error"
                        />
                      </Field>

                      <Field label={t.brief} htmlFor="project-brief">
                        <textarea
                          id="project-brief"
                          name="brief"
                          required
                          minLength={20}
                          maxLength={2000}
                          rows={5}
                          placeholder={t.briefPlaceholder}
                          className={`${fieldClass} resize-y`}
                        />
                      </Field>

                      <Field label={t.timeline} htmlFor="project-timeline">
                        <CustomSelect
                          id="project-timeline"
                          name="timeline"
                          value={timeline}
                          placeholder={t.choose}
                          options={t.timelines}
                          onValueChange={(value) => {
                            setTimeline(value);
                            if (status === "validation" && projectType) setStatus("idle");
                          }}
                          invalid={status === "validation" && !timeline}
                          errorId="project-select-error"
                        />
                      </Field>

                      <div className="grid gap-7 sm:grid-cols-2">
                        <Field label={t.name} htmlFor="project-name">
                          <input
                            id="project-name"
                            name="name"
                            required
                            maxLength={100}
                            autoComplete="name"
                            className={fieldClass}
                          />
                        </Field>

                        <Field label={`${t.company} (${t.optional})`} htmlFor="project-company">
                          <input
                            id="project-company"
                            name="company"
                            maxLength={100}
                            autoComplete="organization"
                            className={fieldClass}
                          />
                        </Field>
                      </div>

                      <Field label={t.contact} htmlFor="project-contact">
                        <input
                          id="project-contact"
                          name="contact"
                          required
                          minLength={3}
                          maxLength={160}
                          autoComplete="email"
                          placeholder={t.contactPlaceholder}
                          className={fieldClass}
                        />
                      </Field>

                      <div aria-live="polite">
                        {status === "validation" && (
                          <p id="project-select-error" className="mb-4 text-sm text-red-300">
                            {t.validation}
                          </p>
                        )}
                        {status === "error" && (
                          <p className="mb-4 text-sm text-red-300">
                            {t.error}{" "}
                            <a
                              className="underline underline-offset-4"
                              href={`mailto:${site.email}`}
                            >
                              {site.email}
                            </a>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col-reverse gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground/65">
                          {t.consent}
                        </p>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={status === "submitting"}
                          className="shrink-0 rounded-none"
                        >
                          {status === "submitting" ? t.submitting : t.submit}
                          {status !== "submitting" && <ArrowUpRight aria-hidden />}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ProjectInquiryContext.Provider>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2.5 block text-xs font-medium text-foreground/80">
        {label}
      </label>
      {children}
    </div>
  );
}

export function useProjectInquiry() {
  const context = useContext(ProjectInquiryContext);
  if (!context) throw new Error("useProjectInquiry must be used within ProjectInquiryProvider");
  return context;
}
