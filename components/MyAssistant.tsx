"use client";

import { useRef } from "react";
import {
  Thread,
  ThreadWelcome,
  Composer,
  type ThreadConfig,
} from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { makeMarkdownText } from "@assistant-ui/react-markdown";

import { createThread, getThreadState, sendMessage } from "@/lib/chatApi";

const MarkdownText = makeMarkdownText();

export function MyAssistant() {
  const threadIdRef = useRef<string | undefined>(undefined);
  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages, { command }) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
      }
      const threadId = threadIdRef.current;
      return sendMessage({
        threadId,
        messages,
        command,
      });
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return { messages: state.values.messages };
    },
  });

  return (
    <Thread.Root
      className="mx-auto max-w-2xl mt-10"
      config={{
        runtime: runtime,
        assistantMessage: { components: { Text: MarkdownText } },
      }}
    >
      <Thread.Viewport>
        <Thread.Messages />
        <Thread.FollowupSuggestions />
      </Thread.Viewport>
      <Thread.ViewportFooter>
        <Thread.ScrollToBottom />
        <Composer />
      </Thread.ViewportFooter>
    </Thread.Root>
  );
}

