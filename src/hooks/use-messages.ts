import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, orderBy, getDocs, doc, setDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useWorkspace } from "@/store/use-workspace";
import { Message } from "@/types";

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [] as Message[];

      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => {
        const m = docSnap.data();
        return {
          id: docSnap.id,
          conversationId: m.conversationId,
          role: m.role,
          content: m.content || m.content?.text || "",
          tokenCount: m.tokenCount || 0,
          status: m.status || "sent",
          metadata: m.metadata || null,
          isDraft: m.isDraft || false,
          createdAt: m.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Message;
      });

      return data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useWorkspace();

  return useMutation({
    mutationFn: async (payload: {
      conversationId: string;
      content: string;
      modelName: string;
    }) => {
      const { conversationId, content, modelName } = payload;
      const workspaceId = activeWorkspaceId || "system_workspace";

      // 1. Insert User Message into Firestore
      const messagesRef = collection(db, "messages");
      const userMsgRef = await addDoc(messagesRef, {
        conversationId,
        workspaceId,
        role: "user",
        content,
        status: "sent",
        createdAt: serverTimestamp(),
      });

      // Invalidate queries so User message displays immediately
      await queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

      // 2. Insert Assistant Placeholder message with status = 'sending'
      const assistantMsgRef = await addDoc(messagesRef, {
        conversationId,
        workspaceId,
        role: "assistant",
        content: "Thinking...",
        status: "sending",
        metadata: { model_name: modelName },
        createdAt: serverTimestamp(),
      });

      // Invalidate queries so loader state shows up
      await queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });

      return { 
        userMessageId: userMsgRef.id, 
        assistantMessageId: assistantMsgRef.id 
      };
    },
  });
}
