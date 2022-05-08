import { ArrowLeft } from "phosphor-react";
import { FormEvent, useState } from "react";

import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../server/api";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../Loading";
import { ScreenshotButton } from "../ScreenshotButton";

type FeedbackContentStepProps = {
  feedbackType: FeedbackType;
  onFeedbackRestartRequest: () => void;
  onFeedbackSent: () => void;
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequest,
  onFeedbackSent
}: FeedbackContentStepProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault();

    // console.log({ screenshot, comment });
    setIsSendingFeedback(true);
    await api.post("/feedbacks", {
      type: feedbackType,
      comment,
      screenshot,
    });

    setIsSendingFeedback(false);
    onFeedbackSent();
  }

  return (
    <>
      <header>
        <button
          onClick={onFeedbackRestartRequest}
          type="button"
          className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </button>
        <span className="flex items-center gap-2 text-xl leading-6">
          <img
            className="w-6 h-6"
            src={feedbackTypeInfo.image.source}
            alt={feedbackTypeInfo.image.alt}
          />
          {feedbackTypeInfo.title}
        </span>

        <CloseButton />
      </header>

      <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
        <textarea
          className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none resize-none  scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
          placeholder="Conte com detalhes o que está acontecendo..."
          onChange={(event) => setComment(event.target.value)}
        />

        <footer className="flex gap-2 mt-2">
          <ScreenshotButton
            screenshot={screenshot}
            onScreenshotTook={setScreenshot}
          />
          <button
            type="submit"
            disabled={comment.length === 0 || isSendingFeedback}
            className="flex-1 flex items-center justify-center p-2 bg-brand-500 rounded-md border-transparent text-sm hover:bg-brand-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 disabled:opacity-50 disabled:hover:bg-brand-500"
          >
            {isSendingFeedback ? <Loading /> : "Enviar feedback"}
          </button>
        </footer>
      </form>
    </>
  );
}