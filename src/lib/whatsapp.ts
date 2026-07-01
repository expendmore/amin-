import axios from "axios";

export interface WhatsAppMessagePayload {
  messaging_product: "whatsapp";
  recipient_type?: "individual";
  to: string;
  type: "text" | "template" | "image" | "video" | "audio" | "document" | "interactive";
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: any[];
  };
  image?: { link: string; caption?: string } | { id: string; caption?: string };
  video?: { link: string; caption?: string } | { id: string; caption?: string };
  audio?: { link: string } | { id: string };
  document?: { link: string; caption?: string; filename?: string } | { id: string; caption?: string; filename?: string };
}

const META_GRAPH_VERSION = "v21.0";
const META_GRAPH_URL = "https://graph.facebook.com";

// Sends message payload to Meta Graph API
export async function sendMetaWhatsAppMessage(
  phoneNumberId: string,
  accessToken: string,
  payload: WhatsAppMessagePayload
) {
  const url = `${META_GRAPH_URL}/${META_GRAPH_VERSION}/${phoneNumberId}/messages`;
  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error(`[WhatsApp API Send Error]: ${errorMsg}`, error.response?.data);
    return { success: false, error: errorMsg };
  }
}

// Retrieves templates from Meta WhatsApp Business Account
export async function syncMetaWhatsAppTemplates(
  whatsAppBusinessAccountId: string,
  accessToken: string
) {
  const url = `${META_GRAPH_URL}/${META_GRAPH_VERSION}/${whatsAppBusinessAccountId}/message_templates`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return { success: true, templates: response.data.data };
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error(`[WhatsApp API Templates Sync Error]: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

// Registers phone number mapping parameters inside business manager profile
export async function registerMetaPhoneNumber(
  phoneNumberId: string,
  accessToken: string,
  pin: string
) {
  const url = `${META_GRAPH_URL}/${META_GRAPH_VERSION}/${phoneNumberId}/register`;
  try {
    const response = await axios.post(
      url,
      { messaging_product: "whatsapp", pin },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error(`[WhatsApp API Phone Registration Error]: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}
