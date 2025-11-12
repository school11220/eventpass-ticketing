declare module 'nodemailer' {
  interface TransportOptions {
    service?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }

  interface MailOptions {
    from?: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      cid?: string;
    }>;
  }

  interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<any>;
  }

  function createTransport(options: TransportOptions): Transporter;

  export { createTransport, TransportOptions, MailOptions, Transporter };
}
