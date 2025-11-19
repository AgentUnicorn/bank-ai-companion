import {welcomeAgent} from "./welcomeAgent";
import {promotionAgent} from "./promotionAgent";
import {bankOperationsAgent} from "./bankingOperationsAgent";

(welcomeAgent.handoffs as any).push(promotionAgent, bankOperationsAgent);
(promotionAgent.handoffs as any).push(welcomeAgent, bankOperationsAgent);
(bankOperationsAgent.handoffs as any).push(welcomeAgent, promotionAgent);

export const initialAgent = bankOperationsAgent

