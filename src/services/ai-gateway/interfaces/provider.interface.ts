import { GatewayChatRequest, GatewayChatResponse } from "../types";

export interface IAIProvider {
  name: string;
  generateChatCompletion(request: GatewayChatRequest): Promise<GatewayChatResponse>;
  getHealth(): Promise<boolean>;
}
export default IAIProvider;
