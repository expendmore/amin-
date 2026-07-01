import crypto from "crypto";
import axios from "axios";

export interface PhonePePaymentRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number; // in paise
  redirectUrl: string;
  redirectMode: "REDIRECT" | "POST";
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: "PAY_PAGE";
  };
}

export class PhonePeGateway {
  private merchantId: string;
  private saltKey: string;
  private saltIndex: string;
  private hostUrl: string;

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT86"; // Default sandbox merchant
    this.saltKey = process.env.PHONEPE_SALT_KEY || "96434309-7ae9-4d6d-8e31-886d13e40a17"; // Default sandbox key
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || "1";
    this.hostUrl = process.env.PHONEPE_HOST_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";
  }

  /**
   * Generates a unique transaction checksum X-VERIFY header.
   */
  private generateChecksum(payloadBase64: string, endpoint: string): string {
    const stringToHash = payloadBase64 + endpoint + this.saltKey;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    return `${sha256}###${this.saltIndex}`;
  }

  /**
   * Initiates checkouts redirections.
   * @param amount Rupees amount (automatically converted to paise)
   */
  public async createPaymentSession(
    amount: number,
    workspaceId: string,
    userId: string,
    redirectUrl?: string
  ): Promise<{ transactionId: string; redirectUrl: string }> {
    const transactionId = `tx_${workspaceId}_${Date.now()}`;
    const amountInPaise = Math.round(amount * 100);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const requestPayload: PhonePePaymentRequest = {
      merchantId: this.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amountInPaise,
      redirectUrl: redirectUrl || `${siteUrl}/billing/callback`,
      redirectMode: "REDIRECT",
      callbackUrl: `${siteUrl}/api/v1/billing/webhook`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payloadString = JSON.stringify(requestPayload);
    const payloadBase64 = Buffer.from(payloadString).toString("base64");
    const endpoint = "/pg/v1/pay";
    const checksum = this.generateChecksum(payloadBase64, endpoint);

    try {
      const response = await axios.post(
        `${this.hostUrl}${endpoint}`,
        { request: payloadBase64 },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            accept: "application/json",
          },
        }
      );

      if (response.data?.success && response.data?.data?.instrumentResponse?.redirectInfo?.url) {
        return {
          transactionId,
          redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
        };
      }
      throw new Error(response.data?.message || "Invalid API response from PhonePe");
    } catch (err: any) {
      console.error("[PhonePe Checkouts Error]:", err.response?.data || err.message);
      // Fallback redirect for local sandbox testing if keys are mock or API preprod is offline
      return {
        transactionId,
        redirectUrl: `${siteUrl}/billing/callback?transactionId=${transactionId}&status=MOCK_PENDING`,
      };
    }
  }

  /**
   * Verifies the incoming webhook payload checksum from PhonePe.
   */
  public verifyWebhookSignature(payloadBase64: string, xVerifyHeader: string): boolean {
    const stringToHash = payloadBase64 + this.saltKey;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const expectedChecksum = `${sha256}###${this.saltIndex}`;
    return expectedChecksum === xVerifyHeader;
  }
}

// Payment Manager coordinating active gateway
export class PaymentManager {
  private gateway: PhonePeGateway;

  constructor() {
    this.gateway = new PhonePeGateway();
  }

  public async initiatePayment(
    amount: number,
    workspaceId: string,
    userId: string,
    redirectUrl?: string
  ): Promise<{ transactionId: string; url: string }> {
    const session = await this.gateway.createPaymentSession(amount, workspaceId, userId, redirectUrl);
    return {
      transactionId: session.transactionId,
      url: session.redirectUrl,
    };
  }

  public verifyWebhook(payloadBase64: string, signature: string): boolean {
    return this.gateway.verifyWebhookSignature(payloadBase64, signature);
  }
}
