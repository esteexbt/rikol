export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  archived: boolean;
  share_token: string | null;
};
