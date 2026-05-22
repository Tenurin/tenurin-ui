'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';

import { authFooterLinkClassName } from '../../components/ui/auth-form';
import { AlertSurface } from '../../components/ui/alert-surface';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import InlineFieldError from '../../components/ui/inline-field-error';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  helpRequestSchema,
  type HelpRequestFormData,
} from './schema';

export type HelpRequestDialogTemplateProps = Readonly<{
  guideUrl: string;
  trigger?: ReactNode;
  onSubmit: (data: HelpRequestFormData) => Promise<void>;
  onSuccess?: () => void;
}>;

/**
 * Shared Help modal for dashboard apps. Apps wire API calls via `onSubmit`.
 */
export function HelpRequestDialogTemplate({
  guideUrl,
  trigger,
  onSubmit,
  onSuccess,
}: HelpRequestDialogTemplateProps) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRaisingRequest, setIsRaisingRequest] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HelpRequestFormData>({
    resolver: zodResolver(helpRequestSchema),
  });

  const handleFormSubmit = async (data: HelpRequestFormData) => {
    setErrorMessage(null);
    setIsRaisingRequest(true);

    try {
      await onSubmit(data);
      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Request failed:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Try again.';
      setErrorMessage(message);
    } finally {
      setIsRaisingRequest(false);
    }
  };

  const isSubmitDisabled = isRaisingRequest || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="gap-6 sm:max-w-lg">
        <DialogHeader className="gap-3 pr-8">
          <DialogTitle>Help</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Raise a request regarding features, options or issues. Check the{' '}
            <a
              href={guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={authFooterLinkClassName}
            >
              guide
            </a>{' '}
            first for how-to articles and common answers.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {errorMessage ? (
            <AlertSurface tone="negative">{errorMessage}</AlertSurface>
          ) : null}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="help-request-subject">Subject</Label>
              <Input
                id="help-request-subject"
                type="text"
                className="cursor-text"
                {...register('subject')}
              />
              <InlineFieldError message={errors.subject?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="help-request-description">Description</Label>
              <Textarea
                id="help-request-description"
                className="min-h-28 cursor-text"
                {...register('description')}
              />
              <InlineFieldError message={errors.description?.message} />
            </div>
          </div>
          <DialogFooter className="pt-1">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitDisabled}
            >
              {isRaisingRequest ? 'Raising request...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
