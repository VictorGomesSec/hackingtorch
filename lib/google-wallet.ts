import { google } from 'googleapis';

interface TicketData {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: string;
  ticketId: string;
}

export class GoogleWalletService {
  private static instance: GoogleWalletService;
  private readonly serviceAccount: any;
  private readonly walletClient: any;

  private constructor() {
    // Inicializar credenciais do Google Wallet
    this.serviceAccount = {
      client_email: process.env.GOOGLE_WALLET_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_WALLET_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    this.walletClient = new google.auth.JWT(
      this.serviceAccount.client_email,
      undefined,
      this.serviceAccount.private_key,
      ['https://www.googleapis.com/auth/wallet_object.issuer']
    );
  }

  public static getInstance(): GoogleWalletService {
    if (!GoogleWalletService.instance) {
      GoogleWalletService.instance = new GoogleWalletService();
    }
    return GoogleWalletService.instance;
  }

  async createEventTicket(ticketData: TicketData) {
    try {
      const eventTicket = {
        id: `${ticketData.eventId}.${ticketData.ticketId}`,
        classId: `${ticketData.eventId}`,
        state: 'ACTIVE',
        eventName: {
          defaultValue: {
            language: 'pt-BR',
            value: ticketData.eventName,
          },
        },
        dateTime: {
          start: {
            date: ticketData.eventDate,
          },
        },
        location: {
          defaultValue: {
            language: 'pt-BR',
            value: ticketData.eventLocation,
          },
        },
        ticketHolderName: ticketData.attendeeName,
        ticketNumber: ticketData.ticketId,
        ticketType: {
          defaultValue: {
            language: 'pt-BR',
            value: ticketData.ticketType,
          },
        },
      };

      const response = await google.walletobjects('v1').eventticketobject.insert({
        auth: this.walletClient,
        requestBody: eventTicket,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar ingresso no Google Wallet:', error);
      throw new Error('Falha ao criar ingresso no Google Wallet');
    }
  }

  async getTicketClass(eventId: string) {
    try {
      const response = await google.walletobjects('v1').eventticketclass.get({
        auth: this.walletClient,
        resourceId: eventId,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar classe do ingresso:', error);
      throw new Error('Falha ao buscar classe do ingresso');
    }
  }

  async createTicketClass(eventData: {
    id: string;
    eventName: string;
    eventDescription: string;
    eventLocation: string;
    eventDate: string;
  }) {
    try {
      const eventTicketClass = {
        id: eventData.id,
        eventName: {
          defaultValue: {
            language: 'pt-BR',
            value: eventData.eventName,
          },
        },
        eventDescription: {
          defaultValue: {
            language: 'pt-BR',
            value: eventData.eventDescription,
          },
        },
        location: {
          defaultValue: {
            language: 'pt-BR',
            value: eventData.eventLocation,
          },
        },
        dateTime: {
          start: eventData.eventDate,
        },
        reviewStatus: 'UNDER_REVIEW',
      };

      const response = await google.walletobjects('v1').eventticketclass.insert({
        requestBody: eventTicketClass,
        auth: this.walletClient,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar classe do ingresso:', error);
      throw new Error('Falha ao criar classe do ingresso');
    }
  }
}
